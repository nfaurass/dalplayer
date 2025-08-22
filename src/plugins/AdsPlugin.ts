import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

export interface AdItem {
    src: string;
    skipAfter?: number;
    time?: number;
    position?: "pre" | "mid" | "post";
    id?: string;
}

export type InternalAd = AdItem & {
    played?: boolean;
    skippableStateFired?: boolean;
};

export class AdsPlugin implements DALPlayerPlugin {
    name = "ads";
    private player!: DALPlayer;
    private ads: InternalAd[] = [];
    private destroyed = false;
    private originalSource!: string;
    private resumeTime: number = 0;
    private isAdPlaying: boolean = false;
    private adQueue: InternalAd[] = [];
    private lastTime: number = 0;

    private boundOnTimeupdate = this.onTimeupdate.bind(this);
    private boundOnPlayed = this.onPlayed.bind(this);
    private boundOnEnded = this.onEnded.bind(this);

    constructor(initialAds: AdItem[] = []) {
        this.ads = (initialAds || []).map(a => ({...a, id: a.id ?? AdsPlugin.makeId()}));
    }

    private static makeId() {
        return 'ad_' + Math.random().toString(36).slice(2, 9);
    }

    setup(player: DALPlayer) {
        this.player = player;
        this.originalSource = player.getSource();
        player.on("play", this.boundOnPlayed);
        player.on("timeupdate", this.boundOnTimeupdate);
        player.on("ended", this.boundOnEnded);
    }

    private onPlayed() {
        if (this.isAdPlaying) return;
        this.playPosition("pre");
    }

    private onEnded() {
        if (this.isAdPlaying) {
            const finishedAd = this.adQueue.shift();
            this.player.emit("adend", finishedAd);

            if (this.adQueue.length > 0) {
                const nextAd = this.adQueue[0];
                this.player.emit("adstart", nextAd);
                this.player.setSource(nextAd.src);
                this.player.play();
            } else {
                this.isAdPlaying = false;
                this.player.setSource(this.originalSource);
                this.player.setCurrentTime(this.resumeTime);
                this.player.play();
            }
        } else {
            this.playPosition("post");
        }
    }

    private onTimeupdate() {
        const current = this.player.getCurrentTime();
        if (this.isAdPlaying) {
            const currentAd = this.adQueue[0];
            if (currentAd && typeof currentAd.skipAfter === 'number' && !currentAd.skippableStateFired && current >= currentAd.skipAfter) {
                currentAd.skippableStateFired = true;
                this.player.emit("adSkippable", currentAd);
            }
            this.lastTime = current;
            return;
        }

        for (const ad of this.ads) {
            if (ad.position === "mid" && ad.time !== undefined && !ad.played && this.lastTime < ad.time && current >= ad.time) {
                if (this.destroyed) return;
                this.playPosition("mid");
                break;
            }
        }
        this.lastTime = current;
    }

    private playPosition(position: "pre" | "mid" | "post") {
        this.adQueue = this.ads.filter(ad => ad.position === position && !ad.played);
        if (this.adQueue.length === 0) return;

        this.isAdPlaying = true;
        this.resumeTime = this.player.getCurrentTime();
        this.adQueue.forEach(ad => ad.played = true);

        const firstAd = this.adQueue[0];
        this.player.emit("adstart", firstAd);
        this.player.setSource(firstAd.src);
        this.player.play();
    }

    public skipAd(): boolean {
        if (!this.isAdPlaying || this.adQueue.length === 0) return false;

        const currentAd = this.adQueue[0];
        if (currentAd.skipAfter && this.player.getCurrentTime() >= currentAd.skipAfter) {
            this.onEnded();
            return true;
        }

        return false;
    }

    destroy() {
        this.destroyed = true;
        this.player.off("play", this.boundOnPlayed);
        this.player.off("timeupdate", this.boundOnTimeupdate);
        this.player.off("ended", this.boundOnEnded);
        this.ads = [];
    }

    reset() {
        for (const ad of this.ads) {
            ad.played = false;
            ad.skippableStateFired = false;
        }
        this.isAdPlaying = false;
        this.adQueue = [];
        this.lastTime = 0;
    }
}