const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
require('dotenv').config();

let players = [];
let pseudo_Joueur = [process.env.PLAYER1, process.env.PLAYER2, process.env.PLAYER3, process.env.PLAYER4, process.env.PLAYER5];
let image_Joueur = [
  "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/MauricePhoto.png?v=1666706514454",
  "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/LeoPhoto.png?v=1666706516146",
  "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/AdrienPhoto.png?v=1666706516325",
  "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/JeanPaulPhoto.png?v=1666706516235",
  "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/RobertPhoto.png?v=1666706514835",
];
let compteur_question = 0;
let NombrePrenom = getRandomIntInclusive(0, 4);
let prenomJoueur = pseudo_Joueur[NombrePrenom];
let photoJoueur = "";

///////////////////////////////////////////
// DEBUT DES QUESTIONS   //////////////////
//////////////////////////////////////////
let Questionnaire = [
  {
    question: "Comment ça va grosse merde à chier qui pue du pied ?",
    numero: "Question n°1/30",
  },
  {
    question: "Quel est votre jeu vidéo préféré ? nan en vrai jmen fou",
    numero: "Question n°2/30",
  },
  {
    question: "Quel est le dernier son que vous avez écouté ?",
    numero: "Question n°3/30",
  },
  {
    question: "Quel est le pire son de toutes les tapes NoSimp ?",
    numero: "Question n°4/30",
  },
  {
    question:
      "Un bébé de merde pleure dans votre train depuis 4 heures, comment réagiriez vous ?",
    numero: "Question n°5/30",
  },
  {
    question: "Quel est votre dernière commande Uber Eats ? gros lard",
    numero: "Question n°6/30",
  },
  {
    question:
      "Si vous pouviez virer un mec du jazzclub de manière permanente, lequel serait-ce ?",
    numero: "Question n°7/30",
  },
  {
    question: "Fantasmez-vous sur les naines (Cette question vient de Mikaaa il veut se rassurer) ?",
    numero: "Question n°8/30",
  },
  {
    question: "Est-ce que vous vous trouvez objectivement beau ?",
    numero: "Question n°9/30",
  },
  {
    question: "Selon vous, qui est la plus grosse fraude de la musique ?",
    numero: "Question n°10/30",
  },
  {
    question:
      "Quel est la plus grosse célébrité que vous ayez croisé dans votre vie ?",
    numero: "Question n°11/30",
  },
  {
    question: "J'ai plus d'idée de question dit ta taille de bite c'est bon là",
    numero: "Question n°12/30",
  },
  {
    question: "Quel accent vous fait le plus rire ? espèce de raciste va",
    numero: "Question n°13/30",
  },
  {
    question: "Destination de rêve ?",
    numero: "Question n°14/30",
  },
  {
    question: "Vous prenez quel rappeur à la bagarre ?",
    numero: "Question n°15/30",
  },
  {
    question: "La dernière fois que vous avez pleuré, c'était pour quoi ? fragile va",
    numero: "Question n°16/30",
  },
  {
    question: "Quel est le nom de votre animal de compagnie ?",
    numero: "Question n°17/30",
  },
  {
    question:
      "Pour combien accepteriez-vous de porter le nom de famille Parmentier ?",
    numero: "Question n°18/30",
  },
  {
    question: "L'âge de votre première branlette, juste pour savoir ^^ ?",
    numero: "Question n°19/30",
  },
  {
    question: "Quel est l'objet de plus grosse valeur que vous ayez volé ?",
    numero: "Question n°20/30",
  },
  {
    question: "Quel adjectif qualifie le mieux Adam Kujo pour vous ?",
    numero: "Question n°21/30",
  },
  {
    question: "Dites moi votre fantasme sexuel irréalisable ?",
    numero: "Question n°22/30",
  },
  {
    question:
      "FLASH : Nverlate est mort d'une crise cardiaque !! Votre idée de costume à l'enterrement ?",
    numero: "Question n°23/30",
  },
  {
    question:
      "Quel est votre film préféré entre Pas très normales activités et Pataya ?",
    numero: "Question n°24/30",
  },
  {
    question: "Quel est la première chose que vous regardez chez une femme ou un homme je suis pas lgbtophobe salope",
    numero: "Question n°25/30",
  },
  {
    question: "Quand vous étiez gosse, quel était le métier de vos rêves ?",
    numero: "Question n°26/30",
  },
  {
    question:
      "On vous annonce que Happyx la merde à chier à pris de la prison ferme, pour quel motif selon vous",
    numero: "Question n°27/30",
  },
  {
    question: "Votre plus gros défaut physique ?",
    numero: "Question n°28/30",
  },
  {
    question: "Le pire endroit où vous avez chié de la merde ?",
    numero: "Question n°29/30",
  },
  {
    question: "Quel est votre actrice porno préféré et pourquoi la daronne de nell ?",
    numero: "Question n°30/30",
  },
  {
    question:
      "C'est fini ! Préparez-vous à relier les fausses identités aux vraies !",
    numero: "Demutez vous",
  },
];
///////////////////////////////////////////
// FIN DES QUESTIONS   ////////////////////
//////////////////////////////////////////

