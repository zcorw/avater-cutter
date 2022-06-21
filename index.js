const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
const img = document.getElementById('img');
/**
 * canvas 绘制图片并返回基本信息
 * orientation：图片方向，水平：“horizontal”，垂直：“vertical”
 * percentage: 宽除以高
 * x: x轴坐标
 * y: y轴坐标
 * width: 绘制到画布的宽度
 * height: 绘制到画布的高度
 * scale：图片缩放比
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
  }
}
// 绘制到画布
function drawToCanvas(imgData) {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(img, imgData.x, imgData.y, imgData.width, imgData.height);
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
cvs.addEventListener('wheel', function (e) {
  const _e = e || window.event;
  const scale = _e.wheelDelta / 6000;
  _zoom(scale);
  e.preventDefault();
});
cvs.addEventListener('mousedown', dragImgOn);
cvs.addEventListener('mouseup', dragImgOff);
cvs.addEventListener('mousemove', function (e) {
  console.log(e.pageX, e.pageY)
  if (imgActive) {
    imgData = dragImg(e);
    drawToCanvas(imgData);
  }
});