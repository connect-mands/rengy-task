import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Valid email required'),
  phone: z.string().max(20).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(['Lead', 'Prospect', 'Customer']).optional(),
  notes: z.string().max(1000).optional().or(z.literal(''))
});

export default function ContactForm({ contact, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: contact ? {
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      status: contact.status || 'Lead',
      notes: contact.notes || ''
    } : { status: 'Lead' }
  });

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
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="card" style={{ width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>{contact ? 'Edit Contact' : 'Add Contact'}</h2>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" {...register('name')} />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" {...register('email')} />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" {...register('phone')} />
            {errors.phone && <div className="error">{errors.phone.message}</div>}
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" {...register('company')} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select {...register('status')}>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} {...register('notes')} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