app.use(express.static(__dirname + "/public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

io.on("connection", function (socket) {
  socket.on("user_join", (name) => {
    NombrePrenom = getRandomIntInclusive(0, 4);
    prenomJoueur = pseudo_Joueur[NombrePrenom];
    photoJoueur = image_Joueur[NombrePrenom];

    CheckPlayer(prenomJoueur);

    const player = {
      id: socket.id,
      name,
      points: 0,
      pseudo: prenomJoueur,
      image: photoJoueur,
    };
    //on ajoute le joueur a la liste de joueurs
    players.push(player);

    console.log(name, " vient de se connecter");

    console.log(players);

    socket.emit("pseudo_joueur", prenomJoueur);

    AttenteUpdate();
  });

  socket.on("send_response", function (name, reponse) {
    if (reponse != "ChronoStart123") {
      increaseReponse(name, reponse);
      CheckReponse();
    }
  });

  socket.on(
    "messagePrivate",
    function (pseudoJoueurEnvoi, pseudoJoueurRecu, reponse) {
      io.emit(
        "MessagePriveEnvoi",
        pseudoJoueurRecu,
        pseudoJoueurEnvoi,
        reponse
      );
      io.emit("updateNotif", pseudoJoueurEnvoi, pseudoJoueurRecu);
    }
  );

  socket.on("voirReponsesJoueur", function (data, name) {
    let reponseJoueur = [];
    let QuestionJoueur = [];
    let j = 0;
    if (data == "joueur1") {
      j = 0;
    }
    if (data == "joueur2") {
      j = 1;
    }
    if (data == "joueur3") {
      j = 2;
    }
    if (data == "joueur4") {
      j = 3;
    }
    if (data == "joueur5") {
      j = 4;
    }
    for (let i = 0; i < 30; i++) {
      QuestionJoueur[i] = Questionnaire[i].question;
    }
    reponseJoueur[0] = players[j].reponse0;
    reponseJoueur[1] = players[j].reponse1;
    reponseJoueur[2] = players[j].reponse2;
    reponseJoueur[3] = players[j].reponse3;
    reponseJoueur[4] = players[j].reponse4;
    reponseJoueur[5] = players[j].reponse5;
    reponseJoueur[6] = players[j].reponse6;
    reponseJoueur[7] = players[j].reponse7;
    reponseJoueur[8] = players[j].reponse8;
    reponseJoueur[9] = players[j].reponse9;
    reponseJoueur[10] = players[j].reponse10;
    reponseJoueur[11] = players[j].reponse11;
    reponseJoueur[12] = players[j].reponse12;
    reponseJoueur[13] = players[j].reponse13;
    reponseJoueur[14] = players[j].reponse14;
    reponseJoueur[15] = players[j].reponse15;
    reponseJoueur[16] = players[j].reponse16;
    reponseJoueur[17] = players[j].reponse17;
    reponseJoueur[18] = players[j].reponse18;
    reponseJoueur[19] = players[j].reponse19;
    reponseJoueur[20] = players[j].reponse20;
    reponseJoueur[21] = players[j].reponse21;
    reponseJoueur[22] = players[j].reponse22;
    reponseJoueur[23] = players[j].reponse23;
    reponseJoueur[24] = players[j].reponse24;
    reponseJoueur[25] = players[j].reponse25;
    reponseJoueur[26] = players[j].reponse26;
    reponseJoueur[27] = players[j].reponse27;
    reponseJoueur[28] = players[j].reponse28;
    reponseJoueur[29] = players[j].reponse29;
    reponseJoueur[30] = players[j].reponse30;
    io.emit("AfficherReponsesJoueur", QuestionJoueur, reponseJoueur, name);
  });

  socket.on("reponse_afficher_final", function (reponses) {
    let playersName = [];
    let playersPseudo = [];
    let imagesJoueur = [];
    for (let i = 0; i < players.length; i++) {
      playersName[i] = players[i].name;
      playersPseudo[i] = players[i].pseudo;
      imagesJoueur[i] = players[i].image;
    }
    io.emit(
      "reponse_afficher_final_All",
      playersName,
      playersPseudo,
      imagesJoueur
    );
  });

  //add message
  socket.on("user_message", function (pseudoJoueur, reponseDuJoueur) {
    if (reponseDuJoueur != process.env.SKIPPING) {
      io.emit("updateNewMessage", pseudoJoueur, reponseDuJoueur);
    } else if (reponseDuJoueur == process.env.SKIPPING) {
      DebutRelier();
    }
  });

  //del message
  socket.on("delete_message", (reponseDuJoueur) => {
    ClearGame();
  });

  socket.on("CommencerJeu", (reponseDuJoueur) => {
    io.emit("StartGame", "lancer le jeu");
    ClearGame();
  });

  //del message
  socket.on("VoirPoints", (data) => {
    const leaderboard = players
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
    io.emit("AfficherPoints", leaderboard);
  });

  //del message
  socket.on("reponse_relier", function (name, reponses) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].name == name) {
        players[i]["reponses31"] = reponses[0];
        players[i]["reponses32"] = reponses[1];
        players[i]["reponses33"] = reponses[2];
        players[i]["reponses34"] = reponses[3];
        players[i]["reponses35"] = reponses[4];
      } else {
      }
    }
    CheckReponsePoints(socket.id);
  });

  socket.on("disconnect", function () {
    //on retire le joueur de la liste
    players = [...players.filter((player) => player.id !== socket.id)];
    ClearGame();
    console.log(socket.id, " vient de se deconnecter");
  });
});

