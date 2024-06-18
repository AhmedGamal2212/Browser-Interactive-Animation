class Coordinates {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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
