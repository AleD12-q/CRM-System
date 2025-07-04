package org.example.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @OneToOne
    private User handler;
    private Date deadline;

    private String status;

    public Task() {
    }

    public Task(String title, String description, User handler, Date deadline) {
        this.title = title;
        this.description = description;
        this.handler = handler;
        this.deadline = deadline;
        Date now = new Date();
        status = "active";
        long diff = now.getTime() - deadline.getTime();
        if(diff > 0 && diff <= now.getTime() * 0.25) status = "overdue-25";
        else if (diff > now.getTime() * 0.25) status = "overdue-full";
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

    public User getHandler() {
        return handler;
    }

    public void setHandler(User handler) {
        this.handler = handler;
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
}
