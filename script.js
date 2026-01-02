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
    
    // Vérifier que les éléments existent
    console.log('game-container trouvé:', gameContainer !== null);
    console.log('enterBtn trouvé:', enterBtn !== null);
    
    // Créer l'instance WordEngine
    if (gameContainer) {
        wordEngine = new WordEngine(gameContainer);
        console.log('✓ WordEngine instancié');
    } else {
        console.error('✗ game-container non trouvé !');
    }
    
    // FUTURE PHASE 3 : Event listeners pour navigation
    // FUTURE PHASE 3 : Logique de shuffle et rotation des mots
    
    console.log('État initial:', currentState);
}

console.log('=== FIN DU SCRIPT ===');
