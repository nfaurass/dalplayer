export default function SeekBarControl(): HTMLDivElement {
    const seekBar = document.createElement('div');
    seekBar.id = 'seekBar';
    seekBar.classList.add('DALPlayer-seekbar');

    const bufferedFill = document.createElement('div');
    bufferedFill.classList.add('DALPlayer-buffered-fill');

    const progressFill = document.createElement('div');
    progressFill.classList.add('DALPlayer-progress-fill');

    const thumb = document.createElement('div');
    thumb.classList.add('DALPlayer-thumb');

    seekBar.append(bufferedFill, progressFill, thumb);

    (seekBar as any).setProgress = (percent: number) => {
        percent = Math.max(0, Math.min(100, percent));
        progressFill.style.width = `${percent}%`;
        thumb.style.left = `${percent}%`;
    };

    (seekBar as any).setBuffered = (percent: number) => {
        percent = Math.max(0, Math.min(100, percent));
        bufferedFill.style.width = `${percent}%`;
    };

    return seekBar;
}