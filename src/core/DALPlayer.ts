export interface DALPlayerOptions {
    parent: HTMLElement | string;
    source?: string;
    autoplay?: boolean;
}

export class DALPlayer {
    private readonly container: HTMLElement;
    private readonly video: HTMLVideoElement;

    constructor(options: DALPlayerOptions) {

        this.container = typeof options.parent === 'string' ? document.getElementById(options.parent)! : options.parent;
        if (!this.container) {
            throw new Error('DALPlayer parent element not found');
        }

        this.video = document.createElement('video');
        this.video.controls = false;
        this.video.autoplay = options.autoplay ?? false;
        this.video.style.width = '100%';

        this.container.appendChild(this.video);

        if (options.source) this.load(options.source);
    }

    load(src: string) {
        this.video.src = src;
        this.video.load();
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }
}