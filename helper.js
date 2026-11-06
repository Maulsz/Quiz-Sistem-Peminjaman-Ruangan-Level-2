/* =====================================================================
 * LEVEL 2 — SEDANG  |  TUGAS 2  |  BERKAS: helper.js
 * ---------------------------------------------------------------------
 * TUGAS BERKAS INI : Kumpulan FUNGSI MURNI (pure function) pembantu.
 *
 * CARA MENGERJAKAN :
 *   1. Nama fungsi dan parameternya sudah disediakan.
 *   2. Tulis ISI fungsi mengikuti LANGKAH di dalam komentar TODO.
 *   3. Simpan, lalu jalankan:  npm run uji
 *   4. Target bagian "TUGAS 2 — helper.js": Skor bagian 9/9.
 *
 * FUNGSI MURNI :
 *   - Input sama -> hasil (return) selalu sama.
 *   - Tidak mengubah variabel di luar dirinya, tidak menyentuh DOM.
 * ===================================================================== */

/**
 * Mengubah angka jam menjadi teks.
 *   formatDurasi(2)   -> '2 jam'
 *   formatDurasi(1.5) -> '1 jam 30 menit'
 *   formatDurasi(0.5) -> '30 menit'
 *   formatDurasi(0)   -> 'Durasi tidak valid'
 *
 * @param {number} jam
 * @returns {string}
 */
export function formatDurasi(jam) {
  // TODO 2.1 : Tulis isi fungsi ini mengikuti 4 langkah berikut.
  //
  // LANGKAH 1: Jika jam BUKAN angka yang valid ATAU jam <= 0,
  //            langsung return 'Durasi tidak valid'.
  //            Petunjuk syarat: !Number.isFinite(jam) || jam <= 0
  //
  // LANGKAH 2: Buat const totalMenit = jam dikali 60, lalu dibulatkan.
  //            Petunjuk: Math.round( ... )
  //
  // LANGKAH 3: Buat dua const:
  //            jamPenuh  = totalMenit / 60, dibulatkan KE BAWAH (Math.floor)
  //            sisaMenit = sisa bagi totalMenit dengan 60 (operator %)
  //
  // LANGKAH 4: Return teks sesuai kondisi (pakai template literal `${...}`):
  //            - jika jamPenuh === 0  -> `${sisaMenit} menit`
  //            - jika sisaMenit === 0 -> `${jamPenuh} jam`
  //            - selain itu           -> `${jamPenuh} jam ${sisaMenit} menit`
  if (!Number.isFinite(jam) || jam <= 0) {
    return "Durasi tidak valid";
  }

  const totalMenit = Math.round(jam * 60);

  const jamPenuh = Math.floor(totalMenit / 60);

  const sisaMenit = totalMenit % 60;

  if (jamPenuh === 0) {
    return `${sisaMenit} menit`;
  } else if (sisaMenit === 0) {
    return `${jamPenuh} jam`;
  } else {
    return `${jamPenuh} jam ${sisaMenit} menit`;
  }
}

/**
 * Mengecek apakah jumlah orang muat di ruangan.
 *   cekKapasitas(30, 36) -> true
 *   cekKapasitas(36, 36) -> true
 *   cekKapasitas(40, 36) -> false
 *   cekKapasitas(0, 36)  -> false
 *
 * @param {number} jumlahOrang
 * @param {number} kapasitasRuang
 * @returns {boolean}
 */
export function cekKapasitas(jumlahOrang, kapasitasRuang) {
  // TODO 2.2 : Return true jika jumlahOrang LEBIH DARI 0
  //            DAN jumlahOrang TIDAK MELEBIHI kapasitasRuang.
  //   POIN PENTING :
  //     - Cukup SATU baris return.
  //     - Gunakan operator > , <= , dan && .
  //     - Hasil perbandingan sudah berupa true/false, tidak perlu if-else.
  return jumlahOrang > 0 && jumlahOrang <= kapasitasRuang ? true : false;
}

// export function cariRuanganCocok(daftar, jumlahOrang, kataFasilitas = "") {
//   const hasilFilter = daftar.filter((ruangan) => {
//     // KUNCI UTAMA: Jika jumlahOrang kosong (string kosong), jangan filter kapasitas (artinya SEMUA lolos).
//     // Tapi jika jumlahOrang diisi, baru jalankan cekKapasitas.
//     const muat =
//       jumlahOrang === "" || jumlahOrang === undefined
//         ? true
//         : cekKapasitas(jumlahOrang, ruangan.kapasitas);

//     if (!muat) return false;

//     // Bersihkan keyword fasilitas dari spasi berlebih & ubah ke huruf kecil
//     const keyword = kataFasilitas.trim().toLowerCase();

//     // Jika keyword fasilitas kosong, berarti semua fasilitas cocok
//     if (keyword === "") return true;

//     // Cek apakah ada fasilitas ruangan yang mengandung kata kunci
//     const cocokFasilitas = ruangan.fasilitas.some((fasilitas) =>
//       fasilitas.toLowerCase().includes(keyword),
//     );

//     return cocokFasilitas;
//   });

//   // Urutkan dari kapasitas terkecil ke terbesar
//   return [...hasilFilter].sort((a, b) => a.kapasitas - b.kapasitas);
// }
// * Mengembalikan ARRAY BARU berisi ruangan yang:
// * 1. muat untuk jumlahOrang (memakai cekKapasitas di atas),
// * 2. memiliki fasilitas yang mengandung kataFasilitas
// * (tidak peka huruf besar/kecil, spasi di awal/akhir diabaikan;
// * jika kataFasilitas kosong, semua fasilitas dianggap cocok),
// * 3. diurutkan dari kapasitas TERKECIL, agar ruangan besar tidak
// * dipakai untuk kegiatan kecil.
// *
// * CATATAN: Tetap fungsi murni. filter() selalu membuat array baru,
// * sehingga sort() tidak mengubah urutan daftarRuangan aslinya.
// *
// * Contoh:
// * cariRuanganCocok(daftarRuangan, 30) -> ruangan berkapasitas >= 30
// * cariRuanganCocok(daftarRuangan, 10, 'ac') -> yang muat 10 orang DAN ada AC

export function cariRuanganCocok(daftar, jumlahOrang, kataFasilitas = "") {
  const kata = kataFasilitas.trim().toLowerCase();

  return daftar
    .filter((ruangan) => cekKapasitas(jumlahOrang, ruangan.kapasitas))
    .filter(
      (ruangan) =>
        kata === "" ||
        ruangan.fasilitas.some((fasilitas) =>
          fasilitas.toLowerCase().includes(kata),
        ),
    )
    .sort((a, b) => a.kapasitas - b.kapasitas);
}
