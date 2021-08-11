// basic canvas

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// SOUNDS
const bubblePop1 = document.createElement('audio');
const bubblePop2 = document.createElement('audio');
bubblePop1.src = './Sounds/Plop.ogg';
bubblePop2.src = './Sounds/bubbles-single1.wav';

// Mouse interaction
//js object
//measures current size and position of canvas
let canvasPosition = canvas.getBoundingClientRect();
//console.log(canvasPosition);
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    //console.log(mouse.x, mouse.y);
});

canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});
//Player
var playerImg = new Image();
var playerImgFlip = new Image();
playerImg.src = './Sprites/Fish/spritesheets/__cartoon_fish_06_yellow_swim.png';
playerImgFlip.src = 'Sprites/Fish/spritesheets/__cartoon_fish_06_yellow_swim_flip.png';
//flip
// function flipHorizontally(img, x, y) {
//     // move to x + img's width
//     ctx.translate(x + img.width, y);

//     // scaleX by -1; this "trick" flips horizontally
//     ctx.scale(-1, 1);

//     // draw the img
//     // no need for x,y since we've already translated
//     // ctx.drawImage(img,0,0);

//     // always clean up -- reset transformations to default
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     return img;
// }

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        // based on the sprite size
        this.spritesheetWidth = 498;
        this.spritesheetHeight = 327;
        this.spriteWidth = this.spritesheetWidth / 4;
        this.spriteHeight = this.spritesheetHeight / 4;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        this.calculateRotationAngle(dy, dx);

        if (mouse.x != this.x) {
            this.x -= dx / 30; // to make it slower
        }

        if (mouse.y != this.y) {
            this.y -= dy / 30;
        }

        //this.draw();
    }
    //rotation angle for the sprite
    calculateRotationAngle(dy, dx) {
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        //console.log( "Angle: "+ this.angle);
    }
    draw() {
        if (mouse.click) {
            this.drawLine();
        }
        this.drawCircle();
        this.drawSprite();
    }

    drawLine() {
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }

    drawCircle() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    drawSprite() {
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        var img;
        if (this.x >= mouse.x) {
            img = playerImg;
        }
        else {
            img = playerImgFlip;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        //flipHorizontally(playerImg, this.x, this.y);
        ctx.drawImage(img,
            this.frameX * this.spritesheetWidth,
            this.frameY * this.spritesheetHeight,
            this.spritesheetWidth,
            this.spritesheetHeight,
            0 - this.spriteWidth / 2, // center of a single sprite
            0 - this.spriteHeight / 2,
            this.spriteWidth,
            this.spriteHeight
        );

        ctx.restore();



    }
}

const player = new Player();


// Bubbles
const bubblesArr = [];
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width; // rand between 0 and width
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1; // rand between 1 and 6
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? bubblePop1 : bubblePop2;
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}


function handleBubbles() {
    if (gameFrame % 50 == 0) { //true 50, 100, 150, etc.
        bubblesArr.push(new Bubble());
        // console.log(bubblesArr.length);
    }

    for (let i = 0; i < bubblesArr.length; i++) {

        bubblesArr[i].update();
        bubblesArr[i].draw();

        if (bubblesArr[i].y < 0 - bubblesArr[i].radius * 2) {
            //bubble.delete();
            bubblesArr.splice(i, 1);
            i--;
        }
        // remove on collision
        else if (bubblesArr[i].distance < bubblesArr[i].radius + player.radius) {
            score++;
            //SOUND
            //bubblesArr[i].sound.play();
            bubblesArr.splice(i, 1);
            i--;

        }

    }
}

// Animation Loop
function GameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    printScore();
    gameFrame++;
    //console.log(gameFrame);
    requestAnimationFrame(GameLoop); // so it loops == recursion
}

function printScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50); // where on the canvas

}
GameLoop();

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});