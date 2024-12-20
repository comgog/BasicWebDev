// Base Classes
class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
  }
  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
  }
}

// Specific Game Objects
class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 99;
    this.height = 75;
    this.type = "Hero";
    this.cooldown = 0; // 초기화
    this.life = 3;
    this.points = 0;
  }
  fire() {
    if (this.canFire()) {
      // 쿨다운 확인
      gameObjects.push(new Laser(this.x + this.width / 2 - 5, this.y - 10)); // 레이저 생성
      this.cooldown = 500; // 쿨다운 500ms 설정
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id); // 쿨다운 완료 후 타이머 종료
        }
      }, 100);
    }
  }
  canFire() {
    return this.cooldown === 0; // 쿨다운 상태 확인
  }
  decrementLife() {
    this.life--;
    console.log(this.life);
    if (this.life === 0) {
      this.dead = true;
    }
  }
  incrementPoints() {
    this.points += 100;
  }
}

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = "Laser";
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100);
  }
}

class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    this.life = 1;
    // 적 캐릭터의 자동 이동 (Y축 방향)
    let id = setInterval(() => {
      if (this.y < canvas.height - this.height) {
        this.y += 5; // 아래로 이동
      } else {
        clearInterval(id); // 화면 끝에 도달하면 정지
      }
    }, 300);
  }
}

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear() {
    this.listeners = {};
  }
}

// Constants and Global Variables
const HERO_SEMI_WIDTH = 42;
const HERO_SEMI_HEIGHT = 42;
const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

let heroImg,
  enemyImg,
  laserImg,
  bossImg,
  canvas,
  collisionImg,
  lifeImg,
  ctx,
  gameObjects = [],
  hero,
  stageLevel,
  gameLoopId,
  eventEmitter = new EventEmitter();

// Utility Functions
function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

