
const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Pulpen Gel Hitam', category: 'Alat Tulis', price: 3500, stock: 50, image: 'images/pulpen_gel.jpg', discount: 0, discountType: 'none', sold: 120, rating: 4.5 },
    { id: 2, name: 'Buku Tulis 100 Lembar', category: 'Kertas', price: 12000, stock: 30, image: 'images/buku_tulis.jpg', discount: 0, discountType: 'none', sold: 85, rating: 4.7 },
    { id: 3, name: 'Stabilo Warna 6 Pcs', category: 'Alat Tulis', price: 28000, stock: 20, image: 'images/stabilo.jpg', discount: 20, discountType: 'student', sold: 45, rating: 4.8 },
    { id: 4, name: 'Pensil Mekanik 0.5', category: 'Alat Tulis', price: 8500, stock: 40, image: 'images/pensil_mekanik.jpg', discount: 0, discountType: 'none', sold: 200, rating: 4.3 },
    { id: 5, name: 'Penghapus Pencil', category: 'Alat Tulis', price: 2000, stock: 100, image: 'images/penghapus.jpg', discount: 0, discountType: 'none', sold: 320, rating: 4.6 },
    { id: 6, name: 'Kertas HVS A4 70gr', category: 'Kertas', price: 45000, stock: 15, image: 'images/kertas_hvs.jpg', discount: 10, discountType: 'student', sold: 30, rating: 4.4 },
    { id: 7, name: 'Spidol Whiteboard', category: 'Alat Tulis', price: 15000, stock: 25, image: 'images/spidol.jpg', discount: 0, discountType: 'none', sold: 60, rating: 4.2 },
    { id: 8, name: 'Binder Clip Besar', category: 'Perlengkapan', price: 8000, stock: 60, image: 'images/binder_clip.jpg', discount: 0, discountType: 'none', sold: 150, rating: 4.1 },
    { id: 9, name: 'Isolasi Bening', category: 'Perlengkapan', price: 5000, stock: 45, image: 'images/isolasi.jpg', discount: 0, discountType: 'none', sold: 210, rating: 4.0 },
    { id: 10, name: 'Gunting Kertas', category: 'Perlengkapan', price: 12000, stock: 18, image: 'images/gunting.jpg', discount: 0, discountType: 'none', sold: 75, rating: 4.3 },
    { id: 11, name: 'Krayon 12 Warna', category: 'Seni', price: 22000, stock: 12, image: 'images/krayon.jpg', discount: 0, discountType: 'none', sold: 40, rating: 4.9 },
    { id: 12, name: 'Cat Air 24 Warna', category: 'Seni', price: 45000, stock: 8, image: 'images/cat_air.jpg', discount: 30, discountType: 'flash', sold: 25, rating: 4.7 },
    { id: 13, name: 'Buku Gambar A3', category: 'Kertas', price: 18000, stock: 10, image: 'images/buku_gambar.jpg', discount: 15, discountType: 'student', sold: 35, rating: 4.5 },
    { id: 14, name: 'Pensil Warna 24 Pcs', category: 'Seni', price: 35000, stock: 15, image: 'images/pensil_warna.jpg', discount: 25, discountType: 'flash', sold: 20, rating: 4.8 },
    { id: 15, name: 'Rautan Pensil', category: 'Alat Tulis', price: 6000, stock: 70, image: 'images/rautan.jpg', discount: 0, discountType: 'none', sold: 280, rating: 4.2 }
];

// ============================================================
// STATE
// ============================================================
let products = [];
let cart = [];
let currentPage = 'home';
let isAdmin = false;
let flashSaleInterval = null;
let currentProductId = null;
let currentUser = null;
let users = [];
let orders = [];
let reviews = [];
let currentReviewProductId = null;
let checkoutData = null;

// ============================================================
// INIT
// ============================================================
function init() {
    // Load produk
    const stored = localStorage.getItem('novationery_products');
    if (stored) {
        try { products = JSON.parse(stored); } catch { products = [...DEFAULT_PRODUCTS]; }
    } else {
        products = [...DEFAULT_PRODUCTS];
        localStorage.setItem('novationery_products', JSON.stringify(products));
    }
    // Load cart
    const cartStored = localStorage.getItem('novationery_cart');
    if (cartStored) {
        try { cart = JSON.parse(cartStored); } catch { cart = []; }
    }
    // Load user data
    initUserData();
    // Admin session
    isAdmin = sessionStorage.getItem('novationery_admin') === 'true';
    // Mulai flash sale rotasi
    startFlashSaleRotation();
    renderAll();
    attachEvents();
    // Navigasi awal
    navigate('home');
}

