class ApiRoute{
    private ApiBase: string = "http://localhost:8080";

    SingIn(): string{
        return this.ApiBase+"/company/SingIn";
    }
    SingUp():string{
        return this.ApiBase+"/company/SingUp";
    }
    CreateUrlForRegUsers():string{
        return this.ApiBase+"/company/CreateUrlForRegUsers"
    }
    CheckValidTokenForEmployee():string{
        return this.ApiBase +"/employee/validTokenReg"
    }
    CreateEmployee():string{
        return this.ApiBase +"/employee/createEmployee";
    }
    getCompanyModules():string{
        return this.ApiBase+"/company/GetCompanyModules";
    }
    getAllNews():string{
        return this.ApiBase+"/news/getCompanyNews"
    }
    createNews():string{
        return this.ApiBase + "/news/createNews";
    }
    changeNews(id:number):string{
        return this.ApiBase+`/news/changeNews/${id}`
    }
    deleteNews(id:number):string{
        return this.ApiBase+`/news/deleteNews/${id}`
    }
    getEvent():string{
        return this.ApiBase+'/event/getDate'
    }
    setEvent():string{
        return this.ApiBase+'/event/setDate'
    }
}

export default ApiRoute;