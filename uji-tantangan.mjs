/* =====================================================================
 * BERKAS : uji-tantangan.mjs
 * TUGAS  : Menguji fungsi TANTANGAN cariRuanganCocok() di helper.js.
 *
 * CARA MENJALANKAN :  npm run uji:tantangan
 * TARGET           :  SKOR TANTANGAN 10/10
 *
 * ⚠️  SISWA TIDAK PERLU MENGUBAH BERKAS INI.
 * CATATAN: Jalankan juga  npm run uji  untuk memastikan 32 tes lama
 *          tetap lulus setelah kamu menambah fitur baru.
 * ===================================================================== */

let lulus = 0;
let total = 0;

function tampil(nilai) {
  return typeof nilai === "string" ? `'${nilai}'` : String(nilai);
}

function uji(deskripsi, fungsiHasil, harapan, petunjuk) {
  total++;
  try {
    const hasil = fungsiHasil();
    if (hasil === harapan) {
      console.log(`  ✅ ${deskripsi}`);
      lulus++;
      return;
    }
    console.log(`  ❌ ${deskripsi}`);
    console.log(
      `     ↳ diharapkan: ${tampil(harapan)}, didapat: ${tampil(hasil)}`,
    );
  } catch (galat) {
    console.log(`  ❌ ${deskripsi}`);
    console.log(`     ↳ error: ${galat.message}`);
  }
  if (petunjuk) console.log(`     ↳ petunjuk: ${petunjuk}`);
}

// Memuat helper.js dengan aman.
let modulHelper = {};
try {
  modulHelper = await import("./helper.js");
} catch (galat) {
  console.log(`⚠️  helper.js GAGAL DIMUAT: ${galat.message}`);
}

function cariRuanganCocok(...argumen) {
  if (typeof modulHelper.cariRuanganCocok !== "function") {
    throw new Error(
      "fungsi cariRuanganCocok() belum dibuat atau belum di-export di helper.js",
    );
  }
  return modulHelper.cariRuanganCocok(...argumen);
}

// Mengubah hasil (array ruangan) menjadi teks id, contoh: 'D,A,B'.
function daftarId(hasil) {
  if (!Array.isArray(hasil)) {
    throw new Error(
      `cariRuanganCocok() harus me-return array, tetapi didapat ${tampil(hasil)}`,
    );
  }
  return hasil.map((ruangan) => ruangan.id).join(",");
}

// Data uji buatan sendiri (tidak bergantung pada data.js).
const ruanganUji = [
  {
    id: "A",
    namaRuangan: "Lab A",
    kapasitas: 36,
    fasilitas: ["PC", "Proyektor", "AC"],
  },
  {
    id: "B",
    namaRuangan: "Aula B",
    kapasitas: 150,
    fasilitas: ["Sound System", "Proyektor"],
  },
  {
    id: "C",
    namaRuangan: "Rapat C",
    kapasitas: 20,
    fasilitas: ["Meja Rapat", "Smart TV", "AC"],
  },
  {
    id: "D",
    namaRuangan: "Kelas D",
    kapasitas: 32,
    fasilitas: ["Papan Tulis"],
  },
];

console.log("========================================");
console.log(" UJI TANTANGAN — CARI RUANGAN YANG COCOK");
console.log("========================================\n");

uji(
  "cariRuanganCocok() sudah di-export dari helper.js",
  () => typeof modulHelper.cariRuanganCocok,
  "function",
  "Tulis: export function cariRuanganCocok(daftar, jumlahOrang, kataFasilitas = '') { ... }",
);

uji(
  "hasilnya selalu berupa array",
  () => Array.isArray(cariRuanganCocok(ruanganUji, 10)),
  true,
  "Gunakan daftar.filter(...), karena filter selalu menghasilkan array.",
);

uji(
  "10 orang tanpa fasilitas -> semua ruangan, kapasitas terkecil dulu",
  () => daftarId(cariRuanganCocok(ruanganUji, 10)),
  "C,D,A,B",
  "Urutkan dengan .sort((a, b) => a.kapasitas - b.kapasitas).",
);

uji(
  "30 orang -> hanya ruangan yang muat (D, A, B)",
  () => daftarId(cariRuanganCocok(ruanganUji, 30)),
  "D,A,B",
  "Saring dengan cekKapasitas(jumlahOrang, ruangan.kapasitas).",
);

uji(
  "36 orang -> ruangan berkapasitas pas 36 ikut tampil",
  () => daftarId(cariRuanganCocok(ruanganUji, 36)),
  "A,B",
);

uji(
  "200 orang -> tidak ada ruangan (array kosong)",
  () => daftarId(cariRuanganCocok(ruanganUji, 200)),
  "",
);

uji(
  "0 orang -> tidak ada ruangan (jumlah tidak valid)",
  () => daftarId(cariRuanganCocok(ruanganUji, 0)),
  "",
  "cekKapasitas() sudah menolak jumlah 0, jadi cukup pakai fungsi itu.",
);

uji(
  "fasilitas 'ac' (huruf kecil) -> C, A",
  () => daftarId(cariRuanganCocok(ruanganUji, 10, "ac")),
  "C,A",
  "Bandingkan dalam huruf kecil: fasilitas.toLowerCase().includes(kata)",
);

uji(
  "fasilitas '  Proyektor ' (ada spasi) -> A, B",
  () => daftarId(cariRuanganCocok(ruanganUji, 10, "  Proyektor ")),
  "A,B",
  "Buang spasi kata kunci dengan .trim() sebelum dibandingkan.",
);

uji(
  "urutan array asli TIDAK berubah (fungsi murni)",
  () => {
    cariRuanganCocok(ruanganUji, 10);
    return daftarId(ruanganUji);
  },
  "A,B,C,D",
  "Jangan memanggil .sort() langsung pada daftar asli. Panggil sesudah .filter().",
);

console.log("\n========================================");
console.log(` SKOR TANTANGAN: ${lulus}/${total}`);
console.log("========================================");
console.log(
  lulus === total
    ? "🏆 Tantangan selesai! Coba fiturnya di browser dengan Live Server."
    : "👉 Perbaiki baris ❌ dari atas, simpan, lalu jalankan lagi: npm run uji:tantangan",
);
