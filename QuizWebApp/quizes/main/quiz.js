let questionStorage = {
    index: 0,
    nameOfQuiz: "",
    check: function(dataBase, dataBaseName) {
        let quiz = JSON.parse(localStorage.getItem("questionStorage"));
        if(quiz === null) return this.create(dataBase, dataBaseName);
        for(let i = 0; i < quiz.length; i++) {
            if(!quiz[i].hasOwnProperty("choice")) {
                this.index = i;
                return;
            }
        }
        return this.create(dataBase, dataBaseName);
    },
    create: function(dataBase, dataBaseName) {
        this.nameOfQuiz = "statistic_" + dataBaseName;
        window.localStorage.setItem("questionStorage", JSON.stringify([...dataBase].sort(() => Math.random() - 0.5)));
        window.localStorage.setItem("info", dataBaseName);
    },
}
let quiz = {
    callOutQuestion: function() {
        this.endTest();
        cosmetic.questionDefaults();
        cosmetic.questionText();
        cosmetic.questionImage();
        cosmetic.increaseProgressBar();
        cosmetic.counter();
    },

    buttonclick: function(num) {

        cosmetic.questionDisabled();
        cosmetic.questionVisuals(JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a ,num);

        quiz.saveChoice(num);
        questionStorage.index++;

        cosmetic.increaseProgressBar();

        statistic.check();
    },
    saveChoice: function(number) {
        let result = JSON.parse(localStorage.getItem("questionStorage"));
        result[questionStorage.index].choice = number;
        localStorage.setItem("questionStorage", JSON.stringify(result));
    },
    endTest: function() {
        if(JSON.parse(localStorage.getItem("questionStorage")).length - 1 === questionStorage.index) {
            document.getElementById("next-button").innerHTML = "Beigt testu";
            document.getElementById("next-button").onclick = function() {
                location.href = "../index.html";
            }
        }
    }
    
}
let cosmetic = {
    questionDefaults: function() {
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
    questionDisabled: function() {
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
    questionText: function() {
        document.getElementById("header").innerHTML = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].q;
        document.getElementById("button1").innerHTML = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a1;
        document.getElementById("button2").innerHTML = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a2;
        document.getElementById("button3").innerHTML = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a3;
        document.getElementById("button4").innerHTML = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].a4;
    },
    questionVisuals: function(answer, choice) {
        document.getElementById("button" + answer).style.borderColor = "rgb(0, 200, 0)";
        document.getElementById("button" + answer).style.background = "rgb(0, 200, 0)";
        if(answer !== choice) {
            document.getElementById("button" + choice).style.borderColor = "rgb(209, 0, 0)";
            document.getElementById("button" + choice).style.background = "rgb(209, 0, 0)";
        }
    },
    progressBarWidth: 0,
    increaseProgressBar: function() {
        cosmetic.progressBarWidth = (questionStorage.index / JSON.parse(localStorage.getItem("questionStorage")).length) * 100;
        document.getElementById("myProgressBar").style.width = cosmetic.progressBarWidth + "%"
    },
    questionImage: function() {
        if(JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].hasOwnProperty("img")) {
            document.getElementById("image").style.display = "inline";
            document.getElementById("image").src = JSON.parse(localStorage.getItem("questionStorage"))[questionStorage.index].img;
        }
    },
    counter: function() {
        document.getElementById("questionCount").innerHTML = `Q ${questionStorage.index + 1} / ${JSON.parse(localStorage.getItem("questionStorage")).length}`;
    }
}


let statistic = {
    storage: JSON.parse(localStorage.getItem(questionStorage.nameOfQuiz)),
    check: function() {
        
        statistic.storage = JSON.parse(localStorage.getItem(questionStorage.nameOfQuiz));

        if(questionStorage.index === JSON.parse(localStorage.getItem("questionStorage")).length) {
            if(localStorage.getItem(questionStorage.nameOfQuiz) === null) {
                statistic.storage = {bestResultScore: 0, recentResultScore: 0, quizLength: 0, ninety: 0, seventy: 0, fifty: 0, timesCompleted: 0};

                localStorage.setItem(questionStorage.nameOfQuiz, JSON.stringify(this.storage));
            }
            this.statisticUpdate();
        }
    },
    statisticUpdate: function() {
        this.storage.timesCompleted++;
        this.storage.quizLength = JSON.parse(localStorage.getItem("questionStorage")).length;
        this.storage.recentResultScore = this.functions.recentQuizPoints();
        this.storage.bestResultScore = this.functions.bestResult();
        this.functions.completions();

        localStorage.setItem(questionStorage.nameOfQuiz, JSON.stringify(this.storage));
    },
    functions: {
        recentQuizPoints: function() {
            let points = 0;
            JSON.parse(localStorage.getItem("questionStorage")).forEach(question => {
                if(question.a === question.choice) {
                    return points++;
                }
            });
            return points;
        },
        recentQuizPercentage: function() {
            return Number(((100 / JSON.parse(localStorage.getItem("questionStorage")).length) * statistic.functions.recentQuizPoints()).toFixed(2));
        },
        bestResult: function() {
            if(statistic.storage.bestResultScore < statistic.functions.recentQuizPoints()) {
                return statistic.functions.recentQuizPoints();
            } else {
                return statistic.storage.bestResultScore;
            }
        },
        completions: function() {
            if(statistic.functions.recentQuizPercentage() >= 90) {
                return statistic.storage.ninety++;
            } else if(statistic.functions.recentQuizPercentage() >= 70) {
                return statistic.storage.seventy++;
            } else if(statistic.functions.recentQuizPercentage() >= 50) {
                return statistic.storage.fifty++;
            }
        }
    }
}

//QUESTION STORAGE

