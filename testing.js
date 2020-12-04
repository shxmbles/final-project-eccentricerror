document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const char = document.createElement('div');
    let startPoint = 150;
    let charBotSpace = startPoint;
    let charLeftSpace = 50;
    let isGameOver = false;
    let platList = 10;
    let platforms = [];
    let upTimeID;
    let downTimeID;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerID;
    let rightTimerID;
    let score = 0;
    let highScore = 0;

    function createChar() {
        grid.appendChild(char);
        char.classList.add('char');
        charLeftSpace = platforms[0].left;
        char.style.left = charLeftSpace + 'px';
        char.style.bottom = charBotSpace + 'px';

    }

    function createPlats() {
        for (let i = 0; i < platList; i++) {
            let platGap = 100 / platList;
            let newPlatBotSpace = 8 * i * platGap;
            let newPlatform = new Platform(newPlatBotSpace);
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }
    class Platform {
        constructor(newPlatBotSpace) {
            this.bottom = newPlatBotSpace;
            this.left = Math.random() * 983;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.append(visual);
        }
    }

    function movePlatforms() {
        if (charBotSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10){
                    let firstPlat =platforms[0].visual;
                    firstPlat.classList.remove('platform');
                    platforms.shift()
                    score++;
                    console.log(platforms);

                    let newPlatform = new Platform(548);
                    platforms.push(newPlatform);
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimeID)
        isJumping = true;
        upTimeID = setInterval(function () {
            charBotSpace += 20;
            char.style.bottom = charBotSpace + 'px';
            if (charBotSpace > startPoint + 250) {
                fall();
            }
        }, 30)


    }

    function fall() {
        clearInterval(upTimeID);
        isJumping = false;
        downTimeID = setInterval(function () {
            charBotSpace -= 5;
            char.style.bottom = charBotSpace + 'px';
            if (charBotSpace <= 0) {
                gameOver();
                clearInterval(downTimeID);
            }

            platforms.forEach(platform => {
                if (
                    (charBotSpace >= platform.bottom) &&
                    (charBotSpace <= platform.bottom +15) &&
                    ((charLeftSpace + 60) >= platform.left) &&
                    (charLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                  
                    startPoint = charBotSpace;
                    jump();
                }

            })
        }, 30)
    }

    function controller(e) {
        if (e.key == "a") {
            moveLeft();
        }
        else if (e.key == "d") {
            moveRight();
        }
        else if (e.key == "w") {
            moveStraight(); 
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerID);
            isGoingRight = false;

        }
        isGoingLeft = true;
        leftTimerID = setInterval(function (){
            if(charLeftSpace >= 0){
                charLeftSpace -= 5;
                char.style.left = charLeftSpace + 'px';
            }
            
        },30)
    };
    function moveStraight(){
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(rightTimerID);
        clearInterval(leftTimerID);
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerID);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerID = setInterval(function (){
            if(charLeftSpace <= 1008){
                charLeftSpace += 5;
                char.style.left = charLeftSpace + 'px';
            }
            
        },30)
    }

    function gameOver() {
        isGameOver = true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
            
        }
        grid.innerHTML = score;
        clearInterval(upTimeID);
        clearInterval(downTimeID);
        clearInterval(leftTimerID);
        clearInterval(rightTimerID);

    }

    function start() {
        if (!isGameOver) {
            createPlats();
            createChar();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keydown',controller);
            fall();

        }
    }
    start();
})