function AttenteUpdate() {
  let pseudoJoueurs = [];
  for (let i = 0; i < players.length; i++) {
    pseudoJoueurs[i] = players[i].name;
  }
  io.emit("update_Attente", pseudoJoueurs);
}

function CheckPlayer(pseudo) {
  let boolean = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].pseudo != pseudo) {
      boolean[i] = true;
    } else {
      boolean[i] = false;
    }
  }
  let checker = (arr) => arr.every((v) => v === true);
  if (checker(boolean)) {
  } else {
    setPseudo();
  }
}

function CheckReponsePoints(id) {
  let JoueurNombre = players.length;
  let ReponsesNumero = [
    "reponses31",
    "reponses32",
    "reponses33",
    "reponses34",
    "reponses35",
  ];
  for (let j = 0; j < players.length; j++) {
    if (players[j].id == id) {
      for (let k = 0; k < JoueurNombre; k++) {
        if (players[k].hasOwnProperty("name")) {
          if (players[j][ReponsesNumero[k]] == players[k].name) {
            increasePoints(id);
          }
        }
      } //FIN DU FOR
    }
  }
}

function increasePoints(id) {
  players = players.map((player) => {
    if (player.id == id) {
      return {
        ...player,
        points: player.points + 10,
      };
    } else {
      return player;
    }
  });
}

function setPseudo() {
  NombrePrenom = getRandomIntInclusive(0, 4);
  prenomJoueur = pseudo_Joueur[NombrePrenom];
  photoJoueur = image_Joueur[NombrePrenom];
  CheckPlayer(prenomJoueur);
}

function ClearGame() {
  io.emit("delete_chat", "");
  updateGame();
}

function updateGame() {
  if (compteur_question >= 30) {
    DebutRelier();
    return;
  }
  io.emit("send_question", Questionnaire[compteur_question]);
  let pseudoJoueurs = [];
  let imageJoueurs = [];
  for (let i = 0; i < players.length; i++) {
    pseudoJoueurs[i] = players[i].pseudo;
    imageJoueurs[i] = players[i].image;
  }
  io.emit("update_players", pseudoJoueurs, imageJoueurs);
}

function DebutRelier() {
  let noms = [];
  let pseudo = [];
  let reponseLeo = [];
  let reponseAdrien = [];
  let reponseRobert = [];
  let reponseJeanPaul = [];
  let reponseMaurice = [];
  for (let i = 0; i < players.length; i++) {
    noms[i] = players[i].name;
    pseudo[i] = players[i].pseudo;
  }
  console.log (noms,pseudo) 
  io.emit("debutRelier", noms, pseudo);
}

function CheckReponse() {
  let boolean = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].hasOwnProperty("reponse" + compteur_question)) {
      boolean[i] = true;
    } else {
      boolean[i] = false;
    }
  }
  let checker = (arr) => arr.every((v) => v === true);
  if (checker(boolean)) {
    compteur_question += 1;
    updateGame();
  }
}

function increaseReponse(name, reponse) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name == name) {
      players[i]["reponse" + compteur_question] = reponse;
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

http.listen(process.env.PORT, function () {
  console.log("listening on : " + process.env.PORT);
});
