let SLIDERS = {}

// Moving noise into the global scope so its not attached to P5
let noise = () => {}
const canvasW = 400
const canvasH = 400
const dimensions = 10

let app = {
	
	// Selected individuals
	hovered: undefined,
	selected: undefined,
	shiftSelected: [],

	// All current individuals
	individuals: [],
	currentClass: Star,
	popCount: 1,
	
	// Create a bunch of individuals
	populate() {

		app.individuals = []
		for (var i = 0; i < app.popCount; i++) {

			// Create an array of floats

			// SET UP DNA
			let aof = new AoF(app.currentClass.labels)
			
			// Create an indivudual with this "dna"
			let individual = new app.currentClass(aof)

			// Layout
			// let pct = app.popCount==1?.5:i/(app.popCount - 1)
			// let x = canvasW*.5 + (canvasW - 100)*.9*(pct - .5)
			// let y = canvasH*(.8 + .1*(i%2))
			
			individual.center.coords[0] = canvasW / 2
			individual.center.coords[1] = canvasH / 2

			// Save to an array
			app.individuals.push(individual)
		}

		app.selected = app.individuals[0]
		
	},

	loadByAOF(vals) {
		app.selected.aof.setValues(vals)
	},

	update(t, dt) {
		app.individuals.forEach((individual) => {
			
			// Update my AOF
			individual.aof.update(t, dt)
			individual.update(t, dt)
		})			
	},

	draw(p) {
		// Sort individuals back to front for drawing multiples
		individualsSorted = app.individuals.sort((a,b) => {
			return a.center.coords[1] - b.center.coords[1]
		})

		// Draw everyone laid out
		individualsSorted.forEach((individual) => {
			p.push()
			p.translate(...individual.center.coords)
			individual.draw(p)
			p.pop()
		})
	}


}

// Setup and Vue things
document.addEventListener("DOMContentLoaded", function(){
	
	// CONTROLS
	// UI to control things *not* handled by individual AOFs
	new Vue({
		el : "#controls",
		template: `<div id="controls">
			<aof-sliders :aof="aof" v-if="aof"/><br />
			<div>
				<p>presets</p>
				<button v-for="(landmarkAOF,landmarkName) in app.currentClass.landmarks" @click="app.loadByAOF(landmarkAOF, landmarkName)">{{landmarkName}}</button>
			</div>
			
		</div>`,

		methods: {
			reroll() {
				app.populate()
			}
		},

		computed: {
			aof() {
				if (app.selected)
					return app.selected.aof
			}
		},

		data() {
			return {
				app: app,
			}
		}
	})

	// P5
	new Vue({
		el : "#app",
		template: `<div id="app">
			<div id="p5-holder" ref="p5"></div>
		</div>`,

		mounted() {
			let p = new p5((p) =>
			{
				// Save the noise fxn
				noise = p.noise

				// Basic P5 setup
				p.setup = () => {
					p.createCanvas(canvasW, canvasH)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)
					app.populate()
				}

				p.draw = () =>
				{
					let frameCount = p.frameCount
					let t = p.millis()*.001
					let dt = p.deltaTime*.001
					
					app.update(t, dt, frameCount)

					p.background(0)
					app.draw(p)
				}

			}, this.$refs.p5)
		},
		
		data() {
			return {
				app: app,
			}
		}
		
	}) 
})

//============
// Utilities
// Returns a value between 0 and 1, but never reaching either
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