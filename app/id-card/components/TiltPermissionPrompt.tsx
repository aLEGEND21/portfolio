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
      className="rounded-full border border-[var(--cream)]/25 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--cream)]/70 transition-colors hover:border-[var(--cream)]/50 hover:text-[var(--cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amber)]"
    >
      Enable tilt
    </button>
  );
}
