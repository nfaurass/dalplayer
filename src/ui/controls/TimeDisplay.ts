export default function TimeDisplayControl(): HTMLSpanElement {
    const TimeDisplay = document.createElement('span');
    TimeDisplay.id = "TimeDisplay";
    TimeDisplay.innerText = "0:00 / 0:00";
    TimeDisplay.className = "DALPlayer-time-display";
    return TimeDisplay;
}