// ============================================================
// USER DATA INIT
// ============================================================
function initUserData() {
    const storedUsers = localStorage.getItem('novationery_users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
    const storedOrders = localStorage.getItem('novationery_orders');
    orders = storedOrders ? JSON.parse(storedOrders) : [];
    const storedReviews = localStorage.getItem('novationery_reviews');
    reviews = storedReviews ? JSON.parse(storedReviews) : [];
    const sessionUser = sessionStorage.getItem('novationery_user');
    if (sessionUser) {
        try { currentUser = JSON.parse(sessionUser); } catch { currentUser = null; }
    }
}

// ============================================================
// FLASH SALE ROTASI
// ============================================================
function startFlashSaleRotation() {
    rotateFlashSale();
    flashSaleInterval = setInterval(rotateFlashSale, 30000); // 30 detik demo
}

function rotateFlashSale() {
    products.forEach(p => {
        if (p.discountType === 'flash') {
            p.discountType = 'none';
            p.discount = 0;
        }
    });
    const available = products.filter(p => p.discountType !== 'student');
    const shuffled = available.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    selected.forEach(p => {
        p.discountType = 'flash';
        p.discount = Math.floor(Math.random() * 21) + 20;
    });
    localStorage.setItem('novationery_products', JSON.stringify(products));
    renderAll();
}

// ============================================================
// RENDER (semua)
// ============================================================
function renderAll() {
    renderHomeProducts();
    renderCatalogProducts();
    renderCategoryPills();
    renderCart();
    renderAdminTable();
    renderCheckoutSummary();
    if (currentUser) renderUserProfile();
    updateBadges();
    updateCheckoutBar();
}

// --- Helper ---
function getDiscountedPrice(product) {
    if (product.discount && product.discount > 0) {
        return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
}

function productCardHTML(p, clickable = true) {
    const inCart = cart.find(item => item.id === p.id);
    const qty = inCart ? inCart.qty : 0;
    const disabled = p.stock <= 0 ? 'disabled' : '';
    const discPrice = getDiscountedPrice(p);
    const hasDisc = p.discount && p.discount > 0;
    let discLabel = '';
    if (hasDisc) {
        if (p.discountType === 'student') discLabel = '🎓 Diskon';
        else if (p.discountType === 'flash') discLabel = '⚡ Flash';
        else discLabel = `${p.discount}%`;
    }
    const rating = p.rating || 0;
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '⭐';
    if (rating - fullStars >= 0.5) stars += '☆';
    if (stars === '') stars = '☆☆☆☆☆';

    return `
        <div class="product-card" data-id="${p.id}" style="${clickable ? 'cursor:pointer;' : ''}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${p.id}/300/300'" />
            <div class="product-info">
                <div class="product-name">${p.name} ${hasDisc ? `<span class="product-discount-badge">${discLabel}</span>` : ''}</div>
                <div class="product-category">${p.category}</div>
                <div class="product-price">
                    ${hasDisc ? `<span class="original-price">Rp ${p.price.toLocaleString()}</span>` : ''}
                    Rp ${discPrice.toLocaleString()}
                </div>
                <div class="product-stock">Stok: ${p.stock}</div>
                <div class="product-rating">${stars} ${rating.toFixed(1)}</div>
                <div class="product-sold">Terjual: ${p.sold || 0}</div>
            </div>
            <button class="btn-add-cart" data-id="${p.id}" ${disabled}>
                ${p.stock > 0 ? (qty > 0 ? `+ ${qty} di keranjang` : 'Tambah') : 'Habis'}
            </button>
        </div>
    `;
}

// --- Home ---
function renderHomeProducts() {
    const grid = document.getElementById('home-product-grid');
    const flash = products.filter(p => p.discountType === 'flash' && p.discount > 0).slice(0, 6);
    grid.innerHTML = flash.length ? flash.map(p => productCardHTML(p, true)).join('') :
        '<p style="grid-column:1/-1;text-align:center;color:#6c757d;">Tidak ada produk flash sale saat ini.</p>';
}

// --- Catalog dengan filter & sort ---
function renderCatalogProducts(filter = 'all', search = '') {
    const grid = document.getElementById('catalog-product-grid');
    let filtered = [...products];
    // Filter kategori
    if (filter === 'diskon') {
        filtered = filtered.filter(p => p.discount > 0);
    } else if (filter === 'flash') {
        filtered = filtered.filter(p => p.discountType === 'flash' && p.discount > 0);
    } else if (filter && filter !== 'all') {
        filtered = filtered.filter(p => p.category === filter);
    }
    // Search
    const searchVal = (search || document.getElementById('search-input').value).toLowerCase().trim();
    if (searchVal) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal) || p.category.toLowerCase().includes(searchVal));
    }
    // Filter harga & rating (dari panel)
    const minPrice = parseInt(document.getElementById('price-min')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max')?.value) || 1000000;
    const minRating = parseInt(document.getElementById('rating-filter')?.value) || 0;
    filtered = filtered.filter(p => {
        const price = getDiscountedPrice(p);
        return price >= minPrice && price <= maxPrice && (p.rating || 0) >= minRating;
    });
    // Sort
    const sortBy = document.getElementById('sort-filter')?.value || 'default';
    if (sortBy === 'price-asc') filtered.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    else if (sortBy === 'price-desc') filtered.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    else if (sortBy === 'sold-desc') filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    else if (sortBy === 'rating-desc') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    grid.innerHTML = filtered.length ? filtered.map(p => productCardHTML(p, true)).join('') :
        '<p style="grid-column:1/-1;text-align:center;color:#6c757d;">Tidak ada produk yang cocok.</p>';
}

