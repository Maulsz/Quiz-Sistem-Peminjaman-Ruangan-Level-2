/* =====================================================================
 * LEVEL 2 — SEDANG  |  TUGAS 4  |  BERKAS: main.js
 * ---------------------------------------------------------------------
 * TUGAS BERKAS INI : SATU-SATUNYA berkas yang boleh memakai DOM
 *                    (document, querySelector, innerHTML) dan Event Listener.
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

// =====================================================================
// LANGKAH 3: FUNGSI-FUNGSI TAMPILAN
// =====================================================================

/** CONTOH (sudah jadi): menampilkan kartu-kartu ruangan. Pelajari polanya! */
function tampilkanKatalog() {
  elemenKatalog.innerHTML = ""; // 1) kosongkan dulu agar tidak dobel

  daftarRuangan.forEach((ruangan) => {
    // 2) ulangi untuk setiap ruangan
    const dipinjam = sedangDipinjam(ruangan.id);
    const kartu = document.createElement("article"); // 3) buat elemen
    kartu.className = "kartu-ruangan";
    kartu.innerHTML = `
      <h3>${ruangan.namaRuangan}</h3>
      <p>Kapasitas: ${ruangan.kapasitas} orang</p>
      <p>Fasilitas: ${ruangan.fasilitas.join(", ")}</p>
      <span class="status ${dipinjam ? "status-dipinjam" : "status-tersedia"}">
        ${dipinjam ? "Dipinjam" : "Tersedia"}
      </span>
    `;
    elemenKatalog.appendChild(kartu); // 4) masukkan ke halaman
  });
}

