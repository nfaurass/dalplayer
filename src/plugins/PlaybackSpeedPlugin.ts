import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

export class PlaybackSpeedPlugin implements DALPlayerPlugin {
    name = "playback_speed";
    private player!: DALPlayer;
    private defaultPlaybackSpeed: number = 1;
    private lastPlaybackSpeed: number = 1;
    private readonly options: number[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    constructor(options: number[], defaultPlaybackSpeed: number = 1) {
        this.defaultPlaybackSpeed = options.includes(defaultPlaybackSpeed) ? defaultPlaybackSpeed : options[0];
        this.options = options;
    }

    destroy() {
    }

    setup(player: DALPlayer) {
        this.player = player;
        this.setPlaybackSpeed(this.defaultPlaybackSpeed);
    }

    public getDefaultPlaybackSpeed(): number {
        return this.defaultPlaybackSpeed;
    }

    public getOptions(): number[] {
        return this.options;
    }

    public getLastPlaybackSpeed(): number {
        return this.lastPlaybackSpeed;
    }

    public getPlaybackSpeed(): number {
        return this.player.getVideoElement().playbackRate;
    }

    public setPlaybackSpeed(rate: number): void {
        this.lastPlaybackSpeed = this.player.getVideoElement().playbackRate;
        this.player.getVideoElement().playbackRate = rate;
    }
}