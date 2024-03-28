const SHAPE_WIDTH = 100,
    SHAPE_HEIGHT = 100;
const CIRCLE_RADIUS = 5;
const SHAPE_ID = crypto.randomUUID();
const SYNC_INTERVAL = 5;

let mouseX = window.innerWidth / 2 - SHAPE_WIDTH / 2;
let mouseY = window.innerHeight / 2 - SHAPE_HEIGHT / 2;
let deltaX, deltaY;
let ctx;
let shapeX = mouseX,
    shapeY = mouseY;
let mouseDown = false;
let counter = 1;

const setup = () => {
    const cnv = document.getElementById('main-canvas');
    const shapeColor = getShapeColor();
    let syncIntervalId;
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    (deltaX = 0), (deltaY = 0);
    logMouseCoordinates();
    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - cnv.offsetLeft;
        mouseY = event.clientY - cnv.offsetTop;
        logMouseCoordinates();
        if (mouseDown === true) {
            draw(mouseX - deltaX, mouseY - deltaY, shapeColor);
        }
    });

    window.addEventListener('mousedown', (event) => {
        if (checkMouseInbound()) {
            deltaX = Math.abs(mouseX - shapeX);
            deltaY = Math.abs(mouseY - shapeY);
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
        delete shapes[SHAPE_ID];
        localStorage.setItem('shapes', JSON.stringify(shapes));
        clearInterval(syncIntervalId);
    });

    ctx = cnv.getContext('2d');
    ctx.fillStyle = shapeColor;
    draw(shapeX, shapeY, shapeColor);

    syncIntervalId = setInterval(() => {
        syncShapes(shapeColor);
    }, SYNC_INTERVAL);
};

const draw = (x, y, color) => {
    const cnv = document.getElementById('main-canvas');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    shapeX = x;
    shapeY = y;
    ctx.fillRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
    storeCanvasDimensions(color);
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
    const numberOfShapes = Object.keys(JSON.parse(localStorage.getItem('shapes') ? localStorage.getItem('shapes') : "[]")).length;
    dbgDev.innerHTML = `<b>MouseX:</b> ${mouseX}, <b>MouseY:</b> ${mouseY}`;
    dbgDev.innerHTML += `<br> <b>ShapeX:</b> ${shapeX}, <b>ShapeY:</b> ${shapeY}`;
    dbgDev.innerHTML += `<br> <b>MouseDown:</b> ${mouseDown}`;
    dbgDev.innerHTML += `<br> <b>DeltaX:</b> ${deltaX}, <b>DeltaY:</b> ${deltaY}`;

    document.getElementById(
        'shapes-log'
    ).innerHTML = `<br> <b>Number of Shapes:</b> ${numberOfShapes} <br>`;
    // + <br> <b>Shapes:</b> ${localStorage.getItem('shapes')}`;
};

const checkMouseInbound = () => {
    return (
        mouseX >= shapeX &&
        mouseX <= shapeX + SHAPE_WIDTH &&
        mouseY >= shapeY &&
        mouseY <= shapeY + SHAPE_HEIGHT
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
        id: SHAPE_ID,
        x: shapeX,
        y: shapeY,
        color: shapeColor,
        state: mouseDown,
        mouseDeltaX: deltaX,
        mouseDeltaY: deltaY,
    };

    shapes[SHAPE_ID] = shape;
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
        if (key === SHAPE_ID) {
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
        draw(shapeX, shapeY, shapeColor);
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
