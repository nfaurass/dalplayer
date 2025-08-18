import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

type Caption = { src: string, label?: string, lang?: string };

export class CaptionsPlugin implements DALPlayerPlugin {
    name = "captions";
    private player!: DALPlayer;
    private captions: Caption[] = [];

    constructor(captions: Caption[]) {
        this.captions = captions;
    }

    destroy() {
        Array.from(this.player.getVideoElement().querySelectorAll("track")).forEach(t => t.remove());
    }

    setup(player: DALPlayer) {
        this.player = player;
        const video = player.getVideoElement();
        const addedLabels = new Set<string>();
        this.captions.forEach(({src, label, lang = "en"}, index) => {
            const trackLabel = label || `Captions ${index + 1}`;
            if (addedLabels.has(trackLabel)) return;
            addedLabels.add(trackLabel);
            const track = document.createElement("track");
            track.kind = "captions";
            track.label = trackLabel;
            track.srclang = lang;
            track.src = src;
            video.appendChild(track);
        });
    }

    selectCaption(label: string) {
        const textTracks = this.player.getVideoElement().textTracks;
        for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            if (track.label === label) track.mode = "hidden";
            else track.mode = "disabled";
        }
    }

    getCaptionTracksLabels(): string[] {
        const labels = Array.from(this.player.getVideoElement().textTracks, track => track.label);
        return Array.from(new Set(labels));
    }

    getSelectedCaptionTrack(): TextTrack | null {
        const textTracks = this.player.getVideoElement().textTracks;
        for (let i = 0; i < textTracks.length; i++) if (textTracks[i].mode === "hidden") return textTracks[i] || null;
        return null;
    }

    hasCaptions(): boolean {
        return !!this.player.getVideoElement().textTracks.length;
    }

    setSelectedCaption(captionLabel: string): void {
        const textTracks = this.player.getVideoElement().textTracks;
        for (let i = 0; i < textTracks.length; i++) {
            if (textTracks[i].label === captionLabel) {
                textTracks[i].mode = "hidden";
                textTracks[i].addEventListener('cuechange', () => this.player.emit('caption-cuechange', textTracks[i].activeCues));
            } else {
                textTracks[i].mode = "disabled";
                textTracks[i].removeEventListener('cuechange', () => this.player.emit('caption-cuechange', textTracks[i].activeCues));
            }
        }
    }
}