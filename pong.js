// Hold our X and Y position.
class Vec {
  constructor(x = 0, y = 0) { // X & Y default to 0.
    this.x = x;
    this.y = y;
  }
}

// Data structure for our Rectangles.
class Rect {
  constructor(w, h) { // Width and Height.
    this.pos = new Vec; // It needs a position.
    this.size = new Vec(w, h); // It needs a Size.
  }

  get left() { // Left side of the ball.
    return this.pos.x - this.size.x / 2;
  }

  get right() { // Right side of the ball.
    return this.pos.x + this.size.x / 2;
  }

  get top() { // Top side of the ball.
    return this.pos.y - this.size.y / 2;
  }

  get bottom() { // Bottom side of the ball.
    return this.pos.y + this.size.y / 2;
  }
}

// Data structure for our Rectangles.
class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.vel = new Vec;
  }
}

// Player.
class Player extends Rect {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

//
class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;
    this.ball.pos.x = 100;
    this.ball.pos.y = 50;

    this.ball.vel.x = 100;
    this.ball.vel.y = 100;

    this.players = [
      new Player,
      new Player
    ];

    this.players[0].pos.x = 40; // Us
    this.players[1].pos.x = this._canvas.width - 40; // The competition
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    });

    let lastTime;
    const callback = (millis) => {
      if (lastTime) { // If we have a lastTime
        this.update((millis - lastTime) / 1000); // Calculate the diff & convert to whole seconds.
      }
      lastTime = millis; // Set the time
      requestAnimationFrame(callback);
    };
    callback();
  }

  draw() {
    // Fill the canvas and draw it.
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }

  drawRect(rect) {
    // Draw the ball.
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  update(dt) {
    // Movement of the ball is relative to the time difference of the update methods.
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    // Dectect if the ball hits the edges.
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = -this.ball.vel.x;
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.draw();
  }
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);