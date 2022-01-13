// Get the game area div
const canvas: HTMLElement | null = document.getElementById('canvas');

// Definitions
enum GameStates {
    started,
    paused
};

enum SnakeMovements {
    left = 'ArrowLeft',
    up = 'ArrowUp',
    right = 'ArrowRight',
    down = 'ArrowDown'
}

enum Fruits {
    '🍓',
    '🍌',
    '🍇',
    '🍊',
    '🍉',
    '🍐'
}

type Coordinates = {
    x: number;
    y: number;
}

interface Game {
    state: GameStates,
    speed: number,
    points: number
}

interface GameMap {
    rows: number;
    columns: number;
    pixel: number;
}

interface Snake {
    body: Coordinates[];
    lastTailPosition: Coordinates,
    direction: SnakeMovements
}

interface Fruit {
    position: Coordinates;
    type: Fruits;
}

// Init Params
const GAME: Game = {
    state: GameStates.paused,
    speed: 500,
    points: 0
}

const MAP: GameMap = {
    rows: 25,
    columns: 30,
    pixel: 30
}

const FRUITS: Fruits[] = [
    Fruits["🍓"],
    Fruits["🍌"],
    Fruits["🍇"],
    Fruits["🍊"],
    Fruits["🍉"],
    Fruits["🍐"]
]

const SNAKE: Snake = {
    body: [
        {x: 5, y: 5},
        {x: 6, y: 5},
        {x: 7, y: 5},
        {x: 8, y: 5},
    ],
    lastTailPosition: {x: 5, y: 5},
    direction: SnakeMovements.right
}

let FRUIT: Fruit = {
    position: {
        x: 15,
        y: 15
    },
    type: Fruits["🍓"]
}

// Draw functions
function drawMap() {    
    for (let row = 0; row < MAP.rows; row++) {
        for (let column = 0; column < MAP.columns; column++) {
            const pixel = document.createElement('div');
            pixel.style.position = 'absolute';
            pixel.style.width = `${MAP.pixel}px`;
            pixel.style.height = `${MAP.pixel}px`;
            pixel.style.top = `${MAP.pixel* row}px`;
            pixel.style.left = `${MAP.pixel* column}px`;
            // pixel.style.border = '1px solid red';
            canvas?.appendChild(pixel)
        }
    }
}

function drawSnake(id: string, position: Coordinates) {
    const pixel = document.createElement('div');
    const head = SNAKE.body[SNAKE.body.length-1];
    pixel.setAttribute('id', id);
    pixel.style.position = 'absolute';
    pixel.style.width = `${MAP.pixel}px`;
    pixel.style.height = `${MAP.pixel}px`;
    pixel.style.top = `${MAP.pixel * position.y}px`;
    pixel.style.left = `${MAP.pixel * position.x}px`;
    pixel.innerText = '🐲';
    pixel.style.fontSize = '20px';
    canvas?.appendChild(pixel)
}

function drawFruit() {
    const pixel = document.createElement('div');
    pixel.setAttribute('id', `fruit-${FRUIT.position.x}-${FRUIT.position.y}`);
    pixel.style.position = 'absolute';
    pixel.style.fontSize = '20px';
    pixel.style.width = `${MAP.pixel}px`;
    pixel.style.height = `${MAP.pixel}px`;
    pixel.style.top = `${MAP.pixel * FRUIT.position.y}px`;
    pixel.style.left = `${MAP.pixel * FRUIT.position.x}px`;
    pixel.innerText = Fruits[FRUIT.type];
    canvas?.appendChild(pixel)
}

function initSnake() {   
    drawFruit(); 
    SNAKE.body.forEach((position) => {
        const id = `snake-${position.x}-${position.y}`;
        drawSnake(id, position);
    })
    controlSnake();
}

function moveSnake(direction: SnakeMovements) {
    const head = SNAKE.body[SNAKE.body.length-1];
    const tail = SNAKE.body[0];
    let removeId: string = '';
    let headId: string = `snake-${head.x}-${head.y}`;
    let newBodyPart: Coordinates = {
        x: head.x,
        y: head.y
    }

    // Moving right direction
    switch (direction) {
        case SnakeMovements.left:
            headId = `snake-${head.x - 1}-${head.y}`;
            newBodyPart = {
                x: head.x - 1,
                y: head.y
            }
            break;
        case SnakeMovements.up:
            headId = `snake-${head.x}-${head.y - 1}`;
            newBodyPart = {
                x: head.x,
                y: head.y - 1
            }
            break;
        case SnakeMovements.right:
            headId = `snake-${head.x + 1}-${head.y}`;
            newBodyPart = {
                x: head.x + 1,
                y: head.y
            }
            break;
        default:
            headId = `snake-${head.x}-${head.y + 1}`;
            newBodyPart = {
                x: head.x,
                y: head.y + 1
            }
            break;
        }
        
    removeId = `snake-${tail.x}-${tail.y}`;
    SNAKE.lastTailPosition = tail; // Safe position to add new body part when eat fruit
    SNAKE.body.shift(); // Remove last body part
    SNAKE.body.push(newBodyPart); // Add new head position
    document.getElementById(removeId)?.remove(); // Remove last body part from DOM
    drawSnake(headId, newBodyPart); // Draw new SNAKE body position
}

