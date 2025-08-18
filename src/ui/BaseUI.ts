import type {DALPlayer} from '../core/DALPlayer';
import Styles from "./styles.css";
// SVG Imports
import PlaySVG from "./svg/Play";
import PauseSVG from "./svg/Pause";
import FullscreenExitSVG from "./svg/FullscreenExit";
import FullscreenSVG from "./svg/Fullscreen";
import VolumeMaxSVG from "./svg/VolumeMax";
import VolumeMutedSVG from "./svg/VolumeMuted";
import VolumeLowSVG from "./svg/VolumeLow";
import VolumeMediumSVG from "./svg/VolumeMedium";
import LoopExistSVG from "./svg/LoopExit";
import LoopSVG from "./svg/Loop";
import PiPExitSVG from "./svg/PiPExit";
import PiPSVG from "./svg/PiP";
import DoubleSpeedSVG from "./svg/DoubleSpeed";
// Control Imports
import PlayPauseControl from "./controls/PlayPause";
import FullscreenControl from "./controls/Fullscreen";
import SeekBarControl from "./controls/SeekBar";
import {BottomControls} from "./controls/Bottom";
import TimeDisplayControl from "./controls/TimeDisplay";
import VolumeControl from "./controls/Volume";
import LoadingSpinner from "./controls/LoadingSpinner";
import CaptionsControl from "./controls/Captions";
import LoopControl from "./controls/Loop";
import PiPControl from "./controls/PiP";
import DownloadControl from "./controls/Download";
import PlaybackSpeedControl from "./controls/PlaybackSpeed";
// Utility Imports
import {formatTime} from "./utils/formatTime";
import {updatePosition} from "./utils/updatePosition";

export class BaseUI {
    // Core Properties
    private readonly player: DALPlayer;
    private readonly container: HTMLElement;
    private readonly pluginCache: Record<string, any>;

    // UI Element Properties
    private uiWrapper!: HTMLDivElement;
    private uiPoster?: HTMLDivElement;
    private BottomControls!: HTMLDivElement;
    private BottomUpperLeftControls!: HTMLDivElement;
    private BottomLowerLeftControls!: HTMLDivElement;
    private BottomLowerRightControls!: HTMLDivElement;
    private PlayPause!: HTMLButtonElement;
    private Captions!: HTMLButtonElement;
    private CaptionsDropdown!: HTMLDivElement;
    private CaptionsText!: HTMLSpanElement;
    private Loop!: HTMLButtonElement;
    private PiP!: HTMLButtonElement;
    private Fullscreen!: HTMLButtonElement;
    private SeekBar!: HTMLDivElement;
    private TimeDisplay!: HTMLSpanElement;
    private Volume!: HTMLButtonElement;
    private VolumeSlider!: HTMLInputElement;
    private Download!: HTMLButtonElement;
    private LoadingSpinner?: HTMLDivElement;
    private PlaybackSpeed!: HTMLButtonElement;
    private PlaybackSpeedDropdown!: HTMLDivElement;
    private PlaybackText!: HTMLSpanElement;

    // State Properties
    private playerDuration: number = 0;
    private isSeeking: boolean = false;
    private hideControlsTimeoutId?: number;
    private spacebarPressTimer: number | null = null;
    private isSpacebarLongPress: boolean = false;

    // Constants
    private readonly INACTIVITY_DELAY = 1500;
    private readonly LONG_PRESS_THRESHOLD = 500;
    private readonly SEEK_TIME_SECONDS = 5;

    constructor(player: DALPlayer) {
        this.player = player;
        this.container = player.getContainer();
        this.pluginCache = this.player.list();
        this.buildUI();
        this.bindEventListeners();
        this.initializeUIState();
    }

    public destroy(): void {
        this.uiWrapper?.remove();
        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
        window.removeEventListener('resize', this.onWindowResize);
    }

    // UI Construction
    private buildUI(): void {
        this.createUiWrapper();
        this.injectStyles();
        this.setupPoster();
        this.setupBottomControls();
        this.setupCaptionsArea();
        this.container.appendChild(this.uiWrapper);
    }

    private createUiWrapper(): void {
        this.uiWrapper = document.createElement('div');
        this.uiWrapper.id = "DALPlayer-ui-wrapper";
        this.uiWrapper.tabIndex = 0;
        const video = this.container.querySelector('video');
        if (video) this.uiWrapper.appendChild(video);
    }

