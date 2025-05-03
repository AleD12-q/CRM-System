package org.example.model;

import java.util.Date;

public class TaskRequest {
    private String taskTitle;
    private String taskDescription;
    private Long taskAssignee;
    private Date taskDeadline;

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public Long getTaskAssignee() {
        return taskAssignee;
    }

    public void setTaskAssignee(Long taskAssignee) {
        this.taskAssignee = taskAssignee;
    }

    public Date getTaskDeadline() {
        return taskDeadline;
    }

    public void setTaskDeadline(Date taskDeadline) {
        this.taskDeadline = taskDeadline;
    }
}
