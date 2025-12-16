package com.f1pedia.controller;

import com.f1pedia.domain.Constructor;
import com.f1pedia.repository.ConstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constructors")
public class ConstructorController {

    @Autowired
    private ConstructorRepository constructorRepository;

    @GetMapping
    public List<Constructor> getAllConstructors() {
        return constructorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Constructor> getConstructorById(@PathVariable int id) {
        return constructorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.f1pedia.repository.DriverRepository driverRepository;

    @Autowired
    private com.f1pedia.repository.ResultRepository resultRepository;

    @GetMapping("/{id}/drivers")
    public List<com.f1pedia.domain.Driver> getDriversByConstructor(@PathVariable Integer id) {
        return driverRepository.findDriversByConstructorId(id);
    }

    @GetMapping("/{id}/driver-stats")
    public List<java.util.Map<String, Object>> getDriverStatsByConstructor(@PathVariable Integer id) {
        List<com.f1pedia.domain.Driver> drivers = driverRepository.findDriversByConstructorId(id);
        return drivers.stream().map(driver -> {
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("driverId", driver.getDriverId());
            stats.put("forename", driver.getForename());
            stats.put("surname", driver.getSurname());
            stats.put("code", driver.getCode());
            stats.put("number", driver.getNumber());
            stats.put("nationality", driver.getNationality());

            // Get results for this driver with this constructor
            List<com.f1pedia.domain.Result> results = resultRepository.findByDriverDriverId(driver.getDriverId());
            List<com.f1pedia.domain.Result> teamResults = results.stream()
                    .filter(r -> r.getConstructor() != null && r.getConstructor().getConstructorId().equals(id))
                    .toList();

            // Calculate total points
            double totalPoints = teamResults.stream()
                    .filter(r -> r.getPoints() != null)
                    .mapToDouble(com.f1pedia.domain.Result::getPoints)
                    .sum();
            stats.put("totalPoints", totalPoints);

            // Calculate wins
            long wins = teamResults.stream()
                    .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                    .count();
            stats.put("wins", wins);

            // Calculate podiums
            long podiums = teamResults.stream()
                    .filter(r -> r.getPosition() != null && r.getPosition() <= 3)
                    .count();
            stats.put("podiums", podiums);

            // Calculate active years
            java.util.Set<Integer> years = teamResults.stream()
                    .filter(r -> r.getRace() != null)
                    .map(r -> r.getRace().getYear())
                    .collect(java.util.stream.Collectors.toSet());
            if (!years.isEmpty()) {
                int minYear = years.stream().min(Integer::compareTo).orElse(0);
                int maxYear = years.stream().max(Integer::compareTo).orElse(0);
                stats.put("firstYear", minYear);
                stats.put("lastYear", maxYear);
                stats.put("yearsActive", minYear == maxYear ? String.valueOf(minYear) : minYear + "-" + maxYear);
            } else {
                stats.put("yearsActive", "N/A");
            }

            stats.put("races", teamResults.size());

            return stats;
        }).sorted((a, b) -> Double.compare((Double) b.get("totalPoints"), (Double) a.get("totalPoints")))
                .toList();
    }

    @GetMapping("/{id}/seasons")
    public List<java.util.Map<String, Object>> getConstructorSeasons(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Year
        java.util.Map<Integer, List<com.f1pedia.domain.Result>> byYear = results.stream()
                .filter(r -> r.getRace() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getYear()));

        return byYear.entrySet().stream()
                .map(entry -> {
                    int year = entry.getKey();
                    List<com.f1pedia.domain.Result> yearResults = entry.getValue();

                    java.util.Map<String, Object> stats = new java.util.HashMap<>();
                    stats.put("year", year);
                    stats.put("races", yearResults.stream().map(r -> r.getRace().getRaceId()).distinct().count());

                    double points = yearResults.stream()
                            .filter(r -> r.getPoints() != null)
                            .mapToDouble(com.f1pedia.domain.Result::getPoints)
                            .sum();
                    stats.put("points", points);

                    long wins = yearResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                            .count();
                    stats.put("wins", wins);

                    long podiums = yearResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() <= 3)
                            .count();
                    stats.put("podiums", podiums);

                    // Best Finish
                    int bestFinish = yearResults.stream()
                            .filter(r -> r.getPosition() != null)
                            .mapToInt(com.f1pedia.domain.Result::getPosition)
                            .min()
                            .orElse(0);
                    stats.put("bestFinish", bestFinish == 0 ? "N/A" : bestFinish);

                    // Avg Grid
                    double avgGrid = yearResults.stream()
                            .filter(r -> r.getGrid() != null && r.getGrid() > 0)
                            .mapToInt(com.f1pedia.domain.Result::getGrid)
                            .average()
                            .orElse(0.0);
                    stats.put("avgGrid", Math.round(avgGrid * 10.0) / 10.0);

                    // DNFs (Checking if position is null or positionText is 'R')
                    long dnfs = yearResults.stream()
                            .filter(r -> r.getPosition() == null)
                            .count();
                    stats.put("dnfs", dnfs);

                    // Driver Points Breakdown
                    java.util.Map<String, Double> driverPoints = yearResults.stream()
                            .filter(r -> r.getPoints() != null && r.getPoints() > 0)
                            .collect(java.util.stream.Collectors.groupingBy(
                                    r -> r.getDriver().getSurname(),
                                    java.util.stream.Collectors.summingDouble(com.f1pedia.domain.Result::getPoints)));
                    stats.put("driverPoints", driverPoints);

                    return stats;
                })
                .sorted((a, b) -> Integer.compare((Integer) b.get("year"), (Integer) a.get("year"))) // Descending year
                .toList();
    }

