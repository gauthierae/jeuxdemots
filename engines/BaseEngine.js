// ===================================
// BASE ENGINE
// Classe de base pour tous les engines de jeu
// Contient les méthodes communes (transitions, CSS, cleanup)
// ===================================

export default class BaseEngine {
  constructor(container) {
    this.container = container;
    this.styleElement = null;
    
    console.log('>>> BaseEngine créé');
  }
  
  // Injecter du CSS dans le head
  injectCSS(css) {
    // Créer un élément style
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = css;
    
    // Ajouter au head
    document.head.appendChild(this.styleElement);
    
    console.log('✓ CSS injecté');
  }
  
  // Retirer le CSS du head
  removeCSS() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
      console.log('✓ CSS retiré');
    }
  }
  
  // Fade out du container
  fadeOut(duration, callback) {
    this.container.style.transition = `opacity ${duration}ms ease-in-out`;
    this.container.style.opacity = '0';
    
    console.log(`✓ Fade out démarré (${duration}ms)`);
    
    setTimeout(() => {
      if (callback) callback();
    }, duration);
  }
  
  // Fade in du container
  fadeIn(duration, callback) {
    // Partir de opacity 0
    this.container.style.opacity = '0';
    
    // Force reflow
    this.container.offsetHeight;
    
    this.container.style.transition = `opacity ${duration}ms ease-in-out`;
    this.container.style.opacity = '1';
    
    console.log(`✓ Fade in démarré (${duration}ms)`);
    
    setTimeout(() => {
      if (callback) callback();
    }, duration);
  }
  
  // Nettoyage complet
  cleanup() {
    // Retirer le CSS
    this.removeCSS();
    
    // Vider le container
    this.container.innerHTML = '';
    
    console.log('✓ Cleanup effectué');
  }
}
