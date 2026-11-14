
package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.model.BookLoan;
import com.sanket.library_management_system.model.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
@Repository
public interface BookLoanRepository extends JpaRepository<BookLoan, Long> {

    Page<BookLoan> findByUserId(
            Long userId,
            Pageable pageable
    );

    Page<BookLoan> findByUserIdAndStatus(
            Long userId,
            BookLoanStatus status,
            Pageable pageable
    );

    Page<BookLoan> findByStatus(
            BookLoanStatus status,
            Pageable pageable
    );

    Page<BookLoan> findByStatusAndUser(
            BookLoanStatus status,
            User user,
            Pageable pageable
    );

    @Query("""
            SELECT CASE WHEN COUNT(bl) > 0 THEN true ELSE false END
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND bl.book.id = :bookId
            AND bl.status IN ('CHECKED_OUT', 'OVERDUE')
            """)
    boolean hasActiveCheckout(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId
    );

    @Query("""
            SELECT COUNT(bl)
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND bl.status IN ('CHECKED_OUT', 'OVERDUE')
            """)
    long countActiveBookLoanByUser(
            @Param("userId") Long userId
    );

    @Query("""
            SELECT COUNT(bl)
            FROM BookLoan bl
            WHERE bl.user.id = :userId
            AND bl.status = 'OVERDUE'
            """)
    long countOverdueBookLoansByUser(
            @Param("userId") Long userId
    );

    @Query("""
            SELECT bl
            FROM BookLoan bl
            WHERE bl.dueDate < :currentDate
            AND bl.status IN ('CHECKED_OUT', 'OVERDUE')
            """)
    Page<BookLoan> findByOverdueBookLoans(
            @Param("currentDate") LocalDate currentDate,
            Pageable pageable
    );

    Page<BookLoan> findByBookId(
            Long bookId,
            Pageable pageable
    );

    @Query("""
            SELECT bl
            FROM BookLoan bl
            WHERE bl.checkoutDate BETWEEN :startDate AND :endDate
            """)
    Page<BookLoan> findBookLoanByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    boolean existsByUserIdAndBookIdAndStatus(Long userId, @NotNull(message = "Book ID is required!") Long bookId, BookLoanStatus bookLoanStatus);
}
