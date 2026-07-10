# Business Overview: Novationery 📚✨

**Informasi Mahasiswa**
- **Nama:** Novi Nur Fadilah
- **NIM:** 209250098
- **Mata Kuliah:** KAIT II
- **Dosen Pengampu:** Yoki Oktorian Sukardi S.Kom., M.A.B.

---

## 1. Nama Bisnis, Deskripsi, dan Value Proposition
**Nama Bisnis:** Novationery — Toko Alat Tulis Kampus
**Deskripsi:** Novationery adalah platform e-commerce berbasis web yang menyediakan berbagai kebutuhan alat tulis dan perlengkapan kampus dengan fokus pada kemudahan akses, harga terjangkau, dan pengalaman berbelanja yang interaktif (Single Page Application). 
**Value Proposition:** - Menyediakan perlengkapan spesifik untuk kebutuhan mahasiswa.
- Memberikan penawaran khusus mahasiswa (KTM Discount) dan Flash Sale harian.
- Pengalaman berbelanja yang cepat (tanpa reload) dan terintegrasi langsung dengan WhatsApp untuk kemudahan komunikasi dan konfirmasi pembayaran.

## 2. Target Market & Segmentasi Pelanggan
- **Demografis:** Pelajar dan mahasiswa (usia 15 - 25 tahun).
- **Geografis:** Area sekitar kampus atau institusi pendidikan (skala lokal/nasional tergantung ekspansi pengiriman).
- **Psikografis:** Generasi Z yang menyukai kepraktisan, promo/diskon (price-conscious), dan terbiasa berbelanja secara digital menggunakan perangkat mobile.
- **Segmentasi Utama:** Mahasiswa berbagai jurusan (seperti seni, teknik, atau umum) yang secara rutin membutuhkan *restock* kertas, alat tulis, dan perlengkapan tugas.

## 3. Analisis Pasar Singkat + Kompetitor
**Analisis Pasar:** Kebutuhan alat tulis kampus tidak pernah mati (evergreen market) karena adanya siklus akademik yang terus berjalan. Namun, mahasiswa sering mencari harga yang lebih murah dari toko buku besar.
**Kompetitor:**
1. Toko Buku Gramedia (Skala besar, harga lebih premium, sangat lengkap).
2. Fotokopi & Toko ATK sekitar kampus (Praktis tapi stok/katalog terbatas dan jarang memiliki platform online).
3. E-commerce general (Shopee/Tokopedia) (Harga bersaing, namun bukan khusus ATK sehingga pencarian kurang spesifik dan biaya ongkir kadang membebani untuk barang receh).
**Keunggulan Novationery:** Menggabungkan kurasi khusus ATK seperti toko fisik kampus dengan kepraktisan digital e-commerce dan pendekatan personal via WhatsApp.

## 4. Strategi Manajemen Produk & Katalog
- **Kategorisasi Produk:** Katalog disusun dalam 4 kategori utama agar mudah dinavigasi: *Alat Tulis, Kertas, Perlengkapan, dan Seni*.
- **Deskripsi & Daya Tarik Visual:** Menggunakan sistem *Card* UI bergaya *glassmorphism* modern. Setiap produk dilengkapi:
  - Indikator "Terjual" dan "Rating Bintang" untuk *social proof*.
  - Label otomatis untuk diskon (🎓 Diskon atau ⚡ Flash).
  - Status stok real-time (Tombol menjadi "Habis" jika stok = 0).
- **Manajemen Katalog:** Dilengkapi panel "Admin" sederhana dengan akses verifikasi untuk menambah, mengedit, dan menghapus produk serta memperbarui stok langsung dari antarmuka web (Local Storage).

## 5. Model Bisnis & Revenue Stream
- **Model Bisnis:** B2C (Business-to-Consumer) Retail online.
- **Revenue Stream Utama:** Keuntungan langsung dari margin penjualan produk alat tulis dan perlengkapan seni.
- **Rencana Skalabilitas (Future):** Bundling perlengkapan orientasi mahasiswa baru (Maba), program *dropship*, atau *partnership* dengan *brand* alat tulis.

## 6. Strategi Harga, Promosi, dan Diskon
- **Penetapan Harga (Pricing):** Menggunakan harga kompetitif (*competitive pricing*) yang disesuaikan dengan kantong mahasiswa.
- **Flash Sale Dinamis:** Sistem diatur untuk memutar produk Flash Sale (diskon 20%-40%) secara acak setiap 30 detik guna menciptakan *FOMO (Fear Of Missing Out)* dan mendorong konversi cepat.
- **Diskon Mahasiswa (KTM):** Diskon khusus sebesar 10% atau nominal tertentu untuk produk terpilih khusus pelanggan yang berstatus mahasiswa (*Student Discount*).

## 7. Proses Checkout & Simulasi Payment Gateway
**Alur Checkout:**
1. Pengguna menambahkan produk ke keranjang, sistem menghitung total secara *real-time*.
2. Pengguna mengisi nama, alamat, dan metode pembayaran (opsi: Transfer Bank, E-Wallet).
3. **Simulasi Payment Gateway:** Saat "Bayar" diklik, muncul modal *loading* untuk mensimulasikan pemrosesan (mirip Midtrans/Xendit dummy).
4. Setelah sukses, sistem men-generate **ID Transaksi** unik secara otomatis.
5. **Integrasi WhatsApp:** Pelanggan diarahkan untuk mengirimkan format pesanan lengkap dan ID Transaksi ke nomor WhatsApp Admin (`+6283829031607`) untuk konfirmasi pembayaran/pengiriman bukti transfer.

## 8. Rencana SEO, Keamanan, dan Pemeliharaan
- **SEO (Search Engine Optimization):** - Menggunakan tag meta HTML yang optimal (Title, Description).
  - Menerapkan *Semantic HTML* (`<header>`, `<main>`, `<section>`).
  - Mobile-first approach karena Google memprioritaskan indeksasi mobile (Responsive UI).
- **Keamanan:** - Sanitasi input pada panel Admin (menghindari injeksi XSS sederhana).
  - Sistem "Login" dummy dengan PIN (menggunakan Session Storage) agar tidak sembarang orang bisa mengubah katalog.
- **Pemeliharaan:** Penggunaan Vanilla JS dan struktur Modular memudahkan update *frontend*. Data saat ini dikelola via *LocalStorage* yang ke depan direncanakan bermigrasi ke database sungguhan (misal Firebase atau MySQL/PHP) saat traffic meningkat.

## 9. Rencana Penggunaan Data Analytics untuk Pengambilan Keputusan
Meskipun saat ini berbasis front-end, konsep data analytics dirancang sebagai berikut:
- **Analisis Produk Terlaris:** Memantau metrik "Terjual" di tiap produk untuk melihat barang apa yang butuh di-*restock* lebih banyak (contoh: Pulpen Gel dan Penghapus).
- **Analisis Waktu Checkout (Flash Sale Tracker):** Menganalisis seberapa cepat konversi terjadi selama periode *Flash Sale* untuk menentukan jam diskon terbaik.
- **Conversion Rate Tracking (Google Analytics - Future):** Mengintegrasikan *Google Analytics* pada tombol "Kirim Bukti ke WhatsApp" guna mengukur persentase pengunjung yang berhasil mencapai tahap akhir dari *funnel* penjualan.
