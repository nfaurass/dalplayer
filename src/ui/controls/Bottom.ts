export function BottomControls() {
    const Bottom = document.createElement('div');
    Object.assign(Bottom.style, {
        width: "100%",
        height: "30%",
        backgroundImage: "linear-gradient(to top, black 5%, black 5%, transparent 100%)",
        position: "absolute",
        bottom: 0,
        left: 0,
        minHeight: "80px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: "15px",
        padding: "2% 2%",
        boxSizing: "border-box"
    });

    const BottomUpper = document.createElement('div');
    Object.assign(BottomUpper.style, {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: "10px"
    });

    const BottomLower = document.createElement('div');
    Object.assign(BottomLower.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    });

    const BottomLowerLeft = document.createElement('div');
    Object.assign(BottomLowerLeft.style, {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        width: "50%"
    });

    const BottomLowerRight = document.createElement('div');
    Object.assign(BottomLowerRight.style, {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "20px",
        width: "50%"
    });

    const BottomUpperLeft = document.createElement('div');
    Object.assign(BottomUpperLeft.style, {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%"
    });

    const BottomUpperRight = document.createElement('div');
    Object.assign(BottomUpperRight.style, {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "auto"
    });

    BottomLower.appendChild(BottomLowerLeft);
    BottomLower.appendChild(BottomLowerRight);

    BottomUpper.appendChild(BottomUpperLeft);
    BottomUpper.appendChild(BottomUpperRight);

    Bottom.appendChild(BottomUpper);
    Bottom.appendChild(BottomLower);

    return {
        Bottom,
        BottomUpper,
        BottomUpperLeft,
        BottomUpperRight,
        BottomLower,
        BottomLowerLeft,
        BottomLowerRight
    };
}