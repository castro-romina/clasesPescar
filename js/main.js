const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score1 = 0;
let score2 = 0;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5
};

const paddle1 = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    speed: 7
};

const paddle2 = {
    x: canvas.width - 35,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    speed: 7
};

const keys = {};

/* =========================
   EVENTOS DE TECLADO
========================= */

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

/* =========================
   DIBUJAR PELOTA
========================= */

function drawBall() {

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.closePath();
}

/* =========================
   DIBUJAR PALETAS
========================= */

function drawPaddle(paddle) {

    ctx.fillStyle = "white";

    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}

/* =========================
   LÍNEA CENTRAL
========================= */

function drawCenterLine() {

    ctx.setLineDash([10, 10]);

    ctx.beginPath();

    ctx.moveTo(canvas.width / 2, 0);

    ctx.lineTo(canvas.width / 2, canvas.height);

    ctx.strokeStyle = "white";

    ctx.stroke();

    ctx.setLineDash([]);
}

/* =========================
   MOVIMIENTO DE PALETAS
========================= */

function movePaddles() {

    // Jugador 1
    if (keys["a"] || keys["A"]) {
        paddle1.y -= paddle1.speed;
    }

    if (keys["z"] || keys["Z"]) {
        paddle1.y += paddle1.speed;
    }

    // Jugador 2
    if (keys["ArrowUp"]) {
        paddle2.y -= paddle2.speed;
    }

    if (keys["ArrowDown"]) {
        paddle2.y += paddle2.speed;
    }

    // Limitar jugador 1
    if (paddle1.y < 0) {
        paddle1.y = 0;
    }

    if (paddle1.y + paddle1.height > canvas.height) {
        paddle1.y = canvas.height - paddle1.height;
    }

    // Limitar jugador 2
    if (paddle2.y < 0) {
        paddle2.y = 0;
    }

    if (paddle2.y + paddle2.height > canvas.height) {
        paddle2.y = canvas.height - paddle2.height;
    }
}

/* =========================
   MOVIMIENTO DE PELOTA
========================= */

function moveBall() {

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebote arriba y abajo
    if (
        ball.y - ball.radius < 0 ||
        ball.y + ball.radius > canvas.height
    ) {

        ball.speedY *= -1;
    }

    // Colisión jugador 1
    if (
        ball.x - ball.radius < paddle1.x + paddle1.width &&
        ball.y > paddle1.y &&
        ball.y < paddle1.y + paddle1.height
    ) {

        ball.speedX *= -1;

        ball.x = paddle1.x + paddle1.width + ball.radius;
    }

    // Colisión jugador 2
    if (
        ball.x + ball.radius > paddle2.x &&
        ball.y > paddle2.y &&
        ball.y < paddle2.y + paddle2.height
    ) {

        ball.speedX *= -1;

        ball.x = paddle2.x - ball.radius;
    }

    // Punto jugador 2
    if (ball.x < 0) {

        score2++;

        updateScore();

        resetBall();
    }

    // Punto jugador 1
    if (ball.x > canvas.width) {

        score1++;

        updateScore();

        resetBall();
    }
}

/* =========================
   ACTUALIZAR SCORE
========================= */

function updateScore() {

    document.getElementById("score1").textContent = score1;

    document.getElementById("score2").textContent = score2;
}

/* =========================
   REINICIAR PELOTA
========================= */

function resetBall() {

    ball.x = canvas.width / 2;

    ball.y = canvas.height / 2;

    ball.speedX *= -1;

    ball.speedY = 5;
}

/* =========================
   DIBUJAR TODO
========================= */

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();

    drawBall();

    drawPaddle(paddle1);

    drawPaddle(paddle2);
}

/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    movePaddles();

    moveBall();

    draw();

    requestAnimationFrame(gameLoop);
}

/* =========================
   INICIAR JUEGO
========================= */

gameLoop();