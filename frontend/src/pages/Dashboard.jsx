import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import ContactForm from '../components/ContactForm';
import ContactTable from '../components/ContactTable';
import ActivityLogPanel from '../components/ActivityLogPanel';
import Pagination from '../components/Pagination';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api('GET', `/api/contacts?${params}`);
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchContacts(pagination.page);
  }, [fetchContacts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContacts(1);
  };

  const handleAdd = () => setModal({ mode: 'add' });
  const handleEdit = (contact) => setModal({ mode: 'edit', contact });
  const handleCloseModal = () => setModal(null);

  const handleSave = async (payload) => {
    try {
      if (modal.mode === 'add') {
        await api('POST', '/api/contacts', payload);
      } else {
        await api('PUT', `/api/contacts/${modal.contact._id}`, payload);
      }
      handleCloseModal();
      fetchContacts(pagination.page);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await api('DELETE', `/api/contacts/${id}`);
      fetchContacts(pagination.page);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Notes', 'CreatedAt', 'UpdatedAt'];
    const rows = contacts.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.company || '',
      c.status || '',
      (c.notes || '').replace(/"/g, '""'),
      c.createdAt,
      c.updatedAt
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(x => `"${x}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Contacts</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="btn btn-ghost" onClick={() => setShowLogs(!showLogs)}>
            Activity Logs
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleExportCsv}>Export CSV</button>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>Add Contact</button>
          <button type="button" className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
            <label>Search (name or email)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '140px' }}>
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            <ContactTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={(p) => fetchContacts(p)}
            />
          </>
        )}
      </div>

      {showLogs && (
        <ActivityLogPanel onClose={() => setShowLogs(false)} />
      )}

      {modal && (
        <ContactForm
          contact={modal.contact}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}
