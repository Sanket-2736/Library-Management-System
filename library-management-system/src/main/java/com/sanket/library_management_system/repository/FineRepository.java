
package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.model.Fine;
import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    @Query("""
            SELECT f FROM Fine f
            WHERE (:userId IS NULL OR f.user.id = :userId)
            AND (:status IS NULL OR f.status = :status)
            AND (:type IS NULL OR f.fineType = :type)
            ORDER BY f.createdAt DESC
            """)
    Page<Fine> findAllWithFilters(
            @Param("userId") Long userId,
            @Param("status") FineStatus status,
            @Param("type") FineType type,
            Pageable pageable
    );

    List<Fine> findByUserId(Long userId);
    List<Fine> findByUserIdAndFineType(Long userId, FineType fineType);
}
