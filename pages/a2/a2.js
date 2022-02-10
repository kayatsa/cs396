// Utility functions
// Given a processing object, a loop length, a radius, and an offset (optional)
function getLoopingNoise({
  p,
  loopLength,
  radius,
  offset = 0
}) {
  let t = p.millis()



  // This number should go from 0 to 1 every loopLength seconds
  // And PI*2 radians every loopLength seconds
  let noiseScale = 1
  let loopPct = (t * .001 / loopLength) % 1

  let theta = 2 * Math.PI * loopPct

  // Place to sample the noise from
  let x = radius * Math.cos(theta)
  let y = radius * Math.sin(theta)

  let noiseVal = p.noise(x * noiseScale, y * noiseScale, offset)
  return noiseVal
}

function getP5Element(index) {
  let element = document.getElementById("drawing" + index).getElementsByClassName("drawing-p5holder")[0]
  return element
}

//===========================================================

const WIDTH = 300
const HEIGHT = 300

// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("Hello, animation!")

  // Rename your drawing here if you want
  let drawingTitles = [
    "incomplete squares",
    "blotchy radar",
    "twinkle twinkle"
  ]
  let mainElement = document.getElementById("main2")

  // Ignore this section if you want
  // This is me adding a label and a canvas-holder to each swatch
  // For each drawing
  for (var i = 0; i < 3; i++) {
    let el = document.createElement("div")
    el.className = "drawing"
    el.id = "drawing" + i
    mainElement.append(el)

    // Add a label
    let label = document.createElement("div")
    label.className = "drawing-label"
    label.innerHTML = drawingTitles[i]
    el.append(label)

    // Add a div to hold the canvas (so we can resize it independently of the outer frame)
    let canvasHolder = document.createElement("div")
    canvasHolder.className = "drawing-p5holder"
    canvasHolder.style = `width:${WIDTH};height:${HEIGHT}`
    el.append(canvasHolder)
  }

  // Comment out these lines to not draw each
  incompleteSquares()
  blotchyRadar()
  twinkleTwinkle()
});

function incompleteSquares() {
  
  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {

    // trailing effect
    if (p.frameCount % 5 === 0) p.background(0, 0, 0, 0.05);

    // vars
    let t = p.millis() * .001;  // time
    let dotCount = 20;

    // draw oscillating movement
    for (var i = 0; i < dotCount; i++)
    {
      // draw settings
      p.noStroke();
      p.fill(0, 100, 100);

      // offsets
      let offsetX = Math.floor(WIDTH / dotCount) * (i + 0.5);
      let offsetY = Math.floor(HEIGHT / dotCount) * (i + 0.5);

      // horizontal movement
      let x; let y = offsetY;
      dotCount % 2 == 1 && i == dotCount / 2 ? x = offsetX : x = WIDTH/2 - (WIDTH/2 - offsetX) * Math.cos(t);
      p.circle(x, y, 2);

      // vertical movement
      x = offsetX;
      dotCount % 2 == 1 && i == dotCount / 2 ? y = offsetY : y = HEIGHT/2 - (HEIGHT/2 - offsetY) * Math.cos(t);
      p.circle(x, y, 2);
    }
  }

  let element = getP5Element(0) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}

function blotchyRadar() {

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {

    // trailing effect
    if (p.frameCount % 5 === 0) p.background(0, 0, 0, 0.05);

    // loop every 6 sec
    let t = p.millis() * 3;
    let loopPct = (t / 6000) % 1;
    let theta = loopPct * Math.PI * 2;

    // origin
    p.push();
    p.translate(WIDTH/2, HEIGHT/2);

    // circles
    let circleCount = 7;
    for (var i = 0; i < circleCount; i++)
    {
      // position
      let r = circleCount + circleCount * 3 * i
      let x = r * Math.cos(theta)
      let y = r * Math.sin(theta)

      // radius
      let maxRadius = 10;
      let minRadius = 2;
      let radius = maxRadius * Math.sin(t) + minRadius;

      // draw
      p.fill(0, 100, 100);
      p.noStroke();
      p.circle(x, y, radius);
    }

    p.pop();

  }

  let element = getP5Element(1) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);

}

function twinkleTwinkle() {

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p)
  {
    // fade out effect
    if (p.frameCount % 5 === 0) p.background(0, 0, 0, 0.05);

    // stars appear every 10 frames
    if (p.frameCount % 10 === 0)
    {
      // vars
      let maxStars = 15;  // the max num of stars that can appear
      let minStars = 5;  // the min num of stars that can appear
      let stars = ['.','⋆','·','⊹','*','⋆','˚','✦','✵','+','✺','✹','✫','✧'];

      // draw random amount of stars
      let numStars = Math.floor(Math.random() * (maxStars - minStars) + minStars);
      for (var i = 0; i <= numStars; i++)
      {
        // vars
        let x = Math.floor(Math.random() * WIDTH);
        let y = Math.floor(Math.random() * HEIGHT);
        let star = stars[Math.floor(Math.random() * stars.length)];

        // draw star
        p.fill(0, 100, 100, 0.85);
        p.text(star, x, y);
      }
    }
  }

  let element = getP5Element(2) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);

}

function unused() {

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {

    let t = p.millis() * .001;
    p.background(0, 0, 0)

    // origin
    p.push();
    p.translate(WIDTH/2, HEIGHT/2);

    // layers
    let layers = 6;
    for (var i = 0; i < layers; i++)
    {
      // draw settings
      p.beginShape();
      p.noStroke();
      p.fill(0, 100, 100, 0.25);

      // draw shape
      let sides = i+2;
      for (var j = 0; j < sides; j++)
      {
        let theta = Math.PI * 2 * (j) / sides;
        let r = 5*i * Math.cos(t) + (15*i);
        p.vertex(r * Math.cos(theta), r * Math.sin(theta));
      }

      p.endShape(p.CLOSE)
    }

    p.pop();

  }

  /*
  let element = getP5Element(2) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
  */
}