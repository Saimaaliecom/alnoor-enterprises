(function () {
  'use strict';

  var ADMIN_PHONE = '923138404464';
  var ADMIN_DISPLAY_PHONE = '0313-8404464';

  function initChatbot() {
    if (document.getElementById('alnoor-chat-root')) return;

    // Get catalog products if available on the page
    var catalogProducts = [];
    try {
      var rawCatalog = document.getElementById('catalogData');
      if (rawCatalog) {
        var parsed = JSON.parse(rawCatalog.textContent);
        catalogProducts = parsed.products || [];
      }
    } catch (e) {
      catalogProducts = [];
    }

    var widgetHTML = `
      <div id="alnoor-chat-root">
        <!-- Launcher Button -->
        <div id="anLauncher" class="an-chat-launcher" role="button" tabindex="0" aria-label="Open Al-Noor Wholesale Assistant">
          <div class="an-launcher-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span class="an-online-dot"></span>
          </div>
          <div class="an-launcher-text">
            <span class="an-launcher-title">Al-Noor Wholesale Bot</span>
            <span class="an-launcher-subtitle">Slabs & Inquiries · 24/7 Active</span>
          </div>
        </div>

        <!-- Chat Window -->
        <div id="anChatBox" class="an-chat-box">
          <!-- Header -->
          <div class="an-chat-header">
            <div class="an-header-info">
              <div class="an-header-avatar">AN</div>
              <div class="an-header-meta">
                <h4>Al-Noor Enterprises</h4>
                <div class="an-header-status">
                  <span class="an-status-pulsing"></span>
                  <span>Wholesale Desk (24/7 Online)</span>
                </div>
              </div>
            </div>
            <div class="an-header-actions">
              <button id="anCloseChat" class="an-header-btn" title="Close chat" aria-label="Close chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Chat Messages -->
          <div id="anChatMessages" class="an-chat-messages"></div>

          <!-- Quick Chips -->
          <div class="an-quick-chips">
            <button class="an-chip" data-q="slabs" type="button">📊 Quantity Slabs</button>
            <button class="an-chip" data-q="sample" type="button">🧪 Sample Policy</button>
            <button class="an-chip" data-q="delivery" type="button">🚚 Delivery & Pickup</button>
            <button class="an-chip" data-q="payment" type="button">💳 Payment Methods</button>
            <button class="an-chip" data-q="return" type="button">⚠️ Return Policy</button>
            <button class="an-chip" data-q="admin" type="button">📱 Contact Admin</button>
          </div>

          <!-- Input Bar -->
          <form id="anChatForm" class="an-chat-input-bar">
            <input type="text" id="anChatInput" placeholder="Ask about wholesale slabs, delivery, policy..." autocomplete="off" />
            <button type="submit" class="an-send-btn" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    var launcher = document.getElementById('anLauncher');
    var chatBox = document.getElementById('anChatBox');
    var closeBtn = document.getElementById('anCloseChat');
    var messagesContainer = document.getElementById('anChatMessages');
    var form = document.getElementById('anChatForm');
    var input = document.getElementById('anChatInput');
    var chips = document.querySelectorAll('.an-chip');

    function openChat() {
      chatBox.classList.add('an-active');
      launcher.style.display = 'none';
      input.focus();
      if (messagesContainer.children.length === 0) {
        sendWelcomeMessage();
      }
    }

    function closeChat() {
      chatBox.classList.remove('an-active');
      launcher.style.display = 'flex';
    }

    window.openAlnoorChat = openChat;
    window.closeAlnoorChat = closeChat;

    launcher.addEventListener('click', openChat);
    launcher.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-q');
        handleChipClick(q);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserMessage(text);
    });

    function getTimeString() {
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      var ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
    }

    function appendMessage(textHTML, sender) {
      var msgDiv = document.createElement('div');
      msgDiv.className = 'an-msg an-' + sender;
      msgDiv.innerHTML = `
        <div class="an-bubble">${textHTML}</div>
        <span class="an-msg-time">${getTimeString()}</span>
      `;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function makeWhatsAppLink(customMsg) {
      var enc = encodeURIComponent(customMsg || 'Assalam-o-Alaikum Al-Noor Enterprises, I have an inquiry regarding wholesale quantity slabs and stock.');
      return 'https://wa.me/' + ADMIN_PHONE + '?text=' + enc;
    }

    function sendWelcomeMessage() {
      var welcomeHTML = `
        <strong>Assalam-o-Alaikum! Welcome to Al-Noor Enterprises</strong> 🤝
        <div class="an-highlight-box" style="margin-top:8px;">
          📊 <em>Wholesale prices are strictly based on quantity slabs. The larger the quantity you order, the lower the per-unit price!</em>
        </div>
        <p style="margin:8px 0 0 0;">
          I can guide you regarding our <strong>Quantity Slabs Criteria</strong>, <strong>Sample Policy</strong>, <strong>Delivery & Lahore Pickup</strong>, and <strong>Order Terms</strong>.
        </p>
        <div style="margin-top:8px;">
          💡 <em>Note: Real-time wholesale rates and daily stock confirmations are provided directly by our main admin on WhatsApp.</em>
        </div>
        <a href="${makeWhatsAppLink()}" target="_blank" rel="noopener" class="an-wa-btn">
          <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
          Chat with Main Admin (${ADMIN_DISPLAY_PHONE})
        </a>
      `;
      appendMessage(welcomeHTML, 'bot');
    }

    function handleChipClick(type) {
      switch (type) {
        case 'slabs':
          handleUserMessage('Explain quantity slabs');
          break;
        case 'sample':
          handleUserMessage('Sample policy and availability');
          break;
        case 'delivery':
          handleUserMessage('Delivery charges and pickup in Lahore');
          break;
        case 'payment':
          handleUserMessage('Payment terms for wholesale');
          break;
        case 'return':
          handleUserMessage('What is your refund and return policy?');
          break;
        case 'admin':
          handleUserMessage('Connect to main admin on WhatsApp');
          break;
      }
    }

    function handleUserMessage(query) {
      appendMessage(escapeHTML(query), 'user');

      setTimeout(function () {
        var botResponse = generateKnowledgeResponse(query);
        appendMessage(botResponse, 'bot');
      }, 300);
    }

    function escapeHTML(str) {
      return String(str).replace(/[&<>'"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
      });
    }

    function generateKnowledgeResponse(rawQuery) {
      var q = rawQuery.toLowerCase();

      var matchedProduct = null;
      for (var i = 0; i < catalogProducts.length; i++) {
        var pName = catalogProducts[i].name.toLowerCase();
        if (q.indexOf(pName) > -1 || (pName.length > 5 && q.indexOf(pName.substring(0, 10)) > -1)) {
          matchedProduct = catalogProducts[i];
          break;
        }
      }

      var isPriceQuery = /price|rate|cost|how much|kitne|kitnay|pkr|rs|amount|discount|quote|bhao/.test(q);
      var isSlabQuery = /slab|tier|quantity|moq|wholesale|minimum|order size|packs|pieces|carton|bulk/.test(q);
      var isSampleQuery = /sample|trial|testing|one piece|1 piece|single piece/.test(q);
      var isMixQuery = /mix|combine|different|variety|multi product/.test(q);
      var isDeliveryQuery = /delivery|ship|courier|cargo|builty|lahore|pickup|bykea|indrive|rider|freight|charges|dispatch/.test(q);
      var isPaymentQuery = /payment|pay|advance|cod|cash on delivery|bank|jazzcash|easypaisa|transfer|account/.test(q);
      var isReturnQuery = /return|refund|exchange|damage|broken|fault|claim|wapis|guarantee|warranty|broken|defect/.test(q);
      var isAdminQuery = /admin|whatsapp|number|call|phone|contact|human|support|talk|owner|manager/.test(q);

      if (matchedProduct && isPriceQuery) {
        var waMsg = 'Assalam-o-Alaikum Main Admin, I want to inquire about wholesale quantity slabs and price quote for: ' + matchedProduct.name;
        return `
          <strong>${matchedProduct.name}</strong> (${matchedProduct.category})
          <div class="an-highlight-box">
            📊 <strong>Quantity Slab Pricing:</strong><br>
            Wholesale prices are determined by quantity slabs: <strong>10 pcs (MOQ)</strong>, <strong>20 pcs</strong>, <strong>50 pcs</strong>, and <strong>100+ pcs</strong>.<br>
            <em>The higher the quantity, the lower the unit price!</em>
          </div>
          <p style="margin:8px 0 0 0;">
            To get today's live wholesale price quote and stock confirmation for this item, message our main admin on WhatsApp:
          </p>
          <a href="${makeWhatsAppLink(waMsg)}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Get Slabs Quote on WhatsApp
          </a>
        `;
      }

      if (isPriceQuery && !isDeliveryQuery && !isPaymentQuery) {
        var waMsg = 'Assalam-o-Alaikum Main Admin, I would like to get the wholesale slab price list for products: ' + rawQuery;
        return `
          📊 <strong>Wholesale Pricing Policy:</strong>
          <p style="margin:6px 0;">
            At <strong>Al-Noor Enterprises</strong>, our wholesale prices are determined strictly by the quantity ordered. <strong>The more you order, the lower the price per unit.</strong>
          </p>
          <div class="an-highlight-box">
            📌 <em>Exact rates are provided directly by our Main Admin to give you the most accurate real-time rates based on your order size.</em>
          </div>
          <p style="margin:6px 0;">
            Please contact our main admin on WhatsApp with the product name and desired quantity:
          </p>
          <a href="${makeWhatsAppLink(waMsg)}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Message Main Admin (${ADMIN_DISPLAY_PHONE})
          </a>
        `;
      }

      if (isMixQuery) {
        return `
          📦 <strong>Product Slabs & Mixing Rules:</strong>
          <ul>
            <li>Wholesale quantity slabs apply <strong>strictly to one single product</strong> (minimum 10 pieces of the exact same item).</li>
            <li>Mixing different products to reach a slab (e.g., 5 pcs of Product A + 5 pcs of Product B) is <strong>not permitted</strong>.</li>
          </ul>
          <p style="margin:6px 0;">For custom bulk variety requests, contact our main admin:</p>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, I want to discuss a bulk custom order.')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Contact Main Admin
          </a>
        `;
      }

      if (isSlabQuery) {
        return `
          📊 <strong>Al-Noor Enterprises Wholesale Slabs Criteria:</strong>
          <p style="margin:6px 0;">Our wholesale rates depend directly on your order quantity:</p>
          <ul>
            <li><strong>Sample:</strong> Individual unit testing (sample prices are slightly higher; subject to availability).</li>
            <li><strong>10 pcs:</strong> Standard Minimum Order Quantity (MOQ) for wholesale.</li>
            <li><strong>20 pcs:</strong> Tier 2 discounted rate.</li>
            <li><strong>50 pcs:</strong> Tier 3 discounted rate.</li>
            <li><strong>100+ pcs:</strong> Maximum bulk discount rate.</li>
          </ul>
          <div class="an-highlight-box">
            ⚠️ <strong>Key Rule:</strong> Slabs apply strictly per product (minimum 10 pcs of the exact same product).
          </div>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, please provide the quantity slab rate for [Product Name].')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Inquire Slab Rates on WhatsApp
          </a>
        `;
      }

      if (isSampleQuery) {
        return `
          🧪 <strong>Sample Policy:</strong>
          <ul>
            <li><strong>Availability:</strong> Sometimes samples may not be available in stock. Please confirm current sample stock before ordering.</li>
            <li><strong>Pricing:</strong> Sample prices are slightly higher than wholesale prices, as sample orders are smaller and require individualized packaging and attention.</li>
            <li><strong>Order:</strong> To request a sample of any product, connect directly with our admin:</li>
          </ul>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, is sample available for [Product Name]?')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Check Sample Availability (${ADMIN_DISPLAY_PHONE})
          </a>
        `;
      }

      if (isReturnQuery) {
        return `
          ⚠️ <strong>Important Return & Sale Policy:</strong>
          <div class="an-alert-box">
            <strong>"All sales are final. No refunds or exchanges will be accepted once the product is sold."</strong>
          </div>
          <ul>
            <li><strong>Electronics & Battery Items:</strong> Strictly <strong>NO refund or exchange</strong> under any circumstances.</li>
            <li><strong>Breakage Protection:</strong> Every parcel is packed with extreme care and high-grade materials to prevent any transit damage.</li>
            <li>Any rare transit edge-case is evaluated strictly on a scenario basis by management.</li>
          </ul>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, I have an inquiry regarding my order.')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Message Main Admin
          </a>
        `;
      }

      if (isPaymentQuery) {
        return `
          💳 <strong>Wholesale Payment Terms:</strong>
          <ul>
            <li><strong>100% Advance Payment</strong> is required for wholesale & bulk orders before order dispatch.</li>
            <li><strong>Accepted Methods:</strong> Bank Transfer, JazzCash, EasyPaisa.</li>
            <li>Official account details are shared directly by our main admin on WhatsApp upon order confirmation.</li>
          </ul>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, please provide payment details for my wholesale order.')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Get Account Details on WhatsApp
          </a>
        `;
      }

      if (isDeliveryQuery) {
        return `
          🚚 <strong>Delivery, Shipping & Pickup:</strong>
          <ul>
            <li><strong>Buyer Pays Delivery:</strong> Delivery/freight charges are paid by the customer based on destination and package weight.</li>
            <li><strong>In-Person Pickup (Lahore):</strong> Customers in Lahore can pick up their orders in person with <strong>ZERO / FREE delivery charges</strong>! 📍</li>
            <li><strong>Same City (Lahore Delivery):</strong> A local delivery ride can be booked directly (e.g., Bykea, InDrive, or private rider).</li>
            <li><strong>Other Cities (Nationwide):</strong> Charges are calculated per half-kg weight via reputable courier services or commercial cargo/builty.</li>
          </ul>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum, I want to check delivery charges for [City Name].')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Confirm Delivery / Pickup on WhatsApp
          </a>
        `;
      }

      if (isAdminQuery || /hello|hi|salam|assalam|aao|hey/.test(q)) {
        return `
          🤝 <strong>Al-Noor Enterprises Main Support:</strong>
          <ul>
            <li><strong>Main Admin WhatsApp:</strong> <code>${ADMIN_DISPLAY_PHONE}</code></li>
            <li><strong>Availability:</strong> 24/7 round the clock</li>
            <li><strong>Location:</strong> Lahore, Pakistan 📍</li>
            <li><strong>Wholesale Slabs:</strong> 10 pcs, 20 pcs, 50 pcs, 100+ pcs</li>
          </ul>
          <p style="margin:6px 0;">Click below to chat directly with our main admin:</p>
          <a href="${makeWhatsAppLink('Assalam-o-Alaikum Main Admin, I would like to inquire about products and wholesale orders.')}" target="_blank" rel="noopener" class="an-wa-btn">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Open WhatsApp (${ADMIN_DISPLAY_PHONE})
          </a>
        `;
      }

      var fallbackWaMsg = 'Assalam-o-Alaikum Main Admin, I have a question regarding: ' + rawQuery;
      return `
        At <strong>Al-Noor Enterprises</strong>, our wholesale pricing is determined by order quantity slabs (<strong>Sample</strong>, <strong>10 pcs</strong>, <strong>20 pcs</strong>, <strong>50 pcs</strong>, and <strong>100+ pcs</strong>).
        <div class="an-highlight-box">
          ⚠️ <em>Specific rates are provided exclusively by our main admin on WhatsApp to ensure updated pricing. All sales are final.</em>
        </div>
        <p style="margin:6px 0;">Please connect directly with our main admin on WhatsApp for your query:</p>
        <a href="${makeWhatsAppLink(fallbackWaMsg)}" target="_blank" rel="noopener" class="an-wa-btn">
          <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
          Ask Admin on WhatsApp (${ADMIN_DISPLAY_PHONE})
        </a>
      `;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
