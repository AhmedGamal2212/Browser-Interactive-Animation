let x = window.innerWidth / 2, y = window.innerHeight / 2;
let ctx;

const setup = () => {
    const cnv = document.getElementById('main-canvas');
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    const dbgDev = document.getElementById("log");
    dbgDev.innerHTML = `current X: ${x}, current Y: ${y}`;

    logMouseCoordinates();

    window.addEventListener('mousemove', (e) => {
        x = e.clientX;
        y = e.clientY;
        logMouseCoordinates();
    });

    ctx = cnv.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 50, 50);
}

const logMouseCoordinates = () => {
    const dbgDev = document.getElementById("log");
    dbgDev.innerHTML = `current X: ${x}, current Y: ${y}`;
}

const changePos = () => {
    ctx.clearRect(x, y, 50, 50);
    if(x == 450) {
        y += 50;
        x = 0;
    } else {
        x += 50;
    }
    ctx.fillRect(x, y, 50, 50);
}

setup();

