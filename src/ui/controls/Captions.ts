import CaptionsSVG from "../svg/Captions";

export default function CaptionsControl(labels: string[], selectedCaption: TextTrack | null) {
    const CaptionsContainer = document.createElement('div');
    CaptionsContainer.style.position = "relative";

    const CaptionsButton = document.createElement('button');
    CaptionsButton.id = "CaptionsControl";
    CaptionsButton.innerHTML = CaptionsSVG();
    CaptionsButton.className = "DALPlayer-button";
    CaptionsContainer.appendChild(CaptionsButton);

    const CaptionsDropdown = document.createElement('div');
    CaptionsDropdown.style.display = "none";
    CaptionsDropdown.className = "DALPlayer-captions-dropdown";
    ["Off", ...labels].forEach(label => {
        const item = document.createElement('div');
        item.textContent = label;
        item.className = (selectedCaption?.label.toLowerCase() || "off") == label.toLowerCase() ? "DALPlayer-captions-dropdown-item DALPlayer-captions-dropdown-item-active" : "DALPlayer-captions-dropdown-item";
        CaptionsDropdown.appendChild(item);
    });
    CaptionsContainer.appendChild(CaptionsDropdown);

    return {CaptionsContainer, CaptionsDropdown, CaptionsButton};
}