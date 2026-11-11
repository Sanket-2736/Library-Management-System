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
            log.info("Checkout request received for book id: {}", request.getBookId());
            var response = bookLoanService.checkoutBook(request);
            log.info("Checkout successful for book id: {}", request.getBookId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Checkout failed for book id: {}, Error: {}", request.getBookId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/checkout/user/{userId}")
    public ResponseEntity<?> checkoutBookForUser(
            @PathVariable Long userId,
            @Valid @RequestBody CheckoutRequest request
    ) {
        try {
            log.info("Checkout request received for user id: {} and book id: {}", userId, request.getBookId());
            var response = bookLoanService.checkoutBookForUser(userId, request);
            log.info("Checkout successful for user id: {} and book id: {}", userId, request.getBookId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Checkout failed for user id: {} and book id: {}, Error: {}", userId, request.getBookId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(
            @Valid @RequestBody CheckinRequest request
            ) {
        try {
            log.info("Checkin request received for book loan id: {}", request.getBookLoanId());
            var response = bookLoanService.checkinBook(request);
            log.info("Checkin successful for book loan id: {}", request.getBookLoanId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Checkin failed for book loan id: {}, Error: {}", request.getBookLoanId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/renew")
    public ResponseEntity<?> renew(
            @Valid @RequestBody RenewalRequest request
            ) {
        try {
            log.info("Renewal request received for book loan id: {}", request.getBookLoanId());
            var response = bookLoanService.renewCheckout(request);
            log.info("Renewal successful for book loan id: {}", request.getBookLoanId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Renewal failed for book loan id: {}, Error: {}", request.getBookLoanId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookLoans(
            @RequestParam(required = false)BookLoanStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
            ) {
        try {
            log.info("Fetching user's book loans with status: {}, page: {}, size: {}", status, page, size);
            var response = bookLoanService.getMyBookLoans(status, page, size);
            log.info("Successfully fetched user's book loans");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            log.error("Failed to fetch user's book loans, Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/admin/search")
    public ResponseEntity<?> getAllBookLoans(
            @RequestBody BookLoanSearchRequest request
            ){
        try {
            log.info("Admin search book loans requested with filters: userId={}, bookId={}, overdueOnly={}", 
                    request.getUserId(), request.getBookId(), request.getOverdueOnly());
            var response = bookLoanService.getBookLoans(request);
            log.info("Book loans search completed, found {} records", response.getTotalElements());
            return ResponseEntity.ok(response);
        } catch (UserException e) {
            log.error("Admin book loans search failed, Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to search loans: " + e.getMessage(), false));
        }
    }

    @PostMapping("/admin/update-overdue")
    public ResponseEntity<?> updateOverdueBookLoans(){
        try {
            log.info("Admin initiated update of overdue book loans");
            int updateCount = bookLoanService.updateOverdueBookLoan();
            log.info("Successfully updated {} overdue book loans", updateCount);
            return ResponseEntity.ok(new ApiResponse("Overdue book loans are updated! Updated count: " + updateCount, true));
        } catch (Exception e) {
            log.error("Failed to update overdue book loans, Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to update overdue loans: " + e.getMessage(), false));
        }
    }
}
