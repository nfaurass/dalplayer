export default function FullscreenSVG(color: string = "#fff") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" width="24" height="24"
             data-icon="FullscreenEnterStandard" aria-hidden="true" class="svg-icon svg-icon-dalplayerFullscreen">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M0 5C0 3.89543 0.895431 3 2 3H9V5H2V9H0V5ZM22 5H15V3H22C23.1046 3 24 3.89543 24 5V9H22V5ZM2 15V19H9V21H2C0.895431 21 0 20.1046 0 19V15H2ZM22 19V15H24V19C24 20.1046 23.1046 21 22 21H15V19H22Z"
                   fill="${color}">
            </path>
        </svg>
    `
}