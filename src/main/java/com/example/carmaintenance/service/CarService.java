package com.example.carmaintenance.service;

import com.example.carmaintenance.entity.Car;
import com.example.carmaintenance.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    public List<Car> getCarsByCustomerId(Long customerId) {
        return carRepository.findByCustomerCustomerId(customerId);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car updateCar(Car car) {
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    public Map<String, List<String>> getCarModels() {
        Map<String, List<String>> carModels = new HashMap<>();
        carModels.put("Toyota", Arrays.asList("Corolla", "Camry", "RAV4", "Prius", "Hilux", "Land Cruiser"));
        carModels.put("Honda", Arrays.asList("Civic", "Accord", "CR-V", "HR-V", "Jazz / Fit"));
        carModels.put("Ford", Arrays.asList("F-150", "Mustang", "Explorer", "EcoSport", "Ranger"));
        carModels.put("BMW", Arrays.asList("3 Series", "5 Series", "7 Series", "X3", "X5", "i4 (Electric)"));
        carModels.put("Mercedes-Benz", Arrays.asList("A-Class", "C-Class", "E-Class", "S-Class", "GLE", "G-Class"));
        carModels.put("Audi", Arrays.asList("A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron (Electric)"));
        carModels.put("Tesla", Arrays.asList("Model S", "Model 3", "Model X", "Model Y", "Cybertruck (upcoming)"));
        carModels.put("Nissan", Arrays.asList("Altima", "Maxima", "Rogue / X-Trail", "Leaf (Electric)", "GT-R"));
        carModels.put("Hyundai", Arrays.asList("i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona (Electric/Hybrid)"));
        carModels.put("Kia", Arrays.asList("Rio", "Seltos", "Sportage", "Sorento", "EV6 (Electric)"));
        carModels.put("Volkswagen", Arrays.asList("Polo", "Golf", "Passat", "Tiguan", "ID.4 (Electric)"));
        carModels.put("Jeep", Arrays.asList("Wrangler", "Compass", "Grand Cherokee", "Renegade"));
        carModels.put("Lamborghini", Arrays.asList("Huracan", "Aventador", "Urus"));
        carModels.put("Ferrari", Arrays.asList("F8 Tributo", "Roma", "SF90 Stradale"));
        carModels.put("Porsche", Arrays.asList("911", "Cayenne", "Macan", "Taycan (Electric)"));
        return carModels;
    }
}
