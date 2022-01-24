statistics = {
    storage: {
        datoruUzbuve: JSON.parse(localStorage.getItem("statistic_DATORU_UZBUVE")),
        operetajsistemas: JSON.parse(localStorage.getItem("statistic_OPERETAJSISTEMAS")),
        datortikli: JSON.parse(localStorage.getItem("statistic_DATORTIKLI")),
        datuBazes: JSON.parse(localStorage.getItem("statistic_DATU_BAZES")),
        normativieAkti: JSON.parse(localStorage.getItem("statistic_NORMATIVIE_AKTI")),
        programmesana: JSON.parse(localStorage.getItem("statistic_PROGRAMMESANA")),
    },
    check: (stats, quiz) => {
        if(stats === null) {
            return document.getElementById("statistic_" + quiz).disabled = true;
        }
        statistics.create(stats, quiz);
    },
    checkMain: (stat, quiz) => {
        document.getElementById("mainResult_" + quiz).innerHTML = `${stat}%`;
    },
    create: (stats, quiz) => {
        //Send to main
        statistics.checkMain(((stats.bestResultScore / stats.quizLength) * 100).toFixed(2), quiz);
        //Best Result
        document.getElementById("bestResult_" + quiz).innerHTML = `${stats.bestResultScore}/${stats.quizLength} (${((stats.bestResultScore / stats.quizLength) * 100).toFixed(2)}%)`;
        //Recent Result
        document.getElementById("recentResult_" + quiz).innerHTML = `${stats.recentResultScore}/${stats.quizLength} (${((stats.recentResultScore / stats.quizLength) * 100).toFixed(2)}%)`;
        //90%
        document.getElementById("ninety_" + quiz).innerHTML = stats.ninety;
        //70%
        document.getElementById("seventy_" + quiz).innerHTML = stats.seventy;
        //50%
        document.getElementById("fifty_" + quiz).innerHTML = stats.fifty;
        //Times Completed
        document.getElementById("timesCompleted_" + quiz).innerHTML = stats.timesCompleted;
    },
    display: () => {
        //Individual statistics
        statistics.check(statistics.storage.datoruUzbuve, "DATORU_UZBŪVE");
        statistics.check(statistics.storage.operetajsistemas, "OPERĒTĀJSISTĒMAS");
        statistics.check(statistics.storage.datortikli, "DATORTĪKLI");
        statistics.check(statistics.storage.datuBazes, "DATU_BĀZES");
        statistics.check(statistics.storage.datoruUzbuve, "NORMATĪVIE_AKTI");
        statistics.check(statistics.storage.programmesana, "PROGRAMMĒŠANA");
    } 
}