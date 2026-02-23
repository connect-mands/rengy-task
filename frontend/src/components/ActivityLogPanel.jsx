import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function ActivityLogPanel({ onClose }) {
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ pages: 1 });

  useEffect(() => {
    api('GET', `/api/contacts/logs?page=${page}`)
      .then(({ data }) => {
        setLogs(data.logs);
        setPagination(data.pagination || { pages: 1 });
      })
      .catch(() => {});
  }, [page]);

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleString();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: '100%', maxWidth: '560px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Activity Logs</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {logs.length === 0 ? (
            <li style={{ color: 'var(--text-muted)' }}>No activity yet.</li>
          ) : (
            logs.map((log) => (
              <li key={log._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{log.action}</span>
                {log.details && <span> — {log.details}</span>}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(log.createdAt)}</div>
              </li>
            ))
          )}
        </ul>
        {pagination.pages > 1 && (
          <div className="pagination" style={{ marginTop: '1rem' }}>
            <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page} of {pagination.pages}</span>
            <button type="button" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
