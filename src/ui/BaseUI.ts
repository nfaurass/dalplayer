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
import LoopControl from "./controls/Loop";
import LoopExistSVG from "./svg/LoopExit";
import LoopSVG from "./svg/Loop";
import PiPControl from "./controls/PiP";
import PiPExitSVG from "./svg/PiPExit";
import PiPSVG from "./svg/PiP";
import DoubleSpeedSVG from "./svg/DoubleSpeed";
import DownloadControl from "./controls/Download";
import PlaybackSpeedControl from "./controls/PlaybackSpeed";

export class BaseUI {
    private player: DALPlayer;

    private container: HTMLElement;
    private uiWrapper: HTMLDivElement = document.createElement('div');
    private uiPoster!: HTMLDivElement;

    private BottomControls!: HTMLDivElement;
    private BottomUpperLeftControls!: HTMLDivElement;
    // private BottomUpperRightControls!: HTMLDivElement;
    private BottomLowerLeftControls!: HTMLDivElement;
    private BottomLowerRightControls!: HTMLDivElement;
    private PlayPause!: HTMLButtonElement;
    private Captions!: HTMLButtonElement;
    private CaptionsDropdown!: HTMLDivElement;
    private Loop!: HTMLButtonElement;
    private PiP!: HTMLButtonElement;
    private Fullscreen!: HTMLButtonElement;
    private SeekBar!: HTMLDivElement;
    private TimeDisplay!: HTMLSpanElement;
    private Volume!: HTMLButtonElement;
    private VolumeSlider!: HTMLInputElement;
    private Download!: HTMLButtonElement;
    private LoadingSpinner!: HTMLDivElement;
    private PlaybackSpeed!: HTMLButtonElement;
    private PlaybackSpeedDropdown!: HTMLDivElement;

    private CaptionsText: HTMLSpanElement = document.createElement('span');
    private PlaybackText!: HTMLSpanElement;

    private playerDuration: number = 0;
    private isDragging: boolean = false;
    private hideControlsTimeoutId?: number;
    private inactivityDelay = 1500;

    constructor(player: DALPlayer) {
        this.player = player;
        this.container = player.getContainer();

        this.createUI();

        this.player.on('play', () => (this.hidePoster(), this.updatePlayPauseButton(), this.scheduleHideControls()));
        this.player.on('ended', () => this.showPoster());
        this.player.on('pause', () => (this.updatePlayPauseButton(), this.showUI()));
        this.player.on('loadedmetadata', () => this.updateTimeDisplay());
        this.player.on('timeupdate', () => this.updateTimeDisplay());
        this.player.on('volumechange', () => this.updateVolumeButton());
        this.player.on('progress', () => this.updateBufferedProgress());
        this.player.on('waiting', () => this.showLoadingSpinner());
        this.player.on('playing', () => this.hideLoadingSpinner());
        this.player.on('stalled', () => this.showLoadingSpinner());
        this.player.on('canplay', () => this.hideLoadingSpinner());
        this.player.on('loop', () => this.updateLoopButton());
        this.player.on('pip', () => this.updatePiPButton());
        this.player.on('caption-cuechange', () => this.updateCaptions());
        window.addEventListener('resize', () => this.updateCaptionsFont());
        document.addEventListener('fullscreenchange', () => (this.updateFullscreenToggleButton(), this.updateCaptionsFont()));
        this.uiWrapper.addEventListener('mousemove', () => this.resetTimer());
        this.uiWrapper.addEventListener('touchstart', () => this.resetTimer());
        this.uiWrapper.addEventListener('keydown', () => this.resetTimer());

        this.updatePlayPauseButton();
        this.updateFullscreenToggleButton();
        this.updateVolumeButton();
        this.updateBufferedProgress();

        this.addShortcuts();

        if (!this.player.isPaused()) this.scheduleHideControls();
    }

