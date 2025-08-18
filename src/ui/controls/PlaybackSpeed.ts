import PlaybackSpeedSVG from "../svg/PlaybackSpeed";

export default function PlaybackSpeedControl(options: number[], defaultPlaybackSpeed: number) {
    const PlaybackSpeedContainer = document.createElement('div');
    PlaybackSpeedContainer.style.position = "relative";

    const PlaybackSpeedButton = document.createElement('button');
    PlaybackSpeedButton.id = "PlaybackSpeedControl";
    PlaybackSpeedButton.innerHTML = PlaybackSpeedSVG();
    PlaybackSpeedButton.className = "DALPlayer-button";
    PlaybackSpeedContainer.appendChild(PlaybackSpeedButton);

    const PlaybackSpeedDropdown = document.createElement('div');
    PlaybackSpeedDropdown.style.display = "none";
    PlaybackSpeedDropdown.className = "DALPlayer-playback-speed-dropdown";
    options.forEach(label => {
        const item = document.createElement('div');
        item.textContent = label.toString();
        item.className = label == defaultPlaybackSpeed ? "DALPlayer-playback-speed-dropdown-item DALPlayer-playback-speed-dropdown-item-active" : "DALPlayer-playback-speed-dropdown-item";
        PlaybackSpeedDropdown.appendChild(item);
    });
    PlaybackSpeedContainer.appendChild(PlaybackSpeedDropdown);

    return {PlaybackSpeedContainer, PlaybackSpeedDropdown, PlaybackSpeedButton};
}