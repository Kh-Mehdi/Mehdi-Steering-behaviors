# Mehdi-Steering-behaviors


## Description

Ce projet démontre divers comportements de pilotage pour des agents autonomes dans un environnement 2D. Les agents peuvent exhiber des comportements tels que chercher, fuir, arriver, et plus encore.

## Fonctionnalités

- **Chercher** : Se déplacer vers une cible.
- **Fuir** : S'éloigner d'une cible.
- **Arriver** : Se déplacer vers une cible et ralentir à l'approche.
- **Errer** : Se déplacer dans une direction aléatoire.
- **Poursuivre** : Prédire et se déplacer vers la position future d'une cible en mouvement.
- **Éviter** : Prédire et s'éloigner de la position future d'une cible en mouvement.

## Autres fonctionnalités
**Requin prédateur :**

- Le requin (image du policier) se déplace aléatoirement.
- Il chasse les boids (voleurs) à l’intérieur d’un rayon de détection de 70.
- Lorsqu’un boid est attrapé (distance < 5), il est supprimé de la simulation.

**Affichage des messages :**

- Une liste des commandes disponibles s’affiche en bas à gauche de l’écran.
- Le nombre actuel de boids (voleurs) est affiché dynamiquement.

## Sliders interactifs :

- Les sliders permettent de modifier en temps réel les comportements des boids, comme :
- Poids d'alignement, cohésion et séparation.
- Rayon de perception et taille des boids.

## Commandes 

- **v**: Créer un véhicule à une position aléatoire.
- **d** : Activer/désactiver le mode débogage pour les véhicules et boids.
- **f** : Créer 10 véhicules à des positions initiales définies.
- **r** : Modifier aléatoirement la taille des boids (voleurs).
- **b** : Créer un nouveau boid (voleur) à la position de la souris.
- **s** : Activer le mode snake où les véhicules suivent un chemin en évitant les obstacles.
- **l** : Activer le mode suivi du leader où les véhicules poursuivent une cible.
- **n** : Désactiver le mode actif (snake ou suivi du leader) et revenir au mode normal.
- **Clic gauche** : Créer un obstacle à la position de la souris.

Pour toute question ou retour, veuillez me contacter.