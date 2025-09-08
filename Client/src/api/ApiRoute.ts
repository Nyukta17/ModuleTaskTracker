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
        return this.ApiBase+"/news"
    }
}

export default ApiRoute;