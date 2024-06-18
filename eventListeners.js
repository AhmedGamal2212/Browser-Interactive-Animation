import { logMouseCoordinates } from './utils.js';

const setupEventListeners = ({
    syncIntervalId,
    cnv,
    mouseCoordinates,
    shape,
    drawShapeAtCoordinates,
}) => {

    const handleMouseMove = (event) => {
        mouseCoordinates.setCoordinates(
            event.clientX + window.scrollX - cnv.offsetLeft,
            event.clientY + window.scrollY - cnv.offsetTop
        );

        logMouseCoordinates(mouseCoordinates, shape);

        if (shape.mouseDown) {
            shape.setCoordinates(
                mouseCoordinates.x - shape.deltaCoordinates.x,
                mouseCoordinates.y - shape.deltaCoordinates.y
            );
            drawShapeAtCoordinates();
        }
    };

    const handleMouseDown = (event) => {
        if (shape.checkMouseInbound(mouseCoordinates)) {
            shape.setDeltaCoordinates(
                Math.abs(mouseCoordinates.x - shape.coordinates.x),
                Math.abs(mouseCoordinates.y - shape.coordinates.y)
            );
            shape.setMouseDown(true);
        }
        logMouseCoordinates(mouseCoordinates, shape);
    };

    const handleMouseUp = (event) => {
        shape.setMouseDown(false);
        logMouseCoordinates(mouseCoordinates, shape);
    };

    const handleBeforeUnload = (event) => {
        const shapes = JSON.parse(localStorage.getItem('shapes') || '{}');
        delete shapes[shape.ID];
        localStorage.setItem('shapes', JSON.stringify(shapes));
        clearInterval(syncIntervalId);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('beforeunload', handleBeforeUnload);
};

export default setupEventListeners;