// Main Game Initialization and Loops
window.onload = async () => {
  // Load Resources
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  const bgImg = await loadTexture("assets/starBackground.png");
  laserImg = await loadTexture("assets/laserRed.png");
  bossImg = await loadTexture("assets/boss.png");
  collisionImg = await loadTexture("assets/laserGreenShot.png");
  lifeImg = await loadTexture("assets/life.png");
  stageLevel = 0;
  const pattern = ctx.createPattern(bgImg, "repeat");

  // Initialize Game
  initGame(0);
  startAutoFire();

  // Main Game Loop
  gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawPoints();
    drawLife();
  }, 100);

  // Input Handlers
  let onKeyDown = function (e) {
    switch (e.keyCode) {
      case 37: // 왼쪽 화살표
      case 38: // 위쪽 화살표
      case 39: // 오른쪽 화살표
      case 40: // 아래쪽 화살표
      case 32: // 스페이스바
        e.preventDefault(); // 기본 동작 차단
        break;
      default:
        break; // 다른 키는 기본 동작 유지
    }
  };
  window.addEventListener("keydown", onKeyDown);

  window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
      eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
      eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (evt.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    } else if (evt.key === " ") {
      eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
  });

  // Game Logic Functions
  function initGame(stage) {
    gameObjects = [];
    createEnemies(stage);
    createHero();

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
      hero.y -= 5;
      semi_hero1.y -= 5;
      semi_hero2.y -= 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
      hero.y += 5;
      semi_hero1.y += 5;
      semi_hero2.y += 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
      hero.x -= 10;
      semi_hero1.x -= 10;
      semi_hero2.x -= 10;
    });

    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
      hero.x += 10;
      semi_hero1.x += 10;
      semi_hero2.x += 10;
    });

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
      if (hero.canFire()) {
        hero.fire();
      }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
      enemy.dead = true;
      hero.decrementLife();
      if (isHeroDead()) {
        eventEmitter.emit(Messages.GAME_END_LOSS);
        return; // loss before victory
      }
      if (isEnemiesDead()) {
        eventEmitter.emit(Messages.GAME_END_WIN);
      }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
      first.dead = true; // lazer
      second.life--;
      if (second.life == 0) {
        second.dead = true; // enemy
      }
      hero.incrementPoints();

      // 충돌 이미지 생성 및 추가
      const collisionEffect = new GameObject(first.x - 30, first.y - 30);
      collisionEffect.img = collisionImg;
      collisionEffect.width = collisionImg.width; // 충돌 이미지 크기
      collisionEffect.height = collisionImg.height;
      gameObjects.push(collisionEffect); // 게임 객체 배열에 추가

      // 충돌 이미지의 생명 주기 설정 (몇 초 후에 자동으로 제거)
      setTimeout(() => {
        collisionEffect.dead = true;
      }, 500); // 500ms 후에 제거

      if (isEnemiesDead()) {
        eventEmitter.emit(Messages.GAME_END_WIN);
      }
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => {
      endGame(true);
    });

    eventEmitter.on(Messages.GAME_END_LOSS, () => {
      endGame(false);
    });
    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
      resetGame();
    });
  }

  function startAutoFire() {
    setInterval(() => {
      // 발사 가능한 경우에만 발사
      semi_hero1.fire(); // 세미 영웅 1의 레이저 발사
      semi_hero2.fire(); // 세미 영웅 2의 레이저 발사
    }, 500); // 500ms 마다 자동 발사
  }

  function createEnemies(stage) {
    switch (stage % 3) {
      case 0:
        let MONSTER_TOTAL_1 = 5; // case 1에서만 사용할 변수로 이름 변경
        for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
          const MONSTER_WIDTH = MONSTER_TOTAL_1 * enemyImg.width; // 현재 줄에 배치될 적들의 총 너비
          const rowStartX = (canvas.width - MONSTER_WIDTH) / 2; // 현재 줄의 시작 위치 조정

          for (
            let x = rowStartX;
            x < rowStartX + MONSTER_WIDTH;
            x += enemyImg.width
          ) {
            // 적 이미지를 그리는 부분
            ctx.drawImage(enemyImg, x, y);

            // Enemy 객체를 gameObjects 배열에 추가
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
          }

          MONSTER_TOTAL_1--; // 다음 줄의 적 개수를 줄임
        }
        break;

      case 1:
        const MONSTER_TOTAL_0 = 5;
        const MONSTER_WIDTH = MONSTER_TOTAL_0 * 98;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;
        const STOP_X = START_X + MONSTER_WIDTH;
        for (let x = START_X; x < STOP_X; x += 98) {
          for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
          }
        }
        break;
      case 2:
        const enemy = new Enemy(canvas.width / 2 - 250, 0);
        enemy.img = bossImg;
        enemy.height *= 5;
        enemy.width *= 5;
        enemy.life = 30;
        gameObjects.push(enemy);
        break;

      default:
        break;
    }
  }

  function createHero() {
    hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
    hero.img = heroImg;

    semi_hero1 = new Hero(hero.x - 60, hero.y + 40); // 왼쪽
    semi_hero1.img = heroImg;
    semi_hero1.height *= 0.5;
    semi_hero1.width *= 0.5;

    semi_hero2 = new Hero(hero.x + 110, hero.y + 40);
    semi_hero2.img = heroImg;
    semi_hero2.height *= 0.5;
    semi_hero2.width *= 0.5;
    gameObjects.push(hero);
    gameObjects.push(semi_hero1);
    gameObjects.push(semi_hero2);
  }

  function drawGameObjects(ctx) {
    gameObjects.forEach((go) => go.draw(ctx));
  }

  function intersectRect(r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }

  function drawLife() {
    const START_POS = canvas.width - 180;
    for (let i = 0; i < hero.life; i++) {
      ctx.drawImage(lifeImg, START_POS + 45 * (i + 1), canvas.height - 37);
    }
  }
  function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, 10, canvas.height - 20);
  }

  function drawText(message, x, y) {
    ctx.fillText(message, x, y);
  }

  function isHeroDead() {
    return hero.life <= 0;
  }
  function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemies.length === 0;
  }
  function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }
  function endGame(win) {
    clearInterval(gameLoopId);
    // 게임 화면이 겹칠 수 있으니, 200ms 지연
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (win) {
        switch (stageLevel % 3) {
          case 0:
            displayMessage(
              "Victory!!! Clear Stage 1 - Press [Enter] to start a next stage",
              "green"
            );
            stageLevel++;
            break;
          case 1:
            displayMessage(
              "Victory!!! Clear Stage 2 - Press [Enter] to start a BOSS stage",
              "green"
            );
            stageLevel++;
            break;
          case 2:
            displayMessage(
              "Victory!!! Clear ALL Stage - Press [Enter] to start a new game",
              "green"
            );
            stageLevel++;
            break;

          default:
            break;
        }
      } else {
        displayMessage(
          "You died !!! Press [Enter] to start a new game Captain Pew Pew"
        );
      }
    }, 200);
  }

  function resetGame() {
    if (gameLoopId) {
      clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
      eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
      initGame(stageLevel); // 게임 초기 상태 실행
      gameLoopId = setInterval(() => {
        // 100ms 간격으로 새로운 게임 루프 시작
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPoints();
        drawLife();
        updateGameObjects();
        drawGameObjects(ctx);
      }, 100);
    }
  }

  function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    lasers.forEach((l) => {
      enemies.forEach((m) => {
        if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
          eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
            first: l,
            second: m,
          });
        }
      });
    });

    enemies.forEach((enemy) => {
      const heroRect = hero.rectFromGameObject();
      if (intersectRect(heroRect, enemy.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
      }
    });
    gameObjects = gameObjects.filter((go) => !go.dead);
  }
};
