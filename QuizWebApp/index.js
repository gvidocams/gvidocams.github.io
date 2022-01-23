const main = {
    recentQuiz: JSON.parse(localStorage.getItem("questionStorage")),
    recentInfo: localStorage.getItem("info"),
    check: function () {
        if (this.recentQuiz !== null) {
            document.getElementById("hint").style.display = "none";
            document.getElementById("statistic").style.display = "block";
            this.display.name();
            this.display.status();
        }
    },
    display: {
        name: function () {
            let name = localStorage.getItem("info").replace("_", " ").split(" ");
            for (let i = 0; i < name.length; i++) {
                name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1).toLowerCase();
            }
            name = name.join(" ")
            switch(name) {
                case "Datoru Uzbuve":
                    name = "Datoru Uzbūve";
                    break;
                case "Operetajsistemas":
                    name = "Operētājsistēmas";
                    break;
                case "Datortikli":
                    name = "Datortīkli";
                    break;
                case "Datu Bazes":
                    name = "Datu Bāzes";
                    break;
                case "Normativie Akti":
                    name = "Normatīvie Akti";
                    break;
                case "Programmesana":
                    name = "Programmēšana";
                    break;
            }
            document.getElementById("name").innerHTML = name;
        },
        status: function () {
            for (let i = 0; i < main.recentQuiz.length; i++) {
                if (!main.recentQuiz[i].hasOwnProperty("choice")) {
                    this.count(i);
                    return document.getElementById("status").innerHTML = `<span style="color: red;">Nepabeigts</span>`;
                }
            }
            this.correct()
            return document.getElementById("status").innerHTML = `<span style="color: green;">Pabeigts</span>`;
        },
        count: function(num) {
            document.getElementById("operator").innerHTML = "Izpildīti:"
            document.getElementById("count").innerHTML = `${num}/${main.recentQuiz.length}`;
        },
        correct: function() {
            document.getElementById("operator").innerHTML = "Pareizi izpildīti:"
            let correct = 0;
            for(let i = 0; i < main.recentQuiz.length; i++) {
                if(main.recentQuiz[i].choice === main.recentQuiz[i].a) {
                    correct++;
                }
            }
            document.getElementById("count").innerHTML = `${correct} / ${main.recentQuiz.length} (${((correct / main.recentQuiz.length) * 100).toFixed(2)}%)`;
        }
    }
}