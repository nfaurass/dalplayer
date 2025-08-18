import {DALPlayerPlugin} from "../core/DALPlayerPlugin";
import {DALPlayer} from "../core/DALPlayer";

export class LoopPlugin implements DALPlayerPlugin {
    name = "loop";
    private player!: DALPlayer;

    constructor() {
    }

    destroy() {
    }

    setup(player: DALPlayer) {
        this.player = player;
    }

    public setLoop(loop: boolean): void {
        this.player.getVideoElement().loop = loop;
        this.player.emit('loop', loop);
    }

    public isLooping(): boolean {
        return this.player.getVideoElement().loop;
    }

    public toggleLoop(): void {
        const currentLoop = !this.player.getVideoElement().loop;
        this.player.getVideoElement().loop = currentLoop;
        this.player.emit('loop', currentLoop);
    }
}