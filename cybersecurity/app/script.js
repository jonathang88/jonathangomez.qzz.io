let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let mode = "study";
let userAnswers = []; // NUEVO: guarda la respuesta del usuario por pregunta

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
    const categories = [...new Set(questions.map(q => q.category))];
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
        selectedQuestions = selectedQuestions.filter(q => q.category === category);
    }
    if(order === "random"){
        selectedQuestions.sort(() => Math.random() - 0.5);
    }
    selectedQuestions = selectedQuestions.slice(0, count);

    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(selectedQuestions.length).fill(null); // NUEVO: inicializar array

    setup.classList.add("hidden");
    quiz.classList.remove("hidden");
    showQuestion();
}

function showQuestion(){
    const q = selectedQuestions[currentQuestion];
    document.getElementById("progress").textContent =
        `Pregunta ${currentQuestion + 1} de ${selectedQuestions.length}`;
    document.getElementById("question").textContent = q.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.textContent = option;
        div.onclick = () => selectOption(div, index);
        optionsContainer.appendChild(div);
    });

    if(mode === "study"){
        document.getElementById("studyArea").classList.remove("hidden");
        document.getElementById("answerBox").classList.add("hidden");
    } else {
        document.getElementById("studyArea").classList.add("hidden");
    }
}

let selectedAnswer = null;

function selectOption(element, index){
    document.querySelectorAll(".option").forEach(o => o.style.border = "1px solid #ccc");
    element.style.border = "3px solid blue";
    selectedAnswer = index;
}

document.getElementById("showAnswerBtn").addEventListener("click", () => {
    const q = selectedQuestions[currentQuestion];
    const box = document.getElementById("answerBox");
    box.innerHTML = `
        <strong>Respuesta correcta:</strong> ${q.options[q.answer]}
        <br><br>
        <strong>Explicación:</strong> ${q.explanation}
    `;
    box.classList.remove("hidden");
});

document.getElementById("nextBtn").addEventListener("click", nextQuestion);

function nextQuestion(){
    if(mode === "exam"){
        userAnswers[currentQuestion] = selectedAnswer; // NUEVO: guardar respuesta
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

document.getElementById("prevBtn").addEventListener("click", previousQuestion);

function previousQuestion(){
    if(currentQuestion === 0) return;
    currentQuestion--;
    showQuestion();
}

function finishQuiz(){
    quiz.classList.add("hidden");
    result.classList.remove("hidden");

    if(mode === "exam"){
        const percent = Math.round(score / selectedQuestions.length * 100);
        document.getElementById("scoreText").textContent =
            `${score}/${selectedQuestions.length} (${percent}%)`;

        // NUEVO: construir detalle de preguntas incorrectas
        renderReview();
        saveStats(percent);
    } else {
        document.getElementById("scoreText").textContent = "Modo estudio finalizado";
        // Limpiar review si viene de modo estudio
        const reviewContainer = document.getElementById("reviewContainer");
        if(reviewContainer) reviewContainer.innerHTML = "";
    }
}

// NUEVO: función que renderiza el detalle de incorrectas
function renderReview(){
    let reviewContainer = document.getElementById("reviewContainer");

    // Crear el contenedor si no existe en el HTML
    if(!reviewContainer){
        reviewContainer = document.createElement("div");
        reviewContainer.id = "reviewContainer";
        result.appendChild(reviewContainer);
    }

    reviewContainer.innerHTML = "";

    const incorrectas = selectedQuestions.filter((q, i) => userAnswers[i] !== q.answer);

    if(incorrectas.length === 0){
        reviewContainer.innerHTML = "<p style='color:green;font-weight:bold;margin-top:16px;'>✓ ¡Respondiste todo correctamente!</p>";
        return;
    }

    const titulo = document.createElement("h3");
    titulo.textContent = `Preguntas incorrectas (${incorrectas.length})`;
    titulo.style.marginTop = "24px";
    reviewContainer.appendChild(titulo);

    selectedQuestions.forEach((q, i) => {
        if(userAnswers[i] === q.answer) return; // saltar correctas

        const card = document.createElement("div");
        card.style.cssText = `
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 14px 16px;
            margin: 10px 0;
            background: #fff8f8;
        `;

        const numPregunta = document.createElement("p");
        numPregunta.style.cssText = "font-size:0.8rem;color:#888;margin:0 0 6px 0;";
        numPregunta.textContent = `Pregunta ${i + 1}`;

        const textoPregunta = document.createElement("p");
        textoPregunta.style.cssText = "font-weight:bold;margin:0 0 10px 0;";
        textoPregunta.textContent = q.question;

        const tuRespuesta = document.createElement("p");
        tuRespuesta.style.cssText = "color:#c0392b;margin:0 0 4px 0;";
        const tuIdx = userAnswers[i];
        tuRespuesta.innerHTML = `✗ Tu respuesta: <span>${tuIdx !== null ? q.options[tuIdx] : "Sin responder"}</span>`;

        const correcta = document.createElement("p");
        correcta.style.cssText = "color:#27ae60;margin:0 0 8px 0;";
        correcta.innerHTML = `✓ Correcta: <span>${q.options[q.answer]}</span>`;

        card.appendChild(numPregunta);
        card.appendChild(textoPregunta);
        card.appendChild(tuRespuesta);
        card.appendChild(correcta);

        // Agregar explicación si existe
        if(q.explanation){
            const explicacion = document.createElement("p");
            explicacion.style.cssText = "font-size:0.85rem;color:#555;border-top:1px solid #eee;padding-top:8px;margin:0;";
            explicacion.innerHTML = `<strong>Explicación:</strong> ${q.explanation}`;
            card.appendChild(explicacion);
        }

        reviewContainer.appendChild(card);
    });
}

function saveStats(score){
    let stats = JSON.parse(localStorage.getItem("quizStats")) || [];
    stats.push(score);
    localStorage.setItem("quizStats", JSON.stringify(stats));
}

document.getElementById("exitBtn").addEventListener("click", exitQuiz);

function exitQuiz(){
    if(confirm("¿Deseas salir del cuestionario?")){
        quiz.classList.add("hidden");
        result.classList.add("hidden");
        setup.classList.remove("hidden");
        currentQuestion = 0;
        selectedAnswer = null;
        userAnswers = [];
    }
}

function loadStats(){
    let stats = JSON.parse(localStorage.getItem("quizStats")) || [];
    if(stats.length === 0) return;
    document.getElementById("totalExams").textContent = stats.length;
    const avg = Math.round(stats.reduce((a, b) => a + b, 0) / stats.length);
    document.getElementById("averageScore").textContent = avg + "%";
    document.getElementById("bestScore").textContent = Math.max(...stats) + "%";
}
