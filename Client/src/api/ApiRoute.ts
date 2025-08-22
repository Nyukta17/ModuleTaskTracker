class ApiRoute{
    private ApiBase: string = "http://localhost:8080";

    SingIn(): string{
        return this.ApiBase+"/api/SingIn";
    }
    SingUp():string{
        return this.ApiBase+"/api/SingUp";
    }
}

export default ApiRoute;