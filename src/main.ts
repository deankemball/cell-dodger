import { cloneDeep, clamp } from "lodash";

// Define Types
interface StylesObj {
  bgColor: string;
  textColor: string;
  playerColor: string;
  coinColor: string;
  enemyColor: string;
  heartColor: string;
  gridColor: string;
  borderColor: string;
  borderSize: string;
  gameOverTextColor: string;
  gridBorderSize: string;
  minusLifeFlashColor: string;
  plusScoreFlashColor: string;
  plusLifeFlashColor: string;
}
interface GameParams {
  noPlayers: number;
  noEnemies: number;
  noCoins: number;
  noLives: number;
  gameSpeed: number;
  rows: number;
  columns: number;
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
}
interface Entity {
  // [{x:1,y:1},{x:2,y:3}]
  x: number;
  y: number;
  id: number;
}

interface Player extends Entity {
  lives: number;
  lastKeyPressed: string;
}
let players: Player[] = [];

interface Enemy extends Entity {}
let enemies: Enemy[] = [];

interface Coin extends Entity {}
let coins: Coin[] = [];

interface Heart extends Entity {}
let hearts: Heart[] = [];

interface PlayerInputs {
  left: string;
  up: string;
  right: string;
  down: string;
}

// Define Default Values
const stylesObj: StylesObj = {
  bgColor: "bg-bgColor",
  textColor: "text-textColor",
  playerColor: "bg-playerColor",
  coinColor: "bg-coinColor",
  enemyColor: "bg-enemyColor",
  heartColor: "bg-heartColor",
  gridColor: "bg-gridColor",
  borderColor: "border-black/25",
  borderSize: "border-[1px]",
  gameOverTextColor: "text-playerColor",
  gridBorderSize: "border-2",
  minusLifeFlashColor: "border-playerColor",
  plusScoreFlashColor: "border-coinColor",
  plusLifeFlashColor: "border-heartColor",
};

const defaultGameParams: GameParams = {
  noPlayers: 1,
  noEnemies: 4,
  noCoins: 1,
  noLives: 3,
  gameSpeed: 200,
  rows: 20,
  columns: 20,
  score: 0,
  gameStarted: false,
  gameOver: false,
};

let gameParams: GameParams = cloneDeep(defaultGameParams);

let playerInputs: PlayerInputs = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
};

// Add Event Listeners
const body = document.querySelector("body") as HTMLElement;
const grid = document.querySelector("#grid-container") as HTMLElement;
const settingsColumn = document.querySelector("#settings") as HTMLElement;
const centerColumn = document.querySelector("#center") as HTMLElement;
const instructionsColumn = document.querySelector(
  "#instructions"
) as HTMLElement;
const settings = document.querySelector("#settings-box") as HTMLElement;
const instructions = document.querySelector("#instructions-box") as HTMLElement;
const noLivesInput = document.querySelector("#noLives") as HTMLInputElement;
const noEnemiesInput = document.querySelector("#noEnemies") as HTMLInputElement;
const noCoinsInput = document.querySelector("#noCoins") as HTMLInputElement;
const gameSpeedInput = document.querySelector("#gameSpeed") as HTMLInputElement;
const settingsButton = document.querySelector(
  "#settings-icon"
) as HTMLImageElement;
const helpButton = document.querySelector("#help-icon") as HTMLImageElement;
const scoreDisplay = document.querySelector("#score") as HTMLElement;
const livesDisplay = document.querySelector("#lives") as HTMLElement;
const consoleDisplay = document.querySelector("#console") as HTMLElement;

function toggleHelpIcon(icon: HTMLImageElement, iconName: string) {
  if (!icon.src.includes("filled")) {
    icon.src = `./assets/${iconName}-filled.8077b526.svg`;
  } else {
    icon.src = `./assets/${iconName}.5879900d.svg`;
  }
}
function toggleSettingsIcon(icon: HTMLImageElement, iconName: string) {
  if (!icon.src.includes("filled")) {
    icon.src = `./assets/${iconName}-filled.0b67e235.svg`;
  } else {
    icon.src = `./assets/${iconName}.aaf9c6ec.svg`;
  }
}

