// ============================================
// UNDERCOVER - SCRIPT COMPLET
// ============================================


// ============================================
// LISTE DES 100 PAIRES DE MOTS
// ============================================

const WORD_PAIRS = [

    { normal: "Whsky", undercover: "Pastis" },
    { normal: "Batman", undercover: "Superman" },
    { normal: "Cheval", undercover: "Poney" },
    { normal: "Western", undercover: "Lucky Luke" },
    { normal: "Suicide Squaad", undercover: "Thunderbolts" },
    { normal: "Ronaldo", undercover: "Messi" },
    { normal: "Poker", undercover: "Blackjack" },
    { normal: "Mamie Lou", undercover: "Mamie Joël" },
    { normal: "Bardella", undercover: "Hitler" },
    { normal: "Voldemort", undercover: "Dark Vador" },

    { normal: "Gandalf", undercover: "Dumbledore" },
    { normal: "Julien", undercover: "Jean Guillome" },
    { normal: "Grogu", undercover: "Cassiopée" },
    { normal: "Ramadan", undercover: "Shabbat" },
    { normal: "Prise", undercover: "Bastille" },
    { normal: "Padel", undercover: "Tennis" },
    { normal: "Four", undercover: "Micro-ondes" },
    { normal: "Napoléon", undercover: "Charlemagne" },
    { normal: "Monopoly", undercover: "Bonne paye" },
    { normal: "T-shirt", undercover: "Claquette" },

    { normal: "Cheveux", undercover: "Shampoing" },
    { normal: "Serviette", undercover: "Torchon" },
    { normal: "Jambon", undercover: "Saucisson" },
    { normal: "Bière", undercover: "Jus" },
    { normal: "Café", undercover: "Canabis" },
    { normal: "Canapé", undercover: "Lit" },
    { normal: "Odyssée", undercover: "Iliade" },
    { normal: "Château", undercover: "Cabane" },
    { normal: "Église", undercover: "Mosquée" },
    { normal: "Popeye (bronzé)", undercover: "Pépette (bronzé)" },

    { normal: "Acteur X", undercover: "Professeur" },
    { normal: "Bénévole", undercover: "Élève" },
    { normal: "Policier", undercover: "Gendarme" },
    { normal: "Papa", undercover: "Maman" },
    { normal: "Mercredi", undercover: "Vendredi" },
    { normal: "Bière", undercover: "Vodka" },
    { normal: "Péter", undercover: "Roter" },
    { normal: "Jul", undercover: "Indochine" },
    { normal: "Vietnam", undercover: "Etat Unis" },
    { normal: "Gérard Depardieu", undercover: "Charlie Chaplin" }

];


// ============================================
// VARIABLES
// ============================================

let playerCount = 4;

let undercoverCount = 1;

let whiteCount = 0;

let players = [];

let currentPlayer = null;

let currentWordPair = null;

let currentTurn = 0;

let gameStarted = false;

let reviewingProfile = false;

let turnsRemainingThisRound = 0;

let lastEliminatedPlayer = null;


// ============================================
// ELEMENTS HTML
// ============================================

const homeScreen =
    document.getElementById("homeScreen");

const namesScreen =
    document.getElementById("namesScreen");

const distributionScreen =
    document.getElementById("distributionScreen");


const roleModal =
    document.getElementById("roleModal");

const reviewModal =
    document.getElementById("reviewModal");

const reviewPlayerList =
    document.getElementById("reviewPlayerList");


const eliminationModal =
    document.getElementById("eliminationModal");

const eliminationPlayerList =
    document.getElementById("eliminationPlayerList");

const eliminationRevealModal =
    document.getElementById(
        "eliminationRevealModal"
    );


const whiteGuessModal =
    document.getElementById("whiteGuessModal");

const whiteGuessInput =
    document.getElementById("whiteGuessInput");


const gameOverModal =
    document.getElementById("gameOverModal");


const playerCards =
    document.getElementById("playerCards");

const playersInputs =
    document.getElementById("playersInputs");


const playerCountDisplay =
    document.getElementById("playerCountDisplay");

const undercoverCountDisplay =
    document.getElementById(
        "undercoverCountDisplay"
    );

const whiteCountDisplay =
    document.getElementById("whiteCountDisplay");

