export default function PlayPauseControl(): HTMLButtonElement {
    const PlayPauseControl = document.createElement('button');
    PlayPauseControl.id = "PlayPauseControl";
    PlayPauseControl.style.border = "none";
    PlayPauseControl.style.outline = "none";
    PlayPauseControl.style.backgroundColor = "transparent";
    return PlayPauseControl;
}