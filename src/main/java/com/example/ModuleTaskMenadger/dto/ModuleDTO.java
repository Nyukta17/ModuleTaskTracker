package com.example.ModuleTaskMenadger.dto;

public class ModuleDTO {

    private String name;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ModuleDTO{" +
                "name='" + name + '\'' +
                '}';
    }
}