settingsButton.addEventListener("click", () => {
  let screenSize = window.innerWidth;
  if (screenSize <= 1024) {
    if (!instructionsColumn.classList.contains("opacity-0")) {
      settingsColumn.classList.add("order-2");
      instructionsColumn.classList.remove("order-2");
      instructionsColumn.classList.add("order-3");
      instructionsColumn.classList.toggle("opacity-0");
      toggleHelpIcon(helpButton, "help");
    }
    toggleSettingsIcon(settingsButton, "settings");
    settingsColumn.classList.add("order-2");
    settingsColumn.classList.remove("order-3");
    instructionsColumn.classList.remove("order-2");
    instructionsColumn.classList.add("order-3");
    settingsColumn.classList.toggle("opacity-0");
  } else {
    toggleSettingsIcon(settingsButton, "settings");
    settingsColumn.classList.toggle("opacity-0");
  }
});

helpButton.addEventListener("click", () => {
  let screenSize = window.innerWidth;
  if (screenSize <= 1024) {
    if (!settingsColumn.classList.contains("opacity-0")) {
      instructionsColumn.classList.add("order-2");
      settingsColumn.classList.remove("order-2");
      settingsColumn.classList.add("order-3");
      settingsColumn.classList.toggle("opacity-0");
      toggleSettingsIcon(settingsButton, "settings");
    }
    toggleHelpIcon(helpButton, "help");
    instructionsColumn.classList.add("order-2");
    instructionsColumn.classList.remove("order-3");
    settingsColumn.classList.remove("order-2");
    settingsColumn.classList.add("order-3");
    instructionsColumn.classList.toggle("opacity-0");
  } else {
    toggleHelpIcon(helpButton, "help");
    instructionsColumn.classList.toggle("opacity-0");
  }
});

function createJoystick() {
  const joystickContainer = document.createElement("div");
  joystickContainer.id = "jsFixed";
  joystickContainer.classList.add(
    "w-24",
    "h-24",
    "rounded-full",
    "absolute",
    "bottom-[calc(((100vh-100vw)/2)-48px-24px)]",
    "left-[calc(50vw-48px)]",
    "z-0"
  );
  const joystickContainer2 = document.createElement("div");
  joystickContainer2.id = "jsContainer";
  joystickContainer2.classList.add(
    "w-full",
    "h-full",
    "rounded-full",
    "bg-gridColor",
    "relative",
    "flex",
    "justify-center",
    "items-center"
  );
  const joystick = document.createElement("div");
  joystick.id = "jsGrabber";
  joystick.classList.add(
    "w-20",
    "h-20",
    "rounded-full",
    "bg-textColor",
    "z-1",
    "absolute"
  );
  joystickContainer.appendChild(joystickContainer2);
  joystickContainer2.appendChild(joystick);
  centerColumn.appendChild(joystickContainer);

  dragElement(document.getElementById("jsGrabber") as HTMLElement);

  function dragElement(element: HTMLElement) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(element.id)) {
      // if present, the header is where you move the DIV from:
      document.getElementById(element.id)!.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      element.style.top = clamp(element.offsetTop - pos2, -16, 32) + "px";
      element.style.left = clamp(element.offsetLeft - pos1, -16, 32) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = () => {
        element.style.top = 8 + "px";
        element.style.left = 8 + "px";
      };
    }
  }
}

function updateInput(element: HTMLInputElement, gameParam: keyof GameParams) {
  element.addEventListener("input", () => {
    gameParams[gameParam] = element.value as never;
    console.log(gameParams[gameParam]);
    initGame();
  });
}

updateInput(noLivesInput, "noLives");
updateInput(noEnemiesInput, "noEnemies");
updateInput(gameSpeedInput, "gameSpeed");
updateInput(noCoinsInput, "noCoins");

// style default elements
body.classList.add(stylesObj.bgColor, stylesObj.textColor);
grid.classList.add(
  stylesObj.gridColor,
  stylesObj.borderColor,
  stylesObj.borderSize
);
settings.classList.add(
  stylesObj.gridColor,
  stylesObj.borderColor,
  stylesObj.borderSize,
  "transition-opacity"
);
instructions.classList.add(
  stylesObj.gridColor,
  stylesObj.borderColor,
  stylesObj.borderSize,
  "transition-opacity"
);
noLivesInput.classList.add(stylesObj.gridColor);
noEnemiesInput.classList.add(stylesObj.gridColor);
noCoinsInput.classList.add(stylesObj.gridColor);
instructions.classList.add(stylesObj.gridColor);
gameSpeedInput.classList.add(stylesObj.gridColor);

