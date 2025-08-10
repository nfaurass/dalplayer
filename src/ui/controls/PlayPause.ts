export default function PlayPauseControl(): HTMLButtonElement {
    const PlayPauseControl = document.createElement('button');
    PlayPauseControl.id = "PlayPauseControl";
    PlayPauseControl.className = "DALPlayer-button";
    return PlayPauseControl;
}