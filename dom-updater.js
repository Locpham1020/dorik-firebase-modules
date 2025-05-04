// dom-updater.js
(function() {
  // Đảm bảo Firebase đã sẵn sàng
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  // DOM Updater module
  window.DorikFirebase.domUpdater = {
    // Update DOM với data từ Firebase
    updateDOM: function(data) {
      if (!data || !data.products) return;
      
      let updatedCount = 0;
      
      Object.keys(data.products).forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        
        const product = data.products[id];
        
        // Xử lý các elements có nhiều fields (dùng dấu +)
        const multiFieldElements = container.querySelectorAll('[data-firebase-field*="+"]');
        multiFieldElements.forEach(el => {
          const fields = el.getAttribute('data-firebase-field').split('+').map(f => f.trim());
          let content = '';
          
          // Xử lý price+original_price
          if (fields.includes('price') && fields.includes('original_price')) {
            content = '<div class="firebase-price-group">';
            if (product.price) {
              content += `<span class="firebase-current-price">${product.price}<span class="currency">đ</span></span>`;
            }
            if (product.original_price) {
              content += `<span class="firebase-original-price">${product.original_price}<span class="currency">đ</span></span>`;
            }
            content += '</div>';
          }
          
          // Xử lý rating+sold
          else if (fields.includes('rating') && fields.includes('sold')) {
            content = '<div class="firebase-rating-sold">';
            if (product.rating) {
              content += `<span class="firebase-rating">⭐${product.rating}</span>`;
            }
            if (product.rating && product.sold) {
              content += `<span class="firebase-divider">|</span>`;
            }
            if (product.sold) {
              content += `<span class="firebase-sold">Đã bán ${product.sold}</span>`;
            }
            content += '</div>';
          }
          
          el.innerHTML = content;
          el.setAttribute('data-updated', 'true');
        });
        
        // Xử lý các fields đơn lẻ
        Object.keys(product).forEach(field => {
          const elements = container.querySelectorAll(`[data-firebase-field="${field}"]:not([data-firebase-field*="+"])`);
          if (elements.length === 0) return;
          
          elements.forEach(el => {
            switch(field) {
              case 'price':
                el.innerHTML = `<span class="firebase-current-price">${product[field]}<span class="currency">đ</span></span>`;
                break;
                
              case 'original_price':
                el.innerHTML = `<span class="firebase-original-price">${product[field]}<span class="currency">đ</span></span>`;
                break;
                
              case 'link_shopee':
              case 'link_tiktok':
                if (el.tagName === 'A') {
                  el.href = product[field];
                  el.setAttribute('target', '_blank');
                  el.setAttribute('rel', 'noopener noreferrer');
                } else {
                  el.onclick = () => window.open(product[field], '_blank');
                  el.style.cursor = 'pointer';
                }
                break;
                
              case 'sold':
                el.textContent = 'Đã bán ' + product[field];
                break;
                
              case 'rating':
                el.textContent = '⭐' + product[field];
                break;
                
              default:
                el.textContent = product[field];
                break;
            }
            
            el.setAttribute('data-updated', 'true');
          });
        });
        
        container.setAttribute('data-updated', 'true');
        updatedCount++;
      });
      
      return updatedCount;
    }
  };

  // Đợi Firebase ready để đăng ký realtime listener
  document.addEventListener('firebaseReady', function() {
    if (window.DorikFirebase.database) {
      window.DorikFirebase.database.ref('/').on('value', (snapshot) => {
        const data = snapshot.val();
        const count = window.DorikFirebase.domUpdater.updateDOM(data);
        console.log(`[DOM Updater] Updated ${count} containers`);
      });
    }
  });
})();
