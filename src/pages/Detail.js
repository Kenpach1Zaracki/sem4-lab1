import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from './api'

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
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(true)
	const [serverError, setServerError] = useState(null)

	useEffect(() => {
		api
			.get(`/incidents/${id}`)
			.then(response => {
				setIncident(response.data)
				setLoading(false)
			})
			.catch(error => {
				console.error('Ошибка загрузки инцидента:', error)
				setServerError('Не удалось загрузить инцидент.')
				setLoading(false)
			})
	}, [id])

	const validate = () => {
		const newErrors = {}
		if (!incident.type.trim()) newErrors.type = 'Укажите тип инцидента'
		if (!incident.location.trim())
			newErrors.location = 'Укажите место происшествия'
		if (!incident.description.trim())
			newErrors.description = 'Заполните описание'
		return newErrors
	}

	const handleChange = e => {
		setIncident({ ...incident, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: null })
	}

	const handleSubmit = e => {
		e.preventDefault()
		const validationErrors = validate()
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}
		api
			.put(`/incidents/${id}`, JSON.stringify(incident))
			.then(response => {
				console.log('Инцидент обновлён:', response.data)
				navigate('/')
			})
			.catch(error => {
				console.error('Ошибка обновления:', error)
				setServerError('Не удалось сохранить изменения. Попробуйте позже.')
			})
	}

	if (loading) return <div>Загрузка...</div>
	if (serverError) return <div style={{ color: 'red' }}>{serverError}</div>

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
					/>
				</label>
				{errors.type && <div style={{ color: 'red' }}>{errors.type}</div>}
				<br />
				<label>
					Место происшествия:
					<input
						type='text'
						name='location'
						value={incident.location}
						onChange={handleChange}
					/>
				</label>
				{errors.location && (
					<div style={{ color: 'red' }}>{errors.location}</div>
				)}
				<br />
				<label>
					Описание:
					<textarea
						name='description'
						value={incident.description}
						onChange={handleChange}
					/>
				</label>
				{errors.description && (
					<div style={{ color: 'red' }}>{errors.description}</div>
				)}
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
