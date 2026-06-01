let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let mode = "study";

const setup = document.getElementById("setup");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

fetch("questions.json")
.then(res => res.json())
.then(data => {

    questions = data;

    loadCategories();
    loadStats();

});

function loadCategories(){

    const categorySelect = document.getElementById("category");

    const categories = [...new Set(
        questions.map(q => q.category)
    )];

    categories.forEach(cat => {

        const option = document.createElement("option");

        option.value = cat;
        option.textContent = cat;

        categorySelect.appendChild(option);

    });

}

document.getElementById("startBtn").addEventListener("click", startQuiz);

function startQuiz(){

    mode = document.getElementById("mode").value;

    const category = document.getElementById("category").value;
    const order = document.getElementById("order").value;
    const count = parseInt(document.getElementById("questionCount").value);

    selectedQuestions = [...questions];

    if(category !== "all"){
        selectedQuestions = selectedQuestions.filter(
            q => q.category === category
        );
    }

    if(order === "random"){
        selectedQuestions.sort(() => Math.random() - 0.5);
    }

    selectedQuestions = selectedQuestions.slice(0,count);

    currentQuestion = 0;
    score = 0;

    setup.classList.add("hidden");
    quiz.classList.remove("hidden");

    showQuestion();

}

function showQuestion(){

    const q = selectedQuestions[currentQuestion];

    document.getElementById("progress").textContent =
        `Pregunta ${currentQuestion+1} de ${selectedQuestions.length}`;

    document.getElementById("question").textContent =
        q.question;

    const optionsContainer =
        document.getElementById("options");

    optionsContainer.innerHTML = "";

    q.options.forEach((option,index)=>{

        const div = document.createElement("div");

        div.className = "option";
        div.textContent = option;

        div.onclick = () => selectOption(div,index);

        optionsContainer.appendChild(div);

    });

    if(mode === "study"){

        document.getElementById("studyArea")
        .classList.remove("hidden");

        document.getElementById("answerBox")
        .classList.add("hidden");

    }else{

        document.getElementById("studyArea")
        .classList.add("hidden");

    }

}

let selectedAnswer = null;

function selectOption(element,index){

    document.querySelectorAll(".option")
    .forEach(o=>o.style.border="1px solid #ccc");

    element.style.border="3px solid blue";

    selectedAnswer = index;

}

document
.getElementById("showAnswerBtn")
.addEventListener("click", ()=>{

    const q = selectedQuestions[currentQuestion];

    const box = document.getElementById("answerBox");

    box.innerHTML = `
        <strong>Respuesta correcta:</strong>
        ${q.options[q.answer]}
        <br><br>
        <strong>Explicación:</strong>
        ${q.explanation}
    `;

    box.classList.remove("hidden");

});

document
.getElementById("nextBtn")
.addEventListener("click", nextQuestion);

function nextQuestion(){

    if(mode === "exam"){

        if(selectedAnswer === selectedQuestions[currentQuestion].answer){
            score++;
        }

    }

    selectedAnswer = null;

    currentQuestion++;

    if(currentQuestion >= selectedQuestions.length){

        finishQuiz();
        return;

    }

    showQuestion();

}
document
.getElementById("prevBtn")
.addEventListener("click", previousQuestion);

function previousQuestion(){

    if(currentQuestion === 0){
        return;
    }

    currentQuestion--;

    showQuestion();

}
function finishQuiz(){

    quiz.classList.add("hidden");
    result.classList.remove("hidden");

    if(mode === "exam"){

        const percent =
            Math.round(score / selectedQuestions.length *100);

        document.getElementById("scoreText")
        .textContent =
            `${score}/${selectedQuestions.length} (${percent}%)`;

        saveStats(percent);

    }else{

        document.getElementById("scoreText")
        .textContent =
            "Modo estudio finalizado";

    }

}

function saveStats(score){

    let stats =
        JSON.parse(localStorage.getItem("quizStats"))
        || [];

    stats.push(score);

    localStorage.setItem(
        "quizStats",
        JSON.stringify(stats)
    );

}

function loadStats(){

    let stats =
        JSON.parse(localStorage.getItem("quizStats"))
        || [];

    if(stats.length === 0) return;

    document.getElementById("totalExams")
    .textContent = stats.length;

    const avg =
        Math.round(
            stats.reduce((a,b)=>a+b,0)
            / stats.length
        );

    document.getElementById("averageScore")
    .textContent = avg + "%";

    document.getElementById("bestScore")
    .textContent = Math.max(...stats) + "%";

}

}
