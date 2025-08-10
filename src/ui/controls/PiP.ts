import PiPSVG from "../svg/PiP";

export default function PiPControl(): HTMLButtonElement {
    const PiPControl = document.createElement('button');
    PiPControl.id = "PiPControl";
    PiPControl.innerHTML = PiPSVG();
    PiPControl.className = "DALPlayer-button";
    return PiPControl;
}