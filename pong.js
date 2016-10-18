// Hold our X and Y position.
class Vec {
  constructor(x = 0, y = 0) { // X & Y default to 0.
    this.x = x;
    this.y = y;
  }

  get len() { // The lenth of the vector (hypotenuse of a triangle).
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(value) { 
    const fact = value / this.len; // Calculate our factor.
    this.x *= fact; // Muliply the vectors by the factor.
    this.y *= fact; 
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

// Ball.
class Ball extends Rect {
  constructor() {
    super(10, 10); // Set the ball height and width.
    this.vel = new Vec;
  }
}

// Player.
class Player extends Rect {
  constructor() {
    super(20, 100); // Set the Player height and width.
    this.score = 0; // Score is zero initially.
  }
}

// Half.
class Half extends Rect {
  constructor() {
    super(10, 50); // Sets the height and width of the half way line.rect
  }
}

// Setup Pong.
class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this._accumulator = 0;
    this.step = 1/120;

    this.ball = new Ball;

    this.halfs = [
      new Half,
      new Half,
      new Half,
      new Half
    ];

    // The players.
    this.players = [
      new Player,
      new Player
    ];

    this.halfs.forEach(half => { // Initial Player position on the canvas.
      half.pos.x = this._canvas.width / 2;
    });

    this.halfs[0].pos.y = 50;
    this.halfs[1].pos.y = 150;
    this.halfs[2].pos.y = 250;
    this.halfs[3].pos.y = 350;

    this.players[0].pos.x = 100; // Us.
    this.players[1].pos.x = this._canvas.width - 100; // The competition.
    this.players.forEach(player => { // Initial Player position on the canvas.
      player.pos.y = this._canvas.height / 2;
    });

    let lastTime;
    const callback = (millis) => {
      if (lastTime) {
        this.update((millis - lastTime) / 1000);
        this.draw();
      }
      lastTime = millis; // Set the time
      requestAnimationFrame(callback);
    };
    callback();

    this.CHAR_PIXEL = 10;

    // Iterate through the array and paint 1's white, starts from 0 to 10.
    this.CHARS = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111',
    ].map(str => {
      const canvas = document.createElement('canvas');
      canvas.height = this.CHAR_PIXEL * 5;
      canvas.width = this.CHAR_PIXEL * 3;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      str.split('').forEach((fill, i) => {
        if (fill === '1') {
          context.fillRect(
            (i % 3) * this.CHAR_PIXEL, 
            (i / 3 | 0) * this.CHAR_PIXEL,
            this.CHAR_PIXEL,
            this.CHAR_PIXEL);
        }
      });
      return canvas;
    });

    this.reset();
  }

  // Collision detection.
  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      const len = ball.vel.len;
      ball.vel.x = -ball.vel.x;
      ball.vel.y += 300 * (Math.random() - .5);
      ball.vel.len = len * 1.25;
    }
  }

  // Draw the canvas, the players, ball and score.
  draw() {
    this._context.fillStyle = '#00004c';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.halfs.forEach(half => this.drawRect(half));
    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  // Draw our rectangles.
  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  // Draw the score.
  drawScore() {
    const align = this._canvas.width / 3 // Divide the canvas into 3 segments.
    const CHAR_W = this.CHAR_PIXEL * 4;
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split('');
      const offset = align * (index + 1) - (CHAR_W * chars.length / 2) + this.CHAR_PIXEL / 2;

      chars.forEach((char, pos) => {
        this._context.drawImage(this.CHARS[char|0], offset + pos * CHAR_W, 20);
      });
    });
  }

  // Reset the game.
  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  // Start the game.
  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1); // If it's more then .5, multiply by 1, if less, multipy by -1. 
      this.ball.vel.y = 300 * (Math.random() * 2 -1);
      this.ball.vel.len = 200;
    }
  }

  // Movement of the ball, edges, our unfair AI and player collision.
  simulate(dt) {
    // Movement of the ball is relative to the time difference of the update methods.
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    // Dectect if the ball hits the edges.
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 | 0; // Returns true or false and converts to an integer.
      this.players[playerId].score++;
      this.reset();
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    // Unfair AI, our opponent position matches the ball!
    this.players[1].pos.y = this.ball.pos.y;

    // Check for collison.
    this.players.forEach(player => this.collide(player, this.ball));
  }

  // Update the game.
  update(dt) {
    this._accumulator += dt;
    while(this._accumulator > this.step) {
      this.simulate(this.step);
      this._accumulator -= this.step;
    }
  }
}

// Access our canvas and set up our pong.
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

// Add in our player control.
canvas.addEventListener('mousemove', event => {
  const scale = event.offsetY / event.target.getBoundingClientRect().height;
  pong.players[0].pos.y = canvas.height * scale;
});

// Run the start method on click.
canvas.addEventListener('click', event => {
  pong.start();
});