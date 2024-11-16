let dataPengeluaran = JSON.parse(localStorage.getItem("dataPengeluaran")) || [];

// Daftar kategori untuk konsistensi
const daftarKategori = {
    makanan: "Beli Makanan",
    kebutuhankos: "Belanja Kebutuhan Kos",
    masak: "Belanja Untuk Masak",
    transportasi: "Bensin Motor",
    pulsa: "Paket & Wifi",
    akademik: "Kebutuhan Kuliah",
    pergimas: "Pergi Dengan Mas",
    pergikawan: "Pergi Dengan Teman",
    lainnya: "Pengeluaran Tak Terduga",
    dikirimbapak: "Dikirim Bapak",
    tabungandedek: "Tabungan Dedek",
    dikasihayuk: "Dikasih Ayuk",
    ditambahinmas: "Ditambahin Mas"
};

// Fungsi untuk mengkapitalisasi setiap kata
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
const toggleDarkMode = document.getElementById('toggleDarkMode');

toggleDarkMode.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');

    // Menyimpan preferensi pengguna
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Mengaktifkan dark mode jika diatur sebelumnya
window.onload = () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleDarkMode.checked = true; // Set checkbox jika dark mode aktif
    }
};

function formatInput() {
    const inputField = document.getElementById("jumlah");
    let inputVal = inputField.value.replace(/,/g, "").replace(/\D/g, ""); // Menghapus karakter non-digit
    inputField.value = inputVal ? parseInt(inputVal).toLocaleString() : ""; // Format dengan pemisah ribuan
}

// Fungsi untuk menampilkan kategori Pengeluaran
function tambahPengeluaran() {
    document.getElementById("inputContainer").style.display = "block";
    document.getElementById("kategori").style.display = "block";
    document.getElementById("kategoriLabel").style.display = "block";
    document.getElementById("currentType").value = "pengeluaran";
    
    const kategoriDropdown = document.getElementById("kategori");
    kategoriDropdown.innerHTML = `
        <option value="makanan">Beli Makanan</option>
        <option value="kebutuhankos">Belanja Kebutuhan Kos</option>
        <option value="masak">Belanja Untuk Masak</option>
        <option value="transportasi">Bensin Motor</option>
        <option value="pulsa">Paket & Wifi</option>
        <option value="akademik">Kebutuhan Kuliah</option>
        <option value="pergimas">Pergi Dengan Mas</option>
        <option value="pergikawan">Pergi Dengan Teman</option>
        <option value="lainnya">Pengeluaran Tak Terduga</option>
    `;
}

// Fungsi untuk menampilkan kategori Pemasukan
function tambahPemasukan() {
    document.getElementById("inputContainer").style.display = "block";
    document.getElementById("kategori").style.display = "block";
    document.getElementById("kategoriLabel").style.display = "block";
    document.getElementById("currentType").value = "pemasukan";
    
    const kategoriDropdown = document.getElementById("kategori");
    kategoriDropdown.innerHTML = `
        <option value="dikirimbapak">Dikirim Bapak</option>
        <option value="tabungandedek">Tabungan Dedek</option>
        <option value="dikasihayuk">Dikasih Ayuk</option>
        <option value="ditambahinmas">Ditambahin Mas</option>
    `;
}

// Menambah data baik pengeluaran atau pemasukan
function tambahData(tipe) {
    let kategori = document.getElementById("kategori").value; // Ambil kategori dari dropdown
    const jumlahText = document.getElementById("jumlah").value.replace(/,/g, ""); // Menghapus format koma
    const jumlah = parseFloat(jumlahText) || 0; // Pastikan untuk mengkonversi ke float
    const tanggal = new Date();

    // Mengubah format tanggal menjadi dd/mm/yyyy
    const tanggalStr = `${("0" + tanggal.getDate()).slice(-2)}/${("0" + (tanggal.getMonth() + 1)).slice(-2)}/${tanggal.getFullYear()}`;

    const waktuStr = tanggal.toLocaleTimeString("id-ID");

    if (jumlah <= 0) {
        alert("Masukin Jumlahnya Dulu Gemoy");
        return;
    }

    // Menyimpan data baru ke array
    dataPengeluaran.unshift({ tanggal: tanggalStr, waktu: waktuStr, kategori, jumlah, tipe });
    localStorage.setItem("dataPengeluaran", JSON.stringify(dataPengeluaran));

    // Perbarui tampilan tabel dan kosongkan input jumlah
    updateTabel();
    document.getElementById("jumlah").value = "";

    // Perbarui total uang setelah data ditambahkan
    hitungTotalUang();
}

// Mengupdate tampilan tabel dengan data terbaru
function updateTabel() {
    const tbody = document.getElementById("tabelData").getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Kosongkan isi tabel

    dataPengeluaran.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${capitalizeWords(daftarKategori[item.kategori] || item.kategori)}</td>
            <td>Rp. ${item.jumlah.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        `;
        tbody.appendChild(row); // Tambahkan baris ke tabel
    });
}

// Menghitung total uang saat ini
function hitungTotalUang() {
    let totalPengeluaran = dataPengeluaran
        .filter(item => item.tipe === 'pengeluaran')
        .reduce((acc, item) => acc + item.jumlah, 0);

    let totalPemasukan = dataPengeluaran
        .filter(item => item.tipe === 'pemasukan')
        .reduce((acc, item) => acc + item.jumlah, 0);

    let totalUang = totalPemasukan - totalPengeluaran;

// Pastikan totalUang valid sebelum diproses
if (!isNaN(totalUang)) {
    // Format angka dengan dua angka di belakang koma dan pemisah ribuan menggunakan titik
    let formattedTotal = totalUang.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Tampilkan hasil ke elemen HTML
    document.getElementById("totalUang").innerHTML = `
        <h3>Sisa Duit Gemoy Rp. ${formattedTotal}</h3>
    `;
} else {
    document.getElementById("totalUang").innerHTML = "<h3>Sepertinya Ada Yang Salah</h3>";
}
}

// Menghapus semua data dan reset total uang
function resetData() {
    tampilkanModal();
}

// Menampilkan Modal
function tampilkanModal() {
    document.getElementById("modalPeringatan").style.display = "block";
}

// Menutup Modal
function tutupModal() {
    document.getElementById("modalPeringatan").style.display = "none";
}

// Konfirmasi Reset Data
function konfirmasiReset() {
    dataPengeluaran = []; 
    localStorage.removeItem("dataPengeluaran"); 
    updateTabel(); 
    document.getElementById("totalUang").innerHTML = "<h3>Total Uang Saat Ini: Rp 0</h3>"; 
    tutupModal();
}

// Fitur cancel
function cancelInput() {
    document.getElementById("jumlah").value = ""; 
    document.getElementById("inputContainer").style.display = "none"; 
    document.getElementById("kategori").style.display = "none"; 
    document.getElementById("kategoriLabel").style.display = "none"; 
}

// Muat data dan total uang saat pertama kali halaman dibuka
updateTabel();
hitungTotalUang();