
let video;
let poseNet;
let tracker = {};
let modelReady = false;
let poses = [];

// A list of all the body parts that we want to track
let bodyParts = ['leftWrist', 'leftElbow', 'leftShoulder', 'rightWrist', 'rightElbow', 'rightShoulder'];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReadyCallback);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReadyCallback() {
  modelReady = true;
}

function findAngle(p1, p2, p3) {
  // Finding angles
  let angle = (Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x)) * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;
  }

  return angle;
}


function draw() {
  // if model is not ready yet, do nothing
  if (!modelReady) return;

  image(video, 0, 0, width, height);
  // if there are poses, check for dab
  textAlign(CENTER, CENTER);
  textSize(32);
  let result = checkForDab();
  text(result, width / 2, height / 2);
  
}

function interp(x, x0, x1, y0, y1) {
  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

function validatePoses() {
  if (poses.length == 0) return false;
  let flag = true;
  bodyParts.forEach(element => {
    let part = poses[0].pose[element];
    if (part.confidence > 0.5) {
      tracker[element] = { x: part.x, y: part.y };
    }
    else {
      flag = false;
    }
  });
  return flag;
}
function checkForDab() {

  if (!validatePoses()) return "Not tracking all body parts";

  let angleL = findAngle(tracker['leftWrist'], tracker['leftElbow'], tracker['leftShoulder']);
  let angleR = findAngle(tracker['rightWrist'], tracker['rightElbow'], tracker['rightShoulder']);
  let angleLs = findAngle(tracker['leftElbow'], tracker['leftShoulder'], tracker['rightShoulder']);
  let angleRs = findAngle(tracker['rightElbow'], tracker['rightShoulder'], tracker['leftShoulder']);
  console.log(angleL, angleR, angleLs, angleRs);
  perLs = interp(angleLs, 20, 190, 0, 100);
  perRs = interp(angleRs, 20, 190, 0, 100);
  let perL = 0;
  let perR = 0;
  if (angleR < 90 && angleL > 120) {
    perL = interp(angleL, 90, 120, 0, 100);
    perR = interp(angleR, 11, 20, 200, 0);
    console.log(perL, perR);
    console.log("Left Dab");
  }
  if (angleR > 120 && angleL < 90) {
    perL = interp(angleL, 11, 20, 200, 0);
    perR = interp(angleR, 20, 190, 0, 100);
    console.log(perL, perR);
    console.log("Right Dab");
  }

  let total = perL + perR + perLs + perRs;
  console.log(total);
  let pTotal = interp(total, 0, 500, 0, 100);

  if (pTotal < 50) {
    return "Not dabbing";
  }
  if (pTotal < 70) {
    return "Almost there";
  }
  else {
    stroke(255, 0, 0);
    drawLine(tracker['leftWrist'], tracker['leftElbow']);
    drawLine(tracker['leftElbow'], tracker['leftShoulder']);
    drawLine(tracker['rightWrist'], tracker['rightElbow']);
    drawLine(tracker['rightElbow'], tracker['rightShoulder']);
    drawLine(tracker['leftShoulder'], tracker['rightShoulder']);
    return "Nice dab";
  }
}

function drawLine(partA, partB) {
  stroke(255, 0, 0);
  line(partA.x, partA.y, partB.x, partB.y);
}