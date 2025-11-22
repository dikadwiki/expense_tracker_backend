# Database Migrations

File-file di folder ini berisi script SQL untuk migrasi database.

## Cara Menggunakan

1. **Backup Database**: Pastikan backup database Anda sudah dibuat sebelum menjalankan migration
2. **Pastikan Tabel Users Ada**: Pastikan tabel `users` sudah ada di database
3. **Pilih Script yang Sesuai**:
   - **MySQL 8.0+**: Gunakan `add_user_id_to_tables.sql` (menggunakan IF NOT EXISTS)
   - **MySQL versi lama (< 8.0)**: Gunakan `add_user_id_to_tables_simple.sql`
4. Buka MySQL client atau phpMyAdmin
5. Pilih database Anda
6. Jalankan script yang sesuai

### Contoh menggunakan MySQL CLI:

**MySQL 8.0+:**
```bash
mysql -u your_username -p your_database_name < add_user_id_to_tables.sql
```

**MySQL versi lama:**
```bash
mysql -u your_username -p your_database_name < add_user_id_to_tables_simple.sql
```

### Contoh menggunakan phpMyAdmin:

1. Login ke phpMyAdmin
2. Pilih database Anda
3. Klik tab "SQL"
4. Copy dan paste isi file `add_user_id_to_tables.sql`
5. Klik "Go" untuk menjalankan

## Catatan Penting

- Script ini akan menambahkan kolom `user_id` ke tabel `pengeluaran` dan `kategori`
- Kolom `user_id` menggunakan tipe **INT NOT NULL** (sesuai struktur expense_tracker.sql)
- Jika ada data existing di tabel tersebut, **WAJIB** mengupdate `user_id` ke user yang valid
- Setelah migration selesai, pastikan semua pengeluaran dan kategori baru memiliki `user_id` yang valid
- Foreign key constraints menggunakan nama: `kategori_ibfk_1` dan `pengeluaran_ibfk_2` (sesuai SQL file)
- Indexes yang ditambahkan: `idx_kategori_user`, `idx_pengeluaran_user`, dan `unique_kategori_user`

## Rollback (Jika Perlu)

Jika Anda perlu mengembalikan perubahan, jalankan script berikut:

```sql
-- Hapus foreign key constraints
ALTER TABLE pengeluaran DROP FOREIGN KEY fk_pengeluaran_user;
ALTER TABLE kategori DROP FOREIGN KEY fk_kategori_user;

-- Hapus kolom user_id
ALTER TABLE pengeluaran DROP COLUMN user_id;
ALTER TABLE kategori DROP COLUMN user_id;
```

