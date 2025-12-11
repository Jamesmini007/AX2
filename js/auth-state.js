// 로그인 상태 관리 공통 스크립트
(function() {
    'use strict';

    // 로그인 상태 확인
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // 현재 사용자 정보 가져오기
    function getCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('사용자 정보 가져오기 오류:', error);
            return null;
        }
    }

    // 로그인 버튼 업데이트
    function updateLoginButton() {
        const loginButtons = document.querySelectorAll('.login-btn');
        
        loginButtons.forEach(btn => {
            if (isLoggedIn()) {
                // 로그인 상태: 로그아웃 버튼으로 변경
                btn.textContent = '로그아웃';
                btn.href = '#';
                btn.onclick = function(e) {
                    e.preventDefault();
                    handleLogout();
                };
                btn.style.cursor = 'pointer';
            } else {
                // 로그아웃 상태: 로그인 버튼으로 유지
                btn.textContent = '로그인';
                // 현재 경로에 따라 login.html 경로 결정
                const isInHtmlFolder = window.location.pathname.includes('/html/');
                btn.href = isInHtmlFolder ? 'login.html' : 'html/login.html';
                btn.onclick = null;
            }
        });

        // 가입하기 버튼 표시/숨김 처리
        updateSignupButton();
    }

    // 가입하기 버튼 업데이트
    function updateSignupButton() {
        const signupButtons = document.querySelectorAll('.signup-btn');
        
        signupButtons.forEach(btn => {
            if (isLoggedIn()) {
                // 로그인 상태: 가입하기 버튼 숨기기
                btn.style.display = 'none';
            } else {
                // 로그아웃 상태: 가입하기 버튼 표시
                btn.style.display = 'inline-block';
            }
        });
    }

    // 로그아웃 처리
    function handleLogout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            // 로그인 상태 제거
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            
            // 로그인 페이지로 리디렉션
            const isInHtmlFolder = window.location.pathname.includes('/html/');
            window.location.href = isInHtmlFolder ? 'login.html' : 'html/login.html';
        }
    }

    // 페이지 로드 시 로그인 버튼 업데이트
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLoginButton);
    } else {
        updateLoginButton();
    }

    // 전역 함수로 등록
    window.isLoggedIn = isLoggedIn;
    window.getCurrentUser = getCurrentUser;
    window.handleLogout = handleLogout;
    window.updateLoginButton = updateLoginButton;
    window.updateSignupButton = updateSignupButton;
})();

