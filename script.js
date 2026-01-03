// ===================================
// ORCHESTRATEUR PRINCIPAL
// Coordonne les différents engines de jeu
// ===================================

import WordEngine from './engines/WordEngine.js';
import wordRegistry from './words/word-registry.js';

console.log('=== ORCHESTRATEUR CHARGÉ ===');
console.log('Mots disponibles:', wordRegistry.length);

// État de l'application
const GameState = {
    LOBBY: 'lobby',
    PLAYING: 'playing'
};

let currentState = GameState.LOBBY;
let wordEngine = null;

// Variables pour la gestion de la queue des mots
let wordsQueue = [];        // Mots mélangés à jouer
let wordsPlayed = [];       // Mots déjà vus
let currentWordIndex = 0;   // Index actuel dans la queue

// Fonction utilitaire : mélanger un tableau (Fisher-Yates)
function shuffle(array) {
    const shuffled = [...array]; // Copie pour ne pas modifier l'original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    console.log('✓ Tableau mélangé');
    return shuffled;
}

// Initialiser une session de jeu
function initGameSession() {
    console.log('\n=== INITIALISATION SESSION ===');
    
    // Mélanger les mots
    wordsQueue = shuffle(wordRegistry);
    console.log('✓ Queue créée avec', wordsQueue.length, 'mots');
    
    // Reset des variables
    wordsPlayed = [];
    currentWordIndex = 0;
    
    console.log('✓ Session initialisée');
}

// Charger le prochain mot
function loadNextWord() {
    console.log('\n>>> loadNextWord() appelée');
    
    // Vérifier s'il reste des mots
    if (currentWordIndex >= wordsQueue.length) {
        console.log('⚠️ Plus de mots dans la queue');
        return false;
    }
    
    // Récupérer le mot actuel
    const wordModule = wordsQueue[currentWordIndex];
    console.log(`✓ Chargement du mot #${currentWordIndex + 1}/${wordsQueue.length} : ${wordModule.id}`);
    
    // Afficher via WordEngine
    wordEngine.display(wordModule);
    
    // Ajouter aux mots joués
    wordsPlayed.push(wordModule);
    
    // Incrémenter l'index
    currentWordIndex++;
    
    console.log(`✓ Mots vus : ${wordsPlayed.length}/${wordsQueue.length}`);
    return true;
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CHARGÉ ===');
    initApp();
});

