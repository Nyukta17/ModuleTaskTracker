class ApiRoute{
    private ApiBase: string = "http://localhost:8080";

    SingIn(): string{
        return this.ApiBase+"/company/SingIn";
    }
    SingUp():string{
        return this.ApiBase+"/company/SingUp";
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
}

export default ApiRoute;