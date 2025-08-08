export default function FullscreenControl(): HTMLButtonElement {
    const FullscreenControl = document.createElement('button');
    FullscreenControl.id = "FullscreenControl";
    FullscreenControl.style.border = "none";
    FullscreenControl.style.outline = "none";
    FullscreenControl.style.backgroundColor = "transparent";
    return FullscreenControl;
}