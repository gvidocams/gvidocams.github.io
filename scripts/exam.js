let questionStorage = {
    index: 0,
    nameOfQuiz: "",
    check: function (dataBaseName) {
        let quiz = JSON.parse(localStorage.getItem("questionStorage"));
        if (quiz === null) return this.create(dataBaseName);
        for (let i = 0; i < quiz.length; i++) {
            if (!quiz[i].hasOwnProperty("choice")) {
                this.index = i;
                return;
            }
        }
        this.create(dataBaseName);
        return;
    },
    create: function (dataBaseName) {
        window.localStorage.setItem("questionStorage", JSON.stringify(this.generate()));
        window.localStorage.setItem("info", dataBaseName);
    },
    generateExam: function () {
        let exam = [];

        for (let i = 0; i < 13; i++) {
            let randomNum = Math.floor(Math.random() * DATORU_UZBUVE.length);
            exam.push(DATORU_UZBUVE[randomNum]);
            DATORU_UZBUVE.splice(randomNum, 1);
        }
        for (let i = 0; i < 17; i++) {
            let randomNum = Math.floor(Math.random() * OPERETAJSISTEMAS.length);
            exam.push(OPERETAJSISTEMAS[randomNum]);
            OPERETAJSISTEMAS.splice(randomNum, 1);
        }
        for (let i = 0; i < 21; i++) {
            let randomNum = Math.floor(Math.random() * DATORTIKLI.length);
            exam.push(DATORTIKLI[randomNum]);
            DATORTIKLI.splice(randomNum, 1);
        }
        for (let i = 0; i < 7; i++) {
            let randomNum = Math.floor(Math.random() * DATU_BAZES.length);
            exam.push(DATU_BAZES[randomNum]);
            DATU_BAZES.splice(randomNum, 1);
        }
        for (let i = 0; i < 8; i++) {
            let randomNum = Math.floor(Math.random() * NORMATIVIE_AKTI.length);
            exam.push(NORMATIVIE_AKTI[randomNum]);
            NORMATIVIE_AKTI.splice(randomNum, 1);
        }
        for (let i = 0; i < 4; i++) {
            let randomNum = Math.floor(Math.random() * PROGRAMMESANA.length);
            exam.push(PROGRAMMESANA[randomNum]);
            PROGRAMMESANA.splice(randomNum, 1);
        }

        return exam;

    },
    generate: function () {
        //Randomizing the whole question storage
        let questionsCopy = this.generateExam().sort(() => Math.random() - 0.5);

        //let questionsCopy = this.generateExam().sort(() => Math.random() - 0.5);
        for (let i = 0; i < questionsCopy.length; i++) {
            let currentQuestion = questionsCopy[i];
            let answerArray = [currentQuestion.a1, currentQuestion.a2, currentQuestion.a3, currentQuestion.a4];
            //Randomizing the array
            let randomizedArray = [...answerArray].sort(() => Math.random() - 0.5);
            for (let i = 1; i <= randomizedArray.length; i++) {
                // i - 1 because arrays indexes start from 0 not 1
                currentQuestion["a" + i] = randomizedArray[i - 1];
            }
            //Changing the answer number acordingly
            for (let i = 1; i <= randomizedArray.length; i++) {
                if (currentQuestion.a === Number(randomizedArray[i - 1].charAt(0))) {
                    currentQuestion.a = i; break
                }
            }
            //Replacing the first three characters of the answers
            for (let i = 1; i <= 4; i++) {
                currentQuestion["a" + i] = `${i}. ${(currentQuestion["a" + i]).slice(3)}`
            }
        }

        return questionsCopy;
    }
}
let quiz = {
    callOutQuestion: function () {
        this.endTest();
        cosmetic.questionDefaults();
        cosmetic.questionText();
        cosmetic.questionImage();
        cosmetic.increaseProgressBar();
        cosmetic.counter();
    },

    buttonclick: function (num) {
        console.log(new Date().toISOString().split("T")[0]);
        cosmetic.questionDisabled();
        cosmetic.questionVisuals(JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a, num);

        quiz.saveChoice(num);
        questionStorage.index++;

        cosmetic.increaseProgressBar();

        statistic.check();
    },
    saveChoice: function (number) {
        let result = JSON.parse(localStorage.getItem("questionStorage"));
        result[questionStorage.index].choice = number;
        localStorage.setItem("questionStorage", JSON.stringify(result));
    },
    endTest: function () {
        if (JSON.parse(localStorage.getItem("questionStorage")).length - 1 === questionStorage.index) {
            document.getElementById("next-button").innerHTML = "Beigt testu";
            document.getElementById("next-button").onclick = function () {
                location.href = "../index.html";
            }
        }
    }

}

const header = document.getElementById("header");

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

const nextButton = document.getElementById("next-button");

const image = document.getElementById("image");

