import {
    SHAPE_WIDTH,
    SHAPE_HEIGHT,
    CIRCLE_RADIUS,
    SYNC_INTERVAL,
    SHAPE_RADIUS,
} from './constants.js';

import Coordinates from './coordinates.js';

import { getRandomColor } from './utils.js';

let ctx;

let mouseDown = false;

const setup = () => {
    const cnv = document.getElementById('main-canvas');

    const mouseCoordinates = new Coordinates();
    const deltaCoordinates = new Coordinates();

    const shapeInfo = {
        ID: crypto.randomUUID(),
        coordinates: new Coordinates(),
        color: getRandomColor(),
    };

    mouseCoordinates.setCoordinates(
        window.innerWidth / 2 - SHAPE_WIDTH / 2,
        window.innerHeight / 2 - SHAPE_HEIGHT / 2
    );

    shapeInfo.coordinates.setCoordinates(
        mouseCoordinates.x,
        mouseCoordinates.y
    );

    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    deltaCoordinates.setCoordinates(0, 0);

    const syncIntervalId = setInterval(() => {
        syncShapes(shapeInfo);
    }, SYNC_INTERVAL);

    logMouseCoordinates(mouseCoordinates, deltaCoordinates, shapeInfo);

    const attachEventListenersParams = {
        syncIntervalId,
        cnv,
        mouseCoordinates,
        shapeInfo,
        deltaCoordinates,
    };

    attachEventListeners(attachEventListenersParams);

    ctx = cnv.getContext('2d');
    ctx.fillStyle = shapeInfo.color;
    draw(
        shapeInfo.coordinates.x,
        shapeInfo.coordinates.y,
        shapeInfo,
        deltaCoordinates
    );
};

const attachEventListeners = (params) => {
    const {
        syncIntervalId,
        cnv,
        mouseCoordinates,
        shapeInfo,
        deltaCoordinates,
    } = params;

    window.addEventListener('mousemove', (event) => {
        mouseCoordinates.setCoordinates(
            event.clientX + window.scrollX - cnv.offsetLeft,
            event.clientY + window.scrollY - cnv.offsetTop
        );

        logMouseCoordinates(mouseCoordinates, deltaCoordinates, shapeInfo);
        if (mouseDown === true) {
            draw(
                mouseCoordinates.x - deltaCoordinates.x,
                mouseCoordinates.y - deltaCoordinates.y,
                shapeInfo,
                deltaCoordinates
            );
        }
    });

    window.addEventListener('mousedown', (event) => {
        if (checkMouseInbound(mouseCoordinates, shapeInfo)) {
            deltaCoordinates.setCoordinates(
                Math.abs(mouseCoordinates.x - shapeInfo.coordinates.x),
                Math.abs(mouseCoordinates.y - shapeInfo.coordinates.y)
            );
            mouseDown = true;
            storeCanvasDimensions(shapeInfo.color);
        }
        logMouseCoordinates(mouseCoordinates, deltaCoordinates, shapeInfo);
    });

    window.addEventListener('mouseup', (event) => {
        mouseDown = false;
        storeCanvasDimensions(shapeInfo.color);
        logMouseCoordinates(mouseCoordinates, deltaCoordinates, shapeInfo);
    });

    window.addEventListener('beforeunload', (event) => {
        const shapes = JSON.parse(localStorage.getItem('shapes'));
        delete shapes[shapeInfo.ID];
        localStorage.setItem('shapes', JSON.stringify(shapes));
        clearInterval(syncIntervalId);
    });
};

const draw = (x, y, shapeInfo, deltaCoordinates) => {
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
    storeCanvasDimensions(shapeInfo, deltaCoordinates);
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

const logMouseCoordinates = (mouseCoordinates, deltaCoordinates) => {
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

const checkMouseInbound = (mouseCoordinates, shapeInfo) => {
    return (
        mouseCoordinates.x >= shapeInfo.coordinates.x &&
        mouseCoordinates.x <= shapeInfo.coordinates.x + SHAPE_WIDTH &&
        mouseCoordinates.y >= shapeInfo.coordinates.y &&
        mouseCoordinates.y <= shapeInfo.coordinates.y + SHAPE_HEIGHT
    );
};

function storeCanvasDimensions(shapeInfo, deltaCoordinates) {
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
        color: shapeInfo.color,
        state: mouseDown,
        mouseDeltaX: deltaCoordinates.x,
        mouseDeltaY: deltaCoordinates.y,
    };

    shapes[shapeInfo.ID] = shape;
    localStorage.setItem('shapes', JSON.stringify(shapes));
}

const syncShapes = (shapeInfo) => {
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
        draw(shapeInfo.coordinates.x, shapeInfo.coordinates.y, shapeInfo.color);
        return;
    }
    draw(otherShape['x'], otherShape['y'], shapeInfo);
    drawMouseHoldPosition(
        otherShape['x'] + otherShape['mouseDeltaX'],
        otherShape['y'] + otherShape['mouseDeltaY'],
        shapeInfo.color
    );
};

setup();