const configurationMessage =
    document.getElementById(
        "configurationMessage"
    );


// ============================================
// CHANGEMENT D'ÉCRAN
// ============================================

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(function(element) {

            element.classList.remove("active");

        });


    if (screen) {

        screen.classList.add("active");

    }

}


// ============================================
// PROTECTION HTML
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// ============================================
// MÉLANGE
// ============================================

function shuffle(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


// ============================================
// JOUEURS ENCORE EN VIE
// ============================================

function getActivePlayers() {

    return players.filter(
        function(player) {

            return !player.eliminated;

        }
    );

}


function getActivePlayerCount() {

    return getActivePlayers().length;

}


function findFirstActivePlayer() {

    return players.findIndex(
        function(player) {

            return !player.eliminated;

        }
    );

}


function findNextActivePlayer(index) {

    if (players.length === 0) {

        return -1;

    }


    for (
        let i = 1;
        i <= players.length;
        i++
    ) {

        const nextIndex =
            (index + i) %
            players.length;


        if (
            !players[nextIndex].eliminated
        ) {

            return nextIndex;

        }

    }


    return -1;

}


// ============================================
// COMPTEURS DE LA PAGE D'ACCUEIL
// ============================================

function updateConfiguration() {

    playerCountDisplay.textContent =
        playerCount;

    undercoverCountDisplay.textContent =
        undercoverCount;

    whiteCountDisplay.textContent =
        whiteCount;

    configurationMessage.textContent =
        "";

}


// ============================================
// CHOISIR UNE PAIRE DE MOTS
// ============================================

function chooseWordPair() {

    const index =
        Math.floor(
            Math.random() *
            WORD_PAIRS.length
        );


    return WORD_PAIRS[index];

}


// ============================================
// ATTRIBUTION DES RÔLES
// ============================================

function assignRoles() {

    currentWordPair =
        chooseWordPair();


    const roles = [];


    const civilianCount =
        playerCount
        - undercoverCount
        - whiteCount;


    // Civils

    for (
        let i = 0;
        i < civilianCount;
        i++
    ) {

        roles.push("civil");

    }


    // Undercover

    for (
        let i = 0;
        i < undercoverCount;
        i++
    ) {

        roles.push("undercover");

    }


    // Mister White

    for (
        let i = 0;
        i < whiteCount;
        i++
    ) {

        roles.push("white");

    }


    const shuffledRoles =
        shuffle(roles);


    players.forEach(
        function(player, index) {

            player.role =
                shuffledRoles[index];


            if (
                player.role === "civil"
            ) {

                player.word =
                    currentWordPair.normal;

            }

            else if (
                player.role === "undercover"
            ) {

                player.word =
                    currentWordPair.undercover;

            }

            else {

                player.word =
                    null;

            }

        }
    );

}


// ============================================
// NOUVEL ORDRE DES PARTICIPANTS
// ============================================

function randomizePlayerOrder() {

    players =
        shuffle(players);

}


// ============================================
// MISTER WHITE NE PEUT PAS ÊTRE PREMIER
// ============================================

function ensureWhiteNotFirst() {

    if (players.length < 2) {

        return;

    }


    if (
        players[0].role !== "white"
    ) {

        return;

    }


    const replacementIndex =
        players.findIndex(
            function(player, index) {

                return (
                    index > 0 &&
                    player.role !== "white"
                );

            }
        );


    if (
        replacementIndex !== -1
    ) {

        [
            players[0],
            players[replacementIndex]
        ] =
        [
            players[replacementIndex],
            players[0]
        ];

    }

}


// ============================================
// CREER LES CARTES JOUEURS
// ============================================

function createPlayerCards() {

    playerCards.innerHTML =
        "";


    players.forEach(
        function(player) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "player-card";


            // Joueur éliminé

            if (
                player.eliminated
            ) {

                card.classList.add(
                    "eliminated"
                );

            }


            let statusText;


            if (
                player.eliminated
            ) {

                statusText =
                    "Éliminé";

            }

            else if (
                player.revealed
            ) {

                statusText =
                    "Rôle consulté";

            }

            else if (
                gameStarted
            ) {

                statusText =
                    "Joueur en jeu";

            }

            else {

                statusText =
                    "En attente";

            }


            card.innerHTML = `

                <div class="player-avatar">
                    ${escapeHTML(
                        player.name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </div>

                <div class="player-name">
                    ${escapeHTML(
                        player.name
                    )}
                </div>

                <div class="player-status">
                    ${statusText}
                </div>

            `;


            if (
                !player.eliminated
            ) {

                card.addEventListener(
                    "click",
                    function() {

                        openRole(player);

                    }
                );

            }


            playerCards.appendChild(
                card
            );

        }
    );

}


