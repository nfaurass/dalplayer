import PlaybackSpeedSVG from "../svg/PlaybackSpeed";

export default function PlaybackSpeedControl() {
    const PlaybackSpeedContainer = document.createElement('div');
    PlaybackSpeedContainer.style.position = "relative";

    const PlaybackSpeedButton = document.createElement('button');
    PlaybackSpeedButton.id = "PlaybackSpeedControl";
    PlaybackSpeedButton.innerHTML = PlaybackSpeedSVG();
    PlaybackSpeedButton.className = "DALPlayer-button";
    PlaybackSpeedContainer.appendChild(PlaybackSpeedButton);

    const PlaybackSpeedDropdown = document.createElement('div');
    PlaybackSpeedDropdown.className = "DALPlayer-playback-speed-dropdown";
    ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"].forEach(label => {
        const item = document.createElement('div');
        item.textContent = label;
        item.className = "DALPlayer-playback-speed-dropdown-item";
        PlaybackSpeedDropdown.appendChild(item);
    });
    PlaybackSpeedContainer.appendChild(PlaybackSpeedDropdown);

    return {PlaybackSpeedContainer, PlaybackSpeedDropdown, PlaybackSpeedButton};
}