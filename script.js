let dataPengeluaran = JSON.parse(localStorage.getItem("dataPengeluaran")) || [];

// Daftar kategori untuk konsistensi
const daftarKategori = {
    makanan: "Makanan",
    transportasi: "Bensin Motor",
    pulsa: "Paket & Wifi",
    akademik: "Kebutuhan Kuliah",
    pergimas: "Pergi Dengan Mas",
    pergikawan: "Pergi Dengan Teman",
    lainnya: "Pengeluaran Tak Terduga",
};

// Fungsi untuk mengkapitalisasi setiap kata
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function formatInput() {
    const inputField = document.getElementById("jumlah");
    let inputVal = inputField.value.replace(/,/g, "").replace(/\D/g, ""); // Menghapus karakter non-digit
    inputField.value = inputVal ? parseInt(inputVal).toLocaleString() : ""; // Format dengan pemisah ribuan
}

// Tampilkan dropdown kategori dan input jumlah saat menambah pengeluaran
function tambahPengeluaran() {
    document.getElementById("inputContainer").style.display = "block"; // Tampilkan container input
    document.getElementById("kategori").style.display = "block"; // Tampilkan dropdown kategori
    document.getElementById("kategoriLabel").style.display = "block"; // Tampilkan label kategori
    document.getElementById("currentType").value = "pengeluaran"; // Set tipe ke pengeluaran
}

// Tampilkan input untuk pemasukan
function tambahPemasukan() {
    document.getElementById("inputContainer").style.display = "block"; // Tampilkan container input
    document.getElementById("kategori").style.display = "none"; // Sembunyikan dropdown kategori
    document.getElementById("kategoriLabel").style.display = "none"; // Sembunyikan label kategori
    document.getElementById("currentType").value = "pemasukan"; // Set tipe ke pemasukan
}

// Menambah data baik pengeluaran atau pemasukan
function tambahData(tipe) {
    let kategori = "Uang Masuk"; // Untuk pemasukan
    if (tipe === "pengeluaran") {
        kategori = document.getElementById("kategori").value; // Ambil kategori dari dropdown
    }
    
    const jumlahText = document.getElementById("jumlah").value.replace(/,/g, ""); // Menghapus format koma
    const jumlah = parseFloat(jumlahText) || 0; // Pastikan untuk mengkonversi ke float
    const tanggal = new Date();
    const tanggalStr = tanggal.toISOString().split("T")[0];
    const waktuStr = tanggal.toLocaleTimeString("id-ID");

    if (jumlah <= 0) {
        alert("Masukkan jumlah yang valid.");
        return;
    }

    // Menyimpan data baru ke array
    dataPengeluaran.push({ tanggal: tanggalStr, waktu: waktuStr, kategori, jumlah, tipe });
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

    // Menampilkan data pengeluaran
    dataPengeluaran.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${capitalizeWords(daftarKategori[item.kategori] || item.kategori)}</td>
            <td>Rp ${item.jumlah.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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

    document.getElementById("totalUang").innerHTML = `
        <h3>Total Uang Saat Ini: Rp ${totalUang.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
    `;
}

// Menghapus semua data
function resetData() {
    dataPengeluaran = []; // Kosongkan data
    localStorage.removeItem("dataPengeluaran"); // Hapus data dari local storage
    updateTabel(); // Perbarui tabel
    document.getElementById("totalUang").innerHTML = "<h3>Total Uang Saat Ini: Rp 0</h3>"; // Reset total uang
}

// Fitur cancel
function cancelInput() {
    document.getElementById("jumlah").value = ""; // Kosongkan input jumlah
    document.getElementById("inputContainer").style.display = "none"; // Sembunyikan container input
    document.getElementById("kategori").style.display = "none"; // Sembunyikan dropdown kategori
    document.getElementById("kategoriLabel").style.display = "none"; // Sembunyikan label kategori
}

// Muat data saat pertama kali halaman dibuka
updateTabel();
