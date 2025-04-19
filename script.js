let dataPengeluaran = JSON.parse(localStorage.getItem("dataPengeluaran")) || [];

const daftarKategori = {
    "": "",
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

function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const toggleDarkMode = document.getElementById('toggleDarkMode');
toggleDarkMode.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

window.onload = () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleDarkMode.checked = true;
    }
};

function formatInput() {
    const inputField = document.getElementById("jumlah");
    let inputVal = inputField.value.replace(/,/g, "").replace(/\D/g, "");
    inputField.value = inputVal ? parseInt(inputVal).toLocaleString() : "";
}

const selectKategori = document.getElementById('kategori');

// Fungsi kategori aktif
selectKategori.addEventListener('change', function () {
    const selectedText = selectKategori.options[selectKategori.selectedIndex].text;
});

// Fungsi untuk pengeluaran
function tambahPengeluaran() {
    document.getElementById("inputContainer").style.display = "block";
    document.getElementById("kategori").style.display = "block";
    document.getElementById("kategoriLabel").style.display = "block";
    document.getElementById("currentType").value = "pengeluaran";
    
    const kategoriDropdown = document.getElementById("kategori");
    kategoriDropdown.innerHTML = `
        <option value=""></option>
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

function tambahPemasukan() {
    document.getElementById("inputContainer").style.display = "block";
    document.getElementById("kategori").style.display = "block";
    document.getElementById("kategoriLabel").style.display = "block";
    document.getElementById("currentType").value = "pemasukan";
    
    const kategoriDropdown = document.getElementById("kategori");
    kategoriDropdown.innerHTML = `
        <option value=""></option>
        <option value="dikirimbapak">Dikirim Bapak</option>
        <option value="tabungandedek">Tabungan Dedek</option>
        <option value="dikasihayuk">Dikasih Ayuk</option>
        <option value="ditambahinmas">Ditambahin Mas</option>
    `;
}

function tambahData(tipe) {
    let kategori = document.getElementById("kategori").value;
    const jumlahText = document.getElementById("jumlah").value.replace(/,/g, "");
    const jumlah = parseFloat(jumlahText) || 0;
    const tanggal = new Date();

    const tanggalStr = `${("0" + tanggal.getDate()).slice(-2)}/${("0" + (tanggal.getMonth() + 1)).slice(-2)}/${tanggal.getFullYear()}`;
    const waktuStr = tanggal.toLocaleTimeString("id-ID");

    if (jumlah <= 0) {
        alert("Masukin Jumlahnya Dulu Gemoy");
        return;
    }

    dataPengeluaran.unshift({ tanggal: tanggalStr, waktu: waktuStr, kategori, jumlah, tipe });
    localStorage.setItem("dataPengeluaran", JSON.stringify(dataPengeluaran));

    updateTabel();
    document.getElementById("jumlah").value = "";
    hitungTotalUang();
}

function updateTabel() {
    const tbody = document.getElementById("tabelData").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    dataPengeluaran.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${capitalizeWords(daftarKategori[item.kategori] || item.kategori)}</td>
            <td>Rp. ${item.jumlah.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        `;
        tbody.appendChild(row);
    });
}

function hitungTotalUang() {
    let totalPengeluaran = dataPengeluaran
        .filter(item => item.tipe === 'pengeluaran')
        .reduce((acc, item) => acc + item.jumlah, 0);

    let totalPemasukan = dataPengeluaran
        .filter(item => item.tipe === 'pemasukan')
        .reduce((acc, item) => acc + item.jumlah, 0);

    let totalUang = totalPemasukan - totalPengeluaran;

    if (!isNaN(totalUang)) {
        let formattedTotal = totalUang.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementById("totalUang").innerHTML = `
            <h3>Sisa Duit Gemoy Rp. ${formattedTotal}</h3>
        `;
    } else {
        document.getElementById("totalUang").innerHTML = "<h3>Sepertinya Ada Yang Salah</h3>";
    }
}

function resetData() {
    tampilkanModal();
}

function tampilkanModal() {
    document.getElementById("modalPeringatan").style.display = "block";
}

function tutupModal() {
    document.getElementById("modalPeringatan").style.display = "none";
}

function konfirmasiReset() {
    dataPengeluaran = [];
    localStorage.removeItem("dataPengeluaran");
    updateTabel();
    document.getElementById("totalUang").innerHTML = "<h3>Sisa Duit Gemoy Rp. 0</h3>";
    tutupModal();
    cancelInput();
}

function cancelInput() {
    document.getElementById("jumlah").value = "";
    document.getElementById("inputContainer").style.display = "none";
    document.getElementById("kategori").style.display = "none";
    document.getElementById("kategoriLabel").style.display = "none";
}

updateTabel();
hitungTotalUang();
