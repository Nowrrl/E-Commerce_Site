package org.example.cs308project.products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.cs308project.categories.category_model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products_table")
@Getter
@Setter
public class product_model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String model;

    @Column(name = "approved_by_sales")
    private boolean approvedBySales = false;

    @Column(nullable = false)
    private int soldCount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private category_model category;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String warrantyStatus;

    @Column(nullable = false)
    private String distributorInfo;


    public boolean isApprovedBySales() {
        return approvedBySales;
    }

    public void setApprovedBySales(boolean approvedBySales) {
        this.approvedBySales = approvedBySales;
    }

}
