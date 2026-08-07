// =====================================
// FLAPPY BIRD PRO
// SCRIPT.JS - PARTE 1
// =====================================


// ELEMENTOS

const game = document.querySelector("#game");
const bird = document.querySelector("#bird");

const scoreText = document.querySelector("#score");

const startScreen = document.querySelector("#startScreen");
const gameOverScreen = document.querySelector("#gameOver");

const finalScore = document.querySelector("#finalScore");
const bestScoreText = document.querySelector("#bestScore");


// TAMANHO

const GAME_WIDTH = 420;
const GAME_HEIGHT = 700;


// PASSARO

let birdY = 300;
let velocity = 0;

const gravity = 0.45;
const jumpPower = -8;


// JOGO

let playing = false;
let finished = false;

let score = 0;

let bestScore =
    localStorage.getItem("record") || 0;


bestScoreText.innerHTML = bestScore;


// CANOS

let pipes = [];

let pipeSpeed = 3;

let pipeTimer;



// ================================
// INICIAR JOGO
// ================================


function startGame() {


    if (playing) return;


    playing = true;

    finished = false;


    score = 0;

    scoreText.innerHTML = score;


    birdY = 300;

    velocity = 0;


    startScreen.style.display = "none";

    gameOverScreen.style.display = "none";


    pipes.forEach(pipe => {

        pipe.top.remove();

        pipe.bottom.remove();

    });


    pipes = [];



    pipeTimer = setInterval(createPipe, 1800);



    gameLoop();


}





// ================================
// CONTROLES
// ================================


document.addEventListener("keydown", e => {


    if (e.code === "Space") {


        if (!playing) {

            startGame();

        } else {

            flap();

        }


    }


});



document.addEventListener("click", () => {


    if (!playing) {

        startGame();

    } else {

        flap();

    }


});




// ================================
// VOAR
// ================================


function flap() {


    velocity = jumpPower;


    bird.style.transform =
        "rotate(-25deg)";


}



// ================================
// CRIAR CANOS
// ================================


function createPipe() {


    if (!playing) return;



    let gap = 190;


    let topHeight =
        Math.random() * 250 + 80;



    let bottomHeight =
        GAME_HEIGHT -
        topHeight -
        gap -
        80;



    let top =
        document.createElement("div");


    let bottom =
        document.createElement("div");



    top.className =
        "pipe topPipe";


    bottom.className =
        "pipe bottomPipe";



    top.style.height =
        topHeight + "px";


    bottom.style.height =
        bottomHeight + "px";



    top.style.left =
        GAME_WIDTH + "px";


    bottom.style.left =
        GAME_WIDTH + "px";



    game.appendChild(top);

    game.appendChild(bottom);



    pipes.push({

        x: GAME_WIDTH,

        top: top,

        bottom: bottom,

        counted: false

    });



}
// =====================================
// FLAPPY BIRD PRO
// SCRIPT.JS - PARTE 2
// =====================================



// ================================
// LOOP DO JOGO
// ================================


function gameLoop() {


    if (!playing) return;



    // gravidade

    velocity += gravity;

    birdY += velocity;



    bird.style.top =
        birdY + "px";



    // inclinação realista

    let angle = velocity * 3;


    bird.style.transform =
        `rotate(${angle}deg)`;




    // movimentar canos


    pipes.forEach((pipe, index) => {


        pipe.x -= pipeSpeed;



        pipe.top.style.left =
            pipe.x + "px";


        pipe.bottom.style.left =
            pipe.x + "px";



        collision(pipe);



        // ponto


        if (
            pipe.x + 70 < 90 &&
            !pipe.counted
        ) {


            pipe.counted = true;


            score++;


            scoreText.innerHTML =
                score;



            createParticle();



        }




        // remover


        if (pipe.x < -100) {


            pipe.top.remove();

            pipe.bottom.remove();


            pipes.splice(index, 1);


        }



    });





    // chão


    if (birdY + 50 >= 620) {

        gameEnd();

    }



    // teto


    if (birdY < 0) {

        gameEnd();

    }



    requestAnimationFrame(gameLoop);


}





// ================================
// COLISÃO
// ================================


function collision(pipe) {


    const birdBox =
        bird.getBoundingClientRect();


    const topBox =
        pipe.top.getBoundingClientRect();


    const bottomBox =
        pipe.bottom.getBoundingClientRect();




    if (

        birdBox.right > topBox.left &&

        birdBox.left < topBox.right &&

        birdBox.top < topBox.bottom

    ) {

        gameEnd();

    }





    if (

        birdBox.right > bottomBox.left &&

        birdBox.left < bottomBox.right &&

        birdBox.bottom > bottomBox.top

    ) {

        gameEnd();

    }



}




// ================================
// PARTICULAS
// ================================


function createParticle() {


    let particle =
        document.createElement("div");


    particle.innerHTML = "✨";


    particle.style.position = "absolute";


    particle.style.left = "130px";


    particle.style.top =
        birdY + "px";


    particle.style.fontSize = "25px";


    particle.style.zIndex = "20";



    game.appendChild(particle);



    setTimeout(() => {

        particle.remove();

    }, 600);


}





// ================================
// GAME OVER
// ================================


function gameEnd() {



    if (finished) return;



    finished = true;

    playing = false;



    clearInterval(pipeTimer);



    finalScore.innerHTML =
        score;



    if (score > bestScore) {


        bestScore = score;


        localStorage.setItem(
            "record",
            bestScore
        );


    }



    bestScoreText.innerHTML =
        bestScore;




    game.classList.add("shake");



    setTimeout(() => {


        game.classList.remove("shake");


    }, 300);




    gameOverScreen.style.display =
        "flex";



}





// ================================
// RECOMEÇAR
// ================================


function restartGame() {


    gameOverScreen.style.display =
        "none";


    pipes.forEach(pipe => {


        pipe.top.remove();

        pipe.bottom.remove();


    });



    pipes = [];



    birdY = 300;

    velocity = 0;


    bird.style.top =
        birdY + "px";



    score = 0;


    scoreText.innerHTML = 0;



    startGame();


}





console.log(
    "🐦 Flappy Bird Pro carregado!"
);