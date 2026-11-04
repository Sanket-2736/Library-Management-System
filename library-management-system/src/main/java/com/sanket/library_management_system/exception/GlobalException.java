package com.sanket.library_management_system.exception;

import com.sanket.library_management_system.payload.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler({
            GenreException.class,
            BookException.class,
            Exception.class,
            UserException.class,
            EmailException.class
    })
    public ResponseEntity<ApiResponse> handleException(GenreException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
    }
}