function renderCategoryPills() {
    const container = document.getElementById('category-pills');
    const cats = ['all', ...new Set(products.map(p => p.category))];
    let html = cats.map(c => {
        const label = c === 'all' ? 'Semua' : c;
        return `<button class="category-pill ${c === 'all' ? 'active' : ''}" data-cat="${c}">${label}</button>`;
    }).join('');
    html += `<button class="category-pill" data-cat="diskon">🎓 Diskon</button>`;
    html += `<button class="category-pill" data-cat="flash">⚡ Flash</button>`;
    container.innerHTML = html;
    container.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', function() {
            container.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCatalogProducts(this.dataset.cat);
        });
    });
}

// --- Cart ---
function renderCart() {
    const list = document.getElementById('cart-list');
    const empty = document.getElementById('cart-empty');
    const countLabel = document.getElementById('cart-count-label');
    if (cart.length === 0) {
        list.innerHTML = '';
        empty.classList.add('visible');
        countLabel.textContent = '0 item';
        return;
    }
    empty.classList.remove('visible');
    countLabel.textContent = `${cart.reduce((acc, i) => acc + i.qty, 0)} item`;
    let html = '';
    cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return;
        const discPrice = getDiscountedPrice(p);
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://picsum.photos/seed/${p.id}/300/300'" />
                <div class="cart-item-details">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">Rp ${discPrice.toLocaleString()}</div>
                    <div class="cart-item-qty">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        `;
    });
    list.innerHTML = html;
    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.id);
        return sum + (p ? getDiscountedPrice(p) * item.qty : 0);
    }, 0);
    document.getElementById('cart-total-amount').textContent = `Rp ${total.toLocaleString()}`;
}

function updateBadges() {
    const total = cart.reduce((acc, i) => acc + i.qty, 0);
    document.getElementById('desktop-cart-badge').textContent = total;
    document.getElementById('bottom-cart-badge').textContent = total;
    const style = total === 0 ? 'none' : 'flex';
    document.getElementById('bottom-cart-badge').style.display = style;
    document.getElementById('desktop-cart-badge').style.display = total === 0 ? 'none' : 'inline-block';
}

function updateCheckoutBar() {
    document.getElementById('checkout-bar').classList.toggle('visible', cart.length > 0);
}

// --- Admin ---
function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;
    tbody.innerHTML = products.map((p, index) => `
        <tr>
            <td>${index+1}</td>
            <td><img src="${p.image}" alt="${p.name}" onerror="this.src='https://picsum.photos/seed/${p.id}/50/50'" /></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>Rp ${p.price.toLocaleString()}</td>
            <td>${p.discount}% (${p.discountType})</td>
            <td>${p.stock}</td>
            <td>${p.sold || 0}</td>
            <td>${p.rating || 0}</td>
            <td>
                <button class="btn-edit" data-id="${p.id}">✏️</button>
                <button class="btn-delete" data-id="${p.id}">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// --- Checkout summary ---
function renderCheckoutSummary() {
    if (!checkoutData) return;
    const container = document.getElementById('checkout-items');
    container.innerHTML = checkoutData.items.map(item => {
        const p = products.find(pr => pr.id === item.id);
        return `<div class="cart-item">${p.name} x${item.qty} - Rp ${(getDiscountedPrice(p) * item.qty).toLocaleString()}</div>`;
    }).join('');
    document.getElementById('checkout-subtotal').textContent = `Rp ${checkoutData.subtotal.toLocaleString()}`;
    updateShippingCost();
}

function updateShippingCost() {
    const selected = document.querySelector('input[name="shipping"]:checked');
    if (!selected) return;
    const cost = selected.value === 'jne' ? 10000 : selected.value === 'sicepat' ? 8000 : 15000;
    document.getElementById('checkout-shipping').textContent = `Rp ${cost.toLocaleString()}`;
    const subtotal = checkoutData ? checkoutData.subtotal : 0;
    const ktmDiscount = document.querySelector('input[name="discount-option"]:checked')?.value === 'ktm' ? Math.round(subtotal * 0.1) : 0;
    document.getElementById('checkout-discount').textContent = `Rp ${ktmDiscount.toLocaleString()}`;
    const total = subtotal + cost - ktmDiscount;
    document.getElementById('checkout-final').textContent = `Rp ${total.toLocaleString()}`;
    checkoutData.total = total;
    checkoutData.shippingCost = cost;
}

// --- User Profile ---
function renderUserProfile() {
    if (!currentUser) return;
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    // Alamat
    const addrList = document.getElementById('profile-address-list');
    const addresses = currentUser.addresses || [];
    addrList.innerHTML = addresses.map((addr, i) => `
        <div class="address-item">
            <span>${addr}</span>
            <button class="btn-delete" onclick="removeAddress(${i})">Hapus</button>
        </div>
    `).join('');
    // Riwayat pesanan
    const userOrders = orders.filter(o => o.userEmail === currentUser.email);
    const orderList = document.getElementById('profile-orders-list');
    if (userOrders.length === 0) {
        orderList.innerHTML = '<p style="color:#6c757d;">Belum ada pesanan.</p>';
        return;
    }
    orderList.innerHTML = userOrders.map((o, idx) => `
        <div class="order-item">
            <div class="order-header">
                <span><strong>#${o.id}</strong> - ${new Date(o.date).toLocaleDateString()}</span>
                <span class="order-status ${o.status}">${o.status === 'packed' ? 'Dikemas' : o.status === 'shipped' ? 'Dikirim' : 'Selesai'}</span>
            </div>
            <div class="order-detail">${o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</div>
            <div class="order-detail">Total: Rp ${o.total.toLocaleString()}</div>
            ${o.status === 'done' ? `<button class="btn-review-order" data-order-idx="${idx}" onclick="openReviewModalFromOrder(${idx})">Beri Ulasan</button>` : ''}
        </div>
    `).join('');
}

// ============================================================
// NAVIGATION
// ============================================================
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
    });
    // Admin special
    if (page === 'admin') {
        if (isAdmin) {
            document.getElementById('page-admin-login').classList.remove('active');
            document.getElementById('page-admin-dashboard').classList.add('active');
        } else {
            document.getElementById('page-admin-login').classList.add('active');
            document.getElementById('page-admin-dashboard').classList.remove('active');
        }
    }
    // User profile special
    if (page === 'profile') {
        if (currentUser) {
            renderUserProfile();
            document.getElementById('page-user-profile').classList.add('active');
            document.getElementById('page-user-login').classList.remove('active');
            document.getElementById('page-user-register').classList.remove('active');
        } else {
            document.getElementById('page-user-login').classList.add('active');
            document.getElementById('page-user-profile').classList.remove('active');
        }
    }
    if (page === 'user-login') {
        document.getElementById('page-user-login').classList.add('active');
        document.getElementById('page-user-profile').classList.remove('active');
        document.getElementById('page-user-register').classList.remove('active');
    }
    if (page === 'user-register') {
        document.getElementById('page-user-register').classList.add('active');
        document.getElementById('page-user-login').classList.remove('active');
        document.getElementById('page-user-profile').classList.remove('active');
    }
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// NAVIGASI KE DETAIL PRODUK
// ============================================================
function navigateToProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    currentProductId = productId;
    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-image').alt = product.name;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-category').textContent = product.category;
    const discPrice = getDiscountedPrice(product);
    const hasDisc = product.discount > 0;
    document.getElementById('detail-price').innerHTML = hasDisc ?
        `<span class="original-price">Rp ${product.price.toLocaleString()}</span> Rp ${discPrice.toLocaleString()}` :
        `Rp ${discPrice.toLocaleString()}`;
    document.getElementById('detail-stock').textContent = `Stok: ${product.stock}`;
    document.getElementById('detail-sold').textContent = `Terjual: ${product.sold || 0}`;
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '⭐';
    if (rating - fullStars >= 0.5) stars += '☆';
    if (stars === '') stars = '☆☆☆☆☆';
    document.getElementById('detail-rating').textContent = `${stars} ${rating.toFixed(1)}`;
    document.getElementById('btn-add-cart-detail').dataset.id = product.id;
    renderReviews(product.id);
    navigate('product-detail');
}

