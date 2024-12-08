let obstacles = [];
let vehicles = [];
let thiefImage; let copImage;
let mode = null;
const flock = [];
let labelNbBoids;
let messages = [];




function preload() {
  thiefImage = loadImage('assets/thief.png');
  copImage = loadImage('assets/cop.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
// Quelques sliders pour régler les "poids" des trois comportements de flocking
  // flocking en anglais c'est "se rassembler"
  // rappel : tableauDesVehicules, min max val step posX posY propriété
  const posYSliderDeDepart = 10;
  creerUnSlider("Poids alignment", flock, 0, 2, 1.5, 0.1, 10, posYSliderDeDepart, "alignWeight");
  creerUnSlider("Poids cohesion", flock, 0, 2, 1, 0.1, 10, posYSliderDeDepart+30, "cohesionWeight");
  creerUnSlider("Poids séparation", flock, 0, 15, 3, 0.1, 10, posYSliderDeDepart+60,"separationWeight");
  creerUnSlider("Poids boundaries", flock, 0, 15, 10, 1, 10, posYSliderDeDepart+90,"boundariesWeight");
  
  creerUnSlider("Rayon des boids", flock, 4, 40, 6, 1, 10, posYSliderDeDepart+120,"r");
  creerUnSlider("Perception radius", flock, 15, 60, 25, 1, 10, posYSliderDeDepart+150,"perceptionRadius");

  messages.push(creeTexte("Activer le debug: d", 0));
  messages.push(creeTexte("Activer le snake: s", 1));
  messages.push(creeTexte("Activer le suivi du leader: l", 2));
  messages.push(creeTexte("Revenir au mode normal: n", 3));
  messages.push(creeTexte("Creer un Vehicule: v", 4));
  messages.push(creeTexte("Creer plusieurs Vehicules: f", 5));
  messages.push(creeTexte("Creer un voleur: b", 6));
  messages.push(creeTexte("Creer un Obstacle: Click", 7));
  messages.push(creeTexte("Modification tailles voleur: r", 8));

  
  // Création des véhicules poursuivants
  pursuer = new Vehicle(100, 100);
  vehicles.push(pursuer);

  // Ajout de boids pour le comportement de flocking
  for (let i = 0; i < 50; i++) {
    let boid = new Boid(random(width), random(height), thiefImage);
    boid.r = random(80, 150);
    flock.push(boid);
  }
  // Créer un label avec le nombre de boids présents à l'écran
  labelNbBoids = createP("Nombre de voleurs : " + flock.length);
  // couleur blanche
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(10, posYSliderDeDepart+180);

  // Création d'un obstacle au centre
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));

  target = createVector(mouseX, mouseY);
  target.r = 50;

  // requin prédateur
  requin = new Boid(width/2, height/2, copImage);
  requin.r = 150;
  requin.maxSpeed = 7;
  requin.maxForce = 0.5;
}
function creerUnSlider(label, tabVehicules, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY+17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    tabVehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });
  return slider;
}
function creeTexte(label, index) {
  // Position du texte en bas à gauche
  const posX = 20;
  const posY = height - 40 - index * 30; 

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');
  labelP.style('text-align', 'left'); // Alignement à gauche
  labelP.style('font-size', '20px'); // Taille de la police
  labelP.style('margin', '0');

  return labelP;
}


function draw() {
  background(0, 0, 0, 100);
  // mettre à jour le nombre de boids
  labelNbBoids.html("Nombre de voleur : " + flock.length);

  target.set(mouseX, mouseY);

  // Dessin de la cible
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // Dessin des obstacles
  obstacles.forEach((o) => o.show());

  // Mise à jour et dessin des véhicules
  vehicles.forEach((v, index) => {
    if (mode === "snake") {
      let steeringForce;
      if (index === 0) {
        // Suivre la cible
        steeringForce = v.arrive(target, 0); 
      } else {
        let previousVehicle = vehicles[index - 1];
        // Suivre le véhicule précédent
        steeringForce = v.arrive(previousVehicle.pos, 10); 
        //active 
        let avoidForce = v.avoid(obstacles, true);
      steeringForce.add(avoidForce);
      v.applyBehaviors(target, obstacles, vehicles);

      v.applyForce(steeringForce);
      v.applyBehaviors(target, obstacles, vehicles);

      }
      // Ajout de l'évitement d'obstacles
      let avoidForce = v.avoid(obstacles, true);
      steeringForce.add(avoidForce);

      v.applyForce(steeringForce);

    } else if(mode === "leader"){
      v.fleeWithTargetRadiusV(target);
      v.applyBehaviors(target, obstacles, vehicles);

    } 
    else {
      v.applyBehaviors(target, obstacles, vehicles);
    }
    v.update();
    v.show();
  });

  // Mise à jour et dessin des boids (flocking)
  for (let boid of flock) {
    boid.flock(flock, obstacles, vehicles); // Passez les véhicules ici
    boid.fleeWithTargetRadius(target);
    boid.update();
    boid.show();
  }
  // dessin du requin
  let wanderForce = requin.wander();
  wanderForce.mult(1);
  requin.applyForce(wanderForce);

  // calcul du poisson le plus proche
  let seekForce;
  let rayonDeDetection = 70;
  // dessin du cercle en fil de fer jaune
  noFill();
  stroke("yellow");
  ellipse(requin.pos.x, requin.pos.y, rayonDeDetection*2, rayonDeDetection*2);

  let closest = requin.getVehiculeLePlusProche(flock);

  if (closest) {
    // distance entre le requin et le poisson le plus proche
    let d = p5.Vector.dist(requin.pos, closest.pos);
    if(d < rayonDeDetection) {
      // on fonce vers le poisson !!!
      seekForce = requin.seek(closest.pos);
      seekForce.mult(7);
      requin.applyForce(seekForce);
    }
    if (d < 5) {
      // on mange !!!!
      // on retire le poisson du tableau flock
      let index = flock.indexOf(closest);
      flock.splice(index, 1);
    }
  }
  requin.edges();
  requin.update();
  requin.show();
}

function mousePressed() {
  // Ajout d'un obstacle à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "green"));
}



function keyPressed() {
  if (key === 'v') {
    // Ajout d'un véhicule
    vehicles.push(new Vehicle(random(width), random(height)));
  } else if (key === 'd') {
    // Activation/désactivation du mode debug
    Vehicle.debug = !Vehicle.debug;
    Boid.debug = !Boid.debug;
  } else if (key === 'f') {
    // Ajout de plusieurs véhicules
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(20, height / 2);
      v.vel = createVector(random(1, 5), random(1, 5));
      vehicles.push(v);
    }
  } else if (key === 'r') {
    // Modification des tailles des boids
    flock.forEach((b) => (b.r = random(100, 150)));
  }else if (key === 'b') {
    const b = new Boid(mouseX, mouseY, thiefImage);
  
  b.r = random(80, 100);

  flock.push(b);
  }
  //activer le mode snake
  else if (key === 's') {    
    mode = "snake"; 
  }
  //activer le mode suivi du leader
  else if (key === 'l') {    
    mode = "leader"; 
  }
  // Désactiver le mode "snake"
  else if (key === 'n' && (mode === "leader" || mode === "snake")) {
    mode = null; 
  }
  
}
