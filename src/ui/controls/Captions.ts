import SubtitlesSVG from "../svg/Subtitles";

export default function CaptionsControl(): HTMLButtonElement {
    const CaptionsControl = document.createElement('button');
    CaptionsControl.id = "CaptionsControl";
    CaptionsControl.innerHTML = SubtitlesSVG();
    CaptionsControl.className = "DALPlayer-button";
    return CaptionsControl;
}