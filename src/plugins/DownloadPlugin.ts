import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

export class DownloadPlugin implements DALPlayerPlugin {
    name = "download";
    private player!: DALPlayer;

    constructor() {
    }

    destroy() {
    }

    setup(player: DALPlayer) {
        this.player = player;
    }

    public downloadVideo(container: HTMLElement | HTMLDivElement): void {
        const videoUrl = this.player.getSource();
        const link = document.createElement('a');
        link.href = videoUrl;
        link.target = "_blank";
        link.download = videoUrl.split('/').pop() || 'video.mp4';
        container.appendChild(link);
        link.click();
        container.removeChild(link);
    }
}