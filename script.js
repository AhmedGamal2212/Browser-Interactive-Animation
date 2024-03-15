const SHAPE_WIDTH = 200, SHAPE_HEIGHT = 200;


let mouseX = window.innerWidth / 2 - SHAPE_WIDTH / 2;
let mouseY = window.innerHeight / 2 - SHAPE_HEIGHT / 2;
let ctx;
let shapeX = mouseX, shapeY = mouseY;
let mouseDown = false;


const setup = () => {
    const cnv = document.getElementById('main-canvas');
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;


    logMouseCoordinates();

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - cnv.offsetLeft;
        mouseY = event.clientY - cnv.offsetTop;
        logMouseCoordinates();

        if(mouseDown === true) {
            draw(mouseX, mouseY);
        }
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
    draw(shapeX, shapeY);
}

const draw = (x, y) => {
    ctx.clearRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
    shapeX = x;
    shapeY = y;
    ctx.fillRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
}

const logMouseCoordinates = () => {
    const dbgDev = document.getElementById("log");
    dbgDev.innerHTML = `<b>MouseX:</b> ${mouseX}, <b>MouseY:</b> ${mouseY}`;
    dbgDev.innerHTML += `<br> <b>ShapeX:</b> ${shapeX}, <b>ShapeY:</b> ${shapeY}`;
    dbgDev.innerHTML += `<br> <b>MouseDown:</b> ${mouseDown}`;

}

const checkMouseInbound = () => {
    return mouseX >= shapeX && mouseX <= (shapeX + SHAPE_WIDTH) 
        && mouseY >= shapeY && mouseY <= (shapeY + SHAPE_HEIGHT);
}

setup();