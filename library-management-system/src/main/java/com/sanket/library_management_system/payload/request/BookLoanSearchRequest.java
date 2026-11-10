package com.sanket.library_management_system.payload.request;

import com.sanket.library_management_system.domain.BookLoanStatus;

import java.time.LocalDate;

public class BookLoanSearchRequest {

    private Long userId;
    private Long bookId;
    private BookLoanStatus status;
    private Boolean overdueOnly;
    private Boolean unpaidFinesOnly;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
}
