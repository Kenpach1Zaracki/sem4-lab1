// Сохранить пользователя в localStorage после логина
export const saveUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

// Получить текущего пользователя
export const getUser = () => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

// Удалить пользователя (выход)
export const removeUser = () => {
  localStorage.removeItem('currentUser')
}

// Проверить залогинен ли пользователь
export const isLoggedIn = () => {
  return getUser() !== null
}
