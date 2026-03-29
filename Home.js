import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
	const [incidents, setIncidents] = useState([])

	useEffect(() => {
		axios
			.get('http://localhost:5000/incidents')
			.then(response => {
				setIncidents(response.data)
			})
			.catch(error => {
				console.error('Ошибка загрузки данных:', error)
			})
	}, [])

	const handleDelete = id => {
		axios
			.delete(`http://localhost:5000/incidents/${id}`)
			.then(() => {
				setIncidents(incidents.filter(item => item.id !== id))
			})
			.catch(error => {
				console.error('Ошибка удаления:', error)
			})
	}

	return (
		<div>
			<h1>Реестр инцидентов на производстве</h1>
			<Link to='/form'>Добавить инцидент</Link>
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
