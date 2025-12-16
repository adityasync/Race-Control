package com.f1pedia.repository;

import com.f1pedia.domain.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findByRace_RaceId(Integer raceId);

    List<Result> findByDriverDriverId(Integer driverId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Result r " +
            "LEFT JOIN FETCH r.race ra " +
            "LEFT JOIN FETCH ra.circuit " +
            "LEFT JOIN FETCH r.driver " +
            "LEFT JOIN FETCH r.status " +
            "WHERE r.constructor.constructorId = :constructorId")
    List<Result> findByConstructorConstructorId(
            @org.springframework.data.repository.query.Param("constructorId") Integer constructorId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT s.status, COUNT(*) as count " +
            "FROM results r " +
            "JOIN status s ON r.status_id = s.status_id " +
            "WHERE s.status != 'Finished' AND s.status NOT LIKE '%Lap%' " +
            "GROUP BY s.status " +
            "ORDER BY count DESC " +
            "LIMIT 15", nativeQuery = true)
    java.util.List<Object[]> findDNFCauseCounts();

    @org.springframework.data.jpa.repository.Query("SELECT r.driver, " +
            "SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END), " +
            "SUM(COALESCE(r.points, 0)), " +
            "COUNT(r), " +
            "MIN(r.race.year), " +
            "MAX(r.race.year), " +
            "SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) " +
            "FROM Result r " +
            "WHERE r.constructor.constructorId = :constructorId " +
            "GROUP BY r.driver")
    List<Object[]> findDriverStatsByConstructorId(
            @org.springframework.data.repository.query.Param("constructorId") Integer constructorId);

    @org.springframework.data.jpa.repository.Query("SELECT r.race.year, " +
            "SUM(COALESCE(r.points, 0)), " +
            "SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END), " +
            "COUNT(r), " +
            "MIN(r.position), " +
            "AVG(CAST(r.grid AS double)), " +
            "SUM(CASE WHEN r.position IS NULL THEN 1 ELSE 0 END) " +
            "FROM Result r " +
            "WHERE r.constructor.constructorId = :constructorId " +
            "GROUP BY r.race.year " +
            "ORDER BY r.race.year DESC")
    List<Object[]> findConstructorSeasonStats(
            @org.springframework.data.repository.query.Param("constructorId") Integer constructorId);

    @org.springframework.data.jpa.repository.Query("SELECT r.race.year, d.surname, SUM(r.points) " +
            "FROM Result r " +
            "JOIN r.driver d " +
            "WHERE r.constructor.constructorId = :constructorId AND r.points > 0 " +
            "GROUP BY r.race.year, d.surname")
    List<Object[]> findSeasonDriverPoints(
            @org.springframework.data.repository.query.Param("constructorId") Integer constructorId);

    @org.springframework.data.jpa.repository.Query("SELECT c.circuitId, c.name, c.location, c.country, " +
            "COUNT(r.resultId), " +
            "SUM(COALESCE(r.points, 0)), " +
            "SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END), " +
            "MIN(ra.year), " +
            "MAX(ra.year), " +
            "MIN(r.position), " +
            "AVG(CAST(r.grid AS double)), " +
            "AVG(CAST(r.position AS double)), " +
            "SUM(CASE WHEN r.position IS NULL THEN 1 ELSE 0 END) " +
            "FROM Result r " +
            "JOIN r.race ra " +
            "JOIN ra.circuit c " +
            "WHERE r.constructor.constructorId = :constructorId " +
            "GROUP BY c.circuitId, c.name, c.location, c.country " +
            "ORDER BY COUNT(r.resultId) DESC")
    List<Object[]> findConstructorCircuitStats(
            @org.springframework.data.repository.query.Param("constructorId") Integer constructorId);
}
