export interface DALPlayerOptions {
    parent: HTMLElement | string;
    source?: string;
    autoplay?: boolean;
    controls?: boolean;
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
        this.video.controls = options.controls ?? false;

        if (options.autoplay) {
            this.video.muted = true;
            this.video.play().catch(err => {
                console.warn('Autoplay failed:', err);
            });
        }

        this.video.style.width = '100%';
        this.container.appendChild(this.video);

        if (options.source) this.setSource(options.source);
    }

    public setSource(src: string): void {
        this.video.src = src;
        this.video.load();
    }

    public setVolume(value: number): void {
        this.video.volume = Math.max(0, Math.min(1, value));
    }

    public setSeekPosition(percentage: number): void {
        const clamped = Math.max(0, Math.min(100, percentage));
        if (!isNaN(this.video.duration)) this.video.currentTime = (this.video.duration * clamped) / 100;
    }

    public setMuted(muted: boolean): void {
        this.video.muted = muted;
    }

    public setPlaybackRate(rate: number): void {
        this.video.playbackRate = rate;
    }

    public setLoop(loop: boolean): void {
        this.video.loop = loop;
    }

    public getCurrentTime(): number {
        return this.video.currentTime;
    }

    public getDuration(): number {
        return isNaN(this.video.duration) ? 0 : this.video.duration;
    }

    public getVolume(): number {
        return this.video.volume;
    }

    public getSeekPosition(): number {
        return this.video.duration > 0 ? (this.video.currentTime / this.video.duration) * 100 : 0;
    }

    public getPlaybackRate(): number {
        return this.video.playbackRate;
    }

    public isMuted(): boolean {
        return this.video.muted;
    }

    public isPaused(): boolean {
        return this.video.paused;
    }

    public isPlaying(): boolean {
        return !this.video.paused && !this.video.ended && this.video.readyState > 2;
    }

    public isFullscreen(): boolean {
        return document.fullscreenElement === this.video;
    }

    public isLooping(): boolean {
        return this.video.loop;
    }

    public play(): void {
        this.video.play();
    }

    public pause(): void {
        this.video.pause();
    }

    public togglePlayPause(): void {
        this.video.paused ? this.video.play() : this.video.pause();
    }

    public enterFullscreen(): void {
        if (this.video.requestFullscreen) this.video.requestFullscreen();
    }

    public exitFullscreen(): void {
        if (document.fullscreenElement) document.exitFullscreen();
    }

    public destroy(): void {
        this.video.pause();
        this.video.src = '';
        this.video.load();
        this.video.remove();
    }
}