    private injectStyles(): void {
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = Styles;
        this.uiWrapper.prepend(styleSheet);
    }

    private setupPoster(): void {
        if (!this.player.isPoster()) return;
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

    private setupBottomControls(): void {
        const {Bottom, BottomUpperLeft, BottomLowerLeft, BottomLowerRight} = BottomControls();
        this.BottomControls = Bottom;
        this.BottomUpperLeftControls = BottomUpperLeft;
        this.BottomLowerLeftControls = BottomLowerLeft;
        this.BottomLowerRightControls = BottomLowerRight;
        this.setupSeekBar();
        this.setupPlayPauseControl();
        this.setupVolumeControl();
        this.setupTimeDisplay();
        this.setupPiPControl();
        this.setupPlaybackSpeedControl();
        this.setupLoopControl();
        this.setupCaptionsControl();
        this.setupDownloadControl();
        this.setupFullscreenControl();
        this.uiWrapper.appendChild(this.BottomControls);
    }

    private setupCaptionsArea(): void {
        const captionsPlugin = this.pluginCache["captions"];
        if (!captionsPlugin?.hasCaptions()) return;
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

    // Individual Control Setup

    private setupSeekBar(): void {
        this.SeekBar = SeekBarControl();
        this.BottomUpperLeftControls.appendChild(this.SeekBar);
    }

    private setupPlayPauseControl(): void {
        this.PlayPause = PlayPauseControl();
        this.BottomLowerLeftControls.appendChild(this.PlayPause);
    }

    private setupVolumeControl(): void {
        const {volumeContainer, volumeIcon, volumeSlider} = VolumeControl();
        this.Volume = volumeIcon;
        this.VolumeSlider = volumeSlider;
        this.VolumeSlider.value = this.player.getVolume().toString();
        this.BottomLowerLeftControls.appendChild(volumeContainer);
    }

    private setupTimeDisplay(): void {
        this.TimeDisplay = TimeDisplayControl();
        this.BottomLowerLeftControls.appendChild(this.TimeDisplay);
    }

    private setupPiPControl(): void {
        if (!this.pluginCache["picture_in_picture"]) return;
        this.PiP = PiPControl();
        this.BottomLowerRightControls.appendChild(this.PiP);
    }

    private setupPlaybackSpeedControl(): void {
        const playbackSpeedPlugin = this.pluginCache["playback_speed"];
        if (!playbackSpeedPlugin) return;
        const {PlaybackSpeedContainer, PlaybackSpeedButton, PlaybackSpeedDropdown} = PlaybackSpeedControl(
            playbackSpeedPlugin.getOptions(),
            playbackSpeedPlugin.getDefaultPlaybackSpeed()
        );
        this.PlaybackSpeed = PlaybackSpeedButton;
        this.PlaybackSpeedDropdown = PlaybackSpeedDropdown;
        this.BottomLowerRightControls.appendChild(PlaybackSpeedContainer);
    }

    private setupLoopControl(): void {
        if (!this.pluginCache["loop"]) return;
        this.Loop = LoopControl();
        this.BottomLowerRightControls.appendChild(this.Loop);
    }

    private setupCaptionsControl(): void {
        const captionsPlugin = this.pluginCache["captions"];
        if (!captionsPlugin?.hasCaptions()) return;
        const {CaptionsContainer, CaptionsButton, CaptionsDropdown} = CaptionsControl(
            captionsPlugin.getCaptionTracksLabels(),
            captionsPlugin.getSelectedCaptionTrack()
        );
        this.Captions = CaptionsButton;
        this.CaptionsDropdown = CaptionsDropdown;
        this.BottomLowerRightControls.appendChild(CaptionsContainer);
    }

    private setupDownloadControl(): void {
        if (!this.pluginCache["download"]) return;
        this.Download = DownloadControl();
        this.BottomLowerRightControls.appendChild(this.Download);
    }

    private setupFullscreenControl(): void {
        this.Fullscreen = FullscreenControl();
        this.BottomLowerRightControls.appendChild(this.Fullscreen);
    }

    // Event Binding

    private bindEventListeners(): void {
        this.bindPlayerEvents();
        this.bindUIEvents();
        this.bindShortcutEvents();
    }

    private bindPlayerEvents(): void {
        this.player.on('play', this.onPlay);
        this.player.on('ended', this.onEnded);
        this.player.on('pause', this.onPause);
        this.player.on('loadedmetadata', this.updateTimeDisplay);
        this.player.on('timeupdate', this.onTimeUpdate);
        this.player.on('volumechange', this.updateVolumeUI);
        this.player.on('progress', this.updateBufferedProgress);
        this.player.on('waiting', this.showLoadingSpinner);
        this.player.on('playing', this.hideLoadingSpinner);
        this.player.on('stalled', this.showLoadingSpinner);
        this.player.on('canplay', this.hideLoadingSpinner);
        this.player.on('loop', this.updateLoopButton);
        this.player.on('pip', this.updatePiPButton);
        this.player.on('caption-cuechange', this.updateCaptionsText);
    }

    private bindUIEvents(): void {
        // Inactivity timer
        this.uiWrapper.addEventListener('mousemove', this.resetInactivityTimer);
        this.uiWrapper.addEventListener('touchstart', this.resetInactivityTimer, {passive: true});
        this.uiWrapper.addEventListener('keydown', this.resetInactivityTimer);
        // Window events
        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('fullscreenchange', this.onFullscreenChange);
        // Control events
        this.PlayPause.addEventListener("click", () => this.player.togglePlayPause());
        this.Fullscreen.addEventListener("click", () => this.player.toggleFullscreen());
        this.Volume.addEventListener("click", () => this.player.toggleVolume());
        this.VolumeSlider.addEventListener('input', (e) => this.handleVolumeSlider(parseFloat((e.target as HTMLInputElement).value)));
        // Seekbar
        this.SeekBar.addEventListener('pointerdown', this.handleSeekBarPointerDown);
        window.addEventListener('pointermove', this.handleSeekBarPointerMove);
        window.addEventListener('pointerup', this.handleSeekBarPointerUp);
        this.SeekBar.addEventListener('seek', (e: any) => this.player.setSeekPosition(e.detail));
        // Plugin Controls
        this.PiP?.addEventListener("click", () => this.pluginCache["picture_in_picture"]?.togglePip());
        this.Loop?.addEventListener("click", () => this.pluginCache["loop"]?.toggleLoop());
        this.Download?.addEventListener("click", () => this.pluginCache["download"]?.downloadVideo(this.container));
        this.Captions?.addEventListener("click", () => this.toggleDropdownVisibility(this.CaptionsDropdown));
        this.PlaybackSpeed?.addEventListener("click", () => this.toggleDropdownVisibility(this.PlaybackSpeedDropdown));
        // Dropdown Items
        this.CaptionsDropdown?.childNodes.forEach(child => child.addEventListener("click", (e) => this.handleCaptionChange(e.currentTarget as HTMLElement)));
        this.PlaybackSpeedDropdown?.childNodes.forEach(child => child.addEventListener("click", (e) => this.handlePlaybackSpeedChange(e.currentTarget as HTMLElement)));
    }

    private bindShortcutEvents(): void {
        this.uiWrapper.addEventListener('keydown', this.handleKeyDown);
        this.uiWrapper.addEventListener('keyup', this.handleKeyUp);
    }

    // Initial State

    private initializeUIState(): void {
        this.updateAllControls();
        if (!this.player.isPaused()) {
            this.scheduleHideControls();
        }
    }

    private updateAllControls(): void {
        this.updatePlayPauseButton();
        this.updateFullscreenToggleButton();
        this.updateVolumeUI();
        this.updateBufferedProgress();
        this.updateLoopButton();
        this.updatePiPButton();
        this.updateCaptionsFont();
    }

    // Player Event Handlers

    private onPlay = (): void => {
        this.hidePoster();
        this.updatePlayPauseButton();
        this.scheduleHideControls();
    };

    private onEnded = (): void => {
        this.showPoster();
    };

    private onPause = (): void => {
        this.updatePlayPauseButton();
        this.showUI();
    };

    private onTimeUpdate = (): void => {
        (this.SeekBar as any).setProgress(this.player.getSeekPosition());
        this.updateTimeDisplay();
    };

    // DOM Event Handlers

    private onWindowResize = (): void => this.updateCaptionsFont();
    private onFullscreenChange = (): void => {
        this.updateFullscreenToggleButton();
        this.updateCaptionsFont();
    };

    private handleSeekBarPointerDown = (e: PointerEvent): void => {
        this.isSeeking = true;
        updatePosition(e.clientX, this.SeekBar);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    private handleSeekBarPointerMove = (e: PointerEvent): void => {
        if (this.isSeeking) updatePosition(e.clientX, this.SeekBar);
    };

    private handleSeekBarPointerUp = (): void => {
        this.isSeeking = false;
    };

    private handleVolumeSlider(volume: number): void {
        const newVolume = Math.max(0, Math.min(volume, 1));
        this.player.setVolume(newVolume);
    }

    private handleCaptionChange(element: HTMLElement): void {
        const captionsPlugin = this.pluginCache["captions"];
        if (!captionsPlugin) return;

        captionsPlugin.setSelectedCaption(element.textContent || "Off");

        this.CaptionsDropdown.querySelector(".DALPlayer-captions-dropdown-item-active")?.classList.remove("DALPlayer-captions-dropdown-item-active");
        element.classList.add("DALPlayer-captions-dropdown-item-active");

        this.updateCaptionsText();
        this.updateCaptionsFont();
        this.toggleDropdownVisibility(this.CaptionsDropdown);
    }

    private handlePlaybackSpeedChange(element: HTMLElement): void {
        const playbackSpeedPlugin = this.pluginCache["playback_speed"];
        if (!playbackSpeedPlugin) return;

        const playbackRate = parseFloat(element.textContent || '1');
        playbackSpeedPlugin.setPlaybackSpeed(playbackRate);

        this.PlaybackSpeedDropdown.querySelector(".DALPlayer-playback-speed-dropdown-item-active")?.classList.remove("DALPlayer-playback-speed-dropdown-item-active");
        element.classList.add("DALPlayer-playback-speed-dropdown-item-active");

        this.toggleDropdownVisibility(this.PlaybackSpeedDropdown);
    }

    // UI Update Methods

    private updatePlayPauseButton = (): void => {
        this.PlayPause.innerHTML = this.player.isPaused() ? PlaySVG() : PauseSVG();
    };

    private updateFullscreenToggleButton = (): void => {
        this.Fullscreen.innerHTML = this.player.isFullscreen() ? FullscreenExitSVG() : FullscreenSVG();
    };

    private updateTimeDisplay = (): void => {
        if (!this.playerDuration) this.playerDuration = this.player.getDuration();
        if (this.playerDuration > 0) this.TimeDisplay.innerHTML = `${formatTime(this.player.getCurrentTime())} / ${formatTime(this.playerDuration)}`;
        else setTimeout(this.updateTimeDisplay, 500);
    };

    private updateVolumeUI = (): void => {
        const volume = this.player.getVolume();
        const isMuted = this.player.isMuted();

        if (volume === 0 || isMuted) this.Volume.innerHTML = VolumeMutedSVG();
        else if (volume < 0.33) this.Volume.innerHTML = VolumeLowSVG();
        else if (volume < 0.66) this.Volume.innerHTML = VolumeMediumSVG();
        else this.Volume.innerHTML = VolumeMaxSVG();

        this.VolumeSlider.value = isMuted ? '0' : volume.toString();
        const percentage = isMuted ? 0 : volume * 100;
        this.VolumeSlider.style.background = `linear-gradient(to right, var(--DALPlayer-white) ${percentage}%, var(--DALPlayer-white-30) ${percentage}%)`;
    };

    private updateBufferedProgress = (): void => {
        const bufferedEnd = this.player.getBufferedEnd();
        const duration = this.player.getDuration();
        if (duration > 0 && (this.SeekBar as any).setBuffered) (this.SeekBar as any).setBuffered((bufferedEnd / duration) * 100);
    };

    private updateLoopButton = (): void => {
        if (!this.Loop) return;
        this.Loop.innerHTML = this.pluginCache["loop"]?.isLooping() ? LoopExistSVG() : LoopSVG();
    };

    private updatePiPButton = (): void => {
        if (!this.PiP) return;
        this.PiP.innerHTML = this.pluginCache["picture_in_picture"]?.isPiP() ? PiPExitSVG() : PiPSVG();
    };

    private updateCaptionsText = (): void => {
        const activeTrack = this.pluginCache["captions"]?.getSelectedCaptionTrack();
        const activeCues = activeTrack?.activeCues ?? [];
        this.CaptionsText.innerHTML = Array.from(activeCues).map(cue => (cue as any).text).join("\n");
    };

    private updateCaptionsFont = (): void => {
        if (!this.CaptionsText) return;
        this.CaptionsText.style.fontSize = `${this.player.getVideoMetadata().cH * 0.04}px`;
    };

    // Loading Spinner

    private showLoadingSpinner = (): void => {
        if (!this.LoadingSpinner) {
            this.LoadingSpinner = LoadingSpinner();
            this.uiWrapper.prepend(this.LoadingSpinner);
        }
        this.LoadingSpinner.style.display = 'block';
    };

    private hideLoadingSpinner = (): void => {
        if (this.LoadingSpinner) this.LoadingSpinner.style.display = 'none';
    };

    // Controls Visibility

    private hideUI(): void {
        const isAnyDropdownOpen = (this.CaptionsDropdown?.style.display === 'block') || (this.PlaybackSpeedDropdown?.style.display === 'block');
        if (isAnyDropdownOpen) return;
        this.BottomControls.style.opacity = '0';
        this.BottomControls.style.pointerEvents = 'none';
    }

    private showUI(): void {
        this.BottomControls.style.opacity = '1';
        this.BottomControls.style.pointerEvents = 'auto';
    }

    private hidePoster(): void {
        if (this.uiPoster) {
            this.uiPoster.style.opacity = '0';
            this.uiPoster.style.pointerEvents = 'none';
        }
    }

    private showPoster(): void {
        if (this.uiPoster) {
            this.uiPoster.style.opacity = '1';
            this.uiPoster.style.pointerEvents = 'auto';
        }
    }

    private scheduleHideControls(): void {
        if (this.hideControlsTimeoutId) clearTimeout(this.hideControlsTimeoutId);
        this.hideControlsTimeoutId = window.setTimeout(() => {
            if (!this.player.isPaused() && !this.isSeeking) this.hideUI();
        }, this.INACTIVITY_DELAY);
    }

    private resetInactivityTimer = (): void => {
        this.showUI();
        this.scheduleHideControls();
    };

    // Keyboard Shortcuts

    private handleKeyDown = (e: KeyboardEvent): void => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

        // Spacebar long-press logic for 2x speed
        if (e.code === 'Space') {
            e.preventDefault();
            if (this.spacebarPressTimer === null) {
                this.spacebarPressTimer = window.setTimeout(() => {
                    this.toggleDoubleSpeed(true);
                    this.isSpacebarLongPress = true;
                }, this.LONG_PRESS_THRESHOLD);
            }
            return;
        }

        // Other shortcuts
        switch (e.code) {
            case 'ArrowRight':
                e.preventDefault();
                this.player.setSeekPosition(Math.min(this.player.getSeekPosition() + this.SEEK_TIME_SECONDS, this.player.getDuration()));
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.player.setSeekPosition(Math.max(this.player.getSeekPosition() - this.SEEK_TIME_SECONDS, 0));
                break;
            case 'KeyF':
                e.preventDefault();
                this.player.toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                this.player.toggleVolume();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.handleVolumeSlider(this.player.getVolume() + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.handleVolumeSlider(this.player.getVolume() - 0.1);
                break;
            case 'KeyL':
                e.preventDefault();
                this.pluginCache["loop"]?.toggleLoop();
                break;
            case 'KeyP':
                e.preventDefault();
                this.pluginCache["picture_in_picture"]?.togglePip();
                break;
        }
    };

    private handleKeyUp = (e: KeyboardEvent): void => {
        if (e.code !== 'Space') return;
        e.preventDefault();

        if (this.spacebarPressTimer) {
            clearTimeout(this.spacebarPressTimer);
            this.spacebarPressTimer = null;
        }

        if (this.isSpacebarLongPress) this.toggleDoubleSpeed(false);
        else this.player.togglePlayPause();

        this.isSpacebarLongPress = false;
    };

    // Utility Methods

    private toggleDropdownVisibility(dropdown: HTMLElement): void {
        dropdown.style.display = dropdown.style.display === "none" || !dropdown.style.display ? "block" : "none";
    }

    private toggleDoubleSpeed(enable: boolean): void {
        const playbackSpeedPlugin = this.pluginCache["playback_speed"];
        if (!this.player.isPlaying() || !playbackSpeedPlugin) return;
        if (enable) {
            this.PlaybackText = document.createElement('span');
            this.PlaybackText.className = "DALPlayer-playback-text";
            this.PlaybackText.innerHTML = `2x ${DoubleSpeedSVG()}`;
            this.uiWrapper.appendChild(this.PlaybackText);
            playbackSpeedPlugin.setPlaybackSpeed(2);
        } else {
            playbackSpeedPlugin.setPlaybackSpeed(playbackSpeedPlugin.getLastPlaybackSpeed() || 1);
            this.PlaybackText?.remove();
        }
    }
}