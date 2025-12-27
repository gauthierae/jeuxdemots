// ===================================
// SCRIPT DE TEST
// Permet de charger et tester un mot isolément
// ===================================

import wordRegistry from '../words/word-registry.js';

console.log('=== TEST SCRIPT CHARGÉ ===');
console.log('Nombre de mots disponibles:', wordRegistry.length);

let currentWord = null;
let styleElement = null;

// Au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('>>> Initialisation de la page de test');
    
    // Remplir le sélecteur avec tous les mots
    const selector = document.getElementById('word-selector');
    wordRegistry.forEach(word => {
        const option = document.createElement('option');
        option.value = word.id;
        option.textContent = word.id.toUpperCase();
        selector.appendChild(option);
    });
    
    console.log('✓ Sélecteur rempli avec', wordRegistry.length, 'mots');
    
    // Event listeners
    document.getElementById('load-word').addEventListener('click', loadSelectedWord);
    document.getElementById('reload').addEventListener('click', () => location.reload());
    
    // Permettre de charger avec Enter
    selector.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadSelectedWord();
    });
});

// Charger le mot sélectionné
function loadSelectedWord() {
    const selector = document.getElementById('word-selector');
    const wordId = selector.value;
    
    if (!wordId) {
        alert('Veuillez sélectionner un mot');
        return;
    }
    
    console.log('\n=== CHARGEMENT DU MOT:', wordId, '===');
    
    // Trouver le mot dans le registry
    const wordModule = wordRegistry.find(w => w.id === wordId);
    
    if (!wordModule) {
        console.error('Mot non trouvé:', wordId);
        return;
    }
    
    // Nettoyer le mot précédent si nécessaire
    if (currentWord && currentWord.cleanup) {
        console.log('>>> Nettoyage du mot précédent');
        currentWord.cleanup();
    }
    
    // Nettoyer le conteneur
    const container = document.getElementById('test-container');
    container.innerHTML = '';
    
    // Retirer l'ancien style
    if (styleElement) {
        styleElement.remove();
    }
    
    // Injecter le CSS du mot
    styleElement = document.createElement('style');
    styleElement.textContent = wordModule.css;
    document.head.appendChild(styleElement);
    console.log('✓ CSS injecté');
    
    // Injecter le HTML du mot
    container.innerHTML = wordModule.html;
    console.log('✓ HTML injecté');
    
    // Initialiser le mot
    if (wordModule.init) {
        wordModule.init(container);
    }
    
    // Sauvegarder la référence
    currentWord = wordModule;
    
    // Mettre à jour l'info
    const info = document.getElementById('test-info');
    info.innerHTML = `
        <strong>Mot chargé :</strong> ${wordModule.id}<br>
        <strong>Transition entrée :</strong> ${wordModule.enterTransition ? wordModule.enterTransition.duration + 'ms' : 'none'}<br>
        <strong>Transition sortie :</strong> ${wordModule.exitTransition ? wordModule.exitTransition.duration + 'ms' : 'none'}<br>
        <strong>Init() :</strong> ${wordModule.init ? 'Oui' : 'Non'}<br>
        <strong>Cleanup() :</strong> ${wordModule.cleanup ? 'Oui' : 'Non'}
    `;
    
    console.log('✓ Mot chargé avec succès');
}
