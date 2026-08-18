// Kartu Konsep — Bahasa Indonesia, KaTeX, standar buku teks TI
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
      'Miskonsepsi: "Persen kenaikan 20% lalu turun 20% = sama". Salah! Naik 20% dari 100 = 120; turun 20% dari 120 = 96, bukan 100.',
      'Miskonsepsi: Mencampurkan basis. Pastikan selalu tahu "persen dari apa?"',
    ],
    whyItMatters: 'Persen dipakai di mana-mana di industri: diskon, margin laba, efisiensi, tingkat cacat (defect rate), utilisasi mesin.',
  },
  {
    skillId: 'kald.power',
    title: 'Turunan — Aturan Pangkat (Power Rule)',
    definition: 'Turunan (derivative) mengukur laju perubahan sesaat: seberapa curam grafik di satu titik. Kalau posisi partikel di conveyor adalah s(t), turunannya adalah kecepatan v(t) = s\'(t).',
    formula: '\\frac{d}{dx}[x^n] = nx^{n-1} \\quad \\text{dan} \\quad \\frac{d}{dx}[c] = 0',
    example: {
      problem: 'Tentukan f\'(x) untuk f(x) = 3x⁴ − 2x² + 7',
      steps: ['Turunkan tiap suku: 3×4x³ = 12x³', '−2×2x = −4x', 'Konstanta 7 → 0'],
      answer: 'f\'(x) = 12x³ − 4x',
    },
    misconceptions: [
      'Miskonsepsi: Menulis nxⁿ (lupa kurangi satu) → ingat pangkat SELALU turun satu.',
      'Miskonsepsi: Konstanta tidak nol — seharusnya d/dx[7] = 0, bukan 7.',
    ],
    whyItMatters: 'Turunan adalah mesin di balik optimasi industri: biaya minimum, laba maksimum, buffer persediaan terkecil. Semua riset operasi berdiri di atasnya.',
  },
  {
    skillId: 'rso.lp-grafis',
    title: 'Program Linear — Metode Grafis (Linear Programming)',
    definition: 'Program linear (linear programming) adalah teknik optimasi matematis untuk memaksimalkan atau meminimalkan fungsi tujuan (objective function) linear dengan memenuhi serangkaian kendala (constraint) linear.',
    formula: '\\max/\\min \\quad Z = c_1x + c_2y \\quad \\text{s.t.} \\quad Ax \\leq b, \\quad x,y \\geq 0',
    example: {
      problem: 'Maks Z = 3x + 5y, dengan kendala x + y ≤ 4 dan x + 3y ≤ 6',
      steps: ['Gambar daerah layak (feasible region)', 'Temukan titik sudut: (0,0), (4,0), (3,1), (0,2)', 'Evaluasi Z di tiap titik: Z(3,1) = 14 (maksimum)'],
      answer: 'Z maks = 14 pada (3, 1)',
    },
    misconceptions: [
      'Miskonsepsi: Hanya cek satu titik sudut. Harus evaluasi SEMUA titik sudut.',
      'Miskonsepsi: Lupa kendala non-negatif (x,y ≥ 0) yang membatasi daerah layak.',
    ],
    whyItMatters: 'LP dipakai untuk alokasi sumber daya terbatas: jam mesin, bahan baku, tenaga kerja — inti perencanaan produksi di pabrik dan UMKM.',
  },
  {
    skillId: 'inv.eoq',
    title: 'EOQ — Kuantitas Pemesanan Ekonomis (Economic Order Quantity)',
    definition: 'EOQ adalah kuantitas pemesanan yang meminimalkan total biaya persediaan (inventori) tahunan, yang terdiri dari biaya pemesanan (ordering cost) dan biaya simpan (holding cost).',
    formula: 'EOQ = \\sqrt{\\frac{2DS}{H}}',
    example: {
      problem: 'D = 1.200 unit/tahun, S = Rp150.000/pesan, H = Rp6.000/unit/tahun',
      steps: ['EOQ = √(2 × 1200 × 150.000 / 6.000)', '= √(60.000.000) ≈ 245 unit'],
      answer: 'EOQ ≈ 245 unit per pemesanan',
    },
    misconceptions: [
      'Miskonsepsi: Menukar H dan S dalam rumus — perhatikan mana biaya simpan dan mana biaya pesan.',
      'Miskonsepsi: Menggunakan biaya total tanpa membagi 2 untuk rata-rata simpan → (Q/2)H, bukan QH.',
    ],
    whyItMatters: 'EOQ dipakai manajer gudang dan pengadaan untuk menentukan berapa banyak pesan sekaligus agar total biaya logistik minimum — terutama penting untuk toko, pabrik, dan e-commerce.',
  },
  {
    skillId: 'ant.mm1',
    title: 'Antrean M/M/1 (Queueing Theory)',
    definition: 'Model antrean M/M/1 menggambarkan sistem dengan kedatangan Poisson (laju λ), layanan eksponensial (laju μ), dan satu server. Diperlukan ρ = λ/μ < 1 agar sistem stabil.',
    formula: 'L_s = \\frac{\\rho}{1-\\rho}, \\quad W_s = \\frac{1}{\\mu - \\lambda}, \\quad \\rho = \\frac{\\lambda}{\\mu}',
    example: {
      problem: 'λ = 8 pelanggan/jam, μ = 10 pelanggan/jam',
      steps: ['ρ = 8/10 = 0,8', 'Ls = 0,8/(1−0,8) = 4 pelanggan dalam sistem', 'Ws = 1/(10−8) = 0,5 jam = 30 menit'],
      answer: 'Rata-rata 4 pelanggan dalam sistem, menunggu 30 menit',
    },
    misconceptions: [
      'Miskonsepsi: Membalik λ/μ menjadi μ/λ — λ = kedatangan, μ = layanan.',
      'Miskonsepsi: Lupa bedakan Ls (dalam sistem) vs Lq (dalam antrian saja); Ls = Lq + ρ.',
    ],
    whyItMatters: 'Model antrean digunakan untuk merancang sistem layanan: kasir supermarket, call center, loket rumah sakit, bandwidth jaringan komputer — menentukan berapa server optimal.',
  },
  {
    skillId: 'pro.bayes',
    title: 'Teorema Bayes (Bayes\' Theorem)',
    definition: 'Teorema Bayes menghitung peluang suatu sebab berdasarkan bukti yang diamati (pembaruan kepercayaan). Menghubungkan peluang kondisional "terbalik".',
    formula: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{\\sum_i P(B|A_i)P(A_i)}',
    example: {
      problem: 'Mesin A: 60% output, cacat 3%. Mesin B: 40%, cacat 8%. Item ditemukan cacat — peluang dari Mesin A?',
      steps: ['P(D) = 0,6×0,03 + 0,4×0,08 = 0,018+0,032 = 0,05', 'P(A|D) = (0,6×0,03)/0,05 = 0,018/0,05 = 0,36'],
      answer: 'P(A|D) = 0,36 atau 36%',
    },
    misconceptions: [
      'Miskonsepsi: Menjawab P(A) = 0,6 tanpa mempertimbangkan tingkat cacat — ini mengabaikan likelihood.',
      'Miskonsepsi: Lupa normalisasi (dibagi P(B)) → jawaban tidak bernilai antara 0 dan 1.',
    ],
    whyItMatters: 'Bayes digunakan di quality control (dari mesin mana item cacat?), diagnosis medis, filter spam email, dan sistem rekomendasi — inti pengambilan keputusan berbasis data.',
  },
  {
    skillId: 'uni.break-even',
    title: 'Analisis Titik Impas (Break-Even Analysis)',
    definition: 'Titik impas (break-even point, BEP) adalah volume penjualan di mana total pendapatan sama dengan total biaya — tidak untung, tidak rugi. Di atasnya ada laba; di bawahnya rugi.',
    formula: 'BEQ = \\frac{FC}{p - VC} \\quad \\text{di mana } (p - VC) = \\text{margin kontribusi}',
    example: {
      problem: 'FC = Rp5.000.000, VC = Rp20.000/unit, p = Rp45.000/unit',
      steps: ['CM = 45.000 − 20.000 = 25.000/unit', 'BEQ = 5.000.000 / 25.000 = 200 unit'],
      answer: 'BEP = 200 unit',
    },
    misconceptions: [
      'Miskonsepsi: Lupa memasukkan biaya tetap (FC) — BEP bukan FC/p, tapi FC/(p−VC).',
      'Miskonsepsi: Menggunakan VC total bukan VC per unit dalam rumus.',
    ],
    whyItMatters: 'Setiap pelaku bisnis perlu tahu BEP-nya: berapa unit minimum agar tidak rugi? Ini dasar keputusan harga, target produksi, dan evaluasi kelayakan usaha.',
  },
  {
    skillId: 'rso.pert',
    title: 'PERT — Teknik Evaluasi dan Review Proyek (Program Evaluation and Review Technique)',
    definition: 'PERT adalah metode manajemen proyek yang mempertimbangkan ketidakpastian waktu dengan menggunakan tiga estimasi: waktu optimis (a), paling mungkin (m), dan pesimis (b).',
    formula: 't_E = \\frac{a + 4m + b}{6}, \\quad \\sigma^2 = \\left(\\frac{b-a}{6}\\right)^2',
    example: {
      problem: 'Aktivitas dengan a=2, m=5, b=14 hari',
      steps: ['tE = (2 + 4×5 + 14)/6 = (2+20+14)/6 = 36/6 = 6 hari', 'σ² = ((14−2)/6)² = 4'],
      answer: 'Waktu ekspektasi 6 hari, varians 4',
    },
    misconceptions: [
      'Miskonsepsi: Menggunakan m saja sebagai estimasi waktu — PERT mempertimbangkan ketiga estimasi.',
      'Miskonsepsi: Menjumlahkan varians tanpa mengkuadratkan (b−a)/6 terlebih dahulu.',
    ],
    whyItMatters: 'PERT digunakan untuk merencanakan proyek kompleks seperti konstruksi, pengembangan produk, dan implementasi sistem — membantu manajer memahami risiko keterlambatan.',
  },
  {
    skillId: 'alj.linear1',
    title: 'Persamaan Linear Satu Variabel',
    definition: 'Persamaan linear satu variabel adalah persamaan berbentuk ax + b = c, dengan a, b, c konstanta dan x variabel yang dicari. "Linear" berarti pangkat variabel adalah 1.',
    formula: 'ax + b = c \\implies x = \\frac{c - b}{a}, \\quad a \\neq 0',
    example: {
      problem: 'Selesaikan 3x + 7 = 22',
      steps: ['3x = 22 − 7 = 15', 'x = 15/3 = 5'],
      answer: 'x = 5',
    },
    misconceptions: [
      'Miskonsepsi: Lupa memindahkan semua konstanta ke satu sisi sebelum membagi.',
      'Miskonsepsi: Membagi hanya salah satu suku saat ada lebih dari satu suku di kiri.',
    ],
    whyItMatters: 'Persamaan linear adalah fondasi semua aljabar; digunakan untuk menghitung harga pokok, menentukan kuantitas, dan menyelesaikan masalah campuran dalam produksi.',
  },
  {
    skillId: 'alj2.kuadrat',
    title: 'Persamaan Kuadrat (Quadratic Equation)',
    definition: 'Persamaan kuadrat berbentuk ax² + bx + c = 0 (a ≠ 0) dan memiliki paling banyak dua akar (solusi). Akar dapat dicari dengan pemfaktoran, rumus kuadrat (abc), atau melengkapkan kuadrat.',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad (\\text{rumus kuadrat})',
    example: {
      problem: 'Cari akar dari x² − 5x + 6 = 0',
      steps: ['Faktorkan: (x−2)(x−3) = 0', 'Akar: x = 2 atau x = 3'],
      answer: 'x₁ = 2, x₂ = 3',
    },
    misconceptions: [
      'Miskonsepsi: Langsung faktorkan tanpa memastikan bentuk standar (= 0 di kanan).',
      'Miskonsepsi: Tanda akar salah dalam rumus — b² − 4ac bisa negatif (akar tidak real).',
    ],
    whyItMatters: 'Persamaan kuadrat muncul dalam optimasi biaya, model keuntungan, dan perancangan struktur. Memahami akar = memahami titik kritis.',
  },
  {
    skillId: 'kald.limit',
    title: 'Limit Fungsi (Limit of a Function)',
    definition: 'Limit menyatakan nilai yang didekati suatu fungsi saat variabelnya mendekati nilai tertentu. Limit tidak harus sama dengan nilai fungsinya (berguna untuk fungsi diskontinu atau titik tidak terdefinisi).',
    formula: '\\lim_{x \\to a} f(x) = L \\quad \\Leftrightarrow \\quad \\text{nilai yang didekati } f(x) \\text{ saat } x \\to a',
    example: {
      problem: 'Hitung lim(x→3) (x² − 2x + 1)',
      steps: ['Polinomial kontinu → substitusi langsung', 'f(3) = 9 − 6 + 1 = 4'],
      answer: 'Limit = 4',
    },
    misconceptions: [
      'Miskonsepsi: Limit sama dengan nilai fungsi — untuk polinomial ya, tapi untuk fungsi rasional bisa berbeda.',
      'Miskonsepsi: Substitusi x→a tanpa cek apakah hasilnya 0/0 (bentuk tak tentu → perlu faktorisasi).',
    ],
    whyItMatters: 'Limit adalah fondasi kalkulus: dari limit lahir turunan dan integral, yang keduanya digunakan dalam optimasi dan analisis sistem dinamis di industri.',
  },
  {
    skillId: 'inf.ci-mean',
    title: 'Interval Kepercayaan untuk Rata-Rata (Confidence Interval for Mean)',
    definition: 'Interval kepercayaan (confidence interval) adalah rentang nilai yang diharapkan mengandung parameter populasi sebenarnya dengan tingkat kepercayaan tertentu (misal 95%). Semakin besar sampel, semakin sempit intervalnya.',
    formula: '\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}} \\quad \\text{(jika } \\sigma \\text{ diketahui)}',
    example: {
      problem: 'n=25, x̄=50, σ=5, CI 95% (z=1,96)',
      steps: ['ME = 1,96 × 5/√25 = 1,96', 'CI = [50−1,96 ; 50+1,96] = [48,04 ; 51,96]'],
      answer: 'CI 95%: [48,04 ; 51,96]',
    },
    misconceptions: [
      'Miskonsepsi: "95% kemungkinan μ ada di interval" — μ itu konstan, bukan acak. Pernyataan yang benar: 95% interval yang dibuat dari sampel berbeda akan mengandung μ.',
      'Miskonsepsi: Lupa akar n (√n) di penyebut — margin error berbanding terbalik √n.',
    ],
    whyItMatters: 'CI digunakan di quality control (apakah rata-rata produk masih dalam batas?), riset pasar, dan validasi proses produksi untuk pengambilan keputusan berbasis data.',
  },
];

export function getConceptCard(skillId: string): ConceptCard | undefined {
  return CONCEPT_CARDS.find(c => c.skillId === skillId);
}
