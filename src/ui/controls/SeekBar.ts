export default function SeekBarControl(): HTMLDivElement {
    const seekBar = document.createElement('div');
    seekBar.id = 'seekBar';
    Object.assign(seekBar.style, {
        position: 'relative',
        width: '100%',
        height: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        userSelect: 'none',
        borderRadius: '5px',
        overflow: 'hidden',
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
        backgroundColor: 'red',
        transition: 'width 0.1s linear'
    });
    seekBar.appendChild(progressFill);

    const thumb = document.createElement('div');
    Object.assign(thumb.style, {
        position: 'absolute',
        top: '-5px',
        left: '0%',
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        border: '2px solid red',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '3',
        transition: 'left 0.1s linear',
        boxSizing: 'border-box'
    });
    seekBar.appendChild(thumb);

    let isDragging = false;

    function updatePosition(clientX: number) {
        const rect = seekBar.getBoundingClientRect();
        let pos = clientX - rect.left;
        pos = Math.max(0, Math.min(pos, rect.width));
        const percent = (pos / rect.width) * 100;
        progressFill.style.width = `${percent}%`;
        thumb.style.left = `calc(${percent}% - 10px)`;
        const event = new CustomEvent('seek', {detail: percent});
        seekBar.dispatchEvent(event);
    }

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) updatePosition(e.clientX);
    });

    seekBar.addEventListener('click', (e) => {
        updatePosition(e.clientX);
    });

    thumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    }, {passive: false});

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length > 0) updatePosition(e.touches[0].clientX);
    }, {passive: false});

    (seekBar as any).setProgress = (percent: number) => {
        percent = Math.max(0, Math.min(100, percent));
        progressFill.style.width = `${percent}%`;
        thumb.style.left = `calc(${percent}% - 10px)`;
    };

    return seekBar;
}