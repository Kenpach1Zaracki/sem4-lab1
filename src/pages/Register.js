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
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Укажите имя'
    if (!form.email.trim()) newErrors.email = 'Укажите email'
    if (!form.password.trim()) newErrors.password = 'Укажите пароль'
    if (form.password.length < 6) newErrors.password = 'Пароль минимум 6 символов'
    return newErrors
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Проверяем что email не занят
    api.get(`/users?email=${form.email}`)
      .then(response => {
        if (response.data.length > 0) {
          setErrors({ email: 'Пользователь с таким email уже существует' })
          return
        }
        // Регистрируем нового пользователя с ролью investigator
        const newUser = { ...form, role: 'investigator' }
        return api.post('/users', JSON.stringify(newUser))
      })
      .then(response => {
        if (!response) return
        saveUser(response.data)
        navigate('/')
      })
      .catch(() => {
        setServerError('Ошибка регистрации. Попробуйте позже.')
      })
  }

  return (
    <div>
      <h1>Регистрация</h1>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleChange}
          />
        </label>
        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        <br />
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
          />
        </label>
        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        <br />
        <label>
          Пароль:
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
          />
        </label>
        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        <br />
        <button type='submit'>Зарегистрироваться</button>
      </form>
      <br />
      <Link to='/login'>Уже есть аккаунт? Войти</Link>
    </div>
  )
}

export default Register
