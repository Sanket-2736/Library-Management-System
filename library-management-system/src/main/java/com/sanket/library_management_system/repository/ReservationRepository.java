
package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.model.Reservation;
import com.sanket.library_management_system.payload.domains.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.book.id = :bookId
            AND r.status = com.sanket.library_management_system.payload.domains.ReservationStatus.PENDING
            ORDER BY r.reservedAt ASC
            """)
    List<Reservation> findPendingReservationsByBook(
            @Param("bookId") Long bookId
    );

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.book.id = :bookId
            AND r.status = com.sanket.library_management_system.payload.domains.ReservationStatus.PENDING
            ORDER BY r.reservedAt ASC
            """)
    List<Reservation> findNextPendingReservation(
            @Param("bookId") Long bookId,
            Pageable pageable
    );

    @Query("""
            SELECT COUNT(r) FROM Reservation r
            WHERE r.user.id = :userId
            AND r.status IN (
                com.sanket.library_management_system.payload.domains.ReservationStatus.PENDING,
                com.sanket.library_management_system.payload.domains.ReservationStatus.AVAILABLE
            )
            """)
    long countActiveReservationsByUser(
            @Param("userId") Long userId
    );

    @Query("""
            SELECT COUNT(r) FROM Reservation r
            WHERE r.book.id = :bookId
            AND r.status = com.sanket.library_management_system.payload.domains.ReservationStatus.PENDING
            """)
    long countPendingReservationsByBook(
            @Param("bookId") Long bookId
    );

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.status = com.sanket.library_management_system.payload.domains.ReservationStatus.AVAILABLE
            AND r.availableUntil < :currentDateTime
            """)
    List<Reservation> findExpiredReservations(
            @Param("currentDateTime") LocalDateTime currentDateTime
    );

    @Query("""
        SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
        FROM Reservation r
        WHERE r.user.id = :userId
        AND r.book.id = :bookId
        AND r.status IN (
            'AVAILABLE', 'PENDING'
        )
        """)
    boolean hasActiveReservation(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId
    );

    @Query("""
            SELECT r FROM Reservation r
            WHERE (:userId IS NULL OR r.user.id = :userId)
            AND (:bookId IS NULL OR r.book.id = :bookId)
            AND (:status IS NULL OR r.status = :status)
            AND (
                :activeOnly = false
                OR r.status IN (
                    'PENDING',
                    'AVAILABLE'
                )
            )
            """)
    Page<Reservation> searchReservationsWithFilters(
            @Param("userId") Long userId,
            @Param("bookId") Long bookId,
            @Param("status") ReservationStatus status,
            @Param("activeOnly") boolean activeOnly,
            Pageable pageable
    );
}
