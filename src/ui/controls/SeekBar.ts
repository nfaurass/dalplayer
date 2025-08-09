export default function SeekBarControl(): HTMLDivElement {
    const seekBar = document.createElement('div');
    seekBar.id = 'seekBar';
    Object.assign(seekBar.style, {
        position: 'relative',
        width: '100%',
        height: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        userSelect: 'none',
        borderRadius: '5px',
        boxSizing: 'border-box',
        zIndex: '2'
    });

    const progressFill = document.createElement('div');
    Object.assign(progressFill.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        width: '0%',
        backgroundColor: 'white',
        transition: 'width 0s linear'
    });

    const thumb = document.createElement('div');
    Object.assign(thumb.style, {
        position: 'absolute',
        top: '-2.5px',
        left: '0px',
        width: '10px',
        height: '10px',
        backgroundColor: 'white',
        border: '2px solid white',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '3',
    });

    seekBar.append(progressFill, thumb);

    (seekBar as any).setProgress = (percent: number) => {
        percent = Math.max(0, Math.min(100, percent));
        progressFill.style.width = `${percent}%`;
        thumb.style.left = `${percent}%`;
    };

    return seekBar;
}