// ============================================
// AFFICHAGE DU TOUR
// ============================================

function updateTurnDisplay() {

    const turnLabel =
        document.getElementById(
            "turnLabel"
        );


    const turnName =
        document.getElementById(
            "currentTurnName"
        );


    const instruction =
        document.getElementById(
            "gameInstruction"
        );


    const startButton =
        document.getElementById(
            "startParticipation"
        );


    const reviewButton =
        document.getElementById(
            "reviewProfileButton"
        );


    const nextButton =
        document.getElementById(
            "nextTurn"
        );


    if (
        players.length === 0
    ) {

        return;

    }


    // ========================================
    // DISTRIBUTION DES RÔLES
    // ========================================

    if (!gameStarted) {

        nextButton.style.display =
            "none";


        const allRevealed =
            players.every(
                function(player) {

                    return player.revealed;

                }
            );


        if (
            allRevealed
        ) {

            turnLabel.textContent =
                "DISTRIBUTION TERMINÉE";


            turnName.textContent =
                "Tout le monde est prêt !";


            instruction.textContent =
                "Tous les joueurs ont vu leur rôle. Vous pouvez maintenant commencer la partie.";


            startButton.style.display =
                "block";


            reviewButton.style.display =
                "block";

        }

        else {

            turnLabel.textContent =
                "DISTRIBUTION DES RÔLES";


            turnName.textContent =
                "Au tour de " +
                players[currentTurn].name;


            instruction.textContent =
                "Le joueur indiqué doit cliquer sur son profil. Les autres joueurs ne doivent pas regarder.";


            startButton.style.display =
                "none";


            reviewButton.style.display =
                "none";

        }


        return;

    }


    // ========================================
    // PARTIE EN COURS
    // ========================================

    turnLabel.textContent =
        "C'EST AU TOUR DE";


    turnName.textContent =
        players[currentTurn].name;


    instruction.textContent =
        players[currentTurn].name +
        " doit maintenant donner son indice.";


    startButton.style.display =
        "none";


    reviewButton.style.display =
        "block";


    nextButton.style.display =
        "block";

}


// ============================================
// CONTENU DU ROLE
// ============================================

function showRoleContent(player) {

    const roleIcon =
        document.getElementById(
            "roleIcon"
        );


    const roleTitle =
        document.getElementById(
            "roleTitle"
        );


    const roleDescription =
        document.getElementById(
            "roleDescription"
        );


    const secretWord =
        document.getElementById(
            "secretWord"
        );


    const secretWordContainer =
        document.getElementById(
            "secretWordContainer"
        );


    // Civil

    if (
        player.role === "civil"
    ) {

        roleIcon.textContent =
            "👨‍🌾";


        roleTitle.textContent =
            "Civil";


        roleDescription.textContent =
            "Tu es un Civil. Trouve les joueurs qui ont un mot différent.";


        secretWordContainer.style.display =
            "block";


        secretWord.textContent =
            player.word;

    }


    // Undercover

    else if (
        player.role === "undercover"
    ) {

        roleIcon.textContent =
            "🕵️";


        roleTitle.textContent =
            "Undercover";


        roleDescription.textContent =
            "Ton mot est différent de celui des Civils. Ne te fais pas repérer.";


        secretWordContainer.style.display =
            "block";


        secretWord.textContent =
            player.word;

    }


    // Mister White

    else {

        roleIcon.textContent =
            "🤍";


        roleTitle.textContent =
            "Mister White";


        roleDescription.textContent =
            "Tu n'as aucun mot. Essaie de deviner le mot des Civils.";


        secretWordContainer.style.display =
            "none";


        secretWord.textContent =
            "";

    }

}


