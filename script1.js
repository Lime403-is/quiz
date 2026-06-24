let quiz =[];

async function loadQuiz(){

    const response = await fetch("Qdb.json");

    const data = await response.json();

    quiz = data.map(q => ({
        question: q.question,
        choices: [
            q.choice1,
            q.choice2,
            q.choice3,
            q.choice4
        ],
        answer: Number(q.answer) - 1
    }));
}

let current = 0;
let score = 0;

let questionTime = 100;

let timer;
let timeLeft;

let answering = false;

async function startGame(){

    await loadQuiz();

    document.getElementById("startButton").style.display =
        "none";

    showQuestion();
}

function showQuestion() {

    answering = false;

    let q = quiz[current];

    document.getElementById("question").innerHTML = `
        第 ${current + 1} 問<br><br>
        ${q.question}
    `;

    document.getElementById("status").innerHTML = `
        残り問題 :
        ${quiz.length - current - 1} 問
    `;

    document.getElementById("result").innerHTML = "";

    let html = "";

    for(let i = 0; i < q.choices.length; i++){

        html += `
            <button
                class="choiceButton"
                onclick="checkAnswer(${i})"
            >
                ${q.choices[i]}
            </button>
            
        `;
    }

    document.getElementById("choices").innerHTML
        = html;

    startQuestionTimer();
}

function startQuestionTimer() {

    clearInterval(timer);

    timeLeft = questionTime;
    document.getElementById("timerBar").style.width =
    "100%";

    document.getElementById("timer").innerText =
        timeLeft + " 秒";

    timer = setInterval(() => {

        timeLeft--;
        let percent =
        (timeLeft / questionTime) * 100;

        document.getElementById("timerBar").style.width =
        percent + "%";

        document.getElementById("timer").innerText =
            timeLeft + " 秒";

        // 残り3秒で赤色
        if(timeLeft <= 3){

            document.getElementById("timer").style.color =
                "red";

        } else {

            document.getElementById("timer").style.color =
                "black";
        }

        // 時間切れ
        if(timeLeft <= 0){

            clearInterval(timer);

            timeUp();
        }

    }, 1000);
}

function timeUp() {

    if(answering){
        return;
    }

    answering = true;

    clearInterval(timer);

    // 不正解音
    document.getElementById("wrongSound").play();

    document.getElementById("choices").innerHTML = "";

    document.getElementById("question").innerHTML = `
        <h1 style="
            color:red;
            font-size:70px;
        ">
            GAME OVER
        </h1>
    `;

    document.getElementById("status").innerHTML = "";

    document.getElementById("timer").innerHTML = "";

    document.getElementById("result").innerHTML = `
        <h2 style="
            color:orange;
            font-size:50px;
        ">
            時間切れ！
        </h2>

        <h2>
            得点 : ${score} / ${quiz.length}
        </h2>

        <button
            onclick="location.reload()"
            style="
                margin-top:30px;
                padding:15px 40px;
                font-size:25px;
                cursor:pointer;
            "
        >
            リトライ
        </button>
    `;
}

function checkAnswer(choice) {

    clearInterval(timer);

    if(answering){
        return;
    }

    answering = true;

    const correct = quiz[current].answer;

    document.getElementById("choices").innerHTML = "";

    // 正解
    if(choice === correct){

        score++;

        document.getElementById("correctSound").play();

        document.getElementById("result").innerHTML = `
            <h1 style="
                color:green;
                font-size:100px;
            ">
                ○
            </h1>

            <h2>
                正解！
            </h2>
        `;

    } else {

        document.getElementById("wrongSound").play();

        document.getElementById("result").innerHTML = `
            <h1 style="
                color:red;
                font-size:100px;
            ">
                ×
            </h1>

            <h2>
                不正解
            </h2>

            <p>
                正解 :
                ${quiz[current].choices[correct]}
            </p>
        `;
    }

    current++;

    setTimeout(() => {

        if(current >= quiz.length){

            finishGame();
            return;
        }

        showQuestion();

    }, 1500);
}

function finishGame() {

    clearInterval(timer);

    let rate =
        Math.floor((score / quiz.length) * 100);

    let rank = "";

    if(rate === 100){

        rank = "Sランク";

    } else if(rate >= 80){

        rank = "Aランク";

    } else if(rate >= 60){

        rank = "Bランク";

    } else if(rate >= 40){

        rank = "Cランク";

    } else {

        rank = "Dランク";
    }

    document.getElementById("question").innerHTML =
        "クイズ終了！";

    document.getElementById("choices").innerHTML = "";

    document.getElementById("status").innerHTML = "";

    document.getElementById("timer").innerHTML = "";

    document.getElementById("result").innerHTML = `
        <h1>
            得点 : ${score} / ${quiz.length}
        </h1>

        <h2>
            正答率 : ${rate}%
        </h2>

        <h1 style="
            color:orange;
            font-size:60px;
        ">
            ${rank}
        </h1>

        <button onclick="location.reload()">
            もう一回遊ぶ
        </button>
    `;
}