import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token } = res.data;
            if (!token) throw new Error('No token returned');
            localStorage.setItem('token', token);
            navigate('/properties');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button disabled={loading} className="btn">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            <div className="muted">No account? <Link to="/register">Register</Link></div>
        </div>
    );
}
