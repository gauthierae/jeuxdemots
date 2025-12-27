// ===================================
// PHASE 2.1 REVISITÉE : NOUVELLE ARCHITECTURE
// 2 vues distinctes : LOBBY et PLAYING
// ===================================

console.log('=== SCRIPT CHARGÉ ===');

// États de l'application
const GameState = {
    LOBBY: 'lobby',
    PLAYING: 'playing'
};

// État actuel
let currentState = GameState.LOBBY;

// Durée des transitions (doit correspondre au CSS)
const TRANSITION_DURATION = 800;
const TOTAL_TRANSITION_TIME = TRANSITION_DURATION + 50;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CHARGÉ ===');
    initApp();
});

// Initialisation de l'application
function initApp() {
    console.log('>>> initApp() appelée');
    
    // Récupérer les boutons
    const enterBtn = document.getElementById('enterBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    // Vérifier que tout existe
    console.log('Bouton Entrer trouvé:', enterBtn !== null);
    console.log('Bouton Sortir trouvé:', exitBtn !== null);
    
    // Ajouter les écouteurs d'événements
    if (enterBtn) {
        enterBtn.addEventListener('click', enterGame);
        console.log('✓ Event listener ajouté au bouton Entrer');
    } else {
        console.error('✗ Bouton Entrer non trouvé !');
    }
    
    if (exitBtn) {
        exitBtn.addEventListener('click', exitGame);
        console.log('✓ Event listener ajouté au bouton Sortir');
    } else {
        console.error('✗ Bouton Sortir non trouvé !');
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
    const exitBtn = document.getElementById('exitBtn');
    
    // Désactiver immédiatement le bouton pour éviter le spam
    enterBtn.disabled = true;
    console.log('✓ Bouton Entrer désactivé');
    
    // Étape 1 : Fade-out de la vue LOBBY
    lobbyView.classList.add('hidden');
    console.log('✓ Lobby view fade-out démarré');
    
    // Étape 2 : Après la transition, cacher complètement lobby et afficher playing
    setTimeout(() => {
        lobbyView.style.display = 'none';
        console.log('✓ Transition terminée - lobby caché (display: none)');
        
        playingView.style.display = 'block';
        console.log('✓ Playing view affiché (display: block)');
        
        // Petit délai pour que le display: block soit appliqué avant le fade-in
        setTimeout(() => {
            playingView.classList.remove('hidden');
            console.log('✓ Playing view fade-in démarré');
            
            // Activer le bouton Sortir
            exitBtn.disabled = false;
            console.log('✓ Bouton Sortir activé');
            
            // Changer l'état
            currentState = GameState.PLAYING;
            console.log('État actuel:', currentState);
        }, 50);
        
    }, TRANSITION_DURATION);
}

// Sortir du jeu (PLAYING → LOBBY)
function exitGame() {
    console.log('\n=== TRANSITION PLAYING → LOBBY ===');
    console.log('>>> exitGame() appelée');
    
    const lobbyView = document.getElementById('lobby-view');
    const playingView = document.getElementById('playing-view');
    const enterBtn = document.getElementById('enterBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    // Désactiver immédiatement le bouton pour éviter le spam
    exitBtn.disabled = true;
    console.log('✓ Bouton Sortir désactivé');
    
    // Étape 1 : Fade-out de la vue PLAYING
    playingView.classList.add('hidden');
    console.log('✓ Playing view fade-out démarré');
    
    // Étape 2 : Après la transition, cacher complètement playing et afficher lobby
    setTimeout(() => {
        playingView.style.display = 'none';
        console.log('✓ Transition terminée - playing caché (display: none)');
        
        lobbyView.style.display = 'block';
        console.log('✓ Lobby view affiché (display: block)');
        
        // Petit délai pour que le display: block soit appliqué avant le fade-in
        setTimeout(() => {
            lobbyView.classList.remove('hidden');
            console.log('✓ Lobby view fade-in démarré');
            
            // Activer le bouton Entrer
            enterBtn.disabled = false;
            console.log('✓ Bouton Entrer activé');
            
            // Changer l'état
            currentState = GameState.LOBBY;
            console.log('État actuel:', currentState);
        }, 50);
        
    }, TRANSITION_DURATION);
}

// ===================================
// PLACEHOLDERS POUR PHASES FUTURES
// ===================================

// FUTURE PHASE 4-5: Gestion des mots interactifs
const WordInteraction = {
    // spawn, interactions, etc.
};

console.log('=== FIN DU SCRIPT ===');
