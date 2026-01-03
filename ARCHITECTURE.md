# Architecture Technique

Ce document explique les décisions architecturales du projet, leurs raisons, et comment étendre le système.

**Objectif :** Te permettre de reprendre le projet après plusieurs mois sans avoir à tout re-comprendre.

---

## Table des Matières

1. [Vision Globale](#vision-globale)
2. [Décisions Architecturales Clés](#décisions-architecturales-clés)
3. [Structure des Modules](#structure-des-modules)
4. [Flux de Navigation](#flux-de-navigation)
5. [Comment Étendre](#comment-étendre)

---

## Vision Globale

### Principe Fondamental : Modularité

**Chaque élément est isolé et remplaçable.**

```
Orchestrateur (script.js)
    ↓
Engines (BaseEngine, WordEngine, JokeEngine...)
    ↓
Modules de Contenu (words/, jokes/...)
```

**Pourquoi ?**
- Ajouter un nouveau mot = créer 1 fichier, pas toucher au code existant
- Ajouter un nouveau type de jeu = créer 1 engine, pas modifier les autres
- Tester isolément = page test.html pour développer sans casser le reste

---

## Décisions Architecturales Clés

### 1. Un Engine par Type de Jeu

**Décision :** `WordEngine.js`, `JokeEngine.js` (futur), etc.

**Pourquoi PAS un seul GameEngine unifié ?**

#### Problème évité :
Un GameEngine avec un gros switch/case devient ingérable :

```javascript
// ❌ MAUVAISE APPROCHE
class GameEngine {
  display(game) {
    switch(game.type) {
      case 'word':
        // 50 lignes de code
        break;
      case 'joke':
        // 40 lignes de code
        break;
      case 'puzzle':
        // 60 lignes de code
        break;
      // ... 10 types de jeux = 500+ lignes
    }
  }
}
```

#### Approche choisie :
Chaque engine est spécialisé et isolé :

```javascript
// ✅ BONNE APPROCHE
WordEngine.js    - Gère uniquement les mots (150 lignes)
JokeEngine.js    - Gère uniquement les jokes (120 lignes)
PuzzleEngine.js  - Gère uniquement les puzzles (180 lignes)
```

**Avantages :**
- Modifier WordEngine ne touche pas JokeEngine
- Chaque engine peut avoir sa propre logique complexe
- Facile à tester indépendamment
- Code lisible et maintenable

**Compromis :**
- Légèrement plus de fichiers (mais mieux organisés)

---

### 2. Modules de Mots Complètement Autonomes

**Décision :** Chaque mot dans `/words/` est un module ES6 autosuffisant.

**Structure d'un module :**
```javascript
export default {
  id: 'contraction',
  html: '<h1>...</h1>',           // Structure HTML
  css: 'h1 { ... }',              // Styles spécifiques
  enterTransition: { ... },       // Animation d'entrée (FUTUR)
  exitTransition: { ... },        // Animation de sortie (FUTUR)
  init: function(container) {},   // Setup JS si nécessaire
  cleanup: function() {}          // Nettoyage avant sortie
}
```

**Pourquoi cette structure ?**

#### Encapsulation Totale
- Un mot = 1 fichier = tout son code (HTML + CSS + JS)
- Pas de CSS global qui peut casser un mot
- Pas de dépendances cachées

#### Extensibilité Sans Limite
Ajouter un mot :
1. Créer `words/nouveau-mot.js`
2. Ajouter à `word-registry.js`
3. **C'est tout.** Aucune autre modification nécessaire.

#### Transitions Custom par Mot (Préparation Future)
Chaque mot pourra définir ses propres transitions :
- CONTRACTION : Lettres qui glissent
- FLEXIBLE : Étirement progressif
- EXPLOSION : Lettres qui éclatent

**Actuellement :** Transitions vides (MVP sans animations)  
**Futur :** Chaque mot aura enterTransition/exitTransition custom

---

### 3. BaseEngine : Code Commun Réutilisable

**Décision :** Classe parente avec méthodes communes.

**Contenu :**
- `fadeIn()` / `fadeOut()` - Transitions génériques
- `injectCSS()` / `removeCSS()` - Gestion du CSS
- `cleanup()` - Nettoyage du container

**Pourquoi ?**

#### Éviter la Duplication
Tous les engines ont besoin de ces méthodes de base. Sans BaseEngine :

```javascript
// ❌ Code dupliqué dans chaque engine
class WordEngine {
  fadeIn() { /* même code */ }
  fadeOut() { /* même code */ }
  // ...
}

class JokeEngine {
  fadeIn() { /* même code copié-collé */ }
  fadeOut() { /* même code copié-collé */ }
  // ...
}
```

#### Héritage Propre
```javascript
// ✅ Code partagé une seule fois
class WordEngine extends BaseEngine {
  // Hérite automatiquement de fadeIn, fadeOut, etc.
  // Ajoute uniquement display() et hide() spécifiques aux mots
}
```

**Compromis :**
- Légère complexité d'héritage (mais gain en maintenance)

---

### 4. Séparation Container Vide / Transitions

**Décision CRITIQUE :** Le container est vidé entre chaque mot.

**Flux actuel (MVP) :**
```
Mot #1 visible
  → Clique "Suivant"
  → Container vidé (hide())
  → Mot #2 affiché (display())
  → Instantané (pas de transitions pour l'instant)
```

**Flux futur (avec transitions custom) :**
```
Mot #1 visible
  → Clique "Suivant"
  → exitTransition du mot #1 (ex: lettres s'envolent)
  → Container vidé
  → display() du mot #2 (reset état propre)
  → enterTransition du mot #2 (ex: lettres explosent depuis le centre)
  → Mot #2 visible
```

**Pourquoi vider le container entre les mots ?**

#### Problème évité :
Sans vidage, l'état du container après exitTransition est imprévisible :
- Opacity à 0.2 ?
- Transform scale(0.5) rotate(45deg) ?
- Position absolute left: -1000px ?

Le prochain mot hériterait de cet état chaotique.

#### Solution :
`WordEngine.display()` part toujours d'un container vide et propre.

**Code actuel (simple) :**
```javascript
display(wordModule) {
  this.container.innerHTML = '';  // Vider
  this.container.innerHTML = wordModule.html;  // Injecter
  this.injectCSS(wordModule.css);
  // Container prêt pour enterTransition custom (futur)
}
```

**Important pour le futur :**
- `display()` ne gère PAS les transitions
- Les transitions sont appelées APRÈS display()
- Chaque mot contrôle ses propres effets via enterTransition/exitTransition

---

### 5. Boutons "Commencer" et "Suivant" Séparés

**Décision :** Deux boutons distincts au lieu d'un seul qui change de texte.

**Pourquoi ?**

#### Clarté de l'État
```javascript
// ✅ État visible dans le DOM
<button id="startBtn">Commencer...</button>      // display: block ou none
<button id="nextWordBtn">Suivant...</button>     // display: none ou block
```

vs

```javascript
// ❌ État caché dans le JS
<button id="actionBtn">???</button>  // Texte changé dynamiquement
```

#### Simplicité du Code
Pas besoin de gérer :
- Changement de texte
- Changement d'event listener
- Vérification d'état avant chaque action

**Compromis :**
- Un bouton HTML de plus (négligeable)

---

## Structure des Modules

### Module de Mot (Exemple : contraction.js)

```javascript
export default {
  // Identifiant unique
  id: 'contraction',
  
  // HTML complet du mot
  html: `
    <h1 class="word-game contraction">
      <span class="con">CON</span><span class="traction">TRACTION</span>
    </h1>
  `,
  
  // CSS avec sélecteurs spécifiques
  css: `
    h1.word-game.contraction {
      font-family: Georgia, serif;
      font-size: 5rem;
      /* Tous les styles de base */
    }
    
    .con {
      transform: scaleX(0.25);
      transition: transform 0.5s ease;
    }
    
    h1.word-game.contraction:hover .con {
      transform: scaleX(2);
    }
    /* ... */
  `,
  
  // Transitions (vides pour l'instant - MVP)
  enterTransition: null,
  exitTransition: null,
  
  // Initialisation optionnelle
  init: function(container) {
    console.log('>>> Mot CONTRACTION initialisé');
  },
  
  // Nettoyage optionnel
  cleanup: function() {
    console.log('>>> Mot CONTRACTION nettoyé');
  }
};
```

**Points clés :**

#### Sélecteurs CSS Spécifiques
```css
/* ✅ CORRECT : Spécifique au mot */
h1.word-game.contraction .con { ... }

/* ❌ INCORRECT : Trop générique, peut affecter d'autres mots */
.con { ... }
```

**Pourquoi ?** Sans spécificité, le CSS d'un mot peut contaminer les autres.

#### Transitions Null (Pour l'instant)
MVP actuel : changements instantanés  
Futur : transitions custom définies ici

---

## Flux de Navigation

### Séquence Utilisateur Complète

```
00. LOBBY visible
    ↓
01. Clique "Jouer aux jeux de mots"
    ↓
02. Transition LOBBY → PLAYING (fade 800ms)
    ↓
03. Container vide + bouton "Commencer..."
    ↓
04. Shuffle des mots en arrière-plan (ordre aléatoire)
    ↓
05. [SESSION PRÊTE - wordsQueue remplie]
    ↓
06. Clique "Commencer..."
    ↓
07. Bouton "Commencer..." → display:none
    Bouton "Suivant..." → display:block
    ↓
08. [FUTUR : enterTransition du mot n]
    ↓
09. Mot n affiché avec hover fonctionnel
    ↓
10. Clique "Suivant..."
    ↓
11. Bouton "Suivant..." désactivé (disabled)
    ↓
12. [FUTUR : exitTransition du mot n]
    ↓
13. Container vidé (hide())
    ↓
14. Est-ce le dernier mot ?
    ├─ NON → Retour à 07 (prochain mot)
    └─ OUI → Continue à 15
    ↓
15. EndGameUI overlay affiché
    ↓
16. Clique "Recommencer" ou "Sortir"
    ├─ "Recommencer" → Retour à 04 (nouveau shuffle)
    └─ "Sortir" → Transition PLAYING → LOBBY, retour à 00
```

**Points critiques :**

**Étape 05 :** Les mots sont shufflés AVANT le premier affichage (pas de délai)

**Étapes 08 et 12 :** Actuellement vides (MVP), seront implémentées avec transitions custom

**Étape 13 :** Container TOUJOURS vidé entre les mots (garantit état propre)

---

## JavaScript dans les Modules de Mots

### Vue d'Ensemble

**Les mots ne sont pas que du HTML/CSS statique.** Ce sont des **mini-applications JavaScript** avec :
- Animations continues (requestAnimationFrame)
- Event listeners multiples
- Transitions custom complexes
- État interne (positions, angles, compteurs)

### 3 Zones d'Utilisation du JavaScript

#### 1. Interactivité Pendant l'Affichage (init/cleanup)

**Utilisé pour :**
- Animations continues (orbites, particules, vagues)
- Event listeners personnalisés (au-delà du CSS hover)
- État interne au mot

**Exemple : GRAVITATION avec Lettres en Orbite**

```javascript
export default {
  id: 'gravitation',
  html: `
    <h1 class="word-game gravitation">
      <span class="letter g">G</span>
      <span class="letter r">R</span>
      <span class="letter a">A</span>
      <span class="letter v">V</span>
      <span class="letter i">I</span>
      <span class="letter t">T</span>
      <span class="letter a2">A</span>
      <span class="letter t2">T</span>
      <span class="letter i2">I</span>
      <span class="letter o">O</span>
      <span class="letter n">N</span>
    </h1>
  `,
  
  css: `
    h1.word-game.gravitation {
      position: relative;
      font-size: 3rem;
      width: 500px;
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    h1.word-game.gravitation .letter {
      position: absolute;
      display: inline-block;
      font-family: Georgia, serif;
      color: #e0e0e0;
      transition: color 0.3s;
    }
    
    h1.word-game.gravitation:hover .letter {
      color: #4a9eff;
    }
  `,
  
  enterTransition: null,
  exitTransition: null,
  
  // ✅ Animation continue avec requestAnimationFrame
  init: function(container) {
    console.log('>>> Mot GRAVITATION initialisé');
    
    const letters = container.querySelectorAll('.letter');
    let angle = 0;
    
    // Animation des orbites
    const animate = () => {
      letters.forEach((letter, i) => {
        // Chaque lettre sur une orbite différente
        const radius = 80 + (i * 15);
        const speed = 0.02 + (i * 0.003);
        const currentAngle = angle * speed + (i * 0.5);
        
        const x = Math.cos(currentAngle) * radius;
        const y = Math.sin(currentAngle) * radius;
        
        letter.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}rad)`;
      });
      
      angle += 0.02;
      
      // Stocker la référence pour le cleanup
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  },
  
  // ⚠️ CRITIQUE : Arrêter l'animation
  cleanup: function() {
    console.log('>>> Mot GRAVITATION nettoyé');
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
};
```

**Points clés :**
- `requestAnimationFrame()` pour animation fluide
- Stocker `animationFrameId` dans `this` pour y accéder dans cleanup
- `cancelAnimationFrame()` dans cleanup **obligatoire**
- Sans cleanup → animation continue en arrière-plan → fuite mémoire

---

#### 2. Event Listeners Personnalisés

**Utilisé pour :**
- Interactions au-delà du CSS (click, drag, etc.)
- Logique complexe sur hover
- Séquences d'animations

**Exemple : COMBUSTION avec Clic pour Enflammer**

```javascript
export default {
  id: 'combustion',
  html: `
    <h1 class="word-game combustion">
      <span class="letter c">C</span>
      <span class="letter o">O</span>
      <!-- ... autres lettres ... -->
    </h1>
  `,
  
  css: `
    h1.word-game.combustion .letter {
      display: inline-block;
      transition: all 0.3s ease-out;
      cursor: pointer;
    }
    
    h1.word-game.combustion .letter.burning {
      color: #ff4500;
      transform: scale(1.3) rotate(10deg);
      text-shadow: 0 0 20px #ff6347;
    }
  `,
  
  enterTransition: null,
  exitTransition: null,
  
  init: function(container) {
    console.log('>>> Mot COMBUSTION initialisé');
    
    this.letters = container.querySelectorAll('.letter');
    
    // Handler stocké pour pouvoir le retirer
    this.handleClick = (e) => {
      const letter = e.target;
      letter.classList.add('burning');
      
      // Propager le feu aux lettres adjacentes
      setTimeout(() => {
        const index = Array.from(this.letters).indexOf(letter);
        if (this.letters[index + 1]) {
          this.letters[index + 1].classList.add('burning');
        }
      }, 200);
    };
    
    // Ajouter listener à chaque lettre
    this.letters.forEach(letter => {
      letter.addEventListener('click', this.handleClick);
    });
  },
  
  cleanup: function() {
    console.log('>>> Mot COMBUSTION nettoyé');
    
    // ⚠️ CRITIQUE : Retirer tous les listeners
    if (this.letters && this.handleClick) {
      this.letters.forEach(letter => {
        letter.removeEventListener('click', this.handleClick);
      });
    }
    
    // Reset des classes
    if (this.letters) {
      this.letters.forEach(letter => {
        letter.classList.remove('burning');
      });
    }
  }
};
```

**Points clés :**
- Stocker les références dans `this` (letters, handlers)
- Handler nommé (pas de fonction anonyme) pour pouvoir le retirer
- `removeEventListener()` dans cleanup **obligatoire**
- Reset des classes/état dans cleanup

---

#### 3. Transitions Custom (enterTransition/exitTransition)

**Utilisé pour :**
- Animations d'entrée complexes (impossible en CSS)
- Animations de sortie avec logique
- Séquences temporelles précises

**Exemple : EXPLOSION avec Lettres qui Éclatent**

```javascript
export default {
  id: 'explosion',
  html: `
    <h1 class="word-game explosion">
      <span class="letter">E</span>
      <span class="letter">X</span>
      <span class="letter">P</span>
      <span class="letter">L</span>
      <span class="letter">O</span>
      <span class="letter">S</span>
      <span class="letter">I</span>
      <span class="letter">O</span>
      <span class="letter">N</span>
    </h1>
  `,
  
  css: `
    h1.word-game.explosion .letter {
      display: inline-block;
      font-family: Georgia, serif;
      font-size: 5rem;
      color: #e0e0e0;
    }
  `,
  
  // ✅ Transition d'entrée custom
  enterTransition: {
    duration: 1500,
    effect: function(container, callback) {
      const letters = container.querySelectorAll('.letter');
      
      // État initial : toutes les lettres au centre, invisibles
      letters.forEach(letter => {
        letter.style.position = 'absolute';
        letter.style.left = '50%';
        letter.style.top = '50%';
        letter.style.opacity = '0';
        letter.style.transform = 'translate(-50%, -50%) scale(0)';
      });
      
      // Animation : explosion depuis le centre
      letters.forEach((letter, i) => {
        setTimeout(() => {
          const angle = (i / letters.length) * Math.PI * 2;
          const distance = 50 + Math.random() * 30;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          letter.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          letter.style.opacity = '1';
          letter.style.transform = `
            translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) 
            scale(1) 
            rotate(${Math.random() * 360}deg)
          `;
        }, i * 80); // Stagger
      });
      
      // Callback après la durée totale
      setTimeout(callback, 1500);
    }
  },
  
  // ✅ Transition de sortie custom
  exitTransition: {
    duration: 1000,
    effect: function(container, callback) {
      const letters = container.querySelectorAll('.letter');
      
      // Animation : lettres s'envolent vers le haut
      letters.forEach((letter, i) => {
        setTimeout(() => {
          letter.style.transition = 'all 0.6s ease-in';
          letter.style.opacity = '0';
          letter.style.transform = `
            translateY(-300px) 
            rotate(${Math.random() * 720}deg) 
            scale(0.3)
          `;
        }, i * 50);
      });
      
      setTimeout(callback, 1000);
    }
  },
  
  init: function(container) {
    console.log('>>> Mot EXPLOSION initialisé');
  },
  
  cleanup: function() {
    console.log('>>> Mot EXPLOSION nettoyé');
  }
};
```

**Points clés :**
- `enterTransition.effect(container, callback)` : function qui anime l'entrée
- `exitTransition.effect(container, callback)` : function qui anime la sortie
- **TOUJOURS appeler `callback()`** à la fin pour signaler que c'est terminé
- `duration` : temps total en ms (pour que l'orchestrateur sache quand continuer)

---

### Règles Critiques pour le JavaScript

#### 1. Cleanup Obligatoire

**Sans cleanup :**
```javascript
init: function(container) {
  const animate = () => {
    // Animation
    requestAnimationFrame(animate);  // ❌ Continue indéfiniment
  };
  animate();
}
// Pas de cleanup() → fuite mémoire
```

**Avec cleanup :**
```javascript
init: function(container) {
  const animate = () => {
    // Animation
    this.animationFrameId = requestAnimationFrame(animate);
  };
  animate();
},

cleanup: function() {
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);  // ✅ Arrêté proprement
  }
}
```

---

#### 2. Stocker les Références dans `this`

**Pourquoi :** Pour pouvoir les utiliser dans `cleanup()`.

```javascript
init: function(container) {
  // ✅ Stocker dans this
  this.letters = container.querySelectorAll('.letter');
  this.handleClick = () => { /* ... */ };
  this.animationFrameId = null;
  this.timerId = null;
  
  this.letters.forEach(letter => {
    letter.addEventListener('click', this.handleClick);
  });
},

cleanup: function() {
  // ✅ Accessible depuis this
  if (this.letters && this.handleClick) {
    this.letters.forEach(letter => {
      letter.removeEventListener('click', this.handleClick);
    });
  }
  
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
  }
  
  if (this.timerId) {
    clearTimeout(this.timerId);
  }
}
```

---

#### 3. Checklist Cleanup

**Avant de terminer un mot avec JS, vérifier que `cleanup()` fait :**

- [ ] `cancelAnimationFrame()` pour toutes les animations
- [ ] `removeEventListener()` pour tous les event listeners
- [ ] `clearTimeout()` et `clearInterval()` pour tous les timers
- [ ] Reset de l'état interne (`this.propriété = null`)
- [ ] Reset des classes CSS ajoutées dynamiquement

---

### Debugging JavaScript dans les Mots

#### Test de Fuites Mémoire

**Dans test.html :**
1. Charger un mot avec animations
2. Observer l'animation (orbites, particules, etc.)
3. Cliquer "Nettoyer le mot"
4. **Vérifier que TOUT s'arrête** (animations, effets, listeners)
5. Recharger le mot
6. Répéter 10 fois
7. Ouvrir Performance Monitor (F12 → More Tools → Performance Monitor)
8. Vérifier que la mémoire ne monte pas indéfiniment

**Si la mémoire augmente :** Fuite détectée → revoir cleanup().

---

#### Console Logs Utiles

```javascript
init: function(container) {
  console.log('>>> Mot [ID] initialisé');
  console.log('  - Lettres:', this.letters.length);
  console.log('  - Animation démarrée');
},

