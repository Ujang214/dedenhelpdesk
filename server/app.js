// server/app.js

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Konfigurasi transporter untuk mengirim email dengan Zoho Mail
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'dedenherriyanto@zohomail.com', // Ganti dengan alamat email Zoho Mail Anda
        pass: 'Iphone213', // Ganti dengan kata sandi Zoho Mail Anda
    },
});

// Menyajikan file statis dari direktori "public"
app.use(express.static(path.join(__dirname, '../public')));

// Menampilkan halaman formulir kontak
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Endpoint untuk mengirim email
app.post('/send-email', upload.single('attachment'), (req, res) => {
    // Ambil data dari formulir kontak
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const attachment = req.file; // File lampiran yang diunggah

    // Konfigurasi email yang akan dikirim
    const mailOptions = {
        from: 'dedenherriyanto@zohomail.com', // Ganti dengan alamat email Zoho Mail Anda
        to: 'dedenherriyanto@zohomail.com', // Ganti dengan alamat email penerima
        subject: subject,
        text: `Nama: ${name}\nEmail: ${email}\n\n${message}`,
    };

    // Jika ada file lampiran yang diunggah, tambahkan lampiran ke email
    if (attachment) {
        mailOptions.attachments = [
            {
                filename: attachment.originalname,
                path: attachment.path,
            },
        ];
    }

    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error saat mengirim email:', error);
            res.send('Terjadi kesalahan saat mengirim email.');
        } else {
            console.log('Email terkirim: ' + info.response);

            // Tampilkan pesan notifikasi menggunakan JavaScript
            res.send('<script>alert("Email sudah terkirim!"); setTimeout(() => { window.location.href = "/"; }, 1000);</script>');
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
