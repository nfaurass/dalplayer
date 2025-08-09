export default function LoadingSpinner() {
    const LoadingSpinner = document.createElement('div');
    LoadingSpinner.id = 'LoadingSpinner';
    Object.assign(LoadingSpinner.style, {
        width: '70px',
        height: '70px',
        border: '6px solid transparent',
        borderTopColor: 'white',
        borderRightColor: 'white',
        borderRadius: '50%',
        animation: 'DALPlayerSpin 1s linear infinite',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxSizing: 'border-box',
        zIndex: '10',
    });
    return LoadingSpinner;
}