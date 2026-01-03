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
