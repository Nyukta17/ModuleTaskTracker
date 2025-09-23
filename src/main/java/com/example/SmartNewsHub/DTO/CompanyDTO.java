package com.example.SmartNewsHub.DTO;

public class CompanyDTO {
    private Long id;
    private String email;
    private String password;
    private String Company;

    public CompanyDTO(){}

    public CompanyDTO(Long id, String email, String password, String Company){
        this.email = email;
        this.password = password;
        this.Company = Company;
    }



    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getCompany() {
        return Company;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCompany(String company) {
        this.Company = company;
    }
    public String toString(){
        return "{"+this.email+" "+this.Company + " "+this.password+"}";
    }
}
