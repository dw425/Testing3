/**
 * BLUEPRINT MARKETPLACE SHOPPING CART
 * Technology: LocalStorage (Persists until user clears cache/session)
 */

const Cart = {
    key: 'blueprint_cart_v1',
    
    // --- DATA LOGIC ---
    get() {
        const stored = sessionStorage.getItem(this.key);
        return stored ? JSON.parse(stored) : [];
    },

    add(product) {
        // product = { id, title, price, type, billingPeriod }
        const cart = this.get();
        
        // Prevent duplicates for simplicity (optional)
        const exists = cart.find(item => item.id === product.id);
        if (exists) {
            this.open();
            // Optional: Shake animation or alert here
            return;
        }

        cart.push(product);
        sessionStorage.setItem(this.key, JSON.stringify(cart));
        this.render();
        this.open();
    },

    remove(id) {
        const cart = this.get();
        const updated = cart.filter(item => item.id !== id);
        sessionStorage.setItem(this.key, JSON.stringify(updated));
        this.render();
    },

    clear() {
        sessionStorage.removeItem(this.key);
        this.render();
    },

    // --- UI LOGIC ---
    init() {
        // Inject HTML if it doesn't exist
        if (!document.getElementById('cart-drawer')) {
            const html = `
                <div id="cart-backdrop" onclick="Cart.close()"></div>
                <div id="cart-drawer">
                    <div class="cart-header">
                        <h2>Your Quote</h2>
                        <button onclick="Cart.close()" class="text-gray-400 hover:text-black text-3xl">&times;</button>
                    </div>
                    <div id="cart-items-container">
                        </div>
                    <div class="cart-footer">
                        <div id="cart-totals-area"></div>
                        <button onclick="Cart.checkout()" class="checkout-btn">Request Quote / PO</button>
                    </div>
                </div>
                <div id="floating-cart-btn" onclick="Cart.open()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span id="cart-count-badge" class="hidden">0</span>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        }
        this.render();
    },

    open() {
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-backdrop').classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('cart-drawer').classList.remove('open');
        document.getElementById('cart-backdrop').classList.remove('open');
        document.body.style.overflow = '';
    },

    render() {
        const cart = this.get();
        const container = document.getElementById('cart-items-container');
        const badge = document.getElementById('cart-count-badge');
        const totalsArea = document.getElementById('cart-totals-area');
        
        // 1. Badge
        if (cart.length > 0) {
            badge.innerText = cart.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }

        // 2. Items
        container.innerHTML = '';
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-state">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p class="font-bold text-gray-900">Your quote is empty.</p>
                    <p class="text-xs mt-1">Browse solutions to add items.</p>
                </div>`;
            totalsArea.innerHTML = '';
        } else {
            let monthlyTotal = 0;
            let oneTimeTotal = 0;
            let hasCustom = false;

            cart.forEach(item => {
                // Price calculation logic
                let priceDisplay = '';
                if (item.price === 'Custom') {
                    hasCustom = true;
                    priceDisplay = 'Custom';
                } else {
                    const p = parseFloat(item.price);
                    if (item.billingPeriod === 'monthly') {
                        monthlyTotal += p;
                        priceDisplay = `$${p.toLocaleString()} / mo`;
                    } else {
                        oneTimeTotal += p;
                        priceDisplay = `$${p.toLocaleString()}`;
                    }
                }

                // Create Item HTML
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-top">
                        <div class="cart-item-title">${item.title}</div>
                        <button class="remove-btn" onclick="Cart.remove('${item.id}')">&times;</button>
                    </div>
                    <div class="cart-item-price">${priceDisplay}</div>
                    <div class="cart-item-meta">${item.type}</div>
                `;
                container.appendChild(div);
            });

            // 3. Totals
            let totalsHtml = '';
            if (monthlyTotal > 0) {
                totalsHtml += `
                    <div class="cart-total-row">
                        <span>Monthly Recurring:</span>
                        <span class="font-bold text-gray-900">$${monthlyTotal.toLocaleString()}</span>
                    </div>`;
            }
            if (oneTimeTotal > 0) {
                totalsHtml += `
                    <div class="cart-total-row">
                        <span>One-Time Implementation:</span>
                        <span class="font-bold text-gray-900">$${oneTimeTotal.toLocaleString()}</span>
                    </div>`;
            }
            
            // Grand Total Logic
            let grandTotalText = '$' + (monthlyTotal + oneTimeTotal).toLocaleString();
            if (hasCustom) grandTotalText += ' + Custom';
            
            totalsHtml += `
                <div class="cart-final-total">
                    <span>Est. Total:</span>
                    <span>${grandTotalText}</span>
                </div>
            `;
            totalsArea.innerHTML = totalsHtml;
        }
    },

    checkout() {
        const cart = this.get();
        if (cart.length === 0) {
            alert("Please add items to your cart first.");
            return;
        }
        // Redirect logic or Open Modal Logic will go here in Phase 3
        // For now, we alert to confirm connection
        alert("Phase 1 Complete: Cart is working! Ready to connect to Checkout Modal.");
    }
};

// Auto-load on page ready
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