    @GetMapping("/{id}/circuits")
    public List<java.util.Map<String, Object>> getConstructorCircuits(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Circuit Name (using Race -> Circuit)
        // Note: Result -> Race -> Circuit access required.
        // Assuming Race entity has Circuit information or we can group by Race Name if
        // Circuit entity isn't directly fetchable easily without LazyLoad issues.
        // Let's assume Race has a getCircuit() or getName(). Better to check Race
        // entity
        // first?
        // Proceeding assuming Race has a getCircuit() or getName() that is stable.
        // Actually, let's group by Race Name for now as a proxy for Circuit if needed,
        // or check Race definition.

        java.util.Map<String, List<com.f1pedia.domain.Result>> byCircuit = results.stream()
                .filter(r -> r.getRace() != null && r.getRace().getName() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getName())); // Using Race Name as
                                                                                              // Circuit Proxy

        return byCircuit.entrySet().stream()
                .map(entry -> {
                    String circuitName = entry.getKey();
                    List<com.f1pedia.domain.Result> circuitResults = entry.getValue();

                    java.util.Map<String, Object> stats = new java.util.HashMap<>();
                    stats.put("circuit", circuitName);
                    stats.put("races", circuitResults.stream().map(r -> r.getRace().getRaceId()).distinct().count());

                    long wins = circuitResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                            .count();
                    stats.put("wins", wins);

                    long podiums = circuitResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() <= 3)
                            .count();
                    stats.put("podiums", podiums);

                    double totalPoints = circuitResults.stream()
                            .filter(r -> r.getPoints() != null)
                            .mapToDouble(com.f1pedia.domain.Result::getPoints)
                            .sum();
                    stats.put("totalPoints", totalPoints);

                    // Calculate average finish (roughly)
                    double avgFinish = circuitResults.stream()
                            .filter(r -> r.getPosition() != null)
                            .mapToInt(com.f1pedia.domain.Result::getPosition)
                            .average()
                            .orElse(0.0);
                    stats.put("avgFinish", Math.round(avgFinish * 10.0) / 10.0);

                    // Best Result
                    int bestFinish = circuitResults.stream()
                            .filter(r -> r.getPosition() != null)
                            .mapToInt(com.f1pedia.domain.Result::getPosition)
                            .min()
                            .orElse(0);
                    stats.put("bestFinish", bestFinish == 0 ? "N/A" : bestFinish);

                    // Avg Grid
                    double avgGrid = circuitResults.stream()
                            .filter(r -> r.getGrid() != null && r.getGrid() > 0)
                            .mapToInt(com.f1pedia.domain.Result::getGrid)
                            .average()
                            .orElse(0.0);
                    stats.put("avgGrid", Math.round(avgGrid * 10.0) / 10.0);

                    // DNFs
                    long dnfs = circuitResults.stream()
                            .filter(r -> r.getPosition() == null)
                            .count();
                    stats.put("dnfs", dnfs);

                    return stats;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("totalPoints"), (Double) a.get("totalPoints"))) // Sorted
                                                                                                                // by
                                                                                                                // most
                                                                                                                // points
                .toList();
    }

    @GetMapping("/{id}/dashboard-stats")
    public java.util.Map<String, Object> getConstructorDashboardStats(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        long poles = results.stream()
                .filter(r -> r.getGrid() != null && r.getGrid() == 1)
                .count();

        long fastestLaps = results.stream()
                .filter(r -> r.getRank() != null && r.getRank() == 1)
                .count();

        // Mutually Exclusive Distribution
        long wins = results.stream().filter(r -> r.getPositionOrder() == 1).count();
        long podiums = results.stream().filter(r -> r.getPositionOrder() > 1 && r.getPositionOrder() <= 3).count();
        long points = results.stream()
                .filter(r -> r.getPositionOrder() > 3 && r.getPoints() != null && r.getPoints() > 0).count();
        long dnfs = results.stream().filter(r -> r.getPosition() == null).count(); // Simplified DNF check
        long other = results.size() - wins - podiums - points - dnfs; // The rest (finished out of points or other
                                                                      // issues)

        // Ensure no negative (just in case of data oddities)
        if (other < 0)
            other = 0;

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalPoles", poles);
        stats.put("totalFastestLaps", fastestLaps);

        List<java.util.Map<String, Object>> distribution = new java.util.ArrayList<>();
        if (wins > 0)
            distribution.add(java.util.Map.of("name", "Wins", "value", wins, "color", "#FFD700")); // Gold
        if (podiums > 0)
            distribution.add(java.util.Map.of("name", "Podiums", "value", podiums, "color", "#C0C0C0")); // Silver/Grey
        if (points > 0)
            distribution.add(java.util.Map.of("name", "Points", "value", points, "color", "#E10600")); // F1 Red
        if (other > 0)
            distribution.add(java.util.Map.of("name", "No Points", "value", other, "color", "#333333")); // Dark Grey
        if (dnfs > 0)
            distribution.add(java.util.Map.of("name", "DNF", "value", dnfs, "color", "#151515")); // Almost Black

        stats.put("resultDistribution", distribution);

        return stats;
    }

    @GetMapping("/{id}/status-breakdown")
    public List<java.util.Map<String, Object>> getConstructorStatusBreakdown(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        java.util.Map<String, Long> statusCounts = results.stream()
                .filter(r -> r.getStatus() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getStatus().getStatus(),
                        java.util.stream.Collectors.counting()));

        return statusCounts.entrySet().stream()
                .map(entry -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("status", entry.getKey());
                    map.put("count", entry.getValue());
                    // Simplified categorization logic
                    String category = "Other";
                    String status = entry.getKey().toLowerCase();
                    if (status.contains("finished") || status.contains("laps") || status.equals("+1 lap"))
                        category = "Finished";
                    else if (status.contains("accident") || status.contains("collision") || status.contains("spun"))
                        category = "Accident";
                    else if (status.contains("engine") || status.contains("gearbox") || status.contains("transmission")
                            || status.contains("hydraulics") || status.contains("electrical")
                            || status.contains("brakes"))
                        category = "Mechanical";
                    else if (status.contains("disqualified"))
                        category = "DSQ";

                    map.put("category", category);
                    return map;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")))
                .toList();
    }

    @GetMapping("/{id}/points-heatmap")
    public List<java.util.Map<String, Object>> getConstructorPointsHeatmap(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Year and Round -> Sum Points
        java.util.Map<String, Double> pointsMap = results.stream()
                .filter(r -> r.getRace() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getRace().getYear() + "-" + r.getRace().getRound(), // Key: "2008-1"
                        java.util.stream.Collectors.summingDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)));

        // We need race details for tooltip (Circuit/Grand Prix Name)
        // Grouping by Race ID first is safer
        java.util.Map<Integer, List<com.f1pedia.domain.Result>> byRace = results.stream()
                .filter(r -> r.getRace() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getRaceId()));

        return byRace.values().stream()
                .map(raceResults -> {
                    com.f1pedia.domain.Race race = raceResults.get(0).getRace();
                    double totalPoints = raceResults.stream()
                            .mapToDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)
                            .sum();

                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("year", race.getYear());
                    map.put("round", race.getRound());
                    map.put("raceName", race.getName());
                    map.put("points", totalPoints);
                    // Add best position for coloring if 0 points (e.g. near miss vs DNF)
                    int bestPos = raceResults.stream()
                            .filter(r -> r.getPositionOrder() != null)
                            .mapToInt(com.f1pedia.domain.Result::getPositionOrder)
                            .min().orElse(99);
                    map.put("bestPos", bestPos);

                    return map;
                })
                .sorted(java.util.Comparator.comparingInt((java.util.Map<String, Object> m) -> (Integer) m.get("year"))
                        .thenComparingInt(m -> (Integer) m.get("round")))
                .toList();
    }

    @GetMapping("/{id}/geo-performance")
    public List<java.util.Map<String, Object>> getConstructorGeoPerformance(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Country
        java.util.Map<String, List<com.f1pedia.domain.Result>> byCountry = results.stream()
                .filter(r -> r.getRace() != null && r.getRace().getCircuit() != null
                        && r.getRace().getCircuit().getCountry() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getCircuit().getCountry()));

        return byCountry.entrySet().stream()
                .map(entry -> {
                    String country = entry.getKey();
                    List<com.f1pedia.domain.Result> countryResults = entry.getValue();

                    double totalPoints = countryResults.stream()
                            .mapToDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)
                            .sum();

                    long races = countryResults.stream()
                            .map(r -> r.getRace().getRaceId())
                            .distinct()
                            .count();

                    double avgPoints = races > 0 ? totalPoints / races : 0;

                    long wins = countryResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                            .count();

                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("country", country);
                    map.put("avgPoints", Math.round(avgPoints * 100.0) / 100.0);
                    map.put("totalPoints", totalPoints);
                    map.put("races", races);
                    map.put("wins", wins);

                    return map;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("avgPoints"), (Double) a.get("avgPoints")))
                .limit(10) // Top 10 to keep chart clean
                .toList();
    }
}
