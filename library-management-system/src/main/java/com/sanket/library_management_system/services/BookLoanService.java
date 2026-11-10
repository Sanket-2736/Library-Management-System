package com.sanket.library_management_system.services;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.Book;
import com.sanket.library_management_system.payload.dto.BookLoanDTO;
import com.sanket.library_management_system.payload.request.BookLoanSearchRequest;
import com.sanket.library_management_system.payload.request.CheckinRequest;
import com.sanket.library_management_system.payload.request.CheckoutRequest;
import com.sanket.library_management_system.payload.request.RenewalRequest;
import com.sanket.library_management_system.payload.response.PageResponse;

public interface BookLoanService {
    BookLoanDTO checkoutBook(CheckoutRequest request);
    BookLoanDTO checkoutBookForUser(Long userId, CheckoutRequest request) throws Exception;
    BookLoanDTO checkinBook(CheckinRequest request);
    BookLoanDTO renewCheckout(RenewalRequest request);
    PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest request);
    PageResponse<BookLoanDTO> getMyBookLoans(BookLoanStatus status, int page, int size);
    int updateOverdueBookLoan();
}