cleanup: function() {
  console.log('>>> Mot [ID] nettoyé');
  console.log('  - Animation arrêtée');
  console.log('  - Listeners retirés');
}
```

**Bénéfice :** Voir dans la console si init/cleanup sont appelés correctement.

---

### Librairies JavaScript Externes (Optionnel)

**Pour des animations très complexes, utiliser des librairies :**

#### GSAP (GreenSock)
```html
<!-- Dans index.html ou test.html -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

```javascript
enterTransition: {
  duration: 1500,
  effect: function(container, callback) {
    const letters = container.querySelectorAll('.letter');
    
    gsap.from(letters, {
      duration: 1.5,
      scale: 0,
      rotation: 360,
      opacity: 0,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.5)',
      onComplete: callback
    });
  }
}
```

#### Anime.js
```javascript
enterTransition: {
  duration: 2000,
  effect: function(container, callback) {
    anime({
      targets: '.letter',
      translateX: anime.stagger(10, {grid: [14, 5], from: 'center', axis: 'x'}),
      translateY: anime.stagger(10, {grid: [14, 5], from: 'center', axis: 'y'}),
      rotateZ: anime.stagger([0, 90], {grid: [14, 5], from: 'center', axis: 'x'}),
      delay: anime.stagger(200, {grid: [14, 5], from: 'center'}),
      easing: 'easeInOutQuad',
      complete: callback
    });
  }
}
```

