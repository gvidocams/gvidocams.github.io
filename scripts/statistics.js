let statistic = {
    create: function() {
        const HISTORY = JSON.parse(localStorage.getItem("statistic"))
        let markDown = "";
        for(let i = 0; i < HISTORY.length; i++) {
            markDown += this.markUp(HISTORY[i]);
        }
        return markDown;
    },
    markUp: function(stats) {
        let name = stats.quizName;
        let date = stats.completedDate;
        let time = stats.completedTime;
        let result = `${stats.correctAnswers} / ${stats.quizLength} (${Math.floor((stats.correctAnswers / stats.quizLength) * 100)}%)`;

        let markup = `<div class="container"><button class="head">${this.createName(name)}</button><div class="statistics"><p><span>Datums:</span><span>${date}</span></p><p><span>Rezultāts:</span><span>${result}</span></p><p><span>Izpildes laiks:</span><span>${time}</span></p><h3>Pieļautās kļūdas:</h3><div class="insights"><ul>${this.group(stats.groups)}</ul></div></div></div>`;
        return markup;
    },
    createName: function(name) {
        let info = name.replace("_", " ").split(" ");

        for (let i = 0; i < info.length; i++) {
            info[i] = info[i].charAt(0).toUpperCase() + info[i].slice(1).toLowerCase();
        }
        info = info.join(" ");
        switch (info) {
            case "Exam":
                info = "Eksāmens";
                break;
            case "Miniexam":
                info = "Mini-Eksāmens";
                break;
            case "Datoru Uzbuve":
                info = "Datoru Uzbūve";
                break;
            case "Operetajsistemas":
                info = "Operētājsistēmas";
                break;
            case "Datortikli":
                info = "Datortīkli";
                break;
            case "Datu Bazes":
                info = "Datu Bāzes";
                break;
            case "Normativie Akti":
                info = "Normatīvie Akti";
                break;
            case "Programmesana":
                info = "Programmēšana";
                break;
        }
        return info;
    },
    group: function(stats) {
        let markup = "";
        for(let i = 0; i < stats.length; i++) {
            let name = stats[i].groupName;
            let length = stats[i].groupLength;
            let correct = stats[i].correct;
            if(length - correct !== 0) {
            markup += `<li>${name}: ${length - correct} / ${length}</li>`;
            }
        }
        return markup;
    }
}

document.getElementById("history").innerHTML = statistic.create()

