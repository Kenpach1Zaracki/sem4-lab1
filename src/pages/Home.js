import { sendRealEmail } from '../emailService'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { getUser, removeUser } from '../auth'

const getSeverityClass = (s) => {
  if (s === 'Лёгкая') return 'low'
  if (s === 'Средняя') return 'mid'
  return 'high'
}

const getStatusClass = (s) => {
  if (s === 'На рассмотрении') return 'reviewing'
  if (s === 'Расследуется') return 'investigating'
  return 'resolved'
}

const getStatusLabel = (s) => {
  if (s === 'На рассмотрении') return 'Рассмотрение'
  if (s === 'Расследуется') return 'Расследуется'
  return 'Устранено'
}

const Home = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const currentUser = getUser()

  useEffect(() => {
    api.get('/incidents')
      .then(response => {
        let data = response.data
        if (currentUser.role === 'investigator') {
          data = data.filter(inc => inc.assignedTo === currentUser.email)
        }
        setIncidents(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Не удалось загрузить данные.')
        setLoading(false)
      })
  }, [])

  const handleDelete = (incident) => {
  if (window.confirm(`Удалить инцидент "${incident.type}"?`)) {
    api.delete(`/incidents/${incident.id}`)
      .then(async () => {
        await sendRealEmail('DELETE', incident)
        setIncidents(incidents.filter(item => item.id !== incident.id))
      })
      .catch(() => setError('Не удалось удалить инцидент.'))
  }
}

  const handleLogout = () => {
    removeUser()
    navigate('/login')
  }

  if (loading) return <div className='loading'>Загрузка данных</div>
  if (error) return <div className='page'><div className='server-error'>{error}</div></div>

  const total = incidents.length
  const active = incidents.filter(i => i.status === 'Расследуется').length
  const high = incidents.filter(i => i.severity === 'Высокая').length

  return (
    <div className='page'>
      <div className='header'>
        <div className='header-left'>
          <h1>SAFE<span>TRACK</span></h1>
          <div className='subtitle'>// Система учёта производственных инцидентов</div>
        </div>
        <div className='header-right'>
          <div className='user-badge'>
            <span className='user-name'>{currentUser.name}</span>
            <span className={`role-tag ${currentUser.role}`}>
              {currentUser.role === 'admin' ? 'Admin' : 'Investigator'}
            </span>
          </div>
          <button className='btn-logout' onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className='stats-row'>
        <div className='stat-card'>
          <div className='stat-number'>{total}</div>
          <div className='stat-label'>Всего инцидентов</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>{active}</div>
          <div className='stat-label'>Расследуется</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>{high}</div>
          <div className='stat-label'>Высокая тяжесть</div>
        </div>
      </div>

      <div className='toolbar'>
        <div className='toolbar-left'>// {total} записей</div>
        {currentUser.role === 'admin' && (
          <Link to='/add' className='btn btn-primary'>+ Добавить инцидент</Link>
        )}
      </div>

      {incidents.length === 0 ? (
        <div className='empty-state'>Нет инцидентов</div>
      ) : (
        <ul className='incident-list'>
          {incidents.map(incident => (
            <li key={incident.id} className='incident-item'>
              <div className={`severity-bar ${getSeverityClass(incident.severity)}`} />
              <div className='incident-main'>
                <div className='incident-type'>{incident.type}</div>
                <div className='incident-meta'>
                  <span className='meta-tag'>{incident.location}</span>
                  <span className='meta-tag'>{incident.severity}</span>
                  {incident.assignedTo && (
                    <span className='meta-tag'>{incident.assignedTo}</span>
                  )}
                </div>
              </div>
              <div className='incident-actions'>
                <span className={`status-badge ${getStatusClass(incident.status)}`}>
                  {getStatusLabel(incident.status)}
                </span>
                <Link to={`/detail/${incident.id}`} className='btn btn-ghost'>Открыть</Link>
                <button className='btn btn-danger' onClick={() => handleDelete(incident)}>
	                Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
