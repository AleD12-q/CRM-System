package org.example.model;

import java.util.Date;
import java.util.List;

public class TaskRequest {
    private String taskTitle;
    private String taskDescription;
    private List<Long> taskAssignees;
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

    public List<Long> getTaskAssignees() {
        return taskAssignees;
    }

    public void setTaskAssignees(List<Long> taskAssignees) {
        this.taskAssignees = taskAssignees;
    }

    public Date getTaskDeadline() {
        return taskDeadline;
    }

    public void setTaskDeadline(Date taskDeadline) {
        this.taskDeadline = taskDeadline;
    }
}
