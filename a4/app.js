

// Outermost scope, 
// You can access these variables from *anywhere*, in fxns, or in html

// These get created when P5 is initialized
let SLIDERS = {

}

let FLAGS = {
	drawBoidDebug: false,
	drawRocketDebug: false,
	drawSnowDebug: false
}


let drawMode = "snow"

// Pause button, also pause on spacebar
let paused = false
document.onkeyup = function(e){
    if(e.keyCode == 32){
        paused = !paused
    }
}



// Store our two Processing instances in the global scope
// so we can refer to them separately when we want
let mainP5 = undefined
let lightmap = undefined


let simulationWidth = 600
let simulationHeight = 360


// an object to hold boids
const boidParticlesStartCount = 0
let boidFlock = new BoidFlock()

// Hold some snow ❄️
const snowParticleStartCount = 0
let snowParticles = []

// Rocket things
const rocketStartCount = 0
let rockets = []
for (var i = 0; i < rocketStartCount; i++) { 
	rockets.push(new Rocket())
}


// Moving noise into the global scope so its not attached to P5 
let noise = function() {
	console.warn("Noise not yet initialized")
}



// Create a p5 slider, but ALSO, label it and append it to the controls object
function createSlider({label, min,max, defaultValue, step=1}) {
	SLIDERS[label] = mainP5.createSlider(min, max, defaultValue, step)

	let controls = document.getElementById("controls")
	let holder = document.createElement("div");
	holder.className = "slider"
	holder.innerHTML = label

	// Add things to the DOM
	controls.append(holder)
	holder.append(SLIDERS[label].elt)
}

// random point returns a point somewhere in this processing object
function randomPoint(p) {
	return [(Math.random())*p.width, (Math.random())*p.height]
}

// Do setup
document.addEventListener("DOMContentLoaded", function(){

	mainP5 = new p5(

		// Run after processing is initialized
		function(p) {

			// Set the noise function to P5's noise
			noise = p.noise

			p.setup = () => {

				// Basic setup tasks
				p.createCanvas(simulationWidth, simulationHeight);
				p.colorMode(p.HSL);
				p.background("white")

				// CREATE SLIDERS!!
				createSlider({label:"cometMaxSpeed", min:50, max: 150, defaultValue: 70, step: 10})
				createSlider({label:"cometLoopiness", min:.01, max: 1, defaultValue: .4, step: .01})
				createSlider({label:"swarmCohesion", min:0, max: 200, defaultValue: 50})
				createSlider({label:"swarmDrag", min:.001, max: .1, defaultValue: .014, step: .001})
			}

			p.mouseClicked = () => {
				let t = p.millis()*.001

				// Processing likes to greedily respond to *all* mouse events, 
				// even when outside the canvas
				// This code checks to see if we're *actually* in the P5 window before responding
				// Use this code if you implement dragging, too
				// From https://stackoverflow.com/questions/36767196/check-if-mouse-is-inside-div
				
				if (p.canvas.parentNode.querySelector(":hover") == p.canvas) {
					
					//Mouse is inside element
					let mousePos = new Vector(p.mouseX, p.mouseY)
					
					// Make a new boid
					switch(drawMode) {
						case "boid": 
							boidFlock.addBoid(mousePos)
							break;
						case "snow": 
							snowParticles.push(new SnowParticle(mousePos))
							break;
						case "rocket": 
							rockets.push(new Rocket(mousePos))
							break;
					}
				} 
			}


			p.draw = () => {
				p.background(0)

				// Not updating the background
				let t = p.millis()*.001
				let dt = p.deltaTime*.001


				//-------------------
				// Kateparticles 

				// UPDATE! 
				if (!paused) {
					boidFlock.update(t, dt)			
					snowParticles.forEach(pt => pt.update(t, dt))		
					rockets.forEach(pt => pt.update(t, dt))	
				}

				// Draw boids
				boidFlock.draw(p)
				if (FLAGS.drawBoidDebug) {
					boidFlock.debugDraw(p)
				}

				p.fill(130, 100, 50)
				p.stroke(170, 100, 30)
				

				// Draw snow things
				snowParticles.forEach(pt => pt.draw(p))
				if (FLAGS.drawSnowDebug) {
					debugDrawSnow(p, t)
				}
					
				// Draw rockets
				rockets.forEach(rocket => rocket.draw(p, t))
				if (FLAGS.drawRocketDebug) {
					rockets.forEach(rocket => rocket.debugDraw(p))
				}

				//Uncomment for the detail window, if you want it
				// p.fill(0, 0, 100, .8)
				// p.noStroke()
				// p.rect(0, 0, 100, 50)
				// p.fill("black")
				// p.text(drawMode, 5, 10)
					
			}
		}, 

	// A place to put the canvas
	document.getElementById("main4"));
})
