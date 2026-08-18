import type { RNG } from './rng';

// Kontekstualisasi pool — rotasi merata, tidak boleh sama 2 soal berurutan
export interface ContextPool {
  id: string;
  entities: { names: string[]; products: string[]; units: string[] };
  template: string;
}

export const CONTEXT_POOLS: ContextPool[] = [
  {
    id: 'batik',
    entities: {
      names: ['Ibu Sari', 'Pak Budi', 'Ibu Dewi', 'Pak Hendra'],
      products: ['kain batik tulis', 'kain batik cap', 'selendang batik', 'sarung batik'],
      units: ['lembar', 'potong', 'gulung'],
    },
    template: 'pabrik batik di Pekalongan',
  },
  {
    id: 'kopi',
    entities: {
      names: ['Pak Andi', 'Ibu Rina', 'Mas Dito', 'Mbak Laras'],
      products: ['kopi robusta', 'kopi arabika', 'cold brew', 'espresso'],
      units: ['kilogram', 'liter', 'gelas', 'sachet'],
    },
    template: 'UMKM kopi di Bandung',
  },
  {
    id: 'katering',
    entities: {
      names: ['Ibu Wati', 'Pak Slamet', 'Ibu Nurul', 'Pak Bambang'],
      products: ['nasi kotak', 'paket catering', 'snack box', 'makan siang'],
      units: ['porsi', 'kotak', 'paket'],
    },
    template: 'usaha katering kampus',
  },
  {
    id: 'bengkel',
    entities: {
      names: ['Pak Agus', 'Pak Rudi', 'Mas Fajar', 'Pak Sugeng'],
      products: ['sepeda motor', 'oli mesin', 'ban', 'spare part'],
      units: ['unit', 'liter', 'buah', 'set'],
    },
    template: 'bengkel motor di Surabaya',
  },
  {
    id: 'kantin',
    entities: {
      names: ['Ibu Yanti', 'Pak Eko', 'Ibu Sri', 'Mas Tono'],
      products: ['nasi goreng', 'mie ayam', 'soto ayam', 'gado-gado'],
      units: ['porsi', 'mangkok', 'piring'],
    },
    template: 'kantin kampus',
  },
  {
    id: 'logistik',
    entities: {
      names: ['Pak Dono', 'Ibu Ani', 'Mas Rizki', 'Mbak Dian'],
      products: ['paket elektronik', 'dokumen', 'paket fashion', 'spare part'],
      units: ['paket', 'kg', 'karton'],
    },
    template: 'gudang logistik e-commerce',
  },
  {
    id: 'laundry',
    entities: {
      names: ['Ibu Santi', 'Pak Yusuf', 'Ibu Mega', 'Mas Yoga'],
      products: ['pakaian', 'seprai', 'karpet', 'jas'],
      units: ['kilogram', 'item', 'set'],
    },
    template: 'usaha laundry',
  },
  {
    id: 'furniture',
    entities: {
      names: ['Pak Sohib', 'Ibu Fatimah', 'Pak Karjo', 'Mas Adi'],
      products: ['kursi jati', 'meja makan', 'lemari pakaian', 'rak buku'],
      units: ['unit', 'set', 'buah'],
    },
    template: 'pengrajin furniture Jepara',
  },
  {
    id: 'percetakan',
    entities: {
      names: ['Pak Wahyu', 'Ibu Lestari', 'Mas Beni', 'Pak Sugiono'],
      products: ['brosur', 'spanduk', 'kartu nama', 'buku'],
      units: ['lembar', 'eksemplar', 'lusin'],
    },
    template: 'percetakan digital',
  },
  {
    id: 'travel',
    entities: {
      names: ['Ibu Lina', 'Pak Darmawan', 'Mas Kevin', 'Mbak Putri'],
      products: ['tiket bus', 'paket wisata', 'tiket kereta', 'rental mobil'],
      units: ['tiket', 'paket', 'unit'],
    },
    template: 'agen perjalanan antar kota',
  },
];

export function pickContext(rng: RNG, excludeId?: string): ContextPool {
  const available = excludeId
    ? CONTEXT_POOLS.filter((c) => c.id !== excludeId)
    : CONTEXT_POOLS;
  return rng.pick(available);
}

export function contextEntity(rng: RNG, ctx: ContextPool) {
  return {
    name: rng.pick(ctx.entities.names),
    product: rng.pick(ctx.entities.products),
    unit: rng.pick(ctx.entities.units),
    place: ctx.template,
  };
}
