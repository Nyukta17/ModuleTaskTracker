class ApiRoute {
  private BASE_URL = "http://localhost:8080/api/auth";

  login() {
    return `${this.BASE_URL}/login`;   // POST /api/auth/login
  }

  register() {
    return `${this.BASE_URL}/register`; // POST /api/auth/register
  }

  // В дальнейшем добавьте здесь другие пути API
}

export default ApiRoute;
