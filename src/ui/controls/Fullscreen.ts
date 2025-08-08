export default function FullscreenControl(): HTMLButtonElement {
    const PlayPauseControl = document.createElement('button');
    PlayPauseControl.id = "FullscreenControl";
    PlayPauseControl.style.position = 'absolute';
    PlayPauseControl.style.bottom = '10px';
    PlayPauseControl.style.right = '10px';
    PlayPauseControl.style.border = "none";
    PlayPauseControl.style.outline = "none";
    PlayPauseControl.style.backgroundColor = "transparent";
    return PlayPauseControl;
}