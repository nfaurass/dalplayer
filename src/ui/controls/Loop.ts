import LoopSVG from "../svg/Loop";

export default function LoopControl(): HTMLButtonElement {
    const LoopControl = document.createElement('button');
    LoopControl.id = "LoopControl";
    LoopControl.innerHTML = LoopSVG();
    LoopControl.className = "DALPlayer-button";
    return LoopControl;
}