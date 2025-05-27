package org.example.model;

public class TaskStatusDTO {
    private int completed = 0;
    private int inProgress = 0;
    private int slightDelay = 0;
    private int severeDelay = 0;

    public TaskStatusDTO() {
    }

    public void countStatus(String status) {
        switch(status) {
            case "completed":
                completed++;
                break;
            case "active":
                inProgress++;
                break;
            case "overdue-25":
                slightDelay++;
                break;
            case "overdue-full":
                severeDelay++;
                break;
        }
    }

    // Геттеры
    public int getCompleted() {
        return completed;
    }

    public int getInProgress() {
        return inProgress;
    }

    public int getSlightDelay() {
        return slightDelay;
    }

    public int getSevereDelay() {
        return severeDelay;
    }
}