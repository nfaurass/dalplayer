import DownloadSVG from "../svg/Download";

export default function DownloadControl(): HTMLButtonElement {
    const DownloadControl = document.createElement('button');
    DownloadControl.id = "DownloadControl";
    DownloadControl.className = "DALPlayer-button";
    DownloadControl.innerHTML = DownloadSVG();
    return DownloadControl;
}