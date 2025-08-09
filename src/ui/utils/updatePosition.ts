export function updatePosition(clientX: number, seekBar: HTMLDivElement) {
    const rect = seekBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (pos / rect.width) * 100;
    (seekBar as any).setProgress(percent);
    seekBar.dispatchEvent(new CustomEvent('seek', {detail: percent}));
}