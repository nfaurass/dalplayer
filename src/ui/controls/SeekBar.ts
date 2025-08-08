export default function SeekBarControl(): HTMLDivElement {
    const seekBar = document.createElement('div');
    seekBar.id = 'seekBar';
    seekBar.style.position = 'absolute';
    seekBar.style.bottom = '50px';
    seekBar.style.left = '50%';
    seekBar.style.transform = 'translateX(-50%)';
    seekBar.style.width = '95%';
    seekBar.style.height = '10px';
    seekBar.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    seekBar.style.cursor = 'pointer';
    seekBar.style.zIndex = '2';
    seekBar.style.userSelect = 'none';

    const progressFill = document.createElement('div');
    progressFill.style.position = 'absolute';
    progressFill.style.left = '0';
    progressFill.style.top = '0';
    progressFill.style.height = '100%';
    progressFill.style.width = '0%';
    progressFill.style.backgroundColor = 'red';
    seekBar.appendChild(progressFill);

    const thumb = document.createElement('div');
    thumb.style.position = 'absolute';
    thumb.style.top = '-5px';
    thumb.style.left = '0%';
    thumb.style.width = '20px';
    thumb.style.height = '20px';
    thumb.style.backgroundColor = 'red';
    thumb.style.border = '2px solid red';
    thumb.style.borderRadius = '50%';
    thumb.style.cursor = 'pointer';
    thumb.style.zIndex = '3';
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