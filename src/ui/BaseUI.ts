import type {DALPlayer} from '../core/DALPlayer';
import PlayPauseControl from "./controls/PlayPause";
import PlaySVG from "./svg/Play";
import PauseSVG from "./svg/Pause";
import FullscreenExitSVG from "./svg/FullscreenExit";
import FullscreenSVG from "./svg/Fullscreen";
import FullscreenControl from "./controls/Fullscreen";
import SeekBarControl from "./controls/SeekBar";
import {BottomControls} from "./controls/Bottom";

export class BaseUI {
    private player: DALPlayer;

    private container: HTMLElement;
    private uiWrapper: HTMLDivElement = document.createElement('div');

    private BottomControls!: HTMLDivElement;
    private BottomLeftControls!: HTMLDivElement;
    private BottomRightControls!: HTMLDivElement;
    private PlayPause!: HTMLButtonElement;
    private Fullscreen!: HTMLButtonElement;
    private SeekBar!: HTMLDivElement;

    constructor(player: DALPlayer) {
        this.player = player;
        this.container = player.getContainer();

        this.createUI();

        this.player.on('play', () => this.updatePlayPauseButton());
        this.player.on('pause', () => this.updatePlayPauseButton());
        document.addEventListener('fullscreenchange', () => this.updateFullscreenToggleButton());

        this.updatePlayPauseButton();
        this.updateFullscreenToggleButton();
    }

    private createUI() {

        // Wrapper
        this.uiWrapper.id = "UIWRAPPER";
        Object.assign(this.uiWrapper.style, {
            position: 'relative',
            display: 'inline-block',
            width: '100%',
        });

        const video = this.container.querySelector('video');
        if (video) this.uiWrapper.appendChild(video);
        this.container.appendChild(this.uiWrapper);

        const AllBottomControls = BottomControls();
        this.BottomControls = AllBottomControls.Bottom;
        this.uiWrapper.appendChild(this.BottomControls);

        this.SeekBar = SeekBarControl();
        this.SeekBar.addEventListener('seek', (e: any) => this.player.setSeekPosition(e.detail));
        this.player.on('timeupdate', () => (this.SeekBar as any).setProgress(this.player.getSeekPosition()));
        AllBottomControls.BottomUpper.appendChild(this.SeekBar);

        this.BottomLeftControls = AllBottomControls.BottomLeft;
        this.BottomRightControls = AllBottomControls.BottomRight;

        this.PlayPause = PlayPauseControl();
        this.PlayPause.addEventListener("click", () => this.player.togglePlayPause());
        this.BottomLeftControls.appendChild(this.PlayPause);

        this.Fullscreen = FullscreenControl();
        this.Fullscreen.addEventListener("click", () => this.player.toggleFullscreen());
        this.BottomRightControls.appendChild(this.Fullscreen);
    }

    private updatePlayPauseButton() {
        this.PlayPause!.innerHTML = this.player.isPaused() ? PlaySVG() : PauseSVG();
    }

    private updateFullscreenToggleButton() {
        this.Fullscreen!.innerHTML = this.player.isFullscreen() ? FullscreenExitSVG() : FullscreenSVG();
    }

    destroy() {
        this.uiWrapper.remove();
    }
}