**Note :** Librairies = plus de poids → évaluer le trade-off.

---

### Exemples de Mots Complexes (Futurs)

**GRAVITATION :** Lettres en orbite autour du centre  
**COMBUSTION :** Lettres qui s'enflamment au clic  
**EXPLOSION :** Lettres éclatent depuis le centre  
**OSCILLATION :** Lettres qui balancent comme des pendules  
**EXPANSION :** Lettres qui s'éloignent progressivement  

**Tous nécessiteront JavaScript dans init/cleanup et/ou transitions.**

---

## Comment Étendre

### Ajouter un Nouveau Mot

**Étapes :**

1. **Développer dans test.html**
   ```html
   <!-- HTML direct pour itérer rapidement -->
   <h1 class="word-game explosion">
     <span>E</span><span>X</span><span>P</span>...
   </h1>
   <style>
     /* CSS pour tester les effets */
   </style>
   ```

2. **Convertir en module**
   ```javascript
   // words/explosion.js
   export default {
     id: 'explosion',
     html: `<h1 class="word-game explosion">...</h1>`,
     css: `...`,
     enterTransition: null,  // Pour l'instant
     exitTransition: null,   // Pour l'instant
     init: function(container) {},
     cleanup: function() {}
   };
   ```

3. **Ajouter au registre**
   ```javascript
   // words/word-registry.js
   import explosion from './explosion.js';
   
   export default [
     contraction,
     flexible,
     elastique,
     explosion  // Ajouter ici
   ];
   ```

