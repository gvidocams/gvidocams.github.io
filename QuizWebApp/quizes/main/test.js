const failSafe = {
    recentQuiz: JSON.parse(localStorage.getItem("questionStorage")),
    check: function() {
        //Checking the value of recent quiz
        if(this.recentQuiz === null) return;
        //Updating recentQuiz variable
        this.recentQuiz = JSON.parse(localStorage.getItem("questionStorage"));
        //Checking for unanswered questions
        for(let i = 0; i < this.recentQuiz.length; i++) {
            if(!this.recentQuiz[i].hasOwnProperty("choice")) {
                //Updating all fail safe properties
                document.getElementById("info").style.display = "block";
                document.getElementById("name").innerHTML = this.display();
                document.getElementById("count").innerHTML = `${i} / ${this.recentQuiz.length}`;
                this.disable();
                this.button();
                return;
            }
        }
        return "Visi testi izpildīti";
    },
    display: function() {
        let info = localStorage.getItem("info").replace("_", " ").split(" ");

        for(let i = 0; i < info.length; i++) {
            info[i] = info[i].charAt(0).toUpperCase() + info[i].slice(1).toLowerCase();
        }
        info = info.join(" ");
        switch(info) {
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
    disable: function() {
        document.querySelectorAll("button.working").forEach(elem => {
            elem.disabled = true;
        })
    },
    button: function() {
        document.getElementById("continue").onclick = function() {
            location.href = "../" + localStorage.getItem("info") + ".html";
        }
    },
    erase: function() {
        localStorage.removeItem("questionStorage");
        document.getElementById("info").style.display = "none";
        document.querySelectorAll("button.working").forEach(elem => {
            elem.disabled = false;
        })
    }
}