export default function DoubleSpeedSVG(color: string = "#fff") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" width="24" height="24"
             data-icon="DoubleSpeed" aria-hidden="true" class="svg-icon svg-icon-dalplayerDoubleSpeed">
            <path fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  d="m6 17 5-5-5-5"/>
            <path fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  d="m13 17 5-5-5-5"/>
        </svg>
    `;
}