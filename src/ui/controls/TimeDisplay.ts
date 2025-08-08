export default function TimeDisplayControl(): HTMLSpanElement {
    const TimeDisplay = document.createElement('span');
    TimeDisplay.id = "TimeDisplay";
    TimeDisplay.style.border = "none";
    TimeDisplay.style.color = "rgba(255,255,255,0.85)";
    TimeDisplay.style.outline = "none";
    TimeDisplay.style.fontSize = "1em";
    TimeDisplay.style.backgroundColor = "transparent";
    TimeDisplay.innerText = "1:40";
    return TimeDisplay;
}