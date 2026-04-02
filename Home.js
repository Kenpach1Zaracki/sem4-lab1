import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const Home = () => {
	const [incidents, setIncidents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		api
			.get('/incidents')
			.then(response => {
				setIncidents(response.data)
				setLoading(false)
			})
			.catch(error => {
				console.error('Ошибка загрузки данных:', error)
				setError(
					'Не удалось загрузить данные. Проверьте подключение к серверу.',
				)
				setLoading(false)
			})
	}, [])

	const handleDelete = id => {
		api
			.delete(`/incidents/${id}`)
			.then(() => {
				setIncidents(incidents.filter(item => item.id !== id))
			})
			.catch(error => {
				console.error('Ошибка удаления:', error)
				setError('Не удалось удалить инцидент.')
			})
	}

	if (loading) return <div>Загрузка данных...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	return (
		<div>
			<h1>Реестр инцидентов на производстве</h1>
			<Link to='/add'>Добавить инцидент</Link>
			<ul>
				{incidents.map(incident => (
					<li key={incident.id}>
						<strong>{incident.type}</strong> — {incident.location} —{' '}
						{incident.severity}
						<br />
						<Link to={`/detail/${incident.id}`}>Подробнее / Редактировать</Link>
						<button
							onClick={() => handleDelete(incident.id)}
							style={{ marginLeft: '10px' }}
						>
							Удалить
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Home
