package com.f1pedia.controller;

import com.f1pedia.domain.Race;
import com.f1pedia.repository.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
/**
 * REST controller for managing Race-related operations.
 * Provides endpoints to retrieve race data by season, id, or all races.
 */
public class RaceController {

    @Autowired
    private RaceRepository raceRepository;

    /**
     * Retrieve all races.
     *
     * @return List of all races
     */
    @GetMapping
    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    /**
     * Retrieve races for a specific season.
     *
     * @param year the season year
     * @return List of races for the given season
     */
    @GetMapping("/season/{year}")
    public List<Race> getRacesBySeason(@PathVariable Integer year) {
        return raceRepository.findByYear(year);
    }

    /**
     * Retrieve a specific race by its ID.
     *
     * @param id the race ID
     * @return ResponseEntity containing the race if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Race> getRaceById(@PathVariable int id) {
        return raceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get the latest season year from the database.
     * Used by frontend to default to current season instead of hardcoded values.
     *
     * @return the latest season year
     */
    @GetMapping("/latest-season")
    public Integer getLatestSeason() {
        return raceRepository.findMaxYear();
    }
}