function initApp() {
    console.log('>>> initApp() appelée');
    
    // Récupérer les éléments
    const gameContainer = document.getElementById('game-container');
    const enterBtn = document.getElementById('enterBtn');
    const startBtn = document.getElementById('startBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    
    // Vérifier que les éléments existent
    console.log('game-container trouvé:', gameContainer !== null);
    console.log('enterBtn trouvé:', enterBtn !== null);
    console.log('startBtn trouvé:', startBtn !== null);
    console.log('nextWordBtn trouvé:', nextWordBtn !== null);
    
    // Créer l'instance WordEngine
    if (gameContainer) {
        wordEngine = new WordEngine(gameContainer);
        console.log('✓ WordEngine instancié');
    } else {
        console.error('✗ game-container non trouvé !');
    }
    
    // Event listeners
    if (enterBtn) {
        enterBtn.addEventListener('click', enterGame);
        console.log('✓ Event listener ajouté au bouton Entrer');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
        console.log('✓ Event listener ajouté au bouton Commencer');
    }
    
    if (nextWordBtn) {
        nextWordBtn.addEventListener('click', nextWord);
        console.log('✓ Event listener ajouté au bouton Suivant');
    }
    
    console.log('État initial:', currentState);
}

// Entrer dans le jeu (LOBBY → PLAYING)
function enterGame() {
    console.log('\n=== TRANSITION LOBBY → PLAYING ===');
    console.log('>>> enterGame() appelée');
    
    const lobbyView = document.getElementById('lobby-view');
    const playingView = document.getElementById('playing-view');
    const enterBtn = document.getElementById('enterBtn');
    
    // Désactiver le bouton
    enterBtn.disabled = true;
    console.log('✓ Bouton Entrer désactivé');
    
    // Étape 1 : Fade-out lobby
    lobbyView.classList.add('hidden');
    console.log('✓ Lobby fade-out démarré');
    
    // Étape 2 : Après 800ms, cacher lobby et afficher playing
    setTimeout(() => {
        lobbyView.style.display = 'none';
        playingView.style.display = 'block';
        console.log('✓ Lobby caché, Playing affiché');
        
        // Étape 3 : Fade-in playing
        setTimeout(() => {
            playingView.classList.remove('hidden');
            console.log('✓ Playing fade-in démarré');
            
            // Changer l'état
            currentState = GameState.PLAYING;
            console.log('État actuel:', currentState);
            
            // Initialiser la session (mots shufflés et prêts)
            initGameSession();
            
            // Container reste vide pour l'instant
        }, 50);
    }, 800);
}

// Sortir du jeu (PLAYING → LOBBY)
function exitGame() {
    console.log('\n=== TRANSITION PLAYING → LOBBY ===');
    console.log('>>> exitGame() appelée');
    
    const lobbyView = document.getElementById('lobby-view');
    const playingView = document.getElementById('playing-view');
    const enterBtn = document.getElementById('enterBtn');
    
    // Fade-out playing
    playingView.classList.add('hidden');
    console.log('✓ Playing fade-out démarré');
    
    setTimeout(() => {
        playingView.style.display = 'none';
        lobbyView.style.display = 'block';
        console.log('✓ Playing caché, Lobby affiché');
        
        setTimeout(() => {
            lobbyView.classList.remove('hidden');
            console.log('✓ Lobby fade-in démarré');
            
            enterBtn.disabled = false;
            console.log('✓ Bouton Entrer réactivé');
            
            currentState = GameState.LOBBY;
            console.log('État actuel:', currentState);
            
            // Cleanup : cacher overlay et reset boutons
            const overlay = document.getElementById('endGameOverlay');
            const startBtn = document.getElementById('startBtn');
            const nextWordBtn = document.getElementById('nextWordBtn');
            
            if (overlay) {
                overlay.classList.add('hidden');
            }
            
            // Reset boutons pour la prochaine session
            if (startBtn && nextWordBtn) {
                startBtn.style.display = 'block';
                nextWordBtn.style.display = 'none';
                nextWordBtn.disabled = true;
            }
            
            // Cleanup du mot si présent
            if (wordEngine && wordEngine.currentWord) {
                wordEngine.hide();
            }
        }, 50);
    }, 800);
}

console.log('=== FIN DU SCRIPT ===');

// Étape 06 : Commencer le jeu (afficher premier mot)
function startGame() {
    console.log('\n>>> startGame() appelée');
    
    const startBtn = document.getElementById('startBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    
    // Cacher bouton Commencer
    startBtn.style.display = 'none';
    console.log('✓ Bouton Commencer caché');
    
    // Afficher bouton Suivant
    nextWordBtn.style.display = 'block';
    nextWordBtn.classList.remove('hidden');
    
    // Charger premier mot
    loadNextWord();
    
    // Activer bouton Suivant
    nextWordBtn.disabled = false;
    console.log('✓ Bouton Suivant activé');
}

// Étape 10-13 : Passer au mot suivant
function nextWord() {
    console.log('\n>>> nextWord() appelée');
    
    const nextWordBtn = document.getElementById('nextWordBtn');
    
    // Désactiver bouton
    nextWordBtn.disabled = true;
    console.log('✓ Bouton Suivant désactivé');
    
    // Vider container (hide du mot actuel)
    wordEngine.hide();
    
    // Charger prochain mot
    const hasNext = loadNextWord();
    
    if (hasNext) {
        // Réactiver bouton
        nextWordBtn.disabled = false;
        console.log('✓ Bouton Suivant réactivé');
    } else {
        // Fin : afficher EndGameUI
        showEndGameUI();
    }
}

// Étape 16 : Afficher l'interface de fin de jeu
function showEndGameUI() {
    console.log('\n=== AFFICHAGE END GAME UI ===');
    
    const overlay = document.getElementById('endGameOverlay');
    const wordsCountSpan = document.getElementById('wordsCount');
    const restartBtn = document.getElementById('restartBtn');
    const exitGameBtn = document.getElementById('exitGameBtn');
    
    // Mettre à jour le compteur
    if (wordsCountSpan) {
        wordsCountSpan.textContent = wordsPlayed.length;
    }
    
    // Afficher overlay
    if (overlay) {
        overlay.classList.remove('hidden');
        console.log('✓ Overlay affiché');
    }
    
    // Event listeners (une seule fois)
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame, { once: true });
        console.log('✓ Event listener ajouté sur Recommencer');
    }
    
    if (exitGameBtn) {
        exitGameBtn.addEventListener('click', exitGame, { once: true });
        console.log('✓ Event listener ajouté sur Sortir');
    }
}

// Étape 18 : Recommencer une partie
function restartGame() {
    console.log('\n=== RECOMMENCER LA PARTIE ===');
    
    const overlay = document.getElementById('endGameOverlay');
    const startBtn = document.getElementById('startBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    
    // Cacher overlay
    if (overlay) {
        overlay.classList.add('hidden');
        console.log('✓ Overlay caché');
    }
    
    // Reset boutons : afficher Commencer, cacher Suivant
    startBtn.style.display = 'block';
    nextWordBtn.style.display = 'none';
    nextWordBtn.disabled = true;
    
    // Réinitialiser session (étape 05 de ta séquence)
    initGameSession();
    console.log('✓ Partie redémarrée - prêt pour Commencer');
}
