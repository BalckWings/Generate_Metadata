📸 Smart Metadata Generator for Microstock

Aplikasi web modern berbasis React yang dirancang khusus untuk membantu kontributor Microstock (Shutterstock, Adobe Stock, Freepik, dll) dalam mengisi judul dan kata kunci (keywords) secara massal (bulk) dan mengekspornya ke format CSV standar.

✨ Fitur Utama

🚀 Bulk Upload: Unggah puluhan gambar sekaligus dengan cepat.

🤖 AI Simulation: Simulasi pengisian metadata otomatis (Judul & Keyword) berdasarkan kategori konteks (Alam, Teknologi, Orang).

📝 Tabel Editor Interaktif: Edit metadata dengan mudah dalam tampilan tabel, lengkap dengan penghitung karakter.

📂 Multi-Agency Export: Ekspor metadata ke format CSV yang kompatibel dengan:

1. Adobe Stock

2. Shutterstock

3. Freepik

4. Format Universal

📋 Copy-Paste Ready: Tombol cepat untuk menyalin keyword atau deskripsi ke clipboard.

📱 Responsif: Tampilan antarmuka yang bersih dan modern menggunakan Tailwind CSS.

🛠️ Teknologi yang Digunakan

1. React.js - Library UI utama.

2. Vite - Build tool yang super cepat.

3. Tailwind CSS - Framework CSS untuk styling.

4. Lucide React - Ikon antarmuka yang ringan.

⚙️ Cara Menjalankan (Instalasi)

Anda bisa menjalankan proyek ini di komputer lokal atau menggunakan GitHub Codespaces.

Prasyarat

Pastikan Anda sudah menginstal Node.js di komputer Anda.

Langkah-langkah

1. Clone Repository

  git clone [https://github.com/username-anda/metadata-generator.git](https://github.com/username-anda/metadata-generator.git)
  cd metadata-generator


2. Install Dependencies

   npm install


3. Jalankan Aplikasi

    npm run dev


4. Buka di Browser
    Aplikasi biasanya akan berjalan di http://localhost:5173.

📖 Panduan Penggunaan

Upload Gambar: Klik tombol "Add Images" atau drag & drop file gambar Anda ke area upload.

Pilih Kategori AI: Pilih konteks gambar (Nature, Technology, atau People) pada menu dropdown di atas.

Generate: Klik tombol "Generate All". Aplikasi akan mensimulasikan pengisian judul dan kata kunci.

Edit Manual: Anda bisa mengedit teks hasil generate langsung di tabel jika ada yang kurang sesuai.

Ekspor: Klik tombol "Export" di pojok kanan atas, lalu pilih format agensi yang diinginkan (misal: Adobe Stock). File .csv akan terunduh otomatis.

⚠️ Catatan Penting

Versi ini adalah Prototipe. Fitur "Generate AI" saat ini menggunakan Mock Data (data simulasi) untuk mendemonstrasikan alur kerja aplikasi tanpa memerlukan biaya API Key.

Untuk penggunaan produksi yang sebenarnya (Real AI), Anda perlu menghubungkan fungsi generateMetadata ke API Vision seperti:

1. OpenAI GPT-4 Vision API

2. Google Gemini Pro Vision API

3. Clarifai / Azure Computer Vision

🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat Pull Request jika Anda ingin menambahkan fitur baru atau memperbaiki bug.

1. Fork proyek ini.

2. Buat branch fitur (git checkout -b fitur-keren).

3. Commit perubahan (git commit -m 'Menambahkan fitur keren').

4. Push ke branch (git push origin fitur-keren).

5. Buka Pull Request.

📄 Lisensi

Proyek ini didistribusikan di bawah lisensi MIT. Silakan gunakan dan modifikasi secara bebas.
