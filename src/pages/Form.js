import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { getUser } from '../auth'

const Form = () => {
  const navigate = useNavigate()
  const currentUser = getUser()
  const [newIncident, setNewIncident] = useState({
    type: '',
    location: '',
    description: '',
    severity: 'Лёгкая',
    status: 'На рассмотрении',
    assignedTo: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)

  // Только админ может добавлять инциденты
  if (currentUser.role !== 'admin') {
    return (
      <div>
        <p>У вас нет прав для добавления инцидентов.</p>
        <Link to='/'>Назад</Link>
      </div>
    )
  }

  const validate = () => {
    const newErrors = {}
    if (!newIncident.type.trim()) newErrors.type = 'Укажите тип инцидента'
    if (!newIncident.location.trim()) newErrors.location = 'Укажите место происшествия'
    if (!newIncident.description.trim()) newErrors.description = 'Заполните описание'
    return newErrors
  }

  const handleChange = e => {
    setNewIncident({ ...newIncident, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    api.post('/incidents', JSON.stringify(newIncident))
      .then(response => {
        console.log('Инцидент добавлен:', response.data)
        navigate('/')
      })
      .catch(() => {
        setServerError('Не удалось добавить инцидент. Попробуйте позже.')
      })
  }

  return (
    <div>
      <h1>Добавить инцидент</h1>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Тип инцидента:
          <input type='text' name='type' value={newIncident.type} onChange={handleChange} />
        </label>
        {errors.type && <div style={{ color: 'red' }}>{errors.type}</div>}
        <br />
        <label>
          Место происшествия:
          <input type='text' name='location' value={newIncident.location} onChange={handleChange} />
        </label>
        {errors.location && <div style={{ color: 'red' }}>{errors.location}</div>}
        <br />
        <label>
          Описание:
          <textarea name='description' value={newIncident.description} onChange={handleChange} />
        </label>
        {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
        <br />
        <label>
          Тяжесть:
          <select name='severity' value={newIncident.severity} onChange={handleChange}>
            <option value='Лёгкая'>Лёгкая</option>
            <option value='Средняя'>Средняя</option>
            <option value='Высокая'>Высокая</option>
          </select>
        </label>
        <br />
        <label>
          Статус:
          <select name='status' value={newIncident.status} onChange={handleChange}>
            <option value='На рассмотрении'>На рассмотрении</option>
            <option value='Расследуется'>Расследуется</option>
            <option value='Устранено'>Устранено</option>
          </select>
        </label>
        <br />
        <label>
          Назначить расследователю (email):
          <input type='text' name='assignedTo' value={newIncident.assignedTo} onChange={handleChange} />
        </label>
        <br />
        <button type='submit'>Добавить</button>
      </form>
      <br />
      <Link to='/'>Назад к списку</Link>
    </div>
  )
}

export default Form
