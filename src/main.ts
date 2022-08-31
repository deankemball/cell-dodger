import { cloneDeep } from "lodash";

// Define Types
interface StylesObj {
  bgColor: string;
  textColor: string;
  playerColor: string;
  coinColor: string;
  enemyColor: string;
  gridColor: string;
  borderColor: string;
  borderSize: string;
  gameOverTextColor: string;
  gridBorderSize: string;
  gridBorderColor: string;
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
  delay: number;
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
  gridColor: "bg-gridColor",
  borderColor: "border-black/25",
  borderSize: "border-[1px]",
  gameOverTextColor: "text-playerColor",
  gridBorderSize: "border-2",
  gridBorderColor: "border-playerColor",
};

const defaultGameParams: GameParams = {
  noPlayers: 1,
  noEnemies: 10,
  noCoins: 1,
  noLives: 3,
  gameSpeed: 300,
  rows: 20,
  columns: 20,
  score: 0,
  gameStarted: false,
  gameOver: false,
  delay: 300,
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

function toggleIcons(icon: HTMLImageElement, iconName: string) {
  if (!icon.src.includes("filled")) {
    icon.src = `./${iconName}-filled.svg`;
  } else {
    icon.src = `/${iconName}.svg`;
  }
}
settingsButton.addEventListener("click", () => {
  toggleIcons(settingsButton, "settings");
  settings.classList.toggle("opacity-0");
});
helpButton.addEventListener("click", () => {
  toggleIcons(helpButton, "help");
  instructions.classList.toggle("opacity-0");
});

// function updateInput(element: HTMLInputElement, gameParam: keyof GameParams) {
//   element.addEventListener("input", () => {
//     gameParams[gameParam] = Number(element.value);
//     console.log(gameParams[gameParam]);
//     initGame();
//   });
// }

// updateInput(noLivesInput, "noLives");
// updateInput(noEnemiesInput, "noEnemies");
// updateInput(gameSpeedInput, "gameSpeed");
// updateInput(noCoinsInput, "noCoins");

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
  gameParams = cloneDeep(defaultGameParams);
  // gameParams.gameOver = false;
  // gameParams.gameStarted = false;
  // gameParams.score = 0;
  // gameParams.noLives = 3;
  players = [];
  coins = [];
  enemies = [];
  noEnemiesInput.value = gameParams.noEnemies.toString();
  noCoinsInput.value = gameParams.noCoins.toString();
  noLivesInput.value = gameParams.noLives.toString();
  gameSpeedInput.value = gameParams.gameSpeed.toString();

  livesDisplay.innerHTML = gameParams.noLives.toString();
  scoreDisplay.innerHTML = gameParams.score.toString();

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

  console.log("coins", coins, "players", players);
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
    scoreDisplay.innerHTML = gameParams.score.toString();
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

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case playerInputs.left:
      players[0].lastKeyPressed = playerInputs.left;
      break;
    case playerInputs.up:
      players[0].lastKeyPressed = playerInputs.up;
      playerCoinCollision(players, coins);
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
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.up) {
    if (players[0].y === 0) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.y -= 1;
    playerCoinCollision(players, coins);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.right) {
    if (players[0].x === gameParams.columns - 1) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.x += 1;
    playerCoinCollision(players, coins);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
  if (player.lastKeyPressed === playerInputs.down) {
    if (players[0].y === gameParams.rows - 1) return;
    colorEntity([players[0]], stylesObj.playerColor);
    player.y += 1;
    playerCoinCollision(players, coins);
    colorEntity([players[0]], stylesObj.playerColor);
    player.lastKeyPressed = "";
  }
}

initGame();
document.addEventListener("keydown", () => {
  if (!gameParams.gameStarted) startGame();
});

// Update functions
function minusLife() {
  gameParams.noLives--;
  colorEntity(players, stylesObj.playerColor);
  grid.classList.toggle(stylesObj.gridBorderSize);
  grid.classList.toggle(stylesObj.gridBorderColor);
  setTimeout(() => {
    colorEntity(players, stylesObj.playerColor), 50;
    grid.classList.toggle(stylesObj.gridBorderSize);
    grid.classList.toggle(stylesObj.gridBorderColor);
  });
  livesDisplay.innerHTML = gameParams.noLives.toString();
  if (gameParams.noLives === 0) {
    gameParams.gameOver = true;
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
      console.log(
        "gameover",
        gameParams.gameOver,
        "gamestarted",
        gameParams.gameStarted
      );
    });
    restartButton.innerHTML = "try again?";
    restartButton.classList.add(
      "mt-8",
      "px-4",
      "py-2",
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
        (player.y === y && player.x === x - 1) ||
        (player.y === y && player.x === x - 1)
      );
    })
  ) {
    minusLife();
  }
  colorEntity(enemies, stylesObj.enemyColor);
}

function updateGameState() {
  movePlayer(players[0]);
  moveEnemies(enemies, players[0]);
}

function gameLoop() {
  if (!gameParams.gameOver) {
    if (gameParams.gameStarted) updateGameState();
    setTimeout(() => {
      window.requestAnimationFrame(gameLoop);
    }, gameParams.delay);
  }
}

gameLoop();

export {};
