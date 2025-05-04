// main-loader.js
(function() {
  console.log('[Main Loader] Starting...');
  
  // Configuration
  const config = {
    modules: [
      'firebase-init.js',
      'style-manager.js', 
      'dom-updater.js',
      'lazy-loader.js'
    ],
    baseUrl: 'https://cdn.jsdelivr.net/gh/Locpham1020/dorik-firebase-modules@main/',
    debug: true
  };

  // Load modules in sequence
  function loadModules(modules, index = 0) {
    if (index >= modules.length) {
      console.log('[Main Loader] All modules loaded');
      return;
    }

    const moduleName = modules[index];
    const script = document.createElement('script');
    script.src = config.baseUrl + moduleName;
    
    script.onload = function() {
      if (config.debug) {
        console.log(`[Main Loader] Loaded ${moduleName}`);
      }
      loadModules(modules, index + 1);
    };
    
    script.onerror = function(error) {
      console.error(`[Main Loader] Failed to load ${moduleName}`, error);
    };
    
    document.head.appendChild(script);
  }

  // Start loading
  loadModules(config.modules);
})();
