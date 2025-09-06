package com.example.carmaintenance.repository;

import com.example.carmaintenance.entity.MaintenanceService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<MaintenanceService, Long> {
    List<MaintenanceService> findByCarCarId(Long carId);
}
