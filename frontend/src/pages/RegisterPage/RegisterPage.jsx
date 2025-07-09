import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import Header from '../../components/Header/Header'; // Perbaikan path
import styles from './RegisterPage.module.css'; // Import CSS Module

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      await register(username, password);
      setSuccess('Pendaftaran berhasil! Silakan masuk.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Coba lagi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.registerContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Daftar Akun Baru! ✨</h2>
          <p className={styles.description}>Ayo bergabung dan mulai belajar!</p>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
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
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Konfirmasi Kata Sandi:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang! 🚀'}
            </button>
          </form>
          <p className={styles.loginText}>
            Sudah punya akun? <Link to="/login" className={styles.loginLink}>Masuk di sini!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;