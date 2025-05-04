// firebase-init.js
(function() {
  // Tránh khởi tạo nhiều lần
  if (window.DorikFirebase && window.DorikFirebase.firebase) return;
  
  // Tạo namespace nếu chưa có
  window.DorikFirebase = window.DorikFirebase || {};
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAd8r4x0ieTiRmD3LA-qbxGtK536zmIols",
    authDomain: "dorik-product-data.firebaseapp.com", 
    databaseURL: "https://dorik-product-data-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dorik-product-data",
    storageBucket: "dorik-product-data.firebasestorage.app",
    messagingSenderId: "452668101268",
    appId: "1:452668101268:web:4690908e5d1896de38da81"
  };

  // Load Firebase scripts
  function loadFirebaseScripts() {
    return new Promise((resolve, reject) => {
      const script1 = document.createElement('script');
      const script2 = document.createElement('script');
      
      script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
      script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js';
      
      script1.onload = () => {
        document.head.appendChild(script2);
      };
      
      script2.onload = () => {
        try {
          firebase.initializeApp(firebaseConfig);
          window.DorikFirebase.firebase = firebase;
          window.DorikFirebase.database = firebase.database();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      script1.onerror = script2.onerror = reject;
      document.head.appendChild(script1);
    });
  }

  // Initialize Firebase
  loadFirebaseScripts()
    .then(() => {
      console.log('[Firebase] Initialized successfully');
      
      // Dispatch event để các module khác biết Firebase đã sẵn sàng
      const event = new CustomEvent('firebaseReady', { 
        detail: { firebase: window.DorikFirebase.firebase }
      });
      document.dispatchEvent(event);
    })
    .catch(error => {
      console.error('[Firebase] Initialization failed:', error);
    });
})();
