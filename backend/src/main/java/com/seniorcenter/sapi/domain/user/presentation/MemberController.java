package com.seniorcenter.sapi.domain.user.presentation;

import com.seniorcenter.sapi.domain.user.presentation.dto.response.TempUserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    @GetMapping("/1")
    public TempUserResponseDto getUserInfo1() {
        return new TempUserResponseDto(1L, "박찬호" , "chpark6851@naver.com");
    }

    @GetMapping("/2")
    public TempUserResponseDto getUserInfo2() {
        return new TempUserResponseDto(2L, "조성빈" , "joseongbin12@naver.com");
    }

    @GetMapping()
    public TempUserResponseDto getUserInfo() {
        return new TempUserResponseDto(1L, "박찬호" , "chpark6851@naver.com");
    }
}
