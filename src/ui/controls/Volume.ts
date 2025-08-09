export default function VolumeControl(): HTMLButtonElement {
    const volumeIcon = document.createElement('button');
    volumeIcon.id = "VolumeIcon";
    volumeIcon.style.border = "none";
    volumeIcon.style.outline = "none";
    volumeIcon.style.backgroundColor = "transparent";
    return volumeIcon;
}