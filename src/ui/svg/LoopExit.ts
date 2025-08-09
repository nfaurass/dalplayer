export default function LoopExistSVG(color: string = "#fff") {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         data-icon="LoopExist" aria-hidden="true" class="svg-icon svg-icon-dalplayerLoopExist">
            <path d="m17 2 4 4-4 4"/>
            <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
            <path d="m7 22-4-4 4-4"/>
            <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
            <line x1="3" y1="3" x2="21" y2="21"/>
        </svg>
    `;
}