// Do setup
document.addEventListener("DOMContentLoaded", function () {
	new Vue({
		el: "#app",
		template: `<div id="app">
			<chat-widget :messages="messages" />

			health: {{bot.healthAmount}}/{{bot.maxHealth}} ✿ playfulness: {{bot.happyAmount}}/{{bot.maxHappy}}<br>
			<i>you are taking care of a {{bot.plant.substring(3)}}.</i>

			<div id="controls">
				<div style="margin-bottom:1em">
					<input ref="input" v-model="currentInput" @keyup.enter="enterInput">
					<button @click="enterInput">↩</button>
				</div>
				<div>
					<button @click="handleInput('care')">care</button>
					<button @click="handleInput('play')">play</button>
					<button @click="handleInput('wait')">wait</button>
				</div>
			</div>
		</div>`,

		methods: {
			postToChat(text, owner, isSelf) {
				this.messages.push({
					text: text,
					isSelf: isSelf,
					owner: owner,
				});
			},

			enterInput() {
				let text = this.currentInput;
				this.currentInput = "";
				this.handleInput(text);
			},

			handleInput(text) {
				if (text === "") return;

				// Does bot things
				this.postToChat(text, "😐", true);

				// Add to the messages in chat

				// Bot does something
				let output = this.bot.respondTo(text);

				setTimeout(() => {
					let emoji = this.bot.plant === "the plant" ? "🌱" : "🌸";
					this.postToChat(output, emoji);
				}, Math.random() * 100 + 400);
			},
		},

		data() {
			return {
				// Store the bot
				bot: new ChatBot(),

				// And the message
				messages: [],

				// And the current thing in the input
				currentInput: "",
			};
		},
	});
});