// ============================================
// REVELER LE ROLE
// ============================================

function openRole(player) {

    // Pendant la partie, les profils
    // ne servent pas à révéler un rôle.

    if (gameStarted) {

        alert(
            "Le jeu a commencé. Utilise « Revoir un profil » pour consulter un rôle."
        );

        return;

    }


    // Pendant la distribution,
    // un joueur déjà consulté ne peut pas recommencer.

    if (
        player.revealed
    ) {

        return;

    }




    currentPlayer =
        player;


    showRoleContent(
        player
    );


    roleModal.classList.remove(
        "hidden"
    );

}


// ============================================
// BOUTON OK / CACHER LE ROLE
// ============================================

document
    .getElementById(
        "hideRole"
    )
    .addEventListener(
        "click",
        function() {


            // Consultation d'un profil

            if (
                reviewingProfile
            ) {

                roleModal.classList.add(
                    "hidden"
                );


                currentPlayer =
                    null;


                reviewingProfile =
                    false;


                return;

            }


            // Distribution normale

            if (
                currentPlayer === null
            ) {

                return;

            }


            currentPlayer.revealed =
                true;


            roleModal.classList.add(
                "hidden"
            );


            currentPlayer =
                null;


if (!gameStarted) {
    currentTurn = players.findIndex(function(player) {
        return !player.revealed;
    });

    if (currentTurn === -1) {
        currentTurn = 0;
    }
}



            createPlayerCards();

            updateTurnDisplay();

        }
    );


// ============================================
// REVOIR UN PROFIL
// ============================================

function openReviewMenu() {

    reviewPlayerList.innerHTML =
        "";


    players.forEach(
        function(player) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "review-player-button";


            button.innerHTML = `

                <span class="review-avatar">
                    ${escapeHTML(
                        player.name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        player.name
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                function() {

                    reviewModal.classList.add(
                        "hidden"
                    );


                    reviewingProfile =
                        true;


                    currentPlayer =
                        player;


                    showRoleContent(
                        player
                    );


                    roleModal.classList.remove(
                        "hidden"
                    );

                }
            );


            reviewPlayerList.appendChild(
                button
            );

        }
    );


    reviewModal.classList.remove(
        "hidden"
    );

}


// Bouton Revoir

document
    .getElementById(
        "reviewProfileButton"
    )
    .addEventListener(
        "click",
        function() {

            openReviewMenu();

        }
    );


// Bouton Fermer

document
    .getElementById(
        "closeReview"
    )
    .addEventListener(
        "click",
        function() {

            reviewModal.classList.add(
                "hidden"
            );

        }
    );


// ============================================
// COMMENCER LA VRAIE PARTIE
// ============================================

document
    .getElementById(
        "startParticipation"
    )
    .addEventListener(
        "click",
        function() {

            gameStarted =
                true;


            currentTurn =
                findFirstActivePlayer();


            turnsRemainingThisRound =
                getActivePlayerCount();


            createPlayerCards();

            updateTurnDisplay();

        }
    );


// ============================================
// JOUEUR SUIVANT
// ============================================

document
    .getElementById(
        "nextTurn"
    )
    .addEventListener(
        "click",
        function() {


            if (
                !gameStarted
            ) {

                return;

            }


            // Le joueur actuel vient de finir son indice

            turnsRemainingThisRound--;


            // Tout le monde vivant a parlé

            if (
                turnsRemainingThisRound <= 0
            ) {

                document.getElementById(
                    "nextTurn"
                ).style.display =
                    "none";


                openEliminationMenu();

                return;

            }


            // Joueur vivant suivant

            currentTurn =
                findNextActivePlayer(
                    currentTurn
                );


            updateTurnDisplay();

        }
    );


// ============================================
// MENU D'ELIMINATION
// ============================================

function openEliminationMenu() {

    eliminationPlayerList.innerHTML =
        "";


    players.forEach(
        function(player) {


            // Joueur déjà éliminé

            if (
                player.eliminated
            ) {

                return;

            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "review-player-button";


            button.innerHTML = `

                <span class="review-avatar">
                    ${escapeHTML(
                        player.name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        player.name
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                function() {

                    eliminatePlayer(
                        player
                    );

                }
            );


            eliminationPlayerList.appendChild(
                button
            );

        }
    );


    eliminationModal.classList.remove(
        "hidden"
    );

}


