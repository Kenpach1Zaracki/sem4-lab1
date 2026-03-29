import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const Detail = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [incident, setIncident] = useState({
		type: '',
		location: '',
		description: '',
		severity: '',
		status: '',
	})

	useEffect(() => {
		axios
			.get(`http://localhost:5000/incidents/${id}`)
			.then(response => {
				setIncident(response.data)
			})
			.catch(error => {
				console.error('Ошибка загрузки инцидента:', error)
			})
	}, [id])

	const handleChange = e => {
		setIncident({ ...incident, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		axios
			.put(`http://localhost:5000/incidents/${id}`, JSON.stringify(incident), {
				headers: { 'Content-Type': 'application/json' },
			})
			.then(response => {
				console.log('Инцидент обновлён:', response.data)
				navigate('/')
			})
			.catch(error => {
				console.error('Ошибка обновления:', error)
			})
	}

	return (
		<div>
			<h1>Редактирование инцидента</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Тип инцидента:
					<input
						type='text'
						name='type'
						value={incident.type}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Место происшествия:
					<input
						type='text'
						name='location'
						value={incident.location}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Описание:
					<textarea
						name='description'
						value={incident.description}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Тяжесть:
					<select
						name='severity'
						value={incident.severity}
						onChange={handleChange}
					>
						<option value='Лёгкая'>Лёгкая</option>
						<option value='Средняя'>Средняя</option>
						<option value='Высокая'>Высокая</option>
					</select>
				</label>
				<br />
				<label>
					Статус:
					<select name='status' value={incident.status} onChange={handleChange}>
						<option value='На рассмотрении'>На рассмотрении</option>
						<option value='Расследуется'>Расследуется</option>
						<option value='Устранено'>Устранено</option>
					</select>
				</label>
				<br />
				<button type='submit'>Сохранить</button>
			</form>
			<br />
			<Link to='/'>Назад к списку</Link>
		</div>
	)
}

export default Detail
