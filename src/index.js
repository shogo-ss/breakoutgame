const canvas = document.getElementById('mainCanvas');
// canvasをサポートしていない環境（旧ブラウザ）でスクリプトを実行をさせない
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  // スタート値
  var start = 0;
  var initialize = 1;
  var blinking = 70;
  // ボール初期位置
  var x = canvas.width/2;
  var y = canvas.height-20;
  var ballRadius = 5;
  // 移動位置
  var dx = 3;
  var dy = -3;
  // パドルサイズ
  var paddleWidth = 75;
  var paddleHeight = 5;
  var paddleX = (canvas.width-paddleWidth)/2;
  var paddleOffsetBottom = 10;
  // パドル操作
  var rigthPressed = false;
  var leftPressed = false;
  // スコア
  var score = 0;
  var lives = 3;
  // ブロック
  var brickRowCount = 5;
  var brickColumnCount = 10;
  var brickWidth = 40;
  var brickHeight = 10;
  var brickPadding = 4;
  var brickOffsetTop = 25;
  var brickOffsetLeft = 20;
  // ブロック格納
  var bricks = [];
  for (var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (var r=0; r<brickRowCount; r++) {
      // オブジェクトに座標、ステータスセット
      bricks[c][r] = {x: 0, y: 0, status: 3};
    }
  }

  // イベント
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler,  false);
  document.addEventListener('mousemove', mouseMoveHandler, false);
  document.addEventListener('keydown', keyDownStart, false);

  // キー押された時
  function keyDownHandler(e)
  {
    // IE,Edge => 'Right' or 'Left'
    // IE,Edge以外 => 'ArrowRight' or 'ArrowLeft'
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      rigthPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = true;
    }
  }

  // キー放れた時
  function keyUpHandler(e)
  {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      rigthPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = false;
    }
  }

  // マウス操作
  function mouseMoveHandler(e)
  {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
      paddleX = relativeX - paddleWidth/2;
      if (start ==  0) {
        x = relativeX;
      }
    }
  }

  // スタート
  function keyDownStart(e)
  {
    if (e.key == 'Enter') {
      start = 1;
      if (paddleX + paddleWidth/2 < canvas.width/2) {
        dx = -dx;
      }
      draw();
    }
  }

  // ブロック当たり判定
  function collisionDetection()
  {
    for (var c=0; c<brickColumnCount; c++) {
      for (var r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status >= 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            b.status--;
            if (b.status == 0) {
              score++;
            }
            if (score == brickColumnCount*brickRowCount) {
              alert('CLEAR! CONGRATULATIONS!');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  // ボール描画
  function drawBall()
  {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }

  // パドル描画
  function drawPaddle()
  {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight-paddleOffsetBottom, paddleWidth, paddleHeight);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }

  // ブロック描画
  function drawBricks()
  {
    for (var c=0; c<brickColumnCount; c++) {
      for (var r=0; r<brickRowCount; r++) {
        if (bricks[c][r].status >= 1) {
          // 開始位置座標の取得
          brickX = (c * (brickWidth + brickPadding) + brickOffsetLeft);
          brickY = (r * (brickHeight + brickPadding) + brickOffsetTop);
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          if (bricks[c][r].status == 3) {
            ctx.fillStyle = 'teal';
          } else if (bricks[c][r].status == 2) {
            ctx.fillStyle = 'silver';
          } else {
            ctx.fillStyle = 'gray';
          }
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // スコア描画
  function drawScore()
  {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 8, 20);
  }

  // ライフ描画
  function drawLives()
  {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
  }

  // 初期メッセージ
  function drawStart()
  {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    if (blinking >= 20) {
      ctx.fillText('Enterを押したらSTART!', canvas.width/2 - 80, canvas.height/2);
    }
    blinking--;
    if (blinking == 0) {
      blinking = 70;
    }
  }

  // 全体描画
  function draw()
  {
    // clearRect(左上x, 左上y, 右下x, 右下y) => 指定範囲を全て消去する
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      // '-'を入れることで符号を逆にする
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius - paddleOffsetBottom - paddleHeight) {
      if (x > paddleX && x < paddleX + paddleWidth && y + dy <= canvas.height - ballRadius - paddleOffsetBottom) {
        dy = -dy;
      } else if (y > canvas.height) {
        lives--;
        if (lives == 0) {
          alert('GAME OVER');
          document.location.reload();
        } else {
          start = 0;
          initialize = 1;
          if (lives > 0) {
            alert('LAST: ' + lives);
            cancelAnimationFrame(requestAnimationFrame(draw));
            return drawInitialize();
          }
        }
      }
    }
    // 右キーが押下されたらパドル描画開始位置を変更
    if (rigthPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    }
    if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
    x += dx;
    y += dy;

    if (start == 1) {
      requestAnimationFrame(draw);
    }
  }

  // 初期設定
  function drawInitialize()
  {
    if (initialize == 1) {
      x = canvas.width/2;
      y = canvas.height-20;
      dx = 3;
      dy = -3;
      paddleX = (canvas.width - paddleWidth)/2;
      initialize = 0
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawStart();
    if (rigthPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
      x += 7;
    }
    if (leftPressed && paddleX > 0) {
      paddleX -= 7;
      x -= 7;
    }
    if (start == 0) {
      requestAnimationFrame(drawInitialize);
    }
  }
  drawInitialize();
}