let questionStorage = {
    index: 0,
    nameOfQuiz: "",
    check: function (dataBase, dataBaseName) {
        let quiz = JSON.parse(localStorage.getItem("questionStorage"));
        if (quiz === null) return this.create(dataBase, dataBaseName);
        for (let i = 0; i < quiz.length; i++) {
            if (!quiz[i].hasOwnProperty("choice")) {
                this.index = i;
                return;
            }
        }
        return this.create(dataBase, dataBaseName);
    },
    create: function (dataBase, dataBaseName) {
        window.localStorage.setItem("questionStorage", JSON.stringify(this.generate(dataBase)));
        window.localStorage.setItem("info", dataBaseName);
    },
    generate: function (questions) {
        //Randomizing the whole question storage
        let questionsCopy = [...questions].sort(() => Math.random() - 0.5);
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
                location.href = "../statistics.html";
            }
        }
    }

}
let cosmetic = {
    questionDefaults: function () {
        //Enables the buttons to work properly
        document.getElementById("button1").disabled = false;
        document.getElementById("button2").disabled = false;
        document.getElementById("button3").disabled = false;
        document.getElementById("button4").disabled = false;
        //Sets the cursor to pointer
        document.getElementById("button1").style.cursor = "pointer";
        document.getElementById("button2").style.cursor = "pointer";
        document.getElementById("button3").style.cursor = "pointer";
        document.getElementById("button4").style.cursor = "pointer";
        //Sets the default border color for answer boxes
        document.getElementById("button1").style.borderColor = "rgb(65, 62, 62)";
        document.getElementById("button2").style.borderColor = "rgb(65, 62, 62)";
        document.getElementById("button3").style.borderColor = "rgb(65, 62, 62)";
        document.getElementById("button4").style.borderColor = "rgb(65, 62, 62)";
        //Sets the default background color for answer boxes
        document.getElementById("button1").style.background = "inherit";
        document.getElementById("button2").style.background = "inherit";
        document.getElementById("button3").style.background = "inherit";
        document.getElementById("button4").style.background = "inherit";
        //Sets the next-button to a lower brightness and disables it
        document.getElementById("next-button").disabled = true;
        document.getElementById("next-button").style.cursor = "not-allowed";
        document.getElementById("next-button").style.color = "rgba(255, 255, 255, 0.226)";
        //Sets the image value to none
        document.getElementById("image").style.display = "none"
    },
    questionDisabled: function () {
        //Disabled the buttons after the answer has been given
        document.getElementById("button1").disabled = true;
        document.getElementById("button2").disabled = true;
        document.getElementById("button3").disabled = true;
        document.getElementById("button4").disabled = true;
        //Sets the cursor to not-allowed
        document.getElementById("button1").style.cursor = "not-allowed";
        document.getElementById("button2").style.cursor = "not-allowed";
        document.getElementById("button3").style.cursor = "not-allowed";
        document.getElementById("button4").style.cursor = "not-allowed";
        //Sets the next-question button brighter
        document.getElementById("next-button").disabled = false;
        document.getElementById("next-button").style.cursor = "pointer";
        document.getElementById("next-button").style.color = "white";
    },
    questionText: function () {
        document.getElementById("header").innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].q;
        document.getElementById("button1").innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a1;
        document.getElementById("button2").innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a2;
        document.getElementById("button3").innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a3;
        document.getElementById("button4").innerText = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a4;
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