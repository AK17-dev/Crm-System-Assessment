import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [properties, setProperties] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', propertyId: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', propertyId: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        fetchData();
    }, []); // eslint-disable-line

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, pRes] = await Promise.all([api.get('/clients'), api.get('/properties')]);
            setClients(cRes.data || []);
            setProperties(pRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Could not load data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = { name: form.name, email: form.email, phone: form.phone, propertyId: form.propertyId };
            const res = await api.post('/clients', payload);
            setClients((c) => [res.data, ...c]);
            setForm({ name: '', email: '', phone: '', propertyId: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Add failed');
        }
    };

    const startEdit = (cl) => {
        setEditingId(cl.id);
        setEditForm({ name: cl.name, email: cl.email, phone: cl.phone, propertyId: cl.propertyId });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', email: '', phone: '', propertyId: '' });
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = { name: editForm.name, email: editForm.email, phone: editForm.phone, propertyId: editForm.propertyId };
            const res = await api.put(`/clients/${editingId}`, payload);
            setClients((list) => list.map((it) => (it.id === editingId ? res.data : it)));
            cancelEdit();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this client?')) return;
        setError(null);
        try {
            await api.delete(`/clients/${id}`);
            setClients((list) => list.filter((c) => c.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Delete failed');
        }
    };

    return (
        <div className="page">
            <h2>Clients</h2>
            <form onSubmit={handleAdd} className="form">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />

                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} required />

                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required />

                <label>Property</label>
                <select name="propertyId" value={form.propertyId} onChange={handleChange}>
                    <option value="">(none)</option>
                    {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>

                <button className="btn">Add Client</button>
            </form>

            {loading ? <div className="muted">Loading...</div> : null}
            {error && <div className="error">{error}</div>}

            <div className="list">
                {clients.map((c) => (
                    <div key={c.id} className="card">
                        {editingId === c.id ? (
                            <form onSubmit={saveEdit} className="form small">
                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
                                <select value={editForm.propertyId} onChange={(e) => setEditForm({ ...editForm, propertyId: e.target.value })}>
                                    <option value="">(none)</option>
                                    {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                                <div>
                                    <button className="btn">Save</button>
                                    <button type="button" className="btn muted" onClick={cancelEdit}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div><strong>{c.name}</strong></div>
                                <div className="muted">{c.email} • {c.phone}</div>
                                <div className="muted">{c.property?.title ? `Property: ${c.property.title}` : `Property ID: ${c.propertyId}`}</div>
                                <div className="muted">ID: {c.id}</div>
                                <div className="actions">
                                    <button className="btn" onClick={() => startEdit(c)}>Edit</button>
                                    <button className="btn danger" onClick={() => handleDelete(c.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
