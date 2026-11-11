package com.sanket.library_management_system.model;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.domain.BookLoanType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class BookLoan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JoinColumn(nullable = false)
    @ManyToOne
    private User user;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookLoanType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookLoanStatus status;

    @Column(name="checkout_date", nullable = false)
    private LocalDate checkoutDate;

    @Column(nullable = true)
    private LocalDate returnDate;

    @Column(nullable = false)
    private Integer renewalCount= 0;

    @Column(nullable = false)
    private Integer maxRenewals = 2;

//    private Boolean isActive = false;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private Boolean isOverdue = false;

    @Column(nullable = false)
    private Integer overdueDays = 0;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false, updatable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

//    @Column(nullable = false)
    private LocalDate dueDate;

    public Boolean isActive(){
        return status == BookLoanStatus.OVERDUE || status == BookLoanStatus.CHECKED_OUT;
    }

    public boolean canRenew(){
        return status == BookLoanStatus.CHECKED_OUT && !isOverdue && renewalCount < maxRenewals;
    }
}
