/* =====================================================================
 * LEVEL 2 — SEDANG  |  TUGAS 4  |  BERKAS: main.js
 * ---------------------------------------------------------------------
 * TUGAS BERKAS INI : SATU-SATUNYA berkas yang boleh memakai DOM
 *                   (document, querySelector, innerHTML) dan Event Listener.
 * ===================================================================== */

import { daftarRuangan } from "./data.js";
import { formatDurasi, cariRuanganCocok } from "./helper.js";
import {
  pinjamRuangan,
  batalkanPinjaman,
  hitungTotalDipinjam,
  sedangDipinjam,
  ambilDaftarPinjaman,
} from "./peminjaman.js";

// Ambil elemen HTML
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

/**
 * Menampilkan kartu-kartu ruangan di katalog.
 * Saat halaman baru dibuka (input kosong), menampilkan seluruh ruangan.
 * Saat input diisi, otomatis menyaring data yang sesuai.
 */

// function tampilkanKatalog() {
//   elemenKatalog.innerHTML = ""; // Kosongkan kontainer katalog

//   // // Ambil nilai dari input pencarian
//   // const jumlahVal = inputJumlahCari ? inputJumlahCari.value.trim() : "";
//   // const fasilitasVal = inputFasilitas ? inputFasilitas.value.trim() : "";

//   // let ruanganDitampilkan = [];

//   // // LOGIKA UTAMA:
//   // // Jika kedua kotak pencarian KOSONG, tampilkan SEMUA daftarRuangan secara utuh (card muncul duluan!)
//   // if (jumlahVal === "" && fasilitasVal === "") {
//   //   ruanganDitampilkan = daftarRuangan;
//   // } else {
//   //   // Jika salah satu / keduanya DIISI, baru jalankan fungsi cariRuanganCocok
//   //   const jumlahOrang = jumlahVal !== "" ? Number(jumlahVal) : 1; // Default aman jika jumlah kosong tapi fasilitas diisi
//   //   ruanganDitampilkan = cariRuanganCocok(
//   //     daftarRuangan,
//   //     jumlahOrang,
//   //     fasilitasVal,
//   //   );
//   // }

//   // // Jika hasil pencarian kosong
//   // if (ruanganDitampilkan.length === 0) {
//   //   if (infoCari) {
//   //     infoCari.textContent = "Tidak ada ruangan yang cocok.";
//   //   }
//   //   return;
//   // }

//   // // Bersihkan teks info jika ada hasil
//   // if (infoCari) {
//   //   infoCari.textContent = "";
//   // }

//   // Render kartu ruangan ke layar
//   daftarRuangan.forEach((ruangan) => {
//     const dipinjam = sedangDipinjam(ruangan.id);
//     const kartu = document.createElement("article");
//     kartu.className = "kartu-ruangan";
//     kartu.innerHTML = `
//       <h3>${ruangan.namaRuangan}</h3>
//       <p>Kapasitas: ${ruangan.kapasitas} orang</p>
//       <p>Fasilitas: ${ruangan.fasilitas.join(", ")}</p>
//       <span class="status ${dipinjam ? "status-dipinjam" : "status-tersedia"}">
//         ${dipinjam ? "Dipinjam" : "Tersedia"}
//       </span>
//     `;
//     elemenKatalog.appendChild(kartu);
//   });
// }

function ambilRuanganUntukKatalog() {
  if (inputJumlahCari.value === "") {
    infoCari.textContent = "";
    return daftarRuangan;
  }
  const hasilCari = cariRuanganCocok(
    daftarRuangan,
    Number(inputJumlahCari.value),
    inputFasilitas.value,
  );
  infoCari.textContent = `Ditemukan ${hasilCari.length} ruangan yang cocok.`;
  return hasilCari;
}

function tampilkanKatalog() {
  elemenKatalog.innerHTML = "";
  const ruanganDitampilkan = ambilRuanganUntukKatalog();
  if (ruanganDitampilkan.length === 0) {
    elemenKatalog.innerHTML =
      '<p class="kosong">Tidak ada ruangan yang cocok.</p>';
    return;
  }
  ruanganDitampilkan.forEach((ruangan) => {
    /* isi kartu sama seperti sebelumnya */
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

inputJumlahCari.addEventListener("input", tampilkanKatalog);
inputFasilitas.addEventListener("input", tampilkanKatalog);

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

function buatSel(isi) {
  const sel = document.createElement("td");
  sel.textContent = isi;
  return sel;
}

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

function tampilkanPesan(teks, jenis) {
  elemenPesan.textContent = teks;
  elemenPesan.className = `pesan pesan-${jenis}`;
}

function perbaruiTampilan() {
  tampilkanKatalog();
  tampilkanPilihanRuangan();
  tampilkanTabelPinjaman();
  elemenTotal.textContent = hitungTotalDipinjam();
}

// Event Listener Form Submit
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

// Event Listener Pembatalan Pinjaman
isiTabel.addEventListener("click", (event) => {
  const tombol = event.target.closest(".tombol-batal");
  if (!tombol) return;
  const idRuangan = tombol.dataset.id;

  if (batalkanPinjaman(idRuangan) === true) {
    tampilkanPesan("Peminjaman berhasil dibatalkan", "sukses");
    perbaruiTampilan();
  }
});

// Event Listener untuk input pencarian katalog secara real-time
// if (inputJumlahCari && inputFasilitas) {
//   inputJumlahCari.addEventListener("input", tampilkanKatalog);
//   inputFasilitas.addEventListener("input", tampilkanKatalog);
// }

// Tampilan Awal saat halaman dimuat
perbaruiTampilan();
