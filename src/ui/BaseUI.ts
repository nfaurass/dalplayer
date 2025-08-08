import type {DALPlayer} from '../core/DALPlayer';
import PlayPauseControl from "./controls/PlayPause";
import PlaySVG from "./svg/Play";
import PauseSVG from "./svg/Pause";
import FullscreenExitSVG from "./svg/FullscreenExit";
import FullscreenSVG from "./svg/Fullscreen";
import FullscreenControl from "./controls/Fullscreen";
import SeekBarControl from "./controls/SeekBar";
import {BottomControls} from "./controls/Bottom";
import TimeDisplayControl from "./controls/TimeDisplay";
import {formatTime} from "./utils/formatTime";

export class BaseUI {
    private player: DALPlayer;

    private container: HTMLElement;
    private uiWrapper: HTMLDivElement = document.createElement('div');

    private BottomControls!: HTMLDivElement;
    private BottomUpperLeftControls!: HTMLDivElement;
    // private BottomUpperRightControls!: HTMLDivElement;
    private BottomLowerLeftControls!: HTMLDivElement;
    private BottomLowerRightControls!: HTMLDivElement;
    private PlayPause!: HTMLButtonElement;
    private Fullscreen!: HTMLButtonElement;
    private SeekBar!: HTMLDivElement;
    private TimeDisplay!: HTMLSpanElement;

    private playerDuration: number = 0;

    constructor(player: DALPlayer) {
        this.player = player;
        this.container = player.getContainer();

        this.createUI();

        this.player.on('play', () => this.updatePlayPauseButton());
        this.player.on('pause', () => this.updatePlayPauseButton());
        this.player.on('loadedmetadata', () => this.updateTimeDisplay());
        this.player.on('timeupdate', () => this.updateTimeDisplay());
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
        this.BottomUpperLeftControls = AllBottomControls.BottomUpperLeft;
        // this.BottomUpperRightControls = AllBottomControls.BottomUpperRight;
        this.BottomLowerLeftControls = AllBottomControls.BottomLowerLeft;
        this.BottomLowerRightControls = AllBottomControls.BottomLowerRight;

        this.uiWrapper.appendChild(this.BottomControls);

        this.SeekBar = SeekBarControl();
        this.SeekBar.addEventListener('seek', (e: any) => this.player.setSeekPosition(e.detail));
        this.player.on('timeupdate', () => (this.SeekBar as any).setProgress(this.player.getSeekPosition()));
        this.BottomUpperLeftControls.appendChild(this.SeekBar);

        this.PlayPause = PlayPauseControl();
        this.PlayPause.addEventListener("click", () => this.player.togglePlayPause());
        this.BottomLowerLeftControls.appendChild(this.PlayPause);

        this.TimeDisplay = TimeDisplayControl();
        this.BottomLowerLeftControls.appendChild(this.TimeDisplay);

        this.Fullscreen = FullscreenControl();
        this.Fullscreen.addEventListener("click", () => this.player.toggleFullscreen());
        this.BottomLowerRightControls.appendChild(this.Fullscreen);
    }

    private updatePlayPauseButton() {
        this.PlayPause!.innerHTML = this.player.isPaused() ? PlaySVG() : PauseSVG();
    }

    private updateFullscreenToggleButton() {
        this.Fullscreen!.innerHTML = this.player.isFullscreen() ? FullscreenExitSVG() : FullscreenSVG();
    }

    private updateTimeDisplay() {
        if (!this.playerDuration) this.playerDuration = this.player.getDuration();
        if (this.playerDuration > 0) this.TimeDisplay.innerHTML = formatTime(this.player.getCurrentTime()) + " / " + formatTime(this.playerDuration);
        else setTimeout(() => this.updateTimeDisplay(), 500);
    }

    destroy() {
        this.uiWrapper.remove();
    }
}