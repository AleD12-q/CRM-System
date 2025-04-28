package org.example.repository;

import org.example.entity.AccessKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccessKeyRepository extends JpaRepository<AccessKey, Long> {
    Optional<AccessKey> findById(Long id);
    Optional<AccessKey> findByKey(String key);

    List<AccessKey> findAll();
}
