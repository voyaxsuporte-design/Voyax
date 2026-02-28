import Database from 'better-sqlite3';
import path from 'path';

/**
 * ===================================================
 *  DATABASE — BANCO DE DADOS SQLITE
 *
 *  Este arquivo cria e configura o banco de dados.
 *  Ele é chamado pelo servidor quando inicia.
 *
 *  Tabelas:
 *  - destinations  → destinos disponíveis
 *  - flights       → voos disponíveis
 *  - hotels        → hotéis disponíveis
 *  - experiences   → experiências/passeios
 *  - trips         → viagens do usuário
 *  - debts         → dívidas do usuário
 *  - user_profile  → perfil do usuário
 * ===================================================
 */

const DB_PATH = path.join(process.cwd(), 'voyax.db');

let db: Database.Database;

export function getDatabase(): Database.Database {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initializeSchema();
        seedData();
    }
    return db;
}

/**
 * Cria todas as tabelas caso não existam.
 */
function initializeSchema() {
    db.exec(`
    -- Destinos disponíveis
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      image TEXT NOT NULL,
      climate TEXT NOT NULL,
      exchange TEXT NOT NULL
    );

    -- Voos
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      airline TEXT NOT NULL,
      flight_number TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      duration TEXT NOT NULL,
      stops TEXT NOT NULL DEFAULT 'Direto',
      price REAL NOT NULL,
      cabin TEXT DEFAULT 'Economy',
      recommended INTEGER DEFAULT 0
    );

    -- Hotéis
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      description TEXT,
      amenities TEXT,
      guest_rating REAL,
      recommended INTEGER DEFAULT 0
    );

    -- Experiências
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      name TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 5,
      recommended INTEGER DEFAULT 0
    );

    -- Viagens do usuário
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      country TEXT NOT NULL,
      dates TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      image TEXT NOT NULL,
      hotel TEXT,
      cabin TEXT,
      price TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Dívidas / financeiro do usuário
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value REAL NOT NULL,
      due_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Perfil do usuário
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      plan TEXT DEFAULT 'Black',
      avatar TEXT,
      monthly_income REAL DEFAULT 0,
      miles INTEGER DEFAULT 0
    );
  `);
}

/**
 * Popula o banco com dados iniciais (seed).
 * Só insere se as tabelas estiverem vazias.
 */
