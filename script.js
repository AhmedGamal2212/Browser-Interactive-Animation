const SHAPE_WIDTH = 50, SHAPE_HEIGHT = 50;


let mouseX = 1024, mouseY = 500;
let ctx;
let shapeX = mouseX, shapeY = mouseY;
let mouseDown = false;


const setup = () => {
    const cnv = document.getElementById('main-canvas');
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    const dbgDev = document.getElementById("log");
    dbgDev.innerHTML = `current X: ${mouseX}, current Y: ${mouseY}`;

    logMouseCoordinates();

    window.addEventListener('mousemove', (event) => {
        mouseX = event.screenX;
        mouseY = event.screenY;
        logMouseCoordinates();
    });

    window.addEventListener('mousedown', (event) => {
        if(checkMouseInbound()){
            mouseDown = true;
        }
        logMouseCoordinates();
    });

    window.addEventListener('mouseup', (event) => {
        mouseDown = false;
        logMouseCoordinates();
    });

    ctx = cnv.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
}

const logMouseCoordinates = () => {
    const dbgDev = document.getElementById("log");
    dbgDev.innerHTML = `<b>MouseX:</b> ${mouseX}, <b>MouseY:</b> ${mouseY}`;
    dbgDev.innerHTML += `<br> <b>ShapeX:</b> ${shapeX}, <b>ShapeY:</b> ${shapeY}`;
    dbgDev.innerHTML += `<br> <b>MouseDown:</b> ${mouseDown}`;

}


const changePos = () => {
    ctx.clearRect(mouseX, mouseY, SHAPE_WIDTH, SHAPE_HEIGHT);
    if(mouseX == 450) {
        mouseY += 50;
        mouseX = 0;
    } else {
        mouseX += 50;
    }
    ctx.fillRect(mouseX, mouseY, SHAPE_WIDTH, SHAPE_HEIGHT);
}

const checkMouseInbound = () => {
    return true;
}

setup();

