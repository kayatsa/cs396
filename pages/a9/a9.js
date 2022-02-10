const canvasW = 720
const canvasH = 480
let offset = new Vector(0,0)

let sliders = {
	zoom: [0, 0, 100],
	lineWidth: [25, 1, 100],
	eyeStarScatter: [1, 0, 5],
	handStarScatter: [15, 0, 20]
}

let app =
{
	paused: false,
	useHandsFree: false,
	staticPlayback: false,
	recording: false,
	recordingData: {hand:[],face:[]},
	mouse: new Vector(),

	init()
	{
		if (app.useHandsFree)
			initHandsFree()
		else {
			initTestData()
		}

		// initVideo()
		// document.getElementById('image').appendChild(app.image);
	},

	draw(p)
	{
		p.push()
		p.translate(p.width/2, p.height/2)
		
		let relOffset = Vector.add(offset, app.mouse.dragOffset)
		relOffset.mult(-1)
		p.translate(...relOffset.coords)
		
		app.zoom = (sliders.zoom[0]/20) + 1
		p.scale(app.zoom, app.zoom)
		
		app.lineWidth = sliders.lineWidth[0]
		app.eyeStarScatter = sliders.eyeStarScatter[0]
		app.handStarScatter = sliders.handStarScatter[0]
		
		starry(p)
	}
}

// Setup and Vue things
document.addEventListener("DOMContentLoaded", function()
{
	// CONTROLS
	// UI to control things *not* handled by individual AOFs
	new Vue({
		el : "#controls",
		template: `
		<div id="controls">
			recording: {{app.recordingData.face.length}}
			<div>
				<button @click="app.recording=!app.recording" :class="{toggled:app.recording}">record</button>
				<button @click="saveData()">copy</button>
				<button @click="saveHandData()">copy hands</button>
			</div>
			<table>
				<tr v-for="(value,label in sliders">
					<td class="label">{{label}}</td>
					<td class="slider-cell">
						<div class="slider-val">{{sliders[label][0]}}</div>
						<input type="range" v-bind:min="sliders[label][1]" v-bind:max="sliders[label][2]" :step="1" class="slider" v-model="sliders[label][0]"  />
					</td>
				</tr>
			</table>
		</div>`, 

		methods:
		{
			saveData()
			{
				let output = 'let testFaceData = ' + neatJSON(app.recordingData.face, {decimals:1})
				console.log(output)
				navigator.clipboard.writeText(output);
			},

			saveHandData()
			{
				let output = 'let testHandData = ' + neatJSON(app.recordingData.hand, {decimals:1})
				console.log(output)
				navigator.clipboard.writeText(output);
			}
		},

		data()
		{
			return {
				sliders: sliders,
				app: app
			}
		}
	})

	// P5
	new Vue({
		el : "#app",
		template: `<div id="app">
			<div id="p5-holder" ref="p5"></div>
		</div>`,

		mounted()
		{
			app.p5 = new p5((p) =>
			{
				app.mouse.dragStart = new Vector()
				app.mouse.dragOffset = new Vector()

				p.setup = () =>
				{
					p.createCanvas(canvasW, canvasH)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)
				}

				function mouseInP5()
				{
					return p.mouseX > 0 && p.mouseX < canvasW && p.mouseY > 0 && p.mouseY < canvasH
				}

				p.mousePressed = () =>
				{
					if (mouseInP5())
					{
						app.mouse.dragging = true
						app.mouse.dragStart.setTo(p.mouseX, p.mouseY)
					}
				}
				p.mouseReleased = () =>
				{
					app.mouse.dragging = false
					offset.add(app.mouse.dragOffset)
					app.mouse.dragOffset.setTo(0, 0)
				}
				
				p.mouseMoved = () => { app.mouse.setTo(p.mouseX, p.mouseY) }

				p.mouseDragged = () => {
					app.mouse.setTo(p.mouseX, p.mouseY)
					if (app.mouse.dragging) {
						app.mouse.dragOffset.setToDifference(app.mouse.dragStart, app.mouse)
						console.log(app.mouse.dragOffset.toFixed(2))
					}
				}

				p.doubleClicked = () => {}
				p.mouseClicked = () => {}
				
				p.draw = () =>
				{
					let t = p.millis()*.001
					
					for (key in sliders) if (typeof sliders[key] === "string") sliders[key] = parseFloat(sliders[key])

					if (app.recording)
					{
						app.recordingData.face.push(face.points.map(pt => pt.coords.slice(0)))
						let handData = hand.map(h => h.points.map(pt => pt.coords.slice(0)))
						app.recordingData.hand.push(handData)
					}
					
					app.draw(p, t)
				}

			}, this.$refs.p5)

			app.init()
		},
		
		data() {
			return {
				output: "",
				app: app,
			}
		}
		
	}) 
})

//============
// Utilities
// Returns a value between 0 and 1, but never reaching either

// https://zaiste.net/posts/javascript-class-function/
function isClass(func) {
  return typeof func === 'function'
    && /^class\s/.test(Function.prototype.toString.call(func));
}

function sigmoid(v) {
	return 1 / (1 + Math.pow(Math.E, -v));
}

function unitSigmoid(v, range=1) {
	return 1 / (1 + Math.pow(Math.E, -range*(v - .5)));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}


document.addEventListener('keyup', function(e){
	
	console.log(e)
	if (e.key === "Shift") {
		// Clear all the shift-selected
		app.shiftDown = false
		// Vue.set(app, "shiftSelected", [])
	}
});  

document.addEventListener('keydown', function(e){
	if (e.key === "Shift") {
		app.shiftDown = true
		Vue.set(app, "shiftSelected", [])
	}
	if (e.code === "Space") {
		app.paused = !app.paused
		console.log("paused", app.paused)
	}
});