4. **Tester dans test.html avec le module**
   - Vérifier chargement
   - Vérifier hover
   - Vérifier cleanup

5. **Tester dans l'application principale**
   - Le mot apparaît dans le shuffle automatiquement

**C'est tout.** Aucun autre fichier à modifier.

---

### Ajouter un Nouveau Type de Jeu (ex: Jokes de Père)

**Étapes :**

1. **Créer le module de contenu**
   ```javascript
   // jokes/blague1.js
   export default {
     type: 'dad-joke',
     id: 'blague-plongeur',
     setup: "Pourquoi les plongeurs plongent-ils toujours en arrière ?",
     punchline: "Parce que sinon ils tombent dans le bateau.",
     init: function() {},
     cleanup: function() {}
   };
   ```

2. **Créer le registre**
   ```javascript
   // jokes/joke-registry.js
   import blague1 from './blague1.js';
   
   export default [blague1];
   ```

3. **Créer l'Engine spécialisé**
   ```javascript
   // engines/JokeEngine.js
   import BaseEngine from './BaseEngine.js';
   
   export default class JokeEngine extends BaseEngine {
     display(jokeModule) {
       this.container.innerHTML = `
         <div class="joke-setup">${jokeModule.setup}</div>
         <button class="reveal-btn">Voir la réponse</button>
         <div class="joke-punchline hidden">${jokeModule.punchline}</div>
       `;
       
       // Event listener pour révéler la réponse
       const btn = this.container.querySelector('.reveal-btn');
       btn.addEventListener('click', () => {
         this.container.querySelector('.joke-punchline').classList.remove('hidden');
       });
       
       this.currentJoke = jokeModule;
     }
     
     hide() {
       this.cleanup();
       this.currentJoke = null;
     }
   }
   ```

