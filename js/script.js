// import * as bootstrap from "bootstrap";
const modal = document.querySelector(".modalFit");
const overlay = document.querySelector(".overlay");

const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");
const btnsSubmit = document.querySelector(`.btn--submit-modal`);

const nameInput = document.querySelector(`.name-input`);
const ageInput = document.querySelector(`.age-input`);
const bmiInput = document.querySelector(`.bmi-input`);
const greeting = document.querySelector(`.greeting`);
const openNav = document.querySelector(`.nav-open-button`);
const navBar = document.querySelector(`.nav`);
const showModal = document.querySelectorAll(`.show-modal`);
const modalBody = document.querySelector(`.modal-body`);
const modalClose = document.querySelector(`.modal-close`);
const modalCatText = document.querySelector(`.modal-cat-text`);
const modalCategory = document.querySelector(`.modal-category`);

// App class

class Person {
	constructor(name, age, bmi) {
		this.name = name;
		this.age = age;
		this.bmi = bmi;
	}
}
class App {
	account = JSON.parse(localStorage.getItem("account"));
	workouts;
	constructor() {
		// if (localStorage.getItem("hasModalOpen")) this.#openModal();
		// localStorage.setItem("hasModalOpen", JSON.stringify(hasModalOpen));

		btnsSubmit.addEventListener(`click`, this.#submitDetails.bind(this));
		if (!localStorage.getItem(`account`)) {
			this.#openModal();
		} else {
			// Loading the workouts from local storage
			greeting.textContent = `Hello ` + this.account.name;
			this.workouts = this.#fetchWorkouts();
		}

		openNav.addEventListener(`click`, this.#openNav);

		showModal.forEach(this.#showModal);
		modalClose.addEventListener(`click`, this.#closeModalCat);
	}

	#openModal = () => {
		modal.classList.remove("hidden");
		overlay.classList.remove("hidden");
	};

	#closeModal = () => {
		modal.classList.add("hidden");
		overlay.classList.add("hidden");
	};

	#submitDetails() {
		const name = nameInput.value;
		const age = +ageInput.value;
		const bmi = +bmiInput.value;
		this.account = new Person(name, age, bmi);
		localStorage.setItem("account", JSON.stringify(this.account));
		this.#closeModal();
		greeting.textContent = `Hello ` + this.account.name;
	}

	#closeModalCat() {
		modalCategory.classList.add(`hidden`);
		overlay.classList.add(`hidden`);
	}

