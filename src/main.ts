interface GameParams {
  noEnemies: number;
  noCoins: number;
  gameSpeed: number;
  rows: number;
  columns: number;
  playerColor: string;
  coinColor: string;
  enemyColor: string;
  score: number;
}

let defaultGameParams: GameParams = {
  noEnemies: 5,
  noCoins: 1,
  gameSpeed: 300,
  rows: 20,
  columns: 20,
  playerColor: "#ED1C24",
  coinColor: "#F1D302",
  enemyColor: "#0081A7",
  score: 0,
};
let gameParams: GameParams = defaultGameParams;

let bgColor = "#141414";
let textColor = "#FDFFFC";

const body = document.querySelector("body") as HTMLElement;
const grid = document.querySelector("#grid-container") as HTMLElement;
const noCoinsInput = document.querySelector("#noCoins") as HTMLElement;
const noEnemiesInput = document.querySelector("#noEnemies") as HTMLElement;
const gameSpeedInput = document.querySelector("#gameSpeed") as HTMLElement;

export {};
