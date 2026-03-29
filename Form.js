import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const Form = () => {
	const navigate = useNavigate()
	const [newIncident, setNewIncident] = useState({
		type: '',
		location: '',
		description: '',
		severity: 'Лёгкая',
		status: 'На рассмотрении',
	})

	const handleChange = e => {
		setNewIncident({ ...newIncident, [e.target.name]: e.target.value })
	}

	const handleSubmit = e => {
		e.preventDefault()
		axios
			.post('http://localhost:5000/incidents', JSON.stringify(newIncident), {
				headers: { 'Content-Type': 'application/json' },
			})
			.then(response => {
				console.log('Инцидент добавлен:', response.data)
				navigate('/')
			})
			.catch(error => {
				console.error('Ошибка создания:', error)
			})
	}

	return (
		<div>
			<h1>Добавить инцидент</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Тип инцидента:
					<input
						type='text'
						name='type'
						value={newIncident.type}
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
						value={newIncident.location}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Описание:
					<textarea
						name='description'
						value={newIncident.description}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Тяжесть:
					<select
						name='severity'
						value={newIncident.severity}
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
					<select
						name='status'
						value={newIncident.status}
						onChange={handleChange}
					>
						<option value='На рассмотрении'>На рассмотрении</option>
						<option value='Расследуется'>Расследуется</option>
						<option value='Устранено'>Устранено</option>
					</select>
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
