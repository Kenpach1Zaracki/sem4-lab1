import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { getUser, removeUser } from '../auth'

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
        // Если роль investigator — показываем только его инциденты
        if (currentUser.role === 'investigator') {
          data = data.filter(inc => inc.assignedTo === currentUser.email)
        }
        setIncidents(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Не удалось загрузить данные. Проверьте подключение к серверу.')
        setLoading(false)
      })
  }, [])

  const handleDelete = id => {
    api.delete(`/incidents/${id}`)
      .then(() => {
        setIncidents(incidents.filter(item => item.id !== id))
      })
      .catch(() => {
        setError('Не удалось удалить инцидент.')
      })
  }

  const handleLogout = () => {
    removeUser()
    navigate('/login')
  }

  if (loading) return <div>Загрузка данных...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Реестр инцидентов на производстве</h1>
        <div>
          <span>
            {currentUser.name} ({currentUser.role === 'admin' ? 'Администратор' : 'Расследователь'})
          </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Выйти
          </button>
        </div>
      </div>

      {currentUser.role === 'admin' && (
        <Link to='/add'>Добавить инцидент</Link>
      )}

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>{incident.type}</strong> — {incident.location} — {incident.severity}
            <br />
            <small>Назначен: {incident.assignedTo || 'не назначен'}</small>
            <br />
            <Link to={`/detail/${incident.id}`}>Подробнее / Редактировать</Link>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => handleDelete(incident.id)}
                style={{ marginLeft: '10px' }}
              >
                Удалить
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
