const Coordinates = {
    x: 0,
    y: 0,
    setCoordinates: function (x, y) {
        this.x = x;
        this.y = y;
    },
    getCoordinates: () => ({ x: this.x, y: this.y }),
};

export default Coordinates;
