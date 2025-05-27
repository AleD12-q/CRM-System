package org.example.model;

import jakarta.persistence.OneToOne;
import org.example.entity.User;

import java.util.Date;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;

    private String assignee;
    private Date deadline;
    private String status;

    public TaskDTO(Long id, String title, String description, String assignee, Date deadline, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
