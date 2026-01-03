# Guide de Développement

Ce document décrit le workflow pratique pour développer et maintenir le projet.

---

## Table des Matières

1. [Setup Initial](#setup-initial)
2. [Workflow de Développement](#workflow-de-développement)
3. [Utiliser test.html](#utiliser-testhtml)
4. [Ajouter un Nouveau Mot](#ajouter-un-nouveau-mot)
5. [Git et Déploiement](#git-et-déploiement)
6. [Bonnes Pratiques](#bonnes-pratiques)

---

## Setup Initial

### Première Installation

```bash
# Cloner le repo
git clone https://github.com/gauthierae/jeuxdemots.git
cd jeuxdemots

# Vérifier la structure
ls -la

# Lancer le serveur de développement
# Option recommandée : VS Code Live Server
code .
```

### Configuration Git

```bash
# Configurer credential helper pour ne pas retaper le token
git config --global credential.helper 'cache --timeout=86400'

# Vérifier la configuration
git config --list
```

---

## Workflow de Développement

### Cycle Typique

```
1. Idée de mot
   ↓
2. Prototypage rapide dans test.html (HTML/CSS direct)
   ↓
3. Itération sur l'effet visuel
   ↓
4. Conversion en module ES6
   ↓
5. Test du module dans test.html
   ↓
6. Validation dans l'application principale
   ↓
7. Commit et push
   ↓
8. Vérification sur GitHub Pages
```

### Commandes Quotidiennes

```bash
# Avant de commencer
git pull                    # Récupérer les dernières modifications
git status                  # Vérifier l'état

# Pendant le développement
# [Travailler dans test.html ou créer des modules]

# Après une fonctionnalité
git add .                   # Ajouter tous les fichiers
git status                  # Vérifier ce qui sera commité
git commit -m "feat: ..."   # Commiter avec message clair
git push                    # Pousser vers GitHub

# Vérifier sur GitHub Pages
# Attendre ~1 minute, puis visiter https://gauthierae.github.io/jeuxdemots/
```

---

## Utiliser test.html

### Objectif

Page de test isolée pour développer et tester les mots **sans** passer par l'application complète.

### Workflow dans test.html

#### Phase 1 : Prototypage Rapide

**Éditer test.html directement :**

```html
<!-- Dans test.html, section test-container -->
<div id="test-container">
    <h1 class="word-game nouveau-mot">
        <span class="partie1">PARTI</span><span class="partie2">E2</span>
    </h1>
</div>

<style>
    /* Styles temporaires pour tester */
    .partie1 {
        transform: scaleX(0.5);
        transition: transform 0.3s;
    }
    
    .partie1:hover {
        transform: scaleX(1.5);
    }
</style>
```

**Avantages :**
- Itération ultra-rapide (F5 pour recharger)
- Pas besoin de modules ES6
- Focus sur l'effet visuel

#### Phase 2 : Conversion en Module

Une fois l'effet satisfaisant, convertir en module :

```javascript
// words/nouveau-mot.js
export default {
  id: 'nouveau-mot',
  html: `
    <h1 class="word-game nouveau-mot">
      <span class="partie1">PARTI</span><span class="partie2">E2</span>
    </h1>
  `,
  css: `
    h1.word-game.nouveau-mot {
      font-family: Georgia, serif;
      font-size: 5rem;
      /* ... */
    }
    
    .partie1 {
      transform: scaleX(0.5);
      transition: transform 0.3s;
    }
    
    h1.word-game.nouveau-mot:hover .partie1 {
      transform: scaleX(1.5);
    }
  `,
  enterTransition: null,
  exitTransition: null,
  init: function(container) {
    console.log('>>> Mot NOUVEAU-MOT initialisé');
  },
  cleanup: function() {
    console.log('>>> Mot NOUVEAU-MOT nettoyé');
  }
};
```

#### Phase 3 : Test du Module

**Ajouter au registre :**
```javascript
// words/word-registry.js
import nouveauMot from './nouveau-mot.js';

export default [
  contraction,
  flexible,
  elastique,
  nouveauMot  // Ajouter ici
];
```

**Tester dans test.html :**
1. Recharger test.html (avec Live Server)
2. Sélectionner le nouveau mot dans le dropdown
3. Cliquer "Charger"
4. Vérifier :
   - Affichage correct
   - Hover fonctionne
   - Console affiche les logs init/cleanup
   - Pas d'erreur dans la console

#### Phase 4 : Test dans l'Application

1. Ouvrir `index.html`
2. Jouer aux jeux de mots
3. Le nouveau mot apparaît dans le shuffle
4. Vérifier le comportement dans le flow complet

---

## Ajouter un Nouveau Mot

### Checklist Complète

#### 1. Conception
- [ ] Choisir un mot intéressant visuellement
- [ ] Imaginer l'effet hover (scaleX/Y, rotate, translate, opacity)
- [ ] Décider de la structure HTML (spans nécessaires)

#### 2. Prototypage
- [ ] Ouvrir `test.html`
- [ ] Écrire HTML directement dans `#test-container`
- [ ] Ajouter CSS dans un `<style>` temporaire
- [ ] Itérer jusqu'à satisfaction

#### 3. Conversion en Module
- [ ] Créer `/words/nom-du-mot.js`
- [ ] Copier HTML dans `html: ...`
- [ ] Copier CSS dans `css: ...`
- [ ] Ajouter sélecteurs spécifiques (h1.word-game.nom-du-mot)
- [ ] Implémenter init() et cleanup() si nécessaire

#### 4. Enregistrement
- [ ] Importer dans `word-registry.js`
- [ ] Ajouter au tableau export

#### 5. Tests
- [ ] Tester dans `test.html` (dropdown)
- [ ] Vérifier hover
- [ ] Vérifier rechargement multiple (pas de duplication CSS)
- [ ] Tester dans `index.html`
- [ ] Vérifier navigation vers/depuis ce mot

#### 6. Commit
```bash
git add words/nom-du-mot.js words/word-registry.js
git commit -m "feat: add NOM-DU-MOT word (description de l'effet)"
git push
```

#### 7. Validation Production
- [ ] Attendre ~1 minute
- [ ] Visiter GitHub Pages
- [ ] Tester le nouveau mot en prod

### Exemple Complet : COMBUSTION

**Conception :**
- Effet : Lettres qui "brûlent" (scale + rotate + color shift au hover)

**Prototypage dans test.html :**
```html
<h1 class="word-game combustion">
    <span class="c">C</span><span class="o">O</span><span class="m">M</span>
    <span class="b">B</span><span class="u">U</span><span class="s">S</span>
    <span class="t">T</span><span class="i">I</span><span class="o2">O</span><span class="n">N</span>
</h1>

<style>
h1.combustion span {
    display: inline-block;
    transition: all 0.3s ease-out;
}

h1.combustion:hover .c { transform: scale(1.2) rotate(5deg); color: #ff4500; }
h1.combustion:hover .o { transform: scale(1.3) rotate(-3deg); color: #ff6347; }
/* ... etc pour chaque lettre */
</style>
```

**Conversion :**
```javascript
// words/combustion.js
export default {
  id: 'combustion',
  html: `<h1 class="word-game combustion">...</h1>`,
  css: `
    h1.word-game.combustion {
      font-family: Georgia, serif;
      font-size: 5rem;
      /* ... */
    }
    h1.word-game.combustion span {
      display: inline-block;
      transition: all 0.3s ease-out;
    }
    h1.word-game.combustion:hover .c {
      transform: scale(1.2) rotate(5deg);
      color: #ff4500;
    }
    /* ... */
  `,
  enterTransition: null,
  exitTransition: null,
  init: function(container) {},
  cleanup: function() {}
};
```

---

## Git et Déploiement

### Workflow Git Standard

```bash
# 1. Vérifier l'état avant de commencer
git status
git pull

# 2. Travailler sur le code
# [Modifications...]

# 3. Vérifier les changements
git status
git diff

# 4. Ajouter les fichiers
git add .
# OU ajouter spécifiquement
git add words/nouveau-mot.js words/word-registry.js

# 5. Commiter avec message descriptif
git commit -m "feat: add NOUVEAU-MOT word with scale effect"

# 6. Pousser vers GitHub
git push

# 7. Vérifier le déploiement
# Attendre ~1-2 minutes
# Visiter https://gauthierae.github.io/jeuxdemots/
```

### Convention de Messages de Commit

**Format :** `type: description courte`

**Types :**
- `feat:` - Nouvelle fonctionnalité ou nouveau mot
- `fix:` - Correction de bug
- `refactor:` - Refactorisation sans changement de fonctionnalité
- `docs:` - Documentation seulement
- `style:` - CSS ou formatage (pas de changement de logique)
- `test:` - Ajout ou modification de tests

**Exemples :**
```bash
git commit -m "feat: add EXPANSION word with grow effect"
git commit -m "fix: correct hover zone for ELASTIQUE letters"
git commit -m "refactor: simplify BaseEngine fadeIn method"
git commit -m "docs: update ARCHITECTURE with transition examples"
git commit -m "style: improve mobile responsive for h1 titles"
```

### Déploiement GitHub Pages

**Automatique :**
- Chaque `git push` déclenche un déploiement
- Délai : ~1-2 minutes
- Pas de configuration nécessaire

**Vérification :**
1. Aller sur https://github.com/gauthierae/jeuxdemots
2. Onglet "Actions" pour voir le statut du déploiement
3. Attendre que le ✅ vert apparaisse
4. Visiter https://gauthierae.github.io/jeuxdemots/

**En cas de problème :**
- Vérifier la console du navigateur (F12)
- Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Bonnes Pratiques

### Code

**CSS :**
- ✅ Toujours utiliser des sélecteurs spécifiques
  ```css
  /* ✅ BON */
  h1.word-game.contraction .con { ... }
  
  /* ❌ MAUVAIS */
  .con { ... }
  ```

- ✅ Grouper les propriétés logiquement
  ```css
  h1.word-game.flexible {
    /* Layout */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    
    /* Spacing */
    margin: 0;
    padding: 0.5rem 1rem;
    
    /* Typography */
    font-family: Georgia, serif;
    font-size: 5rem;
    color: #e0e0e0;
  }
  ```

**JavaScript :**
- ✅ Logs descriptifs dans init() et cleanup()
- ✅ Nommer les fonctions de façon explicite
- ✅ Commenter les parties non-évidentes

### Workflow

**Tester isolément AVANT d'intégrer :**
1. test.html d'abord
2. Application complète ensuite

**Commits fréquents :**
- Commiter après chaque mot complété
- Ne pas accumuler plusieurs mots dans un seul commit

**Vérifier sur GitHub Pages :**
- Ce qui marche en local peut échouer en prod
- Toujours tester en production après push

### Debugging

**Console toujours ouverte (F12) :**
- Logs de chaque étape
- Erreurs visibles immédiatement

**En cas de bug :**
1. Reproduire dans test.html
2. Isoler le problème
3. Fixer
4. Re-tester dans test.html
5. Tester dans l'app complète
6. Commit

**Git comme filet de sécurité :**
```bash
# Si quelque chose casse
git status                  # Voir ce qui a changé
git diff                    # Voir les modifications exactes
git checkout -- fichier.js  # Annuler les changements sur un fichier
git reset --hard HEAD       # Annuler TOUS les changements (attention!)
```

---

## Commandes de Référence Rapide

### Développement
```bash
# Lancer serveur local
python -m http.server 8000
# OU
npx serve
# OU VS Code Live Server

# Ouvrir dans navigateur
http://localhost:8000
http://localhost:8000/test.html
```

### Git
```bash
# Status
git status
git diff

# Ajouter
git add .
git add fichier.js

# Commiter
git commit -m "message"

# Pousser
git push

# Annuler
git checkout -- fichier.js    # Annuler fichier
git reset --hard HEAD          # Annuler tout

# Historique
git log --oneline
git log --oneline -5
```

### Debugging
```bash
# Vérifier que tous les fichiers sont présents
ls -la
ls -la engines/
ls -la words/

# Vérifier le contenu d'un fichier
cat words/contraction.js

# Chercher dans les fichiers
grep -r "fonction" .
```

---

**Dernière mise à jour :** Janvier 2026
