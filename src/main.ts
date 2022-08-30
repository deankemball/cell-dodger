// Define Types
interface Colors {
  bgColor: string;
  textColor: string;
  playerColor: string;
  coinColor: string;
  enemyColor: string;
  gridColor: string;
}
interface GameParams {
  noPlayers: number;
  noEnemies: number;
  noCoins: number;
  gameSpeed: number;
  rows: number;
  columns: number;
  score: number;
  lives: number;
}
interface Entity {
  // [{x:1,y:1},{x:2,y:3}]
  x: number;
  y: number;
}

interface Player extends Entity {
  lives: number;
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
const colors: Colors = {
  bgColor: "bg-bgColor",
  textColor: "bg-textColor",
  playerColor: "bg-playerColor",
  coinColor: "bg-coinColor",
  enemyColor: "bg-enemyColor",
  gridColor: "bg-gridColor",
};

let defaultGameParams: GameParams = {
  noPlayers: 1,
  noEnemies: 5,
  noCoins: 1,
  gameSpeed: 300,
  rows: 20,
  columns: 20,
  score: 0,
  lives: 3,
};

let gameParams: GameParams = defaultGameParams;

let playerInputs: PlayerInputs = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
};

// Add Event Listeners
const body = document.querySelector("body") as HTMLElement;
const grid = document.querySelector("#grid-container") as HTMLElement;
const noLives = document.querySelector("#noLives") as HTMLElement;
const noEnemiesInput = document.querySelector("#noEnemies") as HTMLElement;
const noCoinsInput = document.querySelector("#noCoins") as HTMLElement;
const settingsButton = document.querySelector("#settings-icon") as HTMLElement;
const helpButton = document.querySelector("#help-icon") as HTMLElement;
const scoreDisplay = document.querySelector("#score") as HTMLElement;
const livesDisplay = document.querySelector("#lives") as HTMLElement;

// Utility Functions
function randomInt(max: number) {
  return Math.floor(Math.random() * max);
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
      gridCell.classList.add("border-2", "border-black");
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
  while (entities.length < noEntities) {
    let x, y;
    x = randomInt(rows);
    y = randomInt(columns);
    let entity = { x, y } as T;
    entities.push(entity);
  }
  return entities;
}

function colorEntity<T extends Entity>(entities: T[], color: string) {
  entities.forEach((entity) => {
    const entityCell = document.getElementById(
      `xy_${entity.x}-${entity.y}`
    ) as HTMLElement;
    entityCell.classList.add(color);
  });
}

// Initialize
generateGrid(gameParams.rows, gameParams.columns);
generatePosition(
  gameParams.rows,
  gameParams.columns,
  players,
  gameParams.noPlayers
);
console.log(players);
colorEntity(players, colors.playerColor);

export {};
