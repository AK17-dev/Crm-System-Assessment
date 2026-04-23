import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="nav">
            <div className="nav-left">
                <Link to="/">Home</Link>
            </div>
            <div className="nav-right">
                {token ? (
                    <>
                        <Link to="/properties">Properties</Link>
                        <Link to="/clients">Clients</Link>
                        <button className="btn small" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
