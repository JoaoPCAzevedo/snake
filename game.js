// Get the game area div
var canvas = document.getElementById('canvas');
// Definitions
var GameStates;
(function (GameStates) {
    GameStates[GameStates["started"] = 0] = "started";
    GameStates[GameStates["paused"] = 1] = "paused";
})(GameStates || (GameStates = {}));
;
var SnakeMovements;
(function (SnakeMovements) {
    SnakeMovements["left"] = "ArrowLeft";
    SnakeMovements["up"] = "ArrowUp";
    SnakeMovements["right"] = "ArrowRight";
    SnakeMovements["down"] = "ArrowDown";
})(SnakeMovements || (SnakeMovements = {}));
var Fruits;
(function (Fruits) {
    Fruits[Fruits["\uD83C\uDF53"] = 0] = "\uD83C\uDF53";
    Fruits[Fruits["\uD83C\uDF4C"] = 1] = "\uD83C\uDF4C";
    Fruits[Fruits["\uD83C\uDF47"] = 2] = "\uD83C\uDF47";
    Fruits[Fruits["\uD83C\uDF4A"] = 3] = "\uD83C\uDF4A";
    Fruits[Fruits["\uD83C\uDF49"] = 4] = "\uD83C\uDF49";
    Fruits[Fruits["\uD83C\uDF50"] = 5] = "\uD83C\uDF50";
})(Fruits || (Fruits = {}));
// Init Params
var GAME = {
    state: GameStates.paused,
    speed: 500,
    points: 0
};
var MAP = {
    rows: 25,
    columns: 30,
    pixel: 30
};
var FRUITS = [
    Fruits["🍓"],
    Fruits["🍌"],
    Fruits["🍇"],
    Fruits["🍊"],
    Fruits["🍉"],
    Fruits["🍐"]
];
var SNAKE = {
    body: [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
    ],
    lastTailPosition: { x: 5, y: 5 },
    direction: SnakeMovements.right
};
var FRUIT = {
    position: {
        x: 15,
        y: 15
    },
    type: Fruits["🍓"]
};
// Draw functions
function drawMap() {
    for (var row = 0; row < MAP.rows; row++) {
        for (var column = 0; column < MAP.columns; column++) {
            var pixel = document.createElement('div');
            pixel.style.position = 'absolute';
            pixel.style.width = "".concat(MAP.pixel, "px");
            pixel.style.height = "".concat(MAP.pixel, "px");
            pixel.style.top = "".concat(MAP.pixel * row, "px");
            pixel.style.left = "".concat(MAP.pixel * column, "px");
            // pixel.style.border = '1px solid red';
            canvas === null || canvas === void 0 ? void 0 : canvas.appendChild(pixel);
        }
    }
}
function drawSnake(id, position) {
    var pixel = document.createElement('div');
    var head = SNAKE.body[SNAKE.body.length - 1];
    pixel.setAttribute('id', id);
    pixel.style.position = 'absolute';
    pixel.style.width = "".concat(MAP.pixel, "px");
    pixel.style.height = "".concat(MAP.pixel, "px");
    pixel.style.top = "".concat(MAP.pixel * position.y, "px");
    pixel.style.left = "".concat(MAP.pixel * position.x, "px");
    pixel.innerText = '🐲';
    pixel.style.fontSize = '20px';
    canvas === null || canvas === void 0 ? void 0 : canvas.appendChild(pixel);
}
function drawFruit() {
    var pixel = document.createElement('div');
    pixel.setAttribute('id', "fruit-".concat(FRUIT.position.x, "-").concat(FRUIT.position.y));
    pixel.style.position = 'absolute';
    pixel.style.fontSize = '20px';
    pixel.style.width = "".concat(MAP.pixel, "px");
    pixel.style.height = "".concat(MAP.pixel, "px");
    pixel.style.top = "".concat(MAP.pixel * FRUIT.position.y, "px");
    pixel.style.left = "".concat(MAP.pixel * FRUIT.position.x, "px");
    pixel.innerText = Fruits[FRUIT.type];
    canvas === null || canvas === void 0 ? void 0 : canvas.appendChild(pixel);
}
function initSnake() {
    drawFruit();
    SNAKE.body.forEach(function (position) {
        var id = "snake-".concat(position.x, "-").concat(position.y);
        drawSnake(id, position);
    });
    controlSnake();
}
function moveSnake(direction) {
    var _a;
    var head = SNAKE.body[SNAKE.body.length - 1];
    var tail = SNAKE.body[0];
    var removeId = '';
    var headId = "snake-".concat(head.x, "-").concat(head.y);
    var newBodyPart = {
        x: head.x,
        y: head.y
    };
    // Moving right direction
    switch (direction) {
        case SnakeMovements.left:
            headId = "snake-".concat(head.x - 1, "-").concat(head.y);
            newBodyPart = {
                x: head.x - 1,
                y: head.y
            };
            break;
        case SnakeMovements.up:
            headId = "snake-".concat(head.x, "-").concat(head.y - 1);
            newBodyPart = {
                x: head.x,
                y: head.y - 1
            };
            break;
        case SnakeMovements.right:
            headId = "snake-".concat(head.x + 1, "-").concat(head.y);
            newBodyPart = {
                x: head.x + 1,
                y: head.y
            };
            break;
        default:
            headId = "snake-".concat(head.x, "-").concat(head.y + 1);
            newBodyPart = {
                x: head.x,
                y: head.y + 1
            };
            break;
    }
    removeId = "snake-".concat(tail.x, "-").concat(tail.y);
    SNAKE.lastTailPosition = tail; // Safe position to add new body part when eat fruit
    SNAKE.body.shift(); // Remove last body part
    SNAKE.body.push(newBodyPart); // Add new head position
    (_a = document.getElementById(removeId)) === null || _a === void 0 ? void 0 : _a.remove(); // Remove last body part from DOM
    drawSnake(headId, newBodyPart); // Draw new SNAKE body position
}
function controlSnake() {
    setTimeout(function () {
        var _a;
        if (GAME.state === GameStates.paused) {
            return;
        }
        moveSnake(SNAKE.direction);
        controlSnake();
        if (!isColiding()) {
            checkIfIsEating();
        }
        // If colide
        else {
            GAME.state = GameStates.paused;
            (_a = document.getElementById('points')) === null || _a === void 0 ? void 0 : _a.innerText = "GAME LOST!";
        }
    }, GAME.speed);
}
function updatePoints() {
    var _a;
    GAME.points += 10;
    (_a = document.getElementById('points')) === null || _a === void 0 ? void 0 : _a.innerText = "Points: ".concat(GAME.points);
    if (GAME.points % 50 === 0) {
        GAME.speed = GAME.speed / 2;
    }
}
function placeNewFruit() {
    var newFruit;
    do {
        newFruit = {
            position: {
                x: Math.floor(Math.random() * (MAP.columns - 0)) + 0,
                y: Math.floor(Math.random() * (MAP.rows - 0)) + 0
            },
            type: FRUITS[Math.floor(Math.random() * (FRUITS.length - 0)) + 0]
        };
    } while (JSON.stringify(SNAKE.body).includes(JSON.stringify(newFruit)));
    FRUIT = newFruit;
    drawFruit();
}
function checkIfIsEating() {
    var _a;
    var head = SNAKE.body[SNAKE.body.length - 1];
    if (JSON.stringify(head) === JSON.stringify(FRUIT.position)) {
        updatePoints();
        SNAKE.body.unshift(SNAKE.lastTailPosition);
        drawSnake("snake-".concat(SNAKE.lastTailPosition.x, "-").concat(SNAKE.lastTailPosition.y), SNAKE.lastTailPosition);
        (_a = document.getElementById("fruit-".concat(FRUIT.position.x, "-").concat(FRUIT.position.y))) === null || _a === void 0 ? void 0 : _a.remove(); // Remove last fruit from DOM
        placeNewFruit();
    }
}
function isColiding() {
    var snakeBody = JSON.parse(JSON.stringify(SNAKE.body));
    var snakeHead = snakeBody.pop();
    if (JSON.stringify(snakeBody).includes(JSON.stringify(snakeHead))
        || snakeHead.x >= MAP.columns || snakeHead.x < 0
        || snakeHead.y >= MAP.rows || snakeHead.y < 0) {
        return true;
    }
    return false;
}
function isOppositeDirection(direction) {
    if (SNAKE.direction === SnakeMovements.left && direction === SnakeMovements.right) {
        return true;
    }
    else if (SNAKE.direction === SnakeMovements.up && direction === SnakeMovements.down) {
        return true;
    }
    else if (SNAKE.direction === SnakeMovements.right && direction === SnakeMovements.left) {
        return true;
    }
    if (SNAKE.direction === SnakeMovements.down && direction === SnakeMovements.up) {
        return true;
    }
    return false;
}
function registerValidKey(e) {
    var _a, _b, _c;
    if ((e.code === SnakeMovements.left ||
        e.code === SnakeMovements.up ||
        e.code === SnakeMovements.right ||
        e.code === SnakeMovements.down)
        && GAME.state === GameStates.started) {
        if (isOppositeDirection(e.code)) {
            (_a = document.getElementById('messages')) === null || _a === void 0 ? void 0 : _a.innerText = "Can't invert direction";
        }
        else {
            SNAKE.direction = e.code;
            (_b = document.getElementById('messages')) === null || _b === void 0 ? void 0 : _b.innerText = e.code;
        }
    }
    else {
        (_c = document.getElementById('messages')) === null || _c === void 0 ? void 0 : _c.innerText = 'Invalid key pressed!';
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
    var _a, _b, _c;
    GAME.state = GameStates.started;
    initSnake();
    (_a = document.getElementById('startButton')) === null || _a === void 0 ? void 0 : _a.style.display = "none";
    (_b = document.getElementById('pauseButton')) === null || _b === void 0 ? void 0 : _b.style.display = "block";
    (_c = document.getElementById('points')) === null || _c === void 0 ? void 0 : _c.style.display = "block";
}
function pauseGame() {
    var _a, _b;
    GAME.state = GameStates.paused;
    (_a = document.getElementById('pauseButton')) === null || _a === void 0 ? void 0 : _a.style.display = "none";
    (_b = document.getElementById('resumeButton')) === null || _b === void 0 ? void 0 : _b.style.display = "block";
}
function resumeGame() {
    var _a, _b;
    GAME.state = GameStates.started;
    controlSnake();
    (_a = document.getElementById('pauseButton')) === null || _a === void 0 ? void 0 : _a.style.display = "block";
    (_b = document.getElementById('resumeButton')) === null || _b === void 0 ? void 0 : _b.style.display = "none";
}