const DATORU_UZBUVE = [
    //1 - 10
    {
        q: "Kādam nolūkam ir nepieciešami pārtraukumu pieprasījumi (IRQ)?",
        a1: "1. Procesoram - lai organizētu iekārtu darbību",
        a2: "2. OS - lai atpazītu iekārtu modeli",
        a3: "3. Lai ierobežotu procesora veiktspēju",
        a4: "4. Atmiņas adresācijai",
        a: 1 
    },
    {
        q: "Kur BIOS saglabā informāciju, mainot BIOS cietā diska vai COM porta uzstādījumus?",
        a1: "1. Centrālajā procesorā (CPU)",
        a2: "2. CMOS",
        a3: "3. Brīvpieejas atmiņā (RAM)",
        a4: "4. Cietajā diskā (HDD)",
        a: 2
    },
    {
        q: "Ko glabā CMOS RAM?",
        a1: "1. BIOS",
        a2: "2. BIOS versijas datumu",
        a3: "3. Lasāmatmiņas (ROM) pārtraukumu",
        a4: "4. Sistēmas konfigurācijas informāciju",
        a: 4
    },
    {
        q: "Ko izmanto datora ierīcēs, lai paziņotu centrālam procesoram (CPU), ka dati ir sagatavoti ielādēšanai datoru sistēmā?",
        a1: "1. DMA pieprasījumu",
        a2: "2. Tiltslēgus (jumpers)",
        a3: "3. Pārtraukumu",
        a4: "4. Buferus",
        a: 3
    },
    {
        q: "Kas ir starpatmiņa (cache)?",
        a1: "1. Dinamiskā atmiņa",
        a2: "2. Atmiņa, kurā tiek glabāti visbiežāk izmantojamie dati",
        a3: "3. Cietā diska paveids",
        a4: "4. Rezervēts atmiņas apgabals no sistēmas atmiņas",
        a: 2
    }, 
    {
        q: "Kas notiek ar brīvpieejas atmiņas informāciju izslēdzot datoru?",
        a1: "1. Brīvpieejas atmiņas (RAM) informācija zūd",
        a2: "2. Tā automātiski tiek saglabāta palīgatmiņā",
        a3: "3. Tā saglabājas līdz nākamajai datora ieslēgšanās reizei",
        a4: "4. Tā automātiski tiek saglabāta cietajā diskā (HDD)",
        a: 1
    },
    {
        q: "Kāds datu pārraides veids nodrošina viena bita pārraidi vienā laika vienībā?",
        a1: "1. Virknes",
        a2: "2. Asinhronais",
        a3: "3. Paralēlais",
        a4: "4. Sinhronais",
        a: 1
    },
    {
        q: "Kāds faktors nosaka, cik lielu atmiņas apjomu procesors spēj kontrolēt?",
        a1: "1. Takts frekvence",
        a2: "2. Datu maģistrāles platums",
        a3: "3. Adrešu maģistrāles platums",
        a4: "4. Mikroshēmojums (chipset)",
        a: 4
    },
    {
        q: "Kur jāpievieno antistatiskā aproce, labojot datoru?",
        a1: "1. Pie mātes plates barošanas spraudņa",
        a2: "2. Pie datora sistēmbloka metāliskās daļas",
        a3: "3. Pie darba galda virsmas",
        a4: "4. Pie 220V rozetes labā kontakta",
        a: 2
    },
    {
        q: "Kura no četrām drukas tehnoloģijām nodrošina vislabāko kvalitāti daudzkrāsu drukāšanai?",
        a1: "1. Adatu",
        a2: "2. Sublimācijas",
        a3: "3. Lāzera",
        a4: "4. Termo",
        a: 2
    },
    //11 - 20
    {
        q: "Ko nodrošina DVD-ROM iekārtas autotrekings?",
        a1: "1. Lāzera staru atrašanos uz celiņa",
        a2: "2. Nemainīgu griešanos",
        a3: "3. Sprieguma maiņu",
        a4: "4. Novietojumu uz klastera",
        a: 1
    },
    {
        q: "Lai lāzera staru noturētu uz spirālveida celiņa, kompaktdiskos izmanto…",
        a1: "1. Staru aplieci",
        a2: "2. Viļņu algoritmu",
        a3: "3. Trīs staru metodi",
        a4: "4. Staru laušanu 90* leņķī",
        a: 3
    },
    {
        q: "Kas vispirms jāveic, ja lietojumprogrammas darba laikā nepārtraukti darbojas cietais disks?",
        a1: "1. Jānomaina barošanas bloks",
        a2: "2. Jānomaina cietais disks",
        a3: "3. Jāpalielina brīvpieejas atmiņas apjoms",
        a4: "4. Jāpārinstalē lietojumprogramma",
        a: 3
    },
    {
        q: "Kā atšifrējama abreviatūra DMA?",
        a1: "1. Discret Mapping Administration",
        a2: "2. Daemon Monitor Access",
        a3: "3. Direct Memory Access",
        a4: "4. Domain Memory Ammunition",
        a: 3
    },
    {
        q: "Procesora marķējumā norādīti šādi cipari un simboli: 3000/512/1333/0 V. Kādu takts frekvenci uztur procesors?",
        a1: "1. Nav zināms",
        a2: "2. 512 MHz",
        a3: "3. 3000 MHz",
        a4: "4. 1333 MHz",
        a: 3
    },
    {
        q: "Kas ir atmiņas elements SRAM mikroshēmā",
        a1: "1. Kondensators",
        a2: "2. Tranzistors",
        a3: "3. Rezistors",
        a4: "4. Diode",
        a: 2
    },
    {
        q: "Kāda datu uzglabāšanas ierīce nodrošina visātrāko pieeju datiem?",
        a1: "1. HDD",
        a2: "2. DVD-ROM",
        a3: "3. SSD",
        a4: "4. Magnētoptiskais dzinis",
        a: 3
    },
    {
        q: "Katra jaunā procesoru paaudze strādā ar ar vien augstāku takts frekvenci. Kas ir noteicošais faktors, kurš nodrošina takts frekvences palielināšanos?",
        a1: "1. VRT tehnoloģija",
        a2: "2. Superskalārā tehnoloģija (pipelining)",
        a3: "3. MMX tehnoloģija",
        a4: "4. Mikronu tehnoloģija",
        a: 4
    },
    {
        q: "Ko paredz RISC procesoru arhitektūra?",
        a1: "1. Procesoram ir iebūvētas mazāks skaits fiksēta garuma instrukciju",
        a2: "2. Procesoram ir iebūvētas lielāks skaits mainīga garuma instrukciju",
        a3: "3. Procesors vienā laika vienībā veic lielāku darba apjomu",
        a4: "4. Procesors vienu instrukciju izpilda vairākās taktīs",
        a: 1
    },
    {
        q: "Kā veidošanai izmanto statiskās atmiņas mikroshēmas?",
        a1: "1. Brīvpieejas atmiņas (RAM)",
        a2: "2. Starpatmiņas (CACHE)",
        a3: "3. Lasāmatmiņas (ROM)",
        a4: "4. Videoatmiņas (VRAM)",
        a: 2
    },
    //21 - 30
    {
        q: "Ko lokanā magnētiskā diska uzkrājējā pārvieto soļu dzinējs?",
        a1: "1. Magnētiskās galviņas",
        a2: "2. Disketi",
        a3: "3. Cilindru",
        a4: "4. Celiņu",
        a: 1
    },
    {
        q: "Kā atšifrējama abreviatūra BIOS?",
        a1: "1. Basic Input Output System",
        a2: "2. Basic Insert Output System",
        a3: "3. Basic Input Outset System",
        a4: "4. Basic Insert Outset System",
        a: 1
    },
    {
        q: "Kādos printeros izmanto burbuļtehnoloģiju?",
        a1: "1. Adatu printeros",
        a2: "2. Lāzeru printeros",
        a3: "3. Tintes printeros",
        a4: "4. Rindu printeros",
        a: 3
    },
    {
        q: "Kas ir punktiestatne (dot pitch)?",
        a1: "1. Pikseļu skaits monitora ekrānā",
        a2: "2. Pikseļu skaits ekrāna vienā kvadrātcollā",
        a3: "3. Noteiktas izšķirtspējas pikseļu skaits",
        a4: "4. Attālums starp vienas krāsas punktiem monitora ekrānā",
        a: 4
    },
    {
        q: `Kādu izšķirtspēju ieteicams iestatīt 20" LCD monitoriem?`,
        a1: "1. 800 x 600",
        a2: "2. 1920 x 1080",
        a3: "3. Augstāko izšķirtspēju, ko monitors atbalsta",
        a4: "4. Zemāku izšķirtspēju nekā vietējā izšķirtspēja",
        a: 3
    },
    {
        q: "Viena no procesora galvenajām sastāvdaļām ir vadības ierīce. Kāda ir tās funkcija?",
        a1: "1. Izmantojot vadības signālus, vadīt visas datora  ierīces un veikt datora testēšanu",
        a2: "2. Izmantojot vadības signālus, vadīt operatīvās atmiņas un cietā diska darbību",
        a3: "3. Atkodēt no atmiņas saņemtās komandas un formēt to izpildei nepieciešamos vadības signālus",
        a4: "4. Noteikt procesora takts frekvenci un palielināt to ātrdarbību, izpildot sarežģītus uzdevumus",
        a: 3
    },
    {
        q: "Kas ir procesora reģistru bloks?",
        a1: "1. Cietā diska apgabals, kur tiek glabāti procesoram nepieciešamie dati",
        a2: "2. Maza apjoma ātrdarbīga atmiņa, kas paredzēta datu īslaicīgai glabāšanai",
        a3: "3. Speciāls reģistrs, kur tiek reģistrētas visas datorā veiktās darbības",
        a4: "4. Maza apjoma ātrdarbīga atmiņa, kurā tiek glabāti neliela izmēra faili",
        a: 2
    },
    {
        q: "Kurš datu nesējs atšķiras no pārējiem pēc ierakstīšanas/nolasīšanas principa?",
        a1: "1. Kompaktdisks",
        a2: "2. Cietais disks",
        a3: "3. SSHD disks",
        a4: "4. Tilpdisks",
        a: 1
    },
    {
        q: "No kā atkarīga skenera horizontālā izšķirtspēja?",
        a1: "1. No sensoru skaita vienā rindā",
        a2: "2. No gaismas avota intensitātes",
        a3: "3. No soļu dzinēja soļa lieluma",
        a4: "4. No sensora tipa (CCD vai CIS)",
        a: 1
    },
    {
        q: "No kā atkarīga skenera horizontālā izšķirtspēja?",
        a1: "1. No sensoru skaita vienā rindā",
        a2: "2. No gaismas avota intensitātes",
        a3: "3. No soļu dzinēja soļa lieluma",
        a4: "4. No sensora tipa (CCD vai CIS) ",
        a: 1
    },
    //31 - 40
    {
        q: "Kur nepazūd informācija, izslēdzot datoru?",
        a1: "1. Lasāmatmiņā (ROM)",
        a2: "2. Starpatmiņā (CACHE)",
        a3: "3. Procesora vispārējās nozīmes reģistros",
        a4: "4. Brīvpieejas atmiņā",
        a: 1
    },
    {
        q: "Kur jāielādē programma, lai tā varētu izpildīties?",
        a1: "1. Brīvpieejas atmiņā",
        a2: "2. Lasāmatmiņā",
        a3: "3. Starpatmiņā",
        a4: "4. Procesora vispārējās nozīmes reģistros",
        a: 1
    },
    {
        q: "Kādam nolūkam domāta mātesplate?",
        a1: "1. Ārējo iekārtu konfigurācijai",
        a2: "2. Lai varētu īslaicīgi atvienot un pievienot printeri",
        a3: "3. Lai dators darbotos ar alternatīva avota enerģiju",
        a4: "4. Lai apvienotu sistēmas bloka komponentes",
        a: 4
    },
    {
        q: "Kas ir cietā diska (HDD) cilindri?",
        a1: "1. Sektoru kopums",
        a2: "2. Celiņu kopums ar vienādiem numuriem",
        a3: "3. Celiņu kopums ar dažādiem numuriem",
        a4: "4. Klasteru kopums",
        a: 2
    },
    {
        q: "Kurā adresē ierakstās ielādes sektors (BR)?",
        a1: "1. Adresē 0, 0, 1",
        a2: "2. Adresē 9, 1, 1",
        a3: "3. Adresē 1, 1, 1",
        a4: "4. Adresē 1, 0, 0",
        a: 2
    },
    {
        q: "Kurš apraksts visprecīzāk raksturo AGP kopni?",
        a1: "1. AGP sloti tieši savienoti ar procesoru, lai paaugstinātu sistēmas veiktspēju",
        a2: "2. AGP kopne strādā ar 33 MHz frekvenci",
        a3: "3. AGP kopne strādā ar 66 MHz frekvenci un tā savienota ar procesoru caur PCI kopni",
        a4: "4. AGP tiek atšifrēts kā Advanced Graphics Port un tiek izmantota papildus videoatmiņas pievienošanai",
        a: 1
    },
    {
        q: "Kad procesoram nepieciešami dati apstrādei, tie vispirms tiek meklēti...",
        a1: "1. L2 starpatmiņā (cache)",
        a2: "2. Brīvpieejas atmiņa (RAM)",
        a3: "3. L1 starpatmiņā (cache)",
        a4: "4. Lasāmatmiņa (ROM)",
        a: 3
    },
    {
        q: "Ja, datoram startējoties, deg monitora barošanas indikators, bet ekrāns ir tumšs, vispirms jāpārbauda, vai...",
        a1: "1. Kontrasts un spožums nav iestatīti minimālā līmenī",
        a2: "2. Videokartes draiveri ir korekti",
        a3: "3. Videokarte nav bojāta",
        a4: "4. CMOS parametri ir izvēlēti pareizi",
        a: 1
    },
    {
        q: "Kādās mērvienībās mēra gaismas plūsmu projektoros?",
        a1: "1. ANSI lumenos",
        a2: "2. ANSI decibelos",
        a3: "3. ANSI milimetros",
        a4: "4. ANSI angstrēmos",
        a: 1
    },
    {
        q: "Kas veido attēlu LCD monitoros?",
        a1: "1. Luminofors",
        a2: "2. Mirdzdiodes",
        a3: "3. Šķidrie kristāli",
        a4: "4. Vadu matrica",
        a: 3
    },
    //41 - 50
    {
        q: "Kura no minētajām ierīcēm ir ievadierīce?",
        a1: "1. Monitors",
        a2: "2. Video projektors",
        a3: "3. Skeneris",
        a4: "4. Skandas ",
        a: 3
    },
    {
        q: "Kā lāzerprinteros tiek nodrošināta tonera uzklāšana uz foto veltņa? ",
        a1: "1. Pozitīvi lādētajiem punktiem uz foto veltņa pielīp negatīvi lādēts toneris",
        a2: "2. Negatīvi lādētajiem punktiem uz foto veltņa pielīp pozitīvi lādēts toneris",
        a3: "3. Uz ar lāzerstaru sakarsētajiem punktiem uz foto veltņa pielīp toneris",
        a4: "4. Uz foto veltņa ar sildelementiem sakarsētajiem punktiem pielīp toneris",
        a: 2
    },
    {
        q: "Kādam nolūkam domāti ārējie datu nesēji?",
        a1: "1. Informācijas atpazīšanai",
        a2: "2. Datu apstrādei",
        a3: "3. Informācijas uzglabāšanai",
        a4: "4. Datu kompresijai ",
        a: 3
    },
    {
        q: "Kura no atmiņām ir visātrākā?",
        a1: "1. RIMM",
        a2: "2. DDR",
        a3: "3. DDR4",
        a4: "4. DDR3",
        a: 3
    },
    {
        q: "Kas ir ChipSet?",
        a1: "1. Atmiņa",
        a2: "2. Kontrolleris",
        a3: "3. Aritmētiski loģiskā ierīce",
        a4: "4. Sistēmas mikroshēmu kopums",
        a: 4
    },
    {
        q: "Kāda materiāla procesora dzesēšanas radiatoru ieteicams izvēlēties?",
        a1: "1. Tērauda",
        a2: "2. Vara",
        a3: "3. Čuguna",
        a4: "4. Skārda",
        a: 2
    },
    {
        q: "Kura ierīce paredzēta liela formāta grafisku attēlu izdrukāšanai?",
        a1: "1. Skeneris",
        a2: "2. Lāzerprinteris",
        a3: "3. Tintes printeris",
        a4: "4. Ploteris ",
        a: 4
    },
    {
        q: "Kuras divas tehnoloģijas izmanto tintes printeros?",
        a1: "1. Punktu un svītru tehnoloģiju",
        a2: "2. Burbuļu un pjezotehnoloģiju",
        a3: "3. Komatu un jautājumu tehnoloģiju",
        a4: "4. Horizontālo un vertikālo tehnoloģiju ",
        a: 2
    },
    {
        q: "Kura no ierīcēm ir paredzēta gan datu ievadīšanai, gan izvadīšanai?",
        a1: "1. Skārienekrāns",
        a2: "2. Skeneris",
        a3: "3. Digitālā kamera",
        a4: "4. Web-kamera",
        a: 1
    },
    {
        q: "Kādas ir SSD diska priekšrocības, salīdzinot ar HDD?",
        a1: "1. Zemākas izmaksas",
        a2: "2. Lielāks datu pārraides ātrums",
        a3: "3. Ilgāks kalpošanas laiks",
        a4: "4. Lielāks diska rotācijas ātrums",
        a: 2
    },
    //51 - 60 
    {
        q: "Kāda ir lāzera funkcija lāzerprinterī?",
        a1: "1. Attēla radīšana, tieši iedarbojoties uz papīru",
        a2: "2. Elektrostatiskā attēla radīšana uz foto membrānas",
        a3: "3. Tonera fiksācija uz papīra",
        a4: "4. Drukas galviņas pozicionēšana",
        a: 2
    },
    {
        q: "Kā notiek attēla uzlabošana lāzerprinteros?",
        a1: "1. Īpašs tranzistors regulē lāzera stara jaudu",
        a2: "2. Tiek izmantoti dažādi toneri",
        a3: "3. Attēls tiek drukāts divas reizes",
        a4: "4. Krāsas tiek sakarsētas līdz augstākai temperatūrai",
        a: 1
    },
    {
        q: "Kāds krāsu modelis tiek izmantots krāsainajos printeros?",
        a1: "1. RGB krāsu modelis",
        a2: "2. CMYK krāsu modelis",
        a3: "3. HSV krāsu modelis",
        a4: "4. Grayscale krāsu modelis",
        a: 2
    },
    {
        q: "ROM ir...",
        a1: "1. Pastāvīgā datora atmiņa, kurā glabājas datora darbībai svarīga informācija, kura nekad nemainās",
        a2: "2. Vieta uz cietā diska, kur īslaicīgi uzglabā darbam nepieciešamos datus un pēc vajadzības ievieto RAM",
        a3: "3. Bieži lietojama datu glabātuve, kas tieši saistīta ar procesoru",
        a4: "4. Atmiņas paveids, kas datoram ieslēdzoties nodrošina saikni starp visām datora sastāvdaļām",
        a: 1
    },
    {
        q: "Basic input/output system (BIOS) ir...",
        a1: "1. Pastāvīgā datora atmiņa, kurā glabājas datora darbībai svarīga informācija, kura nekad nemainās",
        a2: "2. Vieta uz cietā diska, kur īslaicīgi uzglabā darbam nepieciešamos datus un pēc vajadzības ievieto RAM",
        a3: "3. Bieži lietojama datu glabātuve, kas tieši saistīta ar procesoru",
        a4: "4. ROM paveids, kas datoram ieslēdzoties nodrošina saikni starp visām datora sastāvdaļām",
        a: 4
    },
    {
        q: "Virtuālā atmiņa ir...",
        a1: "1. Pastāvīgā datora atmiņa, kurā glabājas datora darbībai svarīga informācija, kura nekad nemainās",
        a2: "2. Vieta uz cietā diska, kur īslaicīgi uzglabā darbam nepieciešamos datus un pēc vajadzības ievieto RAM",
        a3: "3. Bieži lietojama datu glabātuve, kas tieši saistīta ar procesoru",
        a4: "4. ROM paveids, kas datoram ieslēdzoties nodrošina saikni starp visām datora sastāvdaļām",
        a: 2
    },
    {
        q: "Kādu ievadiekārtu izmanto, lai datorā ievadītu tekstu no papīra vai kādas citas virsmas?",
        a1: "1. Printeri",
        a2: "2. Ploteri",
        a3: "3. Telpisko manipulatoru",
        a4: "4. Skeneri",
        a: 4
    },
    {
        q: "Kas drukāšanas laikā tiek uzklāts uz lāzerprintera foto veltņa?",
        a1: "1. Tinte",
        a2: "2. Papīrs",
        a3: "3. Toneris",
        a4: "4. Gumija",
        a: 3
    },
    {
        q: "Procesoru arhitektūra, kura paredz saisināto komandu kopumu, ir…",
        a1: "1. RISC",
        a2: "2. CISC",
        a3: "3. WLIW",
        a4: "4. MISC",
        a: 1
    },
    {
        q: "Ko datoru uzbūvē apzīmē ar burtiem SSHD?",
        a1: "1. Videosistēmas veidu",
        a2: "2. Diskešu nolasīšanas iekārtu",
        a3: "3. Hibrīddisku",
        a4: "4. Operatīvo atmiņu",
        a: 3
    },
    //61 - 70
    {
        q: "Kāda kopne nevar pārraidīt skaņu?",
        a1: "1. USB",
        a2: "2. VGA",
        a3: "3. HDMI",
        a4: "4. Bluetooth",
        a: 2
    },
    {
        q: "Kuras ierīces mēdz apvienot vienā?",
        a1: "1. Kopētāju, printeri, tastatūru",
        a2: "2. Skeneri, kopētāju, peli",
        a3: "3. Skeneri, printeri, kopētāju",
        a4: "4. Skeneri, monitoru, printeri",
        a: 3
    },
    {
        q: "Kā sauc skeneri ar caurspīdīgu virsmu, uz kuras novieto skenējamo dokumentu, bet skenēšanas mehānisms pārvietojas zem šīs virsmas?",
        a1: "1. Rokas skeneris",
        a2: "2. Lappadeves skeneris",
        a3: "3. Planšetes skeneris",
        a4: "4. Veltņskeneris ",
        a: 3
    },
    {
        q: "Kādu tehnoloģiju izmanto tintes printeros, lai paātrinātu izdruku?",
        a1: "1. Pjezotehnoloģiju",
        a2: "2. Burbuļtehnoloģiju",
        a3: "3. Tintes uzsildīšanu",
        a4: "4. Papīra tonēšanu",
        a: 1
    },
    {
        q: "Kādas sastavdaļas ir procesoram (CPU)? ",
        a1: "1. CMOS, brīvpieejas atmiņa",
        a2: "2. Aritmētiski loģiskā ierīce, vadības ierīce",
        a3: "3. Video atmiņa, brīvpieejas atmiņa",
        a4: "4. Aritmētiski loģiskā ierīce, CMOS",
        a: 2
    },
    {
        q: "Kas neiekļaujas iekšējo atmiņu grupā?",
        a1: "1. Lasāmatmiņa (ROM)",
        a2: "2. Brīvpieejas atmiņa (RAM)",
        a3: "3. Cietais disks (HDD)",
        a4: "4. Starpatmiņa (CACHE)",
        a: 3
    },
    {
        q: "Procesora taktsātrums nosaka...",
        a1: "1. Adresējamās operatīvās atmiņas apjomu",
        a2: "2. Vienlaikus nododamo datu apjomu",
        a3: "3. Apstrādājamo datu apjomu",
        a4: "4. Procesora ātrdarbību",
        a: 4
    },
    {
        q: "Kura procesora sastāvdaļa atkodē no atmiņas saņemtās komandas un formē to izpildei nepieciešamos vadības signālus?",
        a1: "1. Aritmētiski loģiskā ierīce",
        a2: "2. Reģistru bloks",
        a3: "3. Vadības ierīce",
        a4: "4. Kešatmiņa",
        a: 3
    },
    {
        q: "Kura procesora sastāvdaļa tiek izmantota komandu, datu un starprezultātu glabāšanai?",
        a1: "1. Aritmētiski loģiskā ierīce",
        a2: "2. Reģistru bloks",
        a3: "3. Vadības ierīce",
        a4: "4. Kešatmiņa",
        a: 4
    },
    {
        q: "Kura procesora sastāvdaļa izpilda aritmētiskās, loģiskās un citas datu apstrādes operācijas?",
        a1: "1. Aritmētiski loģiskā ierīce",
        a2: "2. Reģistru bloks",
        a3: "3. Vadības ierīce",
        a4: "4. Kešatmiņa",
        a: 1
    },
    //71 - 80
    {
        q: "Kura no uzskaitītajām ierīcēm ir tīkla pasīvā komponente?",
        a1: "1. Centrmezgls",
        a2: "2. Maršrutētājs",
        a3: "3. Komutators",
        a4: "4. Konektors",
        a: 4
    },
    {
        q: "Kurš printera veids ir dārgākais lietošanā?",
        a1: "1. Adatu",
        a2: "2. Tintes",
        a3: "3. Lāzeru",
        a4: "4. Termo",
        a: 2
    },
    {
        q: "Kura no dotajām ir ārējā perifērijas ierīce?",
        a1: "1. TV karte",
        a2: "2. Operatīvā atmiņa",
        a3: "3. Cietais disks",
        a4: "4. Kursorsvira",
        a: 4
    },
    {
        q: "Kura no uzskaitītajām ierīcēm ir ievadierīce?",
        a1: "1. Ploteris",
        a2: "2. Skandas",
        a3: "3. Grafiskā planšete",
        a4: "4. Lāzerprinteris",
        a: 3
    },
    {
        q: "Kura no uzskaitītajām atmiņām ir energoatkarīga?",
        a1: "1. Cietais disks",
        a2: "2. Zibatmiņa",
        a3: "3. Operatīvā atmiņa",
        a4: "4. Lasāmatmiņa",
        a: 3
    },
    {
        q: "Kā sauc ievadiekārtu karšu, shēmu u.c. attēlu ievadīšanai?",
        a1: "1. Digitaizers",
        a2: "2. Skeneris",
        a3: "3. Ploteris",
        a4: "4. Grafiskā planšete",
        a: 1
    },
    {
        q: "Kura no uzskaitītajām iekārtām datoru nodrošina ar elektrību, ja no tiešā enerģijas avota tā nepienāk?",
        a1: "1. Nepārtrauktais barošanas bloks",
        a2: "2. Barošanas bloks",
        a3: "3. Akumulators",
        a4: "4. Ģenerators",
        a: 1
    },
    {
        q: "Kas nodrošina sakarus ar mikroprocesoru un ārējām iekārtām, tādām kā klaviatūra un video karte?",
        a1: "1. RAM",
        a2: "2. ROM",
        a3: "3. BIOS",
        a4: "4. Cashe",
        a: 3
    },
    {
        q: "Kuras iekārtas pieslēgšanai datoram ir vajadzīga 15-kājiņu ligzda (kājiņas izvietotas 3 rindās)?",
        a1: "1. Tīkla kartes pieslēgšanai",
        a2: "2. VGA monitora pieslēgšanai",
        a3: `3. Printera ar "Centroniks" interfeisu pieslēgšanai`,
        a4: "4. Ārējā diskievada pieslēgšanai",
        a: 2
    },
    {
        q: "Kāda ir Full HD  standarta izšķirtspēja?",
        a1: "1. 1280x720 (16:9)",
        a2: "2. 1920x1080 (16:9)",
        a3: "3. 1024x768 (4:3)",
        a4: "4. 2048x1152 (16:9)",
        a: 2
    },
    //81 - 90
    {
        q: "Galda datora barošanas bloka kontakts, kas atbild par ieslēgšanu, ir...",
        a1: "1. Power Good",
        a2: "2. +3.3 V sense",
        a3: "3. Power on",
        a4: "4. +5 VSB",
        a: 3
    },
    {
        q: "Kādu krāsu neizmanto RGB standarts?",
        a1: "1. Sarkano",
        a2: "2. Dzelteno",
        a3: "3. Zaļo",
        a4: "4. Zilo",
        a: 2
    },
    {
        q: "Kura kopne ir vispiemērotākā digitālās videokameras pieslēgšanai datoram?",
        a1: "1. USB",
        a2: "2. SCSI",
        a3: "3. IEEE 1394",
        a4: "4. PCI-E",
        a: 3
    },
    {
        q: "Kuru skaņas sintēzes metodi izmanto skaņas kartēs Wave Table?",
        a1: "1. Muzikālo instrumentu skanējuma paraugus",
        a2: "2. Īpašus skaņas signālu ģeneratorus",
        a3: "3. Īpašu programmatūru",
        a4: "4. Ārējus skaņas avotus ",
        a: 1
    },
    {
        q: "Kādai saderībai izveidots Twain standarts?",
        a1: "1. Skenera un lietojumprogrammu saderībai",
        a2: "2. Printera un lietojumprogrammu saderībai",
        a3: "3. Modema un lietojumprogrammu saderībai",
        a4: "4. Monitora un lietojumprogrammu saderībai",
        a: 1
    },
    {
        q: "Kā sauc pakešu komutācijas tehnoloģiju ar augstu veiktspēju, kas balstīta uz datu nosūtīšanu fiksēta izmēra šūnās (cell)?",
        a1: "1. Sinhrona pārraide",
        a2: "2. Point-to-Point pieslēgums",
        a3: "3. Asinhrona pārraide ",
        a4: "4. Simetriskais pieslēgums",
        a: 3
    },
    {
        q: "Kā apzīmē ciparu saskarni monitora pieslēgšanai datoram?",
        a1: "1. DVI-D",
        a2: "2. D-Sub",
        a3: "3. USB",
        a4: "4. PCI-E ",
        a: 1
    },
    {
        q: "Kuru skaņu kartes portu izmanto spēļu konsoļu pieslēgšanai?",
        a1: "1. AUX",
        a2: "2. MIDI",
        a3: "3. SP-DIF",
        a4: "4. CD-IN ",
        a: 2
    },
    {
        q: "Kāda veida ekrānos izmanto pretestības sensoru?",
        a1: "1. LCD ekrānos",
        a2: "2. Skārienekrānos",
        a3: "3. Plazmas paneļos",
        a4: "4. CRT ekrānos",
        a: 2
    },
    {
        q: "Kāds ir USB 3.0 datu pārraides ātrums?",
        a1: "1. 480 Mb/s",
        a2: "2. 5 Gb/s",
        a3: "3. 600 MB/s",
        a4: "4. 5 GB/s",
        a: 2
    },
    //91 - 100
    {
        q: "Kādu datu pārraides maksimālo ātrumu spēj nodrošināt SATA Revision 3.0 kopne?",
        a1: "1. 6 Gbit/s",
        a2: "2. 8 Gbit/s",
        a3: "3. 3000 Mbit/s",
        a4: "4. 1280 Mbit/s",
        a: 1
    },
    {
        img: "./main/images/1.92.png",
        q: "Kā pareizi pieslēgt USB vadus pie mātes plātes kontaktiem?",
        a1: "1 - VCC, 2- Data -, 3 - Data+, 4 - GND",
        a2: "1 - VCC, 2- Data+, 3 - Data-, 4 - GND",
        a3: "1 - GND, 2- Data -, 3 - Data+, 4 - VCC",
        a4: "1 - VCC, 3- Data -, 5 - Data+, 7 - GND",
        a: 4
    },
    {
        q: "Kāds spraudnis jāizmanto, lai pieslēgtu ATX barošanas bloku mātes platei?",
        a1: "1. Viens saspraudnis ar 6 kontaktiem",
        a2: "2. Viens saspraudnis ar 20 vai 24 kontaktiem",
        a3: "3. Viens saspraudnis ar 5 kontaktiem",
        a4: "4. Viens saspraudnis ar 10 kontaktiem",
        a: 2
    },
    {
        q: "Lietotājs datoram pievienoja jaunu DVD-RW ierīci. Pirms instalācijas dators strādāja bez traucējumiem, bet pēc DVD-RW instalēšanas ierīce nestrādā. Kāda darbība jāveic lietotājam?",
        a1: "1. Jāatjauno BIOS uzstādījumus",
        a2: "2. Jāpievieno DVD-RW ierīce device manager",
        a3: "3. Jāpārbauda faila CONFIG SYS uzstādījumi",
        a4: "4. Jāpārbauda tiltslēgi DVD-RW ierīcē ",
        a: 4
    },
    {
        q: "Kāda ir atšķirība starp USB 2.0 un IEEE1394 portu?",
        a1: "1. USB kabelis ir lielāks",
        a2: "2. IEEE1394 ir ātrāks",
        a3: "3. USB atbalsta Plug and Play",
        a4: "4. IEEE1394 nodrošina karsto spraudnēšanu",
        a: 2
    },
    {
        q: "Kurš no portiem ir virknes ports?",
        a1: "1. ATA",
        a2: "2. SCSI",
        a3: "3. IEEE-1284",
        a4: "4. SATA",
        a: 4
    },
    {
        q: "Kāds ir maksimālais ierīču skaits, ko var pieslēgt pie USB 2.0 porta?",
        a1: "1. 64",
        a2: "2. 115",
        a3: "3. 127",
        a4: "4. 156",
        a: 3
    },
    {
        q: "Kāda veida barošanas bloka spraudņi paredzēti perifērijas ierīču pieslēgšanai?",
        a1: "1. Divi spraudņi - lielais un mazais (katrs ar pieciem kontaktiem)",
        a2: "2. Divi spraudņi - Molex un NLX (katrs ar sešie kontaktiem)",
        a3: "3. Divi spraudņi - lielais un mazais (katrs ar četriem kontaktiem)",
        a4: "4. Divi spraudņi - lielais SFX un mazais SFX (katrs ar četriem kontaktiem)",
        a: 3
    },
    {
        q: "Kādas funkcijas pilda signāls Power_Good? ",
        a1: "1. Signāls ļauj ieslēgt un izslēgt datoru ar tastatūras palīdzību",
        a2: "2. Testē barošanas bloku un, ja viss ir kārtībā, signāls par to paziņo sistēmai",
        a3: "3. Notiek barošanas bloka paštestēšana un, ja viss ir kārtībā, tiek padots dotais signāls",
        a4: "4. Tiek testēts dators, un, ja viss ir kārtībā, signāls par to paziņo sistēmai",
        a: 3
    },
    {
        q: "Kāda ligzda ir nepieciešama procesoram Intel Core i7-4960?",
        a1: "1. LGA 1156",
        a2: "2. Socket 478",
        a3: "3. LGA 775",
        a4: "4. LGA 2011",
        a: 4
    },
    //101 - 110
    {
        q: "Pie kuras kopnes pieslēdzot cieto disku, tiek nodrošināts lielāks datu pārraides ātrums?",
        a1: "1. IDE",
        a2: "2. SATA x",
        a3: "3. SAS",
        a4: "4. USB 2.0",
        a: 3
    },
    {
        q: "Kāda ir VGA standarta izšķirtspēja?",
        a1: "1. 256x256",
        a2: "2. 640x480",
        a3: "3. 756x480",
        a4: "4. 1024x756",
        a: 2
    },
    {
        q: "Kāds paņēmiens negaisa laikā pasargā datoru no pārsprieguma?",
        a1: "1. Datora ieslēgšana",
        a2: "2. Datora izslēgšana",
        a3: "3. Barošanas vadu atvienošana no datora",
        a4: "4. Datora atvienošana no LAN",
        a: 3
    },
    {
        q: "Kurus sistēmbloka mezglus savieno ar datu apmaiņas kabeli?",
        a1: "1. Barošanas bloku ar diska ierīcēm",
        a2: "2. Barošanas bloku ar mātes plati",
        a3: "3. Kontrolleri un diskiekārtas",
        a4: "4. Adaptera karti ar paralēlo printeri",
        a: 3
    },
    {
        q: "Datu pārraides ātruma mērvienība ir...",
        a1: "1. Kilobaits",
        a2: "2. Nanosekunde",
        a3: "3. Megahercs",
        a4: "4. Biti sekundē",
        a: 4
    },
    {
        q: "Kurš ir analoga pieslēguma veids?",
        a1: "1. DVI-D",
        a2: "2. HDMI",
        a3: "3. SUB-D",
        a4: "4. DisplayPort",
        a: 3
    },
    {
        q: "Kurš no portiem ir paralēlais ports?",
        a1: "1. USB",
        a2: "2. IEEE 1394",
        a3: "3. ATA",
        a4: "4. SATA",
        a: 3
    },
    {
        q: "Kādu datu pārraides maksimālo ātrumu spēj nodrošināt HDMI 2.0 kopne?",
        a1: "1. 6 Gbit/s",
        a2: "2. 18 Gbit/s",
        a3: "3. 3000 Mbit/s",
        a4: "4. 1280 Mbit/s",
        a: 2
    },
    {
        q: "Kura ierīce ieejas analogo signālu pārveido diskrētajā kodā?",
        a1: "1. Ciparanalogu pārveidotājs",
        a2: "2. Analogciparu pārveidotājs",
        a3: "3. Analogdiskrētais pārveidotājs",
        a4: "4. Signālu modulators",
        a: 2
    },
    {
        q: "Kāds ir abreviatūras RAM atšifrējums?",
        a1: "1. Random-only Memory",
        a2: "2. Read-only Memory",
        a3: "3. Read-only Access Memory",
        a4: "4. Random Access Memory",
        a: 4
    },
    //111 - 120
    {
        q: "Kā apzīmē datora cieto disku?",
        a1: "1. CD-ROM",
        a2: "2. HDD",
        a3: "3. FDD",
        a4: "4. GB",
        a: 2
    },
    {
        q: "Disku masīvs ar divām kontrolsummām ir...",
        a1: "1. RAID 0",
        a2: "2. RAID 1",
        a3: "3. RAID 5",
        a4: "4. RAID 6",
        a: 4
    },
    {
        q: "Kā atšifrējama abreviatūra FAT?",
        a1: "1. First Allocation Table",
        a2: "2. File Allowed Table",
        a3: "3. File Allocation Table",
        a4: "4. Format Allocation Table",
        a: 1
    },
    {
        q: "Datu virtualizācijas tehnoloģija, kurā dažus diskus apvieno ar vienu loģisko elementu, ir...",
        a1: "1. SATA",
        a2: "2. RAID",
        a3: "3. SMART",
        a4: "4. SCSI",
        a: 2
    },
    {
        q: "Kāds ir SAS kontroliera maksimālais datu pārraides ātrums?",
        a1: "1. 3 Gbps",
        a2: "2. 6 Gbps",
        a3: "3. 12 Gbps",
        a4: "4. 18 Gbps",
        a: 3
    },
    {
        q: "Kādas komandas izmanto SAS kontrolieris?",
        a1: "1. SCSI komandas",
        a2: "2. SATA komandas",
        a3: "3. PATA komandas",
        a4: "4. RAID komandas",
        a: 1
    },
    {
        q: "Kā sauc specializēto datoru, kurš izpilda servisu programmatūras nodrošinājumu?",
        a1: "1. Galda dators",
        a2: "2. Portatīvais dators",
        a3: "3. Serveris",
        a4: "4. Tievais klients",
        a: 3
    },
    {
        q: "Kādā(-os) diskā(-os) glabājas kontrolsumma RAID5 arhitektūrā?",
        a1: "1. Pirmajā diskā",
        a2: "2. Otrajā diskā",
        a3: "3. Pēdējā diskā",
        a4: "4. Visos diskos",
        a: 4
    },
    {
        q: "Kā sauc procesoru arhitektūru, kas dod iespēju izpildīt vairākus uzdevumus, par vienu takti palielinot izpildes ierīces?",
        a1: "1. RISC arhitektūra",
        a2: "2. MISC arhitektūra",
        a3: "3. Superskalārā arhitektūra",
        a4: "4. CISC arhitektūra",
        a: 3
    },
    {
        q: "Kura abreviatūra atbilst plazmas displejam?",
        a1: "1. LCD",
        a2: "2. CRT",
        a3: "3. PDP",
        a4: "4. LEP",
        a: 3
    },
    //121 - 130
    {
        q: "Kura abreviatūra atbilst nepārtrauktajam barošanas blokam?",
        a1: "1. UPS",
        a2: "2. PSU",
        a3: "3. USB",
        a4: "4. USP",
        a: 1
    },
    {
        q: "Kā darbojas MIMD procesora arhitektūra?",
        a1: "1. Viena komandu plūsma un viena datu plūsma",
        a2: "2. Daudzas komandu plūsmas un viena datu plūsma",
        a3: "3. Viena komandu plūsma un daudzas datu plūsmas",
        a4: "4. Daudzas komandu plūsmas un daudzas datu plūsmas",
        a: 4
    },
    {
        q: "Kādu datu pārraidi izmanto PCI-E slots?",
        a1: "1. Paralēlo",
        a2: "2. Virknes",
        a3: "3. Kombinēto",
        a4: "4. Asinhrono",
        a: 2
    },
    {
        q: "Kādu sakaru kanāla veidu izmanto PCI-E slots?",
        a1: "1. Gredzena",
        a2: "2. Zvaigznes",
        a3: "3. Bezvadu",
        a4: "4. Maģistrāles",
        a: 2
    },
    {
        q: "USB 3.0 kontakts, kurš atbild par elektrobarošanu, ir...",
        a1: "1. GND_D",
        a2: "2. StdA_SSRX+",
        a3: "3. VBUS",
        a4: "4. USB D+",
        a: 3
    },
    {
        q: "Mikroshēmu kopums uz mātes plates, kurš atbid par signālu sūtišanu starp mātes plates mezgliem, ir...",
        a1: "1. Procesora slots",
        a2: "2. ChipSet",
        a3: "3. PCI-E",
        a4: "4. USB HUB",
        a: 2
    },
    {
        q: "Kurš mātes plates mezgls atbild par USB porta, tastatūras, peles un datu nesēju darbību?",
        a1: "1. PCI-Express",
        a2: "2. USB HUB",
        a3: "3. I/O Controller Hub",
        a4: "4. RAM",
        a: 3
    },
    {
        q: "Kurš ir mātes plates mezgls, uz kura montējas procesors?",
        a1: "1. I/O Controller Hub",
        a2: "2. Socket",
        a3: `3. "Ziemeļu" tilts`,
        a4: "4. ChipSet",
        a: 2
    },
    {
        q: "Kā atšifrējama abreviatūra HDMI?",
        a1: "1. High Desktop Management Interface",
        a2: "2. High Direct Media Interface",
        a3: "3. High-Definition Multimedia Interface",
        a4: "4. High Desktop Multimedia Interface",
        a: 3
    },
    {
        q: "Kļūda vai bojājums programmatūrā vai aparatūrā, kas izraisa nepareizu programmas darbību, ir...",
        a1: "1. Bug",
        a2: "2. Bag",
        a3: "3. Faq",
        a4: "4. Brig",
        a: 1
    }
];
const OPERETAJSISTEMAS = [
    {
        //1 - 10
        q: "Ar kādu taustiņu kombināciju MS Windows vidē notiek iezīmēto failu dzēšana no cietā diska, nepārvietojot tos uz atkritni?",
        a1: "1. CTRL + DEL",
        a2: "2. ALT + DEL",
        a3: "3. CTRL + ALT + DEL",
        a4: "4. SHIFT + DEL",
        a: 4
    },
    {
        q: "Kādu programmu startē taustiņu kombinācija CTRL +ALT + DEL, ja dators nav pieslēgts domēnam?",
        a1: "1. Izdzēš iezīmēto failu, nepārvietojot to uz disketi",
        a2: "2. Startē programmu Windows explorer",
        a3: "3. Startē programmu Internet explorer",
        a4: "4. Startē programmu Task manager",
        a: 4
    },
    {
        q: "Ko dara ln komanda Linux OS?",
        a1: "1. Veido datnes kopiju",
        a2: "2. Veido tīkla savienojumu",
        a3: "3. Veido datnei otru nosaukumu",
        a4: "4. Nav tādas kommandas",
        a: 3
    },
    {
        q: "Kura MS Windows operētājsistēma sāka strādāt uz NTFS failu sistēmas?",
        a1: "1. MS-DOS 6.0",
        a2: "2. Windows 98",
        a3: "3. Windows Vista",
        a4: "4. Windows NT 3.1",
        a: 4
    },
    {
        q: "Pēc operētājsistēmas Windows instalācijas vispirms jāpārliecinās par...",
        a1: "1. Visu ierīču darbību",
        a2: "2. Interneta darbību",
        a3: "3. Ekrāna izšķirtspēju",
        a4: "4. Reģistru saturu",
        a: 1
    },
    {
        q: "Kāda ir Linux priekšrocība, salīdzinājumā ar Windows operētājsistēmām?",
        a1: "1. Bezmaksas, izejas teksta pieejamība",
        a2: "2. Drošība, kā arī teicams ātrums, kas ļauj strādāt ar liela apjoma datiem",
        a3: "3. Tā ir izmantojama lielos datortīklos",
        a4: "4. Tai ir lieliska grafika",
        a: 1
    },
    {
        q: "Kas ir Linux?",
        a1: "1. Vienlietotāja un daudzuzdevumu operētājsistēma",
        a2: "2. Daudzlietotāju un daudzuzdevumu operētājsistēma",
        a3: "3. Daudzlietotāju un vienuzdevuma operētājsistēma",
        a4: "4. Vienlietotāja un vienuzdevuma operētājsistēma",
        a: 2
    },
    {
        q: "Datorā ir instalēta Windows 7 32 bitu operētājsistēma. Cik liels operatīvās atmiņas apjoms tiks izmantots, ja datoram kopumā ir 16 GB operatīvās atmiņas?",
        a1: "1. 2 GB",
        a2: "2. 4 GB",
        a3: "3. 8 GB",
        a4: "4. 16 GB",
        a: 2
    },
    {
        q: "Operētājsistēma ir...",
        a1: "1. Galveno datora ierīču kopums",
        a2: "2. Zema līmeņa valodas programmēšanas sistēma",
        a3: "3. Programmatūras kopums, kas nodrošina visu datora ierīču darbību",
        a4: "4. Programmu kopums, kas tiek izmantots operācijām ar dokumentiem",
        a: 3
    },
    {
        q: "Kas ir Wild List kolekcija?",
        a1: "1. Vīrusu kolekcija",
        a2: "2. Vīrusu ļaunprātīgās darbības rezultātu datu bāze",
        a3: "3. Pretvīrusu programmu datu bāze",
        a4: "4. Pretvīrusu programmu testēšanas rezultātu datu bāze",
        a: 1
    },
    //11 - 20
    {
        q: "Kā var mainīt nospiesta tastatūras taustiņa atkārtošanās ātrumu?",
        a1: "1. Mainot tastatūras pieslēgšanas portu",
        a2: "2. Mainot attiecīgo parametru iekš BIOS",
        a3: "3. Mainot attiecīgo parametru operētājsistēmā",
        a4: "4. Mainot tastatūras taustiņus",
        a: 3
    },
    {
        q: "Pārslēgšanos no vienas programmas uz otru, nenobeidzot pirmās programmas izpildi, sauc par...",
        a1: "1. Otra līmeņa pārslēgšanu",
        a2: "2. Konteksta pārslēgšanu",
        a3: "3. Tiešo pārslēgšanu",
        a4: "4. Dubulto pārslēgšanu",
        a: 2
    },
    {
        q: "Sistēma, kas ļauj izmantot attāla datora datnes un perifērijas iekārtas tā, it kā tās atrastos lietotāja datorā, ir...",
        a1: "1. NTFS",
        a2: "2. FTP",
        a3: "3. NFS",
        a4: "4. PPP",
        a: 3
    },
    {
        q: "Vai uz viena datora var uzlikt vairākas operētājsistēmas pie pamatsāknēšanas (boot)?",
        a1: "1. Nē",
        a2: "2. Jā, ja ir Windows NT saimes OS",
        a3: "3. Jā, ja  tās ir UNIX saimes OS",
        a4: "4. Jā, ja kādas OS patatsaknēšanas menedžeris satur konfigurācijas failu",
        a: 4
    },
    {
        q: "Operētājsistēmas veids, kas imitē paralēlismu, izmantojot kontekstu pārslēgšanu un piešķirot procesiem vadību vienas laikšķēles robežās, ir...",
        a1: "1. Multisistēma",
        a2: "2. Daudzprocesoru sistēma",
        a3: "3. Dalīta laika sistēma",
        a4: "4. Daudzuzdevumu sistēma",
        a: 3
    },
    {
        q: "Laika intervāls, ko datora centrālais procesors izdala atsevišķa operētājsistēmas darba izpildei, ir...",
        a1: "1. Sekunde",
        a2: "2. Darba laiks",
        a3: "3. Laikšķēle",
        a4: "4. Stunda",
        a: 3
    },
    {
        q: "Mākslīga failu sistēma UNIX tipa operētājsistēmās, ko izmanto, lai piekļūtu kodolā esošajai informācijai par procesiem, ir...",
        a1: "1. PROCFS",
        a2: "2. EXT",
        a3: "3. FAT",
        a4: "4. NTFS",
        a: 1
    },
    {
        q: "Operētājsistēma, kas ar datorsistēmu vienlaicīgi ļauj  strādāt vairākiem lietotājiem, ir...",
        a1: "1. Iegultā operētājsistēma",
        a2: "2. Dalītā operētājsistēma",
        a3: "3. Vairāklietotāju operētājsistēma",
        a4: "4. Vairākuzdevumu operētājsistēma",
        a: 3
    },
    {
        q: "Operētājsistēma, kas ir kādas lielākas operētājsistēmas daļa un parasti ir paredzēta kādu specifisku darbību veikšanai, ir...",
        a1: "1. Iegultā operētājsistēma",
        a2: "2. Dalītā operētājsistēma",
        a3: "3. Vairāklietotāju operētājsistēma",
        a4: "4. Vairākuzdevumu operētājsistēma",
        a: 1
    },
    {
        q: "Kas ir datne?",
        a1: "1. Datu kopa, ko apstrādes procesā uzskata par vienotu veselumu",
        a2: "2. Standartizēta kopne datu apmaiņai starp procesoru un atmiņu",
        a3: "3. Informācijas mērvienība",
        a4: "4. Informācijas vienība",
        a: 1
    },
    //21 - 30
    {
        q: "Vai ir iespējams veikt formatizēšanu uz partīcijas, uz kuras strādā operētājsistēma?",
        a1: "1. Jā, ja tas ir ārējais disks",
        a2: "2. Nevar nekādā gadījumā",
        a3: "3. Nē, ja tas ir SSD disks",
        a4: "4. Jā, ja tas ir primārais disks",
        a: 2
    },
    {
        q: "Kas ir NTLDR?",
        a1: "1. Tīkla draiveris",
        a2: "2. Windows NT saimes pamatsaknēšanas menedžeris",
        a3: "3. Linux komanda darbam ar NTFS partīcijām",
        a4: "4. Video standarts",
        a: 2
    },
    {
        q: "Kādas tiesības būs datnei, ja izpilda komandu chmod 751 myfile?",
        a1: "1. Lietotājam -  rakstīšanas, Grupai - skatīšanas, Citiem - palaišanas",
        a2: "2. Lietotājam - skatīšanas+palaišanas, Grupai - skatīšanas, Citiem - palaišanas",
        a3: "3. Lietotājam -  rakstīšanas, Grupai - palaišanas, Citiem - skatīšanas",
        a4: "4. Lietotājam - visas, Grupai - skatīšanas+palaišanas, Citiem - palaišanas",
        a: 4
    },
    {
        q: "Kas notiks, ja izpildīs Linux komandu rm My.txt?",
        a1: "1. Datne tiks neatgriezeniski dzēsta ",
        a2: "2. Datne tiks pārvietota uz miskasti, no kuras to būs iespējams atjaunot",
        a3: "3. Datnes nosaukumam tiks dzēsts pirmais burts, kas OS norāda ka iespējams pa virsu rakstīt citu informāciju",
        a4: "4. Tiks izdots kļūdas paziņojums",
        a: 3
    },
    {
        q: "Kas ir datne .My.txt (Linux), ja ir šāda informācija:  -r--r---?",
        a1: "1. Datne ir mape (direktorija)",
        a2: "2. Datne ir apslēpta ",
        a3: "3. Datne ir palaižama",
        a4: "4. Datne ir saite uz citu datni",
        a: 4
    },
    {
        q: "Ar kādu komandu Linux termināla logā var iegūt informāciju par datnes tiesībām?",
        a1: "1. ls --h",
        a2: "2. ls -R",
        a3: "3. list ",
        a4: "4. ls -lR",
        a: 4
    },
    {
        q: "Kas ir datne man.bat (linux), ja ir šāda informācija:  drw-r---?",
        a1: "1. Datne ir mape (direktorija)",
        a2: "2. Datne ir apslēpta ",
        a3: "3. Datne ir palaižama",
        a4: "4. Datne ir saite uz citu datni",
        a: 1
    },
    {
        q: "Vai Windows operētājsistēmā var izveidot mapi Test.txt un datni test.txt vienā mapē?",
        a1: "1. Var, ja ievēro burtu lielumus",
        a2: "2. Var jebkurā gadījumā",
        a3: "3. Nevar nekādā gadījumā",
        a4: "4. Var,  ja mape ir slēpta",
        a: 4
    },
    {
        img: "./main/images/2.29.png",
        q: "Kas ir datne  nlo.txt? ",
        a1: "1. Datne ir mape (direktorija)",
        a2: "2. Datne ir apslēpta ",
        a3: "3. Datne ir palaižama",
        a4: "4. Datne ir saite uz citu datni",
        a: 4
    },
    {
        img: "./main/images/2.30.png",
        q: "Kas ir datne tavs.txt? ",
        a1: "1. Datne ir mape (direktorija)",
        a2: "2. Datne ir datnes mans.txt otrs nosaukums",
        a3: "3. Datne ir palaižama",
        a4: "4. Datne ir datnes nlo.txt otrs nosaukums",
        a: 2
    },
    //31 - 40
    {
        img: "./main/images/2.31.png",
        q: "Kas notiks, ja atvēts datni  nlo.txt, kad ir dzēsta datne mans.txt?",
        a1: "1. Tiks atspoguļots datnes tavs.txt saturs",
        a2: "2. Tiks atspoguļota tukša datne",
        a3: "3. Tiks izdots kļūdas paziņojums",
        a4: "4. Jāveic atlase atbilstoši vienam kritērijam, tad jānomaina kritēriji un atlase jāveic vēlreiz",
        a: 3
    },
    {
        q: "Ar kādu komandu Linux termināla logā var mainīt vienas datnes tiesības?",
        a1: "1. chown",
        a2: "2. passwd",
        a3: "3. cmod",
        a4: "4. umask",
        a: 3
    },
    {
        img: "./main/images/2.33.png",
        q: "Kas notiks, ja mainīs datnes mans.txt saturu?",
        a1: "1. Pārējās datnes nemainīsies",
        a2: "2. Nemainīsies tikai Test",
        a3: "3. Mainīsies nlo.txt",
        a4: "4. Mainīsies tavs.txt",
        a: 2
    },
    {
        img: "./main/images/2.34.png",
        q: "Kurš ir skripta palaišanas fails?",
        a1: "1. d",
        a2: "2. b.bat",
        a3: "3. c.sh",
        a4: "4. .My.txt , d",
        a: 4
    },
    {
        q: "Vai ir iespējams palaist strādājošu operētājsistēmu no usb zibatmiņas?",
        a1: "1. Var, ja tā ir tur iekopēta",
        a2: "2. Var, ja zibatmiņa ir saknējama",
        a3: "3. Nē, nevar",
        a4: "4. Windows OS nevar",
        a: 2
    },
    {
        q: "Ja lietotājs Windows operētājsistēmā noslēpis mapi no citiem lietotājiem, vai šai mapei kāds lietotājs var piekļūt?",
        a1: "1. Neviens cits nevar piekļūt",
        a2: "2. Var piekļūt lietotāja norādītās grupas lietotāji",
        a3: "3. Var piekļūt Power user grupas lietotāji",
        a4: "4. Var piekļūt Administrators grupas lietotāji",
        a: 3
    },
    {
        q: "Ar kādu komandu Windows DOS logā var iegūt informāciju par konkrētu datni?",
        a1: "1. DIR",
        a2: "2. LIST",
        a3: "3. ATTRIB",
        a4: "4. INFO",
        a: 3
    },
    {
        q: "Kas notiek ar Window OS datnes tiesībām, ja to iekopē citā partīcijā?",
        a1: "1. Mainās modificēšanas tiesības",
        a2: "2. Mainās lasīšanas/ modificēšanas tiesības",
        a3: "3. Mainās lasīšanas tiesības",
        a4: "4. Mainās lasīšanas/ modificēšanas /dzēšanas tiesības",
        a: 2
    },
    {
        q: "Kas notiek ar šifrētu datni, ja to iekopē citā partīcijā?",
        a1: "1. Datne šifrēšanu patur",
        a2: "2. Datne šifrēšanu zaudē",
        a3: "3. Šifrēšanu zaudē, ja kopē kā administrators",
        a4: "4. Šifrēšanu nezaudē ja kopē uz NTFS partīciju",
        a: 3
    },
    {
        img: "./main/images/2.40.png",
        q: "Vai šādu datni var mainī un pēc tam saglabāt?",
        a1: "1. Var, bez problēmām",
        a2: "2. Nevar",
        a3: "3. Var, ja maina datnes nosaukumu",
        a4: "4. Var, ja datne atrodas uz ārējā diska",
        a: 3
    },
    //41 - 50
    {
        q: "Kāda failu sistēma tiek izmantota kompaktdiskos?",
        a1: "1. UDF",
        a2: "2. FAT32",
        a3: "3. NTFS",
        a4: "4. EXT2",
        a: 1
    },
    {
        q: "Kāds mērķis ir cietā diska formatēšanai?",
        a1: "1. Atjaunot bojāto informāciju",
        a2: "2. Dzēst konkrētu datni",
        a3: "3. Sagatavot cieto disku informācijas uzglabāšanai",
        a4: "4. Saspiest informāciju, lai atbrīvotu vietu uz diska",
        a: 3
    },
    {
        q: "Kā sauc iebūvēto web serveri Windows operētājsistēmā?",
        a1: "1. IIS",
        a2: "2. Apache",
        a3: "3. OmniHTTPd",
        a4: "4. TomCat",
        a: 2
    },
    {
        q: "Kura operētājsistēma nav firmas Microsoft izstrādājums?",
        a1: "1. DOS",
        a2: "2. Windows 3.11",
        a3: "3. GNU/Linux",
        a4: "4. Windows XP",
        a: 3
    },
    {
        q: "Cik lielus klasterus atbalsta failu sistēma NTFS?",
        a1: "1. 1,44 MB - 650 MB",
        a2: "2. 512 B - 64 KB",
        a3: "3. 256 B - 32 KB",
        a4: "4. 128 B - 16 KB ",
        a: 2
    },
    {
        q: "Kāds ir cietā diska sektora apjoms?",
        a1: "1. 512 baiti ",
        a2: "2. 128 baiti ",
        a3: "3. 256 baiti ",
        a4: "4. 1024 baiti",
        a: 1
    },
    {
        q: "Kura bija pirmā operētājsistēma, kas jau no radīšanas sākuma tika būvēta ar grafisko saskarni?",
        a1: "1. MS-DOS",
        a2: "2. Windows",
        a3: "3. Linux",
        a4: "4. MAC OS",
        a: 4
    },
    {
        q: "Kura no dotajām nav Microsoft izstrādāta failu sistēma?",
        a1: "1. NTFS",
        a2: "2. FAT32",
        a3: "3. exFAT",
        a4: "4. Ext4",
        a: 4
    },
    {
        q: "Kāds ir e-pasta user-name@lvt.lv domēna vārds? ",
        a1: "1. user",
        a2: "2. lvt.lv",
        a3: "3. du",
        a4: "4. user-name",
        a: 2
    },
    {
        q: "Kā sauc programmu, kas nodrošina operētājsistēmas sadarbību ar kādu ierīci?",
        a1: "1. Draiveris",
        a2: "2. Translators",
        a3: "3. Interpretators",
        a4: "4. Kompilators",
        a: 1
    },
    //51 - 60
    {
        q: "Kas ir Pagefile.sys?",
        a1: "1. Windows datne RAM kopijai miega režīmam",
        a2: "2. Diska ierakstīšanas draiveris",
        a3: "3. Iemidzināšanas režīma draiveris",
        a4: "4. RAM virtuālā atmiņa no cietā diska",
        a: 4
    },
    {
        q: "Kas ir hiberfil.sys?",
        a1: "1. Windows datne RAM kopijai miega režīmam ",
        a2: "2. Diska ierakstīšanas draiveris",
        a3: "3. Iemidzināšanas režīma draiveris",
        a4: "4. RAM virtuālā atmiņa no cietā diska",
        a: 1
    },
    {
        q: "Kas ir SWAP?",
        a1: "1. Maiņatmiņas pārticija",
        a2: "2. Linux sistēmas pārtīcija",
        a3: "3. Windows backup partīcija",
        a4: "4. Boot partīcija",
        a: 1
    },
    {
        q: "Minimālais ieteicamais partīciju skaits, uz kurām var uzlikt Ubuntu, ir…",
        a1: "1. 3",
        a2: "2. 2",
        a3: "3. 1",
        a4: "4. 4",
        a: 2
    },
    {
        q: "Kuri ir Windows pakešfailu paplašinājumi?",
        a1: "1. *.exe, *.com",
        a2: "2. *.zip, *.rar, *.7z",
        a3: "3. *.cmd, *.bat",
        a4: "4. *.sh,",
        a: 3
    },
    {
        q: "Ko izdos šī komanda: server@http:/home$pwd ?",
        a1: "1. Pieprasīs paroli",
        a2: "2. Sūtīs e-pastu",
        a3: "3. Izvadīs atrašanās mapi",
        a4: "4. Izvadīs sistēmas procesu sarakstu",
        a: 3
    },
    {
        q: "Ja Windows lietotājs User  ir Administrator un Power Users grupā, tad viņam ir…",
        a1: "1. Lietotāja tiesības",
        a2: "2. Administratora tiesības",
        a3: "3. Power User tiesības",
        a4: "4. Summārās tiesības",
        a: 4
    },
    {
        q: `Kura operētājsistēma tiks palaista pirmā, ja BOOT.INI datnes saturs ir:
        [boot loader]
        default=c:\linux.bin
        [operating systems]
        multi(0)disk(0)rdisk(0)partition(1)\WINDOWS="Windows XP" /noexecute=optin /fastdetect
        c:\lilo.bin="Debian Ubuntu"
        d:\linux.bin="Knoppix"`,
        a1: "1. Debian Ubuntu",
        a2: "2. Windows XP",
        a3: "3. Neviena",
        a4: "4. Knoppix",
        a: 3
    },
    {
        q: "Kas ir LILO?",
        a1: "1. Lietotne",
        a2: "2. Draiveris",
        a3: "3. Saknēšanas menedžeris",
        a4: "4. Grafiskā interfeisa standarts",
        a: 3
    },
    {
        q: `Windows sistēmas process, kurš atbild par struktūras "klients-serveris" darbību, ir…`,
        a1: "1. alg.exe",
        a2: "2. explorer.exe",
        a3: "3. csrss.exe",
        a4: "4. dwm.exe",
        a: 3
    },
    //61 - 70
    {
        q: "Ko paredz papildinošā (incremental) rezerves kopēšanas stratēģija?",
        a1: "1. Regulāri tiek veikta visu datu rezerves kopēšana",
        a2: "2. Tiek veikta tikai jaunizveidoto datņu rezerves kopēšana",
        a3: "3. Tiek jautāts lietotājam, kādus datus kopēt",
        a4: "4. Esošajā rezerves kopijā tiek ievietoti mainītie un jaunie dati ",
        a: 4
    },
    {
        q: "Par kādām failu vadīšanas darbībām parasti nav atbildīga OS?",
        a1: "1. Failu izveidošanu un dzēšanu",
        a2: "2. Direktoriju izveidošanu un dzēšanu",
        a3: "3. Failu arhivēšanu",
        a4: "4. Datu dublēšanu uz datu nesēju ",
        a: 3
    },
    {
        q: "Kādas funkcijas pilda Windows reģistri?",
        a1: "1. Apkopo informāciju par datora stāvokli",
        a2: "2. Šķiro informāciju par programmām",
        a3: "3. Pārsūta informāciju par datora stāvokli",
        a4: "4. Glabā informāciju par datora stāvokli  ",
        a: 4
    },
    {
        q: "Kas ir draiveris (dzinis)?",
        a1: "1. Programma",
        a2: "2. Mikroshēma",
        a3: "3. Datu bāze",
        a4: "4. Ierīce",
        a: 1
    },
    {
        q: "Ar kuras komandas palīdzību cieto disku var sadalīt loģiskos diskos?",
        a1: "1. FORMAT",
        a2: "2. FDISK",
        a3: "3. SMARTDRV",
        a4: "4. HIMEM",
        a: 2
    },
    {
        q: "Kā sauc daļēju rezerves kopēšanas stratēģiju, kura rezerves kopēšanas procesā noņem failiem arhīva atribūtu?",
        a1: "1. Normal",
        a2: "2. Copy",
        a3: "3. Incremental",
        a4: "4. Differential",
        a: 3
    },
    {
        q: "Sāknēšanas programma, kas ielādē operētājsistēmas ielādes programmas operatīvajā atmiņā, ir",
        a1: "1. Interrupt 19 Disk Prives",
        a2: "2. Primarry Bootstrap Loader",
        a3: "3. Mater Boot Record",
        a4: "4. NTLDR",
        a: 2
    },
    {
        q: "Kāda Linux komanda uz ekrāna izvada sistēmas adresi un nosaukumu?",
        a1: "1. DNS hostname",
        a2: "2. Host",
        a3: "3. Hostname",
        a4: "4. Ping",
        a: 2
    },
    {
        q: `Kuru no operētājsistēmas procesiem var nosaukt par „daemon”?`,
        a1: "1. Procesu, kas visu laiku atrodas operatīvajā atmiņā",
        a2: "2. Procesu, kurš ticis ielādēts ar ftpd, httpd",
        a3: `3. Procesu, kam pēdējais nosaukuma burts ir „d”`,
        a4: "4. Ar termināli nesaistītu procesu, kurš ielādējas fona režīmā no init",
        a: 4
    },
    {
        q: "Ar kādu komandu Linux var uzsākt citas programmas izpildi noteiktā laikā, noteiktā dienā?",
        a1: "1. Crond",
        a2: "2. At [parametri]",
        a3: "3. Init",
        a4: "4. At allow ",
        a: 2
    },
    //71 - 80
    {
        q: "Drošības līmenim B3 operētājsistēmām atbilst…",
        a1: "1. Nepieciešamība atdalīt lietotāju no datiem",
        a2: "2. Vadāma pieeja sistēmai",
        a3: "3. Obligāta lietotāja autentifikācija un reģistrēšana sistēmā",
        a4: "4. Pastāvīga lietotāja darbību un sistēmas notikumu izsekošana ",
        a: 3
    },
    {
        q: "Kādas komandas domātas komandu izpildei uz attālinātas tīkla mašīnas?",
        a1: "1. Ftp",
        a2: "2. Rcp, rsh, rstart",
        a3: `3. Komandas, kurām nosaukumā sākumā ir burts „r”`,
        a4: "4. Share -F rfs, net send",
        a: 2
    },
    {
        q: "Windows sistēmas process, kurš atbild par lietotāju seansa palaišanu, ir...",
        a1: "smss.exe",
        a2: "explorer.exe",
        a3: "services.exe",
        a4: "spoolsv.exe",
        a: 1
    },
    {
        q: "Kā tiek apzīmēts saknes katalogs Linux distributīvā?",
        a1: `1. &#x5c;`,
        a2: "2. #",
        a3: "3. /",
        a4: "4. @",
        a: 3
    },
    {
        q: "Kura MS DOS komanda ļauj apskatīt faila saturu?",
        a1: "1. REN",
        a2: "2. TYPE",
        a3: "3. DIR",
        a4: "4. CD",
        a: 2
    },
    {
        q: "Kad beidzās Windows XP tehniskais atbalsts?",
        a1: "1. 08.05.2014",
        a2: "2. 01.04.2014",
        a3: "3. 01.08.2014",
        a4: "4. 08.04.2014",
        a: 4
    },
    {
        q: "Kā kodēšanai ir paredzētas ASCII kodu tabulas?",
        a1: "1. Simbolu kodēšanai ",
        a2: "2. Ciparu kodēšanai ",
        a3: "3. Zīmju kodēšanai",
        a4: "4. Burtu kodēšanai",
        a: 1
    },
    {
        q: "Kāda tastatūras kombinācija ļauj aizvērt pašreizējo cilni internet pārlūkprogrammā?",
        a1: "1. Ctrl+W",
        a2: "2. Ctrl+T",
        a3: "3. Ctrl+C",
        a4: "4. Ctrl+Shift+Tab",
        a: 1
    },
    {
        q: "Operētājsistēmas galvenā, noteicošā daļa, kura pārvalda aparātu līdzekļus un programmu izpildi, ir…",
        a1: "1. Kodols",
        a2: "2. Failu struktūra",
        a3: "3. Komandu apvalks",
        a4: "4. Utilītas",
        a: 1
    },
    {
        q: "Programma, kas organizē lietotāja mijiedarbību ar datoru, ir... ",
        a1: "1. Kodols",
        a2: "2. Failu struktūra",
        a3: "3. Komandu apvalks",
        a4: "4. Utilītas",
        a: 3
    },
    //81 - 90
    {
        q: "Programma, kas ir izpildāma personīgajā virtuālajā adrešu izplatījumā, ir…",
        a1: "1. Komanda",
        a2: "2. Ieejas/izejas mehānisms",
        a3: "3. Process",
        a4: "4. Lietojumprogramma",
        a: 3
    },
    {
        q: "Kāds arhivācijas parametrs nosaka starpību starp ieejošas un izejošas datu plūsmu apjomiem?",
        a1: "1. Pakāpe",
        a2: "2. Ātrums",
        a3: "3. Kvalitāte",
        a4: "4. Algoritms",
        a: 1
    },
    {
        q: "Reglaments, kas nosaka organizācijas un datu glabāšanas veidu uz informācijas nesējiem, ir...",
        a1: "1. Mapes",
        a2: "2. Loģiskais disks",
        a3: "3. Failu sistēma",
        a4: "4. Draiveri (dziņi)",
        a: 3
    },
    {
        q: "Kā sauc datus, kurus lietotājs var pievienot elektroniskajiem dokumentiem, lai saņēmējs būtu pārliecināts par ziņojuma sūtītāja autentiskumu, kā arī nepieļautu to viltošanu?",
        a1: "1. Ciparsertifikāts (digitālais sertifikāts)",
        a2: "2. Šifrēšanas atslēga",
        a3: "3. Lietotāja identifikators",
        a4: "4. Ciparparaksts (elektroniskais paraksts)",
        a: 4
    },
    {
        q: "Kura ir digitālo drošības sertifikātu grupa?",
        a1: "1. FireWall",
        a2: "2. SSL",
        a3: "3. HTTP",
        a4: "4. Antivīrusu programmatūra",
        a: 2
    },
    {
        q: "Sertifikāta statusa pārbaudes standarta mehānisms ir...",
        a1: "1. AI",
        a2: "2. CA",
        a3: "3. CRL",
        a4: "4. MBR",
        a: 3
    },
    {
        q: "Datorprogramma vai programmu kopums, kas nodrošina klienta programmu pieprasījumu apstrādi, ir...",
        a1: "1. Operētājsistēma",
        a2: "2. Serveris",
        a3: "3. Utilītas",
        a4: "4. Lietojumprogramma",
        a: 2
    },
    {
        q: "Operētājsistēmas doto parametru uzstadīšana hierarhiski uzbūvētā datu bāzē ir...",
        a1: "1. MBR",
        a2: "2. Sistēmas mapes",
        a3: "3. Reģistrs",
        a4: "4. Failu sistēma",
        a: 3
    },
    {
        q: "Failu glabāšanas sistēma uz iegaumējošajām ierīcēm ir..",
        a1: "1. Kodols",
        a2: "2. Failu struktūra",
        a3: "3. Komandu apvalks",
        a4: "4. Utilītas",
        a: 2
    },
    {
        q: "Atsevišķas programmas, kuras izpilda dienestu funkcijas, ir...",
        a1: "1. Kodols",
        a2: "2. Failu struktūra",
        a3: "3. Komandu apvalks",
        a4: "4. Utilītas",
        a: 4
    },
    //91 - 100
    {
        q: "Ko nosaka ar proaktīvo testēšanu?",
        a1: "1. Antivīrusu programmu ātrdarbību un to darbībai nepieciešamos datora resursus",
        a2: "2. Antivīrusu programmu spēju reaģēt uz jauniem, tām nepazīstamiem vīrusiem",
        a3: "3. Antivīrusu programmu savietojamību ar konkrēta datora konfigurāciju",
        a4: "4. Antivīrusu programmu spēju reaģēt uz jau zināmajiem vīrusiem",
        a: 2
    },
    {
        q: "Kas glabājas failā autoexec.bat?",
        a1: "1. Informācija par MS-DOS",
        a2: "2. MS-DOS komandas",
        a3: "3. Komandas, kurām ir jāizpildās katru reizi MS-DOS sākotnējās ielādes laikā",
        a4: "4. Komandas, kuras satur informāciju  par MS-DOS saistībā ar citām komandām",
        a: 3
    },
    {
        q: "Windows sistēmas process, kas atbild par darba virsmas un izvēlnes attēlošanu, kā arī par OS navigāciju ir...",
        a1: "1. alg.exe",
        a2: "2. csrss.exe",
        a3: "3. issch.exe",
        a4: "4. explorer.exe",
        a: 4
    },
    {
        q: "Kā atšifrējama abreviatūra MBR?",
        a1: "1. Microsoft Boot Record",
        a2: "2. Microsoft Both Record",
        a3: "3. Master Boot Record",
        a4: "4. Master Both Record",
        a: 3
    },
    {
        q: "Kas operētājsistēmā ir dispečers?",
        a1: "1. Operētājsistēmas sastāvdaļa, kas glabā informāciju tās apstrādei",
        a2: "2. Operētājsistēmas sastāvdaļa, kas nepieciešama uzdevumu izpildīšanai",
        a3: "3. Operētājsistēmā ietilpstošā programma, kas izvieto darbus vai uzdevumus izpildīšanai",
        a4: "4. Operētājsistēmā ietilpstošā programma, kas glabā informāciju tās apstrādei",
        a: 3
    },
    {
        q: "Failu izvietojuma tabulas vajadzībām diska datu apgabali ir sadalīti klasteros. Kāds ir to lielums?",
        a1: "1. Katram klasteram ir savs garums",
        a2: "2. Klasteri ir vienāda garuma un satur vienādu, pēc kārtas ejošu sektoru skaitu",
        a3: "3. Katram klasteram ir savs garums, bet tie satur pēc kārtas ejošu sektoru skaitu",
        a4: "4. Klasteri nav vienāda garuma un nesatur vienādu, pēc kārtas ejošu sektoru skaitu",
        a: 2
    },
    {
        q: "Kādu informāciju satur ar MS Windows operētājsistēmau savietojamo ierīču saraksts (HCL)?",
        a1: "1. Informāciju par ierīcēm, kuras atbalsta MS Windows",
        a2: "2. Informāciju par testētajām ierīcēm, kas nefunkcionē",
        a3: "3. Firmu - ražotāju kontaktinformāciju",
        a4: "4. Datora komplektācijas ierīču sarakstu",
        a: 1
    },
    {
        q: "Kas ir datora hibernācija?",
        a1: "1. Datora izvadierīce",
        a2: "2. Datora mātes plates komponente",
        a3: "3. Datora operētājsistēmas pārinstalācija",
        a4: "4. Datora enerģijas taupīšanas stāvoklis",
        a: 4
    },
    {
        q: "Kādu programmēšanas valodu izmanto iOS mobilo aplikāciju izveidē?",
        a1: "1. Ruby",
        a2: "2. Java",
        a3: "3. HTML",
        a4: "4. Objective-C",
        a: 4
    },
    {
        q: "Īpašs datu tips, ko izmanto, lai sinhronizētu vairāku procesu, kas izmanto kopīgus resursus, vienlaicīgu norisi, ir…",
        a1: "1. Datu tips ar indeksu",
        a2: "2. Sinhronizēšanas datu tips",
        a3: "3. Semafors datu tips",
        a4: "4. Primārais datu tips",
        a: 3
    },
    //101 - 110
    {
        q: "Kuri ir izpildāmo failu paplašinājumi?",
        a1: "BAT, DOC un COM",
        a2: "COM, EXE un DOC",
        a3: "BAT, EXE un COM",
        a4: "EXE, COM un RUN",
        a: 3
    },
    {
        q: "Protokols, kas nodrošina klienta datora lietojumprogrammu ierakstīšanu servera datnēs un datņu nolasīšanu no tā, kā arī iespēju pieprasīt servera pakalpojumus datoru tīklā, ir...",
        a1: "1. RPC",
        a2: "2. SMB",
        a3: "3. TFTP",
        a4: "4. POP",
        a: 2
    },
    {
        q: "Operētājsistēma, kas izvietota visos datoru tīkla mezglos un kas nodrošina un saskaņo tīkla komponentu piekļuvi dalītiem resursiem, ir...",
        a1: "1. Tādas funkcijas nav nevienai operētājsistēmai",
        a2: "2. Dalītā operētājsistēma",
        a3: "3. Serveris",
        a4: "4. Centrālā operētājsistēma",
        a: 2
    },
    {
        q: "Kontroļu uzdevums, kas ir nepieciešams datorsistēmas ražotspējas salīdzinošo raksturojumu definēšanai, ir...",
        a1: "1. Install",
        a2: "2. Format",
        a3: "3. Benchmark",
        a4: "4. Configuring",
        a: 3
    },
    {
        q: "Mērvienība, kas ir izmantojama datoru ražotspējas mērījumam un norāda, cik operāciju ar peldošo komatu sekundē izpilda dotā aprēķināšanas sistēma, ir...",
        a1: "1. B/s",
        a2: "2. FLOPS",
        a3: "3. b/s",
        a4: "4. Hz",
        a: 2
    },
    {
        q: "Periodisko procesu biežuma mērvienība ir...",
        a1: "1. B/s",
        a2: "2. FLOPS",
        a3: "3. b/s",
        a4: "4. Hz",
        a: 4
    },
    {
        q: "Paplašināmais automatizācijas Microsoft līdzeklis, kas sastāv no apvalka ar komandu rindas interfeisu un skripta valodas, ir...",
        a1: "1. Reģistrs",
        a2: "2. Windows PowerShell",
        a3: "3. Komandrindas interpretatos",
        a4: "4. CMD",
        a: 2
    },
    {
        q: "DOS imitators un komandrindas interpretators Windows vidē ir...",
        a1: "1. Regedit",
        a2: "2. Notepad",
        a3: "3. CMD",
        a4: "4. Windows PowerShell",
        a: 3
    },
    {
        q: `Shell komanda darbam ar mapi "ProgramData" ir...`,
        a1: "1. Shell:dpapiKeys",
        a2: "2. Shell:Common Programs",
        a3: "3. Shell:Common Administrative Tools",
        a4: "4. Shell:Common AppData",
        a: 4
    },
    {
        q: `Shell komanda darbam ar mapi "Roaming" ir...`,
        a1: "1. Shell:dpapiKeys",
        a2: "2. Shell:AppData",
        a3: "3. Shell:Common AppData",
        a4: "4. Shell:Common Programs",
        a: 2
    },
    //111 - 120
    {
        q: `Komanda Windows komponenta "Component Services" atvēršanai ir...`,
        a1: "1. Dxdiag",
        a2: "2. Diskmgmt.msc",
        a3: "3. Dcomcnfg",
        a4: "4. Cleanmgr",
        a: 3
    },
    {
        q: `Komanda Windows komponenta "Disk Cleanup Utility" atvēršanai ir...`,
        a1: "1. Dcomcnfg",
        a2: "2. Cleanmgr",
        a3: "3. Dxdiag",
        a4: "4. Diskmgmt.msc",
        a: 2
    },
    {
        q: `Komanda Windows komponenta "Direct X Troubleshooter" atvēršanai ir...`,
        a1: "1. Cleanmgr",
        a2: "2. Dcomcnfg",
        a3: "3. Diskmgmt.msc",
        a4: "4. Dxdiag",
        a: 4
    },
    {
        q: `Komanda Windows komponenta "Disk Management" atvēršanai ir...`,
        a1: "1. Dxdiag",
        a2: "2. Cleanmgr",
        a3: "3. diskmgmt.msc",
        a4: "4.Dcomcnfg",
        a: 3
    },
    {
        q: `Komanda Windows komponenta "Performance Monitor" atvēršanai ir...`,
        a1: "1. Gpedit.msc",
        a2: "2. Lusrmgr.msc",
        a3: "3. Perfmon.msc",
        a4: "4. Ecpol.msc",
        a: 3
    },
    {
        q: `Komanda Windows komponenta "Local Users and Groups" atvēršanai ir...`,
        a1: "1. Lusrmgr.msc",
        a2: "2. Perfmon.msc",
        a3: "3. Secpol.msc",
        a4: "4. Gpedit.msc",
        a: 1
    },
    {
        q: "Programmas, kuras var lietot bez maksas, bet tikai noteiktu laiku, ir...",
        a1: "1. Komercprogrammas",
        a2: "2. Lietojumprogrammas",
        a3: "3. Brīvprogrammas",
        a4: "4. Izplatāmprogrammas",
        a: 4
    },
    {
        q: "Kādas datnes ir ar paplašinājumu .cdr?",
        a1: "1. Vektorgrafikas",
        a2: "2. Web",
        a3: "3. Konfigurācijas",
        a4: "4. Arhivētas",
        a: 1
    },
    {
        q: `Komanda Windows komponenta "Local Security Settingsr" atvēršanai ir...`,
        a1: "1. Perfmon.msc",
        a2: "2. Lusrmgr.msc",
        a3: "3. Secpol.msc",
        a4: "4. Gpedit.msc",
        a: 3
    },
    {
        q: `Komanda Windows komponenta "Group Policy Editor" atvēršanai ir...`,
        a1: "1. Perfmon.msc",
        a2: "2. Lusrmgr.msc",
        a3: "3. Gpedit.msc",
        a4: "4. Secpol.msc",
        a: 3
    },
    //121 - 130
    {
        q: "Kādu failu sistēmu visbiežāk izmanto Windows operētājsistēmās, kuras ir izstrādātas uz Windows NT bāzes? ",
        a1: "1. FAT16",
        a2: "2. FAT32",
        a3: "3. NTFS",
        a4: "4. EXT 2",
        a: 3
    },
    {
        q: "Kādu sistēmas čaulu (shell) izmanto Windows operētājsistēma?",
        a1: "1. Windows maker",
        a2: "2. Windows explorer",
        a3: "3. DOS shell",
        a4: "4. Norton Comander",
        a: 2
    },
    {
        q: "Kāds paplašinājums ir ar programmām dinamiski saistītām bibliotēkām operētājsistēmā Windows?",
        a1: "1. DLL",
        a2: "2. DAT",
        a3: "3. CAB",
        a4: "4. COM",
        a: 1
    },
    {
        q: "Ar ko MS DOS ārējās komandas atšķiras no iekšējām?",
        a1: "1. Ar operāciju secību",
        a2: "2. Ārējās komandas izpilda procesors COMMAND COM, bet iekšējās - atsevišķi sistēmas faili",
        a3: "3. Iekšējās komandas izpilda procesors COMMAND COM, bet ārējās - atsevišķi sistēmas faili",
        a4: "4. Ārējās komandas izpilda AUTOEXEC BAT, bet iekšējās - COMMAND COM ",
        a: 3
    },
    {
        q: "Kurš no dotajiem failiem ir MS DOS sistēmas konfigurācijas fails, kas nosaka datora darba parametrus?",
        a1: "1. COMMAND.COM",
        a2: "2. CONFIG.SYS",
        a3: "3. IO.SYS",
        a4: "4. WINDOWS.EXE",
        a: 2
    },
    {
        q: "Uz kādas failu sistēmas ir iespējams instalēt Windows 7?",
        a1: "1. UDF",
        a2: "2. EXT2",
        a3: "3. NTFS",
        a4: "4. HFS",
        a: 3
    },
    {
        q: "Kur atrodas ievada/izvada bāzes sistēma (BIOS)?",
        a1: "1. Brīvpiekļuves atmiņā (RAM)",
        a2: "2. Cietajā diskā",
        a3: "3. Uz CD-ROM",
        a4: "4. Lasāmatmiņā (ROM)",
        a: 4
    },
    {
        q: "No kādām divām pamatkomponentēm sastāv MS-DOS?",
        a1: "1. No ievades sistēmas un izvades sistēmas",
        a2: "2. No ievadizvades sistēmas un komandu procesora",
        a3: "3. No ievades sistēmas un komandu procesora",
        a4: "4. No izvades sistēmas un komandu procesora",
        a: 2
    },
    {
        q: "Kā atšifrējama abreviatūra FAT?",
        a1: "1. First Allocation Table",
        a2: "2. File Allowed Table",
        a3: "3. File Allocation Table",
        a4: "4. Format Allocation Table",
        a: 3
    },
    {
        q: "Kādā mapē glabājas sistēmas konfigurācijas datnes Linux distributīvā?",
        a1: "1. bin",
        a2: "2. mnt",
        a3: "3. home",
        a4: "4. etc",
        a: 4
    },
    //131 - 140
    {
        q: "Kā sauc jauno Windows 8 sākuma ekrāna interfeisu?",
        a1: "1. Slide interface",
        a2: "2. Swipe interface",
        a3: "3. Metro interface",
        a4: "4. Start interface",
        a: 3
    },
    {
        q: "Kura no dotajām komponentēm netiek uzskatīta par iebūvējamo?",
        a1: "1. SSD",
        a2: "2. RAM",
        a3: "3. Cache",
        a4: "4. USB",
        a: 3
    },
    {
        q: "Kā atšifrējama abreviatūra DMA?",
        a1: "1. Discret Mapping Administration",
        a2: "2. Daemon Monitor Access",
        a3: "3. Direct Memory Access",
        a4: "4. Domain Memory Ammunition",
        a: 3
    },
    {
        q: "Kuri ir atmiņas elementi SRAM mikroshēmā?",
        a1: "1. Kondensatori",
        a2: "2. Tranzistori",
        a3: "3. Rezistori",
        a4: "4. Diodes",
        a: 2
    },
    {
        q: "Kura datu uzglabāšanas ierīce nodrošina visātrāko pieeju datiem?",
        a1: "1. HDD",
        a2: "2. DVD-ROM",
        a3: "3. FDD",
        a4: "4. SSD",
        a: 4
    },
    {
        q: "Kādam nolūkam nepieciešama datne hiberfil.sys Windows operētājsistēmās?",
        a1: "1. Tā ir virtuālās atmiņas datne",
        a2: "2. Operētājsistēmas stāvokļa saglabāšanai hibernēšanas režīmā",
        a3: "3. Tā satur galveno operētājsistēmas kodu",
        a4: "4. Tā nodrošina operētājsistēmas veiksmīgu ieslēgšanos",
        a: 2
    },
    {
        q: "Kas no minētā nav operētājsistēma?",
        a1: "1. Microsoft Office",
        a2: "2. Kubuntu",
        a3: "3. CentOS",
        a4: "4. Ubuntu",
        a: 1
    },
    {
        q: "Kura no operētājsistēmām neatbalsta failu sistēmu NTFS?",
        a1: "1. MS DOS",
        a2: "2. Windows NT",
        a3: "3. Windows XP",
        a4: "4. Windows 2000",
        a: 1
    },
    {
        q: "Kas ir GNU GRUB?",
        a1: "1. Lietotne",
        a2: "2. Draiveris",
        a3: "3. Saknēšanas menedžeris",
        a4: "4. Grafiskā interfeisa standarts",
        a: 3
    },
    {
        q: "Ko dara BitLocker rīks opertētājsistēmā Windows 7?",
        a1: "1. Palīdz aizsargāt datnes un mapes, šifrējot disku",
        a2: "2. Skenē datnes un mapes, pārbaudot pret vīrusiem",
        a3: "3. Sakārto datnes un mapes cietajā diskā",
        a4: "4. Veido datnēm un mapēm rezerves kopijas",
        a: 1
    },
    //141 - 150
    {
        q: `Kurš apgalvojums par C:\Program Files\7-zip\7z.exe ir patiess?`,
        a1: "1. Datne Files\7-zip\7z.exe atrodas diska C mapē Program",
        a2: "2. Diska C mapē Program atrodas apakšmape Files\7-Zip",
        a3: "3. Datne Zip\7z.exe atrodas diska C mapē Program Files\7",
        a4: "4. Diskā C trodas mape Program Files ar apakšmapi 7-Zip",
        a: 2
    },
    {
        q: "Kuru failu sistēmu Windows 7 lieto kā galveno?",
        a1: "1. UFS",
        a2: "2. NTFS",
        a3: "3. FAT32",
        a4: "4. ext4 ",
        a: 2
    },
    {
        q: "Kurš no nosauktajiem nav Linux distributīvs?",
        a1: "1. UBUNTU",
        a2: "2. DEBIAN",
        a3: "3. FEDORA",
        a4: "4. FreeBSD",
        a: 4
    },
    {
        q: "Kura no dotajām ir Unix saimes operētājsistēma?",
        a1: "1. Mac OS",
        a2: "2. Solaris",
        a3: "3. Windows 7",
        a4: "4. Windows NT",
        a: 2
    },
    {
        q: "Kādas datnes ir ar paplašinājumu .htm?",
        a1: "1. Vektorgrafikas",
        a2: "2. Web",
        a3: "3. Konfigurācijas",
        a4: "4. Arhivētas",
        a: 2
    },
    {
        q: "Pie kuras kopnes pieslēdzot cieto disku tiek nodrošināts lielāks datu pārraides ātrums?",
        a1: "1. IDE",
        a2: "2. SAS",
        a3: "3. USB",
        a4: "4. SATA",
        a: 2
    },
    {
        q: "Kādas datnes ir ar paplašinājumu .zip?",
        a1: "1. Vektorgrafikas",
        a2: "2. Web",
        a3: "3. Konfigurācijas",
        a4: "4. Arhivētas",
        a: 4
    },
    {
        q: "Kas jāieraksta Excel formulas rindā, lai izvadītu divu vai vairāku šūnu saturu vienā šūnā?",
        a1: "1. AND",
        a2: "2. &",
        a3: "3. PLUS",
        a4: "4. +",
        a: 2
    },
    {
        q: "Kurš pilnais faila nosaukums uzrakstīts pareizi?",
        a1: "1. C;Work,Letter.docx",
        a2: "2. C:/Work/Letter.docx",
        a3: "3. C:\Work\Letter.docx",
        a4: "4. C:>\Work\Letter.docx",
        a: 3
    },
    {
        q: "Kādam nolūkam izmanto Apply komandpogu?",
        a1: "1. Lai aizvērtu dialoglogu ar visām tajā veiktajām izmaiņām",
        a2: "2. Lai atjaunotu visas noklusētās dialogloga elementu vērtības",
        a3: "3. Lai aplūkotu veiktās dialogloga elementu izmaiņas, neaizverot logu",
        a4: "4. Lai atceltu dialogloga elementu vērtības",
        a: 3
    },
    //151 - 160
    {
        q: "Kādus simbolus nevar lietot datnes nosaukumā?",
        a1: "1. Burtus no A līdz Z",
        a2: "2. * : / \ | < > ”",
        a3: "3. Jebkurus ciparus",
        a4: "4. ! @ # $ % ? ;",
        a: 2
    },
    {
        q: "Kurš apgalvojums par Master slide režīmu ir patiess?",
        a1: "1. Master Slide režīmā ievada visu prezentācijas tekstu",
        a2: "2. Master Slide režīmā sagatavo visas prezentācijas stilu",
        a3: "3. Master Slide režīmā obligāti jāuzrāda prezentācijā plānoto slīdu skaits",
        a4: "4. Master Slide režīmā nevar ievietot attēlus",
        a: 2
    },
    {
        q: "Ko MS PowerPoint programmā veic komanda Slide Show / Set Up Slide Show…?",
        a1: "1. Nodrošina, ka slīdi demonstrācijas laikā aizpilda visu ekrānu",
        a2: "2. Notiek slīdu demonstrācija, sākot ar pirmo",
        a3: "3. Rāda kādu no slīdu izlasēm, pēc programmas izvēles",
        a4: "3 Aktivizē dialoglogu demonstrācijas parametru iestatīšanai",
        a: 4
    },
    {
        q: "Kāds datu formāts MS Excel programmā attēlo valūtu?",
        a1: "1. General",
        a2: "2. Fraction",
        a3: "3. Currency",
        a4: "4. Percentage",
        a: 3
    },
    {
        q: `Šūnā A1 ievadīts teksts "Juris", bet šūnā B1 -  "Jānis". Kāds būs rezultāts šūnā C1, izmantojot
        formulu =AVERAGE(A1:B1)?`,
        a1: "1. #DIV/0!",
        a2: "2. 0",
        a3: "3. #NAME?",
        a4: "4. VALUE",
        a: 1
    },
    {
        q: "Kura no izteiksmēm būs šūnā,  formulu =$D$5+90 ar peli dublējot divas šūnas uz leju?",
        a1: "1. =$D$5+90",
        a2: "2. =$D$7+90",
        a3: "3. =$D$5+92",
        a4: "4. =$D$7+92",
        a: 3
    },
    {
        q: "MS Excel tabulas A kolonā ierakstīti 5 skaitļi. Kura ir pareizā summēšanas formula?",
        a1: "1. = A1+A2+A3+A4+A5",
        a2: "2. = sum(A1;a5)",
        a3: "3. = sum(A1a5)",
        a4: "4. A1+A2+A3+A4+A5",
        a: 1
    },
    {
        q: "MS Excel darblapā šūnā A1 ir formula =B1/B10. Kādu formulu iegūs, dublējot to uz A2 šūnu?",
        a1: "1. = B1/$B$10",
        a2: "2. = B2/B10",
        a3: "3. = B2/B11",
        a4: "4. = A1/B10",
        a: 3
    },
    {
        q: "Kura no šīm MS Excel  loģiskām funkcijām pārbauda, vai skaitlis šūnā A1 ir lielākais no 3 skaitļiem, kas ir šūnās A1, A2, A3?",
        a1: "1. =if(a1<a2; if(a1>a3; “jā”;0); 0)",
        a2: "2. =if(a1>a2; if(a1>a3; “jā”;0); 0)",
        a3: "3. =if(a1>a2; if(a3>a1; “jā”;0); 0)",
        a4: "4. =if(a1<a2; if(a3>a1; “jā”;0); 0)",
        a: 2
    },
    {
        q: "Kā aprēķināt vidējo aritmētisko no šūnu A1, A2, A3, A4 vērtībām?",
        a1: "1. = A1+A2+A3+A4/4",
        a2: "2. = average(A1:a4)",
        a3: "3. = sum(A1;a4)/4",
        a4: "4. (A1+A2+A3+A4)/4",
        a: 2
    },
    //161 - 170
    {
        q: "Kāds ir MS Excel formulas =round(4568,347; -2) rezultāts?",
        a1: "1. 4568",
        a2: "2. 4600",
        a3: "3. 4568,345",
        a4: "4. -45683472",
        a: 2
    },
    {
        q: "Ar kādu taustiņu kombināciju MS Word var pasvītrot tekstu?",
        a1: "1. Ctrl+B",
        a2: "2. Ctrl+I",
        a3: "3. Ctrl+U",
        a4: "4. Ctrl+A",
        a: 3
    },
    {
        q: "Lai  MS Word lietojumprogrammā izsauktu aizvietošanas (Replace) dialoglogu, jānospiež taustiņu kombinācija...",
        a1: "1. Alt+H",
        a2: "2. Ctrl+H",
        a3: "3. Shift+H",
        a4: "4. Ctrl+F",
        a: 3
    },
    {
        q: "Ar kuru taustiņu kombināciju var atlasīt visu dokumentu?",
        a1: "1. Print  Screen",
        a2: "2. Ctrl + A",
        a3: "3. Shift + A",
        a4: "4. Alt + A",
        a: 2
    },
    {
        q: "Kas notiks, Print loga opcijā (laukā) Pages uzrakstot 12-?",
        a1: "1. Varēs apskatīties no 1. līdz 12. lappusei",
        a2: "2. Tiks izdrukātas pirmās 12 (divpadsmit) lappuses",
        a3: "3. Dokuments tiks izdrukāts no 12. lappuses līdz dokumenta beigām",
        a4: "4. Tiks izdrukāta 12. lappuse",
        a: 3
    },
    {
        q: "Ar kuru MS Word komandu tabulā var apvienot vairākas šūnas vienā?",
        a1: "1. Split Cells",
        a2: "2. Wrap Text",
        a3: "3. Merge Cells",
        a4: "4. Split Table",
        a: 3
    },
    {
        q: "Kura komanda dublē formatējumu (noformējumu)?",
        a1: "1. Format Copy",
        a2: "2. Toolbars",
        a3: "3. Format Painter",
        a4: "4. Copy",
        a: 3
    },
    {
        q: "Kādam nolūkam MS Word dokumentā lieto stilus?",
        a1: "1. Lai pēc tam automātiski izveidotu satura rādītāju (Table of Contents)",
        a2: "2. Lai tabulām izmantotu automātisko noformēšanu (Auto Format)",
        a3: "3. Lai tekstā pārbaudītu pareizrakstības un stila kļūdas",
        a4: "4. Lai dokuments būtu noformēts izvēlētajā stilā",
        a: 1
    },
    {
        q: "Kādam nolūkam ir paredzēta vektorgrafka?",
        a1: "1. Lai kvalitatīvi pārveidotu attēlu",
        a2: "2. Lai zīmētu dažādus logo un shēmas",
        a3: "3. Lai kombinētu dažādus attēlus un fotogrāfijas",
        a4: "4. Lai mainītu attēlu izmērus, nezaudējot kvalitāti",
        a: 2
    },
    {
        q: "Kādai programmu grupai var pieskaitīt šādas lietotnes: Microsoft Word, Notepad, WordPad?",
        a1: "1. Tekstapstrādes",
        a2: "2. Datu arhivēšanas",
        a3: "3. Prezentāciju",
        a4: "4. Izklājlapas",
        a: 1
    }
];
const DATORTIKLI = [
    //1 - 10
    {
        q: "Kurš no dotajiem lielumiem raksturo datu pārraides ātrumu?",
        a1: "1. 100 MHz",
        a2: "2. 512 Kbps",
        a3: "3. 300 dpi",
        a4: "4. 36 pt",
        a: 2
    },
    {
        q: "Kāds datu pārraides vides vadības princips izmantots Ethernet tīklā?",
        a1: "1. Centralizētā vadība",
        a2: "2. Sacensību princips",
        a3: "3. Ar marķiera palīdzību",
        a4: "4. Token passing ",
        a: 2
    },
    {
        q: "Kādā datortīklu topoloģijā izmanto terminatoru?",
        a1: "1. Maģistrāles tīkla (bus network)",
        a2: "2. Zvaigžņtīkla (star network)",
        a3: "3. Gredzentīkla (ring network)",
        a4: "4. Tiešajā kabeļa savienojumā (PC-PC) ",
        a: 1
    },
    {
        q: "Ko apraksta IEEE 802.3 standarts?",
        a1: "1. Loģiskā posma vadības protokolu",
        a2: "2. Marķiermaģistrāles tīklus (Token Ring)",
        a3: "3. Šķiedru optikas tīklus",
        a4: "4. Ethernet tipa tīklus",
        a: 4
    },
    {
        q: "Kāds ir maksimālais datu pārraides ātrums, ko spēj nodrošināt 5. kategorijas UTP kabelis?",
        a1: "1. 10 Mbit/sec",
        a2: "2. 100 Mbit/sec",
        a3: "3. 1000 Mbit/sec",
        a4: "4. 16 Mbit/sec ",
        a: 3
    },
    {
        q: "Kāds ir neekranētā vītā pāra kabeļa apzīmējums angļu valodā?",
        a1: "1. UTP",
        a2: "2. STP",
        a3: "3. FTP",
        a4: "4. FDDI",
        a: 1
    },
    {
        q: "Ko nosaka parametrs 10 apzīmējumā 10Base5?",
        a1: "1. Ātrumu",
        a2: "2. Garumu",
        a3: "3. Pretestību",
        a4: "4. Portu skaitu",
        a: 1
    },
    {
        q: "Kādam kabelim tiek izmantots konektors RJ-45?",
        a1: "1. Vītā pāra kabelim",
        a2: "2. Optiskās šķiedras kabelim",
        a3: "3. Tievajam koaksiālajam kabelim",
        a4: "4. Resnajam koaksiālajam kabelim",
        a: 1
    },
    {
        q: "Kura nav datortīklu topoloģija?",
        a1: "1. Līnijas",
        a2: "2. Zvaigznes",
        a3: "3. Gredzena",
        a4: "4. Maģistrāles",
        a: 1
    },
    {
        q: "Kāds komponents nav vajadzīgs lokālā tīkla izveidošanai uz vīta pāra pamata?",
        a1: "1. UTP kabelis",
        a2: "2. Koncentrators",
        a3: "3. Savienotājs",
        a4: "4. Modems",
        a: 4
    },
    //11 - 20
    {
        q: "Kāds apzīmējums ir vītā pāra kabeļa savienotājam?",
        a1: "1. BNC",
        a2: "2. COM",
        a3: "3. RJ-45",
        a4: "4. RJ-11",
        a: 3
    },
    {
        q: "Kādu interfeisu neizmanto tīkla adaptera ievietošanai datorā?",
        a1: "1. ISA",
        a2: "2. PCI",
        a3: "3. EISA",
        a4: "4. LPT",
        a: 4
    },
    {
        q: "Kuri ir bezvadu tīkla standartu apzīmējumi?",
        a1: "1. ISO 9660, TCO 99",
        a2: "2. 802.11b, 801.11g, 802.11n",
        a3: "3. 10Base5, 10Base2, 10BaseT",
        a4: "4. IEEE 802.3, IEEE 802.5",
        a: 2
    },
    {
        q: "Kāds ir minimālais personālo datoru daudzums, kas nepieciešams, lai izveidotu pseidotīklu?",
        a1: "1. Divi",
        a2: "2. Trīs",
        a3: "3. Četri",
        a4: "4. Pieci",
        a: 1
    },
    {
        q: "Kāda datortīklu topoloģija ir Ethernet arhitektūras pamatā?",
        a1: "1. Stafetes nodošanas topoloģija",
        a2: "2. Zvaigžņveida topoloģija",
        a3: "3. Gredzenveida topoloģija",
        a4: "4. Kopnes topoloģija",
        a: 4
    },
    {
        q: "Kādu informāciju par tīklu satur apzīmējums 100Base-T?",
        a1: "1. Tīkla kabeļa maksimālais garums ir 100 pēdas un tajā izmantoti BNC tipa konektori",
        a2: "2. Tīkla datu pārraides maksimālais ātrums ir 100Mbit/s, un tajā ir izmantots neekranētā vītā pāra kabelis",
        a3: "3. Tīkla datu pārraides maksimālais ātrums ir 100MHz, un tajā izmantoti BNC tipa konektori",
        a4: "4. Tīkla kabeļa maksimālais garums ir 100 pēdas, un tajā izmantots neekranētā vītā pāra kabelis ",
        a: 2
    },
    {
        q: "Kāda tipa tīklā tiek izmantota marķiera nodošanas procedūra?",
        a1: "1. Ethernet",
        a2: "2. Optisko šķiedru tīklā",
        a3: "3. Vienranga tīklā",
        a4: "4. Token ring",
        a: 4
    },
    {
        q: "Kāds ir 10 Base-2 tīkla segmenta maksimālais garums bez atkārtotāju izmantošanas?",
        a1: "1. 15 metri",
        a2: "2. 185 metri",
        a3: "3. 500 metri",
        a4: "4. 1000 metri",
        a: 2
    },
    {
        q: "Kas ir tīkla topoloģija?",
        a1: "1. Tīkla abonentu savienošanas struktūra",
        a2: "2. Noteikumu kopums, kas nosaka informācijas pārraides kārtību",
        a3: "3. Tīkla pārraidāmās informācijas nesadalāmā vienība",
        a4: "4. Informācijas meklēšanas sistēma",
        a: 1
    },
    {
        q: "Cik vara vadu ir vītā pāra kabelī, kuru izmanto tīkla izveidei?",
        a1: "1. 4",
        a2: "2. 8",
        a3: "3. 9",
        a4: "4. 6",
        a: 2
    },
    //21 - 30
    {
        q: "Kā apzīmē tīklu, kas apvieno datorus, kuri atrodas relatīvi netālu cits no cita, parasti vienas vai vairāku blakus esošu ēku robežās?",
        a1: "1. GAN",
        a2: "2. MAN",
        a3: "3. WAN",
        a4: "4. LAN",
        a: 2
    },
    {
        q: "Windows serviss, kas atbild par piekļuvi internetam un ugunsmūra darbību, ir…",
        a1: "1. rundll32.exe",
        a2: "2. alg.exe",
        a3: "3. explorer.exe",
        a4: "4. lsass.exe",
        a: 2
    },
    {
        q: "Kāpēc UTP tīkla kabelim vadi ir savīti?",
        a1: "1. Lai mazinātu uztvertā elektromagnētiskā lauka ietekmi",
        a2: "2. Lai nodrošinātu vada izturību",
        a3: "3. Lai nodrošinātu pārraidi zemās temperatūrās",
        a4: "4. Lai palielinātu pārraides ātrumu",
        a: 1
    },
    {
        q: "Ar kuru valsti  Latvijai bija pirmais savienojums ar optisko kabeli?",
        a1: "1. Krieviju",
        a2: "2. Igauniju",
        a3: "3. Zviedriju",
        a4: "4. Lietuvu",
        a: 3
    },
    {
        q: "Kurš ir datņu pārsūtīšanas protokols?",
        a1: "1. FTP",
        a2: "2. HTML",
        a3: "3. PHP",
        a4: "4. URL",
        a: 1
    },
    {
        q: "Kas ir aizsargāta tīmekļa vietne?",
        a1: "1. Ar ugunsmūri aizsargāts organizācijas lokālais datortīkls",
        a2: "2. Tīmekļa vietne, kurai var piekļūt, ievadot lietotāja vārdu un paroli",
        a3: "3. Tīmekļa vietne, kurā var tikai apskatīt informāciju, bet nevar pievienot komentārus",
        a4: "4. Tīmekļa vietne, kurā jebkurš var apskatīt informāciju, bet komentārus var pievienot tikai reģistrētie lietotāji",
        a: 2
    },
    {
        q: "Kas ir globālais tīmeklis?",
        a1: "1. Datu pārraides tīkls, kas nodrošina datu pārraidi plašam abonentu lokam visā pasaulē",
        a2: "2. Interneta pakalpojumu kopums, kas nodrošina sarunu iespējas globālajā tīklā reālā laikā",
        a3: "3. Globāla hiperteksta sistēma, kas izmanto internetu kā informācijas transportēšanas mehānismu",
        a4: "4. Globāls datortīkls, kuram nav centralizētas vadības un īpašnieka",
        a: 3
    },
    {
        q: "Kas ir ugunsmūris (firewall)?",
        a1: "1. Datoru sistēmas nodrošinājums ar dublējošu barošanas avotu gadījumam, ja parastais barošanas avots tiek atslēgts",
        a2: "2. Forma, kurā jāievada lietotāja dati un parole, lai varētu veikt darbības ar datiem",
        a3: "3. Drošības mehānisms, ko izmanto, lai kontrolētu piekļuvi datoru sistēmai vai tīklam",
        a4: "4. Drošības sistēma, kas aizsargā lokālo tīklu no nesankcionētas interneta lietotāju piekļuves",
        a: 4
    },
    {
        q: "Kurš apgalvojums par tīmeklī bāzētas elektroniskā pasta sistēmas izmantošanu nav patiess?",
        a1: "1. Ar ziņojumu var nosūtīt ne tikai tekstu, bet arī citu informāciju, piemēram, datnes ar fotogrāfijām",
        a2: "2. Lai to varētu lietot, nepieciešama piekļuve internetam",
        a3: "3. Ziņojumi adresātam tiek nogādāti ātrāk, salīdzinot ar parasto pastu",
        a4: "4. Ziņojumiem var piekļūt no jebkuras vietas pasaulē",
        a: 4
    },
    {
        q: "Kas ir ciparparaksts?",
        a1: "1. Dati, kas pievienoti datu blokam un kas ļauj datu saņēmējam pārliecināties par datu bloka integritāti un datu avota autentiskumu",
        a2: "2. Datne, kuru automātiski pievieno nosūtāmajam elektroniskā pasta ziņojumam un kurā ir ziņojuma nosūtītāja adrese, e-pasta adrese un var būt arī telefona un faksa numurs",
        a3: "3. Šifrēta ziņojuma atšifrēšanai nepieciešamie dati (publiskā atslēga)",
        a4: "4. Rakstzīmju virkne, ko izmanto, lai identificētu datoru tīkla lietotāju, kuram ir tiesības izmantot datoru tīkla resursus un pakalpojumus",
        a: 1
    },
    //31 - 40
    {
        q: "Kurš no apgalvojumiem par elektroniskā pasta lietošanu ir patiess?",
        a1: "1. Ir iespējams pilnībā izvairīties no nevajadzīgu reklāmas vēstuļu saņemšanas",
        a2: "2. Saņemtu vēstuli var pārsūtīt citam adresātam",
        a3: "3. Vienmēr ir iespējams noteikt vēstules sūtītāju",
        a4: "4. Ir jāatbild uz katru saņemto vēstuli",
        a: 2
    },
    {
        q: "Datoru tīkls, kurā izmantoti datori ar dažādu arhitektūru, ir...",
        a1: "1. Homogēns datoru tīkls",
        a2: "2. Lokālais datoru tīkls",
        a3: "3. Heterogēns datoru tīkls",
        a4: "4. Teritoriālais datoru tīkls",
        a: 3
    },
    {
        q: "Datoru tīkls, kurā visiem datoriem ir viena veida arhitektūra, ir...",
        a1: "1. Homogēns datoru tīkls",
        a2: "2. Lokālais datoru tīkls",
        a3: "3. Heterogēns datoru tīkls",
        a4: "4. Teritoriālais datoru tīkls",
        a: 1
    },
    {
        q: "Datoru tīkls, kas ir izvietots ierobežotā teritorijā (ēkā, uzņēmumā, iestādē) un atrodas lietotāja pārziņā, ir...",
        a1: "1. Homogēns datoru tīkls",
        a2: "2. Lokālais datoru tīkls",
        a3: "3. Heterogēns datoru tīkls",
        a4: "4. Teritoriālais datoru tīkls",
        a: 2
    },
    {
        q: "Datoru tīkls, kas no lokālā tīkla atšķiras ar to, ka aptver ievērojami plašāku teritoriju un izmanto vispārējās lietošanas vai speciālus sakaru līdzekļus, kuri nodrošina iespēju uzturēt sakarus lielos attālumos, ir...",
        a1: "1. Homogēns datoru tīkls",
        a2: "2. Lokālais datoru tīkls",
        a3: "3. Heterogēns datoru tīkls",
        a4: "4. Teritoriālais datoru tīkls",
        a: 4
    },
    {
        q: "Kurš apgalvojums ir patiess?",
        a1: "1. Lokālajā tīklā var būt tikai viens serveris",
        a2: "2. Lokālajā tīklā datori var būt savienoti tikai ar vadiem",
        a3: "3. Teritoriālais tīkls ir daļa no lokālā tīkla",
        a4: "4. Lokālajā tīklā saslēgtie datori var izmantot kopīgu printeri",
        a: 4
    },
    {
        q: "Kas ir kopīgs iekštīklam un ārtīklam uz MS Windows operētājsistēmas bāzes?",
        a1: "1. Abi šie tīkli izmanto tikai bezvadu tehnoloģijas",
        a2: "2. Abos tīklos izmanto TCP/IP protokolu",
        a3: "3. Abiem tīkliem ir vieni un tie paši lietotāji",
        a4: "4. Abi šie tīkli ir lokālie tīkli",
        a: 2
    },
    {
        q: "Kas ir internets?",
        a1: "1. Globālais datortīkls",
        a2: "2. Globālais tīmeklis",
        a3: "3. Lokālais datortīkls",
        a4: "4. Maģistrāles tīkls",
        a: 1
    },
    {
        q: "Unikāla datora adrese tīkla slāņa līmenī ir...",
        a1: "1. MAC",
        a2: "2. IP",
        a3: "3. Apakštīklu maska",
        a4: "4. Vārteja (Gateway)",
        a: 2
    },
    {
        q: "Kas nosaka, kāda IP adreses daļa ir tīkla adreses un mezgla numurs?",
        a1: "1. MAC",
        a2: "2. IP",
        a3: "3. Apakštīklu maska",
        a4: "4. Vārteja (Gateway)",
        a: 3
    },
    //41 - 50
    {
        q: "Kāda datoru izkārtotā sistēma paredzēta, lai saņemtu informāciju par domēniem?",
        a1: "1. TFTP",
        a2: "2. FTP",
        a3: "3. DNS",
        a4: "4. DHCP",
        a: 3
    },
    {
        q: "Tīklu protokols, kas ļauj datoriem automātiski saņemt IP adreses un citus parametrus, kas ir nepieciešami darbam TCP/IP tīklā, ir...",
        a1: "1. TFTP",
        a2: "2. FTP",
        a3: "3. DNS",
        a4: "4. DHCP",
        a: 4
    },
    {
        q: "Kāda ir galvenā UDP protokola īpašība, salīdzinot ar TCP?",
        a1: "1. UDP protokols ir lēnāks",
        a2: "2. UDP protokols neuzstāda savienojumus ar gala mezgliem",
        a3: "3. UDP protokols nav savietojams ar IP protokolu",
        a4: "4. TCP strādā Windows vidē, bet UDP - Linux vidē",
        a: 2
    },
    {
        q: "Specializēts servera veids, kas nodrošina pieeju koplietošanas datnēm, ir...",
        a1: "1. Centrālais serveris",
        a2: "2. Maršrutētājs",
        a3: "3. Datņu serveris",
        a4: "4. Domēna kontrolieris",
        a: 3
    },
    {
        q: "Kura ir loģiskā vai fiziskā datortīkla daļa?",
        a1: "1. Dators",
        a2: "2. Komutators",
        a3: "3. Tīkla segments",
        a4: "4. Serveris",
        a: 3
    },
    {
        q: "Informācijas apjoms, kas ir nododams caur datoru tīklu par noteiktu laika periodu, ir…",
        a1: "1. Pakete",
        a2: "2. Trafiks",
        a3: "3. Datne",
        a4: "4. Bits",
        a: 2
    },
    {
        q: "Bezvadu tīkla standarts ir...",
        a1: "1. IEEE 802.1",
        a2: "2. IEEE 802.3",
        a3: "3. IEEE 802.11",
        a4: "4. IEEE 802.14",
        a: 3
    },
    {
        q: "BlueTooth sertifikāta marķējums ir...",
        a1: "1. IEEE 802.2",
        a2: "2. IEEE 802.9",
        a3: "3. IEEE 802.15.1",
        a4: "4. IEEE 802.16.1",
        a: 3
    },
    {
        q: "Uz kāda vada bāzes uzbūvēts tīkls 1000BaseFx?",
        a1: "1. Vītā pāra vada",
        a2: "2. Optiskā vada",
        a3: "3. Resnā koaksiālā vada",
        a4: "4. Tievā koaksiālā vada",
        a: 2
    },
    {
        q: "Uz kāda vada bāzes uzbūvēts tīkls 1000BaseTx?",
        a1: "1. Vītā pāra vada",
        a2: "2. Optiskā vada",
        a3: "3. Resnā koaksiālā vada",
        a4: "4. Tievā koaksiālā vada",
        a: 1
    },
    //51 - 60
    {
        q: "Kurš no kabeļu tipiem sastāv no diviem vadiem, no kuriem katrs var pārraidīt datus tikai vienā virzienā?",
        a1: "1. Ekranētais vītā pāra",
        a2: "2. Koaksiālais",
        a3: "3. Optiskais",
        a4: "4. Vītā pāra",
        a: 3
    },
    {
        q: "Kurš no dotajiem parametriem norāda uz to, ka vītā pāra kabelis ir neekranēts?",
        a1: "1. STP",
        a2: "2. UTP",
        a3: "3. NYY",
        a4: "4. AWG",
        a: 2
    },
    {
        q: "Kura no tīkla topoloģijām ir visplašāk lietotā?",
        a1: "1. Gredzentīkls",
        a2: "2. Maģistrāles tīkls",
        a3: "3. Zvaigznes tīkls",
        a4: "4.  Koka tīkls",
        a: 3
    },
    {
        q: "Kurš no tīkla veidiem norāda uz teritoriālā tīkla apzīmējumu?",
        a1: "1. LAN",
        a2: "2. MAN",
        a3: "3. WAN",
        a4: "4. GAN",
        a: 3
    },
    {
        q: "Kāds Ethernet adapteris jāizmanto, ja ir jālieto 1Gb/s vītā pāra kabelis?",
        a1: "1. 100Base-T4",
        a2: "2. 100Base-FX",
        a3: "3. 100Base-T",
        a4: "4. 1000Base-SX",
        a: 3
    },
    {
        q: "Kāds datu pārraides ātrum ir 100BASE-T4 Ethernet tīklam?",
        a1: "1. 10 Mbit/s",
        a2: "2. 100 Mbit/s",
        a3: "3. 10MB/s",
        a4: "4. 100MB/s",
        a: 2
    },
    {
        q: "Kādam kabeļu veidam ir paredzēts 10BASE2 Ethernet?",
        a1: "1. Resnajam koaksiālajam",
        a2: "2. Ekranētajam vītā pāra",
        a3: "3. Tievajam koaksiālajam",
        a4: "4. Vītā pāra",
        a: 3
    },
    {
        q: "Kāds starptautiskais standarts atbilst Token Ring datortīklam?",
        a1: "1. IEEE 800.5",
        a2: "2. IEEE 801.5",
        a3: "3. IEEE 803.5",
        a4: "4. IEEE 804.5",
        a: 2
    },
    {
        q: "Kuru protokolu izmanto tīkla līmeņa organizēšanai?",
        a1: "1. UDP",
        a2: "2. FTP",
        a3: "3. SNMP",
        a4: "4. Telnet",
        a: 3
    },
    {
        q: "Kā sauc tīkla faila sistēmu?",
        a1: "1. NTFS",
        a2: "2. FAT",
        a3: "3. NFS",
        a4: "4. VFAT",
        a: 3
    },
    //61 - 70
    {
        q: "Kāda ir vārtejas (gateway) funkcionālā nozīme?",
        a1: "1. Nodrošināt datu pārraides maršruta izvēli tīklos, kuriem var būt atšķirīga arhitektūra un protokoli",
        a2: "2. Divu datu pārraides tīklu apvienošana, ja šiem tīkliem ir dažādi protokoli",
        a3: "3. Tā ir datu pārraides tīkla komunikācijas ierīce, kas modificē pārraidāmos signālus un ļauj pieslēgt datoru tīklam papildu darbstacijas",
        a4: "4. Nodrošināt datu pārraidi starp datoru tīkliem, kuriem ir atšķirīga arhitektūra un/vai protokoli ",
        a: 4
    },
    {
        q: "Kāds ir tīkla kartes apzīmējums angļu valodā?",
        a1: "1. NIC",
        a2: "2. MAC",
        a3: "3. Hub",
        a4: "4. Switch",
        a: 1
    },
    {
        q: "Kāds ir datortīkla centrmezgla apzīmējums angļu valodā?",
        a1: "1. Hub",
        a2: "2. Switch",
        a3: "3. Router",
        a4: "4. UPS",
        a: 1
    },
    {
        q: "Kādu utilītprogrammu var izmantot izveidoto tīkla savienojumu aplūkošanai?",
        a1: "1. ping exe",
        a2: "2. netstat exe",
        a3: "3. tracert exe",
        a4: "4. whatsup exe ",
        a: 2
    },
    {
        q: "Kas katrai tīkla kartei ir unikāls?",
        a1: "1. MAC adrese",
        a2: "2. IP adrese",
        a3: "3. Lietotāja vārds un parole",
        a4: "4. Datu pārraides ātrums",
        a: 1
    },
    {
        q: "Ar kādu web komponentu palīdzību var izveidot slīdošo tekstu?",
        a1: "1. Link Bar",
        a2: "2. Hit Counter",
        a3: "3. Marquee",
        a4: "4. Page Banner",
        a: 3
    },
    {
        q: "Kas ir tīkla kartes MAC adrese?",
        a1: "1. Unikāla adrese, kuru piešķir DHCP serveris",
        a2: "2. Unikāls identifikācijas numurs, kuru kartē iebūvē ražotājs",
        a3: "3. Unikāla adrese, caur kuru dators pieslēdzas internetam",
        a4: "4. Brīvpieejas atmiņas apgabals, ar kuru strādā tīkla karte",
        a: 2
    },
    {
        q: "Kāds ir HTML atšifrējums?",
        a1: "1. Hyper Text Mail Language",
        a2: "2. Hyperlink Transfer Markup Language",
        a3: "3. Hyperlink Text Mail Language",
        a4: "4. Hyper Text Markup Language ",
        a: 4
    },
    {
        q: "Kurš apgalvojums par internetu ir pareizs?",
        a1: "1. Tā pirmsākumi meklējami Padomju Savienībā",
        a2: "2. Tas radies uzreiz pēc Otrā pasaules kara",
        a3: "3. Pirmie interneta sakari tika nodibināti starp 2 valstu valdībām",
        a4: "4. Tas sākotnēji tika radīts militārām vajadzībām",
        a: 4
    },
    {
        q: "No kā sastāv HTML tags?",
        a1: "1. Simboliem un nosaukuma",
        a2: "2. Vārda un uzvārda",
        a3: "3. Galvas un ķermeņa",
        a4: "4. Nosaukuma un virsraksta ",
        a: 1
    },
    //71 - 80
    {
        q: "Kāds ir datortīkla komutatora apzīmējums angļu valodā?",
        a1: "1. Hub",
        a2: "2. Switch",
        a3: "3. Router",
        a4: "4. Gateway",
        a: 2
    },
    {
        q: "Ar kādu web komponentu palīdzību var izveidot lapas apmeklējumu skaitītāju?",
        a1: "1. Link Bar",
        a2: "2. Hit Counter",
        a3: "3. Marquee",
        a4: "4. Page Banner",
        a: 2
    },
    {
        q: "Kas ir trojāns?",
        a1: "1. Programma ārējo ierīču pieslēgšanai pie datora",
        a2: "2. Grafiskais redaktors",
        a3: "3. Programma, kas izveidota ar mērķi iegūt pieeju lietotāja datoram vai datiem, lietotājam pašam par to nezinot",
        a4: "4. Vīrusu programma, kas izplatās caur e-pastu un bojā inficētajos datoros atrodošos datus",
        a: 3
    },
    {
        q: "Kam ir nepieciešami cookies?",
        a1: "1. Lai atstātu nelielu informācijas apjomu lapas apmeklētāja pārlūkprogrammā",
        a2: "2. Lai datoram nodrošinātu dīkstāvi",
        a3: "3. Lai šifrētu datus",
        a4: "4. Lai veicinātu Interneta tirdzniecību - bonusa punktiem",
        a: 1
    },
    {
        q: "Ko visbiežāk lieto HTML un XHTML valodās veidotu tīmekļa lappušu izskata aprakstīšanai?",
        a1: "1. Kalkulētās stila lapas",
        a2: "2. Cietās stila lapas",
        a3: "3. Visual basic lapas",
        a4: "4. Kaskadētas stila lapas",
        a: 4
    },
    {
        q: "Kāda CSS īpašība tiek izmantota jau nospiesta linka stila izmaiņām?",
        a1: "1. a:link",
        a2: "2. a:visited",
        a3: "3. a:vlink",
        a4: "4. a:hover",
        a: 2
    },
    {
        q: "CSS unikālais nosaukums, kurš tiek izmantots elementa stila mainīšanai un darbam ar to, izmantojot skriptus, ir…",
        a1: "1. Identifikators",
        a2: "2. Klase",
        a3: "3. Grupa",
        a4: "4. Selektors",
        a: 1
    },
    {
        q: "Kāds HTML kods tiek izmantots ārēja CSS faila pievienošanai?",
        a1: "1. <style>mystyle.css</style>",
        a2: "2. <style>@mystyle.css</style>",
        a3: `3. <link rel="stylesheet" href="mystyle.css">`,
        a4: "4. <link>@import url(mystyle.css)</link>",
        a: 3
    },
    {
        q: "Kāda CSS īpašība tiek izmantota linka stila izmaiņām?",
        a1: "1. a:hover",
        a2: "2. a:visited",
        a3: "3. a:link",
        a4: "4. a:vlink",
        a: 3
    },
    {
        q: "Kurš no CSS pieslēgšanas stiliem ir pareizs?",
        a1: `1. @import css("styles.css")`,
        a2: `2. <link href="styles.css" type="stylesheet">`,
        a3: `3. <style href="styles.css"/>`,
        a4: `4. @import url("styles.css")`,
        a: 4
    },
    //81 - 90
    {
        q: "Kurš no variantiem ietver kļūdu?",
        a1: "1. p span#text (font-size: 150%;}",
        a2: "2. p text (font-size: 150%;}",
        a3: "3. p {font-size: 150%;}",
        a4: "4. p span {font-size: 150%;}",
        a: 2
    },
    {
        q: "Kurš CSS kods uzrakstīts pareizi?",
        a1: "1. <div> {border: 1px solid #ccc;}",
        a2: "2. div {border: 1px solid #hhh;}",
        a3: "3. div {border: 1px solid #ccc;}",
        a4: "4. <div> {border: 1px solid #hhh;}",
        a: 3
    },
    {
        q: "Kura krāsas piešķiršana ir nepareiza?",
        a1: "1. color: #aaa;",
        a2: "2. color: #aaaaaa;",
        a3: "3. color: #000;",
        a4: "4. color: #hhh",
        a: 4
    },
    {
        q: "Kāds tags HTML dokumentā nosaka lapaspuses virsdaļu?",
        a1: "1. <section>",
        a2: "2. <nav>",
        a3: "3. <header>",
        a4: "4. <html>",
        a: 3
    },
    {
        q: "Kurš tags HTML dokumentā nosaka atsevišķu saraksta elementu?",
        a1: "1. <style>",
        a2: "2. <th>",
        a3: "3. <li>",
        a4: "4. <nav>",
        a: 3
    },
    {
        q: "Kurš tags HTML dokumentā ietver sevī visu saturu?",
        a1: "1. <html>",
        a2: "2. <style>",
        a3: "3. <tbody>",
        a4: "4. <td>",
        a: 1
    },
    {
        q: "Kurš tags HTML dokumentā attēlo bildes?",
        a1: "1. <style>",
        a2: "2. <p>",
        a3: "3. <img>",
        a4: "4. <td>",
        a: 3
    },
    {
        q: "Kurš no HTML tagiem dokumenta elementa konteinerā nosaka tabulas saturu?",
        a1: "1. <table>",
        a2: "2. <head>",
        a3: "3. <form>",
        a4: "4. <isindex>",
        a: 1
    },
    {
        q: "Kurš no HTML tagiem dokumentā veido lappuses saikni ar citiem failiem?",
        a1: "1. <thead>",
        a2: "2. <tfoot>",
        a3: "3. <style>",
        a4: "4. <link>",
        a: 4
    },
    {
        q: "Kurš tags HTML dokumentā ļauj grupēt lapas vai nodalījuma virsrakstus?",
        a1: "1. <hgroup>",
        a2: "2. <marquee>",
        a3: "3. <span>",
        a4: "4. <pre>",
        a: 1
    },
    //91 - 100
    {
        q: "Kurš tags HTML dokumentā paredzēts meklēšanas indeksam?",
        a1: "1. <isindex>",
        a2: "2. <h1>",
        a3: "3. <footer>",
        a4: "4. <figcaption>",
        a: 1
    },
    {
        q: "Kā iestatīt zemāk uzskaitītos rāmja parametrus: no augšmalas = 10 px; no apakšmalas = 5 px; no kreisās malas = 20 px; no labās malas = 1 px?",
        a1: "1. border-width:10px 20px 5px 1px;",
        a2: "2. border-width:10px 1px 5px 20px;",
        a3: "3. border-width:10px 5px 20px 1px;",
        a4: "4. border-width:5px 20px 10px 1px;",
        a: 2
    },
    {
        q: "HTML ir...",
        a1: "1. Hiperteksta iezīmēšanas valoda",
        a2: "2. Programmēšanas valoda",
        a3: "3. INTERNET protokols",
        a4: "4. Teksta redaktors",
        a: 1
    },
    {
        q: "Tagus HTML dokumentos apzīmē...",
        a1: "1. Ar leņķveida iekavām: < >",
        a2: "2. Ar sleš-zīmēm: / /",
        a3: `3. Ar pēdiņām: " "`,
        a4: "4. Ar figūriekavām: { }",
        a: 1
    },
    {
        q: "HTML dokumentus var veidot...",
        a1: "1. Jebkurā teksta redaktorā",
        a2: "2. Tikai ar speciālu programmu palīdzību",
        a3: "3. Tikai Notepad",
        a4: "4. Tikai MS WORD",
        a: 1
    },
    {
        q: "Kāda tagu kārtība ir pareiza?",
        a1: "1. <head> <title> </title> </head> <body> </body>",
        a2: "2. <head> </head> <title> </title> <body> </body>",
        a3: "3. <head> <body> </body> </head> <title> </title>",
        a4: "4. <title> <head> </head> </title> <body> </body>",
        a: 1
    },
    {
        q: "Kuru simbolu izmanto kā atdalītāju, aprakstot vairākus taga atribūtus?",
        a1: "1. Atstarpi",
        a2: "2. Komatu",
        a3: "3. Semikolu",
        a4: "4. Kolu",
        a: 1
    },
    {
        q: "Kuri no dotajiem atribūtiem tiek izmantoti tikai hipersaišu izveidošanas tagos?",
        a1: "1. HREF",
        a2: "2. NAME",
        a3: "3. ALT",
        a4: "4. ANCHOR",
        a: 1
    },
    {
        q: "Kādu funkciju veic pārlūkprogramma ar HTML kodu?",
        a1: "1. Interpretē",
        a2: "2. Kompilē",
        a3: "3. Izpilda",
        a4: "4. Izveido",
        a: 1
    },
    {
        q: "Ar kura taga palīdzību var organizēt e-mail sūtīšanu no WEB lapas?",
        a1: "1. <A>",
        a2: "2. <mailto>",
        a3: "3. <mail>",
        a4: "4. <HREF>",
        a: 2
    },
    //101 - 110
    {
        q: `HTML dokuments satur izteiksmi <body bgcolor = "blue">. Ko nozīmē bgcolor?`,
        a1: "1. Atribūts",
        a2: "2. Stils",
        a3: "3. Tags",
        a4: "4. Deskriptors",
        a: 1
    },
    {
        q: "Kādi līdzekļi ļauj regulēt informācijas izkārtojumu Web lapā?",
        a1: "1. Tabulu veidošanas līdzekļi un tags <div>",
        a2: "2. Tikai tabulu veidošanas līdzekļi",
        a3: "3. Stilu lapas",
        a4: "4. Tags <pre>",
        a: 1
    },
    {
        q: "Kā iespējams  lietotājam paziņot par nekorektu taga interpretēšanu pārlūkprogrammā vai dot viņam papildinformāciju par interpretējamo elementu?",
        a1: "1. Ar ALT atribūta palīdzību",
        a2: "2. Ar FRAME palīdzību",
        a3: "3. Ar IFRAME palīdzību",
        a4: "4. Bez skriptu izmantošanas tas nav iespējams",
        a: 1
    },
    {
        q: "Kurš no dotajiem tagiem ir lieks (pēc jēgas)?",
        a1: "1. <hr>",
        a2: "2. <table>",
        a3: "3. <td>",
        a4: "4. <tr>",
        a: 1
    },
    {
        q: "Kāda tagu kārtība ir pareiza?",
        a1: "1. <table> <tr> <td> </td> </tr> </table>",
        a2: "2. <table> <td> <tr> </tr> </td> </table>",
        a3: "3. <table> <tr> </tr> <td> </td> </table>",
        a4: "4. <table> <td> </td> <tr> </tr> </table>",
        a: 1
    },
    {
        q: "Ja logam jābūt sadalītam vairākās daļās, kuras vienlaicīgi attēlo dažādu HTML dokumentu saturu, jāizmanto…",
        a1: "1. Freimi",
        a2: "2. Tabulas",
        a3: "3. Tagi <div>",
        a4: "4. Tagi <pre>",
        a: 1
    },
    {
        q: "Kuri no dotajiem atribūtiem freima aprakstā (tagā <FRAME>) ir obligāti ?",
        a1: "1. NAME un SRC",
        a2: "2. ROWS un COLS",
        a3: "3. ROWS, COLS un SRC",
        a4: "4. BORDER un NAME",
        a: 1
    },
    {
        q: "Atribūtu NORESIZE HTML dokumentos izmanto, lai lietotājs nevarētu mainīt…",
        a1: "1. Freima izmēru",
        a2: "2. Loga izmēru",
        a3: "3. Tabulas izmēru",
        a4: "4. Attēla izmēru",
        a: 1
    },
    {
        q: "Ar kāda taga palīdzību var uzzīmēt horizontālo līniju?",
        a1: "1. <HR>",
        a2: "2. <BR>",
        a3: "3. <A>",
        a4: "4. <PRE>",
        a: 1
    },
    {
        q: "Ar kāda taga palīdzību var aprakstīt bildes sadalījumu vairākās daļās, no kurām katrai jānozīmē atsevišķa hipersaite?",
        a1: "1. MAP",
        a2: "2. IMG",
        a3: "3. USERMAP",
        a4: "4. DIV",
        a: 1
    },
    //111 - 120
    {
        q: "Kāds <img> taga atribūts ļauj uzrādīt bildes sadalīšanas shēmu, ja bildes atsevišķām daļām vēlams nozīmēt atšķirīgas hipersaites?",
        a1: "1. MAP",
        a2: "2. IMG",
        a3: "3. USEMAP",
        a4: "4. DIV",
        a: 3
    },
    {
        q: "Kam var izmantot .css failā aprakstītus stilus?",
        a1: "1. Vairākiem HTML dokumentiem",
        a2: "2. Tikai vienam noteiktajam HTML-dokumentam",
        a3: "3. Tikai cita .css failā stilu aprakstīšanai",
        a4: "4. Tikai  index.html dokumenta stilu aprakstīšanai",
        a: 1
    },
    {
        q: "CSS (Cascading Style Sheets) ir...",
        a1: "1. Parametru kopums HTML elementu attēlošanai",
        a2: "2. WEB lapā attēlojamas tabulas",
        a3: "3. Tabulu veidošanas parametru kopums",
        a4: "4. Tabulu noformēšanas stila apraksts",
        a: 1
    },
    {
        q: "Ko dara CSS aparaksts: A {color: #3366AA; font-size: 18pt}?",
        a1: "1. Pārdefinē hipersaites standarta stilu",
        a2: "2. Pārdefinē A burta attēlošanas stilu",
        a3: "3. Pārdefinē apmeklētās hipersaites stilu",
        a4: "4. Definē jaunu stila klasi ar nosaukumu A",
        a: 1
    },
    {
        q: "Kurš no stilu aprakstiem ir pareizs?",
        a1: "1. {font-family: Arial; color: #0000FF;}",
        a2: "2. {font-face: Arial; color: blue;}",
        a3: `3. {font-family="Arial"; color="blue";}`,
        a4: `4. {font-face="Arial"; color="#0000FF";}`,
        a: 1
    },
    {
        q: "Kuri no dotajiem atribūtiem ļauj nozīmēt elementam stilus, kuri ir aprakstīti .css failā?",
        a1: "1. ID un CLASS",
        a2: "2. CLASS un STYLE",
        a3: "3. STYLE un NAME",
        a4: "4. NAME un ID",
        a: 1
    },
    {
        q: "Ar kāda taga palīdzību var ievietot bildi WEB lapā?",
        a1: "1. <img>",
        a2: "2. <picture>",
        a3: "3. <graphic>",
        a4: "4. <photo>",
        a: 1
    },
    {
        q: "Kas ir filtrs HTML valodā?",
        a1: "1. Vizuālais efekts elementu attēlošanai",
        a2: "2. Datu atlasīšanas metode",
        a3: "3. Objektu atlasīšanas metode",
        a4: "4. HTML dokumenta attēlošanas stils",
        a: 1
    },
    {
        q: "HTML valodā filtrus var lietot…",
        a1: "1. Izdalītiem ar <DIV> teksta blokiem un grafiskiem attēliem",
        a2: "2. Grafiskiem attēliem un tabulām",
        a3: "3. Ar <P> izdalītām teksta rindkopām",
        a4: "4. Tabulām un/vai to atsevišķām daļām",
        a: 1
    },
    {
        q: "Kurš no minētajiem tagiem paredzēts HTML-dokumenta satura dalīšanai atsevišķās daļās?",
        a1: "1. <DIV>",
        a2: "2. <TABLE>",
        a3: "3. <FRAME>",
        a4: "4. <IFRAME>",
        a: 1
    },
    //121 - 130
    {
        q: "Kas ir Z-index?",
        a1: "1. Slāņa numurs, kurā elements tiks izvietots",
        a2: "2. Elementa trešā koordināta (kopā ar X in Y)",
        a3: "3. Elementa numurs, kurš apzīmēts ar burtu Z",
        a4: "4. Trīsdimensiju objekts",
        a: 1
    },
    {
        q: "Kāda veida koordinātas var noteikt elementiem HTML valodā to izvietošanai WEB lapā?",
        a1: "1. Absolūtās un relatīvās",
        a2: "2. Tikai relatīvās",
        a3: "3. Tikai absolūtās",
        a4: "4. Kombinētās",
        a: 1
    },
    {
        q: "Kāda ir <META> taga nozīme HTML valodā?",
        a1: `1.Tas satur dienesta parametrus, kurus "pēta" pārlūkprogramma pirms HTML dokumenta attēlošanas`,
        a2: "2. Tajā apraksta stilus",
        a3: "3. Tas satur WEB lapas virsrakstu",
        a4: "4. Tas satur WEB vietnes kartes aprakstu",
        a: 1
    },
    {
        q: "Kurā no uzskaitītajiem gadījumiem notikums nenonāks uz JavaScript apstrādi?",
        a1: "1. Ja tā ofensīvas momentā ir apstrādājams  cits notikums",
        a2: "2. Ja lapaspuse ir izskatāma lokāli (offline)",
        a3: "3. Tikai, ja JavaScript ir atslēgts",
        a4: "4. Ja lapaspuse ir izskatāma globāli (online)",
        a: 3
    },
    {
        q: "Kādas ciklu konstrukcijas ir javascript?",
        a1: "1. Tikai for un while",
        a2: "2. Tikai for",
        a3: "3. Tikai do...while",
        a4: "4. Trīs: while, for, do...while",
        a: 4
    },
    {
        q: "Ko dara JavaScript kods: break me?",
        a1: "1. Atslēdz JavaScript interpritēšanu",
        a2: `2. Iziet no cikla uz "me" zīmi`,
        a3: "3. Parāda kļūdu",
        a4: "4. Ieslēdz JavaScript interpretēšanu",
        a: 2
    },
    {
        q: "Cik parametru var uzdot funkcijai?",
        a1: "1. Tieši tik daudz, cik ir norādīts funkcijas definēšanā",
        a2: "2. Tik, cik ir norādīts funkcijas definēšanā vai mazāk",
        a3: "3. Tik, cik ir norādīts funkcijas definēšanā vai vairāk",
        a4: "4. Jebkādu daudzumu",
        a: 4
    },
    {
        q: "Kā sauc kodu, kas nav peles notikums?",
        a1: "1. Onmousescroll",
        a2: "2. Onclick",
        a3: "3. Onmouseover",
        a4: "4. Onmousemove",
        a: 1
    },
    {
        q: "Kādu notikumu neizsauc ar peles pogas nospiešanu?",
        a1: "1. Onfocus",
        a2: "2. Onclick",
        a3: "3. Onkeydown",
        a4: "4. Onmousedown",
        a: 3
    },
    {
        q: "Kurš no nosauktajiem PHP operatoriem izpilda ne tikai matemātiskās operācijas?",
        a1: "1. /",
        a2: "2. +",
        a3: "3. -",
        a4: "4. >>>",
        a: 2
    },
    //131 - 140
    {
        q: "Kā apzīmē Windows OS lokālā tīkla pamatprotokolu?",
        a1: "1. NetBEUI",
        a2: "2. TCP/IP",
        a3: "3. ARCnet",
        a4: "4. IPX/SPX ",
        a: 2
    },
    {
        q: "Kas ir tīkla protokols?",
        a1: "1. Kvotu noteikšanas aparatūras metode",
        a2: "2. Kļūdu izlabošanas kods",
        a3: "3. Darbības izpildes metode, kura ir pieņemta pēc savstarpējas saskaņošanas",
        a4: "4. Kvotu noteikšanas programmas metode",
        a: 3
    },
    {
        q: "Kas ir SMTP, FTP, HTTP, POP3?",
        a1: "1. Dažādas Web lapu programmēšanas valodas",
        a2: "2. Pasta protokoli",
        a3: "3. Domēnu vārdi",
        a4: "4. Dažādi interneta protokoli",
        a: 4
    },
    {
        q: "Kāds ir Internet tīkla pamatprotokols?",
        a1: "1. NetBEUI",
        a2: "2. TCP/IP",
        a3: "3. ARCnet",
        a4: "4. IPX/SPX",
        a: 2
    },
    {
        q: "Kurš protokols tiek izmantots, lai noteiktu MAC jeb interfeisa adresi pēc IP adreses?",
        a1: "1. IP6",
        a2: "2. POP3",
        a3: "3. ARP",
        a4: "4. FTP",
        a: 3
    },
    {
        q: "Kurš ir viens no bināro signālu kodēšanas veidiem?",
        a1: "1. ZRN",
        a2: "2. Mančesteras",
        a3: "3. Časteres",
        a4: "4. ZIRO",
        a: 2
    },
    {
        q: "Cik pavisam ir OSI arhitektūras līmeņu?",
        a1: "1. 7",
        a2: "2. 9",
        a3: "3. 6",
        a4: "4. 8",
        a: 1
    },
    {
        q: "Kurā OSI modeļa līmenī darbojas IP protokols?",
        a1: "1. Datu posma",
        a2: "2. Sesijas",
        a3: "3. Tīkla",
        a4: "4. Transporta",
        a: 3
    },
    {
        q: "Pa kuru OSI līmeni tiek pārsūtīti biti?",
        a1: "1. Fizisko līmeni",
        a2: "2. Tīkla līmeni",
        a3: "3. Kanālu līmeni",
        a4: "4. Transporta līmeni",
        a: 1
    },
    {
        q: "Kurš ir e-pasta izsūtīšanas protokols?",
        a1: "1. SMTP",
        a2: "2. POP",
        a3: "3. IMAP",
        a4: "4. HTTP",
        a: 1
    },
    //141 - 150
    {
        q: "Kurš ir e-pasta saņemšanas protokols?",
        a1: "1. IMAP un POP",
        a2: "2. POP un HTTP",
        a3: "3. IP un HTTP",
        a4: "4. FTP un TCP",
        a: 1
    },
    {
        q: "Kurš ir tīkla protokols, kas nodrošina IP adreses noteikšanu, izmantojot tīkla adaptera MAC adresi?",
        a1: "1. RARP",
        a2: "2. MAC",
        a3: "3. NAT",
        a4: "4. PING",
        a: 1
    },
    {
        q: "Kuru lietojuma slāņa protokolu lieto, lai automātiski iedalītu/piešķirtu tīkla iestatījumus datora tīkla kartei?",
        a1: "1. DHCP",
        a2: "2. HTTP",
        a3: "3. DNS",
        a4: "4. RARP",
        a: 1
    },
    {
        q: "Kurš transporta slāņa protokols ir paredzēts droša savienojuma izveidošanai atbilstoši OSI modelim?",
        a1: "1. TCP",
        a2: "2. UDP",
        a3: "3. HTTP",
        a4: "4. SMTP",
        a: 1
    },
    {
        q: "Kurš OSI modeļa slānis nodrošina datu aizsardzību?",
        a1: "1. Kanālu slānis",
        a2: "2. Transporta slānis",
        a3: "3. Fiziskais slānis",
        a4: "3. Tīkla slānis",
        a: 2
    },
    {
        q: "Kurš OSI modeļa slānis kontrolē iespējāmās kļūdas?",
        a1: "1. Kanālu slānis",
        a2: "2. Transporta slānis",
        a3: "3. Fiziskais slānis",
        a4: "3. Tīkla slānis",
        a: 1
    },
    {
        q: "Kurš OSI modeļa slānis kontrolē datu pārraidīšanas ceļu?",
        a1: "1. Kanālu slānis",
        a2: "2. Transporta slānis",
        a3: "3. Fiziskais slānis",
        a4: "3. Tīkla slānis",
        a: 4
    },
    {
        q: "Kuram OSI modeļa slānim pieder IP protokols?",
        a1: "1. Fiziskais slānis",
        a2: "2. Tīkla slānis",
        a3: "3. Kanālu slānis",
        a4: "4. Transporta slānis",
        a: 2
    },
    {
        q: "Kuram OSI modeļa slānim pieder NetBIOS protokols?",
        a1: "1. Seansu slānis",
        a2: "2. Tīkla slānis",
        a3: "3. Kanālu slānis",
        a4: "4. Transporta slānis",
        a: 1
    },
    {
        q: "Kurš OSI modeļa slānis kontrolē programmatūras sadarbību ar tīkla resursiem?",
        a1: "1. Fiziskais slānis",
        a2: "2. Lietotņu slānis",
        a3: "3. Transporta slānis",
        a4: "4. Seansu slānis",
        a:
    },
    //151 - 160
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a:
    },
    //161 - 170
];
const DATU_BAZES = [];
const NORMATIVIE_AKTI = [
    //1 - 10
    {
        q: "Kāds ir ieteicamais attālums starp acīm un datora monitora ekrānu?",
        a1: "1. 200-400 mm",
        a2: "2. Līdz 300 mm",
        a3: "3. 450-750 mm",
        a4: "4. 800-950 mm",
        a: 3
    },
    {
        q: "Cik bieži ieteicams veikt pārtraukumus, intensīvi strādājot pie datora?",
        a1: "1. Katru stundu",
        a2: "2. Ik pēc 3 stundām",
        a3: "3. Nav nepieciešams",
        a4: "4. Ik pēc 2 stundām",
        a: 1
    },
    {
        q: "Kādas veselības problēmas var radīt elkoņos stipri saliektas rokas?",
        a1: "1. Muguras un kakla muskuļu sāpes",
        a2: "2. Acu nogurumu un asarošanu",
        a3: "3. Plaukstu un elkoņu sāpes",
        a4: "4. Muguras skriemeļa izbīdi",
        a: 1
    },
    {
        q: "Kurš faktors darbā ar datoru atstāj vismazāko iespaidu uz lietotāja veselību?",
        a1: "1. Apgaismojuma stiprums",
        a2: "2. Regulāra atpūta darba laikā",
        a3: "3. Printera novietojums",
        a4: "4. Tastatūras un peles novietojums",
        a: 3
    },
    {
        q: "Kādai jābūt LCD vai LED monitora izvērses frekvencei? ",
        a1: "1. Vairāk par 75Hz",
        a2: "2. Vairāk par 60Hz",
        a3: "3. Vairāk par 50Hz",
        a4: "4. Vairāk par 30Hz",
        a: 2
    },
    {
        q: "Cik lielā attālumā no acīm jābūt novietotam monitoram?",
        a1: "1. 30-50cm",
        a2: "2. 50-70cm",
        a3: "3. 70-90cm",
        a4: "4. 90-100cm",
        a: 2
    },
    {
        q: "Cik grādu leņķī zem acu līmeņa vajadzētu atrasties ekrāna apakšējai malai?",
        a1: "1. 0°- 100°",
        a2: "2. 100°- 200°",
        a3: "3. 200°- 300°",
        a4: "4. 300°- 400°",
        a: 2
    },
    {
        q: "Kas ir ergonomika?",
        a1: "1. Ekonomikas zinātne",
        a2: "2. Zinātne par drošu un ērtu darba vidi",
        a3: "3. Zinātne par telpas iekārtojumu",
        a4: "4. Zinātne par tehnisku iekārtu izvietojumu",
        a: 2
    },
    //5.9 Jautājums tiek izlaists komplicētu iemeslu dēļ
    /*
    {
        q: "",
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a: 
    },
    */
    {
        q: "Kura no prasībām atbilst ergonomiskai darba vietas iekārtošanai?",
        a1: "1. Monitora attālumam no acīm ābūt 100 cm",
        a2: "2. Zem kājām jāatrodas paliktnim",
        a3: "3. Gaisa temperatūrai jābūt vismaz 250°",
        a4: "4. Apgaismojumam jābūt vērstam uz monitoru",
        a: 2
    },
    //11 - 20
    {
        q: "Informācijas atklātības likumā ir definēts, ka ir vispārpieejamā informācija un ierobežotas pieejamības informācija. Vai ierobežotās pieejamības informācija no šī likuma viedokļa kļūst par vispārpieejamo informāciju, ja kāds to nelegāli publicē?",
        a1: "1. Ierobežotās pieejamības informācija saglabā savu statusu",
        a2: "2. Ierobežotās pieejamības informācija kļūst par vispārpieejamo informāciju",
        a3: "3. Ierobežotās pieejamības informācija saglabā savu statusu tikai noteiktai lietotāju grupai",
        a4: "4. Ierobežotās pieejamības informācija kļūst par vispārpieejamo informāciju tikai noteiktai lietotāju grupai",
        a: 2
    },
    {
        q: "Uz cik ilgu laiku informācijai var noteikt pieejamības statusu?",
        a1: "1. Tas atkarīgs no informācijas autora vai iestādes vadītāja, kurš nosaka termiņu pēc saviem ieskatiem",
        a2: "2. Informācijas autors vai iestādes vadītājs ierobežotas pieejamības statusu informācijai nosaka uz laiku, kas nav ilgāks par desmit gadiem",
        a3: "3. Informācijas autors vai iestādes vadītājs ierobežotas pieejamības statusu informācijai nosaka uz laiku, kas nav ilgāks par vienu gadu",
        a4: "4. Informācijas autors vai iestādes vadītājs ierobežotas pieejamības statusu informācijai nosaka uz laiku, kas nav ilgāks par trīs gadiem",
        a: 3
    },
    {
        q: "Vai ierobežotas pieejamības informācija automātiski var mainīt savu statusu un kļūt par vispārpieejamo informāciju?",
        a1: "1. Nē, tas nav iespējams",
        a2: "2. Jā, ja informācijas autors pats nelegāli publisko šo ierobežotās pieejamības informāciju",
        a3: "3. Jā, ja attiecīgā iestāde nav reģistrējusi ierobežotās lietošanas informāciju normatīvajos aktos noteiktajā kārtībā",
        a4: "4. Jā, ja beidzies termiņš, uz kādu informācijai noteikts ierobežotas pieejamības statuss, vai ja ierobežotas pieejamības statuss ir atcelts pirms likumā noteiktā termiņa",
        a: 4
    },
    {
        q: "Kas ir komercnoslēpums?",
        a1: "1. Komersanta radīta vai komersantam piederoša informācija, kuras atklāšana varētu būtiski negatīvi ietekmēt komersanta konkurētspēju",
        a2: "2.Informācija, kas ir saistīta ar valsts pārvaldes funkciju vai uzdevumu izpildi",
        a3: "3. Informācija, kas ir saistīta ar valsts un pašvaldību publiskajiem iepirkumiem",
        a4: "4. Informācija, kas ir saistīta ar komersanta publiskajiem iepirkumiem",
        a: 1
    },
    {
        q: "Likums nosaka, ka vispārpieejamā informāciju jāsniedz jebkuram, kas to vēlas saņemt, ievērojot personu vienlīdzību informācijas iegūšanā. Kāds ir šīs informācijas pieprasīšanas process? ",
        a1: "1. Iestādei no pieprasītāja ir jāsaņem personu apliecinošs dokuments, kas ļauj vispirms pārbaudīt pieprasītāja identitāti; pēc tam tiek izsniegta informācija",
        a2: "2. Iestādei no pieprasītāja ir jāsaņem pamatots paskaidrojums par informācijas tālāko izmantojumu un personu apliecinošs dokuments, kas ļauj pārbaudīt pieprasītāja identitāti; pēc tam tiek izsniegta informācija",
        a3: "3. Informācijas autors pats izvēlas, kuru informācijas daļu no vispārpieejamās informācijas izsniegt pieprasītājam",
        a4: "4. Pieprasītājam nav īpaši jāpamato sava interese par vispārpieejamo informāciju, un to viņam nevar liegt, jo šī informācija neattiecas uz pieprasītāju",
        a: 4
    },
    {
        q: "Publisko iepirkumu likums nosaka, ka obligāti ir jānodrošina iepirkuma procedūras atklātums. Taču šis atklātums var neattiekties uz situāciju, ja...",
        a1: "1. Iepirkums attiecas uz komersantu, kuram ir pieeja ierobežotas pieejamības informācijai",
        a2: "2. Iepirkums attiecas uz TV vai radio programmas materiāla veidošanu, pilnveidošanu, inscenēšanu vai pārveidošanu, un paredzēts apraidei",
        a3: "3. Iepirkumu organizē tikai starp komersantiem, kuriem ir attiecīgie finanšu resursi",
        a4: "4. Iepirkums tiek izsludināts starp visām ES valstīm",
        a: 2
    },
    {
        q: "Kādi ir publiskā iepirkuma organizēšanas noteikumi?",
        a1: "1. Pasūtītājs pirms iepirkuma veikšanas publicē paziņojumu par veicamo iepirkumu savā mājaslapā internetā, norādot piedāvājumu iesniegšanas termiņu , kas nedrīkst būt īsāks par 10 darba dienām no paziņojuma publicēšanas dienas",
        a2: `2. Pasūtītājs pirms iepirkuma veikšanas publicē paziņojumu par veicamo iepirkumu laikrakstā "Latvijas Vēstnesis", norādot piedāvājumu iesniegšanas termiņu, kas nedrīkst būt īsāks par 30 darba dienām no paziņojuma publicēšanas dienas`,
        a3: "3. Pasūtītājs pirms iepirkuma veikšanas izplata informāciju starp potenciālajiem komersantiem, kuri varētu realizēt pasūtītāja prasības, un nosaka iesniegšanas termiņu, kas nedrīkst būt īsāks par 20 darba dienām no paziņojuma publicēšanas dienas",
        a4: "4. Vispirms tiek ņemti vērā starptautiskajās specifikācijās definētie tehniskie parametri, pēc tam ES definētie tehniskie parametri un pēc tam Latvijas valstī definētie tehniskie parametri",
        a: 1
    },
    {
        q: "Ja publiskajam iepirkumam ir paredzēta tehniskā specifikācija, tad tehniskajā specifikācijā prasītajiem tehniskajiem parametriem ir šāda prioritāte...",
        a1: "1. Vispirms tiek ņemti vērā Latvijas valstī definētie tehniskie parametri, pēc tam ES definētie tehniskie parametri, pēc tam starptautiskajās specifikācijās definētie tehniskie parametri",
        a2: "2. Vispirms tiek ņemti vērā ražotāja definētie tehniskie parametri, pēc tam Latvijas valstī definētie tehniskie parametri, pēc tam ES definētie tehniskie parametri, pēc tam starptautiskajās specifikācijās definētie tehniskie parametri",
        a3: "3. Vispirms tiek ņemti vērā starptautiskajās specifikācijās definētie tehniskie parametri, pēc tam ES definētie tehniskie parametri un pēc tam Latvijas valstī definētie tehniskie parametri",
        a4: "4. Vispirms tiek ņemti vērā starptautiskajās specifikācijās definētie tehniskie parametri, pēc tam ES definētie tehniskie parametri un pēc tam Latvijas valstī definētie tehniskie parametri",
        a: 1
    },
    {
        q: "Ministru kabineta noteikumos Nr.765 (Valsts informācijas sistēmu vispārējās drošības prasības) ir noteikts, ka obligāti ir jāveic sistēmu drošības pārbaudes. Kurš tās veic?",
        a1: "1. Neatkarīgs audita uzņēmums pēc valsts iestādes pieprasījuma",
        a2: "2. Sistēmas pārzinis, kas nodrošina sistēmas drošības pārbaudi (auditu) vienu reizi gadā",
        a3: "3. Neatkarīgs audita uzņēmums valsts iestādēm veic sistēmu drošības pārbaudes vienu reizi 3 gados",
        a4: "4. Valsts iestādes vadītājs, kas nodrošina sistēmas drošības pārbaudi (auditu) vienu reizi divos gados",
        a: 2
    },
    {
        q: "Ja noticis sistēmas drošības incidents un ja šis incidents var radīt apdraudējumu citu valsts institūciju pārziņā esošajām sistēmām, par sistēmas drošības incidentu jāinformē...",
        a1: "1. Valsts policija",
        a2: "2. Datu valsts inspekcija",
        a3: "3. Kibernoziegumu uzraudzības nodaļa",
        a4: "4. Jebkura esošo informācijas tehnoloģiju drošības incidentu novēršanas institūcija",
        a: 4
    },
    //21 - 30
    {
        q: "Valsts informācijas sistēmās regulāri ir jāveic personāla apmācība drošības jautājumos. Apmācību nodrošina...",
        a1: "1. Sistēmas aparatūras un programmatūras uzstādītājs",
        a2: "2. Sistēmas aparatūras un programmatūras ražotājs",
        a3: "3. Sistēmas pārzinis",
        a4: "4. Konkursa kārtībā uzvarējusī apmācības iestāde",
        a: 4
    },
    {
        q: "Informācijas tehnoloģiju drošības likumā ir definēts, ka Drošības incidentu novēršanas institūcijas tiesībās ietilpst...",
        a1: "1.No valsts un pašvaldību institūcijām un privāto tiesību juridiskajām personām pēc abpusējas vienošanās iegūt tiešsaistes datu plūsmas tehniskos parametrus",
        a2: "2. No privāto tiesību juridiskajām personām un fiziskajām personām pēc abpusējas vienošanās iegūt tiešsaistes datu plūsmas tehniskos parametrus",
        a3: "3. No valsts un pašvaldību institūcijām un privāto tiesību juridiskajām personām bez abpusējas vienošanās iegūt izmantojamo programmu licenču informāciju",
        a4: "4. No valsts un pašvaldību institūcijām un privāto tiesību juridiskajām personām bez abpusējas vienošanās iegūt tiešsaistes P2P programmu (torentu utt.) datu plūsmas informatīvos parametrus",
        a: 1
    },
    {
        q: "Drošības incidentu novēršanas institūcija ir tiesīga saņemt un apstrādāt personas datus gadījumā, ja...",
        a1: "1. Kaitnieciskā programmatūra varētu dot pieeju citu personu datiem",
        a2: "2. Daudzu personu privātie dati tiek izmantoti kaitnieciskas programmatūras vadībai (paroļu ģeneratori utt.)",
        a3: "3. Personas dati var sniegt būtisku informāciju par kaitniecisku programmatūru",
        a4: "4. Daudzu personu privātie dati tiek izmantoti preču un pakalpojumu reklamēšanai",
        a: 3
    },
    {
        q: "Kādas darbības jāveic publiskajam elektronisko sakaru komersantam pēc Drošības incidentu novēršanas institūcijas pieprasījuma?",
        a1: "1. Konstatēt galalietotāju, kurš izsūta kaitniecisko programmatūru, un par to ziņot attiecīgajai iestādei",
        a2: "2. Īslaicīgi (ne ilgāk kā 24 stundas) slēgt galalietotāja piekļuvi elektronisko sakaru tīklam",
        a3: "3. Publiski brīdināt galalietotāju par tā kaitnieciskās darbības sekām",
        a4: "4. Drošības incidentu novēršanas institūcija publiskajam sakaru komersantam neko nevar pieprasīt",
        a: 2
    },
    {
        q: "Kādu elektronisko parakstu var uzskatīt par drošu saskaņā ar Elektronisko dokumentu likumu?",
        a1: "1. Tādu, kas ir piesaistīts vienīgi parakstītājam, nodrošina parakstītāja personas identifikāciju,  ir radīts ar drošiem elektroniskā paraksta radīšanas līdzekļiem, kurus var kontrolēt tikai parakstītājs",
        a2: "2. Tādu, kura kodēšanai tiek izmantota 1024 bitu kodu atslēga",
        a3: "3. Tādu, kas ir piesaistīts vienīgi specializētai elektroniskā paraksta veidošanas aparatūrai",
        a4: "4. Tādu, kura veidošanā tiek izmantots specializēts  autorizācijas serveris, kurš kontrolē kodu atslēgas",
        a: 1
    },
    {
        q: "Elektroniskā paraksta veidošanas sistēmā tiek izmantoti Kvalifikācijas sertifikāti. Uzticamais sertifikācijas pakalpojumu sniedzējs var anulēt tā izsniegto kvalifikācijas sertifikātu...",
        a1: "1. Ja ir pamats uzskatīt, ka elektroniskā paraksta radīšanas programmatūra tiek izmantota uz inficēta datora",
        a2: "2. Ja ir pamats uzskatīt, ka elektroniskā paraksta radīšanas aparatūrai ir beigusies ražotāja garantija",
        a3: "3. Ja ir pamats uzskatīt, ka elektroniskā paraksta radīšanas aparatūra tiek izmantota citā datu pārraides tīklā",
        a4: "4. Ja ir pamats uzskatīt, ka elektroniskā paraksta radīšanas dati izmantoti bez parakstītāja ziņas",
        a: 4
    },
    {
        q: "Elektroniskā paraksta veidošanas procesā tiek izmantots laika zīmogs. Laika zīmogs ir...",
        a1: "1. Elektroniski parakstīts apstiprinājums, kurā ir norādīts dokumenta radīšanas gads, mēnesis, diena, stunda un minūte, kad dokuments ticis radīts",
        a2: "2. Elektroniski parakstīts apstiprinājums tam, ka elektroniskais dokuments ir noteiktā datumā un laikā nosūtīts no viena abonenta pie otra, un saņēmēja abonents to ir atvēris un izlasījis",
        a3: "3. Elektroniski parakstīts apstiprinājums tam, ka elektroniskais dokuments ir noteiktā datumā un laikā iezīmēts pie sertifikācijas pakalpojumu sniedzēja",
        a4: "4. Elektroniski parakstīts apstiprinājums tam, ka elektroniskais dokuments noteiktā datumā un laikā ir reģistrēts pie dokumenta saņēmēja",
        a:  3
    },
    {
        q: "Fizisko personu datu aizsardzības likumā ir noteikts, ka par sensitīviem var tikt uzskatīti personas dati, kuri satur informāciju par...",
        a1: "1. Personas dalību vēlēšanās, piedalīšanos masu pasākumos un mītiņos",
        a2: "2. Personas rasi, etnisko izcelsmi, reliģisko, filozofisko un politisko pārliecību, dalību arodbiedrībās, informāciju par personas veselību",
        a3: "3. Personas materiālo stāvokli, sociālo stāvokli un personai piederošajiem īpašumiem",
        a4: "4. Personas izglītības līmeni, tā zinātnisko grādu un personai piederošajiem patentiem un autorapliecībām",
        a: 2
    },
    {
        q: "Personas datu apstrāde sākotnēji neparedzētiem mērķiem ir pieļaujama tikai tad, ja...",
        a1: "1. Tiek veikti zinātniskie vai statistiskie pētījumi",
        a2: "2. Tā tiek veikta pilsoņiem, kuri ir atstājuši Latvijas vai ES teritoriju",
        a3: "3. Tā tiek veikta likumpārkāpējiem un personām, kuras atrodas apcietinājumā",
        a4: "4. Personai ir Latvijas nepilsoņa statuss",
        a: 1
    },
    {
        q: "Kādā gadījumā sensitīvo personas datu apstrāde ir atļauta?",
        a1: "1. Lai aizsargātu datu subjekta finansiālās intereses, bet datu subjekts tiesiski vai fiziski nav spējīgs dot tam savu piekrišanu",
        a2: "2. Lai aizsargātu datu subjekta vai citas personas dzīvību un veselību, un datu subjekts tiesiski vai fiziski nav spējīgs dot savu piekrišanu",
        a3: "3. Lai aizsargātu datu subjekta vai citas personas identitāti pirmstiesas izmeklēšanas laikā, ja datu subjekta vai personas dzīvībai vai veselībai draud briesmas",
        a4: "4. Nekādi izņēmuma gadījumi nav pieļaujami",
        a: 2
    },
    //31 - 40
    {
        q: `Ministru kabineta noteikumos Nr.280 (Kārtība, kādā aizsargājama informācija dienesta vajadzībām), ir noteikts, ka statusu "informācija dienesta vajadzībām" var noteikt...`,
        a1: "1. Tikai attiecīgās iestādes vadītājs ar rakstisku rīkojumu, kā arī informācijas autors",
        a2: "2. Tikai attiecīgā ministrija, kuras pakļautībā atrodas attiecīgā iestāde, kā arī informācijas autors",
        a3: "3. Tikai ES institūcija, kuras pakļautībā atrodas attiecīgā nozares iestāde, kā arī informācijas autors",
        a4: "4. Visiem Aizsardzības ministrijas un NATO valstu savstarpējās apmaiņas dokumentiem ",
        a: 1
    },
    {
        q: "Informāciju dienesta vajadzībām drīkst apstrādāt elektroniski un to var pārraidīt caur publisko datu pārraides tīklu aizsargātā veidā. Aizsardzības līmeni un veidu (šifrēšanu) nodrošina...",
        a1: "1. Publiskā tīkla operators",
        a2: "2. Informācijas sūtītājs visa veida aizsardzību nodrošina pats",
        a3: "3. Satversmes aizsardzības birojs",
        a4: "4. Kibernoziegumu uzraudzības nodaļa",
        a: 3
    },
    {
        q: `Latvijā radītai informācijai statusu "informācija dienesta vajadzībām" nosaka uz...`,
        a1: "1. 1 gadu",
        a2: "2. 5 gadiem",
        a3: "3. 10 gadiem",
        a4: "4. Neierobežotu laiku",
        a: 1
    },
    {
        q: `Kas jāņem vērā, projektējot aizsargātu datu pārraides tīklu saskaņā ar Ministru kabineta noteikumiem Nr. 764 "Valsts informācijas sistēmu vispārējās tehniskās prasības"?`,
        a1: "1. Sistēmā nedrīkst izmantot programmatūru, ar kuru veic auditācijas pierakstus",
        a2: "2. Sistēmas lietotāja saskarnei jānodrošina iespēja sūtīt un saņemt datus, lietojot tikai konkrēta (sertificēta) ražotāja izstrādātos datņu formātus un datu pārraides protokolus",
        a3: "3. Sistēmas lietotāja saskarnes veidošanai jāizmanto programmatūra, kas nav piesaistīta konkrētajām tehniskajām iekārtām vai konkrētajai operētājsistēmai",
        a4: "4. Sistēmas dokumentācija jāveido tā, lai  persona nevarētu izdarīt izmaiņas sistēmā vai kaut kādā veidā ietekmēt sistēmas darbību",
        a: 3
    },
    {
        q: `Kādas prasības jāievēro, lietojot jau esošus sistēmas tehniskos resursus (datorus, datu nesējus, datortīkla iekārtas un citas tehniskās iekārtas, kuras nodrošina sistēmas darbību) saskaņā ar Ministru kabineta noteikumiem Nr.764 "Valsts informācijas sistēmu vispārējās tehniskās prasības"?`,
        a1: "1. Iekārtu lietošanai jānodrošina sistēmas drošība un sistēmas darbība integrētā valsts informācijas sistēmā",
        a2: "2. Iekārtu lietošana jānodrošina sistēmas drošība un sistēmas darbība integrētā ES valstu  informācijas sistēmā",
        a3: "3. Iekārtas garantijas laikā nav aizvietojamas ar citu ražotāju piedāvātajiem tehniskajiem resursiem",
        a4: "4. Var izmantot vairāku ražotāju iekārtas, kuru drošības politika nav pretrunā viena otrai",
        a: 1
    },
    {
        q: "Valsts informācijas sistēmu likums nosaka, ka Valsts informācijas sistēmu darbības koordināciju nodrošina...",
        a1: "1. Satiksmes ministrijas Sakaru departaments",
        a2: "2. Satversmes aizsardzības birojs",
        a3: "3. Datu valsts inspekcija",
        a4: "4. Vides aizsardzības un reģionālās attīstības ministrija",
        a: 4
    },
    {
        q: "Valsts informācijas sistēmas datu bāze ir valsts īpašums, savukārt informācijas tehnoloģijas un informācijas pārraides līdzekļi...",
        a1: "1. Var būt tikai valsts īpašums",
        a2: "2. Var būt tikai privātīpašums",
        a3: "3. Var būt gan publiskais, gan privātais īpašums",
        a4: "4. Var būt tikai pašvaldības īpašums",
        a: 3
    },
    {
        q: "Kādā veidā, saskaņā ar Informācijas atklātuma likumu, ir jābūt publiski pieejamai valsts informācijas sistēmai ?",
        a1: "1. Tai ir jābūt pieejamai caur Internet tīkli, bet jāveic  lietotāju identitātes un piekļuves tiesību pārbaude, nodrošinot pieeju tikai daļai no informācijas datu bāzes, saskaņā ar normatīvajiem aktiem",
        a2: "2. Tai ir jābūt pieejamai tikai caur slēgtu aizsargātu iekšējo tīklu; jāveic  lietotāju identitātes un piekļuves tiesību pārbaude, nodrošinot pieeju tikai daļai no informācijas datu bāzes, saskaņā ar normatīvajiem aktiem",
        a3: "3. Tai ir jābūt pieejamai caur Internet tīklu, nekāda  lietotāju identitātes un piekļuves tiesību pārbaude nav jāveic, visai informācijai ir jābūt publiski brīvi pieejamai",
        a4: "4. Tai ir jābūt pieejamai tika īpaši apmācītiem cilvēkiem, jo visa valsts informācijas sistēma ir aizsargājama pret nesankcionētu piekļuvi",
        a: 1
    },
    {
        q: "Valsts informācijas sistēmas aizsardzībai var tikt izmantoti gan fiziskie, gan loģiskie aizsardzības līdzekļi. Loģiskie aizsardzības līdzekļi ir...",
        a1: "1. Autentifikācijas un autorizācijas protokolu izmantošana lietotāja identifikācijai",
        a2: "2. Datu pārraides plūsmas ievietošana VPN tuneļos un informācijas šifrēšana šajos tuneļos",
        a3: "3. Ugunsmūru, VPN un VLAN tīklu organizēšana, veidojot loģiski atsaistītus datu pārraides tīklus",
        a4: "4. Jebkuri informācijas un programmatūras aizsardzības līdzekļi, kas, nodrošinot sistēmas lietotāja identitātes un piekļuves tiesību pārbaudi, pasargā informāciju no tīšas vai nejaušas grozīšanas vai dzēšanas",
        a: 4
    },
    {
        q: "Ministru kabineta noteikumos Nr.357 (Noteikumi par sertifikācijas pakalpojumu sniegšanas informācijas sistēmu, iekārtu un procedūru drošības aprakstā norādāmo informāciju) ir noteikts, ka, lai saņemtu iekārtu un procedūru akreditāciju, sertifikācijas pakalpojumu sniedzējs Datu valsts inspekcijā iesniedz...",
        a1: "1. Drošības aprakstu, kurā norāda informācijas sistēmu, iekārtu un procedūru drošības atbilstību normatīvajiem aktiem, kas attiecas uz sertifikācijas pakalpojumiem",
        a2: "2. Programmatūras drošības sertifikātus no programmatūras izstrādātāja",
        a3: "3. Aparatūras ražotāja garantijas un drošības sertifikātus",
        a4: "4. Personu, kuras ir apmācītas izmantot sistēmas un iekārtas, kas attiecas uz sertifikācijas pakalpojumiem, sarakstu",
        a: 1
    },
    //41 - 50
    {
        q: "Ministru kabineta noteikumos Nr.71 (Valsts informācijas sistēmu attīstības projektu uzraudzības kārtība) ir noteikts, ka informācijas sistēma ir nepārtraukti jāattīsta, tāpēc attīstības projektu analīze ir jāveic ...",
        a1: "1. Reizi gadā",
        a2: "2. Reizi pusgadā",
        a3: "3. Reizi divos gados",
        a4: "4. Reizi četros gados",
        a: 2
    },
    {
        q: "Ministru kabineta noteikumos Nr.100 (Informācijas tehnoloģiju kritiskās infrastruktūras drošības pasākumu plānošanas un īstenošanas kārtība) ir noteikts, ka par kritiskās infrastruktūras drošību nedrīkst būt atbildīga persona...",
        a1: "1. Kura ir vai ir bijusi PSRS, Latvijas PSR vai kādas ārvalsts drošības dienesta štata vai ārštata darbinieks, aģents, rezidents vai konspiratīvā dzīvokļa turētājs",
        a2: "2. Kurai nav dota pieeja valsts noslēpumam",
        a3: "3. Kura amatu savienošanas kārtībā veic līdzīgus pienākumus privātajās struktūrās",
        a4: "4. Kurai ir tuvākās pakāpes radinieki valstīs, kuras nav ES un NATO sastāvā",
        a: 1
    },
    {
        q: "Kas drīkst veikt pārbaudes informācijas resursiem un tehnoloģijām, kuras infrastruktūras īpašnieks vai tiesiskais valdītājs iekļāvis kritiskās infrastruktūras kopumā?",
        a1: "1. Datu valsts inspekcija, par to iepriekš nebrīdinot kritiskās infrastruktūras īpašnieku",
        a2: "2. Drošības incidentu novēršanas institūcija, kas ne vēlāk kā 48 stundas pirms pārbaudes uzsākšanas rakstiski informē par pārbaudes laiku un ilgumu",
        a3: "3. Tīkla operators, kurš projektējis un montējis kritisko tīkla infrastruktūru",
        a4: "4. Kibernoziegumu uzraudzības nodaļa, par to iepriekš nevienu nebrīdinot",
        a: 2
    },
    {
        q: "Ministru kabineta noteikumos Nr. 358 (Sertifikācijas pakalpojumu sniegšanas informācijas sistēmu, iekārtu un procedūru drošības pārbaudes kārtība un termiņi) ir noteikts, ka eksperti veic sertifikācijas pakalpojumu sniegšanas informācijas sistēmu, iekārtu un procedūru drošības pārbaudes...",
        a1: "1. Vienu reizi 12 mēnešos, vai pēc Datu valsts inspekcijas tūlītēja pieprasījuma",
        a2: "2. Vienu reizi 6 mēnešos, vai pēc Valsts policijas pieprasījuma",
        a3: "3. Pēc Satversmes aizsardzības biroja tūlītēja pieprasījuma",
        a4: "4. Pēc Drošības incidentu novēršanas institūcijas tūlītēja pieprasījuma",
        a: 1
    },
    {
        q: "Ministru kabineta noteikumos Nr.358 (Sertifikācijas pakalpojumu sniegšanas informācijas sistēmu, iekārtu un procedūru drošības pārbaudes kārtība un termiņi) ir noteikts, ka ekspertam ir obligāti jāpārbauda…",
        a1: "1. Telpu, kurās atrodas tīkla infrastruktūras iekārtas, stāvoklis, un to atbilstība drošības līmenim",
        a2: "2. Sertifikācijas pakalpojumu sniegšanas informācijas sistēmas, iekārtas un procedūras atbilstība sertifikācijas pakalpojumu sniegšanas noteikumiem",
        a3: "3. Personāla,  kas apkalpo informācijas sistēmu, apmācības līmenis",
        a4: "4. Ļaunprātīgas programmatūras esamība tīkla infrastruktūrā un nelicencētas programmatūras izmantošanas gadījumumi",
        a: 2
    },
    {
        q: "Kādu saīsinājumu (abreviatūru)  izmanto publisko atslēgu kriptogrāfijas tehnoloģijas apzīmējumam?",
        a1: "1. PKI",
        a2: "2. PIK",
        a3: "3. KIP",
        a4: "4. IKP",
        a: 1
    },
    {
        q: "Kurš likums regulē intelektuālā īpašuma tiesības?",
        a1: "1. Autortiesību likums",
        a2: "2. Darba aizsardzības likums",
        a3: "3. Darba drošības likums",
        a4: "4. Komerclikums",
        a: 1
    },
    {
        q: "Kura LR ministrija ir atbildīga par autortiesību praktisko aizsardzību?",
        a1: "1. Aizsardzības ministrija",
        a2: "2. Iekšlietu ministrija",
        a3: "3. Izglītības ministrija",
        a4: "4. Veselības ministrija",
        a: 2
    },
    {
        q: "Kā apzīmē kvalitātes pārvaldības sistēmas sertificēšanas standartu?",
        a1: "1. ISO 900",
        a2: "2. ISO 9000",
        a3: "3. ISO 9001",
        a4: "4. ISO 9010",
        a: 3
    },
    {
        q: "Kurš standarts izmantojams tieši programmatūras izstrādē?",
        a1: "1. ISO 9001",
        a2: "2. CMM",
        a3: "3. MMC",
        a4: "4. MCM",
        a: 2
    },
    //51 - 60
    {
        q: "Cik minūtes ieteicams atpūsties pēc divu stundu darba pie datora?",
        a1: "1. 5 min.",
        a2: "2. 10 min.",
        a3: "3. 15 min.",
        a4: "4. 20 min.",
        a: 3
    },
    {
        q: "Kuras no uzskaitītajām veselības pārbaudēm darba devējam jānodrošina darbiniekiem, kuri ar datoru strādā vismaz 2 stundas dienā, atbilstoši MK noteikumiem Nr.527?",
        a1: "1. Paaugstinātas redzes sasprindzinājuma un fiziskas pārslodzes pārbaude",
        a2: "2. Paaugstinātas redzes sasprindzinājuma vai  fiziskas pārslodzes pārbaude",
        a3: "3. Tikai paaugstinātas redzes sasprindzinājuma pārbaude",
        a4: "4. Tikai fiziskas pārslodzes pārbaude",
        a: 1
    },
    {
        q: "Ieteicamā darba telpas platība vienam darbiniekam ir vismaz...",
        a1: "1. 3 m2",
        a2: "2. 3.8 m2",
        a3: "3. 4.2 m2",
        a4: "4. 4.8 m2",
        a: 4
    },
    {
        q: "Kādai ir jābūt  apgaismojuma intensitātei rakstīšanas, drukāšanas, lasīšanas un datu apstrādes telpās?",
        a1: "1. 100 lx",
        a2: "2. 300 lx",
        a3: "3. 500 lx",
        a4: "4. 700 lx",
        a: 3
    },
    {
        q: "Kāds trokšņa līmenis ir pieļaujams lielās biroju darba telpās un telpās ar biroju tehniku?",
        a1: "1. 40 dB",
        a2: "2. 45 dB",
        a3: "3. 50 dB",
        a4: "4. 55 dB",
        a: 2
    },
    {
        q: "Kāds ir minimālais cilvēka dzīvībai bīstamais spriegums?",
        a1: "1. Spriegums virs 12 V",
        a2: "2. Spriegums virs 42 V",
        a3: "3. Spriegums virs 60 V",
        a4: "4. Spriegums virs 220 V",
        a: 1
    },
    {
        q: "Kas ietilpst uzņēmuma darba vides iekšējā uzraudzībā? ",
        a1: "1. Uzņēmuma personāla uzskaite",
        a2: "2. Uzņēmuma gada pārskats",
        a3: "3. Darba vides risku novērtēšana",
        a4: "4. Amata apraksti",
        a: 3
    },
    {
        q: "Par kādiem jautājumiem darba devējam jākonsultējas ar nodarbinātajiem? ",
        a1: "1. Par darba samaksas sistēmas izveidi",
        a2: "2. Par darba vides risku novērtēšanu",
        a3: "3. Par uzņēmuma stratēģisko attīstību",
        a4: "4. Par uzņēmuma  grāmatvedības sistēmas izveidi",
        a: 2
    },
    {
        q: "Pirmreizējā veselības pārbaude jāveic...",
        a1: "1. Trīs darbdienu laikā pēc darba līguma noslēgšanas",
        a2: "2. Pirms darba līguma noslēgšanas",
        a3: "3. Vienas nedēļas laikā pēc darba līguma noslēgšanas",
        a4: "4. Dienu pēc darba līguma noslēgšanas",
        a: 2
    },
    {
        q: "Nodarbinātajam stājoties darbā, darba devējam jānodrošina...",
        a1: "1. Tematiskā apmācība un mērķa instruktāža",
        a2: "2. Instruktāža darba vietā un tematiskā apmācība",
        a3: "3. Ievadapmācība un instruktāža darba vietā",
        a4: "4. Ievadapmācība un tematiskā apmācība",
        a: 3
    },
    //61 - 70
    {
        q: "Kādēļ darba drošības problēmām, kas saistītas ar ergonomiku, netiek pievērsta vajadzīgā uzmanība?",
        a1: "1. Veselības problēmas nav sajūtamas uzreiz",
        a2: "2. Ergonomika attiecas tikai uz biroja darbiniekiem",
        a3: "3. Veselības problēmas neietekmē uzņēmuma darbu",
        a4: "4. Ergonomika neietekmē darbinieka veselību",
        a: 1
    },
    {
        q: "Kurš no dotajiem ir kolektīvais darba aizsardzības līdzeklis?",
        a1: "1. Darbiniekam izsniegtās aizsargbrilles",
        a2: "2. Dzirdes aizsardzības austiņas",
        a3: "3. Darba aizsardzības drošības zīmes",
        a4: "4. Darba apģērbs un apavi",
        a: 3
    },
    {
        q: "Kurš no dotajiem ir individuālais darba aizsardzības līdzeklis?",
        a1: "1. Dzirdes aizsardzības austiņas",
        a2: "2. Drošības zīmes",
        a3: "3. Instruktāža darba aizsardzībā",
        a4: "4. Nožogojumi",
        a: 1
    },
    {
        q: "Kāda ģeometriska forma ir aizlieguma darba aizsardzības zīmei?",
        a1: "1. Aplis",
        a2: "2. Trijstūris",
        a3: "3. Taisnstūris",
        a4: "4. Kvadrāts",
        a: 1
    },
    {
        q: "Kāda ģeometriska forma ir brīdinājuma darba aizsardzības zīmei?",
        a1: "1. Aplis",
        a2: "2. Trijstūris",
        a3: "3. Taisnstūris",
        a4: "4. Kvadrāts",
        a: 2
    },
    {
        q: "Ugunsdrošības zīmes pamatkrāsojums (signālkrāsojums) ir…",
        a1: "1. Zaļš",
        a2: "2. Sarkans",
        a3: "3. Zils",
        a4: "4. Dzeltens",
        a: 2
    },
    {
        q: "Kāds ir ieteicamais apgaismojums, strādājot  pie datora?",
        a1: "1. 100 lx",
        a2: "2. 300 lx",
        a3: "3. 400 lx",
        a4: "4. 500 lx",
        a: 2
    },
    {
        q: "Kādā trokšņa līmenī nodarbinātajam var rasties veselības problēmas?",
        a1: "1. Virs 10 dBA",
        a2: "2. Virs 40 dBA",
        a3: "3. Virs 60 dBA",
        a4: "4. Virs 80 dBA",
        a: 4
    },
    {
        q: "Ar kādu līgumu darba devējs un darbinieks nodibina darba tiesiskās attiecības?",
        a1: "1. Uzņēmuma līgumu",
        a2: "2. Pilnvarojuma līgumu",
        a3: "3. Darba līgumu",
        a4: "4. Ar darba koplīgumu",
        a: 3
    },
    {
        q: "Kas, saskaņā ar Darba likumu, ir darbinieks?",
        a1: "1. Fiziska vai juridiska persona, kas veic noteiktu darbu par noteiktu samaksu darba devēja vadībā",
        a2: "2. Fiziska vai juridiska persona, kas uz darba līguma pamata par nolīgto darba samaksu veic noteiktu darbu darba devēja vadībā",
        a3: "3. Fiziska persona, kas veic noteiktu darbu par noteiktu samaksu darba devēja vadībā",
        a4: "4. Fiziska persona, kas uz darba līguma pamata par nolīgto darba samaksu veic noteiktu darbu darba devēja vadībā",
        a: 4
    },
    //71 - 80
    {
        q: "Kas, saskaņā ar Darba likumu, ir darba devējs?",
        a1: "1. Fiziska persona vai tiesībspējīga personālsabiedrība, kas uz darba līguma pamata nodarbina vismaz vienu darbinieku",
        a2: "2. Juridiska persona vai tiesībspējīga personālsabiedrība, kas uz darba līguma pamata nodarbina vismaz vienu darbinieku",
        a3: "3. Fiziska vai juridiskā persona, vai tiesībspējīga personālsabiedrība, kas uz darba līguma pamata nodarbina vismaz vienu darbinieku",
        a4: "4. Tiesībspējīga personālsabiedrība, kas uz darba līguma pamata nodarbina vismaz vienu darbinieku",
        a: 3
    },
    {
        q: "Kurš no dotajiem jautājumiem nav pieļaujams darba intervijas laikā?",
        a1: "1. Par pretendenta iegūto izglītību",
        a2: "2. Par pretendenta iepriekšējo darba pieredzi",
        a3: "3. Par pretendenta nacionālo vai etnisko izcelsmi",
        a4: "4. Par pretendenta valodu zināšanām",
        a: 3
    },
    {
        q: "Kādā formā un kad ir slēdzams darba līgums?",
        a1: "1. Mutiski pirms darba uzsākšanas",
        a2: "2. Rakstveidā pirms darba uzsākšanas",
        a3: "3. Mutiski pēc darba uzsākšanas",
        a4: "4. Rakstveidā pēc darba uzsākšanas",
        a: 2
    },
    {
        q: "Kādu termiņu paredz Darba likums uz noteiktu laiku noslēgtam darba līgumam (ieskaitot termiņa pagarinājumus)?",
        a1: "1. Tas nevar būt ilgāks par vienu gadu",
        a2: "2. Tas nevar būt ilgāks par diviem gadiem",
        a3: "3. Tas nevar būt ilgāks par trīs gadiem",
        a4: "4. Tas nevar būt ilgāks par četriem gadiem",
        a: 3
    },
    {
        q: "Kāds ir pārbaudes laika maksimālais termiņš, noslēdzot darba līgumu ar darbinieku?",
        a1: "1. Viens mēnesis",
        a2: "2. Divi mēneši",
        a3: "3. Trīs mēneši",
        a4: "4. Četri mēneši",
        a: 3
    },
    {
        q: "Cik dienas iepriekš pārbaudes laikā darba devējam un darbiniekam ir tiesības rakstveidā uzteikt darba līgumu?",
        a1: "1. Divas dienas",
        a2: "2. Trīs dienas",
        a3: "3. Četras dienas",
        a4: "4. Septiņas dienas",
        a: 2
    },
    {
        q: "Kas nosaka minimālās mēneša darba algas noteikšanas un pārskatīšanas kārtību?",
        a1: "1. Darba devējs",
        a2: "2. Uzņēmuma grāmatvedis",
        a3: "3. Latvijas Republikas Saeima",
        a4: "4. Ministru kabinets",
        a: 4
    },
    {
        q: "Kuru piemaksu veidu minimālie apmēri ir noteikti Darba likumā?",
        a1: "1. Piemaksai par papildu darbu un piemaksai par darbu, kas saistīts ar īpašu risku",
        a2: "2. Piemaksai par virsstundu darbu vai darbu svētku dienā, un piemaksai par darbu, kas saistīts ar īpašu risku",
        a3: "3. Piemaksai par nakts darbu un piemaksai par virsstundu darbu vai darbu svētku dienā",
        a4: "4. Piemaksai par nakts darbu un piemaksai par papildu darbu",
        a: 3
    },
    {
        q: "Kāds uzteikuma termiņš saskaņā ar Darba likumu jāievēro darba devējam, uzteicot darba līgumu, ja darbinieks, veicot darbu, rīkojies prettiesiski un tādēļ zaudējis darba devēja uzticību?",
        a1: "1. Nekavējoties",
        a2: "2. Piecas dienas ",
        a3: "3. Desmit dienas",
        a4: "4. Viens mēnesis",
        a: 1
    },
    {
        q: "Kāds ir darbinieka normālais dienas darba studnu skaits?",
        a1: "1. 7 stundas",
        a2: "2. 8 stundas",
        a3: "3. 10 stundas",
        a4: "4. 12 stundas",
        a: 2
    }
];
const PROGRAMMESANA = [
    //1 - 10
    {
        q: "Kuru no nosauktajiem operatoriem Pascal valodā ieteicams izmantot, ja nepieciešams noteikt, vai skaitlis ir pāra vai nepāra?",
        a1: "1. DIV",
        a2: "2. MOD",
        a3: "3. SQR",
        a4: "4. SQRT",
        a: 2
    },
    {
        q: "Kurš no šiem apgalvojumiem par masīviem Visual Basic valodā ir pareizs?",
        a1: "1. Dinamiskā masīva garums nevar mainīties programmas laikā",
        a2: "2. Fiksēta masīva garums var tikt mainīts  programmas laikā tikai vienu reizi",
        a3: "3. Dinamiskā masīva garums var tikt mainīts programmas laikā vairākas reizes",
        a4: "4. Dinamiskā masīva garums var tikt mainīts programmas laikā tikai vienu reizi",
        a: 3
    },
    {
        q: "Kas norāda cikla Do beigas Visual Basic valodā?",
        a1: "1. Loop",
        a2: "2. Exit",
        a3: "3. Until",
        a4: "4. Next",
        a: 1
    },
    {
        q: "Elementi masīvā ir sakārtoti …",
        a1: "1. Vērtību augošā secībā",
        a2: "2. Indeksu augošā secībā",
        a3: "3. Indeksu dilstošā secībā ",
        a4: "4. Vērtību dilstošā secībā",
        a: 2
    },
    {
        q: "Kas norāda konkrēto masīva elementu?",
        a1: "1. Masīva garums",
        a2: "2. Masīva nosaukums",
        a3: "3. Masīva indekss",
        a4: "4. Elementa vērtība",
        a: 3
    },
    {
        q: "Ja kāds operators vai operatoru grupa programmā jāizpilda vairākas reizes pēc kārtas, ir izdevīgi veidot…",
        a1: "1. Rekursiju",
        a2: "2. Ciklu",
        a3: "3. Funkciju",
        a4: "4. Komandu",
        a: 2
    },
    {
        q: "Kas ir programmēšanas vide?",
        a1: "1. Aparatūras un programmatūras rīku kopums, kam jāatbalsta programmu gatavošana",
        a2: "2. Aparatūras un programmatūras rīku kopums, kam jāatbalsta programmu izmantošana",
        a3: "3. Programmatūras rīku kopums, kam jāatbalsta programmu gatavošana",
        a4: "4. Programmatūras rīku kopums",
        a: 1
    },
    {
        q: "Kurā vietā programmu izstrādes vidē var  importēt failus (piemēram, attēlus) uz jebkuru citu aplikāciju?",
        a1: "1. New Project",
        a2: "2. Select Resource",
        a3: "3. Import Source",
        a4: "4. Insert Source",
        a: 3
    },
    {
        q: "Kurš no šiem cikliem var neizpildīties nevienu reizi?",
        a1: "1. Repeat …. Until",
        a2: "2. For … to …. Do …",
        a3: "3. While … do …",
        a4: "4. For … Downto …. Do …",
        a: 3
    },
    {
        q: "Mainīgie, kas nepieciešami vienas aplikācijas vairākos moduļos, Visual Basic valodā jādefinē kā … ",
        a1: "1. Private",
        a2: "2. Dim",
        a3: "3. Global",
        a4: "4. Public",
        a: 4
    },
    //11 - 20
    {
        q: "Kura no dotajām nav objektorientēta programēšanas valoda?",
        a1: "1. C",
        a2: "2. Java",
        a3: "3. Python",
        a4: "4. PHP",
        a: 1
    },
    {
        q: "Kas ir algoritms?",
        a1: "1. Ļoti precīzs un skaidrs paskaidrojums, kā ir jārīkojas, lai sasniegtu kādu mērķi vai atrisinātu kādu problēmu",
        a2: "2. Komandu virkne, kur kādas no uzskaitītajām darbībām var nepildīt",
        a3: "3. Vispusīgs darbību apraksts, lai pietuvinātos atrisinājumam",
        a4: "4. Darbību virkne aprēķinu veikšanai",
        a: 1
    },
    {
        q: "Programma, kas Asambler valodā rakstītās instrukcijas pārvērš mašīnvalodas komandās (objektkodos), ir…",
        a1: "1. Kompilators",
        a2: "2. Interpretators",
        a3: "3. JavaScript",
        a4: "4. Dekompilators",
        a: 1
    },
    {
        q: "Kas ir klase objektorientētā programmēšanā?",
        a1: "1. Šablons, pēc kura tiek veidoti objekti",
        a2: "2. Objektu grupa",
        a3: "3. Funkciju un mainīgo grupa",
        a4: "4. Šablons, pēc kura tiek veidotas saskarnes (interfeisi)",
        a: 1
    },
    {
        q: "Datu objekts, kura datu vērtība ir cita datu objekta adrese, ir …",
        a1: "1. Klons",
        a2: "2. Masīvs",
        a3: "3. Publiskais mainīgais",
        a4: "4. Rādītājs (Pointers)",
        a: 4
    },
    {
        q: "Kurš nav koda kvalitātes rādītājs?",
        a1: "1. Koda komentāri ",
        a2: "2. Koda sakārtotība",
        a3: "3. Koda izmērs",
        a4: "4. Kodēšanas valoda",
        a: 4
    },
    {
        q: "Kura no dotajām vienībām ir vismazākā?",
        a1: "1. Apakšsistēma",
        a2: "2. Programma",
        a3: "3. Modulis",
        a4: "4. Procedūra",
        a: 4
    },
    {
        q: "Galīga sakārtota viennozīmīgu kārtulu kopa kādas problēmas risināšanai ir …",
        a1: "1. Modelis",
        a2: "2. Algoritms",
        a3: "3. Simulācija",
        a4: "4. Programma",
        a: 2
    },
    {
        q: "Programma konkrētajā datora valodā ir…",
        a1: "1. Bloks",
        a2: "2. Modulis",
        a3: "3. Kods",
        a4: "4. Algoritms",
        a: 3
    },
    {
        q: "Ko programmēšanā nozīmē saīsinājums STL?",
        a1: "1. System translate library",
        a2: "2. Standard template library",
        a3: "3. System transaction libary",
        a4: "4. Standart traking library",
        a: 2
    },
    //21 - 30
    {
        q: "Kurā no algoritma struktūras veidiem darbības tiek veiktas viena aiz otras?",
        a1: "1. Lineārajā",
        a2: "2. Sazarotajā",
        a3: "3. Cikliskajā",
        a4: "4. Saliktajā",
        a: 1
    },
    {
        q: "Programma, kura sadalīta vienā vai vairākos vienumos, un katram vienumam ir viena vai vairākas procedūras (funkcijas), kuras risina kādu uzdevumu un satur mainīgos, ir ….",
        a1: "1. Modulārā (Procedurālā) programmēšana",
        a2: "2. Funkcionālā programmēšana",
        a3: "3. Strukturālā programmēšana",
        a4: "4. Objektu orientētā programmēšana",
        a: 2
    },
    {
        q: "Programmatūra, kas būvēta uz moduļu hierarhijas bāzes, kurā katram no moduļiem ir tikai viena ieeja un viena izeja, ir...",
        a1: "1. Modulārā (Procedurālā) programmēšana",
        a2: "2. Funkcionālā programmēšana",
        a3: "3. Strukturālā programmēšana",
        a4: "4. Objektorientētā programmēšana",
        a: 3
    },
    {
        q: "Programmēšana, kas izmanto analoģiju ar objektiem ir …",
        a1: "1. Modulārā (Procedurālā) programmēšana",
        a2: "2. Funkcionālā programmēšana",
        a3: "3. Strukturālā programmēšana",
        a4: "4. Objektorientētā programmēšana",
        a: 4
    },
    {
        q: "Kurš no dotajiem datu tipiem atgriež True vai False vērtības?",
        a1: "1. Bool un Bolean",
        a2: "2. Integer un Long Int",
        a3: "3. Char un Unsigned char",
        a4: "4. Double un Long Double",
        a: 1
    },
    {
        q: "Dots programmas pieraksta fragments: X:=M DIV 2 vai X=M DIV 2. Noteikt, kāda būs X vērtība, ja M=15.",
        a1: "1. X=1",
        a2: "2. X=3",
        a3: "3. X=7",
        a4: "4. X=15",
        a: 4
    },
    {
        img: "./main/images/6.27.png",
        q: "Dots programmas fragments. Noteikt, kāda būs gala vērtība.",
        a1: "1. A=2",
        a2: "2. A=10",
        a3: "3. A=20",
        a4: "4. A=22",
        a: 4
    },
    {
        img: "./main/images/6.28.png",
        q: `Dots programmas fragments. Noteikt, pie kurām dotajām x un y vērtībām tiks izvadīts teksts "Patiess nosacijums"`,
        a1: "1. x=10; y=20",
        a2: "2. x=3; y=201",
        a3: "3. x=3; y=21",
        a4: "4. x=1; y=11",
        a: 4
    },
    {
        q: "Ko programmēšanā nozīmē vārds operators, piemēram, if.. then ...else, for, utt.?",
        a1: "1. Cilvēks, kurš strādā ar datoru",
        a2: "2. Pabeigta valodas frāze, kas nosaka kādu etapu datu apstrādē",
        a3: "3. Mainīgais, kas pēc katras darbības maina savu vērtību",
        a4: "4. Datu elementi, kuri programmas izpildes gaitā nemaina savu vērtību",
        a: 2
    },
    {
        q: "Kas ir masīvs?",
        a1: "1. Dati, kurus veido vienāda tipa elementi, kur katram elementam ir savs unikālais indekss",
        a2: "2. Liels atmiņas apjoms",
        a3: "3. Datu struktūra, kas sastāv no noteikta skaita komponenšu",
        a4: "4. Programmas definīciju daļa",
        a: 1
    },
    //31 - 40
    {
        q: "Kāda ir ieraksta definīcija  programmēšanā?",
        a1: "1. Datu struktūra, kas sastāv no noteikta skaita komponenšu, kuras sauc par ieraksta laukiem",
        a2: "2. Darbības process, kura izpildes gaitā informāciju ieraksta  atmiņā",
        a3: "3. Dati, kurus veido viena tipa fiksēts elementu skaits",
        a4: "4. Datu saglabāšana fiziskā diskā",
        a: 1
    },
    {
        q: "Ja ir zināms cikla atkārtošanās reižu skaits, vislabāk lietot…",
        a1: "1. Beznosacījuma pārejas operatoru",
        a2: "2. Ciklu ar priekšnosacījumu",
        a3: "3. Ciklu ar pēcnosacījumu",
        a4: "4. Ciklu ar skaitītāju",
        a: 4
    },
    {
        q: "Ja vēlas, lai cikls izpildītos vismaz vienu reizi, jālieto...",
        a1: "1. Beznosacījuma pārejas operators",
        a2: "2. Cikls ar priekšnosacījumu",
        a3: "3. Cikls ar pēcnosacījumu",
        a4: "4. Cikls ar skaitītāju",
        a: 3
    },
    {
        q: "Kurā no dotajiem variantiem ir uzrādītas teksta funkcijas, kas nosaka virknes garumu?",
        a1: "1. Strlen vai length",
        a2: "2. Strcat vai  concant",
        a3: "3. Strcpy vai copy",
        a4: "4. Strcmp",
        a: 1
    },
    {
        q: "Kas ir masīva indekss?",
        a1: "1. Tas pats, kas atsevišķs masīva elements",
        a2: "2. Masīva elementa numurs",
        a3: "3. Masīvā rindas numurs",
        a4: "4. Masīva pirmais elements",
        a: 2
    },
    {
        img: "./main/images/6.36.png",
        q: "Dots programmas fragments. Kurā no gadījumiem pareizi uzrādītas izvadāmās vērtības, ja mainīgā vērtību ievada 1 (a=1)?",
        a1: "1M=2; 2M=4; 3M=6; 4M=8; 5M=10",
        a2: "5M=2; 4M=4; 3M=6; 2M=8; 1M=10",
        a3: "2=1M; 4=2M; 6=3M; 8=4M; 10=5M",
        a4: "2=5M; 4=4M; 6=3M; 8=2M; 10=1M",
        a: 2
    },
    {
        q: "Ja nepieciešams sasummēt masīva a(i) vērtības, cikla konstrukcijā ir jāizmanto izteiksme...",
        a1: "1. sum:=sum+a[i] vai sum=sum+a[i] ",
        a2: "2. sum:=sum+a(i) vai sum=sum+a(i) ",
        a3: "3. sum:=a[1]+a[2]+…+a[i] vai sum=a[1]+a[2]+…+a[i]",
        a4: "4. sum:=a(1)+a(2)+…+a(i) vai sum=a(1)+a(2)+…+a(i)",
        a: 1
    },
    {
        q: "Kāda ir atšķirība starp procedūrām un funkcijām?",
        a1: "1. Funkcijas no procedūrām atšķiras ar to, ka to darbības rezultāts tiek atgriezts galvenajai programmas daļai kā vērtība, ko var piešķirt mainīgajam",
        a2: "2. Procedūras rēķina aritmētiskās un fizikas funkcijas, bet funkcijas tiek izpildītas",
        a3: "3. Procedūras tiek izpildītas, bet funkcijas rēķina aritmētiskās un fizikas funkcijas",
        a4: "4. Procedūras var apstrādāt globālos mainīgos, bet funkcijas - tikai lokālos",
        a: 1
    },
    {
        img: "./main/images/6.39.png",
        q: "Kas tiks izvadīts uz ekrāna Pascal programmas darbības laikā?",
        a1: "1. *1*2*3*4*5*6*7*8*9*10",
        a2: "2. 1*2*3*4*5*6*7*8*9*10*10",
        a3: "3. *10*9*8*7*6*5*4*3*2*1",
        a4: "4. 10*9*8*7*6*5*4*3*2*1*",
        a: 2
    },
    {
        img: "./main/images/6.40.png",
        q: "Kas tiks izvadīts uz ekrāna Pascal programmas darbības laikā?",
        a1: "1. 20406080",
        a2: "2. 246810",
        a3: "3. 12345678910",
        a4: "4. 13579",
        a: 2
    }
]; 
