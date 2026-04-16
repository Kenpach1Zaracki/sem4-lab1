import { sendRealEmail } from '../emailService'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { getUser } from '../auth'

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = getUser()
  const [incident, setIncident] = useState({
    type: '', location: '', description: '', severity: '', status: '', assignedTo: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    api.get(`/incidents/${id}`)
      .then(res => { setIncident(res.data); setLoading(false) })
      .catch(() => { setServerError('Не удалось загрузить инцидент.'); setLoading(false) })
  }, [id])

  const validate = () => {
    const e = {}
    if (!incident.type.trim()) e.type = 'Укажите тип инцидента'
    if (!incident.location.trim()) e.location = 'Укажите место происшествия'
    if (!incident.description.trim()) e.description = 'Заполните описание'
    return e
  }

  const handleChange = e => {
    setIncident({ ...incident, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = e => {
  e.preventDefault()
  const ve = validate()
  if (Object.keys(ve).length > 0) { setErrors(ve); return }
  api.put(`/incidents/${id}`, JSON.stringify(incident))
    .then(async (response) => {
      const updatedData = { ...response.data, id: id }
      await sendRealEmail('UPDATE', updatedData)
      navigate('/')
    })
    .catch(() => setServerError('Не удалось сохранить изменения.'))
}
  if (loading) return <div className='loading'>Загрузка</div>
  if (serverError) return <div className='page'><div className='server-error'>{serverError}</div></div>

  return (
    <div className='page'>
      <Link to='/' className='back-link'>Назад к реестру</Link>
      <div className='form-page-title'>РЕДАКТИРОВАНИЕ <span>ИНЦИДЕНТА</span></div>
      <div className='form-divider' />
      <div className='form-card'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Тип инцидента</label>
            <input className='form-input' type='text' name='type' value={incident.type} onChange={handleChange} />
            {errors.type && <div className='form-error'>{errors.type}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Место происшествия</label>
            <input className='form-input' type='text' name='location' value={incident.location} onChange={handleChange} />
            {errors.location && <div className='form-error'>{errors.location}</div>}
          </div>
          <div className='form-group'>
            <label className='form-label'>Описание</label>
            <textarea className='form-textarea' name='description' value={incident.description} onChange={handleChange} />
            {errors.description && <div className='form-error'>{errors.description}</div>}
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label className='form-label'>Тяжесть</label>
              <select className='form-select' name='severity' value={incident.severity} onChange={handleChange}>
                <option value='Лёгкая'>Лёгкая</option>
                <option value='Средняя'>Средняя</option>
                <option value='Высокая'>Высокая</option>
              </select>
            </div>
            <div className='form-group'>
              <label className='form-label'>Статус</label>
              <select className='form-select' name='status' value={incident.status} onChange={handleChange}>
                <option value='На рассмотрении'>На рассмотрении</option>
                <option value='Расследуется'>Расследуется</option>
                <option value='Устранено'>Устранено</option>
              </select>
            </div>
          </div>
          {currentUser.role === 'admin' && (
            <div className='form-group'>
              <label className='form-label'>Назначен расследователю (email)</label>
              <input className='form-input' type='text' name='assignedTo' value={incident.assignedTo} onChange={handleChange} />
            </div>
          )}
          <div className='form-actions'>
            <button type='submit' className='btn btn-primary'>Сохранить</button>
            <Link to='/' className='btn btn-ghost'>Отмена</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Detail
