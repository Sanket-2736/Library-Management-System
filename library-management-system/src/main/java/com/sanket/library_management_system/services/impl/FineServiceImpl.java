
package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.FineMapper;
import com.sanket.library_management_system.model.BookLoan;
import com.sanket.library_management_system.model.Fine;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import com.sanket.library_management_system.payload.domains.PaymentGateway;
import com.sanket.library_management_system.payload.domains.PaymentType;
import com.sanket.library_management_system.payload.dto.FineDTO;
import com.sanket.library_management_system.payload.request.CreateFineRequest;
import com.sanket.library_management_system.payload.request.PaymentInitiateRequest;
import com.sanket.library_management_system.payload.request.WaiveFineRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;
import com.sanket.library_management_system.repository.BookLoanRepository;
import com.sanket.library_management_system.repository.FineRepository;
import com.sanket.library_management_system.services.FineService;
import com.sanket.library_management_system.services.PaymentService;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final BookLoanRepository bookLoanRepository;
    private final UserService userService;
    private final PaymentService paymentService;

    @Override
    public FineDTO createFine(CreateFineRequest request) throws BookException {

        BookLoan bookLoan = bookLoanRepository.findById(request.getBookLoanId())
                .orElseThrow(() -> new BookException("Book Loan not found!"));

        Fine fine = Fine.builder()
                .bookLoan(bookLoan)
                .user(bookLoan.getUser())
                .fineType(request.getFineType())
                .amount(request.getAmount())
                .status(FineStatus.PENDING)
                .reason(request.getReason())
                .notes(request.getNotes())
                .build();

        fine = fineRepository.save(fine);

        return FineMapper.toDTO(fine);
    }

    @Override
    public PaymentInitiateResponse payFine(long fineId, String transactionId) throws Exception {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new Exception("Fine not found!"));

        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new Exception("Fine is waived!");
        }

        if (fine.getStatus() == FineStatus.PAID) {
            throw new Exception("Fine already paid!");
        }

        User user = userService.getCurrentUser();

        if (!fine.getUser().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to pay this fine!");
        }

        PaymentInitiateRequest request = PaymentInitiateRequest.builder()
                .userId(user.getId())
                .fineId(fineId)
                .paymentType(PaymentType.FINE)
                .gateway(PaymentGateway.RAZORPAY)
                .amount(fine.getAmount())
                .description("Library fine payment!")
                .build();

        return paymentService.initiatePayment(request);
    }

    @Override
    public void markFineAsPaid(Long fineId, Long amount, String transactionId) throws Exception {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new Exception("Fine not found!"));

        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new Exception("Cannot pay a waived fine!");
        }

        if (fine.getStatus() == FineStatus.PAID) {
            throw new Exception("Fine already paid!");
        }

        if (amount == null || amount <= 0 || !amount.equals(fine.getAmount())) {
            throw new Exception("Invalid payment amount!");
        }

        if (transactionId == null || transactionId.isBlank()) {
            throw new Exception("Transaction ID is required!");
        }

        fine.applyPayment(amount);
        fine.setTransactionId(transactionId);

        fineRepository.save(fine);
    }

    @Override
    public FineDTO waiveFine(WaiveFineRequest request) throws Exception {

        Fine fine = fineRepository.findById(request.getFineId())
                .orElseThrow(() -> new Exception("Fine not found!"));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new Exception("Fine is already paid!");
        }

        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new Exception("Fine is already waived!");
        }

        User currentAdmin = userService.getCurrentUser();

        fine.waive(currentAdmin, request.getReason());

        fine = fineRepository.save(fine);

        return FineMapper.toDTO(fine);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineDTO> getMyFines(FineStatus status, FineType type) throws UserException {

        User currentUser = userService.getCurrentUser();

        List<Fine> fines;

        if (status != null && type != null) {

            fines = fineRepository.findByUserId(currentUser.getId())
                    .stream()
                    .filter(f -> f.getStatus() == status && f.getFineType() == type)
                    .toList();

        } else if (status != null) {

            fines = fineRepository.findByUserId(currentUser.getId())
                    .stream()
                    .filter(f -> f.getStatus() == status)
                    .toList();

        } else if (type != null) {

            fines = fineRepository.findByUserIdAndFineType(
                    currentUser.getId(), type
            );

        } else {

            fines = fineRepository.findByUserId(currentUser.getId());
        }

        return fines.stream()
                .map(FineMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FineDTO> getAllFines(
            FineStatus status,
            FineType type,
            Long userId,
            int page,
            int size
    ) {

        if (page < 0) {
            page = 0;
        }

        size = Math.max(1, Math.min(size, 100));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        Page<Fine> finePage = fineRepository.findAllWithFilters(
                userId,
                status,
                type,
                pageable
        );

        return convertToPageResponse(finePage);
    }

    private PageResponse<FineDTO> convertToPageResponse(Page<Fine> finePage) {

        List<FineDTO> fineDTOs = finePage.getContent()
                .stream()
                .map(FineMapper::toDTO)
                .toList();

        return new PageResponse<>(
                fineDTOs,
                finePage.getNumber(),
                finePage.getSize(),
                finePage.getTotalElements(),
                finePage.getTotalPages(),
                finePage.isLast(),
                finePage.isFirst(),
                finePage.isEmpty()
        );
    }
}
