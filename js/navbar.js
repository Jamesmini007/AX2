// 공통 상단바 컴포넌트
(function() {
    'use strict';

    // 현재 페이지 경로에 따라 상대 경로 결정
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/html/')) {
            return '../';
        }
        return '';
    }

    // 상단바 HTML 생성
    function createNavbar() {
        const basePath = getBasePath();
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        
        // 로고 경로
        const logoPath = isInHtmlFolder ? '../assets/image/AX2_logo.png' : 'assets/image/AX2_logo.png';
        const indexPath = isInHtmlFolder ? '../index.html' : 'index.html';
        
        // 서비스 탭 링크
        const guidePath = isInHtmlFolder ? 'guide.html' : 'html/guide.html';
        const pricingPath = isInHtmlFolder ? 'pricing.html' : 'html/pricing.html';
        
        // 사용자 메뉴 링크
        const mypagePath = isInHtmlFolder ? 'mypage.html?tab=info' : 'html/mypage.html?tab=info';
        const paymentPath = isInHtmlFolder ? 'pricing.html' : 'html/pricing.html';
        
        // 인증 버튼 링크
        const loginPath = isInHtmlFolder ? 'login.html' : 'html/login.html';
        const signupPath = isInHtmlFolder ? 'signup.html' : 'html/signup.html';
        
        // 더보기 메뉴 링크
        const liveLecturePath = isInHtmlFolder ? 'live_lecture.html' : 'html/live_lecture.html';

        return `
            <nav class="glass-nav">
                <div class="nav-content">
                    <div class="nav-left">
                        <div class="logo" onclick="location.href='${indexPath}'">
                            <img src="${logoPath}" alt="AX2" class="logo-img">
                        </div>
                        <div class="service-tabs">
                            <a href="${indexPath}" class="service-tab" data-tab="index">
                                <span>자막생성</span>
                            </a>
                            <a href="${guidePath}" class="service-tab" data-tab="guide">
                                <span>사용방법</span>
                            </a>
                            <a href="${pricingPath}" class="service-tab" data-tab="pricing">
                                <span>요금제/결제</span>
                            </a>
                        </div>
                    </div>
                    <div class="nav-right">
                        <div class="plan-info">
                            <span class="highlight">Free</span> <span id="remaining-time">0분 남음</span>
                        </div>
                        <!-- 로그인 상태일 때 표시되는 사용자 정보 -->
                        <div class="user-info-container" id="userInfoContainer" style="display: none;">
                            <button class="free-plan-badge-nav">Free</button>
                            <div class="user-menu-wrapper">
                                <div class="user-menu-trigger" id="userMenuTrigger">
                                    <span class="user-name" id="userName">게스트님</span>
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="user-menu-dropdown" id="userMenuDropdown">
                                    <div class="user-menu-header">
                                        <div class="user-name-menu" id="userNameMenu">게스트님</div>
                                    </div>
                                    <div class="user-menu-divider"></div>
                                    <div class="user-menu-items">
                                        <a href="${mypagePath}" class="user-menu-item" id="editInfoItem">
                                            <i class="fas fa-user"></i>
                                            <span>정보수정</span>
                                        </a>
                                        <a href="#" class="user-menu-item" id="changePasswordItem">
                                            <i class="fas fa-lock"></i>
                                            <span>비밀번호변경</span>
                                        </a>
                                        <a href="${paymentPath}" class="user-menu-item" id="paymentInfoItem">
                                            <i class="fas fa-credit-card"></i>
                                            <span>결제정보</span>
                                        </a>
                                        <a href="#" class="user-menu-item" id="logoutItem">
                                            <i class="fas fa-sign-out-alt"></i>
                                            <span>로그아웃</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 로그아웃 상태일 때 표시되는 버튼 -->
                        <div class="auth-buttons" id="authButtons">
                            <a href="${loginPath}" class="login-btn">로그인</a>
                            <a href="${signupPath}" class="signup-btn">가입하기</a>
                        </div>
                        <div class="more-menu-btn" id="moreMenuBtn">
                            <div class="dots">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </div>
                        </div>
                        <div class="more-menu-dropdown" id="moreMenuDropdown">
                            <div class="language-dropdown-menu" id="languageDropdownMenu">
                                <div class="language-option" data-lang="ko">
                                    <span>한국어</span>
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="language-option" data-lang="en">
                                    <span>영어</span>
                                    <i class="fas fa-check" style="display: none;"></i>
                                </div>
                                <div class="language-option" data-lang="ja">
                                    <span>일본어</span>
                                    <i class="fas fa-check" style="display: none;"></i>
                                </div>
                                <div class="language-option" data-lang="zh">
                                    <span>중국어</span>
                                    <i class="fas fa-check" style="display: none;"></i>
                                </div>
                                <div class="language-option" data-lang="es">
                                    <span>스페인어</span>
                                    <i class="fas fa-check" style="display: none;"></i>
                                </div>
                            </div>
                            <div class="more-menu-dropdown-content">
                                <div class="more-menu-section">
                                    <div class="more-menu-section-title">기타 제품</div>
                                    <a href="${indexPath}" class="more-menu-item">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-language"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">자동번역/다국어 자막</div>
                                        </div>
                                    </a>
                                    <a href="${liveLecturePath}" class="more-menu-item">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-video"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">실시간 강의</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="more-menu-divider"></div>
                                <div class="more-menu-section">
                                    <a href="${pricingPath}" class="more-menu-item">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-tag"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">가격</div>
                                        </div>
                                    </a>
                                    <a href="#" class="more-menu-item">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-star"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">기능소개</div>
                                        </div>
                                    </a>
                                    <a href="#" class="more-menu-item">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-info-circle"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">회사소개 / 도움말</div>
                                        </div>
                                    </a>
                                    <div class="more-menu-item language-setting-item" id="languageSettingBtn">
                                        <div class="more-menu-item-icon">
                                            <i class="fas fa-globe"></i>
                                        </div>
                                        <div class="more-menu-item-content">
                                            <div class="more-menu-item-title">사이트 언어 설정</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // 상단바 초기화
    function initNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            console.warn('navbar-container를 찾을 수 없습니다.');
            return;
        }

        // 상단바 HTML 삽입
        navbarContainer.innerHTML = createNavbar();

        // 활성 탭 설정
        setActiveTab();

        // 더보기 메뉴 초기화
        initMoreMenu();

        // 언어 설정 초기화
        initLanguageSettings();
    }

    // 활성 탭 설정
    function setActiveTab() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        const tabs = document.querySelectorAll('.service-tab');
        tabs.forEach(tab => {
            const href = tab.getAttribute('href');
            if (href) {
                const tabPath = href.split('/').pop() || 'index.html';
                const tabName = tabPath.split('?')[0]; // 쿼리 파라미터 제거
                
                if (tabName === 'index.html' && (currentPage === 'index.html' || currentPage === '')) {
                    tab.classList.add('active');
                } else if (tabName === 'guide.html' && currentPage === 'guide.html') {
                    tab.classList.add('active');
                } else if (tabName === 'pricing.html' && currentPage === 'pricing.html') {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            }
        });
    }

    // 더보기 메뉴 초기화
    function initMoreMenu() {
        const moreMenuBtn = document.getElementById('moreMenuBtn');
        const moreMenuDropdown = document.getElementById('moreMenuDropdown');
        
        if (moreMenuBtn && moreMenuDropdown) {
            moreMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                moreMenuDropdown.classList.toggle('active');
            });
            
            // 외부 클릭 시 메뉴 닫기
            document.addEventListener('click', function(e) {
                if (!moreMenuBtn.contains(e.target) && !moreMenuDropdown.contains(e.target)) {
                    moreMenuDropdown.classList.remove('active');
                }
            });
        }
    }

    // 언어 설정 초기화
    function initLanguageSettings() {
        const languageOptions = document.querySelectorAll('.language-dropdown-menu .language-option');
        const currentLang = localStorage.getItem('siteLanguage') || 'ko';
        
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === currentLang) {
                option.classList.add('active');
                const checkIcon = option.querySelector('.fa-check');
                if (checkIcon) checkIcon.style.display = 'inline-block';
            } else {
                option.classList.remove('active');
                const checkIcon = option.querySelector('.fa-check');
                if (checkIcon) checkIcon.style.display = 'none';
            }
            
            option.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                localStorage.setItem('siteLanguage', selectedLang);
                
                languageOptions.forEach(opt => {
                    opt.classList.remove('active');
                    const checkIcon = opt.querySelector('.fa-check');
                    if (checkIcon) checkIcon.style.display = 'none';
                });
                
                this.classList.add('active');
                const checkIcon = this.querySelector('.fa-check');
                if (checkIcon) checkIcon.style.display = 'inline-block';
            });
        });
    }

    // DOM 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }

    // 전역 함수로 등록
    window.initNavbar = initNavbar;
    window.setActiveTab = setActiveTab;
})();

