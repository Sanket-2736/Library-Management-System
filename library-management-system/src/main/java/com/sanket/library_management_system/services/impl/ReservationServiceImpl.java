package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.ReservationMapper;
import com.sanket.library_management_system.model.Book;
import com.sanket.library_management_system.model.Reservation;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.domains.ReservationStatus;
import com.sanket.library_management_system.payload.dto.ReservationDTO;
import com.sanket.library_management_system.payload.request.CheckoutRequest;
import com.sanket.library_management_system.payload.request.ReservationRequest;
import com.sanket.library_management_system.payload.request.ReservationSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.repository.BookLoanRepository;
import com.sanket.library_management_system.repository.BookRepository;
import com.sanket.library_management_system.repository.ReservationRepository;
import com.sanket.library_management_system.services.BookLoanService;
import com.sanket.library_management_system.services.ReservationService;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private final ReservationRepository repository;

    @Autowired
    private final UserService userService;

    @Autowired
    private final BookRepository bookRepository;

    @Autowired
    private final ReservationRepository reservationRepository;

    @Autowired
    private final BookLoanRepository bookLoanRepository;

    @Autowired
    private final BookLoanService bookLoanService;

    @Override
    public ReservationDTO createReservation(ReservationRequest request) {
        return null;
    }

    @Override
    public ReservationDTO createReservationForUser(ReservationRequest request, Long userId) throws Exception {
        boolean alreadyHasBookLoan = bookLoanRepository.existsByUserIdAndBookIdAndStatus(userId, request.getBookId(), BookLoanStatus.CHECKED_OUT);

        if(alreadyHasBookLoan)
            throw new BookException("User already has a book loan!");

        User user = userService.getCurrentUser();

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookException("Requested book not found!"));

        if(reservationRepository.hasActiveReservation(userId, book.getId()))
            throw new BookException("You have already reservation for this book!");

        if(book.getAvailableCopies() > 0)
            throw new BookException("Book is already available!");


        long activeReservations = reservationRepository.countActiveReservationsByUser(userId);

        if(activeReservations >= 5) throw new Exception("Maximum reservation limits reached!");

        Reservation reservation = Reservation.builder()
                .user(user)
                .book(book)
                .status(ReservationStatus.PENDING)
                .reservedAt(LocalDateTime.now())
                .notificationSent(false)
                .notes(request.getNotes())
                .build();

        long pendingCount = reservationRepository.countPendingReservationsByBook(book.getId());

        reservation.setQueuePosition((int)pendingCount + 1);

        reservation = reservationRepository.save(reservation);

        return ReservationMapper.toDTO(reservation);
    }

    @Override
    public ReservationDTO cancelReservation(Long reservationId) throws Exception {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new Exception("Reservation not found!"));

        User user = userService.getCurrentUser();

        if(
                !reservation.getUser().getId().equals(user.getId()) &&
                        user.getRole() != UserRole.ROLE_ADMIN
        ) {
            throw new Exception("Only admins allowed to cancel the reservation");
        }

        if(!reservation.canBeCancelled())
            throw new Exception("Reservation cannot be cancellled!");

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());

        reservation = reservationRepository.save(reservation);

        return ReservationMapper.toDTO(reservation);
    }

    @Override
    public ReservationDTO fulfillReservation(Long reservationId) throws Exception {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new Exception("Reservation not found!"));

        if(reservation.getBook().getAvailableCopies() <= 0)
            throw new BookException("Reservation is not availabledue to book unavailability!");

        reservation.setStatus(ReservationStatus.FULFILLED);
        reservation.setFulfilledAt(LocalDateTime.now());

        reservation = reservationRepository.save(reservation);

        CheckoutRequest checkoutRequest = CheckoutRequest.builder()
                .bookId(reservation.getBook().getId())
                .notes("Assign book by admin!")
                .build();

        bookLoanService.checkoutBookForUser(reservation.getUser().getId(), checkoutRequest);

        return ReservationMapper.toDTO(reservation);
    }

    @Override
    public PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest request) {
        return null;
    }

    @Override
    public PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest request) {

        Sort sort = "ASC".equalsIgnoreCase(request.getSortDirection())
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();

        Pageable pageable = PageRequest.of(
                Math.max(0, request.getPage()),
                Math.max(1, Math.min(request.getSize(), 100)),
                sort
        );

        Page<Reservation> reservationPage =
                reservationRepository.searchReservationsWithFilters(
                        request.getUserId(),
                        request.getBookId(),
                        request.getStatus(),
                        request.getActiveOnly() != null && request.getActiveOnly(),
                        pageable
                );

        return buildPageResponse(reservationPage);
    }

    private PageResponse<ReservationDTO> buildPageResponse(Page<Reservation> reservationPage) {
        List<ReservationDTO> dtos = reservationPage.getContent()
                .stream().map(ReservationMapper::toDTO).toList();

        PageResponse<ReservationDTO> response = new PageResponse<>();
        response.setContent(dtos);
        response.setPageNumber(reservationPage.getNumber());
        response.setPageSize(reservationPage.getSize());
        response.setTotalElements(reservationPage.getTotalElements());
        response.setTotalPages(reservationPage.getTotalPages());
        response.setLast(reservationPage.isLast());

        return response;
    }
}
