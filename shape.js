import { SHAPE_WIDTH, SHAPE_HEIGHT, SHAPE_RADIUS } from './constants.js';
import Coordinates from './coordinates.js';
import { getRandomColor, drawRoundedRect } from './utils.js';

export default class Shape {
    constructor(coordinates = {x: 0, y: 0}) {
        this.ID = crypto.randomUUID();
        this.coordinates = new Coordinates(coordinates.x, coordinates.y);
        this.deltaCoordinates = new Coordinates(0, 0);
        this.color = getRandomColor();
        this.mouseDown = false;
    }

    setCoordinates(x, y) {
        this.coordinates.setCoordinates(x, y);
        this.storeShapeState();
    }

    setDeltaCoordinates(x, y) {
        this.deltaCoordinates.setCoordinates(x, y);
        this.storeShapeState();
    }

    setMouseDown(state) {
        this.mouseDown = state;
        this.storeShapeState();
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = this.color;
        drawRoundedRect(
            this.coordinates.x,
            this.coordinates.y,
            SHAPE_WIDTH,
            SHAPE_HEIGHT,
            SHAPE_RADIUS,
            ctx
        );
    }

    storeShapeState() {
        const shapes = JSON.parse(localStorage.getItem('shapes') || '{}');
        shapes[this.ID] = {
            id: this.ID,
            x: this.coordinates.x,
            y: this.coordinates.y,
            color: this.color,
            state: this.mouseDown,
            mouseDeltaX: this.deltaCoordinates.x,
            mouseDeltaY: this.deltaCoordinates.y,
        };
        localStorage.setItem('shapes', JSON.stringify(shapes));
    }

    checkMouseInbound(mouseCoordinates) {
        return (
            mouseCoordinates.x >= this.coordinates.x &&
            mouseCoordinates.x <= this.coordinates.x + SHAPE_WIDTH &&
            mouseCoordinates.y >= this.coordinates.y &&
            mouseCoordinates.y <= this.coordinates.y + SHAPE_HEIGHT
        );
    }

    drawMouseHoldPosition(x, y, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, SHAPE_RADIUS, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'RED';
        ctx.fill();
        ctx.fillStyle = this.color;
    }
}
