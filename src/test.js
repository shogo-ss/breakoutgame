const canvas = document.getElementById('mainCanvas');
// canvasをサポートしていない環境（旧ブラウザ）でスクリプトを実行をさせない
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(10,20);
  ctx.lineTo(20,35);
  ctx.lineTo(5,25);
  ctx.closePath();
  ctx.stroke();
}

if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.rect(20,40,50,50);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  // Math.PI = 180度
  // 第4引数で
  ctx.arc(240, 160, 20, 0, Math.PI*2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.rect(160, 10, 100, 40);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
  ctx.stroke();
  ctx.closePath();
}