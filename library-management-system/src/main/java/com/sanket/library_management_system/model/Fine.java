package com.sanket.library_management_system.model;

import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false)
    private BookLoan bookLoan;

    @Enumerated(EnumType.STRING)
    private FineType fineType;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    private FineStatus status;

    @Column(length = 500)
    private String reason;

    @Column(length = 1000)
    private String notes;

    @JoinColumn(name = "waived_by")
    @ManyToOne(fetch = FetchType.LAZY)
    private User waivedBy;

    @Column(name = "waiver_reason", length = 500)
    private String waiverReason;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_user_id")
    private User processedBy;

    @Column(length = 100, name = "transaction_id")
    private String transactionId;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime waivedAt;

    public void applyPayment(Long paymentAmount){
        if(paymentAmount == null || paymentAmount <= 0)
            throw new RuntimeException("Payment amount must be positive!");

        this.status = FineStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void waive(User currentAdmin, @NotNull(message = "Reason is required!") String reason) throws UserException {
        if(!currentAdmin.getRole().equals(UserRole.ROLE_ADMIN))
            throw new UserException("Only admins can waive fine!");

        this.status = FineStatus.WAIVED;
        this.waiverReason = reason;
        this.waivedBy = currentAdmin;
        this.waivedAt = LocalDateTime.now();
    }
}
