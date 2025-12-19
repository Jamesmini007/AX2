// 로그인 상태 관리 공통 스크립트
(function() {
    'use strict';

    // 로그인 상태 확인
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    // 페이지 경로 결정 헬퍼
    function getPagePath(page) {
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        return isInHtmlFolder ? page : 'html/' + page;
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
                const loginPath = isInHtmlFolder ? 'login.html' : 'html/login.html';
                btn.setAttribute('href', loginPath);
                btn.href = loginPath;
                btn.onclick = null;
            }
        });

        // 가입하기 버튼 표시/숨김 처리
        updateSignupButton();
        
        // 사용자 정보 표시 업데이트
        if (isLoggedIn()) {
            updateUserInfo();
        } else {
            // 비로그인 상태: plan-info-box 표시 및 무료 크레딧 정보 업데이트
            const planInfoBox = document.getElementById('plan-info-box');
            if (planInfoBox) {
                planInfoBox.style.display = 'flex';
            }
            if (typeof window.updateFreeCreditInfo === 'function') {
                window.updateFreeCreditInfo();
            }
        }
    }
    
    // 사용자 정보 표시 (요금제 + 이름)
    function updateUserInfo() {
        // 기존 user-info-wrapper 전체 제거
        const existingUserInfoWrapper = document.querySelector('.user-info-wrapper');
        if (existingUserInfoWrapper) {
            existingUserInfoWrapper.remove();
        }
        
        // 기존 나의 작업 버튼 제거
        const existingStorageBtn = document.querySelector('.my-work-link');
        if (existingStorageBtn) {
            existingStorageBtn.remove();
        }
        
        // plan-info-box 처리
        const planInfoBox = document.getElementById('plan-info-box');
        
        if (isLoggedIn()) {
            // 로그인 상태: plan-info-box 숨기기
            if (planInfoBox) {
                planInfoBox.style.display = 'none';
                planInfoBox.style.visibility = 'hidden';
            }
            
            const user = getCurrentUser();
            const currentPlan = localStorage.getItem('currentPlan') || 'Free';
            const subscription = JSON.parse(localStorage.getItem('subscription') || 'null');
            
            // 사용자 이름 가져오기 (우선순위: user.name > subscription.paymentName > email)
            let userName = '사용자';
            if (user) {
                if (user.name) {
                    userName = user.name;
                } else if (subscription && subscription.paymentName) {
                    userName = subscription.paymentName;
                } else if (user.email) {
                    userName = user.email.split('@')[0];
                }
            }
            
            // mypage.html 배너 업데이트 (마이페이지)
            const bannerBadge = document.getElementById('banner-plan-badge');
            const bannerName = document.getElementById('banner-user-name');
            const nicknameInput = document.getElementById('user-nickname');
            const emailInput = document.getElementById('user-email');
            
            if (bannerBadge) {
                bannerBadge.textContent = currentPlan;
                bannerBadge.className = 'user-plan-badge-large';
                if (currentPlan === '학생') bannerBadge.classList.add('student');
                else if (currentPlan === '일반') bannerBadge.classList.add('general');
                else if (currentPlan === '프로') bannerBadge.classList.add('pro');
                else bannerBadge.classList.add('free');
            }
            if (bannerName) bannerName.textContent = userName;
            if (nicknameInput) nicknameInput.value = userName;
            if (emailInput && user && user.email) emailInput.value = user.email;
            
            // 로그인 버튼 앞에 사용자 정보 추가
            const loginBtn = document.querySelector('.login-btn');
            if (loginBtn) {
                const userInfoWrapper = document.createElement('div');
                userInfoWrapper.className = 'user-info-wrapper';
                userInfoWrapper.style.position = 'relative';
                userInfoWrapper.style.marginRight = '0';
                
                const userInfoEl = document.createElement('span');
                userInfoEl.className = 'user-info-display';
                
                // 크레딧 잔액 가져오기
                const creditBalance = parseInt(localStorage.getItem('creditBalance') || '0');
                const creditDisplay = creditBalance > 0 ? `<span style="color: #8B5CF6; font-size: 14px; font-weight: 600; margin-right: 8px;">${creditBalance.toLocaleString()} 크레딧</span>` : '';
                
                userInfoEl.innerHTML = `${creditDisplay}<span style="color: #333; font-size: 14px;">${userName}님</span><i class="fas fa-chevron-down" style="margin-left: 6px; font-size: 10px; color: #666;"></i>`;
                userInfoEl.style.display = 'flex';
                userInfoEl.style.alignItems = 'center';
                userInfoEl.style.cursor = 'pointer';
                userInfoEl.style.padding = '8px 12px';
                userInfoEl.style.borderRadius = '8px';
                userInfoEl.style.transition = 'background 0.2s ease';
                
                // 나의 작업 버튼 생성 (오른쪽에 표시)
                const storageBtn = document.createElement('a');
                storageBtn.href = getPagePath('storage.html');
                storageBtn.className = 'my-work-link';
                storageBtn.textContent = '나의 작업';
                storageBtn.style.cssText = 'display: flex; align-items: center; padding: 8px 0; margin-left: -8px; color: #666; font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s ease;';
                storageBtn.onmouseover = function() { this.style.color = '#333'; };
                storageBtn.onmouseout = function() { this.style.color = '#666'; };
                
                // 크레딧 잔액 가져오기 (드롭다운용)
                const creditBalanceForDropdown = parseInt(localStorage.getItem('creditBalance') || '0');
                
                // 드롭다운 메뉴 생성
                const dropdown = document.createElement('div');
                dropdown.className = 'user-dropdown-menu';
                dropdown.innerHTML = `
                    <div class="user-dropdown-header">
                        <span class="user-plan-badge" style="background: #8B5CF6; color: white; padding: 6px 14px; border-radius: 14px; font-size: 13px; font-weight: 600; margin-right: 8px;">${creditBalanceForDropdown.toLocaleString()} 크레딧</span>
                        <div class="user-dropdown-name">${userName}님</div>
                    </div>
                    <div class="user-dropdown-divider"></div>
                    <a href="${getPagePath('mypage.html')}" class="user-dropdown-item">
                        <i class="fas fa-user-edit"></i>
                        <span>정보수정</span>
                    </a>
                    <a href="${getPagePath('mypage.html')}?tab=password" class="user-dropdown-item">
                        <i class="fas fa-lock"></i>
                        <span>비밀번호변경</span>
                    </a>
                    <a href="${getPagePath('mypage.html')}?tab=payment" class="user-dropdown-item">
                        <i class="fas fa-credit-card"></i>
                        <span>결제정보</span>
                    </a>
                    <div class="user-dropdown-divider"></div>
                    <a href="#" class="user-dropdown-item logout-item" onclick="handleLogout(); return false;">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>로그아웃</span>
                    </a>
                `;
                
                // 드롭다운 스타일 적용
                dropdown.style.cssText = `
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    min-width: 180px;
                    padding: 12px 0;
                    display: none;
                    z-index: 10001;
                `;
                
                // 스타일 추가
                if (!document.getElementById('user-dropdown-styles')) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'user-dropdown-styles';
                    styleEl.textContent = `
                        .user-dropdown-menu {
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                        }
                        .user-dropdown-header {
                            padding: 16px 20px;
                            text-align: center;
                        }
                        .user-dropdown-name {
                            margin-top: 10px;
                            font-size: 15px;
                            font-weight: 600;
                            color: #1a1a2e;
                        }
                        .user-dropdown-divider {
                            height: 1px;
                            background: #E5E7EB;
                            margin: 8px 0;
                        }
                        .user-dropdown-item {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 12px 20px;
                            color: #333;
                            text-decoration: none;
                            font-size: 14px;
                            transition: background 0.2s ease;
                        }
                        .user-dropdown-item:hover {
                            background: #F5F5F5;
                        }
                        .user-dropdown-item i {
                            width: 18px;
                            color: #666;
                        }
                        .user-dropdown-item.logout-item {
                            color: #666;
                        }
                    `;
                    document.head.appendChild(styleEl);
                }
                
                // 클릭 이벤트
                userInfoEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isVisible = dropdown.style.display === 'block';
                    
                    // 더보기 메뉴가 열려있으면 강제로 닫기
                    const moreMenuDropdown = document.getElementById('moreMenuDropdown');
                    if (moreMenuDropdown && moreMenuDropdown.classList.contains('active')) {
                        // window.MoreMenu를 통해 닫기 시도
                        if (window.MoreMenu && window.MoreMenu.closeMenu) {
                            window.MoreMenu.closeMenu();
                        }
                        // 직접 닫기 (백업)
                        moreMenuDropdown.classList.remove('active');
                        moreMenuDropdown.classList.remove('has-submenu-active');
                        const moreMenuBtn = document.getElementById('moreMenuBtn');
                        if (moreMenuBtn) {
                            moreMenuBtn.setAttribute('aria-expanded', 'false');
                        }
                        // 상태도 업데이트
                        if (window.MoreMenu && window.MoreMenu.state) {
                            window.MoreMenu.state.isMenuOpen = false;
                        }
                    }
                    
                    // 사용자 드롭다운 토글
                    dropdown.style.display = isVisible ? 'none' : 'block';
                });
                
                // 외부 클릭 시 닫기
                const handleUserDropdownOutsideClick = function(e) {
                    // 더보기 메뉴 버튼이나 드롭다운을 클릭한 경우 사용자 드롭다운 닫기
                    const moreMenuBtn = document.getElementById('moreMenuBtn');
                    const moreMenuDropdown = document.getElementById('moreMenuDropdown');
                    const isMoreMenuClick = (moreMenuBtn && (moreMenuBtn.contains(e.target) || moreMenuBtn === e.target)) ||
                                          (moreMenuDropdown && (moreMenuDropdown.contains(e.target) || moreMenuDropdown === e.target));
                    
                    if (isMoreMenuClick) {
                        dropdown.style.display = 'none';
                        return;
                    }
                    
                    if (!userInfoWrapper.contains(e.target)) {
                        dropdown.style.display = 'none';
                    }
                };
                
                document.addEventListener('click', handleUserDropdownOutsideClick, true);
                
                userInfoWrapper.appendChild(userInfoEl);
                userInfoWrapper.appendChild(dropdown);
                
                // 로그인 버튼이 있으면 앞에 추가, 없으면 nav-right에 추가
                if (loginBtn && loginBtn.parentNode) {
                    loginBtn.parentNode.insertBefore(userInfoWrapper, loginBtn);
                    // 저장공간 버튼 추가 (userInfoWrapper 다음에, 오른쪽에 표시)
                    loginBtn.parentNode.insertBefore(storageBtn, loginBtn);
                    // 로그인 버튼 숨기기 (드롭다운에 로그아웃이 있으므로)
                    loginBtn.style.display = 'none';
                } else {
                    // 로그인 버튼이 없으면 nav-right에 직접 추가
                    const navRight = document.querySelector('.nav-right');
                    if (navRight) {
                        navRight.appendChild(userInfoWrapper);
                        navRight.appendChild(storageBtn);
                    }
                }
            }
        } else {
            // 비로그인 상태: plan-info-box 강제 표시
            if (planInfoBox) {
                planInfoBox.style.display = 'flex';
                planInfoBox.style.visibility = 'visible';
                planInfoBox.style.opacity = '1';
                // 다른 스크립트가 숨기지 못하도록 !important 스타일 추가
                planInfoBox.setAttribute('data-force-display', 'true');
            }
            // 무료 크레딧 정보 업데이트 (여러 시점에서 보장)
            if (typeof window.updateFreeCreditInfo === 'function') {
                window.updateFreeCreditInfo();
                setTimeout(() => {
                    if (typeof window.updateFreeCreditInfo === 'function') {
                        window.updateFreeCreditInfo();
                    }
                }, 50);
                setTimeout(() => {
                    if (typeof window.updateFreeCreditInfo === 'function') {
                        window.updateFreeCreditInfo();
                    }
                }, 100);
                setTimeout(() => {
                    if (typeof window.updateFreeCreditInfo === 'function') {
                        window.updateFreeCreditInfo();
                    }
                }, 300);
                setTimeout(() => {
                    if (typeof window.updateFreeCreditInfo === 'function') {
                        window.updateFreeCreditInfo();
                    }
                }, 500);
            }
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

    // 전역 함수로 노출 (다른 스크립트에서 호출 가능하도록)
    window.updateLoginButton = updateLoginButton;
    window.updateUserInfo = updateUserInfo;
    
    // 로그인 상태 변경 이벤트 리스너
    window.addEventListener('loginStateChanged', function() {
        updateLoginButton();
    });
    
    // 네비게이션 바 로드 이벤트 리스너
    document.addEventListener('navBarLoaded', function() {
        updateLoginButton();
    });
    
    // 페이지 로드 시 로그인 버튼 업데이트
    function initAuthState() {
        // 네비게이션 바가 로드될 때까지 대기
        const checkNavBar = () => {
            const navBar = document.querySelector('.glass-nav');
            const navRight = document.querySelector('.nav-right');
            if (navBar && navRight) {
                // 네비게이션 바가 로드되었으면 상단 바 업데이트
                updateLoginButton();
                // 추가로 한 번 더 확인 (네비게이션 바가 완전히 렌더링된 후)
                setTimeout(() => {
                    updateLoginButton();
                }, 200);
            } else {
                // 네비게이션 바가 아직 로드되지 않았으면 다시 시도
                setTimeout(checkNavBar, 100);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkNavBar);
        } else {
            checkNavBar();
        }
    }
    
    initAuthState();

    // 비밀번호 변경 모달 표시
    function showPasswordChangeModal() {
        alert('비밀번호 변경 기능은 준비 중입니다.');
    }

    // 전역 함수로 등록
    window.isLoggedIn = isLoggedIn;
    window.getCurrentUser = getCurrentUser;
    window.handleLogout = handleLogout;
    window.updateSignupButton = updateSignupButton;
    window.showPasswordChangeModal = showPasswordChangeModal;
})();
