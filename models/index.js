const { koneksiDatabase } = require('../config/database');

class ModelPengeluaran {
    // Dapatkan semua pengeluaran dengan kategori
    static async dapatkanSemua(limit = 50, offset = 0) {
        // 🔍 Pastikan nilai limit & offset benar
        limit = Number(limit);
        offset = Number(offset);

        if (isNaN(limit) || limit <= 0) limit = 50;
        if (isNaN(offset) || offset < 0) offset = 0;

        console.log('[DEBUG] LIMIT:', limit, 'OFFSET:', offset);

        // ⚙️ Beberapa versi MySQL tidak menerima placeholder (?) pada LIMIT & OFFSET
        // Jadi kita build query manual untuk menghindari ER_WRONG_ARGUMENTS
        const query = `
            SELECT 
                p.id, p.judul, p.jumlah, p.deskripsi, p.tanggal_transaksi,
                p.dibuat_pada, p.diperbarui_pada,
                k.nama as kategori_nama, k.warna as kategori_warna
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
            ORDER BY p.tanggal_transaksi DESC, p.dibuat_pada DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [rows] = await koneksiDatabase.query(query);
        return rows;
    }

    // Dapatkan pengeluaran berdasarkan ID
    static async dapatkanBerdasarkanId(id) {
        const query = `
            SELECT 
                p.*, 
                k.nama as kategori_nama, k.warna as kategori_warna
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
            WHERE p.id = ?
        `;
        const [rows] = await koneksiDatabase.execute(query, [id]);
        return rows[0];
    }

    // Tambah pengeluaran baru
    static async tambah(data) {
        const query = `
            INSERT INTO pengeluaran (judul, jumlah, kategori_id, deskripsi, tanggal_transaksi)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await koneksiDatabase.execute(query, [
            data.judul,
            data.jumlah,
            data.kategori_id,
            data.deskripsi,
            data.tanggal_transaksi
        ]);
        return result.insertId;
    }

    // Perbarui pengeluaran
    static async perbarui(id, data) {
        const query = `
            UPDATE pengeluaran 
            SET judul = ?, jumlah = ?, kategori_id = ?, deskripsi = ?, tanggal_transaksi = ?
            WHERE id = ?
        `;
        const [result] = await koneksiDatabase.execute(query, [
            data.judul,
            data.jumlah,
            data.kategori_id,
            data.deskripsi,
            data.tanggal_transaksi,
            id
        ]);
        return result.affectedRows > 0;
    }

    // Hapus pengeluaran
    static async hapus(id) {
        const query = 'DELETE FROM pengeluaran WHERE id = ?';
        const [result] = await koneksiDatabase.execute(query, [id]);
        return result.affectedRows > 0;
    }

    // Dapatkan total pengeluaran
    static async dapatkanTotal(bulan = null, tahun = null) {
        let query = 'SELECT SUM(jumlah) as total FROM pengeluaran';
        let params = [];

        if (bulan && tahun) {
            query += ' WHERE MONTH(tanggal_transaksi) = ? AND YEAR(tanggal_transaksi) = ?';
            params = [bulan, tahun];
        } else if (tahun) {
            query += ' WHERE YEAR(tanggal_transaksi) = ?';
            params = [tahun];
        }

        const [rows] = await koneksiDatabase.execute(query, params);
        return rows[0].total || 0;
    }

    // Dapatkan ringkasan per kategori
    static async dapatkanRingkasanKategori(bulan = null, tahun = null) {
        let query = `
            SELECT 
                k.nama,
                k.warna,
                SUM(p.jumlah) as total,
                COUNT(p.id) as jumlah_transaksi
            FROM pengeluaran p
            LEFT JOIN kategori k ON p.kategori_id = k.id
        `;
        let params = [];

        if (bulan && tahun) {
            query += ' WHERE MONTH(p.tanggal_transaksi) = ? AND YEAR(p.tanggal_transaksi) = ?';
            params = [bulan, tahun];
        } else if (tahun) {
            query += ' WHERE YEAR(p.tanggal_transaksi) = ?';
            params = [tahun];
        }

        query += ' GROUP BY k.id, k.nama, k.warna ORDER BY total DESC';

        const [rows] = await koneksiDatabase.execute(query, params);
        return rows;
    }
}

class ModelKategori {
    static async dapatkanSemua() {
        const query = 'SELECT * FROM kategori ORDER BY nama ASC';
        const [rows] = await koneksiDatabase.execute(query);
        return rows;
    }

    static async dapatkanBerdasarkanId(id) {
        const query = 'SELECT * FROM kategori WHERE id = ?';
        const [rows] = await koneksiDatabase.execute(query, [id]);
        return rows[0];
    }

    static async tambah(data) {
        const query = 'INSERT INTO kategori (nama, deskripsi, warna) VALUES (?, ?, ?)';
        const [result] = await koneksiDatabase.execute(query, [
            data.nama,
            data.deskripsi,
            data.warna
        ]);
        return result.insertId;
    }

    static async perbarui(id, data) {
        const query = 'UPDATE kategori SET nama = ?, deskripsi = ?, warna = ? WHERE id = ?';
        const [result] = await koneksiDatabase.execute(query, [
            data.nama,
            data.deskripsi,
            data.warna,
            id
        ]);
        return result.affectedRows > 0;
    }

    static async hapus(id) {
        const query = 'DELETE FROM kategori WHERE id = ?';
        const [result] = await koneksiDatabase.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = {
    ModelPengeluaran,
    ModelKategori
};
