class Coordinates {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}

export default Coordinates;
