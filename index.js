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

let imgData;
img.onload = function() {
  imgData = init();
  drawToCanvas(imgData);
}
document.getElementById('plus').addEventListener('click', function() {
  const scale = imgData.scale + 0.02;
  imgData = zoomImage(imgData, scale);
  drawToCanvas(imgData);
});
document.getElementById('minus').addEventListener('click', function() {
  const scale = imgData.scale - 0.02;
  imgData = zoomImage(imgData, scale);
  drawToCanvas(imgData);
});
document.getElementById('cvsWrap').onmousewheel = function (e) {
  console.log(e.wheelDelta)
}