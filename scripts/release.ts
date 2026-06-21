/**
 * One-shot release with two-part versions (X.Y — no third number).
 *
 *   bun run release         # 0.1 -> 0.2   the everyday release
 *   bun run release:major   # 0.9 -> 1.0   big milestone / breaking
 *   bun run release 1.4     # explicit version (X.Y)
 *
 * Versions and git tags are two-part (v0.1, v0.2, v1.0). Tauri and Cargo
 * require a full semver, so on disk they store X.Y.0 — but you never deal
 * with that third number; the commands and tags stay two-part.
 *
 * What this does, in order:
 *   1. safety checks (on main, clean tree, tag free)
 *   2. bump version, commit, PUSH the commit
 *   3. tag + push the tag -> GitHub builds all three OSes (macOS, Windows,
 *      Linux) into a draft release and signs the updater artifacts
 *
 * All three platforms build on CI so the updater .sig is generated the same
 * way everywhere (via the TAURI_SIGNING_PRIVATE_KEY secret). See
 * .github/workflows/release.yml.
 *
 * Why push the commit before tagging: the tag is the point of no return — it
 * triggers the CI build. We push the commit FIRST and only create + push the
 * tag once that succeeded. If the network drops mid-way, the version isn't
 * "spent": the commit stays local, no tag exists, and re-running just retries.
 */

import { $ } from 'bun'

const ROOT = new URL('..', import.meta.url).pathname

const PKG = `${ROOT}package.json`
const TAURI_CONF = `${ROOT}src-tauri/tauri.conf.json`
// Cargo.toml is intentionally NOT bumped — it stays at 0.0.0 so the version
// never lands in Cargo.lock and never busts the Rust build cache. The app
// version is read from tauri.conf.json at runtime.

const arg = process.argv[2] ?? 'minor'

// --- Safety checks: never release from a messy or wrong-branch state. ---

const branch = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim()

if (branch !== 'main') {
	fail(`You are on "${branch}", not "main". Releases are cut from main.`)
}

const dirty = (await $`git status --porcelain`.text()).trim()

if (dirty) {
	fail('Working tree is dirty. Commit or stash your changes first.')
}

// --- Work out the next two-part version. ---

const pkg = await Bun.file(PKG).json()
const current: string = pkg.version
const version = nextVersion(current, arg)
const tag = `v${version}`

// Tauri / Cargo need a full semver; keep the patch slot at 0 on disk.
const semver = `${version}.0`

const existingTags = (await $`git tag --list ${tag}`.text()).trim()

if (existingTags) {
	fail(`Tag ${tag} already exists. Pick another version.`)
}

// --- Write the new version. Only package.json and tauri.conf.json — never
//     Cargo.toml (it stays at 0.0.0 to keep Cargo.lock and the cache stable). ---

pkg.version = version
await Bun.write(PKG, JSON.stringify(pkg, null, 2) + '\n')

const conf = await Bun.file(TAURI_CONF).text()
await Bun.write(TAURI_CONF, conf.replace(/("version":\s*")[^"]+(")/, `$1${semver}$2`))

console.log(`Bumped ${current} -> ${version}`)

// --- Commit. ---

await $`git add ${PKG} ${TAURI_CONF}`.nothrow()
await $`git commit -m ${`chore: release ${tag}`}`

// --- Push the commit BEFORE tagging. This is the fragile network step. ---

console.log('\nPushing commit to origin/main…')

const pushedCommit = await $`git push origin main`.nothrow()

if (pushedCommit.exitCode !== 0) {
	console.error('\nPush failed — the network dropped before anything was released.')
	console.error('Nothing is half-done: no tag was created, the build did NOT start.')
	console.error('\nFix your connection and just run the same command again, or undo the')
	console.error('version commit with:\n')
	console.error('  git reset --hard HEAD~1\n')
	process.exit(1)
}

// --- Commit is safely on origin. Now tag and push the tag to trigger CI. ---

console.log('Commit pushed. Tagging and pushing the tag…')

await $`git tag ${tag}`

const pushedTag = await $`git push origin ${tag}`.nothrow()

if (pushedTag.exitCode !== 0) {
	console.error(`\nThe commit is on origin, but pushing tag ${tag} failed.`)
	console.error('Just push the tag again to start the build:\n')
	console.error(`  git push origin ${tag}\n`)
	process.exit(1)
}

console.log(`\nReleased ${tag}. The GitHub build is starting now.`)
console.log('It builds macOS, Windows and Linux into a draft release.')
console.log('Watch it here: https://github.com/maxZBS/tinta/actions')
console.log('When the build finishes, publish the draft release on GitHub.')

// --- helpers ---

/** Versions are two-part (X.Y). "minor" bumps Y, "major" bumps X. An explicit
 *  "X.Y" sets it directly. A "X.Y.Z" is accepted but its patch slot dropped. */
function nextVersion(curr: string, bump: string): string {
	const explicit = bump.match(/^(\d+)\.(\d+)(?:\.\d+)?$/)

	if (explicit) {
		return `${explicit[1]}.${explicit[2]}`
	}

	const [major, minor] = curr.split('.').map(Number)

	if (bump === 'major') {
		return `${major + 1}.0`
	}

	if (bump === 'minor') {
		return `${major}.${minor + 1}`
	}

	return fail(`Unknown bump: "${bump}". Use minor | major | X.Y`)
}

function fail(message: string): never {
	console.error(message)
	process.exit(1)
}