// ============================================
// ELIMINER UN JOUEUR
// ============================================

function eliminatePlayer(player) {

    eliminationModal.classList.add(
        "hidden"
    );


    player.eliminated =
        true;


    player.revealed =
        true;


    lastEliminatedPlayer =
        player;


    createPlayerCards();


    showEliminatedPlayerRole(
        player
    );

}


// ============================================
// REVELER LE ROLE ELIMINE
// ============================================

function showEliminatedPlayerRole(
    player
) {

    const icon =
        document.getElementById(
            "eliminationRoleIcon"
        );


    const title =
        document.getElementById(
            "eliminationRoleTitle"
        );


    const description =
        document.getElementById(
            "eliminationRoleDescription"
        );


    if (
        player.role === "civil"
    ) {

        icon.textContent =
            "👨‍🌾";


        title.textContent =
            "Civil";

    }


    else if (
        player.role === "undercover"
    ) {

        icon.textContent =
            "🕵️";


        title.textContent =
            "Undercover";

    }


    else {

        icon.textContent =
            "🤍";


        title.textContent =
            "Mister White";

    }


    description.textContent =
        player.name +
        " était " +
        title.textContent +
        ".";


    eliminationRevealModal.classList.remove(
        "hidden"
    );

}


// ============================================
// ANNULER L'ELIMINATION
// ============================================

document
    .getElementById(
        "cancelElimination"
    )
    .addEventListener(
        "click",
        function() {

            eliminationModal.classList.add(
                "hidden"
            );


            updateTurnDisplay();

        }
    );


// ============================================
// FERMER LA REVELATION DU ROLE ELIMINE
// ============================================

document
    .getElementById(
        "closeEliminationReveal"
    )
    .addEventListener(
        "click",
        function() {

            eliminationRevealModal.classList.add(
                "hidden"
            );


            if (
                !lastEliminatedPlayer
            ) {

                return;

            }


            // Mister White doit deviner

            if (
                lastEliminatedPlayer.role ===
                "white"
            ) {

                whiteGuessInput.value =
                    "";


                whiteGuessModal.classList.remove(
                    "hidden"
                );


                whiteGuessInput.focus();


                return;

            }


            finishElimination();

        }
    );


// ============================================
// MISTER WHITE DEVINE LE MOT
// ============================================

document
    .getElementById(
        "validateWhiteGuess"
    )
    .addEventListener(
        "click",
        function() {


            const guess =
                whiteGuessInput.value.trim();


            if (
                guess === ""
            ) {

                alert(
                    "Écris un mot avant de valider."
                );


                whiteGuessInput.focus();


                return;

            }


            whiteGuessModal.classList.add(
                "hidden"
            );


            const correctWord =
                currentWordPair.normal;


            if (
                guess.toLowerCase() ===
                correctWord.toLowerCase()
            ) {

                endGame(
                    "Mister White gagne !",
                    "Mister White a trouvé le mot des Civils."
                );


                return;

            }


            alert(
                "Mauvaise réponse ! Mister White est éliminé."
            );


            finishElimination();

        }
    );


// ============================================
// CONDITIONS DE VICTOIRE
// ============================================

function checkWinConditions() {

    const remainingCivilians =
        players.filter(
            function(player) {

                return (
                    player.role === "civil" &&
                    !player.eliminated
                );

            }
        ).length;


    const remainingUndercover =
        players.filter(
            function(player) {

                return (
                    player.role === "undercover" &&
                    !player.eliminated
                );

            }
        ).length;


    // Tous les Civils sont éliminés

    if (
        remainingCivilians === 0
    ) {

        endGame(
            "Les Undercover gagnent !",
            "Tous les Civils ont été éliminés."
        );


        return true;

    }


    // Tous les Undercover sont éliminés

    if (
        undercoverCount > 0 &&
        remainingUndercover === 0
    ) {

        endGame(
            "Les Civils gagnent !",
            "Tous les Undercover ont été éliminés."
        );


        return true;

    }


    return false;

}


// ============================================
// FIN D'UNE ELIMINATION
// ============================================

