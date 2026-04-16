// src/emailService.js
import emailjs from '@emailjs/browser'

// Инициализация EmailJS с Public Key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY)

export const sendRealEmail = async (type, data) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  let subject = ''
  let message = ''

  switch (type) {
    case 'CREATE':
      subject = `🔔 Новый инцидент: ${data.type}`
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #ff4d00; border-bottom: 2px solid #ff4d00; padding-bottom: 10px;">
            🚨 Создан новый инцидент
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">Тип:</td><td style="padding: 8px;">${data.type}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Место:</td><td style="padding: 8px;">${data.location}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Тяжесть:</td><td style="padding: 8px;">${data.severity}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Статус:</td><td style="padding: 8px;">${data.status}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Описание:</td><td style="padding: 8px;">${data.description}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Создал:</td><td style="padding: 8px;">${currentUser.name} (${currentUser.email})</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Время:</td><td style="padding: 8px;">${timestamp}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Это автоматическое уведомление от системы SafeTrack
          </p>
        </div>
      `
      break

    case 'UPDATE':
      subject = `✏️ Обновлён инцидент #${data.id}: ${data.type}`
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #ffb800; border-bottom: 2px solid #ffb800; padding-bottom: 10px;">
            📝 Инцидент обновлён
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ID:</td><td style="padding: 8px;">#${data.id}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Тип:</td><td style="padding: 8px;">${data.type}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Место:</td><td style="padding: 8px;">${data.location}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Тяжесть:</td><td style="padding: 8px;">${data.severity}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Статус:</td><td style="padding: 8px;">${data.status}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Обновил:</td><td style="padding: 8px;">${currentUser.name} (${currentUser.email})</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Время:</td><td style="padding: 8px;">${timestamp}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Это автоматическое уведомление от системы SafeTrack
          </p>
        </div>
      `
      break

    case 'DELETE':
      subject = `🗑️ Удалён инцидент #${data.id}: ${data.type}`
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #ff3b3b; border-bottom: 2px solid #ff3b3b; padding-bottom: 10px;">
            ❌ Инцидент удалён
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ID:</td><td style="padding: 8px;">#${data.id}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Тип:</td><td style="padding: 8px;">${data.type}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Место:</td><td style="padding: 8px;">${data.location}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Тяжесть:</td><td style="padding: 8px;">${data.severity}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Удалил:</td><td style="padding: 8px;">${currentUser.name} (${currentUser.email})</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Время:</td><td style="padding: 8px;">${timestamp}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Это автоматическое уведомление от системы SafeTrack
          </p>
        </div>
      `
      break

    default:
      console.error('Unknown email type:', type)
      return { success: false, error: 'Unknown type' }
  }

  try {
    const templateParams = {
      subject: subject,
      message: message,
    }

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log(`📧 [EMAIL SENT] ${subject}`)
    return { success: true, response }
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    return { success: false, error }
  }
}
