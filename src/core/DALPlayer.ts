import {BaseUI} from "../ui/BaseUI";

type Listener = (...args: any[]) => void;

type DALPlayerUIOptions = "Base" | "V1";

export interface DALPlayerOptions {
    parent: HTMLElement | string;
    source?: string;
    autoplay?: boolean;
    controls?: boolean;
    ui?: DALPlayerUIOptions;
    captions?: { src: string, label?: string, lang?: string } | { src: string, label?: string, lang?: string }[];
}

export class DALPlayer {
    private readonly container: HTMLElement;
    private readonly video: HTMLVideoElement;
    private listeners: Record<string, Listener[]> = {};
    private readonly ui;
    private previousVolume: number = 1;

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

        if (options.ui) {
            this.video.controls = false;
            switch (options.ui) {
                default:
                    this.ui = new BaseUI(this);
            }
        }

        if (options.captions) {
            const captionsArray = Array.isArray(options.captions) ? options.captions : [options.captions];
            captionsArray.forEach(({src, label = "Captions", lang = "en"}, index) => {
                const track = document.createElement('track');
                track.kind = "captions";
                track.label = label;
                track.srclang = lang;
                track.src = src;
                if (index === 0) track.default = true;
                this.video.appendChild(track);
            });
            this.video.textTracks[0].mode = "showing";
        }

        ['play', 'pause', 'timeupdate', 'ended', 'loadedmetadata', 'volumechange', 'progress', 'waiting', 'playing', 'stalled', 'canplay'].forEach(eventName => {
            this.video.addEventListener(eventName, (ev) => {
                this.emit(eventName, ev);
            });
        });
    }

    public setSource(src: string): void {
        this.video.src = src;
        this.video.load();
    }

    public setVolume(value: number): void {
        const volume = Math.max(0, Math.min(1, value));
        if (!volume) this.setMuted(true);
        else this.setMuted(false);
        this.video.volume = volume;
        this.previousVolume = volume;
    }

    public toggleVolume(): void {
        if (this.isMuted()) this.setMuted(false);
        else this.setMuted(true);
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

    public getContainer(): HTMLElement {
        return this.container;
    }

    public getBuffered(): TimeRanges | null {
        return this.video.buffered.length > 0 ? this.video.buffered : null;
    }

    public getBufferedEnd(): number {
        if (this.video.buffered.length === 0) return 0;
        let bufferedEnd = 0;
        for (let i = 0; i < this.video.buffered.length; i++) bufferedEnd = Math.max(bufferedEnd, this.video.buffered.end(i));
        return bufferedEnd;
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
        if (this.container.requestFullscreen) this.container.requestFullscreen();
    }

    public isFullscreen(): boolean {
        return document.fullscreenElement === this.container;
    }

    public toggleFullscreen(): void {
        if (this.isFullscreen()) document.exitFullscreen();
        else this.enterFullscreen();
    }

    public destroy(): void {
        this.video.pause();
        this.video.src = '';
        this.video.load();
        this.video.remove();
        if (this.ui) this.ui.destroy();
    }

    on(event: string, fn: Listener) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    off(event: string, fn: Listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== fn);
    }

    emit(event: string, ...args: any[]) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(fn => fn(...args));
    }
}