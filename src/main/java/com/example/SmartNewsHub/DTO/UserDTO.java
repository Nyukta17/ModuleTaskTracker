package com.example.SmartNewsHub.DTO;

public class UserDTO {
    private String email;
    private String password;
    private String nickName;

    public UserDTO(){}

    public UserDTO(String email,String password, String nickName){
        this.email = email;
        this.password = password;
        this.nickName = nickName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getNickName() {
        return nickName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
    public String toString(){
        return "{"+this.email+" "+this.nickName+ " "+this.password+"}";
    }
}
