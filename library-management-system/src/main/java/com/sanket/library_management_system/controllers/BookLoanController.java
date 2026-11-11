
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/book-loans")
@RequiredArgsConstructor
public class BookLoanController {

    private final BookLoanService bookLoanService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkoutBook(
            @Valid @RequestBody CheckoutRequest request
    ) {
        try {
            log.info("Checkout request received for book ID: {}", request.getBookId());

            ResponseEntity<?> response = new ResponseEntity<>(
                    bookLoanService.checkoutBook(request),
                    HttpStatus.CREATED
            );

            log.info("Book checkout completed successfully for book ID: {}", request.getBookId());

            return response;
        } catch (Exception e) {
            log.error("Book checkout failed for book ID: {}. Error: {}",
                    request.getBookId(), e.getMessage(), e);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/checkout/user/{userId}")
    public ResponseEntity<?> checkoutBookForUser(
            @PathVariable Long userId,
            @Valid @RequestBody CheckoutRequest request
    ) throws Exception {

        log.info("Admin checkout request received for user ID: {}, book ID: {}",
                userId, request.getBookId());

        Object response = bookLoanService.checkoutBookForUser(userId, request);

        log.info("Book checkout completed successfully for user ID: {}, book ID: {}",
                userId, request.getBookId());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(
            @Valid @RequestBody CheckinRequest request
    ) throws Exception {

        log.info("Book checkin request received");

        Object response = bookLoanService.checkinBook(request);

        log.info("Book checkin completed successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/renew")
    public ResponseEntity<?> renew(
            @Valid @RequestBody RenewalRequest request
    ) throws BookException {

        log.info("Book loan renewal request received");

        Object response = bookLoanService.renewCheckout(request);

        log.info("Book loan renewed successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookLoans(
            @RequestParam(required = false) BookLoanStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) throws UserException {

        log.info("Request received to fetch user's book loans. Status: {}, Page: {}, Size: {}",
                status, page, size);

        Object response = bookLoanService.getMyBookLoans(status, page, size);

        log.info("Successfully fetched user's book loans");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/admin/search")
    public ResponseEntity<?> getAllBookLoans(
            @RequestBody BookLoanSearchRequest request
    ) {
        try {
            log.info("Admin request received to search book loans");

            Object response = bookLoanService.getBookLoans(request);

            log.info("Book loan search completed successfully");

            return ResponseEntity.ok(response);
        } catch (UserException e) {
            log.error("Failed to search book loans. Error: {}", e.getMessage(), e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to search loans: " + e.getMessage(), false));
        }
    }

    @PostMapping("/admin/update-overdue")
    public ResponseEntity<?> updateOverdueBookLoans() {

        log.info("Request received to update overdue book loans");

        int updateCount = bookLoanService.updateOverdueBookLoan();

        log.info("Overdue book loan update completed. Number of loans updated: {}", updateCount);

        return ResponseEntity.ok(new ApiResponse("Overdue book loans are updated!", true));
    }
}
