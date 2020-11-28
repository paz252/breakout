const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const startBtn = document.getElementById('startBtn');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

const ballSpeed = 5;

//Draw ball on canvas
function Ball(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = ballSpeed;
    this.dy = -ballSpeed;
}

Ball.prototype.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
}

Ball.prototype.update = function () {
    this.draw();

    this.x += this.dx;
    this.y += this.dy;

    //Wall detection
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.dx = -this.dx;
    }

    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.dy = -this.dy;
    }

    //Paddle collision
    if (this.x - this.radius > paddle.x && this.x + this.radius < paddle.x + paddle.width && this.y + this.radius > paddle.y) {
        this.dy = -this.dy;
    }

    //Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (this.x - this.radius > brick.x && //left brick side check
                    this.x + this.radius < brick.x + brick.width && //right brick side check
                    this.y + this.radius > brick.y && //top brick side check
                    this.y - this.radius < brick.y + brick.height //bottom brick side check
                ) {
                    this.dy = -this.dy;
                    brick.visible = false;
                    increaseScore();
                }
            }
        })
    })

    //Lose condition
    if (this.y + this.radius > canvas.height - 10) {
        showAllBricks();
        score = 0;
    }
}

//Increase score
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) == 0) {
        showAllBricks();
    }
}

//Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        })
    })
}

//Draw paddle on canvas
function Paddle(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dx = 0;
}

Paddle.prototype.draw = function () {
    c.beginPath();
    c.rect(this.x, this.y, this.width, this.height, this.color);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
}

Paddle.prototype.update = function () {
    this.draw();

    this.x += this.dx;

    //Wall detection
    if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
    } else if (this.x < 0) {
        this.x = 0;
    }
}

//Draw bricks on canvas
function Brick(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.visible = true;
}

Brick.prototype.draw = function () {
    c.beginPath();
    c.rect(this.x, this.y, this.width, this.height, this.color);
    c.fillStyle = this.visible ? this.color : 'transparent';
    c.fill();
    c.closePath();
}

Brick.prototype.update = function () {
    this.draw();
}

let bricks;

function init() {
    bricks = [];
    for (let i = 0; i < brickRowCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickColumnCount; j++) {
            const padding = 10;
            const width = 70;
            const height = 20;
            const offsetX = 45;
            const offsetY = 60;
            const x = i * (width + padding) + offsetX;
            const y = j * (height + padding) + offsetY;
            bricks[i][j] = new Brick(x, y, width, height, '#0095dd');
        }
    }
}

//Draw score on canvas
function drawScore() {
    c.font = '20px Arial';
    c.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

const ball = new Ball(canvas.width / 2, canvas.height / 2, 8, '#0095dd');

const paddle = new Paddle(canvas.width / 2 - 40, canvas.height - 20, 80, 10, '#0095dd');

function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);

    ball.update();
    paddle.update();

    drawScore();

    bricks.forEach(column => {
        column.forEach(brick => {
            brick.update();
        })
    })
}

startBtn.addEventListener('click',()=>{
    startBtn.classList.add('hide');
    init();
    animate();
})

//Keyboard event handlers
document.addEventListener('keydown', e => {
    if (e.key == 'ArrowLeft' || e.key == 'Left') {
        paddle.dx = -10;
    } else if (e.key == 'ArrowRight' || e.key == 'Right') {
        paddle.dx = 10;
    }
})

document.addEventListener('keyup', e => {
    if (e.key == 'ArrowLeft' || e.key == 'Left' || e.key == 'ArrowRight' || e.key == 'Right') {
        paddle.dx = 0;
    }
})

//Rules and close button event handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
})

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
})
