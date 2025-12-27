# Zen ou l'art des jeux de mots

Application web interactive de jeux de mots visuels en français. Chaque mot se transforme de manière unique au passage de la souris, créant des expériences ludiques et contemplatives.

## 🎮 Démo

*[Le lien GitHub Pages sera ajouté ici une fois déployé]*

## 📁 Structure du Projet

```
/
├── index.html          # Application principale
├── test.html           # Page de test pour développer les mots
├── styles.css          # Styles communs
├── script.js           # Moteur de jeu principal
├── /words/             # Modules des jeux de mots
│   ├── contraction.js  # Mot: CONTRACTION
│   └── word-registry.js # Liste de tous les mots disponibles
└── /test/              # Environnement de développement
    └── test-script.js  # Script pour tester les mots isolément
```

## 🛠️ Architecture

### Modules de Mots

Chaque jeu de mot est un module ES6 indépendant contenant :
- **HTML** : Structure du mot avec spans pour chaque lettre/partie
- **CSS** : Transformations et animations spécifiques
- **Transitions** : Effets d'entrée et de sortie personnalisés
- **Init/Cleanup** : Logique JavaScript si nécessaire

Exemple de structure d'un module :
```javascript
export default {
  id: 'nom-du-mot',
  html: `<h1>...</h1>`,
  css: `...`,
  enterTransition: { duration: 800, effect: function },
  exitTransition: { duration: 800, effect: function },
  init: function(container) { },
  cleanup: function() { }
}
```

### Environnement de Test

`test.html` permet de développer et tester chaque mot indépendamment :
1. Sélectionner un mot dans le dropdown
2. Observer les transformations au hover
3. Tester les transitions d'entrée/sortie
4. Itérer rapidement sans passer par l'application complète

## 🚀 Développement Local

### Prérequis
Un serveur HTTP local (les modules ES6 ne fonctionnent pas avec `file://`)

### Options de Serveur

**Python :**
```bash
python -m http.server 8000
```

**Node.js :**
```bash
npx serve
```

**VS Code :**
- Installer l'extension "Live Server"
- Clic droit sur `index.html` ou `test.html` > "Open with Live Server"

### Workflow de Développement d'un Nouveau Mot

1. Développer le HTML/CSS dans `test.html`
2. Tester les interactions et animations
3. Convertir en module dans `/words/nouveau-mot.js`
4. Ajouter au `word-registry.js`
5. Tester dans `test.html` avec le système de modules
6. Vérifier dans l'application principale

## 📝 Convention de Commits

- `feat: description` - Nouvelle fonctionnalité ou nouveau mot
- `fix: description` - Correction de bug
- `refactor: description` - Refactorisation du code
- `docs: description` - Documentation
- `style: description` - Changements CSS/visuels

## 🎨 Mots Disponibles

### CONTRACTION
Effet : "CON" compressé se dévoile au hover pour former "CONTRACTION"
- Transformation par scaleX sur deux parties du mot
- Transition smooth de 0.5s

*[D'autres mots seront ajoutés ici au fur et à mesure du développement]*

## 🔮 Roadmap

- [x] Architecture modulaire avec système de test
- [x] Premier mot : CONTRACTION
- [ ] Moteur de jeu (shuffle, navigation entre mots)
- [ ] Multiples jeux de mots
- [ ] Sections Bienvenue et À propos
- [ ] Transitions personnalisées par mot
- [ ] Interface de fin de partie (Recommencer/Sortir)

## 📄 Licence

*[À définir]*

## 👤 Auteur

*[Ton nom/pseudo]*

---

*Projet créé dans le cadre d'une exploration artistique et ludique du langage français.*