function finishElimination() {


    // Vérifier la victoire

    if (
        checkWinConditions()
    ) {

        return;

    }


    // Trouver le prochain joueur vivant

    const eliminatedIndex =
        players.indexOf(
            lastEliminatedPlayer
        );


    const nextPlayerIndex =
        findNextActivePlayer(
            eliminatedIndex
        );


    if (
        nextPlayerIndex === -1
    ) {

        return;

    }


    currentTurn =
        nextPlayerIndex;


    turnsRemainingThisRound =
        getActivePlayerCount();


    createPlayerCards();


    updateTurnDisplay();

}


// ============================================
// FIN DE PARTIE
// ============================================

function endGame(
    title,
    description
) {

    gameStarted =
        false;


    document.getElementById(
        "gameOverTitle"
    ).textContent =
        title;


    document.getElementById(
        "gameOverDescription"
    ).textContent =
        description;


    document.getElementById(
        "nextTurn"
    ).style.display =
        "none";


    document.getElementById(
        "reviewProfileButton"
    ).style.display =
        "none";


    document.getElementById(
        "startParticipation"
    ).style.display =
        "none";


    gameOverModal.classList.remove(
        "hidden"
    );

}


// Nouvelle partie après la fin

document
    .getElementById(
        "newRoundAfterGame"
    )
    .addEventListener(
        "click",
        function() {

            gameOverModal.classList.add(
                "hidden"
            );


            newRound();

        }
    );


// Retour menu après la fin

document
    .getElementById(
        "backToMenuAfterGame"
    )
    .addEventListener(
        "click",
        function() {

            gameOverModal.classList.add(
                "hidden"
            );


            backToMenu();

        }
    );


// ============================================
// CREER LES CHAMPS DES NOMS
// ============================================

function createNameInputs() {

    playersInputs.innerHTML =
        "";


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "player-input";


        div.innerHTML = `

            <div class="player-number">
                ${i + 1}
            </div>

            <input
                type="text"
                id="playerName${i}"
                placeholder="Nom du joueur ${i + 1}"
                maxlength="20"
                autocomplete="off"
            >

        `;


        playersInputs.appendChild(
            div
        );

    }

}


// ============================================
// NOMBRE DE JOUEURS +
// ============================================

document
    .getElementById(
        "increasePlayers"
    )
    .addEventListener(
        "click",
        function() {

            if (
                playerCount < 100
            ) {

                playerCount++;

                updateConfiguration();

            }

        }
    );


// ============================================
// NOMBRE DE JOUEURS -
// ============================================

document
    .getElementById(
        "decreasePlayers"
    )
    .addEventListener(
        "click",
        function() {

            if (
                playerCount > 3
            ) {

                playerCount--;


                // Garder au moins un Civil

                while (
                    undercoverCount +
                    whiteCount >=
                    playerCount
                ) {

                    if (
                        whiteCount > 0
                    ) {

                        whiteCount--;

                    }

                    else if (
                        undercoverCount > 0
                    ) {

                        undercoverCount--;

                    }

                }


                updateConfiguration();

            }

        }
    );


// ============================================
// UNDERCOVER +
// ============================================

document
    .getElementById(
        "increaseUndercover"
    )
    .addEventListener(
        "click",
        function() {

            if (
                undercoverCount +
                whiteCount <
                playerCount - 1
            ) {

                undercoverCount++;

                updateConfiguration();

            }

        }
    );


// ============================================
// UNDERCOVER -
// ============================================

document
    .getElementById(
        "decreaseUndercover"
    )
    .addEventListener(
        "click",
        function() {

            if (
                undercoverCount > 0
            ) {

                undercoverCount--;

                updateConfiguration();

            }

        }
    );


// ============================================
// MISTER WHITE +
// ============================================

document
    .getElementById(
        "increaseWhite"
    )
    .addEventListener(
        "click",
        function() {

            if (
                undercoverCount +
                whiteCount <
                playerCount - 1
            ) {

                whiteCount++;

                updateConfiguration();

            }

        }
    );


// ============================================
// MISTER WHITE -
// ============================================

document
    .getElementById(
        "decreaseWhite"
    )
    .addEventListener(
        "click",
        function() {

            if (
                whiteCount > 0
            ) {

                whiteCount--;

                updateConfiguration();

            }

        }
    );


