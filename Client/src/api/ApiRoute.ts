class ApiRoute {
    private ApiBase: string = "http://localhost:8080";

    SingIn(): string {
        return this.ApiBase + "/company/SingIn";
    }
    SingUp(): string {
        return this.ApiBase + "/company/SingUp";
    }
    CreateUrlForRegUsers(): string {
        return this.ApiBase + "/company/CreateUrlForRegUsers"
    }
    CheckValidTokenForEmployee(): string {
        return this.ApiBase + "/employee/validTokenReg"
    }
    CreateEmployee(): string {
        return this.ApiBase + "/employee/createEmployee";
    }
    SingInEmployee(): string {
        return this.ApiBase + "/employee/SingIn"
    }
    getCompanyModules(): string {
        return this.ApiBase + "/company/GetCompanyModules";
    }
    getAllNews(): string {
        return this.ApiBase + "/news/getCompanyNews"
    }
    createNews(): string {
        return this.ApiBase + "/news/createNews";
    }
    changeNews(id: number): string {
        return this.ApiBase + `/news/changeNews/${id}`
    }
    deleteNews(id: number): string {
        return this.ApiBase + `/news/deleteNews/${id}`
    }
    getEvent(): string {
        return this.ApiBase + '/event/getDate'
    }
    setEvent(): string {
        return this.ApiBase + '/event/setDate'
    }
    setTask(): string {
        return this.ApiBase + '/tasks/createTask'
    }
    getTask(id: string): string {
        return this.ApiBase + `/tasks/getTasks/${id}`;
    }
    getEmployeeTasks(userId: string, hubId: string) {
        return this.ApiBase +`/tasks/employee-tasks?userId=${userId}&hubId=${hubId}`;
    }

    getMyTask(companyId: string, hubId: string) {
        return this.ApiBase +`/tasks/my-tasks?companyId=${companyId}&hubId=${hubId}`;
    }

    updateTaskStatus(taskId: string) {
        return this.ApiBase +`/tasks/${taskId}/statusUpdate`;
    }
}



export default ApiRoute;