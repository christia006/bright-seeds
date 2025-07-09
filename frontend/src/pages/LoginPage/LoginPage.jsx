import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Header from '../../components/Header/Header'; // Perbaikan path
import styles from './LoginPage.module.css'; // Import CSS Module

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      onLoginSuccess(user); // Panggil callback untuk update state di App.jsx
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}> {/* Gunakan styles.pageContainer */}
      <Header />
      <div className={styles.loginContent}> {/* Gunakan styles.loginContent */}
        <div className={styles.card}> {/* Gunakan styles.card */}
          <h2 className={styles.title}>Masuk ke Akunmu! 🚀</h2>
          <p className={styles.description}>Ayo mulai petualangan belajarmu!</p>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}> {/* Gunakan styles.form */}
            <div className={styles.inputGroup}> {/* Gunakan styles.inputGroup */}
              <label htmlFor="username">Nama Pengguna:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.inputField} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Kata Sandi:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
            <button type="submit" disabled={loading} className={styles.submitButton}> {/* Gunakan styles.submitButton */}
              {loading ? 'Memproses...' : 'Masuk! ✨'}
            </button>
          </form>
          <p className={styles.registerText}>
            Belum punya akun? <Link to="/register" className={styles.registerLink}>Daftar di sini!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;