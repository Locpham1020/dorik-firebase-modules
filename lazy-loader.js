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
      // Quan sát tất cả containers có ID phù hợp với Firebase
      const allContainers = document.querySelectorAll('[id]');
      allContainers.forEach(container => {
        // Kiểm tra xem ID có trong Firebase data không
        if (this.firebaseData && this.firebaseData.products && this.firebaseData.products[container.id]) {
          if (!this.loadedContainers.has(container.id)) {
            this.observer.observe(container);
          }
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

      if (this.firebaseData && this.firebaseData.products && this.firebaseData.products[containerId]) {
        const product = this.firebaseData.products[containerId];
        this.updateContainer(container, product);
        console.log(`[Lazy Loader] Loaded container: ${containerId}`);
      }
    },

    updateContainer: function(container, product) {
      if (window.DorikFirebase.domUpdater) {
        window.DorikFirebase.domUpdater.updateDOM({
          products: {
            [container.id]: product
          }
        });
      }
    },

    loadAllContainers: function() {
      if (!this.firebaseData || !this.firebaseData.products) return;
      
      Object.keys(this.firebaseData.products).forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          this.loadContainer(container);
        }
      });
    },

    setData: function(data) {
      this.firebaseData = data;
      
      // Update containers đã load
      this.loadedContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container && data.products && data.products[containerId]) {
          this.updateContainer(container, data.products[containerId]);
        }
      });
      
      // Observe containers mới
      this.observeContainers();
    },

    refresh: function() {
      this.observeContainers();
    }
  };

  document.addEventListener('firebaseReady', function() {
    setTimeout(() => {
      window.DorikFirebase.lazyLoader.init();
    }, 100);
  });

  document.addEventListener('firebaseDataUpdate', function(e) {
    if (e.detail && e.detail.data) {
      window.DorikFirebase.lazyLoader.setData(e.detail.data);
    }
  });
})();
