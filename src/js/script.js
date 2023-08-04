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
		console.log(this.account);
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

		showModal.forEach(this.showModal);
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
		workouts = this.#fetchWorkouts();
	}

	#openNav() {
		openNav.classList.toggle(`close`);
		navBar.classList.toggle(`hidden`);
	}
	// Function to fetch workouts for people with BMI values between 20 and 24.9
	async #fetchWorkouts() {
		try {
			const response = await fetch("../src/json/workouts.json"); // Replace 'workouts.json' with the actual path to your JSON file
			if (!response.ok) {
				throw new Error(
					"Could Not get workouts.. Check your internet connection."
				);
			}

			const data = await response.json();

			// Filter workouts for people with BMI values between 20 and 24.9
			const workoutsInRange = data.workouts.filter((workout) => {
				return (
					this.account.bmi > workout.bmi_range.from &&
					this.account.bmi < workout.bmi_range.to
				);
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

	async #fetchDiets() {
		try {
			const response = await fetch("../src/json/diet.json");

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			console.log(data);

			// Filter diets for people with BMI values between 20 and 24.9
			const dietsInRange = data.workouts.filter((diet) => {
				return (
					this.account.bmi > workout.bmi_range.from &&
					this.account.bmi < workout.bmi_range.to
				);
			});

			// Check if there are any diets in the range
			if (workoutsInRange.length === 0) {
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

	showModal = (btn) => {
		if (btn.classList.contains(`fitness`)) {
		}
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
