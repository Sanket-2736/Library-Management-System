package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.domain.BookLoanType;
import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.BookLoanMapper;
import com.sanket.library_management_system.model.Book;
import com.sanket.library_management_system.model.BookLoan;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.BookLoanDTO;
import com.sanket.library_management_system.payload.dto.SubscriptionDTO;
import com.sanket.library_management_system.payload.request.BookLoanSearchRequest;
import com.sanket.library_management_system.payload.request.CheckinRequest;
import com.sanket.library_management_system.payload.request.CheckoutRequest;
import com.sanket.library_management_system.payload.request.RenewalRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.repository.BookLoanRepository;
import com.sanket.library_management_system.repository.BookRepository;
import com.sanket.library_management_system.services.BookLoanService;
import com.sanket.library_management_system.services.SubscriptionService;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BookLoanServiceImpl implements BookLoanService {

    @Autowired
    private final BookLoanRepository bookLoanRepository;

    @Autowired
    private final UserService userService;

    @Autowired
    private final BookRepository bookRepository;

    @Autowired
    private final SubscriptionService subscriptionService;

    @Override
    public BookLoanDTO checkoutBook(CheckoutRequest request) {
        return null;
    }

    @Override
    public BookLoanDTO checkoutBookForUser(Long userId, CheckoutRequest request) throws Exception {

        User user = userService.findById(userId);
        SubscriptionDTO subscription = subscriptionService.getUsersActiveSubscription(userId);

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(
                        () -> new BookException("Requested book not found!")
                );


        if(!book.getActive()) throw new BookException("Book is not active!");
        if(book.getAvailableCopies() <= 0) throw new BookException("Book is not available!");

        if (bookLoanRepository.hasActiveCheckout(userId, book.getId())) throw new BookException("Book already has an active checkout");

        long activeCheckout = bookLoanRepository.countActiveBookLoanByUser(userId);

        int maxBooksAllowed = subscription.getMaxBooksAllowed();

        if(activeCheckout >= maxBooksAllowed) throw new Exception("You have reached your maximum limit of books allowed!");

        long overdueCount = bookLoanRepository.countOverdueBookLoansByUser(userId);

        if(overdueCount > 0) throw new Exception("First return old overdue book!");

        BookLoan bookLoan = BookLoan
                .builder()
                .user(user)
                .book(book)
                .type(BookLoanType.CHECKOUT)
                .status(BookLoanStatus.CHECKED_OUT)
                .checkoutDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(request.getCheckoutDays()))
                .renewalCount(0)
                .maxRenewals(2)
                .notes(request.getNotes())
                .isOverdue(false)
                .overdueDays(0)
                .build();

        book.setAvailableCopies(book.getAvailableCopies() - 1);

        bookRepository.save(book);

        bookLoan = bookLoanRepository.save(bookLoan);

        return BookLoanMapper.toDTO(bookLoan);
    }

    @Override
    public BookLoanDTO checkinBook(CheckinRequest request) {
        return null;
    }

    @Override
    public BookLoanDTO renewCheckout(RenewalRequest request) {
        return null;
    }

    @Override
    public PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest request) {
        return null;
    }

    @Override
    public PageResponse<BookLoanDTO> getMyBookLoans(BookLoanStatus status, int page, int size) {
        return null;
    }

    @Override
    public int updateOverdueBookLoan() {
        return 0;
    }
}
