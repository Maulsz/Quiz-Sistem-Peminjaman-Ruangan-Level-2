/* =====================================================================
 * LEVEL 2 — SEDANG  |  TUGAS 4  |  BERKAS: main.js
 * ---------------------------------------------------------------------
 * TUGAS BERKAS INI : SATU-SATUNYA berkas yang boleh memakai DOM
 *                   (document, querySelector, innerHTML) dan Event Listener.
 *
 * KERJAKAN SETELAH npm run uji MENUNJUKKAN 32/32.
 *
 * CARA MENGERJAKAN :
 *   1. Jalankan index.html dengan Live Server. Buka Console (F12).
 *   2. Kerjakan TODO 4.1 - 4.5 secara berurutan. Setiap selesai satu TODO,
 *      simpan dan lihat perubahannya di browser.
 *   3. Periksa hasil dengan "Daftar Periksa Tampilan" di modul.
 *
 * ALUR BERKAS INI:
 *   LANGKAH 1 import -> LANGKAH 2 ambil elemen -> LANGKAH 3 fungsi tampilan
 *   -> LANGKAH 4 event listener -> LANGKAH 5 tampilan awal
 * ===================================================================== */

// =====================================================================
// LANGKAH 1: IMPORT (sudah jadi)
// =====================================================================
import { daftarRuangan } from "./data.js";
import { formatDurasi } from "./helper.js";
import {
  pinjamRuangan,
  batalkanPinjaman,
  hitungTotalDipinjam,
  sedangDipinjam,
  ambilDaftarPinjaman,
} from "./peminjaman.js";
import { cariRuanganCocok } from "./helper.js";

// =====================================================================
// LANGKAH 2: AMBIL ELEMEN HTML (sudah jadi)
// CATATAN: Teks di dalam querySelector('#...') = atribut id di index.html.
// =====================================================================
const elemenKatalog = document.querySelector("#katalog-ruangan");
const formPinjam = document.querySelector("#form-pinjam");
const pilihanRuangan = document.querySelector("#pilihan-ruangan");
const inputNama = document.querySelector("#nama-peminjam");
const inputJumlah = document.querySelector("#jumlah-orang");
const inputDurasi = document.querySelector("#durasi-jam");
const elemenPesan = document.querySelector("#pesan");
const isiTabel = document.querySelector("#isi-tabel");
const elemenTotal = document.querySelector("#total-dipinjam");
const inputJumlahCari = document.getElementById("cari-jumlah");
const inputFasilitas = document.getElementById("cari-fasilitas");
const infoCari = document.getElementById("info-cari");
const containerKatalog = document.getElementById("katalog-ruangan");

// =====================================================================
// LANGKAH 3: FUNGSI-FUNGSI TAMPILAN
// =====================================================================

/** Menampilkan kartu-kartu ruangan (Sudah diperbarui dengan fitur pencarian cariRuanganCocok) */
function tampilkanKatalog() {
  elemenKatalog.innerHTML = ""; // Kosongkan kontainer katalog

  // Ambil nilai dari input pencarian
  const jumlahVal = inputJumlahCari ? inputJumlahCari.value.trim() : "";
  const fasilitasVal = inputFasilitas ? inputFasilitas.value.trim() : "";

  // Jika input jumlah peserta kosong (belum diketik), set ke string kosong/undefined agar menampilkan semua ruangan
  // Jika diisi, ubah ke tipe angka (Number)
  const jumlahOrang = jumlahVal !== "" ? Number(jumlahVal) : "";

  // Panggil fungsi cariRuanganCocok (jika jumlahOrang kosong dan fasilitas kosong, helper akan otomatis menampilkan semua data)
  const ruanganDitampilkan = cariRuanganCocok(
    daftarRuangan,
    jumlahOrang,
    fasilitasVal,
  );

  // Jika hasil pencarian kosong, tampilkan pesan
  if (ruanganDitampilkan.length === 0) {
    if (infoCari) {
      infoCari.textContent = "Tidak ada ruangan yang cocok.";
    }
    return;
  }

  // Bersihkan teks info jika ada hasil
  if (infoCari) {
    infoCari.textContent = "";
  }

  // Render kartu ruangan ke layar
  ruanganDitampilkan.forEach((ruangan) => {
    const dipinjam = sedangDipinjam(ruangan.id);
    const kartu = document.createElement("article");
    kartu.className = "kartu-ruangan";
    kartu.innerHTML = `
      <h3>${ruangan.namaRuangan}</h3>
      <p>Kapasitas: ${ruangan.kapasitas} orang</p>
      <p>Fasilitas: ${ruangan.fasilitas.join(", ")}</p>
      <span class="status ${dipinjam ? "status-dipinjam" : "status-tersedia"}">
        ${dipinjam ? "Dipinjam" : "Tersedia"}
      </span>
    `;
    elemenKatalog.appendChild(kartu);
  });
}
/** Mengisi pilihan ruangan pada dropdown <select>. */
function tampilkanPilihanRuangan() {
  pilihanRuangan.innerHTML = `<option value="">-- Pilih ruangan --</option>`;
  daftarRuangan.forEach((ruangan) => {
    const dipinjam = sedangDipinjam(ruangan.id);
    const opsi = document.createElement("option");
    opsi.value = ruangan.id;
    opsi.textContent = `${ruangan.namaRuangan} (maks. ${ruangan.kapasitas} orang)`;

    if (dipinjam === true) {
      opsi.disabled = true;
      opsi.textContent += " - sedang dipinjam";
    }
    pilihanRuangan.appendChild(opsi);
  });
}

