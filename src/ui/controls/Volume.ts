export default function VolumeControl(): {
    volumeIcon: HTMLButtonElement,
    volumeSlider: HTMLInputElement,
    volumeContainer: HTMLDivElement
} {
    const volumeIcon = document.createElement('button');
    volumeIcon.id = "VolumeIcon";
    volumeIcon.className = "DALPlayer-button";

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = '0';
    volumeSlider.className = 'DALPlayer-volume-slider';

    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'DALPlayer-volume-container';

    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeSlider);

    return {volumeIcon, volumeSlider, volumeContainer};
}