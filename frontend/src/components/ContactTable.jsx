import React from 'react';

export default function ContactTable({ contacts, onEdit, onDelete }) {
  if (!contacts.length) {
    return <p style={{ color: 'var(--text-muted)' }}>No contacts found.</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th style={{ width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone || '—'}</td>
              <td>{c.company || '—'}</td>
              <td>{c.status || '—'}</td>
              <td>
                <button type="button" className="btn btn-ghost" style={{ padding: '0.35rem 0.6rem', marginRight: '0.25rem' }} onClick={() => onEdit(c)}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" style={{ padding: '0.35rem 0.6rem' }} onClick={() => onDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
