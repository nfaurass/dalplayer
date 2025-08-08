export default function PlayPauseControl(): HTMLButtonElement {
    const PlayPauseControl = document.createElement('button');
    PlayPauseControl.id = "PlayPauseControl";
    PlayPauseControl.style.position = 'absolute';
    PlayPauseControl.style.bottom = '10px';
    PlayPauseControl.style.left = '10px';
    PlayPauseControl.style.border = "none";
    PlayPauseControl.style.outline = "none";
    PlayPauseControl.style.backgroundColor = "transparent";
    return PlayPauseControl;
}