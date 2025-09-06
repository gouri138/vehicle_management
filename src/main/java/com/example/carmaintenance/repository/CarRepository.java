package com.example.carmaintenance.repository;

import com.example.carmaintenance.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByCustomerCustomerId(Long customerId);
}
