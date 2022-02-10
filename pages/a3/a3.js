// Outermost scope,
// You can access these variables from *anywhere*, in fxns, or in html
let myP5 = undefined;
let mode = "stars";
let mousePositions = [];

function clearCanvas() {
	myP5.background("black");
}

document.addEventListener("DOMContentLoaded", function () {
	// Add a processing instance

	// Create the processing instance, and store it in myP5,
	// where we can access it anywhere in the code
	let element = document.getElementById("main3");
	myP5 = new p5(
		// Run after processing is initialized
		function (p) {
			p.setup = () => {
				p.createCanvas(500, 500);
				p.colorMode(p.HSL);

				// Hue, Sat, Light
				// (0-360,0-100,0-100)
				p.background("black");
			};

			p.mouseDragged = () => {
				let t = p.millis() * 0.001;

				// Save this current mouse position in an array
				// .... but what will you do with an array of vectors?
				mousePositions.push([p.mouseX, p.mouseY]);

				switch (mode) {
					case "stars":
						let allStars = [
							".",
							"⋆",
							"·",
							"⊹",
							"*",
							"˚",
							"✦",
							"✵",
							"+",
							"✺",
							"✹",
							"✫",
							"✧",
						];
						let starIndex = Math.floor(
							Math.random() * allStars.length
						);
						let star = allStars[starIndex];

						let offsetX = Math.floor(Math.random() * 50 - 25);
						let offsetY = Math.floor(Math.random() * 50 - 25);

						// Try out some blend modes
						// p.blendMode(p.MULTIPLY);
						// p.blendMode(p.OVERLAY);
						// p.blendMode(p.SCREEN);
						// p.blendMode(p.DIFFERENCE);

						p.fill(0, 100, 100);
						p.text(star, p.mouseX + offsetX, p.mouseY + offsetY);
						// Turn back to normal
						p.blendMode(p.BLEND);
						break;

					case "smudge":
						p.loadPixels();

						// Get the current mouse position
						let x = Math.floor(p.mouseX);
						let y = Math.floor(p.mouseY);

						// using polar coords to go in a circle shape
						let maxR = 50;

						// iterate through theta (in degrees)
						for (var theta = 0; theta < 360; theta += 30) {
							// set last color to center
							let lastColor = p.get(x, y);

							// iterate through r
							for (var r = 0; r < maxR; r++) {
								let dripPct = r / maxR;

								// new point
								let [x2, y2] = vector.getAddPolar(
									[x, y],
									r,
									theta * (360 / Math.PI)
								);

								// Get the current color and blend it with the last color
								let pixelColor = p.get(x2, y2);
								let finalColor = vector.lerp(
									pixelColor,
									lastColor,
									1 - dripPct
								);

								if (
									x2 > 0 &&
									x2 < p.width &&
									y2 > 0 &&
									y2 < p.height
								)
									p.set(x2, y2, finalColor);

								// Save this color to blend with later pixels
								lastColor = finalColor;
							}
						}

						p.updatePixels();

						break;

					case "squiggles":
						if (mousePositions.length < 2) break;

						// get last and current mouse positions
						let lastMouse = [
							mousePositions[mousePositions.length - 2][0],
							mousePositions[mousePositions.length - 2][1],
						];
						let currMouse = [p.mouseX, p.mouseY];

						// create vector using last and current mouse positions
						// let currMouse be the head, and lastMouse the tail
						let vecMouse = [
							lastMouse[0] - currMouse[0],
							lastMouse[1] - currMouse[1],
						];

						// number of curves
						//let curves = Math.floor(Math.random() * 10 + 5);
						let curves = 2;

						// initializing bezier points
						let p0 = currMouse;
						let p1, cp0, cp1;

						// draw each curve
						for (var i = 0; i <= curves; i++) {
							// vector for this curve
							let v = vecMouse;

							// extend vector by some magnitude
							let mag = Math.random() * 5;
							v = vector.mult(v, mag);

							// determine random angle to rotate
							let theta =
								Math.random() * (Math.PI / 2) - Math.PI / 4;

							// rotate vector by random angle
							v = [
								v[0] * Math.cos(theta) - v[1] * Math.sin(theta),
								v[0] * Math.sin(theta) + v[1] * Math.cos(theta),
							];

							// determine p1
							p1 = [p0[0] + v[0], p0[1] + v[1]];

							// find perpendicular unit vec
							let perp = [-1 * v[1], v[0]];
							perp = vector.normalize(perp);

							// determine random pcts for lerping
							let pct0 = Math.random() * 0.5;
							let pct1 = Math.random() * 0.5;

							// determine lerp points
							cp0 = vector.lerp(p0, p1, pct0);
							cp1 = vector.lerp(p1, p0, pct1);

							// extend perp by some random value, determine cps
							let magPerp = Math.random() * 20 - 10;
							let perp0 = vector.mult(perp, magPerp);
							cp0 = [cp0[0] + perp0[0], cp0[1] + perp0[1]];

							magPerp = Math.random() * 20 - 10;
							let perp1 = vector.mult(perp, magPerp);
							cp1 = [cp1[0] + perp1[0], cp1[1] + perp1[1]];

							// draw curve
							p.fill(0, 0, 0, 0);
							p.stroke(0, 100, 100, Math.random());
							p.bezier(
								p0[0],
								p0[1],
								cp0[0],
								cp0[1],
								cp1[0],
								cp1[1],
								p1[0],
								p1[1]
							);
						}

						break;

					default:
						console.warn("UNKNOWN TOOL:" + mode);
				}
			};

			p.mouseReleased = () => {
				// clear mouse positions array
				mousePositions = [];
			};
		},

		// A place to put the canvas
		element
	);
});
