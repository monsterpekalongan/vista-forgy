// KOA humor lines — dry, deadpan, timeless engineering humor
export type HumorTrigger =
  | 'benar-cepat'
  | 'benar-normal'
  | 'benar-lambat'
  | 'salah'
  | 'salah-beruntun2'
  | 'streak3'
  | 'streak7'
  | 'streak30'
  | 'boss-lulus'
  | 'boss-gagal'
  | 'promosi-lulus'
  | 'promosi-gagal'
  | 'kembali-absen'
  | 'sesi-selesai'
  | 'serius-on'
  | 'serius-off'
  | 'malam'
  | 'pagi';

export interface HumorLine {
  trigger: HumorTrigger;
  text: string;
}

export const HUMOR_LINES: HumorLine[] = [
  // benar-cepat
  { trigger: 'benar-cepat', text: 'Kecepatan yang bertanggung jawab. KOA terkesan. Sedikit.' },
  { trigger: 'benar-cepat', text: 'Presisi pabrik grade A. Lanjut.' },
  { trigger: 'benar-cepat', text: 'KOA mencatat waktu itu. Dengan hormat.' },
  { trigger: 'benar-cepat', text: 'Di bawah targetMs. Mesin menyetujui.' },

  // benar-normal
  { trigger: 'benar-normal', text: 'Benar. Mesin terus berjalan.' },
  { trigger: 'benar-normal', text: 'Tercatat. Dengan baik.' },
  { trigger: 'benar-normal', text: 'Sistem stabil. KOA mengangguk dalam batin.' },
  { trigger: 'benar-normal', text: 'Output: satu jawaban benar. Input diterima.' },

  // benar-lambat
  { trigger: 'benar-lambat', text: 'Benar. Lambat. Tapi benar. Pabrik menoleransi ini.' },
  { trigger: 'benar-lambat', text: 'Kalkulasi mencapai target. Dengan jalan memutar.' },
  { trigger: 'benar-lambat', text: 'KOA tidak komentar soal waktu. KOA hanya... mencatatnya.' },

  // salah
  { trigger: 'salah', text: 'λ kedatangan naik. KOA tetap tenang. KOA selalu tenang.' },
  { trigger: 'salah', text: 'Error tercatat. Bukan gagal. Data.' },
  { trigger: 'salah', text: 'Satu cacat terdeteksi. QC tidak panik. Kamu juga jangan.' },
  { trigger: 'salah', text: 'Output tidak sesuai spesifikasi. Analisis pembahasan dulu.' },

  // salah-beruntun2
  { trigger: 'salah-beruntun2', text: 'Dua kali. Bukan pola. Semoga.' },
  { trigger: 'salah-beruntun2', text: 'KOA menahan komentar. KOA gagal menahannya: cek soalnya sekali lagi.' },
  { trigger: 'salah-beruntun2', text: 'Dua data point sudah cukup untuk menyimpulkan: perlu review konsep.' },

  // streak3
  { trigger: 'streak3', text: 'Tiga beruntun. Gear mulai hangat.' },
  { trigger: 'streak3', text: 'Tiga benar. Sistem mulai menemukan ritmenya.' },

  // streak7
  { trigger: 'streak7', text: 'Tujuh hari. Mesin ini butuh perawatan. Otakmu tampaknya tidak.' },
  { trigger: 'streak7', text: 'Satu minggu penuh. KOA mendefinisikan ulang "konsisten".' },

  // streak30
  { trigger: 'streak30', text: 'Sebulan. KOA mempertimbangkan memberi kamu nama panggilan. Nanti.' },
  { trigger: 'streak30', text: '30 hari. Di pabrik, ini disebut "standar operasional yang berhasil dipertahankan".' },

  // boss-lulus
  { trigger: 'boss-lulus', text: 'Boss tumbang. KOA memperbarui catatan produksi.' },
  { trigger: 'boss-lulus', text: 'Misi selesai. KOA merayakan dengan diam yang bermakna.' },

  // boss-gagal
  { trigger: 'boss-gagal', text: 'Ujian gagal. Cooldown 48 jam. KOA pakai waktu itu untuk... tidak apa-apa.' },
  { trigger: 'boss-gagal', text: 'Skor 84,9%. KOA tidak bercanda soal ambang 85%. Coba lagi setelah cooldown.' },

  // promosi-lulus
  { trigger: 'promosi-lulus', text: 'Tier naik. Selamat, Forge-er. KOA menyalakan lampu pabrik.' },
  { trigger: 'promosi-lulus', text: 'Promosi diberikan. Berdasarkan data, bukan senioritas.' },

  // promosi-gagal
  { trigger: 'promosi-gagal', text: 'Gerbang masih terkunci. Syaratnya jelas. KOA percaya kamu bisa baca checklist.' },
  { trigger: 'promosi-gagal', text: 'Belum cukup. Bukan penghakiman. Hanya kalkulasi.' },

  // kembali-absen
  { trigger: 'kembali-absen', text: 'KOA tidak menghitung hari. KOA hanya... mencatatnya.' },
  { trigger: 'kembali-absen', text: 'Sistem standby. Selamat datang kembali di lantai produksi.' },
  { trigger: 'kembali-absen', text: 'Absen terdeteksi. Tidak ada penalti. Hanya data yang perlu diperbarui.' },

  // sesi-selesai
  { trigger: 'sesi-selesai', text: 'Sesi selesai. Otak sudah diangkat beban hari ini.' },
  { trigger: 'sesi-selesai', text: 'Sesi tuntas. KOA menutup shift dengan rapi.' },
  { trigger: 'sesi-selesai', text: 'Produksi hari ini: selesai. Kualitas: dievaluasi.' },

  // serius-on
  { trigger: 'serius-on', text: 'Serius Mode aktif. KOA diam.' },

  // serius-off
  { trigger: 'serius-off', text: 'Serius Mode nonaktif. KOA kembali. Secara terbatas.' },

  // malam
  { trigger: 'malam', text: 'Shift malam. KOA tetap bekerja. KOA tidak tidur.' },
  { trigger: 'malam', text: 'Pukul ini kamu masih buka Vista Forgy. KOA tidak berkomentar.' },

  // pagi
  { trigger: 'pagi', text: 'Pagi. Pabrik dingin dan siap.' },
  { trigger: 'pagi', text: 'Shift pagi dimulai. Kapasitas otak: penuh.' },
];

export function getHumorLine(trigger: HumorTrigger, used: Set<string> = new Set()): string | null {
  const available = HUMOR_LINES.filter(l => l.trigger === trigger && !used.has(l.text));
  if (available.length === 0) return null;
  const idx = Math.floor(Math.random() * available.length);
  return available[idx].text;
}

export function getTimeBasedTrigger(): HumorTrigger {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) return 'malam';
  if (hour >= 5 && hour < 10) return 'pagi';
  return 'benar-normal'; // neutral during day
}
