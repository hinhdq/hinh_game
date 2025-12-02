// Lấy DOM
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");

const player = document.getElementById("player");
const answers = [
    document.getElementById("a1"),
    document.getElementById("a2"),
    document.getElementById("a3")
];

const questionText = document.getElementById("question");
const scoreText = document.getElementById("score");
const gameoverText = document.getElementById("gameover");
const restartBtn = document.getElementById("restartBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const particles = document.getElementById("particles");

const soundCorrect = document.getElementById("soundCorrect");
const soundWrong = document.getElementById("soundWrong");

// Biến điều khiển
let score = 0;
let correctAnswer = 0;
let gameRunning = false;
let loopInterval = null;

// Vị trí X của 3 đáp án
const positions = [40, 160, 280];

// ------------------ BẮT ĐẦU GAME ------------------
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameArea.style.display = "block";
    startGame();
});

// ------------------ RESTART ------------------
restartBtn.addEventListener("click", () => startGame());

// ------------------ DI CHUYỂN ------------------
document.addEventListener("keydown", e => {
    if (!gameRunning) return;
    let left = parseInt(player.style.left);
    if (e.key === "ArrowLeft") movePlayer(left - 20);
    if (e.key === "ArrowRight") movePlayer(left + 20);
});
leftBtn.onclick = () => movePlayer(parseInt(player.style.left) - 20);
rightBtn.onclick = () => movePlayer(parseInt(player.style.left) + 20);

function movePlayer(newX) {
    if (newX < 0) newX = 0;
    if (newX > 316) newX = 316;
    player.style.left = newX + "px";
}

// ------------------ CÂU HỎI ------------------
function newQuestion() {
    let a = Math.floor(Math.random() * 10 + 1);
    let b = Math.floor(Math.random() * 10 + 1);
    let op = Math.random() > 0.5 ? "+" : "-";

    correctAnswer = op === "+" ? a + b : a - b;
    questionText.innerText = `${a} ${op} ${b} = ?`;

    // Random vị trí
    let shuffled = positions.sort(() => Math.random() - 0.5);
    let correctIndex = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
        answers[i].style.left = shuffled[i] + "px";
        answers[i].style.top = "-60px";
        answers[i].innerText = i === correctIndex
            ? correctAnswer
            : correctAnswer + Math.floor(Math.random() * 6 - 3);
    }
}

// ------------------ PARTICLE ------------------
function spawnParticle(x, y) {
    for (let i = 0; i < 8; i++) {
        let p = document.createElement("div");
        p.className = "particle";
        p.style.left = x + (Math.random()*40 - 20) + "px";
        p.style.top = y + "px";
        particles.appendChild(p);

        setTimeout(() => p.remove(), 600);
    }
}

// ------------------ GAME LOOP ------------------
function startGame() {
    score = 0;
    scoreText.innerText = "Score: 0";
    gameoverText.style.display = "none";
    restartBtn.style.display = "none";
    gameRunning = true;

    player.style.left = "160px";
    newQuestion();

    if (loopInterval) clearInterval(loopInterval);

    loopInterval = setInterval(() => {

        for (let ans of answers) {
            let top = parseFloat(ans.style.top);
            ans.style.top = top + 3 + "px";

            // Rơi xuống dưới → reset
            if (top > 650) ans.style.top = "-60px";

            // Check va chạm
            if (top > 520 && top < 600) {
                let px = parseFloat(player.style.left);
                let ax = parseFloat(ans.style.left);

                if (Math.abs((px+42) - (ax+35)) < 50) {

                    let value = parseInt(ans.innerText);

                    if (value === correctAnswer) {
                        score++;
                        scoreText.innerText = "Score: " + score;

                        soundCorrect.play();

                        // Particle
                        spawnParticle(px+40, 520);

                        newQuestion();
                    } else {
                        soundWrong.play();
                        endGame();
                    }

                    // Reset đáp án
                    for (let a of answers) a.style.top = "-60px";
                }
            }
        }

    }, 20);
}

// ------------------ GAME OVER ------------------
function endGame() {
    gameRunning = false;
    clearInterval(loopInterval);
    gameoverText.style.display = "block";
    restartBtn.style.display = "block";
}
