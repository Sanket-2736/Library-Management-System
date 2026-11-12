
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import com.sanket.library_management_system.payload.dto.FineDTO;
import com.sanket.library_management_system.payload.request.CreateFineRequest;
import com.sanket.library_management_system.payload.request.WaiveFineRequest;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;
import com.sanket.library_management_system.services.FineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fine")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FineDTO> createFine(
            @Valid @RequestBody CreateFineRequest request
    ) throws Exception {
        FineDTO fineDTO = fineService.createFine(request);
        return new ResponseEntity<>(fineDTO, HttpStatus.CREATED);
    }

    @PostMapping("/{fineId}/pay")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentInitiateResponse> payFine(
            @PathVariable Long fineId
    ) throws Exception {
        PaymentInitiateResponse response = fineService.payFine(fineId, null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/waive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FineDTO> waiveFine(
            @Valid @RequestBody WaiveFineRequest request
    ) throws Exception {
        FineDTO fineDTO = fineService.waiveFine(request);
        return ResponseEntity.ok(fineDTO);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FineDTO>> getMyFines(
            @RequestParam(required = false) FineStatus status,
            @RequestParam(required = false) FineType type
    ) throws UserException {
        List<FineDTO> fines = fineService.getMyFines(status, type);
        return ResponseEntity.ok(fines);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<FineDTO>> getAllFines(
            @RequestParam(required = false) FineStatus status,
            @RequestParam(required = false) FineType type,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<FineDTO> response = fineService.getAllFines(
                status,
                type,
                userId,
                page,
                size
        );

        return ResponseEntity.ok(response);
    }
}
