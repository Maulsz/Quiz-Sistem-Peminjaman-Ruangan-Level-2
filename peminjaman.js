/* =====================================================================
 * LEVEL 2 — SEDANG  |  TUGAS 3  |  BERKAS: peminjaman.js
 * ---------------------------------------------------------------------
 * TUGAS BERKAS INI : Mengelola STATE peminjaman memakai struktur data Map.
 *
 * CARA MENGERJAKAN :
 *   1. Tulis isi setiap fungsi mengikuti TODO 3.1 - 3.6.
 *   2. Simpan, lalu jalankan:  npm run uji
 *   3. Target bagian "TUGAS 3 — peminjaman.js": Skor bagian 18/18.
 *
 * ATURAN :
 *   - DILARANG memakai document, alert, atau innerHTML di sini.
 *   - Fungsi cukup MENGEMBALIKAN hasil (return). main.js yang menampilkan.
 *
 * CONTEKAN METHOD Map:
 *   .set(kunci, nilai)  simpan data        .has(kunci)  cek ada? (true/false)
 *   .delete(kunci)      hapus (true/false) .size        jumlah data
 *   .values()           semua nilai        .clear()     hapus semua
 * ===================================================================== */

// Sudah jadi: mengambil cekKapasitas dari helper.js (hubungan antar-modul).
import { cekKapasitas } from "./helper.js";

// Sudah jadi: STATE. kunci = id ruangan, nilai = data peminjaman.
// CATATAN: Sengaja TIDAK di-export agar hanya bisa diubah lewat fungsi di bawah.
const daftarPinjaman = new Map();

/**
 * Mencatat peminjaman baru.
 * @returns {{berhasil: boolean, pesan: string}}
 */
export function pinjamRuangan(ruangan, namaPeminjam, jumlahOrang, durasiJam) {
  // VALIDASI 1 (CONTOH, sudah jadi): ruangan harus ada.
  // Perhatikan bentuk return-nya. Tiru bentuk ini untuk validasi lainnya.
  if (!ruangan) {
    return {
      berhasil: false,
      pesan: "Ruangan belum dipilih atau tidak ditemukan.",
    };
  } else if (daftarPinjaman.has(ruangan.id)) {
    return {
      berhasil: false,
      pesan: `${ruangan.namaRuangan} sedang dipinjam.`,
    };
  } else if (!namaPeminjam || namaPeminjam.trim() === "") {
    return {
      berhasil: false,
      pesan: "Nama peminjam wajib diisi.",
    };
  } else if (!cekKapasitas(jumlahOrang, ruangan.kapasitas)) {
    return {
      berhasil: false,
      pesan: `Jumlah orang harus 1 sampai ${ruangan.kapasitas}.`,
    };
  } else if (!Number.isFinite(durasiJam) || durasiJam <= 0) {
    return {
      berhasil: false,
      pesan: "Durasi harus lebih dari 0 jam.",
    };
  }

  daftarPinjaman.set(ruangan.id, {
    idRuangan: ruangan.id,
    namaRuangan: ruangan.namaRuangan,
    namaPeminjam: namaPeminjam.trim(),
    jumlahOrang: jumlahOrang,
    durasiJam: durasiJam,
  });

  return {
    berhasil: true,
    pesan: `${ruangan.namaRuangan} berhasil di pinjam oleh ${namaPeminjam}`,
  };

  // TODO 3.1 : Lanjutkan validasi berikut. Setiap validasi yang GAGAL
  //            harus langsung return { berhasil: false, pesan: '...' }.
  //
  // VALIDASI 2: Ruangan sedang dipinjam?
  //             Syarat: daftarPinjaman.has(ruangan.id)
  //             Pesan : `${ruangan.namaRuangan} sedang dipinjam.`
  //
  // VALIDASI 3: Nama peminjam kosong?
  //             Syarat: !namaPeminjam || namaPeminjam.trim() === ''
  //             Pesan : 'Nama peminjam wajib diisi.'
  //
  // VALIDASI 4: Jumlah orang tidak muat?
  //             Syarat: !cekKapasitas(jumlahOrang, ruangan.kapasitas)
  //             Pesan : `Jumlah orang harus 1 sampai ${ruangan.kapasitas}.`
  //
  // VALIDASI 5: Durasi tidak valid?
  //             Syarat: !Number.isFinite(durasiJam) || durasiJam <= 0
  //             Pesan : 'Durasi harus lebih dari 0 jam.'

  // TODO 3.2 : Jika semua validasi lolos, SIMPAN ke Map:
  //             daftarPinjaman.set(ruangan.id, { ...data... })
  //            Isi objek data dengan 5 properti:
  //             idRuangan    -> ruangan.id
  //             namaRuangan  -> ruangan.namaRuangan
  //             namaPeminjam -> namaPeminjam.trim()   (buang spasi berlebih)
  //             jumlahOrang  -> jumlahOrang
  //             durasiJam    -> durasiJam
  //
  //            Lalu return { berhasil: true, pesan: '... berhasil dipinjam ...' }
}

/** Membatalkan peminjaman. Return true jika berhasil, false jika tidak ada. */
export function batalkanPinjaman(idRuangan) {
  // TODO 3.3 : Hapus data dengan .delete() dan langsung return hasilnya.
  //   CATATAN : .delete() sudah mengembalikan true/false, tidak perlu if.
  return daftarPinjaman.delete(idRuangan);
}

/** Menghitung jumlah ruangan yang sedang dipinjam. */
export function hitungTotalDipinjam() {
  // TODO 3.4 : Return jumlah data di Map (properti .size).

  return daftarPinjaman.size;
}

/** Mengecek apakah ruangan sedang dipinjam. Return true/false. */
export function sedangDipinjam(idRuangan) {
  // TODO 3.5 : Return hasil pengecekan .has(idRuangan).
  return daftarPinjaman.has(idRuangan);
}

/** Mengambil semua data peminjaman dalam bentuk ARRAY. */
export function ambilDaftarPinjaman() {
  // TODO 3.6 : Return Array.from(daftarPinjaman.values())
  //   CATATAN : Map diubah ke array agar mudah di-forEach menjadi baris tabel.
  return Array.from(daftarPinjaman.values());
}

/** (Sudah jadi) Menghapus semua data. Dipakai oleh uji-logika.mjs. */
export function resetPinjaman() {
  daftarPinjaman.clear();
}
