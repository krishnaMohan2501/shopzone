package com.shopzone.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    // Forward all non-API, non-static paths to index.html so React Router handles them.
    // The regex [^\\.] matches paths without a dot, excluding static assets (.js, .css, .ico, etc.)
    @GetMapping(value = {
        "/{path:[^\\.]*}",
        "/{p1:[^\\.]*}/{p2:[^\\.]*}",
        "/{p1:[^\\.]*}/{p2:[^\\.]*}/{p3:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
