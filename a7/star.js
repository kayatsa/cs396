class Star
{
	constructor(aof)
	{
		this.aof = aof
		this.center = new Vector()

		this.rotation = 0
		this.twinkle_t

		this.points = this.aof.values[0]
		this.spikiness = this.aof.values[1]
		this.twinkle = this.aof.values[2]
		this.spin = this.aof.values[3]
		this.luminosity = this.aof.values[4]
	}

	update(t, dt)
	{
		this.rotation = t * (this.spin * .02)
		this.twinkle_t = t * 3

		this.points = this.aof.values[0]
		this.spikiness = this.aof.values[1]
		this.twinkle = this.aof.values[2]
		this.spin = this.aof.values[3]
		this.luminosity = this.aof.values[4]
	}

	draw(p)
	{
		p.push()
		p.noStroke()
		p.fill(0, 100, 100, this.luminosity * .01)

		p.rotate(this.rotation)

		let angle = p.TWO_PI / this.points
		let halfAngle = angle / 2.0

		p.beginShape()
		
		for (let a = 0; a < p.TWO_PI; a += angle)
		{
			let sx = p.cos(a) * (this.spikiness + this.twinkle * p.cos(this.twinkle_t) + this.twinkle)
			let sy = p.sin(a) * (this.spikiness + this.twinkle * p.cos(this.twinkle_t) + this.twinkle)
			p.vertex(sx, sy)

			sx = p.cos(a + halfAngle) * (10 + this.twinkle/2 * p.cos(this.twinkle_t) + this.twinkle/2)
			sy = p.sin(a + halfAngle) * (10 + this.twinkle/2 * p.cos(this.twinkle_t) + this.twinkle/2)
			p.vertex(sx, sy)
		}

		p.endShape()
		
		p.pop()
	}
}

Star.landmarks =
{
	"standard": [5, 28, 3, 9, 100],
	"pinwheel": [8, 90, 0, 100, 85],
	"cute": [6, 15, 5, 40, 60],
	"breathing": [9, 50, 20, 10, 75],
	"dramatic": [7, 100, 50, 100, 90]
}

Star.labels = ["points", "spikiness", "twinkle", "spin", "luminosity"]