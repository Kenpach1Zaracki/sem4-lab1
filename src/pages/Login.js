import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { saveUser } from '../auth'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    api.get(`/users?email=${form.email}&password=${form.password}`)
      .then(response => {
        if (response.data.length === 0) {
          setError('Неверный email или пароль')
          return
        }
        saveUser(response.data[0])
        navigate('/')
      })
      .catch(() => setError('Ошибка подключения к серверу'))
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-logo'>SAFE<span>TRACK</span></div>
        <div className='auth-subtitle'>Система учёта инцидентов</div>
        {error && <div className='server-error'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input className='form-input' type='email' name='email' value={form.email} onChange={handleChange} required />
          </div>
          <div className='form-group'>
            <label className='form-label'>Пароль</label>
            <input className='form-input' type='password' name='password' value={form.password} onChange={handleChange} required />
          </div>
          <button type='submit' className='btn btn-primary' style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            Войти
          </button>
        </form>
        <div className='auth-footer'>
          <Link to='/register' className='auth-link'>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
