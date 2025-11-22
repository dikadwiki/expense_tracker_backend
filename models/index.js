const { koneksiDatabase } = require('../config/database');

class ModelPengeluaran {
    // Dapatkan semua pengeluaran dengan kategori untuk user tertentu
    static async dapatkanSemua(userId, limit = 50, offset = 0) {
        // 🔍 Pastikan nilai limit & offset benar
        limit = Number(limit);
        offset = Number(offset);

        if (isNaN(limit) || limit <= 0) limit = 50;
        if (isNaN(offset) || offset < 0) offset = 0;

        console.log('[DEBUG] LIMIT:', limit, 'OFFSET:', offset, 'USER_ID:', userId);

        // ⚙️ Beberapa versi MySQL tidak menerima placeholder (?) pada LIMIT & OFFSET
        // Jadi kita build query manual untuk menghindari ER_WRONG_ARGUMENTS
        const query = `
            SELECT 
                p.id, p.judul, p.jumlah, p.deskripsi, p.tanggal_transaksi,
                p.dibuat_pada, p.diperbarui_pada,
                k.nama as kategori_nama, k.warna as kategori_warna
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
            WHERE p.user_id = ?
            ORDER BY p.tanggal_transaksi DESC, p.dibuat_pada DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [rows] = await koneksiDatabase.execute(query, [userId]);
        return rows;
    }

    // Dapatkan pengeluaran berdasarkan ID untuk user tertentu
    static async dapatkanBerdasarkanId(id, userId) {
        const query = `
            SELECT 
                p.*, 
                k.nama as kategori_nama, k.warna as kategori_warna
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
            WHERE p.id = ? AND p.user_id = ?
        `;
        const [rows] = await koneksiDatabase.execute(query, [id, userId]);
        return rows[0];
    }

    // Tambah pengeluaran baru untuk user tertentu
    static async tambah(data, userId) {
        const query = `
            INSERT INTO pengeluaran (judul, jumlah, kategori_id, deskripsi, tanggal_transaksi, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await koneksiDatabase.execute(query, [
            data.judul,
            data.jumlah,
            data.kategori_id,
            data.deskripsi,
            data.tanggal_transaksi,
            userId
        ]);
        return result.insertId;
    }

    // Perbarui pengeluaran untuk user tertentu
    static async perbarui(id, data, userId) {
        const query = `
            UPDATE pengeluaran 
            SET judul = ?, jumlah = ?, kategori_id = ?, deskripsi = ?, tanggal_transaksi = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await koneksiDatabase.execute(query, [
            data.judul,
            data.jumlah,
            data.kategori_id,
            data.deskripsi,
            data.tanggal_transaksi,
            id,
            userId
        ]);
        return result.affectedRows > 0;
    }

    // Hapus pengeluaran untuk user tertentu
    static async hapus(id, userId) {
        const query = 'DELETE FROM pengeluaran WHERE id = ? AND user_id = ?';
        const [result] = await koneksiDatabase.execute(query, [id, userId]);
        return result.affectedRows > 0;
    }

    // Dapatkan total pengeluaran untuk user tertentu
    static async dapatkanTotal(userId, bulan = null, tahun = null) {
        let query = 'SELECT SUM(jumlah) as total FROM pengeluaran WHERE user_id = ?';
        let params = [userId];

        if (bulan && tahun) {
            query += ' AND MONTH(tanggal_transaksi) = ? AND YEAR(tanggal_transaksi) = ?';
            params.push(bulan, tahun);
        } else if (tahun) {
            query += ' AND YEAR(tanggal_transaksi) = ?';
            params.push(tahun);
        }

        const [rows] = await koneksiDatabase.execute(query, params);
        return rows[0].total || 0;
    }

    // Dapatkan ringkasan per kategori untuk user tertentu
    static async dapatkanRingkasanKategori(userId, bulan = null, tahun = null) {
        let query = `
            SELECT 
                k.nama,
                k.warna,
                SUM(p.jumlah) as total,
                COUNT(p.id) as jumlah_transaksi
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
            WHERE p.user_id = ?
        `;
        let params = [userId];

        if (bulan && tahun) {
            query += ' AND MONTH(p.tanggal_transaksi) = ? AND YEAR(p.tanggal_transaksi) = ?';
            params.push(bulan, tahun);
        } else if (tahun) {
            query += ' AND YEAR(p.tanggal_transaksi) = ?';
            params.push(tahun);
        }

        query += ' GROUP BY k.id, k.nama, k.warna ORDER BY total DESC';

        const [rows] = await koneksiDatabase.execute(query, params);
        return rows;
    }
}

class ModelKategori {
    // Dapatkan semua kategori (global untuk semua user)
    static async dapatkanSemua() {
        // Ambil SEMUA kategori tanpa filter apapun (kategori sekarang global)
        const query = 'SELECT * FROM kategori ORDER BY nama ASC';
        const [rows] = await koneksiDatabase.execute(query);
        console.log(`📦 ModelKategori.dapatkanSemua: Found ${rows.length} categories`);
        if (rows.length === 0) {
            console.warn('⚠️ WARNING: Tidak ada kategori di database!');
        }
        return rows;
    }

    // Dapatkan kategori berdasarkan ID
    static async dapatkanBerdasarkanId(id) {
        const query = 'SELECT * FROM kategori WHERE id = ?';
        const [rows] = await koneksiDatabase.execute(query, [id]);
        return rows[0];
    }

    // Cek apakah kategori sudah ada (cek semua kategori, global)
    // Kategori global adalah yang user_id = NULL atau user_id = 0
    static async cekKategoriAda(nama) {
        const query = 'SELECT COUNT(*) as count FROM kategori WHERE nama = ? AND (user_id IS NULL OR user_id = 0)';
        const [rows] = await koneksiDatabase.execute(query, [nama]);
        return Number(rows[0].count) > 0;
    }

    // Tambah kategori baru (hanya jika belum ada)
    static async tambah(data) {
        try {
            // Cek dulu apakah kategori sudah ada
            const sudahAda = await ModelKategori.cekKategoriAda(data.nama);
            if (sudahAda) {
                console.log(`Kategori "${data.nama}" sudah ada (global), skip...`);
                // Jika sudah ada, return ID kategori global yang sudah ada
                const query = 'SELECT id FROM kategori WHERE nama = ? AND (user_id IS NULL OR user_id = 0) LIMIT 1';
                const [rows] = await koneksiDatabase.execute(query, [data.nama]);
                if (rows && rows[0]) {
                    console.log(`Menggunakan kategori global "${data.nama}" yang sudah ada (ID: ${rows[0].id})`);
                    return rows[0].id;
                }
            }
            
            // Jika belum ada, buat baru (user_id = NULL untuk kategori global)
            const query = 'INSERT INTO kategori (nama, deskripsi, warna, user_id) VALUES (?, ?, ?, NULL)';
            const [result] = await koneksiDatabase.execute(query, [
                data.nama,
                data.deskripsi,
                data.warna
            ]);
            console.log(`✅ Kategori "${data.nama}" berhasil dibuat dengan ID: ${result.insertId}`);
            return result.insertId;
        } catch (error) {
            console.error(`❌ Error creating kategori "${data.nama}":`, error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            if (error.sql) {
                console.error('SQL:', error.sql);
            }
            // Jika error karena duplicate atau foreign key constraint, coba ambil ID yang sudah ada
            if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === '1452') {
                const query = 'SELECT id FROM kategori WHERE nama = ? AND (user_id IS NULL OR user_id = 0) LIMIT 1';
                const [rows] = await koneksiDatabase.execute(query, [data.nama]);
                if (rows && rows[0]) {
                    console.log(`✅ Menggunakan kategori yang sudah ada (ID: ${rows[0].id}) karena error: ${error.code}`);
                    return rows[0].id;
                }
            }
            throw error;
        }
    }
}

module.exports = {
    ModelPengeluaran,
    ModelKategori
};
