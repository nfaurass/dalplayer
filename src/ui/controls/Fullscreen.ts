export default function FullscreenControl(): HTMLButtonElement {
    const FullscreenControl = document.createElement('button');
    FullscreenControl.id = "FullscreenControl";
    FullscreenControl.className = "DALPlayer-button";
    return FullscreenControl;
}