// ============================================
// CONTINUER VERS LES NOMS
// ============================================

document
    .getElementById(
        "continueToNames"
    )
    .addEventListener(
        "click",
        function() {

            if (
                undercoverCount +
                whiteCount >=
                playerCount
            ) {

                configurationMessage.textContent =
                    "Il doit rester au moins un joueur Civil.";


                return;

            }


            createNameInputs();


            showScreen(
                namesScreen
            );

        }
    );


// ============================================
// RETOUR ACCUEIL
// ============================================

document
    .getElementById(
        "backToHome"
    )
    .addEventListener(
        "click",
        function() {

            backToMenu();

        }
    );


// ============================================
// DEMARRER LA DISTRIBUTION
// ============================================

document
    .getElementById(
        "startGame"
    )
    .addEventListener(
        "click",
        function() {

            const names =
                [];


            // Récupérer les noms

            for (
                let i = 0;
                i < playerCount;
                i++
            ) {

                const input =
                    document.getElementById(
                        "playerName" + i
                    );


                const name =
                    input.value.trim();


                if (
                    name === ""
                ) {

                    alert(
                        "Merci de renseigner tous les noms."
                    );


                    input.focus();


                    return;

                }


                names.push(
                    name
                );

            }


            // Vérifier les doublons

            const normalized =
                names.map(
                    function(name) {

                        return name.toLowerCase();

                    }
                );


            if (
                new Set(normalized).size !==
                names.length
            ) {

                alert(
                    "Deux joueurs ne peuvent pas avoir le même nom."
                );


                return;

            }


            // Créer les joueurs

            players =
                names.map(
                    function(name, index) {

                        return {

                            id: index,

                            name: name,

                            role: null,

                            word: null,

                            revealed: false,

                            eliminated: false

                        };

                    }
                );


            // Première partie

            newRound();

        }
    );


// ============================================
// NOUVELLE PARTIE
// GARDE LES JOUEURS
// CHANGE L'ORDRE + MOTS + ROLES
// ============================================

document
    .getElementById(
        "newRound"
    )
    .addEventListener(
        "click",
        function() {

            newRound();

        }
    );


function newRound() {

    // Fermer toutes les fenêtres

    roleModal.classList.add(
        "hidden"
    );

    reviewModal.classList.add(
        "hidden"
    );

    eliminationModal.classList.add(
        "hidden"
    );

    eliminationRevealModal.classList.add(
        "hidden"
    );

    whiteGuessModal.classList.add(
        "hidden"
    );

    gameOverModal.classList.add(
        "hidden"
    );


    // Réinitialiser les joueurs

    players.forEach(
        function(player) {

            player.revealed =
                false;

            player.role =
                null;

            player.word =
                null;

            player.eliminated =
                false;

        }
    );


    // Nouvel ordre

    randomizePlayerOrder();


    // Nouveaux rôles + nouveau mot

    assignRoles();


    // Mister White ne peut pas être premier

    ensureWhiteNotFirst();


    // Premier joueur

    currentTurn =
        findFirstActivePlayer();


    currentPlayer =
        null;


    reviewingProfile =
        false;


    gameStarted =
        false;


    turnsRemainingThisRound =
        0;


    lastEliminatedPlayer =
        null;


    createPlayerCards();


    showScreen(
        distributionScreen
    );


    updateTurnDisplay();

}


// ============================================
// RETOUR AU MENU
// ============================================

function backToMenu() {

    roleModal.classList.add(
        "hidden"
    );

    reviewModal.classList.add(
        "hidden"
    );

    eliminationModal.classList.add(
        "hidden"
    );

    eliminationRevealModal.classList.add(
        "hidden"
    );

    whiteGuessModal.classList.add(
        "hidden"
    );

    gameOverModal.classList.add(
        "hidden"
    );


    players =
        [];


    currentPlayer =
        null;


    currentWordPair =
        null;


    currentTurn =
        0;


    gameStarted =
        false;


    reviewingProfile =
        false;


    turnsRemainingThisRound =
        0;


    lastEliminatedPlayer =
        null;


    showScreen(
        homeScreen
    );

}


// ============================================
// INITIALISATION
// ============================================

updateConfiguration();