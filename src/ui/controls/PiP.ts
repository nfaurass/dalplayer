import PiPSVG from "../svg/PiP";

export default function PiPControl(): HTMLButtonElement {
    const PiPControl = document.createElement('button');
    PiPControl.id = "PiPControl";
    PiPControl.innerHTML = PiPSVG();
    PiPControl.style.border = "none";
    PiPControl.style.outline = "none";
    PiPControl.style.backgroundColor = "transparent";
    return PiPControl;
}