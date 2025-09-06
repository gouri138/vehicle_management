package com.example.carmaintenance.controller;

import com.example.carmaintenance.entity.Appointment;
import com.example.carmaintenance.entity.Car;
import com.example.carmaintenance.entity.Customer;
import com.example.carmaintenance.entity.MaintenanceService;
import com.example.carmaintenance.service.AppointmentService;
import com.example.carmaintenance.service.CarService;
import com.example.carmaintenance.service.CustomerService;
import com.example.carmaintenance.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Customer registration
    @PostMapping("/register")
    public ResponseEntity<Customer> registerCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.registerCustomer(customer));
    }

    // Customer login (simplified, should be enhanced with JWT or session)
    @PostMapping("/login")
    public ResponseEntity<Customer> loginCustomer(@RequestParam String email, @RequestParam String password) {
        Optional<Customer> customerOpt = customerService.findByEmail(email);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (passwordEncoder.matches(password, customer.getPassword())) {
                return ResponseEntity.ok(customer);
            }
        }
        return ResponseEntity.status(401).build();
    }

    // View upcoming service reminders (simplified as upcoming appointments)
    @GetMapping("/{customerId}/service-reminders")
    public ResponseEntity<List<Appointment>> getServiceReminders(@PathVariable Long customerId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByCustomerId(customerId);
        return ResponseEntity.ok(appointments);
    }

    // Check past maintenance records
    @GetMapping("/{customerId}/services")
    public ResponseEntity<List<MaintenanceService>> getPastServices(@PathVariable Long customerId) {
        // This requires fetching all cars of customer and their services
        // Simplified: Not implemented fully here
        return ResponseEntity.ok(List.of());
    }

    // Book a service appointment
    @Autowired
    private CarService carService;

    @PostMapping("/{customerId}/appointments")
    public ResponseEntity<Appointment> bookAppointment(@PathVariable Long customerId, @RequestBody Appointment appointment) {
        appointment.setCustomer(new Customer());
        appointment.getCustomer().setCustomerId(customerId);

        appointment.setStatus("Pending");
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }

    // Get user's cars
    @GetMapping("/{customerId}/cars")
    public ResponseEntity<List<Car>> getUserCars(@PathVariable Long customerId) {
        List<Car> cars = carService.getCarsByCustomerId(customerId);
        return ResponseEntity.ok(cars);
    }

    // Get user's appointments
    @GetMapping("/{customerId}/appointments")
    public ResponseEntity<List<Appointment>> getUserAppointments(@PathVariable Long customerId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByCustomerId(customerId);
        return ResponseEntity.ok(appointments);
    }

    // Download invoice/bill (not implemented, placeholder)
    @GetMapping("/invoice/{serviceId}")
    public ResponseEntity<String> downloadInvoice(@PathVariable Long serviceId) {
        // Placeholder for invoice download logic
        return ResponseEntity.ok("Invoice for service id: " + serviceId);
    }
}
