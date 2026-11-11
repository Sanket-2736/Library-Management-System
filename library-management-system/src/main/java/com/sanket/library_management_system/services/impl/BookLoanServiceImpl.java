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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

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
    public BookLoanDTO checkoutBook(CheckoutRequest request) throws Exception {
        User user = userService.getCurrentUser();

        return checkoutBookForUser(user.getId(), request);
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
    public BookLoanDTO checkinBook(CheckinRequest request) throws BookException {
        BookLoan bookLoan = bookLoanRepository.findById(request.getBookLoanId())
                .orElseThrow(
                        () -> new BookException("Book Loan not found!")
                );

        if(!bookLoan.isActive()) throw new BookException("Bookloan is not active!");

        bookLoan.setReturnDate(LocalDate.now());

        BookLoanStatus condition = request.getCondition();

        if(condition == null) condition = BookLoanStatus.RETURNED;

        bookLoan.setOverdueDays(0);
        bookLoan.setIsOverdue(false);
        bookLoan.setNotes("Book returned by user at " + LocalDateTime.now().toString());

        if(condition != BookLoanStatus.LOST){
            Book book = bookLoan.getBook();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }

        BookLoan saved = bookLoanRepository.save(bookLoan);

        return BookLoanMapper.toDTO(saved);
    }

    @Override
    public BookLoanDTO renewCheckout(RenewalRequest request) throws BookException {
        BookLoan bookLoan = bookLoanRepository.findById(request.getBookLoanId())
                .orElseThrow(
                        () -> new BookException("Book loan not found!")
                );

        if(!bookLoan.canRenew()) throw new BookException("Book loan can't be renewed!");

        if(bookLoan.getRenewalCount() == null) {
            throw new BookException("Invalid renewal count!");
        }

        bookLoan.setDueDate(bookLoan.getDueDate().plusDays(request.getExtensionDays()));

        bookLoan.setRenewalCount(bookLoan.getRenewalCount() + 1);

        bookLoan.setNotes("Book renewd by user.");

        BookLoan saved = bookLoanRepository.save(bookLoan);
        return BookLoanMapper.toDTO(saved);
    }

    @Override
    public PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest request) throws UserException {
        Pageable pageable = createPageable(
                request.getPage(),
                request.getSize(),
                request.getSortBy(),
                request.getSortDirection()
        );

        Page<BookLoan> bookLoanPage;

        if(Boolean.TRUE.equals(request.getOverdueOnly())){
            bookLoanPage = bookLoanRepository.findByOverdueBookLoans(LocalDate.now(), pageable);
        } else if (request.getUserId() != null) {
            bookLoanPage = bookLoanRepository.findByUserId(request.getUserId(), pageable);
        } else if (request.getBookId() != null) {
            bookLoanPage = bookLoanRepository.findByBookId(request.getBookId(), pageable);
        } else if (request.getStartDate() != null && request.getEndDate() != null) {
            bookLoanPage = bookLoanRepository.findBookLoanByDateRange(request.getStartDate(), request.getEndDate(), pageable);
        } else {
            bookLoanPage = bookLoanRepository.findAll(pageable);
        }

        return convertToPageResponse(bookLoanPage);
    }

    @Override
    public PageResponse<BookLoanDTO> getMyBookLoans(BookLoanStatus status, int page, int size) throws UserException {
        User user = userService.getCurrentUser();
        Page<BookLoan> bookLoanPage;

        if(status != null){
            Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
            bookLoanPage = bookLoanRepository.findByStatusAndUser(status, user, pageable);
        } else {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            bookLoanPage = bookLoanRepository.findByUserId(user.getId(), pageable);
        }
        return convertToPageResponse(bookLoanPage);
    }

    @Override
    public int updateOverdueBookLoan() {
        Pageable pageable = PageRequest.of(0, 1000);
        Page<BookLoan> overduePage = bookLoanRepository.findByOverdueBookLoans(LocalDate.now(), pageable);

        int updateCount = 0;

        for(BookLoan bookLoan : overduePage.getContent()){
            if(bookLoan.getStatus() == BookLoanStatus.CHECKED_OUT){
                bookLoan.setStatus(BookLoanStatus.OVERDUE);
                bookLoan.setIsOverdue(true);

                int overdueDays = calculateOverdueDate(bookLoan.getDueDate(), LocalDate.now());

//                int overdueDays = fineCalculationService.calculateOverdueDays(
//                        bookLoan.getDueDate(), LocalDate.now()
//                );
                bookLoan.setOverdueDays(overdueDays);
//
//                BigDecimal fine = fineCalculationService.calculateOverdueFine(bookLoan);
                updateCount++;
            }
        }
        return updateCount;
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDirection){
        size = Math.min(size, 100);
        size = Math.max(size, 1);

        Sort sort = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }

    private PageResponse<BookLoanDTO> convertToPageResponse(Page<BookLoan> bookLoanPage){
        List<BookLoanDTO> bookLoanDTOS = bookLoanPage.getContent()
                .stream().map(BookLoanMapper::toDTO).toList();

        return new PageResponse<>(
                bookLoanDTOS,
                bookLoanPage.getNumber(),
                bookLoanPage.getSize(),
                bookLoanPage.getTotalElements(),
                bookLoanPage.getTotalPages(),
                bookLoanPage.isLast(),
                bookLoanPage.isFirst(),
                bookLoanPage.isEmpty()
        );
    }

    public int calculateOverdueDate(LocalDate dueDate, LocalDate today){
        if(today.isBefore(dueDate) || today.isEqual(dueDate)) return 0;

        return (int) ChronoUnit.DAYS.between(dueDate, today);
    }
}
