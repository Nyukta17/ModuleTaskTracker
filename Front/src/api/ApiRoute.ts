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
  getUsers(){
    return `${this.BASE_URL}/auth/users/no-admins`
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
  getAllNewsCompany(){
    return `${this.BASE_URL}/news/getAllNews`
  }
  createNewsCompany(){
    return `${this.BASE_URL}/news/create`
  }
  updateNews(id:number){
    return`${this.BASE_URL}/news/update/${id}`
  }
  deleteNews(id:number){
    return`${this.BASE_URL}/news/delete/${id}`
  }
  //Calendar
  getAllEvents() {
    return `${this.BASE_URL}/calendar/getAllEvents`;
  }

  createEvent() {
    return `${this.BASE_URL}/calendar/createEvent`;
  }

  updateEvent(id: number) {
    return `${this.BASE_URL}/calendar/update/${id}`;
  }

  deleteEvent(id: number) {
    return `${this.BASE_URL}/calendar/delete/${id}`;
  }

  // Задание - задачи
  getAllTasks() {
    return `${this.BASE_URL}/task/all`;
  }
  getTaskUsers(){
    return`${this.BASE_URL}/task/get-users-task`
  }

  getTaskById(id: number) {
    return `${this.BASE_URL}/task/${id}`;
  }

  createTask() {
    return `${this.BASE_URL}/task/create`;
  }

  updateTask(id: string) {
    return `${this.BASE_URL}/task/update/${id}`;
  }

  deleteTask(id: number) {
    return `${this.BASE_URL}/task/delete/${id}`;
  }
  bulkCompleteTasks(){
    return`${this.BASE_URL}/task/completed`
  }

  saveTimeBoard(id:string){
    return `${this.BASE_URL}`+`/timeTracker/saveTimeBoard?hubId=${id}`
  }
  getMarkers(id:string){
    return`${this.BASE_URL}`+`/timeTracker/getMarkers?hubId=${id}`
  }
  clearMarkers(){
    return`${this.BASE_URL}`+`/timeTracker/clearMarkers`
  }
  clearMarker(id:number){
    return`${this.BASE_URL}`+`/timeTracker/clearMarker?markerId=${id}`
  }

  getStickers(id:string){
    return`${this.BASE_URL}`+`/stickers/getStickers?hubId=${id}`
  }
  createSticker(id:string){
    return`${this.BASE_URL}`+`/stickers/createSticker?hubId=${id}`
  }
  deleteSticker(id:number){
    return `${this.BASE_URL}/stickers/deleteSticker/${id}`
  }
  deleteStickers(){
    return `${this.BASE_URL}/stickers/deleteStickers`
  }
  updateSticker(id:number){
    return `${this.BASE_URL}/stickers/updateSticker/${id}` 
  }
  saveAllStirckers(id:string){
    return`${this.BASE_URL}/stickers/saveAll?hubId=${id}`
  }
}

export default ApiRoute;
