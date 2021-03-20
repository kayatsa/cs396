let emoji = ["", "☁️", "🌧️", "💧"]

let simCount = 0
class Simulation
{
	// Some number of grids
	constructor(mode)
	{
		// Mode can control various factors about the simulation
		this.mode = mode
		this.idNumber = simCount++
		this.noiseSeed = this.idNumber
		this.stepCount = 0
		
		// Set my size
		this.w = 40
		this.h = 18

		this.isWrapped = true
		this.isPaused = true
		this.selectedCell = undefined

		this.noiseScale = .3

		this.gameOfLifeGrid = new Grid(this.w, this.h, this.isWrapped)

		// You can make additional grids, too
		this.heightMap = new Grid(this.w, this.h, this.isWrapped)
		this.emojiGrid = new Grid(this.w, this.h, this.isWrapped)

		// Tuning values for the continuous simulation
		this.backgroundRadiation = 1
		this.lifeThreshold = 1

		this.randomize()
	}

	randomize()
	{
		this.noiseSeed += 10
		
		this.heightMap.setAll((x,y) => noise(x*this.noiseScale, y*this.noiseScale + 100*this.noiseSeed))**4
		
		if (this.mode === "continuous") this.gameOfLifeGrid.setAll((x,y) =>(this.heightMap.get(x, y)))
		else this.gameOfLifeGrid.setAll((x,y) =>Math.round(this.heightMap.get(x, y)))
	}

	step()
	{
		this.stepCount++

		// Make one step
		// Set all the next steps, then swap the buffers
		
		this.gameOfLifeGrid.setNext((x, y, currentValue) => {

			let neighbors = [
				this.gameOfLifeGrid.get(x + 1, y),
				this.gameOfLifeGrid.get(x - 1, y),
				this.gameOfLifeGrid.get(x, y + 1),
				this.gameOfLifeGrid.get(x, y - 1),
				this.gameOfLifeGrid.get(x - 1, y - 1),
				this.gameOfLifeGrid.get(x + 1, y - 1),
				this.gameOfLifeGrid.get(x - 1, y + 1),
				this.gameOfLifeGrid.get(x + 1, y + 1)
			]

			let count = 0;
			let rainCount = 0;

			for (var i = 0; i < neighbors.length; i++)
			{
				if (neighbors[i] > 0) count++;
				if (neighbors[i] == 2) rainCount++;
			}
			
			switch (this.mode)
			{
				case "clouds only":
				{
					// if a cloud is surrounded by 3 or less clouds, 80% chance it dissipates
					if (currentValue === 1)
					{
						if (count <= 4 && this.probability(.8)) return 0

						// otherwise, there's a 10% chance to dissipate
						else
						{
							if (this.probability(0.1)) return 0
							return 1
						}
					}

					// if an empty space is surrounded by 4 or more clouds, it forms a cloud
					else if (currentValue == 0)
					{
						if (count >= 4) return 1

						// otherwise, there's a 5% chance to form a cloud (from random evaporation from land)
						else
						{
							if (this.probability(0.05)) return 1
							return 0
						}
					}
				}

				
				case "percipitation no evaporation":
				{
					// same as before, with some changes

					if (currentValue === 1)
					{
						// OLD: if surrounded by 3 or less clouds, 80% chance it dissipates
						if (count <= 4 && this.probability(.8)) return 0

						// NEW: if a cloud is surrounded by more than 5 clouds, (20 + 10 * count)% chance it'll turn into a rain cloud
						else if (count == 8 && this.probability(.2 + 0.1 * count)) return 2

						// NEW: if a cloud is surrounded by more than 1 rain cloud, (10 * rainCount)% chance it'll also turn into a rain cloud
						else if (rainCount >= 1 && this.probability(0.1 * rainCount)) return 2

						// OLD: 10% chance to dissipate otherwise
						else
						{
							if (this.probability(0.05)) return 0
							return 1
						}
					}

					else if (currentValue == 2)
					{
						// OLD: if surrounded by 3 or less clouds, 80% chance it dissipates
						if (count <= 4 && this.probability(.8)) return 0

						// NEW: if a rain cloud is surrounded by 2 or less rain clouds, 60% chance it will revert to normal cloud
						else if (rainCount <= 2 && this.probability(0.6)) return 1;

						// NEW: if surrounded by more than 2 rain clouds, 30% chance it will revert to normal cloud
						else if (this.probability(0.3)) return 1;

						// OLD: 30% chance to dissipate otherwise
						else
						{
							if (this.probability(0.3)) return 0
							return 2
						}
					}

					// OLD: if an empty space is surrounded by 4 or more clouds, it forms a cloud
					else if (currentValue == 0)
					{
						if (count >= 4) return 1

						// OLD: otherwise, there's a 5% chance to form a cloud (from random evaporation from land)
						else
						{
							if (this.probability(0.05)) return 1
							return 0
						}
					}
				}

				case "percipitation and evaporation":
					{
						// same as before, with some changes
	
						if (currentValue === 1)
						{
							// OLD: if surrounded by 3 or less clouds, 80% chance it dissipates
							if (count <= 4 && this.probability(.8)) return 0
	
							// OLD: if a cloud is surrounded by more than 5 clouds, (20 + 10 * count)% chance it'll turn into a rain cloud
							else if (count == 8 && this.probability(.2 + 0.1 * count)) return 2
	
							// OLD: if a cloud is surrounded by more than 1 rain cloud, (10 * rainCount)% chance it'll also turn into a rain cloud
							else if (rainCount >= 1 && this.probability(0.1 * rainCount)) return 2
	
							// OLD: 10% chance to dissipate otherwise
							else
							{
								if (this.probability(0.05)) return 0
								return 1
							}
						}
	
						else if (currentValue == 2)
						{
							// NEW: when a rain cloud dissipates, it leaves the cell wet

							// OLD: if surrounded by 3 or less clouds, 80% chance it dissipates
							if (count <= 4 && this.probability(.8)) return 3
	
							// OLD: if a rain cloud is surrounded by 2 or less rain clouds, 60% chance it will revert to normal cloud
							else if (rainCount <= 2 && this.probability(0.6)) return 1;
	
							// OLD: if surrounded by more than 2 rain clouds, 30% chance it will revert to normal cloud
							else if (this.probability(0.3)) return 1;
	
							// OLD: 30% chance to dissipate otherwise
							else
							{
								if (this.probability(0.3)) return 3
								return 2
							}
						}

						// NEW: what happens when the cell is wet?

						else if (currentValue == 3)
						{
							// NEW: 50% chance it'll turn into some kind of cloud
							if (this.probability(0.5))
							{
								// NEW: (10 + 10 * rainCount)% chance it'll turn into rain cloud
								if (this.probability(0.1 + 0.1 * rainCount)) return 2

								// NEW: turn into normal cloud otherwise
								else return 1
							}

							// NEW: turn dry otherwise
							else return 0
						}
	
						// OLD: if an empty space is surrounded by 4 or more clouds, it forms a cloud
						else if (currentValue == 0)
						{
							if (count >= 4) return 1
	
							// OLD: otherwise, there's a 5% chance to form a cloud (from random evaporation from land)
							else
							{
								if (this.probability(0.05)) return 1
								return 0
							}
						}
					}

				default:
				{
					if (x == 0 && y == 0) console.warn("unknown mode:", this.mode)
					
					// Just copy the current values
					return currentValue
				}

			}
		})
	
		// Swap the new value buffer into the current value buffer
		this.gameOfLifeGrid.swap()
	}

