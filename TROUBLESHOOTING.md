# Troubleshooting

Solutions aux problèmes courants rencontrés pendant le développement.

---

## Table des Matières

1. [Problèmes de Déploiement](#problèmes-de-déploiement)
2. [Problèmes CSS](#problèmes-css)
3. [Problèmes JavaScript](#problèmes-javascript)
4. [Problèmes Git](#problèmes-git)
5. [Bugs Résolus (Historique)](#bugs-résolus-historique)

---

## Problèmes de Déploiement

### ❌ Ça Marche en Local Mais Pas sur GitHub Pages

**Symptômes :**
- L'application fonctionne avec Live Server
- Sur GitHub Pages, rien ne se passe ou erreurs

**Causes possibles et solutions :**

#### 1. Fichiers Pas Pushés

**Diagnostic :**
```bash
git status
# Si des fichiers apparaissent, ils ne sont pas pushés
```

**Solution :**
```bash
git add .
git commit -m "fix: add missing files"
git push
```

#### 2. CSS Manquant

**Diagnostic :**
- Ouvrir GitHub Pages
- F12 → Console → Erreurs 404 sur styles.css

**Cause :** Modifications CSS pas dans le repo Git

**Solution :**
```bash
# Vérifier le diff
git diff styles.css

# Si vide, le fichier local n'a pas les changements
# Copier depuis /home/claude/ si nécessaire
cp /home/claude/styles.css .

# Puis commit
git add styles.css
git commit -m "fix: update styles.css with overlay"
git push
```

#### 3. Délai de Déploiement

**Symptôme :** Changements pas visibles immédiatement

**Solution :**
- Attendre 1-2 minutes après le push
- Vider le cache du navigateur (Ctrl+Shift+R)
- Vérifier l'onglet "Actions" sur GitHub pour voir le statut

---

## Problèmes CSS

### ❌ Les Styles Ne S'Appliquent Pas

**Symptôme :** Le mot s'affiche mais sans les styles (police, taille, couleurs)

**Causes possibles :**

#### 1. Sélecteurs Trop Génériques

**Problème :**
```css
/* ❌ MAUVAIS : Trop général */
.con {
  transform: scaleX(0.25);
}
```

**Solution :**
```css
/* ✅ BON : Spécifique au mot */
h1.word-game.contraction .con {
  transform: scaleX(0.25);
}
```

#### 2. CSS Non Injecté

**Diagnostic :**
- F12 → Elements → Chercher `<style>` dans `<head>`
- Si absent, le CSS n'a pas été injecté

**Solution :**
Vérifier que `injectCSS()` est appelé dans `WordEngine.display()`.

#### 3. Conflit de Sélecteurs

**Symptôme :** Un mot écrase les styles d'un autre

**Solution :**
Toujours préfixer avec `h1.word-game.nom-du-mot`.

---

### ❌ Hover Ne Fonctionne Pas

**Symptôme :** Passer la souris sur le mot ne déclenche aucun effet

**Causes possibles :**

#### 1. Zone de Hover Trop Grande

**Problème :**
```css
h1.word-game.flexible {
  display: flex;  /* ❌ Toute la largeur */
}
```

**Solution :**
```css
h1.word-game.flexible {
  display: inline-flex;  /* ✅ Juste autour du contenu */
}
```

#### 2. Sélecteur Hover Incorrect

**Problème :**
```css
.e1:hover {  /* ❌ Pas assez spécifique */
  transform: scaleY(2);
}
```

**Solution :**
```css
h1.word-game.elastique .e1:hover {  /* ✅ Spécifique */
  transform: scaleY(2);
}
```

---

## Problèmes JavaScript

### ❌ Erreur : "Cannot read property of null"

**Erreur complète :**
```
Uncaught TypeError: Cannot read properties of null (reading 'disabled')
```

**Cause :** Élément du DOM pas trouvé

**Solution :**
```javascript
// ❌ MAUVAIS : Assume que l'élément existe
nextWordBtn.disabled = true;

// ✅ BON : Vérifier d'abord
if (nextWordBtn) {
  nextWordBtn.disabled = true;
}
```

---

### ❌ Module ES6 Ne Charge Pas

**Erreur :**
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"
```

**Cause :** Serveur local requis (pas `file://`)

**Solution :**
```bash
# Lancer un serveur HTTP
python -m http.server 8000
# OU
npx serve
# OU VS Code Live Server
```

---

### ❌ Fonction Not Defined (Module Scope)

**Erreur :**
```
Uncaught ReferenceError: functionName is not defined
```

**Cause :** Fonction dans un module ES6 n'est pas dans le scope global

**Solution :**
```javascript
// Pour tester dans la console
window.functionName = functionName;
```

**Note :** Retirer ces `window.` exports en production.

---

## Problèmes JavaScript dans les Mots

### ❌ Animations Continuent Après Changement de Mot

**Symptôme :**
- Tu changes de mot (Suivant → nouveau mot)
- Les animations du mot précédent continuent en arrière-plan
- Parfois visible (lettres qui bougent), parfois juste dans les logs

**Diagnostic :**
```javascript
// Dans la console
// Si des requestAnimationFrame continuent, tu verras des appels répétés
```

**Cause :**
`cleanup()` ne stoppe pas `requestAnimationFrame()`.

**Solution :**

```javascript
// ❌ PROBLÈME
init: function(container) {
  const animate = () => {
    // Animation
    requestAnimationFrame(animate);
  };
  animate();
}
// Pas de cleanup

// ✅ SOLUTION
init: function(container) {
  const animate = () => {
    // Animation
    this.animationFrameId = requestAnimationFrame(animate);
  };
  animate();
},

cleanup: function() {
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}
```

---

### ❌ Mémoire Augmente Après Chaque Mot

**Symptôme :**
- Page devient lente après avoir vu 5-10 mots
- Performance Monitor montre "JS Heap Size" qui monte constamment

**Diagnostic :**
```
F12 → Menu (3 points) → More Tools → Performance Monitor
Observer "JS Heap Size" pendant que tu navigues entre mots
Si monte et ne redescend jamais → fuite mémoire
```

**Cause :**
Event listeners pas retirés → s'accumulent en mémoire.

**Solution :**

```javascript
// ❌ PROBLÈME
init: function(container) {
  container.addEventListener('click', () => {
    // Handler anonyme impossible à retirer
  });
}

// ✅ SOLUTION
init: function(container) {
  this.handleClick = () => {
    // Handler nommé
  };
  container.addEventListener('click', this.handleClick);
},

cleanup: function() {
  if (this.handleClick) {
    container.removeEventListener('click', this.handleClick);
    this.handleClick = null;
  }
}
```

---

### ❌ Event Listeners Multipliés

**Symptôme :**
- Cliquer sur une lettre déclenche l'action 2, 3, 5 fois
- Chaque rechargement du mot empire le problème

**Diagnostic :**
```javascript
// Dans cleanup(), ajouter :
console.log('Listeners retirés');

// Si ce log n'apparaît jamais → cleanup pas appelé ou incomplet
```

**Cause :**
Listeners ajoutés mais jamais retirés → s'accumulent.

**Solution :**

Toujours stocker les références et les retirer :

```javascript
init: function(container) {
  this.letters = container.querySelectorAll('.letter');
  this.handleMouseEnter = (e) => { /* ... */ };
  
  this.letters.forEach(letter => {
    letter.addEventListener('mouseenter', this.handleMouseEnter);
  });
},

cleanup: function() {
  if (this.letters && this.handleMouseEnter) {
    this.letters.forEach(letter => {
      letter.removeEventListener('mouseenter', this.handleMouseEnter);
    });
    this.letters = null;
    this.handleMouseEnter = null;
  }
}
```

---

### ❌ Timers Qui Ne S'Arrêtent Pas

**Symptôme :**
- Code continue à s'exécuter après avoir quitté le mot
- Console logs apparaissent pour un mot qui n'est plus affiché

**Diagnostic :**
```javascript
// Chercher dans le code :
setTimeout(...
setInterval(...

// Sans clearTimeout/clearInterval correspondant
```

**Cause :**
Timers créés mais jamais arrêtés.

**Solution :**

```javascript
// ❌ PROBLÈME
init: function(container) {
  setInterval(() => {
    console.log('Tick');  // Continue indéfiniment
  }, 1000);
}

// ✅ SOLUTION
init: function(container) {
  this.intervalId = setInterval(() => {
    console.log('Tick');
  }, 1000);
},

cleanup: function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
```

---

### ❌ Transitions Ne Se Terminent Pas

**Symptôme :**
- Cliquer "Suivant" → rien ne se passe
- Le mot reste figé
- Bouton "Suivant" reste désactivé

**Diagnostic :**
```javascript
// Dans enterTransition ou exitTransition
// Vérifier que callback() est appelé
```

**Cause :**
`callback()` jamais appelé dans la transition custom.

**Solution :**

```javascript
// ❌ PROBLÈME
enterTransition: {
  duration: 1500,
  effect: function(container, callback) {
    // Animation
    // ...
    // Oubli d'appeler callback() → bloque la navigation
  }
}

// ✅ SOLUTION
enterTransition: {
  duration: 1500,
  effect: function(container, callback) {
    // Animation
    // ...
    
    setTimeout(() => {
      callback();  // ✅ TOUJOURS appeler
    }, 1500);
  }
}
```

---

### ❌ Erreur : "Cannot read property X of null"

**Erreur complète :**
```
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
```

**Cause :**
Référence à un élément qui n'existe plus ou pas encore.

**Solution :**

```javascript
// ❌ PROBLÈME
init: function(container) {
  const btn = container.querySelector('.my-button');
  btn.addEventListener('click', ...);  // btn peut être null
}

// ✅ SOLUTION
init: function(container) {
  const btn = container.querySelector('.my-button');
  
  if (btn) {  // ✅ Vérifier d'abord
    this.handleClick = () => { /* ... */ };
    btn.addEventListener('click', this.handleClick);
  }
}
```

---

### ❌ Styles Inline Persistent

**Symptôme :**
- Les styles ajoutés en JS (style.transform, style.opacity) persistent
- Le mot suivant hérite des styles du précédent

**Diagnostic :**
```javascript
// Inspecter le container avec F12
// Chercher style="..." directement sur les éléments
```

**Cause :**
Styles inline ajoutés mais pas reset dans cleanup().

**Solution :**

```javascript
// ❌ PROBLÈME
init: function(container) {
  const letters = container.querySelectorAll('.letter');
  letters.forEach(letter => {
    letter.style.transform = 'rotate(45deg)';  // Reste après cleanup
  });
}

// ✅ SOLUTION
cleanup: function() {
  if (this.letters) {
    this.letters.forEach(letter => {
      // Reset tous les styles inline
      letter.style.transform = '';
      letter.style.opacity = '';
      letter.style.position = '';
      // OU
      letter.removeAttribute('style');
    });
  }
}
```

---

### Debugging Méthodique

**Quand un mot avec JS bug :**

1. **Isoler dans test.html**
   - Charger le mot seul
   - Reproduire le bug

2. **Console ouverte (F12)**
   - Chercher les erreurs JavaScript
   - Vérifier que init() est appelé
   - Vérifier que cleanup() est appelé

3. **Ajouter des logs**
   ```javascript
   init: function(container) {
     console.log('>>> INIT début');
     // Code
     console.log('>>> INIT fin');
   }
   
   cleanup: function() {
     console.log('>>> CLEANUP début');
     // Code
     console.log('>>> CLEANUP fin');
   }
   ```

4. **Tester 10 fois**
   - Charger → Nettoyer (x10)
   - Vérifier stabilité

5. **Performance Monitor**
   - Ouvrir Performance Monitor
   - Observer la mémoire
   - Si monte → chercher la fuite

6. **Simplifier**
   - Commenter tout le code dans init()
   - Rajouter ligne par ligne
   - Identifier la ligne problématique

---

## Problèmes Git

### ❌ Git Push Demande Username/Password à Chaque Fois

**Solution :**
```bash
# Cacher les credentials pour 24 heures
git config --global credential.helper 'cache --timeout=86400'

# Ou stocker de façon permanente (moins sécurisé)
git config --global credential.helper store
```

**Note :** Utiliser un Personal Access Token, pas ton mot de passe GitHub.

---

### ❌ Modifications Perdues Après Git Pull

**Symptôme :** `git pull` écrase tes modifications locales

**Prévention :**
```bash
# Toujours commit AVANT de pull
git add .
git commit -m "work in progress"
git pull
```

**Récupération (si trop tard) :**
```bash
# Voir l'historique
git reflog

# Revenir à un commit précédent
git reset --hard HEAD@{1}
```

---

### ❌ Conflit de Merge

**Symptôme :**
```
CONFLICT (content): Merge conflict in fichier.js
```

**Solution :**
```bash
# 1. Ouvrir le fichier en conflit
# 2. Chercher les marqueurs <<<<<<< ======= >>>>>>>
# 3. Résoudre manuellement
# 4. Supprimer les marqueurs
# 5. Ajouter et commiter

git add fichier.js
git commit -m "fix: resolve merge conflict"
```

---

## Bugs Résolus (Historique)

### Bug : Container Invisible Après "Recommencer"

**Date :** Janvier 2026

**Symptôme :**
- Cliquer "Recommencer" → container vide et invisible
- Mot chargé mais opacity = 0

**Cause :**
Le container gardait `opacity: 0` du fade-out précédent.

**Tentatives échouées :**
1. Ajouter fade-in manuel après `loadNextWord()` → timing incorrect
2. Reset `opacity` dans `loadNextWord()` → conflit avec display()

**Solution finale :**
Ne pas gérer opacity dans loadNextWord(). Laisser simple (instantané pour MVP).

**Leçon :**
Transitions complexes = source de bugs. MVP sans transitions d'abord, ajouter après.

---

### Bug : Boutons "Commencer" et "Suivant" Visibles en Même Temps

**Date :** Janvier 2026

**Symptôme :**
En arrivant sur PLAYING, les deux boutons sont visibles.

**Cause :**
HTML avait `class="hidden"` mais pas `style="display: none"`.

**Solution :**
```html
<!-- ❌ AVANT -->
<button id="nextWordBtn" class="hidden">Suivant...</button>

<!-- ✅ APRÈS -->
<button id="nextWordBtn" style="display: none;">Suivant...</button>
```

**Leçon :**
Préférer `display: none` inline pour l'état initial au lieu de classes CSS.

---

### Bug : Overlay EndGameUI Reste Visible Après "Sortir"

**Date :** Janvier 2026

**Symptôme :**
Cliquer "Sortir" → retour LOBBY mais overlay reste visible (écran semi-obscur).

**Cause :**
`exitGame()` ne cachait pas l'overlay.

**Solution :**
Ajouter cleanup de l'overlay dans `exitGame()` :
```javascript
const overlay = document.getElementById('endGameOverlay');
if (overlay) {
  overlay.classList.add('hidden');
}
```

**Leçon :**
Toujours cleanup tous les éléments UI quand on change d'état.

---

### Bug : CSS de ÉLASTIQUE Ne Fonctionne Pas

**Date :** Janvier 2026

**Symptôme :**
Hover sur les lettres de ÉLASTIQUE → rien ne se passe.

**Cause :**
Sélecteurs CSS trop génériques :
```css
.e1:hover { transform: scaleY(2); }
```

**Solution :**
Sélecteurs spécifiques :
```css
h1.word-game.elastique .e1:hover { transform: scaleY(2); }
```

**Leçon :**
TOUJOURS préfixer les sélecteurs avec `h1.word-game.nom-du-mot`.

---

### Bug : Fade-In Puis Coupure Abrupte

**Date :** Janvier 2026

**Symptôme :**
Navigation entre mots → fade-in commence, puis coupure brutale vers noir.

**Cause :**
`display()` mettait `opacity: 1` immédiatement, puis `fadeIn()` essayait de partir de 0 → conflit.

**Solution :**
Retirer le reset automatique d'opacity dans `display()`. Gérer manuellement quand nécessaire.

**Leçon :**
Ne pas mélanger reset automatique et transitions. Choisir l'un ou l'autre.

---

## Commandes de Debugging Utiles

### Vérifier l'État du Projet

```bash
# Fichiers modifiés mais pas commités
git status

# Différences exactes
git diff
git diff fichier.js

# Historique
git log --oneline -10

# Voir un fichier à un commit précédent
git show commit-hash:fichier.js
```

### Inspecter le DOM

```javascript
// Dans la console (F12)

// Vérifier qu'un élément existe
document.getElementById('endGameOverlay')

// Vérifier les classes
document.getElementById('endGameOverlay').classList

// Vérifier les styles appliqués
getComputedStyle(document.getElementById('endGameOverlay')).opacity

// Voir tous les styles CSS chargés
[...document.styleSheets[0].cssRules].map(r => r.selectorText)
```

### Test Rapide d'un Module

```javascript
// Charger et tester un module directement
import('./words/contraction.js').then(m => {
  console.log(m.default);
  // Vérifier la structure
});
```

---

## Checklist de Debugging

Quand quelque chose ne marche pas :

- [ ] Console ouverte (F12) → Erreurs ?
- [ ] Network tab → Tous les fichiers chargent (200) ?
- [ ] Elements tab → HTML correct ? Classes appliquées ?
- [ ] Styles tab → CSS appliqué ? Sélecteurs corrects ?
- [ ] `git status` → Fichiers commités ?
- [ ] Testé en local ET sur GitHub Pages ?
- [ ] Cache vidé (Ctrl+Shift+R) ?

---

**Dernière mise à jour :** Janvier 2026

**Si ton problème n'est pas listé ici, documente-le une fois résolu !**
