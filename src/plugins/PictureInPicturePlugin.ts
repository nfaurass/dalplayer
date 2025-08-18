import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

export class PictureInPicturePlugin implements DALPlayerPlugin {
    name = "picture_in_picture";
    private player!: DALPlayer;
    private readonly canUsePiP: boolean;

    constructor() {
        this.canUsePiP = document.pictureInPictureEnabled ?? false;
    }

    destroy() {
    }

    setup(player: DALPlayer) {
        this.player = player;
    }

    public isPiP(): boolean {
        return document.pictureInPictureElement === this.player.getVideoElement();
    }

    public async enterPiP(): Promise<void> {
        if (!this.canUsePiP || this.isPiP()) return;
        try {
            await this.player.getVideoElement().requestPictureInPicture();
            this.player.emit('pip', true);
        } catch (err) {
            console.error('Failed to enter PiP:', err);
        }
    }

    public async exitPiP(): Promise<void> {
        if (!this.canUsePiP || !this.isPiP()) return;
        try {
            await document.exitPictureInPicture();
            this.player.emit('pip', false);
        } catch (err) {
            console.error('Failed to exit PiP:', err);
        }
    }

    public async togglePip(): Promise<void> {
        if (this.isPiP()) await this.exitPiP();
        else await this.enterPiP();
    }
}