import type {DALPlayer} from '../core/DALPlayer';
import Styles from "./styles.css";
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
import VolumeControl from "./controls/Volume";
import VolumeMaxSVG from "./svg/VolumeMax";
import VolumeMutedSVG from "./svg/VolumeMuted";
import VolumeLowSVG from "./svg/VolumeLow";
import VolumeMediumSVG from "./svg/VolumeMedium";
import {updatePosition} from "./utils/updatePosition";
import LoadingSpinner from "./controls/LoadingSpinner";
import CaptionsControl from "./controls/Captions";

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
    private Captions!: HTMLButtonElement;
    private Fullscreen!: HTMLButtonElement;
    private SeekBar!: HTMLDivElement;
    private TimeDisplay!: HTMLSpanElement;
    private Volume!: HTMLButtonElement;
    private LoadingSpinner!: HTMLDivElement;

    private playerDuration: number = 0;
    private isDragging: boolean = false;

    constructor(player: DALPlayer) {
        this.player = player;
        this.container = player.getContainer();

        this.createUI();

        this.player.on('play', () => this.updatePlayPauseButton());
        this.player.on('pause', () => this.updatePlayPauseButton());
        this.player.on('loadedmetadata', () => this.updateTimeDisplay());
        this.player.on('timeupdate', () => this.updateTimeDisplay());
        this.player.on('volumechange', () => this.updateVolumeButton());
        this.player.on('progress', () => this.updateBufferedProgress());
        this.player.on('waiting', () => this.showLoadingSpinner());
        this.player.on('playing', () => this.hideLoadingSpinner());
        this.player.on('stalled', () => this.showLoadingSpinner());
        this.player.on('canplay', () => this.hideLoadingSpinner());
        document.addEventListener('fullscreenchange', () => this.updateFullscreenToggleButton());

        this.updatePlayPauseButton();
        this.updateFullscreenToggleButton();
        this.updateVolumeButton();
        this.updateBufferedProgress();

        this.addShortcuts();
    }

    private createUI() {

        // Inject CSS
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = Styles;
        this.uiWrapper.prepend(styleSheet);

        // Wrapper
        this.uiWrapper.id = "UIWRAPPER";
        Object.assign(this.uiWrapper.style, {
            position: 'relative',
            display: 'inline-flex',
            width: '100%',
            height: '100%',
            userSelect: 'none',
            WebkitUserSelect: 'none',
        });

        const video = this.container.querySelector('video');
        if (video) this.uiWrapper.appendChild(video);
        this.container.appendChild(this.uiWrapper);

        // BottomControls
        const AllBottomControls = BottomControls();
        this.BottomControls = AllBottomControls.Bottom;
        this.BottomUpperLeftControls = AllBottomControls.BottomUpperLeft;
        // this.BottomUpperRightControls = AllBottomControls.BottomUpperRight;
        this.BottomLowerLeftControls = AllBottomControls.BottomLowerLeft;
        this.BottomLowerRightControls = AllBottomControls.BottomLowerRight;

        this.uiWrapper.appendChild(this.BottomControls);

        // SeekBar
        this.SeekBar = SeekBarControl();
        this.SeekBar.addEventListener('pointerdown', e => {
            this.isDragging = true;
            updatePosition(e.clientX, this.SeekBar);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        });
        window.addEventListener('pointermove', e => {
            if (this.isDragging) updatePosition(e.clientX, this.SeekBar);
        });
        window.addEventListener('pointerup', () => {
            this.isDragging = false;
        });
        this.SeekBar.addEventListener('seek', (e: any) => this.player.setSeekPosition(e.detail));
        this.player.on('timeupdate', () => (this.SeekBar as any).setProgress(this.player.getSeekPosition()));
        this.BottomUpperLeftControls.appendChild(this.SeekBar);

        // PlayPause
        this.PlayPause = PlayPauseControl();
        this.PlayPause.addEventListener("click", () => this.player.togglePlayPause());
        this.BottomLowerLeftControls.appendChild(this.PlayPause);

        // Volume
        this.Volume = VolumeControl();
        this.Volume.addEventListener("click", () => this.player.toggleVolume());
        this.BottomLowerLeftControls.appendChild(this.Volume);

        // TimeDisplay
        this.TimeDisplay = TimeDisplayControl();
        this.BottomLowerLeftControls.appendChild(this.TimeDisplay);

        // Captions
        if (this.player.isCaptions()) {
            this.Captions = CaptionsControl();
            this.Captions.addEventListener("click", () => console.log("Captions clicked"));
            this.BottomLowerRightControls.appendChild(this.Captions);
        }

        // Fullscreen
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

    private updateVolumeButton() {
        const volume = this.player.getVolume();
        if (volume === 0 || this.player.isMuted()) this.Volume.innerHTML = VolumeMutedSVG();
        else if (volume > 0 && volume < 0.33) this.Volume.innerHTML = VolumeLowSVG();
        else if (volume >= 0.33 && volume < 0.66) this.Volume.innerHTML = VolumeMediumSVG();
        else this.Volume.innerHTML = VolumeMaxSVG();
    }

    private updateBufferedProgress() {
        const bufferedEnd = this.player.getBufferedEnd();
        const duration = this.player.getDuration();
        if (duration > 0 && (this.SeekBar as any).setBuffered) (this.SeekBar as any).setBuffered((bufferedEnd / duration) * 100);
    }

    private showLoadingSpinner() {
        if (!this.LoadingSpinner) {
            this.LoadingSpinner = LoadingSpinner();
            this.uiWrapper.prepend(this.LoadingSpinner);
        }
        this.LoadingSpinner.style.display = 'block';
    }

    private hideLoadingSpinner() {
        if (this.LoadingSpinner) this.LoadingSpinner.style.display = 'none';
    }

    private hideUI(): void {
        this.BottomControls.style.opacity = '0';
        this.BottomControls.style.pointerEvents = 'none';
        this.BottomControls.style.transition = 'opacity 0.5s ease';
    }

    private showUI(): void {
        this.BottomControls.style.opacity = '1';
        this.BottomControls.style.pointerEvents = 'auto';
        this.BottomControls.style.transition = 'opacity 0.5s ease';
    }

    // Shortcuts
    private addShortcuts() {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
            switch (e.code) {
                // Play/Pause
                case 'Space':
                    e.preventDefault();
                    this.player.togglePlayPause();
                    break;
                // Seek
                case 'ArrowRight':
                    e.preventDefault();
                    this.player.setSeekPosition(Math.min(this.player.getSeekPosition() + 5, this.player.getDuration()));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.player.setSeekPosition(Math.max(this.player.getSeekPosition() - 5, 0));
                    break;
                // Fullscreen
                case 'KeyF':
                    e.preventDefault();
                    this.player.toggleFullscreen();
                    break;
                // Volume
                case 'KeyM':
                    e.preventDefault();
                    this.player.toggleVolume();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.player.setVolume(Math.min(this.player.getVolume() + 0.1, 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.player.setVolume(Math.max(this.player.getVolume() - 0.1, 0));
                    break;
            }
        });
    }

    destroy() {
        this.uiWrapper.remove();
    }
}