/* =====================================================================
 * BERKAS : uji-logika.mjs
 * TUGAS  : Menguji LOGIKA aplikasi secara otomatis di terminal.
 *
 * CARA MENJALANKAN (terminal VS Code, di dalam folder proyek):
 *     npm run uji
 *
 * CARA MEMBACA HASIL:
 *     ✅  bagian ini sudah benar
 *     ❌  belum benar. Baca baris "↳" di bawahnya:
 *           diharapkan = hasil yang BENAR
 *           didapat    = hasil dari KODEMU
 *           petunjuk   = saran perbaikan
 *
 * ⚠️  SISWA TIDAK PERLU MENGUBAH BERKAS INI.
 *     Yang diubah adalah data.js, helper.js, dan peminjaman.js
 *     sampai SKOR AKHIR menjadi 32/32.
 *
 * CATATAN:
 *  - Berkas ini dijalankan oleh Node.js, BUKAN browser. Di Node.js tidak ada
 *    `document`, sehingga kode DOM di luar main.js akan ketahuan.
 *  - main.js tidak dites di sini. main.js diperiksa langsung di browser
 *    memakai "Daftar Periksa Tampilan" pada modul praktikum.
 * ===================================================================== */

import { readFileSync } from 'node:fs';

// =====================================================================
// BAGIAN A: ALAT UJI (tidak perlu dipahami seluruhnya)
// =====================================================================
const skorAkhir = { lulus: 0, total: 0 };
let skorBagian = { lulus: 0, total: 0 };

// Menampilkan nilai agar mudah dibaca (teks diberi tanda kutip).
function tampil(nilai) {
  return typeof nilai === 'string' ? `'${nilai}'` : String(nilai);
}

// uji(deskripsi, fungsiHasil, harapan, petunjuk)
// -> Menjalankan fungsiHasil(), lalu membandingkan hasilnya dengan harapan (===).
// -> Jika kodemu error, error-nya ditangkap agar tes lain tetap berjalan.
function uji(deskripsi, fungsiHasil, harapan, petunjuk) {
  skorAkhir.total++;
  skorBagian.total++;
  try {
    const hasil = fungsiHasil();
    if (hasil === harapan) {
      console.log(`  ✅ ${deskripsi}`);
      skorAkhir.lulus++;
      skorBagian.lulus++;
      return;
    }
    console.log(`  ❌ ${deskripsi}`);
    console.log(`     ↳ diharapkan: ${tampil(harapan)}, didapat: ${tampil(hasil)}`);
  } catch (galat) {
    console.log(`  ❌ ${deskripsi}`);
    console.log(`     ↳ error: ${galat.message}`);
    if (galat.tanpaPetunjuk) return; // pesan error sudah cukup jelas
  }
  if (petunjuk) {
    console.log(`     ↳ petunjuk: ${petunjuk}`);
  }
}

function mulaiBagian(judul) {
  skorBagian = { lulus: 0, total: 0 };
  console.log(`\n${judul}`);
}

function tutupBagian() {
  console.log(`     Skor bagian ini: ${skorBagian.lulus}/${skorBagian.total}`);
}

// Memuat modul. Jika ada salah ketik (kurung/koma/kutip), tampilkan pesan
// yang jelas lalu lanjutkan, agar modul lain tetap bisa dites.
async function muat(berkas) {
  try {
    return await import(berkas);
  } catch (galat) {
    console.log(`\n⚠️  ${berkas} GAGAL DIMUAT: ${galat.message}`);
    console.log(`    Periksa salah ketik di ${berkas} (kurung, koma, tanda kutip, kurawal).`);
    return {};
  }
}

// Membuat error yang pesannya sudah jelas, sehingga petunjuk tidak perlu ditampilkan.
function galatTanpaPetunjuk(pesan) {
  const galat = new Error(pesan);
  galat.tanpaPetunjuk = true;
  return galat;
}

// Mengambil fungsi dari modul. Jika belum dibuat/di-export, tes akan
// menampilkan pesan yang mudah dipahami (bukan error yang membingungkan).
function ambilFungsi(modul, nama, berkas) {
  if (typeof modul[nama] === 'function') {
    return modul[nama];
  }
  return () => {
    throw galatTanpaPetunjuk(`fungsi ${nama}() belum dibuat atau belum di-export di ${berkas}`);
  };
}

