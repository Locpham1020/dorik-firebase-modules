// style-manager.js
(function() {
  // Ensure DorikFirebase namespace exists
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  // Style Manager module
  window.DorikFirebase.styleManager = {
    // CSS styles for Firebase elements
    styles: `
      /* Price styling */
      .firebase-current-price {
        color: #ff424e;
        font-size: 1.5em;
        font-weight: 600;
        margin-right: 8px;
      }
      
      .firebase-current-price .currency {
        font-size: 0.7em;
        vertical-align: baseline;
        text-decoration: underline;
        margin-left: 2px;
      }
      
      /* Original price */
      .firebase-original-price {
        color: #929292;
        font-size: 1em;
        text-decoration: line-through;
        font-weight: 400;
      }
      
      .firebase-original-price .currency {
        font-size: 0.8em;
        vertical-align: baseline;
        text-decoration: underline;
        margin-left: 2px;
      }
      
      /* Rating styling */
      .firebase-rating {
        color: #fdd835;
        font-weight: 500;
        font-size: 1em;
      }
      
      /* Sold styling */
      .firebase-sold {
        color: #9e9e9e;
        font-size: 1em;
      }
      
      .firebase-divider {
        margin: 0 8px;
        color: #e0e0e0;
      }
      
      /* Container groups */
      .firebase-price-group {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
      }
      
      .firebase-rating-sold {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      
      /* Loading state */
      [data-firebase-field]:not([data-updated="true"]) {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        min-height: 24px;
        min-width: 80px;
        display: inline-block;
        position: relative;
        overflow: hidden;
      }
      
      /* Loading animation */
      [data-firebase-field]:not([data-updated="true"])::after {
        content: '';
        position: absolute;
        top: 0;
        left: -150%;
        height: 100%;
        width: 150%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% {
          left: -150%;
        }
        100% {
          left: 150%;
        }
      }
    `,

    // Initialize styles
    init: function() {
      // Check if styles already exist
      if (document.getElementById('dorik-firebase-styles')) {
        return;
      }

      // Create and inject style element
      const styleElement = document.createElement('style');
      styleElement.id = 'dorik-firebase-styles';
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
      
      console.log('[Style Manager] Styles injected');
    },

    // Add custom styles dynamically
    addStyles: function(additionalStyles) {
      const styleElement = document.getElementById('dorik-firebase-styles');
      if (styleElement) {
        styleElement.textContent += '\n' + additionalStyles;
      }
    },

    // Remove styles
    remove: function() {
      const styleElement = document.getElementById('dorik-firebase-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  };

  // Auto-initialize when loaded
  window.DorikFirebase.styleManager.init();
})();
