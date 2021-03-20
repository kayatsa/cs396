let paused = false
let grids = document.getElementsByClassName("p5-grid")
let controls = document.getElementsByClassName("controls")

document.addEventListener('keyup', function(e){
	if(e.keyCode == 32){
		paused = !paused
	}
	if(e.keyCode == 78){
		sim.step()
	}
});  

let noise = new p5().noise
let sim = new Simulation()

document.addEventListener("DOMContentLoaded", function()
{
	new Vue(
	{
		el : "#app",
		template: `<div id="app">
			<p>How can we simulate realistic formation, dissipation, and movement of clouds?
			This question is actually commonly asked across several industries, and
			<a href="https://www.sciencedirect.com/science/article/pii/S2468502X17300013">there's always ongoing efforts</a> to answer this question as best as possible.
			While this emoji essay won't delve deep into the complex meteorological aspects of how clouds work,
			it will visually illustrate a simple demonstration of the basics of the water cycle.</p>

			<p>---</p>

			<p>The first simulation showcases how clouds react to other clouds.</p>
			<p>- If a cloud is surrounded by 3 or less clouds, 80% chance it dissipates. Otherwise, only 10% chance to dissipate.<br>
			<br>- If an empty space is surrounded by 4 or more clouds, it always forms a cloud. Otherwise, only 5% chance to form a cloud.</p>

			<simulation mode="clouds only"/>
			<!--<div class="show-hide-button"><button class="emoji-button" onclick="hideGrid(0)">show/hide simulation</button></div>-->

			<p>Specific probability and threshold numbers were chosen to keep the rough shapes of the clouds consistent,
			but one can still notice that smaller clouds have a tendency dissipate while larger clouds have a tendency to grow and even combine with other clouds.</p>

			<p>---</p>

			<p>When enough clouds gather, eventually they form rain clouds. Now the behavior of our clouds is dependent on normal clouds and rain clouds.
			Along with the previous rules, additional rules are enforced:</p>

			<p>- Rain clouds follow the same dissipation rules as normal clouds.<br>
			<br>- If a cloud is surrounded by more than 5 clouds, (20 + 10 * x)% chance it'll turn into a rain cloud, where x = number of surrounding clouds (normal or rain).<br>
			<br>- If a cloud is surrounded by more than 1 rain cloud, (10 * y)% chance it'll also turn into a rain cloud, where y = number of surrounding rain clouds.<br>
			<br>- If a rain cloud is surrounded by 2 or less rain clouds, 60% chance it'll revert to normal cloud. Otherwise, only 30% chance it'll revert to normal cloud.</p>
			
			<simulation mode="percipitation no evaporation"/>
			<!--<div class="show-hide-button"><button class="emoji-button" onclick="hideGrid(1)">show/hide simulation</button></div>-->

			<p>Again, specific probability and threshold numbers were chosen to keep things relatively consistent.
			Our dissipation rules remain the same, but now there are more ways for clouds of any type to form.
			Therefore, one can notice that smaller clouds are less prone to dissipating, while larger clouds are even moreso growing and combining with other clouds.</p>

			<p>---</p>

			<p>In the real world, fallen rain leaves the ground wet, allowing for evaporation and thus repeating the water cycle.
			When water does evaporate, it goes through condensation and forms clouds, and that is what this next simulation illustrates.
			Our clouds behave the same as above, except now we have additional rules relating to increased rate of cloud formation:</p>

			<p>- When a rain cloud dissipates, it leaves the cell wet (instead of an empty cell).<br>
			<br>- A wet cell has a 50% chance to turn into some kind of cloud:
			(10 + 10 * x)% chance it'll turn into rain cloud (where x = number of surrounding rain clouds) and normal cloud otherwise.
			Otherwise, the cell becomes dry (empty space).</p>

			<simulation mode="percipitation and evaporation"/>
			<!--<div class="show-hide-button"><button class="emoji-button" onclick="hideGrid(2)">show/hide simulation</button></div>-->

			<p>Because of the additional ways clouds can form, and a decreased chance for rain clouds to ultimately leave behind empty cells,
			clouds of all sizes get very dense very fast.</p>

			<p>---</p>

			<p>Of course, in the real world, all storms eventually pass. There are <a href="https://climate.ncsu.edu/edu/Thunderstorm">many other factors</a>
			that play into the formation of clouds and storms, including drafts, air humidity/temperature, and even the terrain of the land below.
			In the meantime, this collection of simulations is a fun and simplified demonstration of how clouds work depending on surrounding clouds and wet terrain.</p>

			<p><small>I would've loved to add sliders to allow you to play around with the probability and threshold values, but I ran out of time :(
				but feel free to look into the sim.js file and manually change the numbers yourself and see what changes!</small></p>
		</div>`,
		
	})

	// for (var g = 0; g < grids.length; g++)
	// {
	// 	grids[g].style.display = "none"
	// 	controls[g].style.display = "none"
	// }

})

function hideGrid(n)
{
	if (grids[n].style.display === "none") grids[n].style.display = "block"
	else grids[n].style.display = "none"

	if (controls[n].style.display === "none") controls[n].style.display = "block"
	else controls[n].style.display = "none"
}