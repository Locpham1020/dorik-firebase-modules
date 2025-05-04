// lazy-loader.js
(function() {
  // Ensure DorikFirebase namespace exists
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  // Lazy Loader module using Intersection Observer
  window.DorikFirebase.lazyLoader = {
    observer: null,
    loadedContainers: new Set(),
    firebaseData: null,

    // Initialize lazy loading
    init: function() {
      // Check if Intersection Observer is supported
      if (!('IntersectionObserver' in window)) {
        console.warn('[Lazy Loader] IntersectionObserver not supported, loading all content');
        this.loadAllContainers();
        return;
      }

      // Create observer with options
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadContainer(entry.target);
          }
        });
      }, {
        rootMargin: '50px', // Load 50px before element comes into view
        threshold: 0.1 // Trigger when 10% of element is visible
      });

      // Start observing containers
      this.observeContainers();

      console.log('[Lazy Loader] Initialized');
    },

    // Observe all Firebase containers
    observeContainers: function() {
      const containers = document.querySelectorAll('[data-firebase-id]');
      containers.forEach(container => {
        if (!this.loadedContainers.has(container.id)) {
          this.observer.observe(container);
        }
      });
    },

    // Load content for a specific container
    loadContainer: function(container) {
      const containerId = container.id;
      
      // Skip if already loaded
      if (this.loadedContainers.has(containerId)) {
        return;
      }

      // Mark as loaded
      this.loadedContainers.add(containerId);
      
      // Stop observing this container
      this.observer.unobserve(container);

      // If we have Firebase data, update the container
      if (this.firebaseData && this.firebaseData.products && this.firebaseData.products[containerId]) {
        const product = this.firebaseData.products[containerId];
        this.updateContainer(container, product);
        console.log(`[Lazy Loader] Loaded container: ${containerId}`);
      }
    },

    // Update container with product data
    updateContainer: function(container, product) {
      // Use the domUpdater if available
      if (window.DorikFirebase.domUpdater) {
        window.DorikFirebase.domUpdater.updateDOM({
          products: {
            [container.id]: product
          }
        });
      }
    },

    // Fallback for browsers without IntersectionObserver
    loadAllContainers: function() {
      const containers = document.querySelectorAll('[data-firebase-id]');
      containers.forEach(container => {
        this.loadContainer(container);
      });
    },

    // Update data from Firebase
    setData: function(data) {
      this.firebaseData = data;
      
      // Update already visible containers
      this.loadedContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container && data.products && data.products[containerId]) {
          this.updateContainer(container, data.products[containerId]);
        }
      });
    },

    // Re-observe new containers (useful for dynamic content)
    refresh: function() {
      this.observeContainers();
    }
  };

  // Auto-initialize when Firebase is ready
  document.addEventListener('firebaseReady', function() {
    // Wait a bit for DOM to be ready
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
