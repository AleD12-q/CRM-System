package org.example.entity;

import jakarta.persistence.*;
import org.example.entity.enums.Privileges;

@Entity
@Table(name = "access_keys")
public class AccessKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String key;
    private Privileges level;
    @OneToOne
    private User handler;

    public AccessKey() {
    }

    public AccessKey(String key,Privileges level, User handler) {
        this.key = key;
        this.level = level;
        this.handler = handler;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public User getHandler() {
        return handler;
    }

    public void setHandler(User handler) {
        this.handler = handler;
    }

    public Privileges getLevel() {
        return level;
    }

    public void setLevel(Privileges level) {
        this.level = level;
    }
}
