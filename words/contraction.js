// ===================================
// MOT : CONTRACTION
// Effet : CON compressé → CONTRACTION au hover
// ===================================

export default {
  id: 'contraction',
  
  // HTML du mot
  html: `
    <h1 class="word-game contraction">
      <span class="con">CON</span><span class="traction">TRACTION</span>
    </h1>
  `,
  
  // CSS spécifique à ce mot
  css: `
    h1.word-game.contraction {
      font-family: Georgia, serif;
      font-size: 5rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      color: #e0e0e0;
      cursor: default;
      padding: 0.5rem 1rem;
    }
    
    .con {
      display: inline-block;
      transform: scaleX(0.25);
      transition: transform 0.5s ease;
    }
    
    h1.word-game.contraction:hover .con {
      transform: scaleX(2);
    }
    
    .traction {
      display: inline-block;
      transform: scaleX(1.3);
      transition: transform 0.5s ease;
    }
    
    h1.word-game.contraction:hover .traction {
      transform: scaleX(0.55);
    }
  `,
  
  // Transition d'entrée
  enterTransition: {
    duration: 800,
    effect: function(element, callback) {
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8)';
      
      // Force reflow
      element.offsetHeight;
      
      element.style.transition = 'opacity 800ms ease-out, transform 800ms ease-out';
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
      
      setTimeout(callback, 800);
    }
  },
  
  // Transition de sortie
  exitTransition: {
    duration: 800,
    effect: function(element, callback) {
      element.style.transition = 'opacity 800ms ease-in, transform 800ms ease-in';
      element.style.opacity = '0';
      element.style.transform = 'scale(1.2)';
      
      setTimeout(callback, 800);
    }
  },
  
  // Initialisation (si JS nécessaire)
  init: function(container) {
    console.log('>>> Mot CONTRACTION initialisé');
    // Event listeners spécifiques si nécessaire
  },
  
  // Nettoyage
  cleanup: function() {
    console.log('>>> Mot CONTRACTION nettoyé');
    // Retirer event listeners si nécessaire
  }
};
