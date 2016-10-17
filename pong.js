// Hold our X and Y position.
class Vec {
  // X & Y default to 0.
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

// Data structure for our Rectangles.
class Rect {
  // Width and Height.
  constructor(w, h) {
    this.pos = new Vec; // It needs a position.
    this.size = new Vec(w, h); // It needs a Size.
  }
}

// Access the canvas and its context.
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Fill the canvas and draw it.
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

// Draw ball.
context.fillStyle = '#fff';
context.fillRect(0, 0, 10, 10);