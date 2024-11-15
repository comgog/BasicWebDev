const img = new Image();
const HERO_SEMI_WIDTH = 50;
const HERO_SEMI_HEIGHT = 50;

img.src = "space-gmaeassetsplayer.png";
img.onload = () => {
  // image loaded and ready to be used
};

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

window.onload = async () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const heroImg = await loadTexture("assets/player.png");
  const enemyImg = await loadTexture("assets/enemyShip.png");
  const bgImg = await loadTexture("assets/starBackground.png");
  const pattern = ctx.createPattern(bgImg, "repeat");

  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  createEnemies2(ctx, canvas, enemyImg);
  ctx.drawImage(
    heroImg,
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  ctx.drawImage(
    heroImg,
    canvas.width / 2 - 100,
    canvas.height - canvas.height / 4 + 30,
    HERO_SEMI_WIDTH,
    HERO_SEMI_HEIGHT
  );
  ctx.drawImage(
    heroImg,
    canvas.width / 2 + 60,
    canvas.height - canvas.height / 4 + 30,
    HERO_SEMI_WIDTH,
    HERO_SEMI_HEIGHT
  );
};

function createEnemies(ctx, canvas, enemyImg) {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += enemyImg.width) {
    for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
      ctx.drawImage(enemyImg, x, y);
    }
  }
}

function createEnemies2(ctx, canvas, enemyImg) {
  let MONSTER_TOTAL = 5; // 첫 줄에는 5개의 적을 배치
  const START_X = (canvas.width - MONSTER_TOTAL * enemyImg.width) / 2;

  for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width; // 현재 줄에 배치될 적들의 총 너비
    const rowStartX = (canvas.width - MONSTER_WIDTH) / 2; // 현재 줄의 시작 위치 조정

    for (
      let x = rowStartX;
      x < rowStartX + MONSTER_WIDTH;
      x += enemyImg.width
    ) {
      ctx.drawImage(enemyImg, x, y);
    }

    MONSTER_TOTAL--; // 다음 줄의 적 개수를 줄임
  }
}
