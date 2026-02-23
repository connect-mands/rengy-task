import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password at least 6 characters')
});

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await signup(data.email, data.password, data.name);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Sign up failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '3rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Sign Up</h1>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="signup-name">Name</label>
            <input id="signup-name" type="text" {...register('name')} autoComplete="name" />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" {...register('email')} autoComplete="email" />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" {...register('password')} autoComplete="new-password" />
            {errors.password && <div className="error">{errors.password.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
