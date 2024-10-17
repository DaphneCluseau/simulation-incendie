function controlerConfig(){
    // Vérifier que la longueur et la heuteur de la grille indiquées soit bien des nombres supérieurs ou égaux à 0
    if(isNaN(l) || l <= 0){
        alert("La longueur doit être un nombre entier supérieur à 0.");
        return false;
    }
    if(isNaN(h) || h <= 0){
        alert("La hauteur doit être un nombre entier supérieur à 0.");
        return false;
    }

    // Vérifier que les coordonnées des cases en feu soient bien des nombres compris entre 0 et la longueur/heuteur meximale
    for(i = 0 ; i < coordInitFeu.length ; i++){
        if(coordInitFeu[i].length != 2){
            alert("Le tableau doit contenir deux coordonnées X et Y.");
            return false;
        }
        if(isNaN(coordInitFeu[i][0]) || coordInitFeu[i][0] < 0 || coordInitFeu[i][0] >= l){
            alert("La coordonnée X doit être un nombre entier compris entre 0 inclus et " + l + ".");
            return false;
        }
        if(isNaN(coordInitFeu[i][1]) || coordInitFeu[i][1] < 0 || coordInitFeu[i][1] >= h){
            alert("La coordonnée Y doit être un nombre entier compris entre 0 inclus et " + h + ".");
            return false;
        }
    }

    // Vérifier que le taux de probabilité d'incendie soit bien un nombre compris entre 0 et 1 inclus
    if(isNaN(probaFeuTaux) || probaFeuTaux < 0 || probaFeuTaux > 1){
        alert("Le taux de probabilité d'incendie doit être un nombre compris entre 0 et 1 inclus.");
        return false;
    }
    return true;
}

function afficherGrille(longueur, hauteur){
    let grille = document.getElementById("grille");
    let nvLigne;
    let nvCase;
    for(let i = 0 ; i < hauteur ; i++){
        // Créer la ligne
        nvLigne = document.createElement("tr");
        
        // Créer les colonnes
        for(let j = 0 ; j < longueur ; j++){
            nvCase = document.createElement("td");
            nvCase.id = "caseY" + i + "X" + j;
            nvCase.className = "intact";
            nvLigne.appendChild(nvCase);
        }
        
        // Ajouter la ligne à la grille
        grille.appendChild(nvLigne);
    }
}

function initFeu(tabFeu){
    for(i = 0; i < tabFeu.length ; i++){
        brulerCase(tabFeu[i][0], tabFeu[i][1]);
    }
}

function initSimulation(){
    if(controlerConfig() === true){
        afficherGrille(l, h);
        initFeu(coordInitFeu);
    }
}

// Colorer la case qui brûle en rouge
// x = colonne
// y = ligne
function brulerCase(bX,bY){
    let caseABruler = document.getElementById("caseY" + bY + "X" + bX);
    if(caseABruler.className === "intact"){
        caseABruler.className = "brule";
    }
}

// Colorer la case qui a brûlé en gris
// x = colonne
// y = ligne
function cendrerCase(caseACendrer){
    caseACendrer.className = "cendre";
}

// Calculer la probabilité qu'une case prenne feu
// Si oui, la brûler
// Sinon, ne rien faire
function probaFeu(caseEnFeu){
    let p = false;
    let fX = 0;
    let fY = 0;

    tabXY = caseEnFeu.id.split("X");
    fY = Number(tabXY[0].replace("caseY", ""));
    fX = Number(tabXY[1]);

    let nord = fY - 1;
    let sud = fY + 1;
    let ouest = fX - 1;
    let est = fX + 1;

    // Case nord
    if(nord >= 0){
        p = Boolean(Math.random() < probaFeuTaux);
        if(p === true){
            brulerCase(fX, nord);
        }
    }
    // Case est
    if(est < l){
        p = Boolean(Math.random() < probaFeuTaux);
        if(p === true){
            brulerCase(est, fY);
        }
    }
    // Case sud
    if(sud < h){
        p = Boolean(Math.random() < probaFeuTaux);
        if(p === true){
            brulerCase(fX, sud);
        }
    }
    // Case ouest
    if(ouest >= 0){
        p = Boolean(Math.random() < probaFeuTaux);
        if(p === true){
            brulerCase(ouest, fY);
        }
    }
}

function etapeSuivante(){
    let tabXY;
    let x = 0;
    let y = 0;

    // Chercher les cases qui sont en feu
    // Attention à la copie par référence !
    let casesEnFeu = [...document.getElementsByClassName("brule")];
    for(let i = 0 ; i < casesEnFeu.length ; i++){
        y = 0;
        x = 0;

        // Récupérer les coordonnées de la case en feu
        tabXY = casesEnFeu[i].id.split("X");
        y = Number(tabXY[0].replace("caseY", ""));
        x = Number(tabXY[1]);

        // Estimer les probabilités qu'une case prenne feu
        probaFeu(casesEnFeu[i]);

        // Griser la case brûlée initiale
        cendrerCase(casesEnFeu[i]);
    }
}