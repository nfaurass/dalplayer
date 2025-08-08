export default function FullscreenControl(): HTMLButtonElement {
    const FullscreenControl = document.createElement('button');
    FullscreenControl.id = "FullscreenControl";
    FullscreenControl.style.position = 'absolute';
    FullscreenControl.style.bottom = '10px';
    FullscreenControl.style.right = '10px';
    FullscreenControl.style.border = "none";
    FullscreenControl.style.outline = "none";
    FullscreenControl.style.backgroundColor = "transparent";
    return FullscreenControl;
}