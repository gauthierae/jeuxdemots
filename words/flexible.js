// ===================================
// MOT : FLEXIBLE
// Effet : Étirement vertical au hover
// ===================================

export default {
  id: 'flexible',
  
  // HTML du mot
  html: `
    <h1 class="word-game flexible">FLEXIBLE</h1>
  `,
  
  // CSS spécifique à ce mot
  css: `
    h1.word-game.flexible {
      font-family: Georgia, serif;
      font-size: 5rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      color: #e0e0e0;
      cursor: default;
      padding: 0.5rem 1rem;
      transition: transform 0.4s ease-out;
    }
    
    h1.word-game.flexible:hover {
      transform: scaleY(1.5);
    }
  `,
  
  // Transition d'entrée (placeholder pour l'instant)
  enterTransition: null,
  
  // Transition de sortie (placeholder pour l'instant)
  exitTransition: null,
  
  // Initialisation
  init: function(container) {
    console.log('>>> Mot FLEXIBLE initialisé');
  },
  
  // Nettoyage
  cleanup: function() {
    console.log('>>> Mot FLEXIBLE nettoyé');
  }
};