	#openNav() {
		openNav.classList.toggle(`close`);
		navBar.classList.toggle(`hidden`);
	}
	// Function to fetch workouts for people with BMI values between 20 and 24.9
	async #fetchWorkouts(bmi) {
		try {
			const response = await fetch("./json/workouts.json"); // Replace 'workouts.json' with the actual path to your JSON file
			if (!response.ok) {
				throw new Error(
					"Could Not get workouts.. Check your internet connection."
				);
			}

			const data = await response.json();

			// Filter workouts for people with BMI values between 20 and 24.9
			const workoutsInRange = data.workouts.filter((workout) => {
				return bmi > workout.bmi_range.from && bmi < workout.bmi_range.to;
			});

			// Check if there are any workouts in the range
			if (workoutsInRange.length === 0) {
				throw new Error("Could not find workouts for your range.");
			} else {
				return workoutsInRange;
			}
		} catch (error) {
			return error.message;
		}
	}

	async #fetchDiets(bmi) {
		try {
			const response = await fetch("../src/json/diet.json");

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();

			// Filter diets for people with BMI values between 20 and 24.9
			const dietsInRange = data.diets.filter((diet) => {
				return bmi > diet.bmi_range.from && bmi < diet.bmi_range.to;
			});

			// Check if there are any diets in the range
			if (dietsInRange.length === 0) {
				throw new Error(
					`No workouts available for people with BMI values below 0`
				);
			} else {
				// Do something with the filtered workouts
				return dietsInRange;
			}
		} catch (error) {
			return error.message;
		}
	}

	async #fetchResources() {
		try {
			const response = await fetch(`./json/resources.json`);

			if (!response.ok) {
				throw new Error("Could Not get resources.");
			}

			const data = await response.json();

			return data;
		} catch (err) {
			return err.message;
		}
	}

	#openCategoryModal() {
		modalCategory.classList.remove(`hidden`);
		overlay.classList.remove(`hidden`);
	}

	#showModal = (btn) => {
		btn.addEventListener(
			`click`,
			function (e) {
				this.#openCategoryModal();
				let htmlBodyModal;
				const name = this.account.name;
				const bmi = this.account.bmi;
				modalBody.innerHTML = "";
				if (btn.classList.contains(`fitness`)) {
					let workouts;

					(async () => {
						try {
							workouts = await this.#fetchWorkouts(bmi);

							if (typeof workouts === "object") {
								workouts.forEach((workout) => {
									console.log(workout);
									htmlBodyModal = `				
						<div class="workout">
							<div class="img-cont"><img src="${workout.image_url}" alt="A person ${workout.workout}" /></div>
							<div class="workout_name">${workout.workout}</div>
						</div>
					`;

									modalBody.insertAdjacentHTML(`afterbegin`, htmlBodyModal);

									modalCatText.innerHTML = `👋 ${
										name.split(` `)[0]
									} here are your
			<span class="highlight activity">workouts</span>`;
								});
							} else {
								htmlBodyModal = `<div class="message">
						💥 Could Not Get workouts.. ${workouts}
					</div>`;
								modalBody.insertAdjacentHTML(`beforeend`, htmlBodyModal);
							}
						} catch (err) {
							workouts = err.message;
						}
					})();
				}

				if (btn.classList.contains(`diet`)) {
					let diets;
					(async () => {
						try {
							diets = await this.#fetchDiets(bmi);
							// const { diets } = data.json();

							if (typeof diets === "object") {
								diets.forEach((diet) => {
									htmlBodyModal = `				
						<div class="workout">
							<div class="img-cont"><img src = "${diet.image_url}" alt="A person ${diet.diet}" /></div>
							<div class="workout_name">${diet.diet}</div>
						</div>
					`;
									modalCatText.innerHTML = `👋 ${
										name.split(` `)[0]
									} here are your
										<span class="highlight activity">diets</span>`;
									modalBody.insertAdjacentHTML(`afterbegin`, htmlBodyModal);
								});
							} else {
								htmlBodyModal = `<div class="message">
						💥 Could Not Get diets.. ${diets}
					</div>`;
								modalBody.insertAdjacentHTML(`beforeend`, htmlBodyModal);
							}
						} catch (err) {
							diets = err.message;
						}
					})();
				}

				if (btn.classList.contains(`resources`)) {
					let resources;
					(async () => {
						try {
							resources = await this.#fetchResources();

							if (typeof resources === "object") {
								resources.resources.forEach((resource, i) => {
									htmlBodyModal = `				
						<div class="workout">
							<div class="img-cont"><img src = "${resource.image}" alt="${resource.title}" /></div>
							<a class="workout_name link href="${resource.link}">${resource.title}</a>
						</div>
					`;

									modalCatText.innerHTML = `👋 ${
										name.split(` `)[0]
									} here are your
										<span class="highlight activity">resources</span>`;
									modalBody.insertAdjacentHTML(`afterbegin`, htmlBodyModal);
								});
							} else {
								htmlBodyModal = `<div class="message">
						💥 Could Not Get resources.. ${diets}
					</div>`;
								modalBody.insertAdjacentHTML(`beforeend`, htmlBodyModal);
							}
						} catch (err) {
							resources = err.message;
						}
					})();
				}
			}.bind(this)
		);
	};
}

const app = new App();

const back2Top = document.querySelector(".back2Top");
back2Top.addEventListener("click", () => {
	window.scrollTo(0, 0);
});
const header = document.querySelector(`.landing-page`);

const observer = new IntersectionObserver(([observer]) => {
	// const [obs] = observer;

	if (observer.isIntersecting) {
		back2Top.classList.add(`hidden`);
	} else {
		back2Top.classList.remove(`hidden`);
	}
});
observer.observe(header);

class ContinuousScrollingTicker {
	constructor() {
		this.tickerContentElement = document.getElementById("ticker-content");
		this.updateTickerContent();
		setInterval(() => this.updateTickerContent(), 1000 * 60);
	}

	async getCurrentDateTime() {
		const now = new Date();
		return now.toLocaleString();
	}

	async getUserLocation() {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => resolve(position.coords),
					(error) => reject(error)
				);
			} else {
				reject(new Error("Geolocation is not supported by this browser."));
			}
		});
	}

	async updateTickerContent() {
		try {
			const location = await this.getUserLocation();

			const locationString = await this.#getLocationStr(
				location.latitude,
				location.longitude
			);

			setInterval(async () => {
				const dateTime = await this.getCurrentDateTime();
				const tickerContent = `Current Date/Time: ${dateTime} | Location: ${locationString}`;
				this.tickerContentElement.textContent = tickerContent;
			}, 5000);
		} catch (error) {
			const dateTime = await this.getCurrentDateTime();
			this.tickerContentElement.textContent =
				`${dateTime} Error: ` + error.message;
		}
	}

	async #getLocationStr(lat, lon) {
		const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${lat}6&lon=${lon}&accept-language=en&polygon_threshold=0.0`;

		const options = {
			method: "GET",
			headers: {
				"X-RapidAPI-Key": "6fefec31a2msh37e747a16d3a8c7p1dc2c4jsnc95aa4fbb2e1",
				"X-RapidAPI-Host": "forward-reverse-geocoding.p.rapidapi.com",
			},
		};

		try {
			const response = await fetch(url, options);
			const data = await response.json();
			return data.display_name;
		} catch (err) {
			return err.message;
		}
	}
}

// Create an instance of the ContinuousScrollingTicker class
const ticker = new ContinuousScrollingTicker();
