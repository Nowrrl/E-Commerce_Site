package org.example.cs308project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public APIs
                        .requestMatchers(HttpMethod.POST, "/user/register", "/user/login").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/comments/product/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/comments/add").permitAll()
                        .requestMatchers(HttpMethod.GET, "/comments/average-rating/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/comments/add-rating").permitAll()
                        .requestMatchers(HttpMethod.GET, "/comments/ratings/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/refunds/request").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers("/notifications/**").permitAll()



                        // ✅ Now allowing wishlist access publicly
                        .requestMatchers("/wishlist/**").permitAll()
                        .requestMatchers("/orders/**").permitAll()


                        // Cart also allowed publicly
                        .requestMatchers("/cart/**").permitAll()

                        // Admin access
                        .requestMatchers("/admin/**").hasAnyRole("PRODUCT_MANAGER", "SALES_MANAGER")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder encoder) {
        UserDetails pm = User.withUsername("alice")
                .password(encoder.encode("password"))
                .roles("PRODUCT_MANAGER")
                .build();
        UserDetails sm = User.withUsername("bob")
                .password(encoder.encode("password"))
                .roles("SALES_MANAGER")
                .build();
        return new InMemoryUserDetailsManager(pm, sm);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