/** Mengisi pilihan ruangan pada dropdown <select>. */
function tampilkanPilihanRuangan() {
  // TODO 4.1 : Tiru pola tampilkanKatalog() di atas.
  //   LANGKAH a: Isi pilihanRuangan.innerHTML dengan satu opsi kosong:
  //              '<option value="">-- Pilih ruangan --</option>'
  //   LANGKAH b: Ulangi daftarRuangan dengan forEach. Untuk setiap ruangan:
  //              - buat elemen 'option' dengan document.createElement
  //              - opsi.value       = ruangan.id
  //              - opsi.textContent = `${ruangan.namaRuangan} (maks. ${ruangan.kapasitas} orang)`
  //              - JIKA sedangDipinjam(ruangan.id) bernilai true:
  //                  opsi.disabled = true;
  //                  opsi.textContent += ' - sedang dipinjam';
  //              - masukkan opsi ke pilihanRuangan dengan appendChild
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
 * (Sudah jadi) Membuat satu sel tabel <td> berisi teks.
 * CATATAN KEAMANAN: memakai textContent (bukan innerHTML) karena isinya
 * berasal dari ketikan pengguna. Kode HTML yang diketik tidak akan dijalankan.
 */
function buatSel(isi) {
  const sel = document.createElement("td");
  sel.textContent = isi;
  return sel;
}

/** (Sudah jadi) Membuat sel berisi tombol Batalkan yang menyimpan id ruangan. */
function buatSelTombolBatal(idRuangan) {
  const sel = document.createElement("td");
  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "tombol-batal";
  tombol.textContent = "Batalkan";
  tombol.dataset.id = idRuangan; // tersimpan sebagai atribut data-id
  sel.appendChild(tombol);
  return sel;
}

/** Menampilkan daftar peminjaman di tabel. */
function tampilkanTabelPinjaman() {
  const semuaPinjaman = ambilDaftarPinjaman();
  isiTabel.innerHTML = "";

  // Sudah jadi: jika belum ada data, tampilkan baris keterangan.
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

  // TODO 4.2 : Ulangi semuaPinjaman dengan forEach((pinjaman, indeks) => { ... }).
  //   Untuk setiap pinjaman:
  //   LANGKAH a: buat elemen 'tr' bernama baris
  //   LANGKAH b: tambahkan 6 sel ke baris dengan baris.appendChild(...):
  //              1. buatSel(indeks + 1)                      -> nomor urut
  //              2. buatSel(pinjaman.namaRuangan)
  //              3. buatSel(pinjaman.namaPeminjam)
  //              4. buatSel(`${pinjaman.jumlahOrang} orang`)
  //              5. buatSel(formatDurasi(pinjaman.durasiJam)) -> dari helper.js
  //              6. buatSelTombolBatal(pinjaman.idRuangan)
  //   LANGKAH c: masukkan baris ke isiTabel dengan appendChild
}

/** (Sudah jadi) Menampilkan pesan sukses/gagal di bawah form. */
function tampilkanPesan(teks, jenis) {
  elemenPesan.textContent = teks;
  elemenPesan.className = `pesan pesan-${jenis}`;
}

/** Memperbarui SELURUH tampilan sekaligus. */
function perbaruiTampilan() {
  // tampilkanPesan();
  tampilkanKatalog(); // sudah jadi
  tampilkanPilihanRuangan();
  tampilkanTabelPinjaman();
  elemenTotal.textContent = hitungTotalDipinjam();

  // TODO 4.3 : Lengkapi fungsi ini:
  //   - panggil tampilkanPilihanRuangan()
  //   - panggil tampilkanTabelPinjaman()
  //   - isi elemenTotal.textContent dengan hasil hitungTotalDipinjam()
}

// =====================================================================
// LANGKAH 4: EVENT LISTENER
// =====================================================================

formPinjam.addEventListener("submit", (event) => {
  // TODO 4.4 : Tulis isi event submit:
  //   LANGKAH a: event.preventDefault();   <- WAJIB, agar halaman tidak reload
  //   LANGKAH b: cari objek ruangan yang dipilih:
  //              const ruanganTerpilih = daftarRuangan.find(
  //                (ruangan) => ruangan.id === pilihanRuangan.value
  //              );
  //   LANGKAH c: panggil pinjamRuangan(ruanganTerpilih, inputNama.value,
  //              Number(inputJumlah.value), Number(inputDurasi.value))
  //              dan simpan hasilnya di const hasil.
  //   CATATAN  : nilai <input> selalu berupa TEKS, jadi angka diubah dengan Number().
  //   LANGKAH d: jika hasil.berhasil:
  //                tampilkanPesan(hasil.pesan, 'sukses');
  //                formPinjam.reset();
  //                perbaruiTampilan();
  //              selain itu:
  //                tampilkanPesan(hasil.pesan, 'gagal');

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

// CATATAN (Event Delegation): SATU listener di <tbody> untuk semua tombol
// Batalkan, karena tombol dibuat ulang setiap kali tabel diperbarui.
isiTabel.addEventListener("click", (event) => {
  // TODO 4.5 : Tulis isi event klik tombol Batalkan:
  //   LANGKAH a: const tombol = event.target.closest('.tombol-batal');
  //              jika tombol tidak ada (!tombol), hentikan dengan return.
  //   LANGKAH b: ambil id ruangan dari tombol.dataset.id
  //   LANGKAH c: (opsional) minta konfirmasi dengan confirm('Yakin ...?')
  //   LANGKAH d: jika batalkanPinjaman(id) bernilai true:
  //                tampilkanPesan('Peminjaman berhasil dibatalkan.', 'sukses');
  //                perbaruiTampilan();
  const tombol = event.target.closest(".tombol-batal");
  if (!tombol) return;
  const idRuangan = tombol.dataset.id;

  if (batalkanPinjaman(idRuangan) === true) {
    tampilkanPesan("Peminjaman berhasil dibatalkan", "sukses");
    perbaruiTampilan();
  }
});

// =====================================================================
// LANGKAH 5: TAMPILAN AWAL (sudah jadi)
// =====================================================================
perbaruiTampilan();
