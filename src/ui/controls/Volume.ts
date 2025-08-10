export default function VolumeControl(): HTMLButtonElement {
    const volumeIcon = document.createElement('button');
    volumeIcon.id = "VolumeIcon";
    volumeIcon.className = "DALPlayer-button";
    return volumeIcon;
}