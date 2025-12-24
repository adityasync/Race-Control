package com.f1pedia.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
/**
 * Controller for health checks website routing.
 */
public class HealthController {

    /**
     * Forwards /health endpoint to a static HTML page.
     *
     * @return Forward string to health.html
     */
    @GetMapping("/health")
    public String health() {
        return "forward:/health.html";
    }
}
