import { sendRealEmail } from '../emailService'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { getUser } from '../auth'

const Form = () => {
  const navigate = useNavigate()
  const currentUser = getUser()
  const [newIncident, setNewIncident] = useState({
    type: '', location: '', description: '',
    severity: 'Лёгкая', status: 'На рассмотрении', assignedTo: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)

  if (currentUser.role !== 'admin') {
    return (
      <div className='page'>
        <div className='server-error'>У вас нет прав для добавления инцидентов.</div>
        <Link to='/' className='back-link'>Назад</Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!newIncident.type.trim()) e.type = 'Укажите тип инцидента'
    if (!newIncident.location.trim()) e.location = 'Укажите место происшествия'
    if (!newIncident.description.trim()) e.description = 'Заполните описание'
    return e
  }

  const handleChange = e => {
    setNewIncident({ ...newIncident, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = e => {
  e.preventDefault()
  const ve = validate()
  if (Object.keys(ve).length > 0) { setErrors(ve); return }
  api.post('/incidents', JSON.stringify(newIncident))
    .then(async (response) => {
      await sendRealEmail('CREATE', response.data || newIncident)
      navigate('/')
    })
    .catch(() => setServerError('Не удалось добавить инцидент. Попробуйте позже.'))
}
  return (
    <div className='page'>
      <Link to='/' className='back-link'>Назад к реестру</Link>
      <div className='form-page-title'>НОВЫЙ <span>ИНЦИДЕНТ</span></div>
      <div className='form-divider' />
      {serverError && <div className='server-error'>{serverError}</div>}
      <div className='form-card'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Тип инцидента</label>
            <input className='form-input' type='text' name='type' value={newIncident.type} onChange={handleChange} placeholder='Несчастный случай, нарушение ТБ...' />
            {errors.type && <div className='form-error'>{errors.type}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Место происшествия</label>
            <input className='form-input' type='text' name='location' value={newIncident.location} onChange={handleChange} placeholder='Цех, участок, помещение...' />
            {errors.location && <div className='form-error'>{errors.location}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Описание</label>
            <textarea className='form-textarea' name='description' value={newIncident.description} onChange={handleChange} placeholder='Подробное описание произошедшего...' />
            {errors.description && <div className='form-error'>{errors.description}</div>}
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label className='form-label'>Тяжесть</label>
              <select className='form-select' name='severity' value={newIncident.severity} onChange={handleChange}>
                <option value='Лёгкая'>Лёгкая</option>
                <option value='Средняя'>Средняя</option>
                <option value='Высокая'>Высокая</option>
              </select>
            </div>
            <div className='form-group'>
              <label className='form-label'>Статус</label>
              <select className='form-select' name='status' value={newIncident.status} onChange={handleChange}>
                <option value='На рассмотрении'>На рассмотрении</option>
                <option value='Расследуется'>Расследуется</option>
                <option value='Устранено'>Устранено</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label'>Назначить расследователю (email)</label>
            <input className='form-input' type='text' name='assignedTo' value={newIncident.assignedTo} onChange={handleChange} placeholder='example@plant.ru' />
          </div>
          <div className='form-actions'>
            <button type='submit' className='btn btn-primary'>Добавить инцидент</button>
            <Link to='/' className='btn btn-ghost'>Отмена</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
