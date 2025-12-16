package com.f1pedia.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "forward:/health.html";
    }
}
