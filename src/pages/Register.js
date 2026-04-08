import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { saveUser } from '../auth'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Укажите имя'
    if (!form.email.trim()) e.email = 'Укажите email'
    if (form.password.length < 6) e.password = 'Пароль минимум 6 символов'
    return e
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const ve = validate()
    if (Object.keys(ve).length > 0) { setErrors(ve); return }
    api.get(`/users?email=${form.email}`)
      .then(res => {
        if (res.data.length > 0) { setErrors({ email: 'Email уже занят' }); return }
        return api.post('/users', JSON.stringify({ ...form, role: 'investigator' }))
      })
      .then(res => { if (res) { saveUser(res.data); navigate('/') } })
      .catch(() => setServerError('Ошибка регистрации. Попробуйте позже.'))
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-logo'>SAFE<span>TRACK</span></div>
        <div className='auth-subtitle'>Создать аккаунт</div>
        {serverError && <div className='server-error'>{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Имя</label>
            <input className='form-input' type='text' name='name' value={form.name} onChange={handleChange} />
            {errors.name && <div className='form-error'>{errors.name}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input className='form-input' type='email' name='email' value={form.email} onChange={handleChange} />
            {errors.email && <div className='form-error'>{errors.email}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Пароль</label>
            <input className='form-input' type='password' name='password' value={form.password} onChange={handleChange} />
            {errors.password && <div className='form-error'>{errors.password}</div>}
          </div>
          <button type='submit' className='btn btn-primary' style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            Зарегистрироваться
          </button>
        </form>
        <div className='auth-footer'>
          <Link to='/login' className='auth-link'>Уже есть аккаунт? Войти</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
