const SHAPE_WIDTH = 200, SHAPE_HEIGHT = 200;
const SHAPE_ID = Math.floor(Math.random() * 100);

let mouseX = window.innerWidth / 2 - SHAPE_WIDTH / 2;
let mouseY = window.innerHeight / 2 - SHAPE_HEIGHT / 2;
let ctx;
let shapeX = mouseX, shapeY = mouseY;
let mouseDown = false;


const setup = () => {
    const cnv = document.getElementById('main-canvas');
    let shapeColor = getShapeColor();
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

    window.addEventListener('beforeunload', (event) => {
        const shapes = JSON.parse(localStorage.getItem('shapes'));
        delete shapes[SHAPE_ID];
        localStorage.setItem('shapes', JSON.stringify(shapes));
    });

    ctx = cnv.getContext("2d");
    ctx.fillStyle = shapeColor;
    draw(shapeX, shapeY, shapeColor);
}

const draw = (x, y, color) => {
    ctx.clearRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
    shapeX = x;
    shapeY = y;
    ctx.fillRect(shapeX, shapeY, SHAPE_WIDTH, SHAPE_HEIGHT);
    storeCanvasDimensions(color);
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

const getShapeColor = () => {
    if(localStorage.getItem("shapes") === null){
        return "green";
    }
    
    shapes = JSON.parse(localStorage.getItem("shapes"));
    if(Object.keys(shapes).length == 2){
        throw Error("Exceeded maximum shapes");
    }

    return shapes[Object.keys(shapes)[0]].color === "green" ? "blue" : "green";
}

function storeCanvasDimensions(shapeColor) {
    let shapes = localStorage.getItem("shapes");
    if(shapes == null) {
        shapes = {};
    } else {
        shapes = JSON.parse(shapes);
    }

    const shape = {
        id: SHAPE_ID,
        x: shapeX, 
        y: shapeY, 
        color: shapeColor, 
        state: mouseDown
    };
    shapes[SHAPE_ID] = shape;
    localStorage.setItem('shapes', JSON.stringify(shapes));
}


setup();