// Mengecek apakah sebuah berkas memakai kode DOM (komentar diabaikan).
function bebasDOM(berkas) {
  const kode = readFileSync(new URL(berkas, import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '') // buang komentar /* ... */
    .replace(/\/\/.*$/gm, '');        // buang komentar // ...
  return !/\b(document|window|alert|querySelector|innerHTML|addEventListener)\b/.test(kode);
}

// =====================================================================
// BAGIAN B: MEMUAT MODUL SISWA
// =====================================================================
const modulData = await muat('./data.js');
const modulHelper = await muat('./helper.js');
const modulPeminjaman = await muat('./peminjaman.js');

const daftarRuangan = modulData.daftarRuangan;
const formatDurasi = ambilFungsi(modulHelper, 'formatDurasi', 'helper.js');
const cekKapasitas = ambilFungsi(modulHelper, 'cekKapasitas', 'helper.js');
const pinjamRuangan = ambilFungsi(modulPeminjaman, 'pinjamRuangan', 'peminjaman.js');
const batalkanPinjaman = ambilFungsi(modulPeminjaman, 'batalkanPinjaman', 'peminjaman.js');
const hitungTotalDipinjam = ambilFungsi(modulPeminjaman, 'hitungTotalDipinjam', 'peminjaman.js');
const sedangDipinjam = ambilFungsi(modulPeminjaman, 'sedangDipinjam', 'peminjaman.js');
const ambilDaftarPinjaman = ambilFungsi(modulPeminjaman, 'ambilDaftarPinjaman', 'peminjaman.js');
const resetPinjaman = ambilFungsi(modulPeminjaman, 'resetPinjaman', 'peminjaman.js');

console.log('========================================');
console.log(' UJI LOGIKA — SISTEM PEMINJAMAN RUANGAN');
console.log('========================================');

// =====================================================================
// TUGAS 1: data.js (5 tes)
// =====================================================================
mulaiBagian('📦 TUGAS 1 — data.js');

uji('daftarRuangan sudah di-export dan berupa array',
  () => Array.isArray(daftarRuangan), true,
  'Tulis: export const daftarRuangan = [ ... ];');

// Menghentikan tes data jika daftarRuangan belum ada atau masih kosong.
function pastikanAdaRuangan() {
  if (!Array.isArray(daftarRuangan) || daftarRuangan.length === 0) {
    throw galatTanpaPetunjuk('daftarRuangan belum di-export atau masih kosong');
  }
}

uji('daftarRuangan berisi minimal 4 ruangan',
  () => {
    pastikanAdaRuangan();
    return daftarRuangan.length >= 4 ? true : `baru ${daftarRuangan.length} ruangan`;
  },
  true,
  'Tambahkan objek ruangan sampai jumlahnya minimal 4.');

uji('setiap ruangan punya id, namaRuangan, kapasitas (angka > 0), fasilitas (array)',
  () => {
    pastikanAdaRuangan();
    return daftarRuangan.every((ruangan) =>
      typeof ruangan.id === 'string' &&
      typeof ruangan.namaRuangan === 'string' &&
      typeof ruangan.kapasitas === 'number' && ruangan.kapasitas > 0 &&
      Array.isArray(ruangan.fasilitas));
  },
  true,
  'Periksa ejaan nama properti (huruf besar/kecil) dan tulis kapasitas TANPA tanda kutip.');

uji('id setiap ruangan unik (tidak ada yang kembar)',
  () => {
    pastikanAdaRuangan();
    return new Set(daftarRuangan.map((ruangan) => ruangan.id)).size === daftarRuangan.length;
  },
  true,
  'Ada id yang kembar. Buat berbeda, misalnya R01, R02, R03, R04.');

uji('data.js tidak memakai kode DOM',
  () => bebasDOM('./data.js'), true,
  'Hapus document/alert/innerHTML dari data.js. Kode DOM hanya boleh di main.js.');

tutupBagian();

// =====================================================================
// TUGAS 2: helper.js (9 tes)
// =====================================================================
mulaiBagian('🧰 TUGAS 2 — helper.js');

uji("formatDurasi(2) -> '2 jam'",
  () => formatDurasi(2), '2 jam');
uji("formatDurasi(1.5) -> '1 jam 30 menit'",
  () => formatDurasi(1.5), '1 jam 30 menit',
  '1.5 jam = 90 menit = 1 jam (90 / 60 dibulatkan ke bawah) sisa 30 menit (90 % 60).');
uji("formatDurasi(0.5) -> '30 menit'",
  () => formatDurasi(0.5), '30 menit',
  'Jika jamPenuh bernilai 0, tampilkan menitnya saja.');
uji("formatDurasi(0) -> 'Durasi tidak valid'",
  () => formatDurasi(0), 'Durasi tidak valid',
  'Cek dulu di awal fungsi: jika jam <= 0, langsung return teks ini.');

uji('cekKapasitas(30, 36) -> true (muat)',
  () => cekKapasitas(30, 36), true);
uji('cekKapasitas(36, 36) -> true (pas)',
  () => cekKapasitas(36, 36), true,
  'Gunakan <= (kurang dari ATAU sama dengan), bukan <.');
uji('cekKapasitas(40, 36) -> false (melebihi)',
  () => cekKapasitas(40, 36), false);
uji('cekKapasitas(0, 36) -> false (minimal 1 orang)',
  () => cekKapasitas(0, 36), false,
  'Jumlah orang juga harus lebih dari 0. Gabungkan dua syarat dengan &&.');

uji('helper.js tidak memakai kode DOM',
  () => bebasDOM('./helper.js'), true,
  'Fungsi murni tidak boleh menyentuh DOM. Cukup return hasilnya.');

tutupBagian();

// =====================================================================
// TUGAS 3: peminjaman.js (18 tes)
// CATATAN: Tes ini memakai ruangan buatan sendiri (bukan dari data.js),
//          jadi Tugas 3 tetap bisa dites walaupun Tugas 1 belum selesai.
// =====================================================================
mulaiBagian('🗂️  TUGAS 3 — peminjaman.js');

const ruangA = { id: 'UJI-A', namaRuangan: 'Ruang Uji A', kapasitas: 20, fasilitas: [] };
const ruangB = { id: 'UJI-B', namaRuangan: 'Ruang Uji B', kapasitas: 10, fasilitas: [] };
let hasilPinjamA;

// Memanggil pinjamRuangan() dan memastikan hasilnya berupa objek.
function pinjam(ruangan, nama, jumlah, durasi) {
  const hasil = pinjamRuangan(ruangan, nama, jumlah, durasi);
  if (typeof hasil !== 'object' || hasil === null) {
    throw new Error(`pinjamRuangan() harus me-return objek { berhasil, pesan }, tetapi didapat ${tampil(hasil)}`);
  }
  return hasil;
}

// Mengambil data pertama dari ambilDaftarPinjaman() dengan aman.
function dataPertama() {
  const daftar = ambilDaftarPinjaman();
  if (!Array.isArray(daftar) || daftar.length === 0) {
    throw galatTanpaPetunjuk('ambilDaftarPinjaman() belum me-return array berisi data');
  }
  return daftar[0];
}

uji('awalnya hitungTotalDipinjam() bernilai 0',
  () => hitungTotalDipinjam(), 0,
  'Kembalikan daftarPinjaman.size');

uji('pinjamRuangan() dengan data benar -> berhasil: true',
  () => {
    hasilPinjamA = pinjam(ruangA, '  Budi  ', 15, 2);
    return hasilPinjamA.berhasil;
  },
  true,
  'Pastikan fungsi mengembalikan objek { berhasil: true, pesan: "..." } setelah menyimpan.');

uji('pinjamRuangan() mengembalikan pesan berupa teks',
  () => {
    if (!hasilPinjamA) throw galatTanpaPetunjuk('perbaiki dulu tes di atas (pinjamRuangan belum me-return objek)');
    return typeof hasilPinjamA.pesan === 'string' && hasilPinjamA.pesan.length > 0;
  },
  true,
  'Objek hasil harus punya properti pesan berisi teks.');

uji('setelah meminjam, hitungTotalDipinjam() bernilai 1',
  () => hitungTotalDipinjam(), 1,
  'Simpan data dengan daftarPinjaman.set(ruangan.id, { ... }).');

uji("sedangDipinjam('UJI-A') -> true",
  () => sedangDipinjam('UJI-A'), true,
  'Kembalikan daftarPinjaman.has(idRuangan)');

uji('ambilDaftarPinjaman() mengembalikan array berisi 1 data',
  () => {
    const daftar = ambilDaftarPinjaman();
    return Array.isArray(daftar) && daftar.length === 1;
  },
  true,
  'Kembalikan Array.from(daftarPinjaman.values())');

uji("nama disimpan tanpa spasi berlebih ('  Budi  ' -> 'Budi')",
  () => dataPertama().namaPeminjam, 'Budi',
  'Simpan namaPeminjam.trim(), bukan namaPeminjam.');

uji('meminjam ruangan yang SAMA lagi -> berhasil: false',
  () => pinjam(ruangA, 'Siti', 5, 1).berhasil, false,
  'Sebelum menyimpan, cek dengan daftarPinjaman.has(ruangan.id).');

uji('ruangan tidak dipilih (undefined) -> berhasil: false',
  () => pinjam(undefined, 'Siti', 5, 1).berhasil, false,
  'Cek "if (!ruangan)" PALING AWAL, sebelum memakai ruangan.id.');

uji('nama peminjam kosong / hanya spasi -> berhasil: false',
  () => pinjam(ruangB, '   ', 5, 1).berhasil, false,
  'Gunakan namaPeminjam.trim() === "" untuk mendeteksi nama kosong.');

uji('jumlah orang melebihi kapasitas -> berhasil: false',
  () => pinjam(ruangB, 'Siti', 11, 1).berhasil, false,
  'Panggil cekKapasitas(jumlahOrang, ruangan.kapasitas) dari helper.js.');

uji('durasi 0 jam -> berhasil: false',
  () => pinjam(ruangB, 'Siti', 5, 0).berhasil, false,
  'Tolak durasi yang bukan angka atau <= 0.');

uji('peminjaman yang gagal tidak ikut tersimpan (total tetap 1)',
  () => hitungTotalDipinjam(), 1,
  'Setiap validasi yang gagal harus langsung return SEBELUM daftarPinjaman.set().');

uji("batalkanPinjaman('UJI-A') -> true",
  () => batalkanPinjaman('UJI-A'), true,
  'Kembalikan daftarPinjaman.delete(idRuangan)');

uji('setelah dibatalkan, total kembali 0',
  () => hitungTotalDipinjam(), 0);

uji('membatalkan ruangan yang tidak dipinjam -> false',
  () => batalkanPinjaman('TIDAK-ADA'), false);

uji("resetPinjaman() mengosongkan semua data (2 -> 0)",
  () => {
    pinjam(ruangA, 'Budi', 5, 1);
    pinjam(ruangB, 'Siti', 5, 1);
    const sebelum = hitungTotalDipinjam();
    resetPinjaman();
    return `${sebelum} -> ${hitungTotalDipinjam()}`;
  },
  '2 -> 0',
  'resetPinjaman() cukup berisi daftarPinjaman.clear()');

uji('peminjaman.js tidak memakai kode DOM',
  () => bebasDOM('./peminjaman.js'), true,
  'Jangan pakai alert()/document. Kembalikan { berhasil, pesan }, biar main.js yang menampilkan.');

tutupBagian();

// =====================================================================
// RINGKASAN
// =====================================================================
const persen = Math.round((skorAkhir.lulus / skorAkhir.total) * 100);
const panjangBar = 20;
const terisi = Math.round((skorAkhir.lulus / skorAkhir.total) * panjangBar);
const bar = '█'.repeat(terisi) + '░'.repeat(panjangBar - terisi);

console.log('\n========================================');
console.log(` SKOR AKHIR: ${skorAkhir.lulus}/${skorAkhir.total} tes lulus (${persen}%)`);
console.log(` [${bar}]`);
console.log('========================================');

if (skorAkhir.lulus === skorAkhir.total) {
  console.log('🎉 Semua tes lulus! Lanjutkan ke main.js, lalu cek di browser');
  console.log('   dengan Daftar Periksa Tampilan pada modul.');
} else {
  console.log('👉 Perbaiki baris ❌ dari ATAS ke bawah, satu per satu.');
  console.log('   Simpan berkas (Ctrl+S), lalu jalankan lagi: npm run uji');
}
