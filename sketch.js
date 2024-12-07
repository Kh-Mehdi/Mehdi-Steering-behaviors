let pursuer1;
let pursuer2; 
let target;
let obstacles = [];
let vehicles = [];
let flock = [];
let fishImage, requinImage;

function preload() {
  fishImage = loadImage('assets/niceFishtransparent.png');
  requinImage = loadImage('assets/requin.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Création des véhicules poursuivants
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));
  vehicles.push(pursuer1, pursuer2);

  // Ajout de boids pour le comportement de flocking
  for (let i = 0; i < 50; i++) {
    let boid = new Boid(random(width), random(height), fishImage);
    flock.push(boid);
  }

  // Création d'un obstacle au centre
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));

  target = createVector(mouseX, mouseY);
  target.r = 50;
}

function draw() {
  background(0, 0, 0, 100);

  target.set(mouseX, mouseY);

  // Dessin de la cible
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // Dessin des obstacles
  obstacles.forEach((o) => o.show());

  // Mise à jour et dessin des véhicules
  vehicles.forEach((v) => {
    v.applyBehaviors(target, obstacles, vehicles);
    v.update();
    v.show();
  });

  // Mise à jour et dessin des boids (flocking)
  for (let boid of flock) {
    boid.flock(flock, obstacles); // Passez les obstacles ici
    boid.fleeWithTargetRadius(target);
    boid.update();
    boid.show();
  }
}

function mousePressed() {
  // Ajout d'un obstacle à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "green"));
}

function mouseDragged() {
  // Ajout d'un boid à la position de la souris
  const boid = new Boid(mouseX, mouseY, fishImage);
  flock.push(boid);
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
    flock.forEach((b) => (b.r = random(8, 40)));
  }
}
