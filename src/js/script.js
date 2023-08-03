// import * as bootstrap from "bootstrap";

const nameSubmitButton = document.querySelector(`.btn--submit-modal`);
const firstNameInput = document.querySelector(".first-name-input");
const lastNameInput = document.querySelector(`.lastNameInput`);

class Account {
	constructor(name) {
		name = this.name;
	}
}
class App {
	#account;
	constructor() {
		nameSubmitButton.addEventListener(`click`, this.#submitName);
	}

	#submitName(e) {
		this.#account = new Account();
	}
}
