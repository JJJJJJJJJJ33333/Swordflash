const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1.5;

const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
});

const shop = new Sprite ({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});


const player = new Fighter ({
    position: {
    x:150,
    y:0
},
velocity: {
    x:0,
    y:0
},
    offset: {
    x: 0,
    y: 0    
},
    imageSrc: './img/Knight/_Idle.png',
    framesMax: 10,
    scale: 3.5,
    offset: {
    x: 215,
    y: 130
},
    sprites: {
        idle: {
            imageSrc: './img/Knight/_Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './img/Knight/_Run.png',
            framesMax: 10,
            image: new Image()
    },
        jump: {
            imageSrc: './img/Knight/_Jump.png',
            framesMax: 3,
            image: new Image()
    },
        fall: {
            imageSrc: './img/Knight/_Fall.png',
            framesMax: 3,
            image: new Image()
            
        },
        attack1: {
            imageSrc: './img/Knight/_AttackNoMovement.png',
            framesMax: 4,
            image: new Image() 
        },
        attack2: {
            imageSrc: './img/Knight/_Attack2NoMovement.png',
            framesMax: 6,
            image: new Image() 
        },
        takeHit: {
            imageSrc: './img/Knight/_Hit.png',
            framesMax: 1,
            image: new Image()   
        },
        death: {
            imageSrc: './img/Knight/_Death.png',
            framesMax: 10,
            image: new Image() 
        }
    },
    attackBox: {
        offset: {
            x: 50,
            y: 40
        },
        width: 100,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
    x:800,
    y:100,
},
velocity: {
    x:0,
    y:0
},
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
    x: 215,
    y: 167
},
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
            image: new Image()
    },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
            image: new Image()
    },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
            image: new Image()
            
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
            image: new Image()
            
        },
        attack2: {
            imageSrc: './img/kenji/Attack2.png',
            framesMax: 4,
            image: new Image()
            
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
            image: new Image() 
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 40
        },
        width: 170,
        height: 50
    }
});

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
ArrowLeft: {
    pressed: false
},
    ArrowDown: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
};

decreaseTimer();

let lastKey;

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0,0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    
    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -10; 
       player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 10;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    
    //jumping
    if (player.velocity.y < 0) {
       player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
        new Image();
    }
    
    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -10;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 10;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    
    //jumping
    if (enemy.velocity.y < 0) {
       enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
        new Image();
    }
    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && 
        player.isAttacking 
       ) { 
        if (player.attackMove === 1) {
        if (player.framesCurrent === 1) {  
        enemy.takeHit(); 
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        }
        );
    }
    } else if (player.attackMove === 2) {
        if (player.framesCurrent === 3) {
        enemy.takeBigHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
        }
    }
 }
    
    //if player misses
    if (player.isAttacking && player.framesCurrent == 1 && player.attackMove === 1) {
        player.isAttacking = false;
    } else if (player.isAttacking && player.framesCurrent === 3 && player.attackMove === 2) {
        player.isAttacking = false;
    }
    
    //this is where our player gets hit
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) 
    { if (enemy.attackMove === 1) {
        if (enemy.framesCurrent === 1) {
        player.takeHit();
        enemy.isAttacking = false;
         gsap.to('#playerHealth', {
            width: player.health + '%'
        });
        }
    } else if (enemy.attackMove === 2) {
        if (enemy.framesCurrent === 1) {
            player.takeBigHit();
        enemy.isAttacking = false;
         gsap.to('#playerHealth', {
            width: player.health + '%'
        });
        }
    }
    }
    
     //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent == 2) {
        enemy.isAttacking = false; 
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }
}


animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) { 
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
            case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
            case 'f':
            player.attackMove = 1;
            player.attack();
            break;
            case 'g':
            player.attackMove = 2;
            player.attack();
            break;
            case 'w':
            if(player.velocity.y === 0) {
            keys.w.pressed = true;
            player.velocity.y = -20;
            break;
            } else {keys.w.pressed = false;}
    }
          
    }
    if(!enemy.dead) {
    switch(event.key) {
              case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
            case '.':
            enemy.attackMove = 1;
            enemy.attack();
            break;
            case ',':
            enemy.attackMove = 2;
            enemy.attack();
            break;
            case 'ArrowUp':
            if(enemy.velocity.y === 0) {
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -20;
            break;
            } else {keys.ArrowUp.pressed = false;}
    }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
            case 'a':
            keys.a.pressed = false;
            break;
            case 'w':
            keys.w.pressed = false;
            break;
            
            case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
            case 'ArrowDown':
            enemy.isAttacking = false;
            break;
    }
});