import LoopSVG from "../svg/Loop";

export default function LoopControl(): HTMLButtonElement {
    const LoopControl = document.createElement('button');
    LoopControl.id = "LoopControl";
    LoopControl.innerHTML = LoopSVG();
    LoopControl.style.border = "none";
    LoopControl.style.outline = "none";
    LoopControl.style.backgroundColor = "transparent";
    return LoopControl;
}