function seedData() {
    const count = db.prepare('SELECT COUNT(*) as c FROM destinations').get() as { c: number };
    if (count.c > 0) return; // já tem dados, não insere de novo

    // ── Destinos ──
    const insertDest = db.prepare('INSERT INTO destinations (name, country, image, climate, exchange) VALUES (?, ?, ?, ?, ?)');
    const destinations = [
        ['Paris', 'França', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPRnR9V_X8sfvvHcQ7hLv6y4Br4PlafH_mE43L8a3Ybb8lbapa0jWt1TFDq85J5l28a00JrRsEgVd0638Gc6bt3x7WJ5dpKUPW7tDOL6c_6NrYa8ZrBcBupIy_hUfWrhCtHBBE4yh7do7a3HJ2AdlxtLP08brYb0zRIMvehqZomvFLivFrF3cINbVDyZTNbTM9MEWsQ67g3EfYmcKFBF6TXL8SkmdThwHsJOREL1aAzwIWCINmY2-J-SnBix1lvs7GKfyWaHH5iZg', '14°C / 8°C', '1€ = R$ 5,38'],
        ['Tóquio', 'Japão', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', '22°C / 15°C', '¥1 = R$ 0,04'],
        ['Nova York', 'EUA', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', '18°C / 10°C', '$1 = R$ 4,95'],
        ['Dubai', 'Emirados Árabes', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', '35°C / 25°C', '1 AED = R$ 1,35'],
        ['Maldivas', 'Ásia', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzQmnzI5SBSUDPJHNV1L5zQ84YWkBdAUFPBB6wMH8NRFoAmNW9GnEy_Qk-2tKJB9hNljL3DXRd3JGYQNDDIBPyMDA1PoCZD6m_zbMbF1ROs65q-slWdlxuzRz6nuBOCu0esKIDlDKZKRtptOZ6rBoIfjgt0aQ2T5OzNzqv9yy23bH_OZgwTsqPn_0HDZkdUQ36XnjBQ3HFihU3mJlUxKKe7maC23sq0MJExJRxXo2_c3e9HdQL9J2uLOFaZuRV1wHpJM4FFhcmwEE', '30°C / 26°C', '$1 = R$ 4,95'],
        ['Londres', 'Inglaterra', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', '15°C / 7°C', '£1 = R$ 6,25'],
    ];
    for (const d of destinations) insertDest.run(...d);

    // ── Voos (Paris) ──
    const insertFlight = db.prepare('INSERT INTO flights (destination, airline, flight_number, departure_time, arrival_time, duration, stops, price, cabin, recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const flights = [
        ['Paris', 'Air France', 'AF457', '08:45', '23:10', '11h 25m', 'Direto', 1120, 'Economy', 1],
        ['Paris', 'Lufthansa', 'LH507', '14:20', '06:15', '13h 55m', '1 Parada (FRA)', 895, 'Economy', 0],
        ['Paris', 'TAP Portugal', 'TP082', '22:05', '14:30', '14h 25m', '1 Parada (LIS)', 940, 'Economy', 0],
        ['Tóquio', 'ANA', 'NH6802', '23:55', '18:40', '24h 45m', '1 Parada (NRT)', 2850, 'Economy', 1],
        ['Tóquio', 'Emirates', 'EK317', '01:30', '22:10', '26h 40m', '1 Parada (DXB)', 2200, 'Economy', 0],
        ['Nova York', 'LATAM', 'LA8141', '10:30', '19:05', '10h 35m', 'Direto', 1580, 'Economy', 1],
        ['Nova York', 'Delta', 'DL107', '22:15', '06:50', '10h 35m', 'Direto', 1420, 'Economy', 0],
        ['Dubai', 'Emirates', 'EK262', '02:15', '22:30', '14h 15m', 'Direto', 1950, 'Economy', 1],
        ['Maldivas', 'Qatar Airways', 'QR675', '19:40', '18:20', '16h 40m', '1 Parada (DOH)', 3200, 'Economy', 1],
        ['Londres', 'British Airways', 'BA247', '22:00', '13:15', '11h 15m', 'Direto', 1350, 'Economy', 1],
    ];
    for (const f of flights) insertFlight.run(...f);

    // ── Hotéis (Paris) ──
    const insertHotel = db.prepare('INSERT INTO hotels (destination, name, location, price, image, rating, description, amenities, guest_rating, recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const hotels = [
        ['Paris', 'Hôtel Plaza Athénée', 'Avenue Montaigne, Paris', 8500, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-MQct5og-DriL-sk-sHwxXG_vVGB8gNvnG0Tf2HlfxJbKfnTqGpr8EqX5XvSWJTPrOUnp8EsAZOFvZAixhaID_Fx2za1PQ5OONLa1awNfshvz3O3aFA1OWZyIT_Sr9ZnZ2GqJlIDxoWZ0cQ-8IPTrEqe5XZg6Bcgid_YDEjsdL3Mne94BE4Cix3bADhh5M6TrDMybjicaO3tDtNPcc5loE8nqq-IobmElVVxVq2X-pxQXAO-rMtYzIbLtUJXM05ra3a0E_uH2bZU', 5, 'O epítome do luxo parisiense com vista direta para a Torre Eiffel.', 'Spa,Michelin Star,Butler', 4.9, 1],
        ['Paris', 'Le Meurice', 'Rue de Rivoli, Paris', 7200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFcaIk6RI_ek71u4YZGlz52Jfjbe5t_n9g0ekUpcAwTIvyJ_5np8dP_iz-YKCH86VvwttG2Gz3QX5o1cF-4ezee2hRnpAICy_tvGsaHbwEWNyPg3o4n8Vk7C2v7uG7ezQqzSbty87YZOZOAyoEoQGbruMd6YvZvYOgD635Y0CTq7e-X2QN-k8nuiAyLaULO8Z4sXx8ZFCvFBllMM5QlbSQ37v7_eHw6gi7dv_BgnSCusZ0XliQ3_FmLxEOJY0ScQPiAc1ToILKS2w', 5, 'Um palácio histórico combinando esplendor do século XVIII com design moderno.', 'Fine Dining,Alain Ducasse,Spa', 4.8, 0],
        ['Paris', 'Saint James Paris', '16th Arrondissement, Paris', 5900, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM3quYr92SnwFsJlSGgo7I2glHo5V6N52uPY_7BkWEAHQq0oPNBvNc0EPJiSbUAjllfn4tPVkVY50UHKwRpn-RuuOiv8RiiPqgVteRG8Oi-GEZ0of3VE1JjrdIbyPaHZgl032OA24-x1jHUa1pxJy6BV0KBjmYhUHdVAp6OQ3rIb7HYwZ2ptKIUHMEucUQ28xfkKgW8575NGBYXTV8WrNSuwI8c8orkCskfQEcEx3xg_cSkiZJeOJHKDQeNsftH4sw9VMYvfCOAno', 4, 'Hotel-chateau com jardins privados no coração de Paris.', 'Garden,Library Bar,Spa', 4.7, 0],
    ];
    for (const h of hotels) insertHotel.run(...h);

    // ── Experiências (Paris) ──
    const insertExp = db.prepare('INSERT INTO experiences (destination, name, duration, price, image, rating, recommended) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const experiences = [
        ['Paris', 'Tour Privado no Louvre', '4 horas', 2400, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBViWu9nrjPfLdxzrQ4c5pf063UQ5BMPkXaNFptX19U-Hb8WtGEP838YM-LvMvOZmVU3ddkZMf1rFk43x5j0t1s1w_uhoOGi_DJz5miWxzzOo_rv9y39fcA6penlaYLtx-VCbjqVtgPm1z7w8SrPn-GZxjCCsvxlKKvC7wjIAXPEgtTiiSCp2eGpOHTV_iDH8y60GZQY3tgG9gjoOI-PmigGc45fBmxWZjlK3CsOWwNVGqdsxLwYpJGUVJehKdP4AF4HXVNsBnO9d4', 5, 1],
        ['Paris', 'Cruzeiro no Sena ao Pôr do Sol', '2 horas', 1800, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3tVhcjxKnKbBNJAlZ8sL6OrTSu25VX_NUcVSF_CwQfMddVFLjYiKR11wa_Y3yq0MoT1q6NZnz3_G9z6sVwQA_5ybsTMn6GUbKF7h3J6t9dakWoQDpE1_DwE3KyJVE7qXpfCBaoElbEegEFCMkgW3tCAH-gRTQ8Boq53YOcCqFja96FmQkn0i9q74aC8uG-D3spIa63SkQ9ExPY5BOP9PkNVitrhLCTQ_CoKg_oOyqmCi72et9ZKivsQg-XavPJtL7FPnxNtN4Ec', 4.9, 0],
        ['Paris', 'Jantar Gourmet na Torre Eiffel', '3 horas', 3200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKG7NC2M_4_DwJOFe80a5bgoNR0_1xUEsSSROJh3I9v4q2ZhqVjloHelxYbtMrMuX8xNOPFA1ByHjlJwPK8-IUnjkJyDHcjKT1Y8wBZfgWxwCHQfCZ6ivZxw51AkrjlRBXIJ8ymc3y8h2JHl3UofpndxNr9FGmMjLeggbGvkhm905A37wgdWu4E38pMROjciQEm7g1CUQQYUThJW3J0hMLfkDaMz_L9Fn21VtIBEuB9DSLfLemoVIN68HHngQc2hi2yW8skBHPEcM', 5, 1],
        ['Paris', 'Palácio de Versalhes VIP', '6 horas', 4500, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSz8ENmWW1wtagnnCUXHR50dkXprkfb756w6jN1AI8yxZVT3qAtCzGDba59Ae21WCbT-6PJroAhorECXG_AbqdJN65IlKLQ9d0EvwT5ib_v0d6QyqHKvjlkvsmRfX37TwRJHyvFSWdxvT-7iU63szUp8nCyxk5hUSUij9QGY0hEBj8klbAUxTVbHX8NEWcEAyAKiSN-chgv2omei1JCfcD-TfdPRbgjCvafvuw41fkxEBy9I3dqlGx8a_NRGOOlnXnGg4xlGdzMSU', 4.8, 0],
    ];
    for (const e of experiences) insertExp.run(...e);

    // ── Viagens do usuário ──
    const insertTrip = db.prepare('INSERT INTO trips (destination, country, dates, status, image, price) VALUES (?, ?, ?, ?, ?, ?)');
    insertTrip.run('Paris, França', 'França', '12 - 24 Mai 2024', 'confirmed', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPRnR9V_X8sfvvHcQ7hLv6y4Br4PlafH_mE43L8a3Ybb8lbapa0jWt1TFDq85J5l28a00JrRsEgVd0638Gc6bt3x7WJ5dpKUPW7tDOL6c_6NrYa8ZrBcBupIy_hUfWrhCtHBBE4yh7do7a3HJ2AdlxtLP08brYb0zRIMvehqZomvFLivFrF3cINbVDyZTNbTM9MEWsQ67g3EfYmcKFBF6TXL8SkmdThwHsJOREL1aAzwIWCINmY2-J-SnBix1lvs7GKfyWaHH5iZg', 'R$ 42.500');
    insertTrip.run('Tóquio, Japão', 'Japão', '05 - 15 Set 2024', 'planning', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', 'R$ 28.000');
    insertTrip.run('Maldivas', 'Ásia', '20 - 30 Dez 2024', 'draft', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzQmnzI5SBSUDPJHNV1L5zQ84YWkBdAUFPBB6wMH8NRFoAmNW9GnEy_Qk-2tKJB9hNljL3DXRd3JGYQNDDIBPyMDA1PoCZD6m_zbMbF1ROs65q-slWdlxuzRz6nuBOCu0esKIDlDKZKRtptOZ6rBoIfjgt0aQ2T5OzNzqv9yy23bH_OZgwTsqPn_0HDZkdUQ36XnjBQ3HFihU3mJlUxKKe7maC23sq0MJExJRxXo2_c3e9HdQL9J2uLOFaZuRV1wHpJM4FFhcmwEE', 'R$ 55.000');

    // ── Dívidas ──
    const insertDebt = db.prepare('INSERT INTO debts (label, value, due_date) VALUES (?, ?, ?)');
    insertDebt.run('Cartão Platinum', 4500, 'Vence em 5 dias');
    insertDebt.run('Financiamento Imóvel', 8900, 'Vence em 15 dias');

    // ── Perfil ──
    db.prepare('INSERT INTO user_profile (name, email, plan, avatar, monthly_income, miles) VALUES (?, ?, ?, ?, ?, ?)').run(
        'Gabriel Oliveira', 'gabriel@voyax.com', 'Black',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAHbXnpOrJ6y6GxzHJUdgACQEkU-oujuF44nynauIyns6V2lHAGlsmnEoCkDcW9MSBbYNnUeauhkWxO_utNwEKV2NPx7TAQec3zZTh2p9LeCPoKQwaR4VNblo0ZWwP1Ig1C6sUjf_DRndicU8HPEt_Yf-H7tG6esLUcYILqIVYnLdT9aPCKC8oZ0USMGUMBYZyPnG3IYnzEWY77L8t_RiQcdRgJjJ213eJQFxLU2uVoZF4MlpdxD9HpUPRoKWsHCwEp-MB_r4R2ifs',
        120000, 2450000
    );
}

export default getDatabase;