4. **Modifier l'orchestrateur**
   ```javascript
   // script.js
   import JokeEngine from './engines/JokeEngine.js';
   import jokeRegistry from './jokes/joke-registry.js';
   
   let jokeEngine = null;
   
   function initApp() {
     // ...
     jokeEngine = new JokeEngine(gameContainer);
   }
   
   // Logique pour basculer entre WordEngine et JokeEngine
   // selon le type de contenu dans la queue
   ```

**Architecture extensible :** Chaque type de jeu a son propre engine isolé.

---

### Ajouter des Transitions Custom à un Mot

**Actuellement :** `enterTransition: null` et `exitTransition: null`

**Futur :**

```javascript
// words/explosion.js
export default {
  id: 'explosion',
  // ... html, css ...
  
  enterTransition: {
    duration: 1200,
    effect: function(container, callback) {
      // Animation custom : lettres explosent depuis le centre
      const letters = container.querySelectorAll('span');
      
      letters.forEach((letter, i) => {
        letter.style.opacity = '0';
        letter.style.transform = 'scale(0) translate(0, 0)';
        
        setTimeout(() => {
          letter.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          letter.style.opacity = '1';
          letter.style.transform = 'scale(1) translate(0, 0)';
        }, i * 100);  // Stagger
      });
      
      setTimeout(callback, 1200);  // Appeler callback quand fini
    }
  },
  
  exitTransition: {
    duration: 800,
    effect: function(container, callback) {
      // Animation custom : lettres s'envolent
      const letters = container.querySelectorAll('span');
      
      letters.forEach((letter, i) => {
        setTimeout(() => {
          letter.style.transition = 'all 0.6s ease-in';
          letter.style.opacity = '0';
          letter.style.transform = `translateY(-200px) rotate(${Math.random() * 360}deg)`;
        }, i * 50);
      });
      
      setTimeout(callback, 800);
    }
  }
};
```

