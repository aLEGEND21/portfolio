"use client";

// iOS-only gate: DeviceOrientationEvent.requestPermission() must be called
// from a user gesture, so the tilt effect starts behind this tap target.
export function TiltPermissionPrompt({
  onEnable,
}: {
  onEnable: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={onEnable}
      className="rounded-full border border-[var(--frost)]/25 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--frost)]/70 transition-colors hover:border-[var(--frost)]/50 hover:text-[var(--frost)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sky)]"
    >
      Enable tilt
    </button>
  );
}
