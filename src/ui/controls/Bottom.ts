export function BottomControls() {
    const Bottom = document.createElement('div');
    Bottom.id = 'BottomControls';
    Bottom.className = "DALPlayer-bottom";

    const BottomUpper = document.createElement('div');
    BottomUpper.className = "DALPlayer-bottom-upper";

    const BottomLower = document.createElement('div');
    BottomLower.className = "DALPlayer-bottom-lower";

    const BottomLowerLeft = document.createElement('div');
    BottomLowerLeft.className = "DALPlayer-bottom-lower-left";

    const BottomLowerRight = document.createElement('div');
    BottomLowerRight.className = "DALPlayer-bottom-lower-right";

    const BottomUpperLeft = document.createElement('div');
    BottomUpperLeft.className = "DALPlayer-bottom-upper-left";

    // const BottomUpperRight = document.createElement('div');
    // BottomUpperRight.className = "DALPlayer-bottom-upper-right";

    BottomLower.appendChild(BottomLowerLeft);
    BottomLower.appendChild(BottomLowerRight);

    BottomUpper.appendChild(BottomUpperLeft);
    // BottomUpper.appendChild(BottomUpperRight);

    Bottom.appendChild(BottomUpper);
    Bottom.appendChild(BottomLower);

    return {
        Bottom,
        BottomUpper,
        BottomUpperLeft,
        // BottomUpperRight,
        BottomLower,
        BottomLowerLeft,
        BottomLowerRight
    };
}