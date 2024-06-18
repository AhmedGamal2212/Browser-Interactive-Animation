const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const drawRoundedRect = (x, y, width, height, radius, ctx) => {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
    ctx.stroke();
};

const logMouseCoordinates = (mouseCoordinates, shape) => {
    const dbgDev = document.getElementById('log');
    const numberOfShapes = Object.keys(
        JSON.parse(localStorage.getItem('shapes') || '{}')
    ).length;

    dbgDev.innerHTML = `<b>MouseX:</b> ${mouseCoordinates.x}, <b>MouseY:</b> ${mouseCoordinates.y}`;
    dbgDev.innerHTML += `<br> <b>ShapeX:</b> ${shape.coordinates.x}, <b>ShapeY:</b> ${shape.coordinates.y}`;
    dbgDev.innerHTML += `<br> <b>MouseDown:</b> ${shape.mouseDown}`;
    dbgDev.innerHTML += `<br> <b>DeltaX:</b> ${shape.deltaCoordinates.x}, <b>DeltaY:</b> ${shape.deltaCoordinates.y}`;

    document.getElementById(
        'shapes-log'
    ).innerHTML = `<br> <b>Number of Shapes:</b> ${numberOfShapes} <br>`;
};

export { getRandomColor, drawRoundedRect, logMouseCoordinates };
