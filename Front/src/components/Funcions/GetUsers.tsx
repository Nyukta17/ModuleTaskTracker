export async function fetchCompanyUsers() {
  const response = await fetch("http://localhost:8080/api/auth/get-users",{
    "headers": {Authorization:`Bearer ${localStorage.getItem("jwtToken")}`,"Content-Type": "application/json"}
  }); 
  if (!response.ok) {
    throw new Error("Ошибка при загрузке пользователей");
  }
  return response.json();
}
