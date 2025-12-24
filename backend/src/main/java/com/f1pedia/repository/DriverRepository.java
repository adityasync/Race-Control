package com.f1pedia.repository;

import com.f1pedia.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for accessing Driver data.
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {

    /**
     * Finds a driver by their unique reference specificier.
     *
     * @param driverRef The driver reference (e.g., "hamilton")
     * @return Optional containing the driver if found
     */
    Optional<Driver> findByDriverRef(String driverRef);

    /**
     * Finds a driver by their surname.
     *
     * @param surname The driver's surname
     * @return Optional containing the driver if found
     */
    Optional<Driver> findBySurname(String surname);

    /**
     * Finds all drivers who have raced for a specific constructor.
     *
     * @param constructorId The ID of the constructor
     * @return List of drivers for that team
     */
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r.driver FROM Result r WHERE r.constructor.constructorId = :constructorId")
    java.util.List<Driver> findDriversByConstructorId(Integer constructorId);
}
