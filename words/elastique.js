// ===================================
// MOT : ÉLASTIQUE
// Effet : Chaque lettre s'étire verticalement au hover (hauteurs variées)
// ===================================

export default {
  id: 'elastique',
  
  // HTML du mot
  html: `
    <h1 class="word-game elastique">
      <span class="e1">É</span><span class="l1">L</span><span class="a1">A</span><span class="s1">S</span><span class="t1">T</span><span class="i1">I</span><span class="q1">Q</span><span class="u1">U</span><span class="e2">E</span>
    </h1>
  `,
  
  // CSS spécifique à ce mot
  css: `
    h1.word-game.elastique {
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
    
    /* État initial : toutes les lettres normales */
    h1.word-game.elastique span {
      display: inline-block;
      transform: scaleY(1);
    }
    
    /* É : Étirement important, rapide */
    h1.word-game.elastique .e1 {
      transition: transform 0.3s ease-out;
    }
    h1.word-game.elastique .e1:hover {
      transform: scaleY(2.2);
    }
    
    /* L : Étirement modéré */
    h1.word-game.elastique .l1 {
      transition: transform 0.35s ease-out;
    }
    h1.word-game.elastique .l1:hover {
      transform: scaleY(1.8);
    }
    
    /* A : Étirement fort */
    h1.word-game.elastique .a1 {
      transition: transform 0.4s ease-out;
    }
    h1.word-game.elastique .a1:hover {
      transform: scaleY(2.0);
    }
    
    /* S : Étirement modéré-fort, rapide */
    h1.word-game.elastique .s1 {
      transition: transform 0.32s ease-out;
    }
    h1.word-game.elastique .s1:hover {
      transform: scaleY(1.9);
    }
    
    /* T : Étirement fort */
    h1.word-game.elastique .t1 {
      transition: transform 0.38s ease-out;
    }
    h1.word-game.elastique .t1:hover {
      transform: scaleY(2.1);
    }
    
    /* I : Le plus haut (comme un I majuscule) */
    h1.word-game.elastique .i1 {
      transition: transform 0.45s ease-out;
    }
    h1.word-game.elastique .i1:hover {
      transform: scaleY(2.5);
    }
    
    /* Q : Étirement léger */
    h1.word-game.elastique .q1 {
      transition: transform 0.3s ease-out;
    }
    h1.word-game.elastique .q1:hover {
      transform: scaleY(1.7);
    }
    
    /* U : Étirement fort */
    h1.word-game.elastique .u1 {
      transition: transform 0.36s ease-out;
    }
    h1.word-game.elastique .u1:hover {
      transform: scaleY(2.0);
    }
    
    /* E : Étirement modéré-fort */
    h1.word-game.elastique .e2 {
      transition: transform 0.33s ease-out;
    }
    h1.word-game.elastique .e2:hover {
      transform: scaleY(1.9);
    }
  `,
  
  // Transition d'entrée (placeholder pour l'instant)
  enterTransition: null,
  
  // Transition de sortie (placeholder pour l'instant)
  exitTransition: null,
  
  // Initialisation
  init: function(container) {
    console.log('>>> Mot ÉLASTIQUE initialisé');
    console.log('    9 lettres avec étirements verticaux variés');
  },
  
  // Nettoyage
  cleanup: function() {
    console.log('>>> Mot ÉLASTIQUE nettoyé');
  }
};
