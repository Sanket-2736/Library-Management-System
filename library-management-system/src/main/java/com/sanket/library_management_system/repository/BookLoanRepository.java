
package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.model.BookLoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookLoanRepository extends JpaRepository<BookLoan, Long> {

    Page<BookLoan> findByUserId(Long userId, Pageable pageable);

    Page<BookLoan> findByUserIdAndStatus(
            Long userId,
            BookLoanStatus status,
            Pageable pageable
    );

    Page<BookLoan> findByStatus(
            BookLoanStatus status,
            Pageable pageable
    );

    @Query("""
            SELECT CASE WHEN COUNT(bl) > 0 THEN true ELSE false END
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND bl.book.id = :bookId
            AND (bl.status = 'CHECKED_OUT' OR bl.status = 'OVERDUE')
            """)
    boolean hasActiveCheckout(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId
    );

    @Query("""
            SELECT COUNT(bl)
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND (bl.status = 'CHECKED_OUT' OR bl.status = 'OVERDUE')
            """)
    long countActiveBookLoanByUser(@Param("userId") Long userId);

    @Query("""
            SELECT COUNT(bl)
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND bl.status = 'OVERDUE'
            """)
    long countOverdueBookLoansByUser(@Param("userId") Long userId);
}
