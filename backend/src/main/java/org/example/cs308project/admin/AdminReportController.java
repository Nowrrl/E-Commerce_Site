package org.example.cs308project.admin;

import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('SALES_MANAGER')")
public class AdminReportController {

    @Autowired private order_repository orderRepo;

    public static class ProfitDTO {
        public LocalDate date;
        public double revenue;
        public double cost;
        public double profit;
    }

    @GetMapping("/profit")
    public List<ProfitDTO> profitOverTime(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        // fetch all orders in [from, to]
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end   = to.plusDays(1).atStartOfDay();
        List<order_model> all = orderRepo.findByCreatedAtBetween(start, end);

        // group by day
        Map<LocalDate,List<order_model>> byDay = all.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().toLocalDate()));

        List<ProfitDTO> result = new ArrayList<>();
        for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) {
            double rev = 0, cost = 0;
            for (order_model o : byDay.getOrDefault(day, Collections.emptyList())) {
                rev  += o.getTotalPrice();
                cost += o.getTotalPrice() * 0.5; // default 50% cost
            }
            ProfitDTO dto = new ProfitDTO();
            dto.date    = day;
            dto.revenue = rev;
            dto.cost    = cost;
            dto.profit  = rev - cost;
            result.add(dto);
        }
        return result;
    }
}