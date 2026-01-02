// ===================================
// WORD ENGINE
// Moteur spécialisé pour afficher les jeux de mots
// ===================================

import BaseEngine from './BaseEngine.js';

export default class WordEngine extends BaseEngine {
  constructor(container) {
    super(container);
    this.currentWord = null;
    
    console.log('>>> WordEngine créé');
  }
  
  // Afficher un mot
  display(wordModule) {
    console.log(`>>> WordEngine.display(${wordModule.id})`);
    
    // Vider le container
    this.container.innerHTML = '';
    
    // Injecter le HTML du mot
    this.container.innerHTML = wordModule.html;
    
    // Injecter le CSS du mot
    this.injectCSS(wordModule.css);
    
    // Initialiser le mot
    if (wordModule.init) {
      wordModule.init(this.container);
    }
    
    // Stocker la référence
    this.currentWord = wordModule;
    
    console.log('✓ Mot affiché');
  }
  
  // Cacher le mot actuel
  hide() {
    if (!this.currentWord) {
      console.log('⚠️ Aucun mot à cacher');
      return;
    }
    
    console.log(`>>> WordEngine.hide(${this.currentWord.id})`);
    
    // Appeler cleanup du mot
    if (this.currentWord.cleanup) {
      this.currentWord.cleanup();
    }
    
    // Cleanup du BaseEngine (vide container + retire CSS)
    this.cleanup();
    
    // Réinitialiser
    this.currentWord = null;
    
    console.log('✓ Mot caché');
  }
}
