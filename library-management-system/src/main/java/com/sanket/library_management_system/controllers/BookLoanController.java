package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.request.BookLoanSearchRequest;
import com.sanket.library_management_system.payload.request.CheckinRequest;
import com.sanket.library_management_system.payload.request.CheckoutRequest;
import com.sanket.library_management_system.payload.request.RenewalRequest;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.BookLoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/book-loans")
@RequiredArgsConstructor
public class BookLoanController {

    @Autowired
    private final BookLoanService bookLoanService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkoutBook(
            @Valid @RequestBody CheckoutRequest request
            ){
        try {
            log.info("Checkout request recieved for bookloan id: {}", request.getBookId());
            return new ResponseEntity<>(bookLoanService.checkoutBook(request), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/checkout/user/{userId}")
    public ResponseEntity<?> checkoutBookForUser(
            @PathVariable Long userId,
            @Valid @RequestBody CheckoutRequest request
    ) throws Exception {
        return new ResponseEntity<>(bookLoanService.checkoutBookForUser(userId, request), HttpStatus.CREATED);
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(
            @Valid @RequestBody CheckinRequest request
            ) throws Exception {
        return new ResponseEntity<>(bookLoanService.
                checkinBook(request), HttpStatus.OK);
    }

    @PostMapping("/renew")
    public ResponseEntity<?> renew(
            @Valid @RequestBody RenewalRequest request
            ) throws BookException {
        return new ResponseEntity<>(
                bookLoanService.renewCheckout(request),
                HttpStatus.OK
        );
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookLoans(
            @RequestParam(required = false)BookLoanStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
            ) throws UserException {
        return new ResponseEntity<>(
                bookLoanService.getMyBookLoans(status, page, size),
                HttpStatus.OK
        );
    }

    @PostMapping("/admin/search")
    public ResponseEntity<?> getAllBookLoans(
            @RequestBody BookLoanSearchRequest request
            ){
        try {
            return ResponseEntity.ok(
                    bookLoanService.getBookLoans(request)
            );
        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            new ApiResponse("Failed to search loans: " + e.getMessage(), false)
                    );
        }
    }

    @PostMapping("/admin/update-overdue")
    public ResponseEntity<?> updateOverdueBookLoans(){
        int updateCount = bookLoanService.updateOverdueBookLoan();

        return ResponseEntity.ok(new ApiResponse("Overdue book loans are updated!", true));
    }
}
