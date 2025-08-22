import {BaseUI} from "../ui/BaseUI";
import {DALPlayerPlugin} from "./DALPlayerPlugin";
import {CaptionsPlugin} from "../plugins/CaptionsPlugin";
import {PlaybackSpeedPlugin} from "../plugins/PlaybackSpeedPlugin";
import {PictureInPicturePlugin} from "../plugins/PictureInPicturePlugin";
import {LoopPlugin} from "../plugins/LoopPlugin";
import {DownloadPlugin} from "../plugins/DownloadPlugin";
import {AdsPlugin} from "../plugins/AdsPlugin";

type Listener = (...args: any[]) => void;

export enum DALPlayerUIType {
    Base = "Base",
    V1 = "V1",
}

interface NativePluginMap {
    captions: CaptionsPlugin;
    playback_speed: PlaybackSpeedPlugin;
    picture_in_picture: PictureInPicturePlugin;
    loop: LoopPlugin;
    download: DownloadPlugin;
    ads: AdsPlugin;
}

export interface DALPlayerOptions {
    parent: HTMLElement | string;
    source?: string;
    poster?: string;
    autoplay?: boolean;
    controls?: boolean;
    plugins?: DALPlayerPlugin[];
    ui?: DALPlayerUIType;
}

export class DALPlayer {
    private readonly container: HTMLElement;
    private readonly video: HTMLVideoElement;
    private readonly ui?: BaseUI;
    private listeners: Record<string, Listener[]> = {};
    private plugins: DALPlayerPlugin[] = [];
    private poster: string = "";

    private static readonly NATIVE_VIDEO_EVENTS: string[] = [
        'play', 'pause', 'timeupdate', 'ended', 'loadedmetadata',
        'volumechange', 'progress', 'waiting', 'playing', 'stalled', 'canplay',
        'error'
    ];

    constructor(options: DALPlayerOptions) {
        this.container = this._initializeContainer(options.parent);
        this.video = this._createVideoElement(options.controls);
        this.container.appendChild(this.video);
        this._applyOptions(options);
        this._initializePlugins(options.plugins);
        this._bindVideoEvents();

        if (options.ui) this.ui = this._initializeUI(options.ui);
    }

    private _initializeContainer(parent: HTMLElement | string): HTMLElement {
        const container = typeof parent === 'string' ? document.getElementById(parent) : parent;
        if (!container) throw new Error('DALPlayer parent element not found');
        return container;
    }

    private _createVideoElement(showNativeControls: boolean = false): HTMLVideoElement {
        const video = document.createElement('video');
        video.controls = showNativeControls;
        video.style.width = '100%';
        return video;
    }

    private _applyOptions(options: DALPlayerOptions): void {
        if (options.source) this.setSource(options.source);
        if (options.poster) this.setPoster(options.poster);
        if (options.autoplay) {
            this.video.muted = true;
            this.video.play().catch(err => {
                console.warn('Autoplay was blocked by the browser:', err);
            });
        }
        if (options.ui) this.video.controls = false;
    }

    private _initializeUI(uiType: DALPlayerUIType): BaseUI {
        switch (uiType) {
            default:
                return new BaseUI(this);
        }
    }

    private _initializePlugins(plugins?: DALPlayerPlugin[]): void {
        if (plugins) plugins.forEach(plugin => this.use(plugin));
    }

    private _bindVideoEvents(): void {
        DALPlayer.NATIVE_VIDEO_EVENTS.forEach(eventName => {
            this.video.addEventListener(eventName, (event) => {
                this.emit(eventName, event);
            });
        });
    }

    // ACTIONS & STATE MODIFIERS

    public setSource(src: string): void {
        this.video.src = src;
        this.video.load();
    }

    public setCurrentTime(time: number): void {
        this.video.currentTime = time;
    }

    public setPoster(poster: string): void {
        this.poster = poster;
        this.video.poster = poster;
        this.emit("poster", poster);
    }

    public setVolume(value: number): void {
        const volume = Math.max(0, Math.min(1, value));
        this.video.volume = volume;
        this.setMuted(volume === 0);
    }

    public toggleVolume(): void {
        this.setMuted(!this.video.muted);
    }

    public setSeekPosition(percentage: number): void {
        const clamped = Math.max(0, Math.min(100, percentage));
        if (!isNaN(this.video.duration)) this.video.currentTime = (this.video.duration * clamped) / 100;
    }

    public setMuted(muted: boolean): void {
        this.video.muted = muted;
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
        this.listeners = {};
    }

    // GETTERS & STATE QUERIES

    public getCurrentTime(): number {
        return this.video.currentTime;
    }

    public getSource(): string {
        return this.video.src;
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

    public getPoster(): string {
        return this.poster ?? "";
    }

    public getVideoElement(): HTMLVideoElement {
        return this.video;
    }

    public getVideoMetadata(): { cW: number, cH: number, vW: number, vH: number, W: number, H: number } {
        return {
            cW: this.video.clientWidth,
            cH: this.video.clientHeight,
            vW: this.video.videoWidth,
            vH: this.video.videoHeight,
            W: this.video.width,
            H: this.video.height
        }
    }

    public getVideoError(): MediaError | null {
        return this.video.error;
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

    public isPoster(): boolean {
        return !!this.poster;
    }

    public isFullscreen(): boolean {
        return document.fullscreenElement === this.container;
    }

    // PLUGIN SYSTEM

    public use<T extends DALPlayerPlugin>(plugin: T): void {
        plugin.setup(this);
        this.plugins.push(plugin);
    }

    public get<K extends keyof NativePluginMap>(name: K): NativePluginMap[K] | null {
        return (this.plugins.find(p => p.name === name) || null) as NativePluginMap[K] | null;
    }

    public list(): Record<string, DALPlayerPlugin> {
        return this.plugins.reduce((acc, plugin) => {
            acc[plugin.name] = plugin;
            return acc;
        }, {} as Record<string, DALPlayerPlugin>);
    }

    // EVENT EMITTER SYSTEM

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