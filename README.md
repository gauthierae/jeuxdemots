# Zen ou l'art des jeux de mots

Application web interactive de jeux de mots visuels en français. Chaque mot se transforme de manière unique au passage de la souris, créant des expériences ludiques et contemplatives.

## 🎮 Démo

**Live :** https://gauthierae.github.io/jeuxdemots/

## ✨ Fonctionnalités

- **3 jeux de mots interactifs** avec effets visuels au hover
- **Architecture modulaire** : facile d'ajouter de nouveaux mots
- **Navigation fluide** entre les mots avec shuffle aléatoire
- **Responsive** (mobile à venir)
- **Zero dépendances** : HTML/CSS/JS vanilla

## 📁 Structure du Projet

```
/
├── README.md              # Ce fichier
├── ARCHITECTURE.md        # Décisions techniques détaillées
├── DEVELOPMENT.md         # Guide de développement
├── TROUBLESHOOTING.md     # Bugs connus et solutions
├── CHANGELOG.md           # Historique des versions
├── index.html             # Application principale
├── test.html              # Page de test pour développer les mots
├── styles.css             # Styles communs
├── script.js              # Orchestrateur principal
├── /engines/              # Moteurs de jeu par type
│   ├── BaseEngine.js      # Classe de base commune
│   └── WordEngine.js      # Moteur spécifique aux mots
├── /words/                # Modules des jeux de mots
│   ├── contraction.js     # Mot: CONTRACTION
│   ├── flexible.js        # Mot: FLEXIBLE
│   ├── elastique.js       # Mot: ÉLASTIQUE
│   └── word-registry.js   # Liste de tous les mots
└── /test/                 # Environnement de développement
    └── test-script.js     # Script pour tester les mots isolément
```

## 🚀 Démarrage Rapide

### Prérequis

Un serveur HTTP local (les modules ES6 ne fonctionnent pas avec `file://`)

### Installation

```bash
# Cloner le repo
git clone https://github.com/gauthierae/jeuxdemots.git
cd jeuxdemots

# Lancer un serveur local (choisir une option)

# Option 1 : Python
python -m http.server 8000

# Option 2 : Node.js
npx serve

# Option 3 : VS Code Live Server
# Installer l'extension "Live Server"
# Clic droit sur index.html > "Open with Live Server"
```

Ouvrir http://localhost:8000 dans le navigateur.

### Tester un Mot Isolément

```bash
# Ouvrir test.html avec Live Server
# Sélectionner un mot dans le dropdown
# Tester les interactions
```

## 🎯 Roadmap

### ✅ Complété (MVP 1.0)
- [x] Architecture modulaire avec engines séparés
- [x] 3 mots fonctionnels (CONTRACTION, FLEXIBLE, ÉLASTIQUE)
- [x] Navigation complète (LOBBY → PLAYING → EndGameUI)
- [x] Page de test isolée pour développement
- [x] Déploiement GitHub Pages

### 🔜 Prochaines Étapes

**Immédiat :**
- [ ] **Mobile responsive** (media queries, touch events, tailles adaptatives)

**Court terme :**
- [ ] Ajouter mots : COMBUSTION, EXPANSION, DIVISION, GRAVITATION
- [ ] Implémenter transitions custom (enterTransition/exitTransition)

**Moyen terme :**
- [ ] Nouveau type de jeu : Jokes de père (JokeEngine)
- [ ] Interface pour choisir le type de jeu

**Long terme :**
- [ ] Autres types de jeux (puzzles, anagrammes)
- [ ] Mode multijoueur ?
- [ ] Persistance scores/progression ?

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Décisions techniques et comment étendre le système
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Workflow de développement et bonnes pratiques
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions aux problèmes courants
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions

## 🛠️ Développement

### Ajouter un Nouveau Mot (Résumé)

1. Développer dans `test.html`
2. Convertir en module dans `/words/nouveau-mot.js`
3. Ajouter à `word-registry.js`
4. Tester dans `test.html` avec le module
5. Tester dans l'application principale

**Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le guide détaillé.**

### Convention de Commits

```
feat: description       # Nouvelle fonctionnalité ou nouveau mot
fix: description        # Correction de bug
refactor: description   # Refactorisation du code
docs: description       # Documentation
style: description      # Changements CSS/visuels
```

## 👨‍💻 Developer Notes

### Environnement de Développement

- **OS :** Chromebook Linux (Penguin)
- **Repo local :** `~/ProjetsCode/HTML/jeuxdemots/`
- **Serveur dev :** Live Server (VS Code)
- **Déploiement :** GitHub Pages (automatique sur push)

### Philosophie de Développement

**"Vibe coding exploratoire empirique"** avec structure :
- **Architecture intentionnelle upfront** (Type 1 decisions)
- **Itération flexible** pour les détails (Type 2 decisions)
- **MVP d'abord**, features complexes après
- **Tester isolément** avant d'intégrer
- **Commits fréquents** avec messages clairs

### Workflow Type

```
1. Idée de mot → Sketch dans test.html (HTML/CSS direct)
2. Itérer sur l'effet visuel
3. Convertir en module ES6
4. Tester le module dans test.html
5. Commit : "feat: add [MOT] word"
6. Push → GitHub Pages se met à jour automatiquement
```

## 🐛 Debugging

**Problème courant :** Ça marche en local mais pas sur GitHub Pages

**Solution :**
1. Vérifier que tous les fichiers sont commités : `git status`
2. Vérifier la console du navigateur sur GitHub Pages (F12)
3. Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md) pour plus de solutions

## 📝 Licence

*[À définir]*

## 👤 Auteur

Gauthie Rae

---

*Projet créé dans le cadre d'une exploration artistique et ludique du langage français.*

**Dernière mise à jour :** Janvier 2026

