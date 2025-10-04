class ApiRoute {
  private BASE_URL = "http://localhost:8080/api";

  login() {
    return `${this.BASE_URL}/auth/login`;   // POST /api/auth/login
  }

  register() {
    return `${this.BASE_URL}/auth/register`; // POST /api/auth/register
  }

  creaeProject(){
    return `${this.BASE_URL}/projects/createProject`
  }
  getAllProjects(){
    return `${this.BASE_URL}/projects/getAllProject`;
  }

  // В дальнейшем добавьте здесь другие пути API
}

export default ApiRoute;