let cosmetic = {
    questionDefaults: function () {
        //Enables the buttons to work properly
        button1.disabled = false;
        button2.disabled = false;
        button3.disabled = false;
        button4.disabled = false;
        //Sets the cursor to pointer
        button1.style.cursor = "pointer";
        button2.style.cursor = "pointer";
        button3.style.cursor = "pointer";
        button4.style.cursor = "pointer";
        //Sets the default border color for answer boxes
        button1.style.borderColor = "rgb(65, 62, 62)";
        button2.style.borderColor = "rgb(65, 62, 62)";
        button3.style.borderColor = "rgb(65, 62, 62)";
        button4.style.borderColor = "rgb(65, 62, 62)";
        //Sets the default background color for answer boxes
        button1.style.background = "inherit";
        button2.style.background = "inherit";
        button3.style.background = "inherit";
        button4.style.background = "inherit";
        //Sets the next-button to a lower brightness and disables it
        nextButton.disabled = true;
        nextButton.style.cursor = "not-allowed";
        nextButton.style.color = "rgba(255, 255, 255, 0.226)";
        //Sets the image value to none
        image.style.display = "none"
    },
    questionDisabled: function () {
        //Disabled the buttons after the answer has been given
        button1.disabled = true;
        button2.disabled = true;
        button3.disabled = true;
        button4.disabled = true;
        //Sets the cursor to not-allowed
        button1.style.cursor = "not-allowed";
        button2.style.cursor = "not-allowed";
        button3.style.cursor = "not-allowed";
        button4.style.cursor = "not-allowed";
        //Sets the next-question button brighter
        nextButton.disabled = false;
        nextButton.style.cursor = "pointer";
        nextButton.style.color = "white";
    },
    questionText: function () {
        header.innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].q;
        button1.innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a1;
        button2.innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a2;
        button3.innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a3;
        button4.innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a4;
    },
    questionVisuals: function (answer, choice) {
        document.getElementById("button" + answer).style.borderColor = "rgb(0, 200, 0)";
        document.getElementById("button" + answer).style.background = "rgb(0, 200, 0)";
        if (answer !== choice) {
            document.getElementById("button" + choice).style.borderColor = "rgb(209, 0, 0)";
            document.getElementById("button" + choice).style.background = "rgb(209, 0, 0)";
        }
    },
    progressBarWidth: 0,
    increaseProgressBar: function () {
        cosmetic.progressBarWidth = (questionStorage.index / JSON.parse(localStorage.getItem("questionStorage")).length) * 100;
        document.getElementById("myProgressBar").style.width = cosmetic.progressBarWidth + "%"
    },
    questionImage: function () {
        if (JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].hasOwnProperty("img")) {
            document.getElementById("image").style.display = "inline";
            document.getElementById("image").src = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].img;
        }
    },
    counter: function () {
        document.getElementById("questionCount").innerHTML = `Q ${questionStorage.index + 1} / ${JSON.parse(localStorage.getItem("questionStorage")).length}`;
    }
}

let statistic = {
    check: function () {
        console.log("Check function started")
        let thisQuiz = JSON.parse(localStorage.getItem("questionStorage"));

        //Checking if this is the last question
        if (questionStorage.index !== thisQuiz.length) return;

        //Checking if the statistics array has been created
        if (localStorage.getItem("statistic") === null) {
            localStorage.setItem("statistic", JSON.stringify([]));
        }
        console.log("Check function completed")
        //Transfering to a function to update the statistic
        this.update(thisQuiz)
    },
    update: function (thisQuiz) {
        console.log("Updated function started")

        let statistics = JSON.parse(localStorage.getItem("statistic"));

        console.log(statistics);

        let currentStatistic = {
            quizName: localStorage.getItem("info"),
            completedTime: this.calculate.time(),
            completedDate: new Date().toISOString().split("T")[0],
            quizLength: thisQuiz.length,
            correctAnswers: this.calculate.answers(thisQuiz),
            groups: this.calculate.groups(thisQuiz)
        }

        statistics.unshift(currentStatistic);

        localStorage.setItem("statistic", JSON.stringify(statistics));

        
    },
    calculate: {
        answers: function (thisQuiz) {
            let points = 0;
            thisQuiz.forEach(question => {
                if (question.a === question.choice) {
                    return points++;
                }
            });
            return points;
        },
        groups: function (thisQuiz) {
            let thisGroup = [];
            //Iterating through every question
            thisQuiz.forEach(question => {
                //Checking if this questions group already exists
                for (let i = 0; i < thisGroup.length; i++) {
                    if (thisGroup[i].groupName === question.group) {
                        thisGroup[i].groupLength++;
                        //Checks if the client made the right choice
                        if (question.a === question.choice) {
                            thisGroup[i].correct++;
                        }
                        return;
                    }
                }
                let groupObject = {
                    groupName: question.group,
                    groupLength: 1,
                }
                if (question.a === question.choice) {
                    groupObject.correct = 1;
                } else {
                    groupObject.correct = 0;
                }

                thisGroup.push(groupObject);

                return thisGroup;
            });
            return thisGroup
        },
        time: function() {
            return new Date(event.timeStamp).toISOString().slice(11, 19);
        }
    }
}