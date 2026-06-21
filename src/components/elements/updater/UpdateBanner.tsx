import {
	bannerNoteSections,
	bannerProgressPct,
	bannerTitle,
	isBannerBusy,
	isBannerShown
} from '@/components/elements/updater/update-banner.util'
import type { UpdaterState } from '@/composables/create-updater'
import { cn } from '@/utils/cn.util'
import {
	IconDownload,
	IconSparkles,
	IconTool,
	IconX,
	type IconProps
} from '@tabler/icons-solidjs'
import { For, Show, type Component } from 'solid-js'

interface IUpdateBannerProps {
	state: UpdaterState
	onInstall: () => void
	onDismiss: () => void
}

/** Startup toast: shows the new version, what's new (release notes from
 *  GitHub), and an install button. Downloading shows progress, then the
 *  app relaunches on the new version. */
export function UpdateBanner(props: IUpdateBannerProps) {
	const noteSections = () => bannerNoteSections(props.state)

	return (
		<Show when={isBannerShown(props.state)}>
			<div
				class={cn(
					'tinta-menu-surface fixed bottom-5 right-5 z-50 w-[25rem]',
					'overflow-hidden rounded-xl border p-4 text-text-primary',
					'shadow-2xl backdrop-blur'
				)}
			>
				<div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-soft/50" />

				<div class="flex items-start gap-3.5">
					<div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-active-border bg-bg-selected text-accent-soft">
						<IconDownload
							size={18}
							stroke-width={1.75}
						/>
					</div>

					<div class="min-w-0 flex-1">
						<p class="text-base font-semibold leading-6 text-text-primary">
							{bannerTitle(props.state)}
						</p>
						<p class="mt-1 max-w-[20rem] text-sm leading-6 text-text-muted">
							A quieter writing flow, stronger local reliability, and cleaner
							long-form drafting.
						</p>

						<Show when={noteSections().length > 0}>
							<div class="mt-4 max-h-48 space-y-3 overflow-y-auto pr-1">
								<For each={noteSections()}>
									{section => {
										const SectionIcon = noteSectionIcon(section.title)

										return (
											<section>
												<h3 class="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-accent-soft">
													<SectionIcon
														size={20}
														stroke-width={1.9}
													/>
													<span>{section.title}</span>
												</h3>
												<ul class="mt-2 space-y-2">
													<For each={section.items}>
														{item => (
															<li class="flex gap-2.5 text-sm leading-6 text-text-secondary">
																<span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft/80" />
																<span>{item}</span>
															</li>
														)}
													</For>
												</ul>
											</section>
										)
									}}
								</For>
							</div>
						</Show>

						<Show when={props.state.status === 'downloading'}>
							<div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-selected">
								<div
									class="h-full rounded-full bg-accent transition-all"
									style={{ width: `${bannerProgressPct(props.state)}%` }}
								/>
							</div>
						</Show>

						<Show when={props.state.status === 'available'}>
							<div class="mt-4 flex items-center gap-2">
								<button
									type="button"
									onClick={() => props.onInstall()}
									class="tinta-action rounded-lg border border-accent-soft/40 bg-accent-soft/20 px-4 py-2 text-sm font-semibold text-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
								>
									Install update
								</button>
								<button
									type="button"
									onClick={() => props.onDismiss()}
									class="tinta-text-action rounded-lg px-3 py-2 text-sm font-medium text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
								>
									Later
								</button>
							</div>
						</Show>
					</div>

					<Show when={!isBannerBusy(props.state)}>
						<button
							type="button"
							onClick={() => props.onDismiss()}
							aria-label="Dismiss"
							class="tinta-text-action rounded-md p-1 text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
						>
							<IconX
								size={18}
								stroke-width={1.75}
							/>
						</button>
					</Show>
				</div>
			</div>
		</Show>
	)
}

function noteSectionIcon(title: string): Component<IconProps> {
	if (title.toLowerCase().includes('stability')) {
		return IconTool
	}

	return IconSparkles
}