	// Draw a cell.  Add emoji or color it

	drawCell(p, x, y, cellX, cellY, cellW, cellH) {

		if (this.selectedCell && this.selectedCell[0] === x && this.selectedCell[1] === y) {
			p.strokeWeight(2)
			p.stroke("red")
		}
		else  {
			p.strokeWeight(1)
			p.stroke(0, 0, 0, .1)
		}

		p.rect(cellX, cellY, cellW, cellH)

		let val = this.gameOfLifeGrid.get(x, y)
		if (val > 0) p.text(emoji[val], cellX, cellY + cellH/1.5)

	}

	// Mouse interactions

	select(x, y) {
		this.selectedCell = [x, y]
	}

	click(x, y) {
		this.gameOfLifeGrid.set(x, y, 1)
	}

	// Utility functions

	getNeighborPositions(x1, y1, wrap)
	{
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + this.w)%this.w
			x2 = (x2 + this.w)%this.w
			y0 = (y0 + this.h)%this.h
			y2 = (y2 + this.h)%this.h
		}
		
		return [[x0,y0],[x1,y0],[x2,y0],[x2,y1],[x2,y2],[x1,y2],[x0,y2],[x0,y1]]
	}

	// probability function from https://stackoverflow.com/questions/26271868/is-there-a-simpler-way-to-implement-a-probability-function-in-javascript
	// let 0 < n < 1
	probability(n)
	{
		return !!n && Math.random() <= n
	}
}