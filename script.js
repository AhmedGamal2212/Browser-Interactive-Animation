import {
    SHAPE_WIDTH,
    SHAPE_HEIGHT,
    CIRCLE_RADIUS,
    SYNC_INTERVAL,
    SHAPE_RADIUS,
} from './constants.js';

import Coordinates from './coordinates.js';

const mouseCoordinates = Object.create(Coordinates);
const deltaCoordinates = Object.create(Coordinates);

const shapeInfo = {
    ID: crypto.randomUUID(),
    coordinates: Object.create(Coordinates),
};

mouseCoordinates.setCoordinates(
    window.innerWidth / 2 - SHAPE_WIDTH / 2,
    window.innerHeight / 2 - SHAPE_HEIGHT / 2
);

shapeInfo.coordinates.setCoordinates(mouseCoordinates.x, mouseCoordinates.y);

let ctx;

let mouseDown = false;

const setup = () => {
    const cnv = document.getElementById('main-canvas');
    const shapeColor = getShapeColor();
    let syncIntervalId;
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    deltaCoordinates.setCoordinates(0, 0);
    logMouseCoordinates();
    window.addEventListener('mousemove', (event) => {
        mouseCoordinates.setCoordinates(
            event.clientX + window.scrollX - cnv.offsetLeft,
            event.clientY + window.scrollY - cnv.offsetTop
        );

        logMouseCoordinates();
        if (mouseDown === true) {
            draw(
                mouseCoordinates.x - deltaCoordinates.x,
                mouseCoordinates.y - deltaCoordinates.y,
                shapeColor
            );
        }
    });

    window.addEventListener('mousedown', (event) => {
        if (checkMouseInbound()) {
            // TODO: fix mouseCoordinates.x, shapeInfo.coordinates.x
            deltaCoordinates.setCoordinates(
                Math.abs(mouseCoordinates.x - shapeInfo.coordinates.x),
                Math.abs(mouseCoordinates.y - shapeInfo.coordinates.y)
            );
            mouseDown = true;
            storeCanvasDimensions(shapeColor);
        }
        logMouseCoordinates();
    });

    window.addEventListener('mouseup', (event) => {
        mouseDown = false;
        storeCanvasDimensions(shapeColor);
        logMouseCoordinates();
    });

    window.addEventListener('beforeunload', (event) => {
        const shapes = JSON.parse(localStorage.getItem('shapes'));
        delete shapes[shapeInfo.ID];
        localStorage.setItem('shapes', JSON.stringify(shapes));
        clearInterval(syncIntervalId);
    });

    ctx = cnv.getContext('2d');
    ctx.fillStyle = shapeColor;
    draw(shapeInfo.coordinates.x, shapeInfo.coordinates.y, shapeColor);

    syncIntervalId = setInterval(() => {
        syncShapes(shapeColor);
    }, SYNC_INTERVAL);
};

const draw = (x, y, color) => {
    const cnv = document.getElementById('main-canvas');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    shapeInfo.coordinates.x = x;
    shapeInfo.coordinates.y = y;
    roundedRect(
        shapeInfo.coordinates.x,
        shapeInfo.coordinates.y,
        SHAPE_WIDTH,
        SHAPE_HEIGHT,
        SHAPE_RADIUS
    );
    storeCanvasDimensions(color);
};

const roundedRect = (x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
    ctx.stroke();
};

const drawMouseHoldPosition = (x, y, squareShapeColor) => {
    ctx.beginPath();
    ctx.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'RED';
    ctx.fill();
    ctx.fillStyle = squareShapeColor;
};

const logMouseCoordinates = () => {
    const dbgDev = document.getElementById('log');
    const numberOfShapes = Object.keys(
        JSON.parse(
            localStorage.getItem('shapes')
                ? localStorage.getItem('shapes')
                : '[]'
        )
    ).length;
    dbgDev.innerHTML = `<b>MouseX:</b> ${mouseCoordinates.x}, <b>MouseY:</b> ${mouseCoordinates.y}`;
    dbgDev.innerHTML += `<br> <b>ShapeX:</b> ${shapeInfo.coordinates.x}, <b>ShapeY:</b> ${shapeInfo.coordinates.y}`;
    dbgDev.innerHTML += `<br> <b>MouseDown:</b> ${mouseDown}`;
    dbgDev.innerHTML += `<br> <b>DeltaX:</b> ${deltaCoordinates.x}, <b>DeltaY:</b> ${deltaCoordinates.y}`;

    document.getElementById(
        'shapes-log'
    ).innerHTML = `<br> <b>Number of Shapes:</b> ${numberOfShapes} <br>`;
};

const checkMouseInbound = () => {
    return (
        mouseCoordinates.x >= shapeInfo.coordinates.x &&
        mouseCoordinates.x <= shapeInfo.coordinates.x + SHAPE_WIDTH &&
        mouseCoordinates.y >= shapeInfo.coordinates.y &&
        mouseCoordinates.y <= shapeInfo.coordinates.y + SHAPE_HEIGHT
    );
};

const getShapeColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

function storeCanvasDimensions(shapeColor) {
    let shapes = localStorage.getItem('shapes');
    if (shapes == null) {
        shapes = {};
    } else {
        shapes = JSON.parse(shapes);
    }

    const shape = {
        id: shapeInfo.ID,
        x: shapeInfo.coordinates.x,
        y: shapeInfo.coordinates.y,
        color: shapeColor,
        state: mouseDown,
        mouseDeltaX: deltaCoordinates.x,
        mouseDeltaY: deltaCoordinates.y,
    };

    shapes[shapeInfo.ID] = shape;
    localStorage.setItem('shapes', JSON.stringify(shapes));
}

const syncShapes = (shapeColor) => {
    if (mouseDown) {
        return;
    }
    const shapes = JSON.parse(localStorage.getItem('shapes'));

    if (shapes === null) {
        return;
    }
    let otherShape;
    for (const key of Object.keys(shapes)) {
        if (key === shapeInfo.ID) {
            continue;
        }
        if (shapes[key].state) {
            otherShape = shapes[key];
        }
    }
    document.getElementById(
        'session-count-log'
    ).innerHTML = `<br><b>Other Shape:</b> ${JSON.stringify(otherShape)}`;
    if (otherShape === undefined || otherShape['state'] === false) {
        draw(shapeInfo.coordinates.x, shapeInfo.coordinates.y, shapeColor);
        return;
    }
    draw(otherShape['x'], otherShape['y'], shapeColor);
    drawMouseHoldPosition(
        otherShape['x'] + otherShape['mouseDeltaX'],
        otherShape['y'] + otherShape['mouseDeltaY'],
        shapeColor
    );
};

setup();
