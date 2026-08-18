// Kartu Konsep — Bahasa Indonesia, KaTeX, standar buku teks Teknik Industri
export interface ConceptCard {
  skillId: string;
  title: string;
  definition: string;
  formula: string;  // KaTeX
  example: { problem: string; steps: string[]; answer: string };
  misconceptions: string[];
  whyItMatters: string;
}

export const CONCEPT_CARDS: ConceptCard[] = [
  // ── ARITMETIKA & PERSEN ───────────────────────────────────────────────────
  {
    skillId: 'ari.persen',
    title: 'Persen (Percentage)',
    definition: 'Persen berarti "per seratus". Nilai x% setara dengan pecahan x/100. Digunakan untuk menyatakan proporsi, perubahan, atau perbandingan relatif.',
    formula: '\\text{persen} = \\frac{\\text{bagian}}{\\text{total}} \\times 100\\%',
    example: {
      problem: 'Berapa 25% dari Rp400.000?',
      steps: ['25% = 25/100 = 0,25', '0,25 × 400.000 = 100.000'],
      answer: 'Rp100.000',
    },
    misconceptions: [
      'Miskonsepsi: "Persen kenaikan 20% lalu turun 20% = kembali ke harga awal". Salah! Naik 20% dari 100 = 120; turun 20% dari 120 = 96.',
      'Miskonsepsi: Mencampurkan basis. Pastikan selalu tahu "persen dari nilai yang mana?".',
    ],
    whyItMatters: 'Persen dipakai di mana-mana di industri: diskon, margin laba, efisiensi, tingkat cacat (defect rate), dan utilisasi mesin.',
  },
  {
    skillId: 'ari.rasio',
    title: 'Rasio dan Proporsi (Ratio & Proportion)',
    definition: 'Rasio membandingkan dua kuantitas atau lebih. Proporsi menyatakan kesamaan antara dua rasio. Jika rasio A:B adalah 2:3, maka total dibagi menjadi 5 bagian.',
    formula: '\\text{bagian A} = \\frac{A}{A + B} \\times \\text{total}',
    example: {
      problem: 'Bagi 500 unit bahan dalam rasio 2:3.',
      steps: ['Total bagian = 2 + 3 = 5', 'Satu bagian = 500 / 5 = 100', 'Bagian A = 2 × 100 = 200, Bagian B = 3 × 100 = 300'],
      answer: '200 unit dan 300 unit',
    },
    misconceptions: [
      'Miskonsepsi: Membagi total langsung dengan angka rasio tanpa menjumlahkan total bagian.',
    ],
    whyItMatters: 'Rasio menentukan formula campuran bahan baku, alokasi anggaran, dan rasio pekerja terhadap mesin.',
  },

  // ── ALJABAR ──────────────────────────────────────────────────────────────
  {
    skillId: 'alj.linear1',
    title: 'Persamaan Linear Satu Variabel',
    definition: 'Persamaan linear satu variabel berbentuk ax + b = c (a ≠ 0). Menyelesaikan persamaan berarti mengisolasi variabel x di satu sisi.',
    formula: 'ax + b = c \\implies x = \\frac{c - b}{a}',
    example: {
      problem: 'Selesaikan 3x + 7 = 22',
      steps: ['3x = 22 − 7 = 15', 'x = 15 / 3 = 5'],
      answer: 'x = 5',
    },
    misconceptions: [
      'Miskonsepsi: Lupa mengubah tanda saat memindahkan suku (+ jadi −, − jadi +).',
    ],
    whyItMatters: 'Persamaan linear adalah fondasi aljabar; digunakan untuk menghitung harga pokok dan titik impas.',
  },
  {
    skillId: 'alj2.kuadrat',
    title: 'Persamaan Kuadrat (Quadratic Equation)',
    definition: 'Persamaan kuadrat berbentuk ax² + bx + c = 0 (a ≠ 0). Akar-akarnya dapat dicari via pemfaktoran atau rumus kuadrat (ABC).',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    example: {
      problem: 'Cari akar dari x² − 5x + 6 = 0',
      steps: ['Faktorkan: (x−2)(x−3) = 0', 'Akar: x = 2 atau x = 3'],
      answer: 'x₁ = 2, x₂ = 3',
    },
    misconceptions: [
      'Miskonsepsi: Memfaktorkan sebelum memastikan ruas kanan bernilai 0.',
    ],
    whyItMatters: 'Persamaan kuadrat muncul dalam pemodelan kurva biaya, parabola lintasan, dan optimasi luas.',
  },

  // ── KALKULUS ─────────────────────────────────────────────────────────────
  {
    skillId: 'kald.power',
    title: 'Turunan — Aturan Pangkat (Power Rule)',
    definition: 'Turunan (derivative) mengukur laju perubahan sesaat: seberapa curam grafik di satu titik. Jika s(t) posisi, v(t) = s\'(t) adalah kecepatan.',
    formula: '\\frac{d}{dx}[x^n] = n \\cdot x^{n-1} \\quad \\text{dan} \\quad \\frac{d}{dx}[c] = 0',
    example: {
      problem: 'Tentukan f\'(x) untuk f(x) = 3x⁴ − 2x² + 7',
      steps: ['Turunkan 3x⁴ → 12x³', 'Turunkan −2x² → −4x', 'Konstanta 7 → 0'],
      answer: 'f\'(x) = 12x³ − 4x',
    },
    misconceptions: [
      'Miskonsepsi: Menulis nxⁿ (lupa mengurangkan pangkat dengan 1).',
      'Miskonsepsi: Menyimpan konstanta c alih-alih menurunkan jadi 0.',
    ],
    whyItMatters: 'Turunan adalah mesin di balik optimasi industri: meminimalkan biaya, memaksimalkan laba, dan mencari buffer persediaan optimal.',
  },
  {
    skillId: 'kald.chain',
    title: 'Aturan Rantai (Chain Rule)',
    definition: 'Aturan rantai digunakan untuk menurunkan fungsi komposisi f(g(x)). Turunan = turunan fungsi luar dikali turunan fungsi dalam.',
    formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    example: {
      problem: 'Tentukan turunan dari (3x + 2)⁴',
      steps: ['Fungsi luar: u⁴ → 4u³', 'Fungsi dalam: u = 3x + 2 → u\' = 3', 'Hasil = 4(3x + 2)³ × 3 = 12(3x + 2)³'],
      answer: '12(3x + 2)³',
    },
    misconceptions: [
      'Miskonsepsi: Lupa mengalikan dengan turunan fungsi di dalam kurung g\'(x).',
    ],
    whyItMatters: 'Digunakan saat memodelkan sistem kompleks bertingkat seperti laju reaksi kimia dan laju degradasi komponen.',
  },
  {
    skillId: 'kald.limit',
    title: 'Limit Fungsi (Limit of a Function)',
    definition: 'Limit menyatakan nilai yang didekati suatu fungsi saat variabelnya mendekati titik tertentu. Fondasi utama dari kalkulus.',
    formula: '\\lim_{x \\to a} f(x) = L',
    example: {
      problem: 'Hitung lim(x→3) (x² − 2x + 1)',
      steps: ['Polinomial kontinu → substitusi x = 3', 'f(3) = 9 − 6 + 1 = 4'],
      answer: '4',
    },
    misconceptions: [
      'Miskonsepsi: Langsung substitusi tanpa cek bentuk tak tentu 0/0 (bila 0/0, perlu faktorisasi atau L\'Hopital).',
    ],
    whyItMatters: 'Limit dipakai mendefinisikan laju sesaat, kontinuitas aliran produksi, dan batas stabil jaringan.',
  },

  // ── ALJABAR LINEAR ────────────────────────────────────────────────────────
  {
    skillId: 'lin.matrix-ops',
    title: 'Operasi Matriks (Matrix Operations)',
    definition: 'Matriks adalah susunan angka dalam baris dan kolom. Perkalian matriks A (m×n) dan B (n×p) menghasilkan C (m×p) dengan syarat kolom A = baris B.',
    formula: 'C_{ij} = \\sum_{k=1}^n A_{ik} B_{kj}',
    example: {
      problem: 'Kalikan [1, 2] dengan [3; 4]',
      steps: ['(1×3) + (2×4) = 3 + 8 = 11'],
      answer: '11',
    },
    misconceptions: [
      'Miskonsepsi: Mengalikan elemen seletak pada perkalian matriks (perkalian matriks BUKAN perkalian elemen seletak).',
    ],
    whyItMatters: 'Aljabar linear adalah bahasa komputer, grafika 3D, sistem persamaan simultan, dan analisis rantai Markov.',
  },

  // ── PROBABILITAS & STATISTIKA ──────────────────────────────────────────────
  {
    skillId: 'pro.bayes',
    title: 'Teorema Bayes (Bayes\' Theorem)',
    definition: 'Teorema Bayes menghitung peluang bersyarat terbalik: memperbarui kepercayaan awal (prior) berdasarkan bukti baru (likelihood).',
    formula: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    example: {
      problem: 'Mesin A (60% output, 3% cacat), Mesin B (40%, 8% cacat). Item cacat terdeteksi — peluang dari Mesin A?',
      steps: ['P(Cacat) = 0,6×0,03 + 0,4×0,08 = 0,05', 'P(A|Cacat) = (0,6×0,03) / 0,05 = 0,36'],
      answer: '0,36 (36%)',
    },
    misconceptions: [
      'Miskonsepsi: Menjawab P(A) = 60% tanpa mempertimbangkan perbedaan tingkat cacat masing-masing mesin.',
    ],
    whyItMatters: 'Inti dari Quality Control (QC), diagnosis kerusakan mesin, filter spam, dan algoritma AI machine learning.',
  },
  {
    skillId: 'inf.ci-mean',
    title: 'Interval Kepercayaan untuk Mean (Confidence Interval)',
    definition: 'Rentang nilai yang diperkirakan mengandung rata-rata populasi sebenarnya (μ) dengan tingkat kepercayaan tertentu (misal 95%).',
    formula: '\\text{CI} = \\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    example: {
      problem: 'n = 25, x̄ = 50, σ = 5, z = 1,96 (95%)',
      steps: ['Margin of Error ME = 1,96 × 5 / √25 = 1,96', 'CI = [50 − 1,96 ; 50 + 1,96] = [48,04 ; 51,96]'],
      answer: '[48,04 ; 51,96]',
    },
    misconceptions: [
      'Miskonsepsi: Lupa membagi σ dengan akar ukuran sampel (√n).',
    ],
    whyItMatters: 'Digunakan dalam audit kualitas produksi, uji klinis, dan riset pasar untuk mengukur ketidakpastian sampel.',
  },

  // ── RISET OPERASI & INDUSTRI ──────────────────────────────────────────────
  {
    skillId: 'rso.lp-grafis',
    title: 'Program Linear — Metode Grafis (Linear Programming)',
    definition: 'Teknik optimasi matematis untuk memaksimalkan atau meminimalkan fungsi tujuan linear di bawah kendala linear.',
    formula: '\\max Z = c_1x + c_2y \\quad \\text{s.t.} \\quad Ax \\leq b, \\quad x,y \\geq 0',
    example: {
      problem: 'Maks Z = 3x + 5y, dengan kendala x + y ≤ 4 dan x + 3y ≤ 6',
      steps: ['Gambar daerah layak', 'Titik sudut: (0,0), (4,0), (3,1), (0,2)', 'Evaluasi Z: Z(3,1) = 3(3) + 5(1) = 14 (maksimum)'],
      answer: 'Z maks = 14 pada (x=3, y=1)',
    },
    misconceptions: [
      'Miskonsepsi: Tidak mengevaluasi SEMUA titik sudut daerah layak.',
    ],
    whyItMatters: 'Inti alokasi sumber daya pabrik: membagi jam kerja mesin, tenaga kerja, dan bahan baku demi keuntungan maksimum.',
  },
  {
    skillId: 'inv.eoq',
    title: 'EOQ — Kuantitas Pemesanan Ekonomis (Economic Order Quantity)',
    definition: 'Kuantitas pemesanan yang meminimalkan total biaya persediaan tahunan (biaya pemesanan + biaya penyimpanan).',
    formula: 'EOQ = \\sqrt{\\frac{2DS}{H}}',
    example: {
      problem: 'Permintaan D = 1.200 unit/th, Biaya pesan S = Rp150.000, Biaya simpan H = Rp6.000/unit/th',
      steps: ['EOQ = √(2 × 1200 × 150.000 / 6.000)', '= √(60.000.000) ≈ 245 unit'],
      answer: '245 unit',
    },
    misconceptions: [
      'Miskonsepsi: Tertukar antara H (holding cost/simpan) dan S (setup/ordering cost/pesan).',
    ],
    whyItMatters: 'Manajemen persediaan gudang, minimasi modal mati di toko, e-commerce, dan pabrik manufaktur.',
  },
  {
    skillId: 'ant.mm1',
    title: 'Model Antrean M/M/1 (Queueing Theory)',
    definition: 'Model sistem antrean dengan kedatangan Poisson (λ), waktu layanan eksponensial (μ), dan 1 server. Diperlukan ρ = λ/μ < 1 agar stabil.',
    formula: 'L_s = \\frac{\\rho}{1 - \\rho}, \\quad W_s = \\frac{1}{\\mu - \\lambda}, \\quad \\rho = \\frac{\\lambda}{\\mu}',
    example: {
      problem: 'λ = 8/jam, μ = 10/jam',
      steps: ['ρ = 8/10 = 0,8', 'Ls = 0,8 / (1 − 0,8) = 4 pelanggan dalam sistem', 'Ws = 1 / (10 − 8) = 0,5 jam = 30 menit'],
      answer: 'Ls = 4 pelanggan, Ws = 30 menit',
    },
    misconceptions: [
      'Miskonsepsi: Membalik λ/μ menjadi μ/λ (λ = kedatangan, μ = layanan).',
    ],
    whyItMatters: 'Merancang kapasitas kasir, jumlah loket tol, server web, dan meja customer service.',
  },
  {
    skillId: 'rso.pert',
    title: 'PERT — Manajemen Proyek (Program Evaluation & Review Technique)',
    definition: 'Metode penjadwalan proyek yang memperhitungkan ketidakpastian waktu menggunakan 3 estimasi: optimis (a), paling mungkin (m), pesimis (b).',
    formula: 't_E = \\frac{a + 4m + b}{6}, \\quad \\sigma^2 = \\left(\\frac{b - a}{6}\\right)^2',
    example: {
      problem: 'Aktivitas dengan a = 2 hari, m = 5 hari, b = 14 hari',
      steps: ['tE = (2 + 4×5 + 14) / 6 = 36 / 6 = 6 hari', 'σ² = ((14 − 2)/6)² = 4'],
      answer: 'Waktu ekspektasi = 6 hari, varians = 4',
    },
    misconceptions: [
      'Miskonsepsi: Menggunakan m langsung tanpa menghitung rata-rata berbobot PERT.',
    ],
    whyItMatters: 'Manajemen proyek konstruksi, R&D produk baru, dan perencanaan acara besar.',
  },
  {
    skillId: 'uni.break-even',
    title: 'Analisis Titik Impas (Break-Even Analysis)',
    definition: 'Volume penjualan di mana total pendapatan sama dengan total biaya (laba = 0). Di atas BEP = laba; di bawah BEP = rugi.',
    formula: 'BEQ = \\frac{FC}{p - VC}',
    example: {
      problem: 'Biaya Tetap FC = Rp5.000.000, Biaya Variabel VC = Rp20.000/unit, Harga p = Rp45.000/unit',
      steps: ['Margin Kontribusi CM = 45.000 − 20.000 = 25.000/unit', 'BEQ = 5.000.000 / 25.000 = 200 unit'],
      answer: '200 unit',
    },
    misconceptions: [
      'Miskonsepsi: Menghitung BEP tanpa memasukkan biaya tetap (FC).',
    ],
    whyItMatters: 'Setiap pelaku usaha wajib tahu target produksi minimum agar bisnis tidak rugi.',
  },
];

export function getConceptCard(skillId: string): ConceptCard | undefined {
  // Direct match or domain match fallback
  const direct = CONCEPT_CARDS.find(c => c.skillId === skillId);
  if (direct) return direct;

  const prefix = skillId.split('.')[0];
  const domainFallback = CONCEPT_CARDS.find(c => c.skillId.startsWith(prefix));
  return domainFallback;
}
