function game(canvasId) {
  const c=document.getElementById(canvasId);
  const ctx=c.getContext("2d");

  let gunAngle = -Math.PI/2;
  let gunLength = 50;
  let gunSpeed = 2;
  let bulletSpeed = 200;
  let enemySpeed = 100;
  let enemySize = 30;
  let enemyRate = 3;


  function Bullet(angle) {
    this.x = 500 + Math.cos(angle) * gunLength;
    this.y = 1000 + Math.sin(angle) * gunLength;

    this.update = (dt) => {
      this.x += Math.cos(angle) * dt * bulletSpeed;
      this.y += Math.sin(angle) * dt * bulletSpeed;
      return this.x < 1000 && this.x > 0 && this.y > 0 && this.y < 1000;
    };

    this.draw = () => {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }


  function Enemy(x) {
    let y = 0;

    this.update = (dt) => {
      y += enemySpeed * dt;
      return y < 1000;
    };

    this.collidesWith = (bullet) => {
      return Math.sqrt((bullet.x - x)**2 + (bullet.y - y)**2) < enemySize;
    };

    this.draw = () => {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(x,y, enemySize, 0, Math.PI*2, true);
      ctx.fill();
    }
  }


  let bullets = [];
  let enemies = [
    new Enemy(300)
  ];

  function drawGun() {
    ctx.beginPath();
    ctx.moveTo(500,1000);
    const x = Math.cos(gunAngle) * gunLength;
    const y = Math.sin(gunAngle) * gunLength;
    ctx.lineWidth=10;
    ctx.lineTo(500+x,1000+y);
    ctx.stroke();
  }


  let previousTime = 0;
  let moving = 0;
  let enemyAccumulator = 0;

  function tick(timeStamp) {
    let dt = (timeStamp - previousTime) / 1000;
    if (dt > 0.1) {
      dt = 0.1; //if we get less than 10 fps, then limit it
    }
    previousTime = timeStamp;
    enemyAccumulator += dt;
    if (enemyAccumulator >= enemyRate) {
      enemies.push(new Enemy(Math.random()*800 + 100));
      enemyAccumulator = 0;
    }

    bullets.forEach(bullet => {
      if (!bullet.update(dt)) {
        bullets = bullets.filter(b => b !== bullet);
      }
    });

    enemies.forEach(enemy => {
      if (!enemy.update(dt)) {
        enemies = enemies.filter(e => e !== enemy);
      };

      bullets.forEach(bullet => {
        if (enemy.collidesWith(bullet)) {
          enemies = enemies.filter(e => e !== enemy);
          bullets = bullets.filter(b => b !== bullet);
        }
      });
    });

    if (moving !== 0) {
      gunAngle += moving * dt * gunSpeed;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    bullets.forEach(bullet => {
      bullet.draw();
    });

    enemies.forEach(enemy => {
      enemy.draw();
    });
    drawGun();


    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);


  document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
      case 37:
        moving = -1; break;
      case 39:
        moving = +1; break;
      case 32:
        bullets.push(new Bullet(gunAngle)); break;
    }
  });

  document.addEventListener("keyup", function(event) {
    switch(event.keyCode) {
      case 37:
      case 39:
        moving = 0; break;
    }
  })
}