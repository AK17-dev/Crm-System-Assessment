import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [form, setForm] = useState({ title: '', address: '', price: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', address: '', price: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        fetchProperties();
    }, []); // eslint-disable-line

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/properties');
            setProperties(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Could not load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = { title: form.title, address: form.address, price: Number(form.price) };
            const res = await api.post('/properties', payload);
            setProperties((p) => [res.data, ...p]);
            setForm({ title: '', address: '', price: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Add failed');
        }
    };

    const startEdit = (prop) => {
        setEditingId(prop.id);
        setEditForm({ title: prop.title, address: prop.address, price: prop.price });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ title: '', address: '', price: '' });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = { title: editForm.title, address: editForm.address, price: Number(editForm.price) };
            const res = await api.put(`/properties/${editingId}`, payload);
            setProperties((list) => list.map((it) => (it.id === editingId ? res.data : it)));
            cancelEdit();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this property?')) return;
        setError(null);
        try {
            await api.delete(`/properties/${id}`);
            setProperties((list) => list.filter((p) => p.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Delete failed');
        }
    };

    return (
        <div className="page">
            <h2>Properties</h2>
            <form onSubmit={handleAdd} className="form">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />

                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} required />

                <label>Price</label>
                <input name="price" value={form.price} onChange={handleChange} required type="number" />

                <button className="btn">Add Property</button>
            </form>

            {loading ? <div className="muted">Loading...</div> : null}
            {error && <div className="error">{error}</div>}

            <div className="list">
                {properties.map((p) => (
                    <div key={p.id} className="card">
                        {editingId === p.id ? (
                            <form onSubmit={saveEdit} className="form small">
                                <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                                <input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required />
                                <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
                                <div>
                                    <button className="btn">Save</button>
                                    <button type="button" className="btn muted" onClick={cancelEdit}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div><strong>{p.title}</strong></div>
                                <div className="muted">{p.address}</div>
                                <div>Price: {p.price}</div>
                                <div className="muted">ID: {p.id}</div>
                                <div className="actions">
                                    <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                                    <button className="btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
