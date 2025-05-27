package org.example.model;

public class UserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String position;
    private String department;

    public UserDTO(Long id, String fullName, String email, String position, String department) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.position = position;
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

}

