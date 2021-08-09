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
console.log(canvasPosition);
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

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        // based on the sprite size
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        if (mouse.x != this.x) {
            this.x -= dx / 30; // to make it slower
        }

        if (mouse.y != this.y) {
            this.y -= dy / 30;
        }
    }

    draw() {
        if (mouse.click) {
            this.drawLine();
        }
        this.drawCircle();
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
        this.counted =  false;
        this.sound = Math.random() <= 0.5 ? bubblePop1 : bubblePop2;
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt (dx*dx + dy*dy);

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
    bubblesArr.forEach(bubble => {
        bubble.update();
        bubble.draw();
    });
    bubblesArr.forEach(bubble => {
        // remove element if ist y is outside of the canvas
        if (bubble.y < 0 - this.radius * 2) {
            //bubble.delete();
            bubblesArr.splice(bubblesArr.indexOf(bubble), 1);
        }

        if (bubble.distance < bubble.radius + player.radius) {
            console.log("COLISION");
            //can be used but not needed because we delete the bubble
            //if (!bubble.counted) {
            //     counted -> true
            //     score++
            //     splice
            // }

            score++;
            bubble.counted = true;
            bubblesArr.splice(bubblesArr.indexOf(bubble), 1);
            bubble.sound.play();
        }
    });


}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    printScore();
    gameFrame++;
    //console.log(gameFrame);
    requestAnimationFrame(animate); // so it loops == recursion
}

function printScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10,50); // where on the canvas

}
animate();