    private createUI() {

        // Inject CSS
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = Styles;
        this.uiWrapper.prepend(styleSheet);

        // Wrapper
        this.uiWrapper.id = "DALPlayer-ui-wrapper";

        const video = this.container.querySelector('video');
        if (video) this.uiWrapper.appendChild(video);
        this.container.appendChild(this.uiWrapper);

        // Poster
        if (this.player.isPoster()) {
            this.uiPoster = document.createElement("div");
            this.uiPoster.className = "DALPlayer-poster";
            this.uiPoster.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 5%, transparent 100%), url(${this.player.getPoster()})`;
            const posterPlayButton = document.createElement("button");
            posterPlayButton.className = "DALPlayer-poster-play-button";
            posterPlayButton.innerHTML = PlaySVG();
            posterPlayButton.addEventListener("click", () => this.player.play());
            this.uiPoster.appendChild(posterPlayButton);
            this.uiWrapper.appendChild(this.uiPoster);
        }

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
        const VolumeControls = VolumeControl();
        const volumeContainer = VolumeControls.volumeContainer;
        this.Volume = VolumeControls.volumeIcon;
        this.VolumeSlider = VolumeControls.volumeSlider;
        // Volume icon
        this.Volume.addEventListener("click", () => (this.player.toggleVolume(), this.updateVolumeButton()));
        // Volume slider
        this.VolumeSlider.value = this.player.getVolume().toString();
        this.VolumeSlider.addEventListener('input', (e) => this.updateVolumeSlider(parseFloat((e.target as HTMLInputElement).value)));
        this.BottomLowerLeftControls.appendChild(volumeContainer);

        // TimeDisplay
        this.TimeDisplay = TimeDisplayControl();
        this.BottomLowerLeftControls.appendChild(this.TimeDisplay);

        // PiP
        this.PiP = PiPControl();
        this.PiP.addEventListener("click", () => this.player.togglePip());
        this.BottomLowerRightControls.appendChild(this.PiP);

        // PlaybackSpeed
        const PlaybackSpeedControls = PlaybackSpeedControl();
        this.PlaybackSpeed = PlaybackSpeedControls.PlaybackSpeedButton;
        this.PlaybackSpeedDropdown = PlaybackSpeedControls.PlaybackSpeedDropdown;
        // Container
        this.BottomLowerRightControls.appendChild(PlaybackSpeedControls.PlaybackSpeedContainer);
        // Button
        this.PlaybackSpeed.addEventListener("click", () => this.updatePlaybackSpeedDropdown());
        // Dropdown
        Array.from(this.PlaybackSpeedDropdown.children).forEach((child) => {
            child.addEventListener("click", () => {
                this.player.setPlaybackRate(parseFloat(child.textContent));
                this.PlaybackSpeedDropdown.querySelectorAll(".DALPlayer-playback-speed-dropdown-item-active").forEach(el => el.classList.remove("DALPlayer-playback-speed-dropdown-item-active"));
                child.classList.add("DALPlayer-playback-speed-dropdown-item-active");
                this.updatePlaybackSpeedDropdown();
            });
        });

        // Loop
        this.Loop = LoopControl();
        this.Loop.addEventListener("click", () => this.player.toggleLoop());
        this.BottomLowerRightControls.appendChild(this.Loop);

        // Captions
        if (this.player.isCaptions()) {
            // Controls
            const CaptionsControls = CaptionsControl(this.player.getCaptionTracksLabels(), this.player.getSelectedCaptionTrack());
            this.Captions = CaptionsControls.CaptionsButton;
            this.CaptionsDropdown = CaptionsControls.CaptionsDropdown;
            // Container
            this.BottomLowerRightControls.appendChild(CaptionsControls.CaptionsContainer);
            // Button
            this.Captions.addEventListener("click", () => this.updateCaptionsDropdown());
            // Dropdown
            Array.from(this.CaptionsDropdown.children).forEach((child) => {
                child.addEventListener("click", () => {
                    this.player.setSelectedCaption(child.textContent || "Off");
                    this.CaptionsDropdown.querySelectorAll(".DALPlayer-captions-dropdown-item-active").forEach(el => el.classList.remove("DALPlayer-captions-dropdown-item-active"));
                    child.classList.add("DALPlayer-captions-dropdown-item-active");
                    this.updateCaptions();
                    this.updateCaptionsFont();
                    this.updateCaptionsDropdown();
                });
            });
            // Container On Media
            const captionsArea = document.createElement("div");
            captionsArea.className = "DALPlayer-captions";
            const captionsContainer = document.createElement("div");
            captionsContainer.className = "DALPlayer-captions-container";
            this.CaptionsText = document.createElement("span");
            this.CaptionsText.className = "DALPlayer-captions-text";
            captionsContainer.appendChild(this.CaptionsText);
            captionsArea.appendChild(captionsContainer);
            this.uiWrapper.appendChild(captionsArea);
        }

        // Download
        this.Download = DownloadControl();
        this.Download.addEventListener("click", () => this.downloadVideo());
        this.BottomLowerRightControls.appendChild(this.Download);

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
        if (this.VolumeSlider) this.VolumeSlider.value = volume.toString();
    }

    private updateBufferedProgress() {
        const bufferedEnd = this.player.getBufferedEnd();
        const duration = this.player.getDuration();
        if (duration > 0 && (this.SeekBar as any).setBuffered) (this.SeekBar as any).setBuffered((bufferedEnd / duration) * 100);
    }

    private updateLoopButton() {
        this.Loop.innerHTML = this.player.isLooping() ? LoopExistSVG() : LoopSVG();
    }

    private updatePiPButton() {
        this.PiP.innerHTML = this.player.isPiP() ? PiPExitSVG() : PiPSVG();
    }

    private updateVolumeSlider(volume: number) {
        this.player.setVolume(Math.min(volume, 1));
        this.updateVolumeButton();
        this.VolumeSlider.style.background = `
            linear-gradient(
                to right,
                var(--DALPlayer-white) 0%,
                var(--DALPlayer-white) ${volume * 100}%,
                var(--DALPlayer-white-30) ${volume * 100}%,
                var(--DALPlayer-white-30) 100%
            )`
        ;
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
        if (this.CaptionsDropdown.style.display == 'none') {
            this.BottomControls.style.opacity = '0';
            this.BottomControls.style.pointerEvents = 'none';
            this.BottomControls.style.transition = 'opacity 0.5s ease';
        }
    }

    private showUI(): void {
        this.BottomControls.style.opacity = '1';
        this.BottomControls.style.pointerEvents = 'auto';
        this.BottomControls.style.transition = 'opacity 0.5s ease';
    }

    private hidePoster() {
        if (this.uiPoster) {
            this.uiPoster.style.opacity = '0';
            this.uiPoster.style.pointerEvents = 'none';
        }
    }

    private showPoster() {
        if (this.uiPoster) {
            this.uiPoster.style.opacity = '1';
            this.uiPoster.style.pointerEvents = 'auto';
        }
    }

    private scheduleHideControls() {
        if (this.hideControlsTimeoutId) clearTimeout(this.hideControlsTimeoutId);
        this.hideControlsTimeoutId = window.setTimeout(() => {
            if (!this.player.isPaused() && !this.isDragging) this.hideUI();
        }, this.inactivityDelay);
    }

    private resetTimer() {
        this.showUI();
        this.scheduleHideControls();
    }

    private updateCaptions() {
        const newTrack = this.player.getSelectedCaptionTrack();
        if (newTrack) this.updateCaptionsText(newTrack.activeCues);
        else this.CaptionsText.innerHTML = "";
    }

    private updateCaptionsText(activeCues: TextTrackCueList | null): void {
        this.CaptionsText.innerHTML = Array.from(activeCues ?? []).map(cue => "text" in cue ? cue.text : "").join("\n");
    }

    private updateCaptionsFont() {
        this.CaptionsText.style.fontSize = `${this.player.getVideoMetadata().cH * 0.04}px`;
    }

    private updateCaptionsDropdown() {
        this.CaptionsDropdown.style.display = this.CaptionsDropdown.style.display === "none" ? "block" : "none"
    }

    private updatePlaybackSpeedDropdown() {
        this.PlaybackSpeedDropdown.style.display = this.PlaybackSpeedDropdown.style.display === "none" ? "block" : "none"
    }

    private doublePlaybackSpeed(double: boolean) {
        if (!this.player.isPlaying()) return;
        if (double) {
            this.PlaybackText = document.createElement('span');
            this.PlaybackText.className = "DALPlayer-playback-text"
            this.PlaybackText.innerHTML = "2x" + DoubleSpeedSVG();
            this.uiWrapper.appendChild(this.PlaybackText);
            this.player.setPlaybackRate(2);
        } else {
            this.player.setPlaybackRate(1);
            if (this.PlaybackText) this.PlaybackText.remove();
        }
    }

    private downloadVideo() {
        const videoUrl = this.player.getSource();
        const link = document.createElement('a');
        link.href = videoUrl;
        link.target = "_blank";
        link.download = videoUrl.split('/').pop() || 'video.mp4';
        this.container.appendChild(link);
        link.click();
        this.container.removeChild(link);
    }

    // Shortcuts
    private addShortcuts() {
        let spaceKeyPressTimer: number | null = null;
        let isSpaceKeyLongPressed = false;
        let isSpaceKeyDown = true;
        this.uiWrapper.tabIndex = 0;

        this.uiWrapper.addEventListener('keydown', (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            if (isSpaceKeyLongPressed && e.code !== 'Space') {
                this.doublePlaybackSpeed(false);
                isSpaceKeyLongPressed = false;
                if (spaceKeyPressTimer !== null) {
                    clearTimeout(spaceKeyPressTimer);
                    spaceKeyPressTimer = null;
                }
                isSpaceKeyDown = false;
            }

            switch (e.code) {
                // Play/Pause
                case 'Space':
                    e.preventDefault();
                    if (!isSpaceKeyDown) {
                        isSpaceKeyDown = true;
                        spaceKeyPressTimer = window.setTimeout(() => {
                            this.doublePlaybackSpeed(true);
                            isSpaceKeyLongPressed = true;
                        }, 500);
                    }
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
                    const volumeArrowUp = this.player.getVolume() + 0.1;
                    this.player.setVolume(Math.min(volumeArrowUp, 1));
                    this.updateVolumeSlider(volumeArrowUp);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    const volumeArrowDown = this.player.getVolume() - 0.1;
                    this.player.setVolume(Math.max(volumeArrowDown, 0));
                    this.updateVolumeSlider(volumeArrowDown);
                    break;
                // Loop
                case 'KeyL':
                    e.preventDefault();
                    this.player.toggleLoop();
                    break;
                // PiP
                case 'KeyP':
                    e.preventDefault();
                    this.player.togglePip();
                    break;
            }
        });

        this.uiWrapper.addEventListener('keyup', (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (!isSpaceKeyLongPressed) this.player.togglePlayPause();
                    if (isSpaceKeyLongPressed) {
                        this.doublePlaybackSpeed(false);
                        isSpaceKeyLongPressed = false;
                    }
                    if (spaceKeyPressTimer !== null) {
                        clearTimeout(spaceKeyPressTimer);
                        spaceKeyPressTimer = null;
                    }
                    isSpaceKeyDown = false;
                    break;
            }
        });

    }

    destroy() {
        this.uiWrapper.remove();
    }
}