class ChatBot {
	constructor() {
		this.healthAmount = 0;
		this.maxHealth = 10;

		this.happyAmount = 0;
		this.maxHappy = 10;

		this.plant = "the plant";

		this.grammar = tracery.createGrammar(plantGrammar);
		this.grammar.addModifiers(baseEngModifiers);
	}

	respondTo(s) {
		if (!(s.includes("wait") || s.includes("care") || s.includes("play")))
			return "...";

		let oldHealth = this.healthAmount;
		let oldHappy = this.happyAmount;
		let response = "";

		// wait :: decreases health and playfulness each by 1

		if (s.includes("wait")) {
			response +=
				`${this.plant}` +
				this.grammar.flatten(" #waitVerb# #waitAdverb#. ");

			if (this.healthAmount > 0) this.healthAmount -= 1;
			if (this.happyAmount > 0) this.happyAmount -= 1;
		} else {
			// care :: increases health by 2, decreases playfulness by 1

			if (!s.includes("wait") && s.includes("care")) {
				if (this.healthAmount == this.maxHealth)
					response += "max health. ";
				else {
					this.healthAmount += 2;
					if (!s.includes("play") && this.happyAmount > 0)
						this.happyAmount -= 1;
					response +=
						this.grammar.flatten("you #careVerb# ") +
						`${this.plant}` +
						this.grammar.flatten(" #careAdverb#. ");
				}
			}

			// play :: decreases health by 1, increases playfulness by some amount depending on health
			// health = [0, 2]  =>  no change to playfulness
			// health = [3, 6]  =>  playfulness += 2
			// health = [7, 10] =>  playfulness += 3

			if (!s.includes("wait") && s.includes("play")) {
				if (this.happyAmount == this.maxHappy)
					response += "max playfulness. ";
				else {
					if (this.healthAmount <= 2) {
						response +=
							`${this.plant}` + " doesn't feel like playing. ";
					} else if (this.healthAmount <= 6) {
						this.happyAmount += 2;
						response +=
							this.grammar.flatten("you #playVerb# ") +
							`${this.plant}` +
							this.grammar.flatten(" #playAdverb#. ");
					} else {
						this.happyAmount += 3;
						response +=
							this.grammar.flatten("you #playVerb# ") +
							`${this.plant}` +
							this.grammar.flatten(" #playAdverb#. ");
					}

					if (!s.includes("care") && this.healthAmount > 0)
						this.healthAmount -= 1;
				}
			}
		}

		// upper bounds check

		if (this.healthAmount > 10) this.healthAmount = 10;
		if (this.happyAmount > 10) this.happyAmount = 10;

		// bloom :: blooms a flower if health = [9, 10] and playfulness = [9, 10]

		let oldPlant = this.plant;

		if (
			(oldHealth < 9 || oldHappy < 9) &&
			this.healthAmount >= 9 &&
			this.happyAmount >= 9
		) {
			this.plant = `the ${this.grammar.flatten("#plant#")}`;
			response += `${oldPlant} bloomed into a ${this.plant.substring(
				3
			)}!`;
		} else if (
			oldHealth >= 9 &&
			oldHappy >= 9 &&
			(this.healthAmount < 9 || this.happyAmount < 9)
		) {
			this.plant = "the plant";
			response += `${oldPlant} transformed back to a ${this.plant.substring(
				3
			)}.`;
		}

		return response;
	}
}
