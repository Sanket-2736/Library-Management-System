package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
