let fingerTrails = [[[],[],[],[],[]], [[],[],[],[],[]]]

function starry(p)
{
	if (p.frameCount % 5 != 0) return

	p.background(0)
	p.strokeWeight(app.lineWidth / 25)
	p.stroke(0, 100, 100)

	p.noFill()
	face.maskStrings.forEach(mstr => drawContour(p, mstr))

	p.fill(0)
	drawContour(p, face.mask)
	
	p.noFill()

	face.sideOrder.forEach(side =>
	{
		p.noStroke()
		p.fill(0, 100, 100)
		drawEyeshadow(p, side.eyeShadow)

		p.fill(0)
		p.stroke(0, 100, 100)
		drawContour(p, side.eyeRings[4])
	})

	hand.forEach((h,handIndex) =>
	{
		h.fingers.forEach((finger,fingerIndex) =>
		{
			let trail = fingerTrails[handIndex][fingerIndex]
			if (!app.paused) addToTrail(trail, finger[3], 8)
			
			p.noStroke()
			p.fill(0, 100, 100, .8)
			drawTrail(p, trail)

			p.fill(0)
			p.stroke(0, 100, 100)

			for (var i = 0; i < finger.length - 1; i++)
			{
				let joint0 = finger[i]
				let joint1 = finger[i + 1]
				let radius0 = getFingerSize(fingerIndex, i) * (finger.length - i - 1) * .25
				let radius1 = getFingerSize(fingerIndex, i) * (finger.length - i - 1) * .125
				let boneAngle = joint0.angleTo(joint1) 
				
				p.beginShape(p.TRIANGLE_MESH)
				joint0.polarOffsetVertex(p, radius0, boneAngle + Math.PI/2)
				joint0.polarOffsetVertex(p, radius0, boneAngle - Math.PI/2)
				joint1.polarOffsetVertex(p, radius1, boneAngle - Math.PI/2)
				joint1.polarOffsetVertex(p, radius1, boneAngle + Math.PI/2)
				p.endShape()

				radius0 *= -1
				radius1 *= -1

				p.beginShape(p.TRIANGLE_MESH)
				joint0.polarOffsetVertex(p, radius0, boneAngle + Math.PI/2)
				joint0.polarOffsetVertex(p, radius0, boneAngle - Math.PI/2)
				joint1.polarOffsetVertex(p, radius1, boneAngle - Math.PI/2)
				joint1.polarOffsetVertex(p, radius1, boneAngle + Math.PI/2)
				p.endShape()
			}
		})
	})
}

function getFingerSize(fingerIndex)
{
	let r = 1 + .3 * Math.sin(1 * fingerIndex - .5)
	if (fingerIndex == 0) r *= 1.6
	r *= 12
	return r
}