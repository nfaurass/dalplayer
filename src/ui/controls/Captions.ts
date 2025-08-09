import SubtitlesSVG from "../svg/Subtitles";

export default function CaptionsControl(): HTMLButtonElement {
    const CaptionsControl = document.createElement('button');
    CaptionsControl.id = "CaptionsControl";
    CaptionsControl.innerHTML = SubtitlesSVG();
    CaptionsControl.style.border = "none";
    CaptionsControl.style.outline = "none";
    CaptionsControl.style.backgroundColor = "transparent";
    return CaptionsControl;
}