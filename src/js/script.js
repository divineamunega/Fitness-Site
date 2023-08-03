// import * as bootstrap from "bootstrap";
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");

// App class
class App {
	constructor() {
		btnCloseModal.addEventListener(`click`, this.#openModal);
		btnsOpenModal.forEach((element) => {
			element.addEventListener(`click`, this.#closeModal);
		});

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && !modal.classList.contains("hidden")) {
				this.#closeModal();
			}
		});
	}

	#openModal = () => {
		modal.classList.remove("hidden");
		overlay.classList.remove("hidden");
	};

	#closeModal = () => {
		modal.classList.add("hidden");
		overlay.classList.add("hidden");
	};
}
const app = new App();
