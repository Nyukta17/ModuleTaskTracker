class ApiRoute {
  private BASE_URL = "http://localhost:8080/api";

  login() {
    return `${this.BASE_URL}/auth/login`;   // POST /api/auth/login
  }

  register() {
    return `${this.BASE_URL}/auth/register`; // POST /api/auth/register
  }
  registerEmployee(){
    return `${this.BASE_URL}/auth/register-user`
  }
  generateRegLink(){
    return `${this.BASE_URL}/auth/generate-registration-link`
  }


  creaeProject(){
    return `${this.BASE_URL}/projects/createProject`
  }
  getAllProjects(){
    return `${this.BASE_URL}/projects/getAllProject`;
  }
  getModuleForHub(id:number){
    return `${this.BASE_URL}/projects/hub/${id}`
  }
  
  // В дальнейшем добавьте здесь другие пути API
}

export default ApiRoute;