function controlSnake() {
    setTimeout(function() {
        if(GAME.state === GameStates.paused) {
            return;
        }
        moveSnake(SNAKE.direction);  
        controlSnake()
        if(!isColiding()) {
            checkIfIsEating()
        }
        // If colide
        else {
            GAME.state = GameStates.paused;
            document.getElementById('points')?.innerText = `GAME LOST!`;
        }
    }, GAME.speed);
}

function updatePoints() {
    GAME.points += 10;
    document.getElementById('points')?.innerText = `Points: ${GAME.points}`;
    if (GAME.points % 50 === 0) {
        GAME.speed = GAME.speed/2;
    }
}

function placeNewFruit() {
    let newFruit: Fruit;
    do {
        newFruit = {
            position: {
                x: Math.floor(Math.random() * (MAP.columns - 0)) + 0,
                y: Math.floor(Math.random() * (MAP.rows - 0)) + 0
            },
            type: FRUITS[Math.floor(Math.random() * (FRUITS.length - 0)) + 0]
        }
    } while (JSON.stringify(SNAKE.body).includes(JSON.stringify(newFruit)));

    FRUIT = newFruit;
    drawFruit()
}

function checkIfIsEating() {
    const head = SNAKE.body[SNAKE.body.length-1];

    if(JSON.stringify(head) === JSON.stringify(FRUIT.position)) {
        updatePoints()
        SNAKE.body.unshift(SNAKE.lastTailPosition);
        drawSnake(`snake-${SNAKE.lastTailPosition.x}-${SNAKE.lastTailPosition.y}`, SNAKE.lastTailPosition);
        document.getElementById(`fruit-${FRUIT.position.x}-${FRUIT.position.y}`)?.remove(); // Remove last fruit from DOM
        placeNewFruit()
    }
}

function isColiding() {
    const snakeBody = JSON.parse(JSON.stringify(SNAKE.body));
    const snakeHead: Coordinates = snakeBody.pop();

    if(
        JSON.stringify(snakeBody).includes(JSON.stringify(snakeHead))
        || snakeHead.x >= MAP.columns || snakeHead.x < 0
        || snakeHead.y >= MAP.rows || snakeHead.y < 0
    ) {
        return true;
    }
    return false;
}

function isOppositeDirection(direction: SnakeMovements) {
    if (SNAKE.direction === SnakeMovements.left && direction === SnakeMovements.right){
        return true;
    }
    else if (SNAKE.direction === SnakeMovements.up && direction === SnakeMovements.down){
        return true;
    }
    else if (SNAKE.direction === SnakeMovements.right && direction === SnakeMovements.left){
        return true;
    }
    if (SNAKE.direction === SnakeMovements.down && direction === SnakeMovements.up){
        return true;
    }

    return false;
}

function registerValidKey(e: KeyboardEvent) {
    if(
        (e.code === SnakeMovements.left ||
        e.code === SnakeMovements.up ||
        e.code === SnakeMovements.right ||
        e.code === SnakeMovements.down)
        && GAME.state === GameStates.started
    ) {
        if(isOppositeDirection(e.code)) {
            document.getElementById('messages')?.innerText = "Can't invert direction";
        }
        else {
            SNAKE.direction = e.code;
            document.getElementById('messages')?.innerText = e.code;
        }
    }
    else {
        document.getElementById('messages')?.innerText = 'Invalid key pressed!';
    }
}

// Init game when render page
function initGame() {    
    drawMap();
    document.addEventListener('keydown', registerValidKey);
}

initGame();

// Game actions from UI buttons
function startGame() {
    GAME.state = GameStates.started;
    initSnake();
    document.getElementById('startButton')?.style.display = "none";
    document.getElementById('pauseButton')?.style.display = "block";
    document.getElementById('points')?.style.display = "block";
}

function pauseGame() {
    GAME.state = GameStates.paused;
    document.getElementById('pauseButton')?.style.display = "none";
    document.getElementById('resumeButton')?.style.display = "block";
}

function resumeGame() {
    GAME.state = GameStates.started;
    controlSnake();
    document.getElementById('pauseButton')?.style.display = "block";
    document.getElementById('resumeButton')?.style.display = "none";
}
