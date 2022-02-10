// An array of floats

let aofCount = 0
class AoF  {
	constructor(labels)
	{
		this.mode = "none"
		this.idNumber = aofCount++
		this.idColor = [(this.idNumber*39)%360, 100, 50]
		
		// points, spikiness, twinkle, spinniness, luminosity

		this.min = [5, 15, 0, 0, 25]
		this.max = [10, 100, 50, 100, 100]

		this.labels = labels
		this.values = []
		for (var i = 0; i < labels.length; i++) {
			this.values[i] = Math.floor(Math.random() * (this.max[i] - this.min[i] + 1) + this.min[i])
		}
	}

	update(t, dt) {
	}

	set(index, val) {
		if (typeof index === String)
			index = this.labels.indexOf(index)
		Vue.set(this.values, index, val)
	}

	setToNoise(t) {
		for (var i = 0; i< this.values.length; i++) {
			let val = Math.floor(noise(this.idNumber*35 + i*100, t) * this.max[i])
			Vue.set(this.values, i, val)
		}
	}

	randomize() {
		for (var i = 0; i< this.values.length; i++) {
			Vue.set(this.values, i, Math.floor(Math.random() * (this.max[i] - this.min[i] + 1) + this.min[i]))
		}
	}


	get(index) {
		if (typeof index === "string") {
			index = this.labels.indexOf(index)
		}
		return this.values[index]
	}

	setLabels(labels) {
		Vue.set(this, "labels", labels)
	}

	setValues(vals) {
		for (var i = 0; i < vals.length; i++) {
			Vue.set(this.values, i, vals[i])
		}
	}

	valuesToString() {
		return ("[" + this.values.map(s => s.toFixed(0)).join(", ") + "]")
	}

	valuesToLabeledString() {
		return this.values.map((s,index) => {
			return ("\t" + this.labels[index] + ":").padEnd(20, ' ') + s.toFixed(2)
		}).join("\n")
	}
}


//====================================================================================
// A set of sliders for a single AOF

Vue.component("aof-sliders", {
	template: `<div class="aof-sliders">
		<table>
			<tr v-for="(value,valIndex in aof.values">
				<td class="label">{{aof.labels[valIndex]}}</td>
				<td class="slider-cell">
					<div class="slider-val">{{value}}</div>
					<input type="range" v-bind:min="aof.min[valIndex]" v-bind:max="aof.max[valIndex]" step="1" class="slider" :value="value" @input="ev => change(ev, valIndex)" />
				</td>
			</tr>
		</table>
		<button @click="aof.randomize(); console.log(aof.min[0])">randomize</button>
	</div>`,

	computed: {
		titleStyle() {
			let c = this.aof.idColor
			return {
				color: `hsla(${c[0]}, ${c[1]}%,${c[2]}%)`
			}
		}
	},

	mounted() {
		this.aofinput = this.aof.valuesToString()
	},
	watch: {
		"aof.values"() {
			this.aofinput = this.aof.valuesToString()
		}
	},

	methods: {
		setFromInput() {
			let val = JSON.parse(this.aofinput)
			this.aof.setValues(val)
		},
		change(ev,  valIndex) {
			let val = parseFloat(ev.target.value)
			this.aof.set(valIndex, val)
		}
	},

	data() {
		return {
			aofinput: ""
		}
	},

	props: ["aof"]
})