/**
 * Membuat satu sel tabel <td> berisi teks.
 */
function buatSel(isi) {
  const sel = document.createElement("td");
  sel.textContent = isi;
  return sel;
}

/** Membuat sel berisi tombol Batalkan yang menyimpan id ruangan. */
function buatSelTombolBatal(idRuangan) {
  const sel = document.createElement("td");
  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "tombol-batal";
  tombol.textContent = "Batalkan";
  tombol.dataset.id = idRuangan;
  sel.appendChild(tombol);
  return sel;
}

/** Menampilkan daftar peminjaman di tabel. */
function tampilkanTabelPinjaman() {
  const semuaPinjaman = ambilDaftarPinjaman();
  isiTabel.innerHTML = "";

  if (semuaPinjaman.length === 0) {
    isiTabel.innerHTML = `
      <tr><td colspan="6" class="kosong">Belum ada ruangan yang dipinjam.</td></tr>
    `;
    return;
  }

  semuaPinjaman.forEach((pinjaman, indeks) => {
    const baris = document.createElement("tr");

    baris.appendChild(buatSel(indeks + 1));
    baris.appendChild(buatSel(pinjaman.namaRuangan));
    baris.appendChild(buatSel(pinjaman.namaPeminjam));
    baris.appendChild(buatSel(`${pinjaman.jumlahOrang} orang`));
    baris.appendChild(buatSel(formatDurasi(pinjaman.durasiJam)));
    baris.appendChild(buatSelTombolBatal(pinjaman.idRuangan));
    isiTabel.appendChild(baris);
  });
}

/** Menampilkan pesan sukses/gagal di bawah form. */
function tampilkanPesan(teks, jenis) {
  elemenPesan.textContent = teks;
  elemenPesan.className = `pesan pesan-${jenis}`;
}

/** Memperbarui SELURUH tampilan sekaligus. */
function perbaruiTampilan() {
  tampilkanKatalog();
  tampilkanPilihanRuangan();
  tampilkanTabelPinjaman();
  elemenTotal.textContent = hitungTotalDipinjam();
}

// =====================================================================
// LANGKAH 4: EVENT LISTENER
// =====================================================================

formPinjam.addEventListener("submit", (event) => {
  event.preventDefault();
  const ruanganTerpilih = daftarRuangan.find(
    (ruangan) => ruangan.id === pilihanRuangan.value,
  );

  const hasil = pinjamRuangan(
    ruanganTerpilih,
    inputNama.value,
    Number(inputJumlah.value),
    Number(inputDurasi.value),
  );

  if (hasil.berhasil) {
    tampilkanPesan(hasil.pesan, "sukses");
    formPinjam.reset();
    perbaruiTampilan();
  } else {
    tampilkanPesan(hasil.pesan, "gagal");
  }
});

isiTabel.addEventListener("click", (event) => {
  const tombol = event.target.closest(".tombol-batal");
  if (!tombol) return;
  const idRuangan = tombol.dataset.id;

  if (batalkanPinjaman(idRuangan) === true) {
    tampilkanPesan("Peminjaman berhasil dibatalkan", "sukses");
    perbaruiTampilan();
  }
});

// TAMBAHAN EVENT LISTENER PENCARIAN KATALOG SECARA REAL-TIME
if (inputJumlahCari && inputFasilitas) {
  // Menjalankan fungsi tampilkanKatalog setiap kali user mengetik di kolom pencarian
  inputJumlahCari.addEventListener("input", tampilkanKatalog);
  inputFasilitas.addEventListener("input", tampilkanKatalog);
}

// =====================================================================
// LANGKAH 5: TAMPILAN AWAL (sudah jadi)
// =====================================================================
perbaruiTampilan();