// Utility Functions
function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}
function removeChildren(element: HTMLElement) {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
// Start Functions
function generateGrid(rows: number, columns: number) {
  // programattically add column size to grid container
  // currently not working

  // grid.classList.add(`grid-cols-[repeat(${columns},1fr)]`);
  // grid.classList.add(`grid-rows-[repeat(${rows},1fr)]`);

  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < rows; row++) {
      const gridCell = document.createElement("div");
      gridCell.id = `xy_${row}-${column}`;
      gridCell.classList.add("border-[1px]", "border-black/25");
      grid.appendChild(gridCell);
    }
  }
}

function generatePosition<T extends Entity>(
  rows: number,
  columns: number,
  entities: T[],
  noEntities: number
) {
  let id = 0;
  while (entities.length < noEntities) {
    id++;
    let x, y;
    x = randomInt(rows);
    y = randomInt(columns);
    let entity = { x, y, id } as T;
    if (
      entities
        .filter((entity) => entity.id !== entity.id)
        .some(({ x, y }) => {
          return entity.x === x && entity.y === y;
        })
    ) {
      console.log("stopped duplicate entity");
      break;
    } else {
      entities.push(entity);
    }
  }
  return entities;
}

function colorEntity<T extends Entity>(entities: T[], color: string) {
  entities.forEach((entity) => {
    const entityCell = document.getElementById(
      `xy_${entity.x}-${entity.y}`
    ) as HTMLElement;
    entityCell.classList.toggle(color);
  });
}

// Initialize
function initGame() {
  if (window.innerWidth < 1024) {
    createJoystick();
  }
  gameParams.score = 0;
  gameParams.gameOver = false;
  gameParams.gameStarted = false;
  gameParams.noLives = Number(noLivesInput.value);
  livesDisplay.innerHTML = gameParams.noLives.toString();
  scoreDisplay.innerHTML = gameParams.score.toString();
  consoleDisplay.innerText = "";

  players = [];
  coins = [];
  enemies = [];

  removeChildren(grid);
  generateGrid(gameParams.rows, gameParams.columns);

  generatePosition(
    gameParams.rows,
    gameParams.columns,
    players,
    gameParams.noPlayers
  );
  generatePosition(
    gameParams.rows,
    gameParams.columns,
    coins,
    gameParams.noCoins
  );
  generatePosition(
    gameParams.rows,
    gameParams.columns,
    enemies,
    gameParams.noEnemies
  );

  colorEntity(players, stylesObj.playerColor);
  colorEntity(coins, stylesObj.coinColor);
  colorEntity(enemies, stylesObj.enemyColor);
}

function startGame() {
  gameParams.gameStarted = true;
}

function playerCoinCollision(players: Player[], coins: Coin[]) {
  if (
    coins.some(({ x, y }) => {
      return players[0].x === x && players[0].y === y;
    })
  ) {
    gameParams.score++;
    consoleDisplay.innerText = "you found a coin!";
    scoreDisplay.innerHTML = gameParams.score.toString();
    flashGrid("plusScoreFlashColor");
    colorEntity(coins, stylesObj.coinColor);
    coins.pop();
    generatePosition(
      gameParams.rows,
      gameParams.columns,
      coins,
      gameParams.noCoins
    );
    colorEntity(coins, stylesObj.coinColor);
  }
}
function playerHeartCollision(players: Player[], coins: Coin[]) {
  if (
    hearts.some(({ x, y }) => {
      return players[0].x === x && players[0].y === y;
    })
  ) {
    gameParams.noLives++;
    consoleDisplay.innerText = "you gained a life!";
    livesDisplay.innerText = gameParams.noLives.toString();
    flashGrid("plusLifeFlashColor");
    colorEntity(coins, stylesObj.heartColor);
    hearts.pop();
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case playerInputs.left:
      players[0].lastKeyPressed = playerInputs.left;
      break;
    case playerInputs.up:
      players[0].lastKeyPressed = playerInputs.up;
      break;
    case playerInputs.right:
      players[0].lastKeyPressed = playerInputs.right;
      break;
    case playerInputs.down:
      players[0].lastKeyPressed = playerInputs.down;
      break;
  }
});

