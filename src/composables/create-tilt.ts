import { createSignal, onCleanup, onMount, type JSX } from 'solid-js'

interface ITiltOptions {
	/** Max rotation in degrees at the edges. Higher = more dramatic. */
	maxDeg?: number
	/** Lift toward the viewer, in px. */
	liftPx?: number
	/** Distance (px) from the logo center at which the tilt reaches maxDeg. */
	reachPx?: number
	/** Easing factor per frame (0–1). Lower = smoother/slower follow. */
	ease?: number
}

/** Page-wide 3D tilt for a single element: the logo follows the cursor even
 *  when it's outside the image, rotating toward wherever the pointer is on the
 *  page. The angle is eased toward the target every animation frame (not via
 *  CSS transitions), so fast pointer movement stays smooth instead of jerking
 *  and snapping. Returns a ref to attach to the target and a transform style. */
export function createTilt(options: ITiltOptions = {}) {
	const maxDeg = options.maxDeg ?? 18
	const liftPx = options.liftPx ?? 16
	const reachPx = options.reachPx ?? 385
	const ease = options.ease ?? 0.12

	const [rotateX, setRotateX] = createSignal(0)
	const [rotateY, setRotateY] = createSignal(0)

	let el: HTMLElement | undefined
	let frame = 0

	// Target angles the cursor implies; the rendered angles ease toward these.
	let targetX = 0
	let targetY = 0

	function onPointerMove(event: PointerEvent) {
		if (!el) {
			return
		}

		const rect = el.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2

		// Cursor offset from the logo center, clamped to [-1, 1] over `reachPx`.
		const dx = clamp((event.clientX - centerX) / reachPx, -1, 1)
		const dy = clamp((event.clientY - centerY) / reachPx, -1, 1)

		// Moving right tilts toward the cursor; moving down tilts the top back.
		targetY = dx * maxDeg
		targetX = -dy * maxDeg
	}

	function tick() {
		// Ease the current angle a fraction of the way to the target each frame.
		const nextX = rotateX() + (targetX - rotateX()) * ease
		const nextY = rotateY() + (targetY - rotateY()) * ease

		setRotateX(snap(nextX, targetX))
		setRotateY(snap(nextY, targetY))

		frame = requestAnimationFrame(tick)
	}

	onMount(() => {
		window.addEventListener('pointermove', onPointerMove, { passive: true })
		frame = requestAnimationFrame(tick)
	})

	onCleanup(() => {
		window.removeEventListener('pointermove', onPointerMove)
		cancelAnimationFrame(frame)
	})

	const setRef = (node: HTMLElement) => {
		el = node
	}

	const style = (): JSX.CSSProperties => ({
		transform: `perspective(700px) rotateX(${rotateX()}deg) rotateY(${rotateY()}deg) translateZ(${liftPx}px)`,
		'transform-style': 'preserve-3d',
		'will-change': 'transform'
	})

	return { setRef, style }
}

/** Settle exactly onto the target once close enough, to avoid endless tiny
 *  sub-pixel updates that never quite arrive. */
function snap(value: number, target: number): number {
	if (Math.abs(target - value) < 0.01) {
		return target
	}

	return value
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}
