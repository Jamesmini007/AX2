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
        const isLoggedInState = isLoggedIn();
        const userInfoContainer = document.getElementById('userInfoContainer');
        const authButtons = document.getElementById('authButtons');
        
        if (isLoggedInState) {
            // 로그인 상태: 사용자 정보 표시
            if (userInfoContainer) {
                userInfoContainer.style.display = 'flex';
            }
            if (authButtons) {
                authButtons.style.display = 'none';
            }
            
            // 사용자 이름 업데이트
            const user = getCurrentUser();
            const userNameElements = document.querySelectorAll('#userName, #userNameMenu');
            userNameElements.forEach(el => {
                if (el && user) {
                    el.textContent = user.name ? user.name + '님' : '게스트님';
                }
            });
            
            // 사용자 메뉴 초기화
            initializeUserMenu();
        } else {
            // 로그아웃 상태: 로그인 버튼 표시
            if (userInfoContainer) {
                userInfoContainer.style.display = 'none';
            }
            if (authButtons) {
                authButtons.style.display = 'flex';
            }
        }

        // 가입하기 버튼 표시/숨김 처리
        updateSignupButton();
    }
    
    // 사용자 메뉴 초기화
    function initializeUserMenu() {
        const userMenuTrigger = document.getElementById('userMenuTrigger');
        const userMenuDropdown = document.getElementById('userMenuDropdown');
        const userMenuWrapper = userMenuTrigger ? userMenuTrigger.closest('.user-menu-wrapper') : null;
        const logoutItem = document.getElementById('logoutItem');
        
        if (!userMenuTrigger || !userMenuWrapper) return;
        
        // 드롭다운 토글
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuWrapper.classList.toggle('active');
        });
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (userMenuWrapper && !userMenuWrapper.contains(e.target)) {
                userMenuWrapper.classList.remove('active');
            }
        });
        
        // 로그아웃 버튼 클릭
        if (logoutItem) {
            logoutItem.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
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

