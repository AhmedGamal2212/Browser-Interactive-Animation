# Browser-Interactive-Animation

This project demonstrates a browser-based animation where a shape is drawn on a canvas for each client. The shape can be moved by dragging it with the mouse, and its position is synchronized across all open local clients. The project also logs the states of the moving shapes and displays various properties of the current shape for each client.


https://github.com/AhmedGamal2212/Browser-Interactive-Animation/assets/94416115/3a8a6ca5-fedc-4554-b726-596130e2ac01


## Features

- **Unique Shape for Each Client**: Generates a different shape with a random color for each new client.
- **Drag and Drop**: Allows users to drag the shape using the mouse.
- **Synchronization**: Syncs the shapes' positions in all opened local clients, ensuring they move in the same direction as the moving one.
- **Mouse Hold Position**: Displays the mouse hold position for all other shapes.
- **State Logging**: Logs the states of the moving shapes and the current shape for each client.
- **Default Dark Theme**: The application comes with a default dark theme for a modern look and feel.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/AhmedGamal2212/Browser-Interactive-Animation.git
    cd Browser-Interactive-Animation
    ```

2. Open `index.html` in your favorite browser.

## Usage

1. Open the project in multiple tabs or windows within the same browser to see the synchronization in action.
2. Click and drag the shape to move it. The shape's position will be updated across all open clients.
3. Observe the log at the top of the page to see the current state and coordinates of the shape.

## Project Structure

```
.
├── index.html
├── styles.css
├── scripts
│ ├── main.js
│ ├── eventListeners.js
│ ├── shape.js
│ ├── coordinates.js
│ ├── constants.js
│ └── utils.js
├── README.md

```


- **index.html**: The main HTML file that includes the canvas element.
- **styles.css**: Contains the styles for the project.
- **scripts/**: Contains all JavaScript files.
  - **main.js**: The main setup file for the project.
  - **eventListeners.js**: Contains all event listeners.
  - **shape.js**: Defines the `Shape` class.
  - **coordinates.js**: Defines the `Coordinates` class.
  - **constants.js**: Contains constant values used throughout the project.
  - **utils.js**: Contains utility functions for logging, generating random colors, and syncing shapes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or new features you'd like to see.

