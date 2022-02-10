
let snowParticleCount = 0

// Get the wind force at this time and position
function getWindForce(t, x, y) {
	let scale = .003
	let theta = 10*noise(x*scale*.5, y*scale*.5, t*.07)
	let strength = noise(x*scale, y*scale, t*.1 + 150)
	let r = 100 + 1900*strength*strength
	return Vector.polar(r, theta)

}

// Draw a windmap of the snow at the current time
function debugDrawSnow(p, t) {

	// How many columns and rows of points do we want?
	let tileSize = 40
	let tileX = Math.floor(simulationWidth/tileSize)
	let tileY = Math.floor(simulationHeight/tileSize)

	let drawScale = .04
	for (var i = 0; i < tileX; i++) {
		for (var j = 0; j < tileY; j++) {

			// What point are we at?
			let x = tileSize*(i + .5)
			let y = tileSize*(j + .5)

			// Calculate the force here
			let force = getWindForce(t, x, y)

			// Draw the current wind vector
			p.fill(240, 70, 50)
			p.noStroke()
			p.circle(x, y, 2)
			p.stroke(0, 100, 100, 0.4)
			p.line(x, y, x + drawScale*force[0], y + drawScale*force[1])
		}	
	}
}

// Snow particles that are pushed around by a wind vectorfield
class SnowParticle {
	constructor(position, velocity) {
		// Have an id number
		this.idNumber = snowParticleCount++

		if (velocity === undefined)
			velocity = Vector.randomPolar(10)
		
		if (position === undefined)
			position = new Vector(Math.random()*simulationWidth, Math.random()*simulationHeight)
		
		// Create a random snow particle... somewhere
		this.position = new Vector(...position)
		this.velocity = new Vector(...velocity)
		
		// Randomly sized snow
		this.size = 1 + Math.random()*3

		this.windForce = new Vector(0, 0)
		this.gravity = new Vector(0, 25)
	}


	draw(p) {

		p.noStroke()
		p.fill(0, 100, 100)
		p.circle(...this.position, this.size)

	}


	// Time and delta time
	update(t, dt) {
		this.windForce = getWindForce(t, ...this.position)

		this.velocity.addMultiples(this.gravity, dt)

		// Move with the wind force, but bigger particles move less
		this.velocity.addMultiples(this.windForce, dt/this.size)
		this.position.addMultiples(this.velocity, dt)

		this.position[0] = (this.position[0] + simulationWidth)%simulationWidth
		this.position[1] = (this.position[1] + simulationHeight)%simulationHeight
		
		const maxSpeed = 100
		let speed = this.velocity.magnitude
		if (speed > maxSpeed) this.velocity.mult(maxSpeed/speed)

		this.velocity.mult(.99)
	}
}