**Modification dans script.js :**
```javascript
function loadNextWord() {
  // ... code actuel ...
  
  wordEngine.display(wordModule);
  
  // Exécuter transition d'entrée si définie
  if (wordModule.enterTransition) {
    wordModule.enterTransition.effect(wordEngine.container, () => {
      console.log('✓ Transition entrée terminée');
    });
  }
  // Sinon, pas de transition (instantané comme actuellement)
}

function nextWord() {
  const currentWord = wordEngine.currentWord;
  
  // Exécuter transition de sortie si définie
  if (currentWord.exitTransition) {
    currentWord.exitTransition.effect(wordEngine.container, () => {
      wordEngine.hide();
      loadNextWord();
    });
  } else {
    // Pas de transition : changement instantané (MVP actuel)
    wordEngine.hide();
    loadNextWord();
  }
}
```

**Avantage :** Backward compatible. Les mots sans transitions continuent de fonctionner instantanément.

---

## Décisions à Ne PAS Oublier

### 1. Pourquoi Pas de Transitions dans le MVP ?

**Raison :** Focus sur l'architecture et la navigation d'abord.

**Bénéfice :**
- Architecture validée sans complexité des animations
- Facile de tester la logique pure
- Transitions ajoutées plus tard sans tout casser

**Prochaine étape :** Ajouter enterTransition/exitTransition progressivement, mot par mot.

