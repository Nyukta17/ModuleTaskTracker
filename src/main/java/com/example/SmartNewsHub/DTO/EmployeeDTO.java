package com.example.SmartNewsHub.DTO;

import java.time.LocalDate;


public class EmployeeDTO {
    private  String lastName;
    private  String firstName;
    private  String middleName;
    private  String email;
    private  LocalDate birthday;
    private  String password;
    private  Long companyId;

    public EmployeeDTO(String lastName,String firstName,String middleName,String email,String password,Long companyId){
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.email=email;
        this.password=password;
        this.companyId =companyId;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }
}
