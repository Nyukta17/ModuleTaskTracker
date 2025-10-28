export async function fetchCompanyUsers() {
  try {
    const token = localStorage.getItem('jwtToken'); // или получаете токен из другого хранилища
    const response = await fetch('http://localhost:8080/api/auth/get-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // передаём токен в заголовке
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Ошибка сети при загрузке пользователей');
    }
    const users = await response.json();
    return users;
  } catch (e) {
    return [];
  }
}
