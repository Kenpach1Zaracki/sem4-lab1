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
    // Ищем пользователя с таким email и паролем
    api.get(`/users?email=${form.email}&password=${form.password}`)
      .then(response => {
        if (response.data.length === 0) {
          setError('Неверный email или пароль')
          return
        }
        const user = response.data[0]
        saveUser(user)
        navigate('/')
      })
      .catch(() => {
        setError('Ошибка подключения к серверу')
      })
  }

  return (
    <div>
      <h1>Вход в систему</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Пароль:
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type='submit'>Войти</button>
      </form>
      <br />
      <Link to='/register'>Зарегистрироваться</Link>
    </div>
  )
}

export default Login
