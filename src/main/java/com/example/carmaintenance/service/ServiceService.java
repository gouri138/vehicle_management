package com.example.carmaintenance.service;

import com.example.carmaintenance.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public com.example.carmaintenance.entity.MaintenanceService addService(com.example.carmaintenance.entity.MaintenanceService service) {
        return serviceRepository.save(service);
    }

    public List<com.example.carmaintenance.entity.MaintenanceService> getServicesByCarId(Long carId) {
        return serviceRepository.findByCarCarId(carId);
    }

    public List<com.example.carmaintenance.entity.MaintenanceService> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<com.example.carmaintenance.entity.MaintenanceService> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public com.example.carmaintenance.entity.MaintenanceService updateService(com.example.carmaintenance.entity.MaintenanceService service) {
        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
