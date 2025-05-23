// dom-updater.js
(function() {
  if (!window.DorikFirebase) {
    window.DorikFirebase = {};
  }

  window.DorikFirebase.domUpdater = {
    updateDOM: function(data) {
      if (!data || !data.products) return;
      
      let updatedCount = 0;
      
      // Tìm tất cả containers
      const containers = document.querySelectorAll('[id]');
      
      containers.forEach(container => {
        const containerId = container.id;
        let product = null;
        
        // Kiểm tra xem container có phải là product container không
        if (containerId.startsWith('sp')) {
          // Lấy số từ ID (sp01 -> 1, sp02 -> 2)
          const numericId = containerId.replace('sp0', '').replace('sp', '');
          
          // Tìm product với ID số
          if (data.products[numericId]) {
            product = data.products[numericId];
          }
        }
        
        if (!product) return;
        
        // Tìm các elements với data-firebase-field
        const fieldElements = container.querySelectorAll('[data-firebase-field]');
        
        fieldElements.forEach(el => {
          const fieldAttr = el.getAttribute('data-firebase-field');
          
          // Xử lý nhiều fields (price+original_price)
          if (fieldAttr.includes('+')) {
            const fields = fieldAttr.split('+').map(f => f.trim());
            let content = '';
            
            // Xử lý price+original_price
            if (fields.includes('price') && fields.includes('original_price')) {
              content = '<div class="price-wrapper">';
              if (product.price) {
                content += `<span class="current-price">${product.price}<span class="currency">đ</span></span>`;
              }
              if (product.original_price) {
                content += `<span class="original-price">${product.original_price}<span class="currency">đ</span></span>`;
              }
              content += '</div>';
            }
            // Xử lý rating+sold
            else if (fields.includes('rating') && fields.includes('sold')) {
              content = '<div class="rating-sold-wrapper">';
              if (product.rating) {
                content += `<span class="rating">⭐${product.rating}</span>`;
              }
              if (product.rating && product.sold) {
                content += `<span class="divider">|</span>`;
              }
              if (product.sold) {
                content += `<span class="sold-count">Đã bán ${product.sold}</span>`;
              }
              content += '</div>';
            }
            
            el.innerHTML = content;
          }
          // Xử lý single field
          else {
            const fieldName = fieldAttr;
            
            if (product[fieldName]) {
              switch(fieldName) {
                case 'name':
                  el.textContent = product[fieldName];
                  break;
                  
                case 'price':
                  el.innerHTML = `<span class="current-price">${product[fieldName]}<span class="currency">đ</span></span>`;
                  break;
                  
                case 'original_price':
                  el.innerHTML = `<span class="original-price">${product[fieldName]}<span class="currency">đ</span></span>`;
                  break;
                  
                case 'rating':
                  el.textContent = `⭐${product[fieldName]}`;
                  break;
                  
                case 'sold':
                  el.textContent = `Đã bán ${product[fieldName]}`;
                  break;
                  
                case 'link_shopee':
                case 'link_tiktok':
                  if (el.tagName === 'A' || el.closest('a')) {
                    const linkElement = el.tagName === 'A' ? el : el.closest('a');
                    linkElement.href = product[fieldName];
                    linkElement.setAttribute('target', '_blank');
                    linkElement.setAttribute('rel', 'noopener noreferrer');
                  }
                  break;
                  
                default:
                  el.textContent = product[fieldName];
              }
            }
          }
          
          el.setAttribute('data-updated', 'true');
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
        window.DorikFirebase.currentData = data;
        
        // Update DOM
        const count = window.DorikFirebase.domUpdater.updateDOM(data);
        console.log(`[DOM Updater] Updated ${count} containers`);
        
        // Dispatch event cho các module khác
        const event = new CustomEvent('firebaseDataUpdate', {
          detail: { data: data }
        });
        document.dispatchEvent(event);
      });
    }
  });
})();
