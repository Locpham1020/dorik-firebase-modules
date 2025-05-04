// style-manager.js
(function() {
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  window.DorikFirebase.styleManager = {
    styles: `
      /* Price styling */
      .current-price {
        color: #ff424e;
        font-size: 1.5em;
        font-weight: 600;
        margin-right: 8px;
      }
      
      .current-price .currency {
        font-size: 0.7em;
        vertical-align: baseline;
        text-decoration: underline;
        margin-left: 2px;
      }
      
      .original-price {
        color: #929292;
        font-size: 1em;
        text-decoration: line-through;
        font-weight: 400;
      }
      
      .original-price .currency {
        font-size: 0.8em;
        vertical-align: baseline;
        text-decoration: underline;
        margin-left: 2px;
      }
      
      .rating {
        color: #fdd835;
        font-weight: 500;
        font-size: 1em;
      }
      
      .sold-count {
        color: #9e9e9e;
        font-size: 1em;
      }
      
      .divider {
        margin: 0 8px;
        color: #e0e0e0;
      }
      
      .price-wrapper {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
      }
      
      .rating-sold-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      
      /* Loading state */
      [data-fields]:not([data-updated="true"]) {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        min-height: 24px;
        min-width: 80px;
        display: inline-block;
        position: relative;
        overflow: hidden;
      }
      
      [data-fields]:not([data-updated="true"])::after {
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

    init: function() {
      if (document.getElementById('dorik-firebase-styles')) {
        return;
      }

      const styleElement = document.createElement('style');
      styleElement.id = 'dorik-firebase-styles';
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
      
      console.log('[Style Manager] Styles injected');
    }
  };

  window.DorikFirebase.styleManager.init();
})();