---

### 2. Pourquoi Container Vidé Entre Chaque Mot ?

**Raison critique :** Garantir un état propre pour le mot suivant.

**Sans vidage :** Le mot suivant hérite de l'état (opacity, transform, position) du mot précédent après sa exitTransition → chaos.

**Avec vidage :** Chaque mot part d'une ardoise vierge.

---

### 3. Pourquoi Un Engine par Type de Jeu ?

**Alternative considérée :** Un seul GameEngine avec switch/case par type.

**Problème :** Fichier énorme, couplage fort, difficile à maintenir.

**Solution choisie :** Engines isolés, chacun expert de son domaine.

---

## Prochaines Étapes

### Immédiat
- **Mobile responsive** : Media queries, touch events, tailles adaptatives

### Court terme
- Ajouter mots : COMBUSTION, EXPANSION, DIVISION, GRAVITATION
- Implémenter transitions custom pour chaque mot

### Moyen terme
- Créer JokeEngine
- Ajouter des jokes de père
- Interface pour choisir le type de jeu (Mots ou Jokes)

### Long terme
- Autres types de jeux (puzzles, anagrammes, etc.)
- Mode multijoueur ?
- Persistance scores/progression ?

---

## Références Rapides

**Ajouter un mot :** Voir section "Ajouter un Nouveau Mot"  
**Tester isolément :** Utiliser `test.html`  
**Déployer :** `git push` → GitHub Pages se met à jour automatiquement  
**Débugger :** Console logs à chaque étape critique dans script.js

---

**Dernière mise à jour :** Janvier 2026  
**Architecture validée et fonctionnelle.**
