// Initialize an empty array to hold the questions
let Questions = [];

// Get the element with ID 'ques' to display questions
const ques = document.getElementById("ques");

// Function to fetch questions from the API
async function fetchQuestions() {
	try {
		// Fetch questions from the API
		// const response = await fetch('https://opentdb.com/api.php?amount=10');
		const response = await fetch( "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple")
		// Check if the response is not OK
		if (!response.ok) {
			throw new Error(`Something went wrong!! Unable to fetch the data`);
		}

		// Parse the response as JSON
		const data = await response.json();
		
		// Store the fetched questions in the Questions array
		Questions = data.results;
	} catch (error) {
		// Log any errors to the console
		console.log(error);
		
		// Display the error message in the 'ques' element
		ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
	}
}

// Fetch questions when the script runs
fetchQuestions();

// Initialize current question index and score
let currQuestion = 0;
let score = 0;

// Display a loading message if no questions are fetched yet
if (Questions.length === 0) {
	ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
}

// Function to load and display the current question
function loadQues() {
	const opt = document.getElementById("opt");
	let currentQuestion = Questions[currQuestion].question;

	// Replace specific characters in the question text
	currentQuestion = currentQuestion.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');

	// Display the current question
	ques.innerText = currentQuestion;
	opt.innerHTML = "";

	// Get the correct and incorrect answers
	const correctAnswer = Questions[currQuestion].correct_answer;
	const incorrectAnswers = Questions[currQuestion].incorrect_answers;

	// Combine and shuffle the answers
	const options = [correctAnswer, ...incorrectAnswers];
	options.sort(() => Math.random() - 0.5);

	// Display the shuffled options
	options.forEach((option) => {
		option = option.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');
		const choicesdiv = document.createElement("div");
		const choice = document.createElement("input");
		const choiceLabel = document.createElement("label");
		choice.type = "radio";
		choice.name = "answer";
		choice.value = option;
		choiceLabel.textContent = option;
		choicesdiv.appendChild(choice);
		choicesdiv.appendChild(choiceLabel);
		opt.appendChild(choicesdiv);
	});
}

// Load the first question after a delay
setTimeout(() => {
	loadQues();
	if (Questions.length === 0) {
		ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
	}
}, 2000);

// Function to load and display the score
function loadScore() {
	const totalScore = document.getElementById("score");
	totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
	totalScore.innerHTML += "<h3>All Answers</h3>";
	Questions.forEach((el, index) => {
		totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
	});
}

// Function to load the next question or display the score if all questions are answered
function nextQuestion() {
	if (currQuestion < Questions.length - 1) {
		currQuestion++;
		loadQues();
	} else {
		document.getElementById("opt").remove();
		document.getElementById("ques").remove();
		document.getElementById("btn").remove();
		loadScore();
	}
}

// Function to check the selected answer and move to the next question
function checkAns() {
	const selectedAns = document.querySelector('input[name="answer"]:checked').value;
	if (selectedAns === Questions[currQuestion].correct_answer) {
		score++;
	}
	nextQuestion();
}
