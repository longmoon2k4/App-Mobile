import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tu_tien_app'
});

db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

// Tạo bảng user nếu chưa có
const createTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)`;
db.query(createTable, err => {
  if (err) console.error('Lỗi tạo bảng:', err);
});

// Đăng ký
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Thiếu thông tin' });
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length > 0) return res.status(409).json({ message: 'Tài khoản đã tồn tại' });
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], err2 => {
      if (err2) return res.status(500).json({ message: 'Lỗi server' });
      res.json({ message: 'Đăng ký thành công' });
    });
  });
});

// Đăng nhập

// Quên mật khẩu (demo: trả về mật khẩu dạng text, KHÔNG dùng cho sản phẩm thật)
app.post('/forgot-password', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Thiếu thông tin' });
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    // Demo: trả về mật khẩu dạng text (KHÔNG bảo mật)
    res.json({ message: 'Mật khẩu của bạn là: ' + results[0].password });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Thiếu thông tin' });
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    res.json({ message: 'Đăng nhập thành công' });
  });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
