# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [MVP 1.0] - 2026-01-02

### 🎉 Version Initiale

Premier MVP fonctionnel avec architecture modulaire complète.

### Ajouté

#### Architecture
- **Engines modulaires** : BaseEngine et WordEngine
- **Système de modules** pour les mots (ES6)
- **Page de test isolée** (test.html) pour développement
- **Navigation complète** : LOBBY → PLAYING → EndGameUI → LOBBY
- **Shuffle aléatoire** des mots à chaque session

#### Fonctionnalités
- **3 jeux de mots interactifs** :
  - CONTRACTION : CON compressé se dévoile au hover
  - FLEXIBLE : Étirement vertical au hover
  - ÉLASTIQUE : Chaque lettre s'étire indépendamment
- **Boutons "Commencer" et "Suivant"** pour navigation
- **EndGameUI** avec options "Recommencer" et "Sortir"
- **Déploiement GitHub Pages** automatique

#### Documentation
- README.md : Vue d'ensemble et quickstart
- ARCHITECTURE.md : Décisions techniques détaillées
- DEVELOPMENT.md : Guide de développement pratique
- TROUBLESHOOTING.md : Solutions aux problèmes courants
- CHANGELOG.md : Ce fichier

### Décisions Architecturales Majeures

#### 1. Architecture Modulaire par Type de Jeu
**Décision :** Un engine séparé par type de jeu (WordEngine, futur JokeEngine, etc.)

**Raison :** Éviter un fichier monolithique avec switch/case énorme. Chaque engine reste petit, lisible, et maintenable.

**Alternative rejetée :** GameEngine unifié avec switch par type.

#### 2. Container Vidé Entre Chaque Mot
**Décision :** `wordEngine.hide()` vide complètement le container entre chaque mot.

**Raison :** Garantit un état propre pour le mot suivant. Évite que les transitions custom futures laissent le container dans un état imprévisible (opacity, transform, position).

**Alternative rejetée :** Garder le container et juste changer le contenu → risque de contamination d'état.

#### 3. MVP Sans Transitions Custom
**Décision :** Changements de mots instantanés (pas de fade-in/fade-out pour l'instant).

**Raison :** Focus sur l'architecture et la navigation d'abord. Les transitions seront ajoutées plus tard via `enterTransition`/`exitTransition` dans chaque module de mot.

**Alternative rejetée :** Implémenter fade-in/fade-out dès le début → source de bugs complexes (timing, états, opacity).

#### 4. Boutons Séparés "Commencer" et "Suivant"
**Décision :** Deux boutons HTML distincts au lieu d'un seul qui change de texte.

**Raison :** Simplicité du code, état visible dans le DOM, pas de gestion dynamique d'event listeners.

**Alternative rejetée :** Un seul bouton avec texte dynamique → plus de logique, plus de risques d'erreur.

### Bugs Résolus

#### Container Invisible Après "Recommencer"
**Symptôme :** Cliquer "Recommencer" → mot chargé mais invisible  
**Cause :** Container gardait `opacity: 0` du fade-out précédent  
**Solution :** Simplifier en retirant les resets automatiques d'opacity, gérer manuellement si nécessaire

#### Boutons Visibles en Même Temps
**Symptôme :** "Commencer" et "Suivant" affichés ensemble  
**Cause :** `class="hidden"` sans `display: none` initial  
**Solution :** Ajouter `style="display: none"` dans le HTML

#### Overlay Reste Visible Après "Sortir"
**Symptôme :** Retour LOBBY avec écran semi-obscur  
**Cause :** `exitGame()` ne cachait pas l'overlay  
**Solution :** Ajouter cleanup de l'overlay dans `exitGame()`

#### CSS ÉLASTIQUE Ne Fonctionne Pas
**Symptôme :** Hover sur lettres → rien ne se passe  
**Cause :** Sélecteurs trop génériques (`.e1:hover`)  
**Solution :** Sélecteurs spécifiques (`h1.word-game.elastique .e1:hover`)

#### CSS Manquant sur GitHub Pages
**Symptôme :** Fonctionne en local, pas en production  
**Cause :** Fichier styles.css modifié localement mais pas dans le repo Git  
**Solution :** Copier le bon fichier et commit/push

### Leçons Apprises

1. **Architecture Intentionnelle Upfront (Type 1 Decisions)**
   - Décisions difficiles à changer plus tard → prendre le temps de bien les penser
   - Ex: Structure des modules, engines séparés, container vidé

2. **MVP D'Abord, Features Après (Type 2 Decisions)**
   - Décisions faciles à changer → itérer rapidement
   - Ex: Transitions custom, animations, couleurs

3. **Tester en Production Tôt et Souvent**
   - Ce qui marche en local peut échouer sur GitHub Pages
   - Toujours vérifier après chaque push

4. **Simplicité > Sophistication Prématurée**
   - Retour en arrière (rollback fin Phase 3.2) pour simplifier
   - Transitions complexes = source de bugs → MVP sans transitions d'abord

5. **Documentation En Temps Réel**
   - Documenter les décisions PENDANT le développement
   - Facile d'oublier le "pourquoi" après quelques semaines

### Statistiques

- **Fichiers créés :** 15
- **Lignes de code :** ~1,500
- **Mots fonctionnels :** 3
- **Bugs résolus :** 5
- **Commits :** ~10
- **Temps de développement :** ~1 journée

---

## [Unreleased]

### À Venir

#### Immédiat (Priorité Haute)
- [ ] **Mobile responsive**
  - Media queries pour tailles d'écran
  - Touch events pour hover sur mobile
  - Tailles de police adaptatives
  - Tests sur iOS et Android

#### Court Terme
- [ ] **Nouveaux mots :**
  - COMBUSTION (lettres qui "brûlent")
  - EXPANSION (lettres qui s'écartent)
  - DIVISION (mot qui se sépare)
  - GRAVITATION (lettres qui tombent)

- [ ] **Transitions custom**
  - Implémenter enterTransition/exitTransition dans les modules existants
  - Créer des animations uniques par mot
  - Tester les transitions sur mobile

#### Moyen Terme
- [ ] **Nouveau type de jeu : Jokes de Père**
  - Créer JokeEngine.js
  - Structure : setup → reveal punchline
  - Interface pour choisir Mots vs Jokes

- [ ] **Sections Bienvenue et À Propos**
  - Remplir avec contenu
  - Animations subtiles ?

#### Long Terme
- [ ] **Autres types de jeux**
  - Puzzles (anagrammes, lettres mélangées)
  - Jeux de sons (homophones, rimes)
  - Jeux visuels (rébus, pictogrammes)

- [ ] **Fonctionnalités avancées**
  - Mode multijoueur ?
  - Progression/scores ?
  - Favoris ?
  - Partage sur réseaux sociaux ?

---

## Format du Changelog

### Sections Utilisées

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités bientôt retirées
- **Retiré** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

### Numérotation des Versions

Format : `[MAJEUR.MINEUR.CORRECTIF]`

- **MAJEUR** : Changements incompatibles avec les versions précédentes
- **MINEUR** : Ajout de fonctionnalités rétro-compatibles
- **CORRECTIF** : Corrections de bugs rétro-compatibles

**Exemple :**
- MVP 1.0 → Première version
- 1.1.0 → Ajout de 4 nouveaux mots
- 1.1.1 → Correction bug mobile
- 2.0.0 → Ajout JokeEngine (changement majeur d'architecture)

---

**Dernière mise à jour :** 2026-01-02