// ============================================================
// ULASAN
// ============================================================
function renderReviews(productId) {
    const productReviews = reviews.filter(r => r.productId === productId);
    const list = document.getElementById('review-list');
    const empty = document.getElementById('review-empty');
    if (productReviews.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    list.innerHTML = productReviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-user">${r.userName}</span>
                <span class="review-rating">${'⭐'.repeat(r.rating)}</span>
                <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
            </div>
            <div class="review-text">${r.comment}</div>
            ${r.image ? `<img src="${r.image}" class="review-image" />` : ''}
        </div>
    `).join('');
}

function submitReview(productId, rating, comment, image) {
    if (!currentUser) {
        alert('Anda harus login untuk memberi ulasan.');
        return false;
    }
    const review = {
        id: Date.now(),
        productId,
        userId: currentUser.email,
        userName: currentUser.name,
        rating: parseInt(rating),
        comment: comment.trim(),
        image: image.trim() || null,
        date: new Date().toISOString()
    };
    reviews.push(review);
    localStorage.setItem('novationery_reviews', JSON.stringify(reviews));
    updateProductRating(productId);
    return true;
}

function updateProductRating(productId) {
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) return;
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const p = products.find(pr => pr.id === productId);
    if (p) {
        p.rating = Math.round(avg * 10) / 10;
        localStorage.setItem('novationery_products', JSON.stringify(products));
    }
}

// ============================================================
// USER FUNCTIONS
// ============================================================
function registerUser(name, email, password) {
    if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return false;
    }
    users.push({ name, email, password, addresses: [] });
    localStorage.setItem('novationery_users', JSON.stringify(users));
    return true;
}

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return false;
    currentUser = { name: user.name, email: user.email, addresses: user.addresses || [] };
    sessionStorage.setItem('novationery_user', JSON.stringify(currentUser));
    return true;
}

function logoutUser() {
    currentUser = null;
    sessionStorage.removeItem('novationery_user');
}

function addAddress(address) {
    if (!currentUser) return;
    const user = users.find(u => u.email === currentUser.email);
    if (user) {
        if (!user.addresses) user.addresses = [];
        user.addresses.push(address);
        localStorage.setItem('novationery_users', JSON.stringify(users));
        currentUser.addresses = user.addresses;
        sessionStorage.setItem('novationery_user', JSON.stringify(currentUser));
    }
}

function removeAddress(index) {
    if (!currentUser) return;
    const user = users.find(u => u.email === currentUser.email);
    if (user && user.addresses) {
        user.addresses.splice(index, 1);
        localStorage.setItem('novationery_users', JSON.stringify(users));
        currentUser.addresses = user.addresses;
        sessionStorage.setItem('novationery_user', JSON.stringify(currentUser));
        renderUserProfile();
    }
}

function openReviewModalFromOrder(orderIdx) {
    const order = orders.filter(o => o.userEmail === currentUser.email)[orderIdx];
    if (!order) return;
    // Ambil produk pertama dari pesanan (atau bisa pilih)
    const firstItem = order.items[0];
    const product = products.find(p => p.id === firstItem.id);
    if (product) {
        currentReviewProductId = product.id;
        document.getElementById('review-modal').classList.add('open');
    }
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function addToCart(id) {
    const p = products.find(pr => pr.id === id);
    if (!p || p.stock <= 0) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.qty < p.stock) existing.qty++;
        else { alert('Stok tidak mencukupi!'); return; }
    } else {
        cart.push({ id, qty: 1 });
    }
    localStorage.setItem('novationery_cart', JSON.stringify(cart));
    renderAll();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    const newQty = item.qty + delta;
    if (newQty < 1) { removeFromCart(id); return; }
    if (newQty > p.stock) { alert('Stok tidak mencukupi!'); return; }
    item.qty = newQty;
    localStorage.setItem('novationery_cart', JSON.stringify(cart));
    renderAll();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('novationery_cart', JSON.stringify(cart));
    renderAll();
}

// ============================================================
// ADMIN CRUD
// ============================================================
function editProduct(id) {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    const newName = prompt('Nama produk:', p.name);
    if (newName === null) return;
    const newCat = prompt('Kategori:', p.category);
    if (newCat === null) return;
    const newPrice = prompt('Harga:', p.price);
    if (newPrice === null) return;
    const newStock = prompt('Stok:', p.stock);
    if (newStock === null) return;
    const newDisc = prompt('Diskon % (0-100):', p.discount);
    if (newDisc === null) return;
    const newDiscType = prompt('Tipe diskon (none/student/flash):', p.discountType);
    if (newDiscType === null) return;
    const newImage = prompt('URL gambar:', p.image);
    if (newImage === null) return;
    p.name = newName.trim() || p.name;
    p.category = newCat.trim() || p.category;
    p.price = parseInt(newPrice) || p.price;
    p.stock = parseInt(newStock) || p.stock;
    p.discount = parseInt(newDisc) || 0;
    p.discountType = newDiscType.trim() || 'none';
    p.image = newImage.trim() || p.image;
    localStorage.setItem('novationery_products', JSON.stringify(products));
    renderAll();
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('novationery_products', JSON.stringify(products));
    localStorage.setItem('novationery_cart', JSON.stringify(cart));
    renderAll();
}

// ============================================================
// EVENTS
// ============================================================
function attachEvents() {
    // --- Navigasi ---
    document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page === 'admin') {
                if (isAdmin) navigate('admin-dashboard');
                else navigate('admin-login');
                return;
            }
            if (page === 'profile') {
                if (currentUser) navigate('profile');
                else navigate('user-login');
                return;
            }
            navigate(page);
        });
    });

    // --- Search ---
    document.getElementById('search-btn').addEventListener('click', () => {
        if (currentPage !== 'catalog') navigate('catalog');
        else renderCatalogProducts('all');
    });
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            if (currentPage !== 'catalog') navigate('catalog');
            else renderCatalogProducts('all');
        }
    });

    // --- Filter toggle ---
    document.getElementById('filter-toggle').addEventListener('click', function() {
        const panel = document.getElementById('filter-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('apply-filter').addEventListener('click', function() {
        renderCatalogProducts(
            document.querySelector('.category-pill.active')?.dataset.cat || 'all'
        );
    });

    // --- Discount badge home ---
    document.getElementById('discount-badge-home').addEventListener('click', function() {
        navigate('catalog');
        setTimeout(() => {
            renderCatalogProducts('diskon');
            document.querySelectorAll('.category-pill').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === 'diskon');
            });
        }, 100);
    });

    // --- Flash sale link ---
    document.getElementById('flash-sale-link').addEventListener('click', function(e) {
        e.preventDefault();
        navigate('catalog');
        setTimeout(() => {
            renderCatalogProducts('flash');
            document.querySelectorAll('.category-pill').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === 'flash');
            });
        }, 100);
    });

    // --- Cart actions (delegasi) ---
    document.addEventListener('click', function(e) {
        // Tombol tambah ke keranjang di grid
        const btn = e.target.closest('.btn-add-cart');
        if (btn) {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        }
        // Qty di cart
        if (e.target.classList.contains('qty-plus')) {
            changeQty(parseInt(e.target.dataset.id), 1);
        }
        if (e.target.classList.contains('qty-minus')) {
            changeQty(parseInt(e.target.dataset.id), -1);
        }
        if (e.target.classList.contains('cart-item-remove')) {
            removeFromCart(parseInt(e.target.dataset.id));
        }
        // Admin edit/delete
        if (e.target.classList.contains('btn-edit')) {
            editProduct(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('btn-delete')) {
            if (confirm('Hapus produk ini?')) deleteProduct(parseInt(e.target.dataset.id));
        }
        // Klik pada kartu produk (navigasi ke detail)
        const card = e.target.closest('.product-card');
        if (card && !e.target.closest('.btn-add-cart')) {
            const id = parseInt(card.dataset.id);
            navigateToProductDetail(id);
        }
    });

    // --- Admin login ---
    document.getElementById('admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        if (user === 'admin' && pass === 'admin123') {
            isAdmin = true;
            sessionStorage.setItem('novationery_admin', 'true');
            navigate('admin-dashboard');
            renderAll();
        } else {
            alert('Username atau password salah!');
        }
    });

    document.getElementById('btn-logout').addEventListener('click', function() {
        isAdmin = false;
        sessionStorage.removeItem('novationery_admin');
        navigate('admin-login');
        renderAll();
    });

    // --- User Register ---
    document.getElementById('user-register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('user-register-name').value.trim();
        const email = document.getElementById('user-register-email').value.trim();
        const password = document.getElementById('user-register-password').value;
        if (registerUser(name, email, password)) {
            alert('Pendaftaran berhasil! Silakan masuk.');
            navigate('user-login');
        }
    });

    // --- User Login ---
    document.getElementById('user-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('user-login-email').value.trim();
        const password = document.getElementById('user-login-password').value;
        if (loginUser(email, password)) {
            alert('Selamat datang, ' + currentUser.name + '!');
            navigate('profile');
            renderAll();
        } else {
            alert('Email atau password salah!');
        }
    });

    document.getElementById('goto-register').addEventListener('click', function(e) {
        e.preventDefault();
        navigate('user-register');
    });
    document.getElementById('goto-login').addEventListener('click', function(e) {
        e.preventDefault();
        navigate('user-login');
    });

    // --- User Logout ---
    document.getElementById('user-logout').addEventListener('click', function() {
        logoutUser();
        navigate('home');
        renderAll();
    });

    // --- Tambah alamat ---
    document.getElementById('btn-add-address').addEventListener('click', function() {
        const addr = prompt('Masukkan alamat lengkap:');
        if (addr) {
            addAddress(addr);
            renderUserProfile();
        }
    });

    // --- Checkout form ---
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!currentUser) {
            alert('Silakan login terlebih dahulu.');
            return;
        }
        // Simpan alamat ke profil
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const address = document.getElementById('checkout-address').value.trim();
        const city = document.getElementById('checkout-city').value.trim();
        const postal = document.getElementById('checkout-postal').value.trim();
        const fullAddress = `${name}, ${phone}, ${address}, ${city}, ${postal}`;
        addAddress(fullAddress);
        // Tampilkan modal pembayaran
        document.getElementById('payment-modal').classList.add('open');
    });

    // --- Shipping cost update ---
    document.querySelectorAll('input[name="shipping"]').forEach(el => {
        el.addEventListener('change', updateShippingCost);
    });

    // --- Payment modal ---
    document.getElementById('payment-modal-close').addEventListener('click', function() {
        document.getElementById('payment-modal').classList.remove('open');
    });

    document.getElementById('btn-pay-now').addEventListener('click', function() {
        document.getElementById('payment-modal').classList.remove('open');
        document.getElementById('loading-modal').classList.add('open');

        const ktmSelected = document.querySelector('input[name="discount-option"]:checked').value === 'ktm';
        let total = checkoutData ? checkoutData.total : cart.reduce((sum, item) => {
            const p = products.find(pr => pr.id === item.id);
            return sum + (p ? getDiscountedPrice(p) * item.qty : 0);
        }, 0);
        // Jika dari cart langsung (tanpa checkout), hitung ulang
        if (!checkoutData) {
            const subtotal = cart.reduce((sum, item) => {
                const p = products.find(pr => pr.id === item.id);
                return sum + (p ? getDiscountedPrice(p) * item.qty : 0);
            }, 0);
            total = ktmSelected ? Math.round(subtotal * 0.9) : subtotal;
        } else {
            if (ktmSelected) {
                total = Math.round(total * 0.9);
            }
        }

        setTimeout(() => {
            document.getElementById('loading-modal').classList.remove('open');
            const txId = 'NOV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
            document.getElementById('transaction-id').textContent = txId;
            let msg = `Total dibayar: Rp ${total.toLocaleString()}`;
            if (ktmSelected) msg += ' (termasuk diskon KTM 10%)';
            document.getElementById('success-message').textContent = msg;
            document.getElementById('success-modal').classList.add('open');

            // Simpan order
            if (currentUser) {
                const orderItems = cart.map(item => {
                    const p = products.find(pr => pr.id === item.id);
                    return { id: p.id, name: p.name, qty: item.qty, price: getDiscountedPrice(p) };
                });
                orders.push({
                    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
                    userEmail: currentUser.email,
                    items: orderItems,
                    total: total,
                    status: 'packed', // dikemas
                    date: new Date().toISOString()
                });
                localStorage.setItem('novationery_orders', JSON.stringify(orders));
            }

            // Update sold & stock
            cart.forEach(item => {
                const p = products.find(pr => pr.id === item.id);
                if (p) {
                    p.sold = (p.sold || 0) + item.qty;
                    p.stock -= item.qty;
                }
            });
            cart = [];
            checkoutData = null;
            localStorage.setItem('novationery_products', JSON.stringify(products));
            localStorage.setItem('novationery_cart', JSON.stringify(cart));
            renderAll();
        }, 3000);
    });

    // --- Continue shopping ---
    document.getElementById('btn-continue-shopping').addEventListener('click', function() {
        document.getElementById('success-modal').classList.remove('open');
        navigate('home');
    });

    // --- Back from detail ---
    document.getElementById('btn-back-detail').addEventListener('click', function() {
        navigate('catalog');
    });

    // --- Add to cart from detail ---
    document.getElementById('btn-add-cart-detail').addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        addToCart(id);
        alert('Produk ditambahkan ke keranjang!');
    });

    // --- Review modal ---
    document.getElementById('review-modal-close').addEventListener('click', function() {
        document.getElementById('review-modal').classList.remove('open');
    });

    // --- Star rating ---
    document.querySelectorAll('.star-rating span').forEach(star => {
        star.addEventListener('click', function() {
            const val = parseInt(this.dataset.value);
            document.getElementById('review-rating').value = val;
            document.querySelectorAll('.star-rating span').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= val);
            });
        });
        star.addEventListener('mouseover', function() {
            const val = parseInt(this.dataset.value);
            document.querySelectorAll('.star-rating span').forEach(s => {
                s.style.color = parseInt(s.dataset.value) <= val ? '#f39c12' : '#ccc';
            });
        });
        star.addEventListener('mouseout', function() {
            const active = parseInt(document.getElementById('review-rating').value);
            document.querySelectorAll('.star-rating span').forEach(s => {
                s.style.color = parseInt(s.dataset.value) <= active ? '#f39c12' : '#ccc';
            });
        });
    });
    // Set default
    document.querySelectorAll('.star-rating span').forEach(s => {
        s.style.color = parseInt(s.dataset.value) <= 5 ? '#f39c12' : '#ccc';
    });
    document.getElementById('review-rating').value = 5;

    // --- Submit review ---
    document.getElementById('review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const productId = currentReviewProductId || currentProductId;
        if (!productId) {
            alert('Produk tidak ditemukan.');
            return;
        }
        const rating = document.getElementById('review-rating').value;
        const comment = document.getElementById('review-text').value.trim();
        const image = document.getElementById('review-image').value.trim();
        if (!comment) {
            alert('Silakan tulis komentar.');
            return;
        }
        if (submitReview(productId, rating, comment, image)) {
            alert('Ulasan berhasil dikirim!');
            document.getElementById('review-modal').classList.remove('open');
            document.getElementById('review-form').reset();
            document.getElementById('review-rating').value = 5;
            renderReviews(productId);
            renderAll();
        }
    });

    // --- Contact form ---
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Pesan berhasil dikirim! (simulasi)');
        this.reset();
    });

    // --- Admin product form ---
    document.getElementById('admin-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('prod-name').value.trim();
        const category = document.getElementById('prod-category').value;
        const price = parseInt(document.getElementById('prod-price').value);
        const stock = parseInt(document.getElementById('prod-stock').value);
        const discount = parseInt(document.getElementById('prod-discount').value) || 0;
        const discountType = document.getElementById('prod-discount-type').value;
        let image = document.getElementById('prod-image').value.trim();
        if (!image) image = `images/${name.toLowerCase().replace(/\s/g, '_')}.jpg`;
        if (!name || !category || isNaN(price) || isNaN(stock)) {
            alert('Mohon lengkapi semua field!');
            return;
        }
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            price,
            stock,
            image,
            discount,
            discountType,
            sold: 0,
            rating: 0
        });
        localStorage.setItem('novationery_products', JSON.stringify(products));
        renderAll();
        this.reset();
        alert('Produk berhasil ditambahkan!');
    });

    // ============================================================
    // BANNER SLIDER (swipe + auto + klik) — TETAP
    // ============================================================
    let currentBanner = 0;
    const track = document.getElementById('banner-track');
    const dotsContainer = document.getElementById('banner-dots');
    const slides = track ? track.querySelectorAll('.hero-banner-slide') : [];
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let autoSlideInterval = null;

    if (slides.length > 0) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToBanner(i));
            dotsContainer.appendChild(dot);
        });

        function goToBanner(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentBanner = index;
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            track.style.transform = `translateX(-${index * 100}%)`;
            dotsContainer.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === index));
        }

        function nextSlide() { goToBanner(currentBanner + 1); }

        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        track.addEventListener('touchstart', function(e) {
            stopAutoSlide();
            startX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
            const matrix = window.getComputedStyle(track).transform;
            if (matrix !== 'none') {
                const values = matrix.match(/matrix.*\((.+)\)/);
                if (values) {
                    const vals = values[1].split(', ');
                    currentTranslate = parseFloat(vals[4] || 0);
                }
            } else {
                currentTranslate = -currentBanner * 100;
            }
        }, { passive: true });

        track.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = (currentX - startX) / track.offsetWidth * 100;
            let newTranslate = currentTranslate + diff;
            const maxTranslate = -(slides.length - 1) * 100;
            if (newTranslate > 0) newTranslate = 0;
            if (newTranslate < maxTranslate) newTranslate = maxTranslate;
            track.style.transform = `translateX(${newTranslate}%)`;
        }, { passive: true });

        track.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            const currentX = e.changedTouches[0].clientX;
            const diff = (currentX - startX) / track.offsetWidth * 100;
            if (diff < -15) goToBanner(currentBanner + 1);
            else if (diff > 15) goToBanner(currentBanner - 1);
            else goToBanner(currentBanner);
            startAutoSlide();
        }, { passive: true });

        let isMouseDown = false;
        let mouseStartX = 0;
        track.addEventListener('mousedown', function(e) {
            stopAutoSlide();
            isMouseDown = true;
            mouseStartX = e.clientX;
            track.style.transition = 'none';
            const matrix = window.getComputedStyle(track).transform;
            if (matrix !== 'none') {
                const values = matrix.match(/matrix.*\((.+)\)/);
                if (values) {
                    const vals = values[1].split(', ');
                    currentTranslate = parseFloat(vals[4] || 0);
                }
            } else {
                currentTranslate = -currentBanner * 100;
            }
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isMouseDown) return;
            const diff = (e.clientX - mouseStartX) / track.offsetWidth * 100;
            let newTranslate = currentTranslate + diff;
            const maxTranslate = -(slides.length - 1) * 100;
            if (newTranslate > 0) newTranslate = 0;
            if (newTranslate < maxTranslate) newTranslate = maxTranslate;
            track.style.transform = `translateX(${newTranslate}%)`;
        });

        document.addEventListener('mouseup', function(e) {
            if (!isMouseDown) return;
            isMouseDown = false;
            const diff = (e.clientX - mouseStartX) / track.offsetWidth * 100;
            if (diff < -15) goToBanner(currentBanner + 1);
            else if (diff > 15) goToBanner(currentBanner - 1);
            else goToBanner(currentBanner);
            startAutoSlide();
        });

        slides.forEach(slide => {
            slide.addEventListener('click', function(e) {
                if (isDragging || isMouseDown) return;
                const link = this.dataset.link;
                const filter = this.dataset.filter;
                if (link === 'catalog') {
                    navigate('catalog');
                    setTimeout(() => {
                        renderCatalogProducts(filter);
                        document.querySelectorAll('.category-pill').forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.cat === filter);
                        });
                    }, 100);
                }
            });
        });

        startAutoSlide();
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
    }
}

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', init);
