// draw functions

function drawContour(p, contour, close)
{
	p.beginShape()

	contour[0].vertex(p)
	contour.slice().forEach(pt => pt.curveVertex(p))
	contour[contour.length - 1].vertex(p)

	p.endShape(close ? p.CLOSE : undefined)
}

function drawEyeshadow(p, contour)
{
	let maxOffset = app.eyeStarScatter

	p.textSize(5)
	p.textAlign(p.CENTER)
	p.noStroke()
	
	contour.forEach(pt => drawStar(p, pt, maxOffset))
}

function addToTrail(trail, pos, maxLength)
{
	if (trail.length == 0 || Vector.getDistance(pos, trail[trail.length - 1]) > 10) trail.push(pos.clone())
	while (trail.length > maxLength) trail.shift()
}

function drawTrail(p, contour)
{
	let maxOffset = app.handStarScatter

	p.textSize(15)
	p.textAlign(p.CENTER)
	p.noStroke()

	let verts = contour.slice()

	for (var j = 0; j < 2; j++)
	{
		for (var i = 0; i < verts.length; i++)
		{
			let pt = verts[i]
			drawStar(p, pt, maxOffset)
		}
		
		verts.reverse()
	}
}

// helper functions

function drawStar(p, pt, maxOffset)
{
	let stars = ['.','⋆','·','⊹','*','˚','✦','✵','+','✺','✹','✫','✧']
	let star = stars[Math.floor(Math.random() * stars.length)]

	let offsetX = Math.floor(Math.random() * (maxOffset * 2 + 1) - maxOffset)
	let offsetY = Math.floor(Math.random() * (maxOffset * 2 + 1) - maxOffset)

	p.text(star, pt.coords[0] + offsetX, pt.coords[1] + offsetY)
}

// test functions

function drawTestFacePoints(p) {
	p.noStroke()
	p.fill(0, 100, 100)
	let radius =  1/app.zoom + .1

	p.textSize(radius*6)
	face.points.forEach((pt,i) => {
		pt.draw(p, radius)
		
		p.text(pt.index, pt.coords[0], pt.coords[1])
	})
}

function drawTestHandPoints(p)
{
	let radius =  1/app.zoom + .1
	p.textSize(radius*6)

	hand.forEach(h =>
	{
		h.fingers.forEach((finger, fingerIndex) =>
		{
			p.noFill()
			p.strokeWeight(16)
			p.stroke(fingerIndex*40, 100, 50)
			drawContour(p, finger)
		})

		p.noStroke()
		p.fill(0, 100, 100)
		h.points.forEach(pt =>
		{
			pt.draw(p, radius)
			p.text(pt.index, pt.coords[0], pt.coords[1])
		})

		p.strokeWeight(3)
		h.handDir.drawArrow(
		{
			p:p, 
			center:h.wrist, 
			color: [100,100,50]
		})

		h.pointDir.forEach((dir,index) => dir.drawArrow(
		{
			p:p, 
			center: h.fingers[index][3],
			color: [100 + 30*index,100,50]
		}))
	})
}