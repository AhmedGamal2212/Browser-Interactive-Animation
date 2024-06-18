import { SYNC_INTERVAL, SHAPE_HEIGHT, SHAPE_WIDTH } from './constants.js';
import Coordinates from './coordinates.js';
import Shape from './shape.js';
import { logMouseCoordinates } from './utils.js';
import setupEventListeners from './eventListeners.js';

const setup = () => {
    const cnv = document.getElementById('main-canvas');
    const ctx = cnv.getContext('2d');

    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    const mouseCoordinates = new Coordinates(
        window.innerWidth / 2 - SHAPE_WIDTH / 2,
        window.innerHeight / 2 - SHAPE_HEIGHT / 2
    );

    const shape = new Shape(mouseCoordinates);

    const drawShapeAtCoordinates = () => {
        shape.draw(ctx);
    };

    const syncIntervalId = setInterval(() => {
        syncShapes(shape, drawShapeAtCoordinates, ctx);
    }, SYNC_INTERVAL);

    logMouseCoordinates(mouseCoordinates, shape);

    setupEventListeners({
        syncIntervalId,
        cnv,
        mouseCoordinates,
        shape,
        drawShapeAtCoordinates,
    });

    drawShapeAtCoordinates();
};

const syncShapes = (shape, drawShapeAtCoordinates, ctx) => {
    if (!shape || shape.mouseDown) {
        return;
    }

    const shapes = JSON.parse(localStorage.getItem('shapes') || '{}');
    const otherShape = Object.values(shapes).find(
        (s) => s.id !== shape.ID && s.state
    );

    document.getElementById(
        'session-count-log'
    ).innerHTML = `<br><b>Other Shape:</b> ${JSON.stringify(otherShape)}`;

    if (!otherShape) {
        drawShapeAtCoordinates();
        return;
    }

    shape.setCoordinates(otherShape.x, otherShape.y);
    drawShapeAtCoordinates();

    shape.drawMouseHoldPosition(
        otherShape['x'] + otherShape['mouseDeltaX'],
        otherShape['y'] + otherShape['mouseDeltaY'],
        ctx
    );
};

setup();
