package com.example.carmaintenance.service;

import com.example.carmaintenance.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public List<String> getServiceTypes() {
        return List.of(
            "Oil Change",
            "Car Wash",
            "Tire Rotation",
            "Wheel Balancing",
            "Wheel Alignment",
            "Engine Tune-Up",
            "Brake Service",
            "Battery Service",
            "AC Service",
            "Transmission Service",
            "Exhaust System Service",
            "Interior Detailing",
            "Suspension & Steering Check",
            "Fuel System Cleaning",
            "Polishing/Waxing"
        );
    }

    public Map<String, Map<String, Object>> getServiceCriteria() {
        Map<String, Map<String, Object>> criteria = new HashMap<>();
        criteria.put("Oil Change", Map.of("type", "km", "min", 5000, "max", 10000));
        criteria.put("Car Wash", Map.of("type", "days", "min", 7, "max", 10));
        criteria.put("Tire Rotation", Map.of("type", "km", "min", 8000, "max", 10000));
        criteria.put("Wheel Balancing", Map.of("type", "km", "value", 10000));
        criteria.put("Wheel Alignment", Map.of("type", "km", "min", 10000, "max", 15000));
        criteria.put("Brake Service", Map.of("type", "km", "min", 30000, "max", 50000));
        criteria.put("Battery Service", Map.of("type", "years", "min", 3, "max", 5));
        criteria.put("AC Service", Map.of("type", "years", "min", 1, "max", 2));
        criteria.put("Transmission Service", Map.of("type", "km", "min", 40000, "max", 60000));
        criteria.put("Engine Tune-Up", Map.of("type", "km", "min", 30000, "max", 50000));
        criteria.put("Suspension & Steering Check", Map.of("type", "km", "min", 20000, "max", 30000));
        criteria.put("Interior Detailing", Map.of("type", "months", "min", 3, "max", 6));
        criteria.put("Polishing/Waxing", Map.of("type", "months", "min", 3, "max", 6));
        criteria.put("Fuel System Cleaning", Map.of("type", "km", "min", 30000, "max", 50000));
        criteria.put("Exhaust System Service", Map.of("type", "km", "min", 30000, "max", 50000));
        return criteria;
    }

    public Map<String, Object> calculateNextService(String serviceType, Integer currentKm, LocalDate serviceDate) {
        Map<String, Map<String, Object>> criteria = getServiceCriteria();
        if (!criteria.containsKey(serviceType)) {
            return null;
        }
        Map<String, Object> serviceCriteria = criteria.get(serviceType);
        String type = (String) serviceCriteria.get("type");
        Map<String, Object> next = new HashMap<>();
        next.put("serviceType", serviceType);
        if ("km".equals(type)) {
            Integer min = (Integer) serviceCriteria.get("min");
            Integer max = (Integer) serviceCriteria.get("max");
            Integer value = (Integer) serviceCriteria.get("value");
            if (value != null) {
                next.put("nextKm", currentKm + value);
            } else {
                next.put("nextKm", currentKm + (min + max) / 2); // average
            }
        } else if ("days".equals(type)) {
            Integer min = (Integer) serviceCriteria.get("min");
            Integer max = (Integer) serviceCriteria.get("max");
            next.put("nextDate", serviceDate.plusDays((min + max) / 2));
        } else if ("months".equals(type)) {
            Integer min = (Integer) serviceCriteria.get("min");
            Integer max = (Integer) serviceCriteria.get("max");
            next.put("nextDate", serviceDate.plusMonths((min + max) / 2));
        } else if ("years".equals(type)) {
            Integer min = (Integer) serviceCriteria.get("min");
            Integer max = (Integer) serviceCriteria.get("max");
            next.put("nextDate", serviceDate.plusYears((min + max) / 2));
        }
        return next;
    }
}
