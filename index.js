const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const img = document.getElementById('img');
const mask = document.getElementById('maskBox');
const maskContext = mask.getContext('2d');
maskContext.fillStyle = 'rgba(0,0,0,0.6)';
maskContext.clearRect(0, 0, mask.width, mask.height);
maskContext.fillRect(0, 0, mask.width, mask.height);
maskContext.clearRect(mask.width / 2 - 82.5, mask.height / 2 - 25, 165, 50);

/**
 * canvas 绘制图片并返回基本信息
 * orientation：图片方向，水平：“horizontal”，垂直：“vertical”
 * percentage: 宽除以高
 * x: x轴坐标
 * y: y轴坐标
 * width: 绘制到画布的宽度
 * height: 绘制到画布的高度
 * scale：图片缩放比
 * degree: 旋转角度
 */
function init() {
  const percentage = img.width / img.height;
  let orientation;
  let x = 0;
  let y = 0;
  let width = cvs.width;
  let height = cvs.height;
  let scale = 1;
  if (img.width > img.height) {
    orientation = "horizontal";
    y = (cvs.height - cvs.width / percentage) / 2;
    height = cvs.width / percentage;
    scale = cvs.width / img.width;
  } else {
    orientation = "vertical";
    x = (cvs.width - cvs.height * percentage) / 2;
    width = cvs.width * percentage;
    scale = cvs.height / img.height;
  }
  return {
    percentage,
    orientation,
    x,
    y,
    width,
    height,
    scale,
    degree: 0,
  }
}
// 绘制到画布
function drawToCanvas(imgData) {
  ctx.save();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.translate(imgData.x + imgData.width / 2, imgData.y + imgData.height / 2);
  ctx.rotate(imgData.degree * (Math.PI / 180));
  ctx.translate(-(imgData.x + imgData.width / 2), -(imgData.y + imgData.height / 2));
  ctx.drawImage(img, imgData.x, imgData.y, imgData.width, imgData.height);
  ctx.restore();
}
// 图片缩放并计算缩放后的基本信息
function zoomImage(imgData, scale) {
  const convertH = img.height * scale;
  const convertW = img.width * scale;
  const offsetH = (convertH - imgData.height) / 2;
  const offsetW = (convertW - imgData.width) / 2;
  return {
    ...imgData,
    scale,
    x: imgData.x - offsetW,
    y: imgData.y - offsetH,
    width: convertW,
    height: convertH,
  }
}
// 拖拽图片
let imgActive = false;
let dragPoint = { x: 0, y: 0 };
function dragImgOn(e) {
  imgActive = true;
  dragPoint = {
    pageX: e.pageX,
    pageY: e.pageY,
    x: imgData.x,
    y: imgData.y,
  };
}
function dragImgOff(e) {
  imgActive = false;
}
function dragImg(e) {
  e.preventDefault();
  const offset = {
    x: e.pageX - dragPoint.pageX,
    y: e.pageY - dragPoint.pageY,
  };
  return {
    ...imgData,
    x: dragPoint.x + offset.x,
    y: dragPoint.y + offset.y,
  }
}
// 旋转图片
function turnImg(degree) {
  const d = imgData.degree + degree;
  if (d < 0) {
    return {
      ...imgData,
      degree: 360 + d,
    }
  } else if (d >= 360) {
    return {
      ...imgData,
      degree: d - 360,
    }
  } else {
    return {
      ...imgData,
      degree: d,
    }
  }
}

let imgData;
img.onload = function () {
  imgData = init();
  drawToCanvas(imgData);
}
function _zoom(scale) {
  const _scale = imgData.scale + scale;
  imgData = zoomImage(imgData, _scale);
  drawToCanvas(imgData);
}
document.getElementById('plus').addEventListener('click', function () {
  _zoom(0.02);
});
document.getElementById('minus').addEventListener('click', function () {
  _zoom(-0.02);
});
document.getElementById('turnLeft').addEventListener('click', function () {
  imgData = turnImg(-90);
  drawToCanvas(imgData);
});
document.getElementById('turnRight').addEventListener('click', function () {
  imgData = turnImg(90);
  drawToCanvas(imgData);
});
const box = document.getElementById('wrap');
box.addEventListener('wheel', function (e) {
  e.preventDefault();
  const _e = e || window.event;
  const scale = _e.wheelDelta / 6000;
  _zoom(scale);
});
box.addEventListener('mousedown', dragImgOn);
box.addEventListener('mouseup', dragImgOff);
box.addEventListener('mousemove', function (e) {
  if (imgActive) {
    imgData = dragImg(e);
    drawToCanvas(imgData);
  }
});