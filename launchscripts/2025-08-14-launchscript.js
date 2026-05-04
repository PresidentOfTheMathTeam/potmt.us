console.log('Launching... launch script v 3.5.3');
console.log(launcherVersion);



if (launcherVersion == "3.0.2") {
    throw document.write(`<body style="background-color: #2D3748;"><p style="color: white;">Your launcher is out of date! Please redownload at <a style="color: rgb(182, 200, 234);" href="https://president-of-the-math-team.com">president-of-the-math-team.com</a><br>Thank you!</p></body>`);
}

if (!location.hash.includes("#favs=")) {
    location.hash = "";
}

console.log(location.hash.replace("#favs=", "").split(","));

async function loadGames() {

    const gameIDsFetch = await fetch("https://president-of-the-math-team.com/games.json", { method: 'GET', cache: 'no-store' }).then(res => res.json()).catch(err => console.error(err));
    const gamesVersion = gameIDsFetch.version;
    const gameIDs = gameIDsFetch.list;

    const clientHtml = await fetch("https://president-of-the-math-team.com/client/v361.html").then(res => res.text()).catch(err => console.error(err));

    document.write(clientHtml.replace("IfYouSeeThisPleaseReportThisAsABugInTheGoogleFormWithThe-ID1", "v" + launcherVersion).replace("IfYouSeeThisPleaseReportThisAsABugInTheGoogleFormWithThe-ID2", "v" + gamesVersion));

    console.log(gameIDs);

    gameIDs.sort((a, b) => a.name.replace("<br>", "").localeCompare(b.name.replace("<br>", "")));

    let newGames = [];
    let regularGames = [];

    gameIDs.forEach(game => {
        let newGame = false;

        if (game.releaseDate) {
            let releaseDate = new Date(game.releaseDate + " 00:00");
            if (releaseDate > new Date()) {
                return;
            }

            let weekFromRelease = new Date(releaseDate);
            weekFromRelease.setDate(releaseDate.getDate() + 2);

            if (weekFromRelease > new Date()) {
                newGame = true;
            }
        }

        if (game.hidden) return;

        // Separate games into newGames and regularGames
        if (newGame) {
            newGames.push(game);
        } else {
            regularGames.push(game);
        }
    });

    // Combine newGames and regularGames, with newGames appearing first
    const sortedGames = [...newGames, ...regularGames];

    sortedGames.forEach(game => {
        let newGame = newGames.includes(game); // Check if the game is in the newGames list

        var gamecard = createGameCard(game.name, game.elementId, game.id, game.image, game.url, game.description, game.alert, newGame);

        let stringID = game.id.toString();
        console.log(stringID);

        if (location.hash.replace("#favs=", "").split(",").includes(stringID)) {
            console.log("is favorited");
            if (document.getElementById("favoritesList").children.length == 0) {
                document.getElementById("favorites").style.display = "";
            }
            gamecard.getElementsByTagName("button")[1].getElementsByTagName("i")[0].classList.add("favorited");
            gamecard.getElementsByTagName("button")[1].getElementsByTagName("i")[0].classList.remove("grayed");
            gamecard.getElementsByTagName("button")[1].getElementsByTagName("t")[0].innerHTML = "Favorited";
            document.getElementById("favoritesList").appendChild(gamecard);
        } else {
            document.getElementById("gameList").appendChild(gamecard);
        }
    });

    const d = new Date();
    let day = d.getDay();
    console.log(day);

    if (day == 1 || day == 2) {
        document.getElementById("weekOf").innerHTML = getWeekOfString();
        document.getElementById("weeklyUpdate").style.visibility = "visible";
        document.getElementById("weeklyUpdate-blurred-background").style.visibility = "visible";
        document.getElementById("weeklyUpdate-closetext").style.visibility = "visible";
    }

    console.log(day);

    console.log("Completed!")
}

function createGameCard(name, id, saveid, image, url, description, alert, newGame) {
    let gamecard = document.createElement("div");
    gamecard.classList.add("game-card");
    gamecard.id = "gamecard-" + id;
    gamecard.style = "background-image: url('https://president-of-the-math-team.com/img/" + image + "');";
    if (description) {
        description = "<i><br>" + description + "</i>";
    } else {
        description = "";
    }
    if (alert) {
        alert = "alert(`" + alert + "`);";
    } else {
        alert = "";
    }
    if (newGame) {
        newGame = "<div class=\"game-card-new\">NEW!</div>";
    } else {
        newGame = "";
    }
    gamecard.saveid = saveid;
    gamecard.innerHTML = `${newGame}<p>${name}${description}</p><button onclick="${alert}updateURL('${url}');document.getElementById('game-embed').currentgame = '${saveid}';fetch('https://script.google.com/macros/s/AKfycbyKcHblmVVLmZ_6Cr-C5nx2_3GteUD6LJPaVcxNS9rB3wCSWhFroTetIO1eoy1F6XY/exec?id=${saveid}&action=click&key=POTMT-tracking-26').then(res => res.json()).then(data => {console.log('ID:', data.id);console.log('New Count:', data.new_count);}).catch(err => console.error(err));"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch</button><button onclick='favoriteScript(this);'><i class="fa-solid fa-heart grayed"></i><t>Favorite</t></button>`;
    return gamecard;
}

function getWeekOfString(date = new Date()) {
    const getMonday = (d) => {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    const monday = getMonday(new Date(date));
    const monthName = monday.toLocaleDateString('en-US', { month: 'long' });
    const dayWithSuffix = getOrdinalSuffix(monday.getDate());

    return `Week of ${monthName} ${dayWithSuffix}`;
}


loadGames();