package com.example.carmaintenance.controller;

import com.example.carmaintenance.entity.Admin;
import com.example.carmaintenance.entity.Appointment;
import com.example.carmaintenance.entity.Car;
import com.example.carmaintenance.entity.Customer;
import com.example.carmaintenance.entity.MaintenanceService;
import com.example.carmaintenance.service.AdminService;
import com.example.carmaintenance.service.AppointmentService;
import com.example.carmaintenance.service.CarService;
import com.example.carmaintenance.service.CustomerService;
import com.example.carmaintenance.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CarService carService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private AppointmentService appointmentService;

    // Admin registration
    @PostMapping("/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    // Manage customers
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> addCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.registerCustomer(customer));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        customer.setCustomerId(id);
        return ResponseEntity.ok(customerService.updateCustomer(customer));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    // Manage cars
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @PostMapping("/cars")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.addCar(car));
    }

    @PutMapping("/cars/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car) {
        car.setCarId(id);
        return ResponseEntity.ok(carService.updateCar(car));
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    // Manage services
    @GetMapping("/services")
    public ResponseEntity<List<MaintenanceService>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @PostMapping("/services")
    public ResponseEntity<MaintenanceService> addService(@RequestBody MaintenanceService service) {
        return ResponseEntity.ok(serviceService.addService(service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<MaintenanceService> updateService(@PathVariable Long id, @RequestBody MaintenanceService service) {
        service.setServiceId(id);
        return ResponseEntity.ok(serviceService.updateService(service));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    // View service history for a car
    @GetMapping("/cars/{carId}/services")
    public ResponseEntity<List<MaintenanceService>> getServiceHistory(@PathVariable Long carId) {
        return ResponseEntity.ok(serviceService.getServicesByCarId(carId));
    }

    // Manage appointments
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment appointment = appointmentService.getAppointmentById(id).orElse(null);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }
        appointment.setStatus(status);

        // If status is "Service Done", calculate next service date or km
        if ("Service Done".equalsIgnoreCase(status)) {
            Integer currentKm = appointment.getCurrentKm();
            String serviceType = appointment.getServiceType();
            java.time.LocalDate serviceDate = appointment.getAppointmentDate();

            // Calculate next service info using ServiceService
            java.util.Map<String, Object> nextService = null;
            try {
                nextService = serviceService.calculateNextService(serviceType, currentKm, serviceDate);
            } catch (Exception e) {
                // Log error or handle gracefully
            }

            if (nextService != null) {
                if (nextService.containsKey("nextDate")) {
                    appointment.setNextServiceDate((java.time.LocalDate) nextService.get("nextDate"));
                    appointment.setNextServiceKm(null);
                } else if (nextService.containsKey("nextKm")) {
                    appointment.setNextServiceKm((Integer) nextService.get("nextKm"));
                    appointment.setNextServiceDate(null);
                }
                appointment.setNextServiceType(serviceType);
            }
        }

        return ResponseEntity.ok(appointmentService.updateAppointment(appointment));
    }
}
