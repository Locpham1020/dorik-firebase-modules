// lazy-loader.js
(function() {
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  window.DorikFirebase.lazyLoader = {
    observer: null,
    loadedContainers: new Set(),
    firebaseData: null,

    init: function() {
      if (!('IntersectionObserver' in window)) {
        console.warn('[Lazy Loader] IntersectionObserver not supported, loading all content');
        this.loadAllContainers();
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadContainer(entry.target);
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });

      this.observeContainers();
      console.log('[Lazy Loader] Initialized');
    },

    observeContainers: function() {
      // Observe containers với ID sp01, sp02, etc
      const containers = document.querySelectorAll('[id^="sp"]');
      
      containers.forEach(container => {
        if (!this.loadedContainers.has(container.id)) {
          this.observer.observe(container);
        }
      });
    },

    loadContainer: function(container) {
      const containerId = container.id;
      
      if (this.loadedContainers.has(containerId)) {
        return;
      }

      this.loadedContainers.add(containerId);
      this.observer.unobserve(container);

      // Lấy numeric ID từ container ID (sp01 -> 1)
      const numericId = containerId.replace('sp0', '').replace('sp', '');
      
      if (this.firebaseData && this.firebaseData.products && this.firebaseData.products[numericId]) {
        const product = this.firebaseData.products[numericId];
        
        // Update container
        if (window.DorikFirebase.domUpdater) {
          window.DorikFirebase.domUpdater.updateDOM({
            products: {
              [numericId]: product
            }
          });
        }
        
        console.log(`[Lazy Loader] Loaded container: ${containerId}`);
      }
    },

    loadAllContainers: function() {
      const containers = document.querySelectorAll('[id^="sp"]');
      containers.forEach(container => {
        this.loadContainer(container);
      });
    },

    setData: function(data) {
      this.firebaseData = data;
      
      // Update already loaded containers
      this.loadedContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
          // Lấy numeric ID từ container ID
          const numericId = containerId.replace('sp0', '').replace('sp', '');
          
          if (data.products && data.products[numericId]) {
            if (window.DorikFirebase.domUpdater) {
              window.DorikFirebase.domUpdater.updateDOM({
                products: {
                  [numericId]: data.products[numericId]
                }
              });
            }
          }
        }
      });
      
      // Observe new containers
      this.observeContainers();
    },

    refresh: function() {
      this.observeContainers();
    }
  };

  // Auto-initialize when Firebase is ready
  document.addEventListener('firebaseReady', function() {
    setTimeout(() => {
      window.DorikFirebase.lazyLoader.init();
    }, 100);
  });

  // Listen for Firebase data updates
  document.addEventListener('firebaseDataUpdate', function(e) {
    if (e.detail && e.detail.data) {
      window.DorikFirebase.lazyLoader.setData(e.detail.data);
    }
  });
})();
