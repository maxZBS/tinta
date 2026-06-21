import {
	aboutUpdateStatus,
	isAboutUpdateBusy
} from '@/pages/about-update.util'
import { createAppVersion } from '@/composables/create-app-version'
import { createTilt } from '@/composables/create-tilt'
import { useLayout } from '@/composables/layout-context'
import { ABOUT } from '@/lib/about.const'
import { openUrl } from '@tauri-apps/plugin-opener'
import { IconRefresh } from '@tabler/icons-solidjs'
import { Show } from 'solid-js'

export function AboutPage() {
	const version = createAppVersion()
	const tilt = createTilt()
	const layout = useLayout()

	const updateStatus = () => aboutUpdateStatus(layout.updaterState())
	const isChecking = () => isAboutUpdateBusy(layout.updaterState())

	return (
		<section class="flex h-full flex-1 items-center justify-center overflow-y-auto bg-bg-view px-8 py-8 text-text-primary">
			<div class="flex w-full max-w-2xl flex-col items-center text-center">
				<img
					ref={tilt.setRef}
					src={ABOUT.logoSrc}
					alt={`${ABOUT.name} logo`}
					width={150}
					height={150}
					style={tilt.style()}
					class="h-36 w-36 rounded-3xl shadow-md"
				/>

				<h1 class="mt-6 text-3xl font-semibold">{ABOUT.name}</h1>

				<p class="mt-1.5 text-base text-text-muted">
					<Show
						when={version()}
						fallback="—"
					>
						Version {version()}
					</Show>
				</p>

				<button
					type="button"
					disabled={isChecking()}
					onClick={() => layout.checkForUpdate()}
					class="tinta-action mt-4 flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60"
				>
					<IconRefresh
						size={16}
						stroke-width={1.75}
						class={isChecking() ? 'animate-spin' : undefined}
					/>
					Check for updates
				</button>

				<Show when={updateStatus()}>
					<p class="mt-2 text-sm text-text-muted">{updateStatus()}</p>
				</Show>

				<p class="mt-6 leading-relaxed text-text-secondary">{ABOUT.tagline}</p>

				<div class="mt-8 border-t border-border pt-6">
					<p class="text-base text-text-secondary">Made by {ABOUT.author}</p>
					<p class="mt-1 text-base font-medium">
						<button
							type="button"
							onClick={() => openUrl(ABOUT.redGroupUrl)}
							class="text-accent-soft transition-colors hover:underline"
						>
							{ABOUT.redGroupLabel}
						</button>
						<span class="text-text-muted"> × </span>
						<button
							type="button"
							onClick={() => openUrl(ABOUT.siteUrl)}
							class="text-accent-soft transition-colors hover:underline"
						>
							{ABOUT.siteLabel}
						</button>
					</p>
				</div>
			</div>
		</section>
	)
}