function movePlayer(player: Player) {
  if (player.lastKeyPressed === playerInputs.left) {
    if (players[0].x === 0) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.x -= 1;
    playerCoinCollision(players, coins);
    playerHeartCollision(players, hearts);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.up) {
    if (players[0].y === 0) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.y -= 1;
    playerCoinCollision(players, coins);
    playerHeartCollision(players, hearts);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.right) {
    if (players[0].x === gameParams.columns - 1) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.x += 1;
    playerCoinCollision(players, coins);
    playerHeartCollision(players, hearts);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.down) {
    if (players[0].y === gameParams.rows - 1) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.y += 1;
    playerCoinCollision(players, coins);
    playerHeartCollision(players, hearts);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
}

initGame();
document.addEventListener("keydown", () => {
  if (!gameParams.gameStarted) startGame();
});

function flashGrid(gridFlashColor: keyof StylesObj) {
  grid.classList.toggle(stylesObj.gridBorderSize);
  grid.classList.toggle(stylesObj[gridFlashColor]);
  setTimeout(() => {
    grid.classList.toggle(stylesObj.gridBorderSize);
    grid.classList.toggle(stylesObj[gridFlashColor]);
  }, gameParams.gameSpeed / gameParams.noLives);
}

// Update functions
function minusLife() {
  gameParams.noLives--;
  flashGrid("minusLifeFlashColor");
  livesDisplay.innerHTML = gameParams.noLives.toString();
  if (gameParams.noLives === 0) {
    gameParams.gameOver = true;
    consoleDisplay.innerText = "you died!";
    const gameOverScreen = document.createElement("div");
    gameOverScreen.classList.add(
      "absolute",
      "flex",
      "flex-col",
      "left-0",
      "right-0",
      "top-0",
      "bottom-0",
      "justify-center",
      "items-center",
      "text-5xl",
      "text-7xl",
      "font-bold",
      "italic",
      "opacity-0",
      "transition-all",
      "duration-1000",
      "ease-in",
      stylesObj.bgColor,
      stylesObj.gameOverTextColor
    );
    const gameOverText = document.createElement("p");
    gameOverText.innerHTML = "GAME OVER";
    gameOverScreen.appendChild(gameOverText);
    grid.appendChild(gameOverScreen);
    const restartButton = document.createElement("button");
    restartButton.addEventListener("click", () => {
      initGame();
      gameLoop();
    });
    restartButton.innerHTML = "try again?";
    restartButton.classList.add(
      "mt-8",
      "md:mt-8",
      "px-4",
      "py-2",
      "text-xs",
      "text-base",
      "font-regular",
      "tracking-wide",
      "opacity-0",
      "transition-all",
      "duration-1000",
      "ease-in",
      "border-2",
      "border-playerColor",
      "rounded-full",
      "hover:bg-playerColor",
      "hover:text-bgColor"
    );
    gameOverScreen.appendChild(restartButton);
    setTimeout(() => {
      gameOverScreen.classList.toggle("opacity-0");
      setTimeout(() => {
        restartButton.classList.toggle("opacity-0");
      }, 1050);
    }, 50);
  }
}

function moveEnemies(enemies: Enemy[], player: Player) {
  colorEntity(enemies, stylesObj.enemyColor);
  for (const enemy of enemies) {
    const [dx, dy] = [player.x - enemy.x, player.y - enemy.y];
    if (Math.round(Math.random()) >= 0.5) continue;
    if ((dx === 0 && Math.abs(dy) === 1) || (dy === 0 && Math.abs(dx) === 1))
      continue;
    if (Math.abs(dy) >= Math.abs(dx)) {
      enemy.y = mod(enemy.y + Math.sign(dy) * 1, gameParams.rows);
    } else if (Math.abs(dx) >= Math.abs(dy)) {
      enemy.x = mod(enemy.x + Math.sign(dx) * 1, gameParams.columns);
    }
  }
  if (
    enemies.some(({ x, y }) => {
      return (
        (player.x === x && player.y === y + 1) ||
        (player.x === x && player.y === y - 1) ||
        (player.y === y && player.x === x + 1) ||
        (player.y === y && player.x === x - 1)
      );
    })
  ) {
    if (Math.round(Math.random()) > 0.7) {
      consoleDisplay.innerText = "you got hit!";
      minusLife();
    } else {
      consoleDisplay.innerText = "enemy missed!";
    }
  }
  colorEntity(enemies, stylesObj.enemyColor);
}

function updateGameState() {
  movePlayer(players[0]);
  moveEnemies(enemies, players[0]);
  if (hearts.length > 0) {
    return;
  } else if (Math.random() < 0.05) {
    generatePosition(gameParams.rows, gameParams.columns, hearts, 1);
    colorEntity(hearts, stylesObj.heartColor);
  }
}

function gameLoop() {
  if (!gameParams.gameOver) {
    if (gameParams.gameStarted) updateGameState();
    setTimeout(() => {
      window.requestAnimationFrame(gameLoop);
    }, gameParams.gameSpeed);
  }
}

gameLoop();

export {};
