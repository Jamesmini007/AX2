// 네비게이션 바 공통 컴포넌트
(function() {
    // 현재 페이지가 html 폴더 안에 있는지 확인
    const isInHtmlFolder = window.location.pathname.includes('/html/');
    const assetPath = isInHtmlFolder ? '../' : '';  // 자산(이미지 등) 경로
    const htmlPath = isInHtmlFolder ? '' : 'html/';  // html 파일 경로
    // ax2_home 경로 - 현재 위치와 관계없이 루트 기준으로 설정
    const ax2HomePath = isInHtmlFolder ? '../ax2_home/' : 'ax2_home/';

    // 네비게이션 바 HTML 생성
    function createNavBar() {
        return `
    <nav class="glass-nav">
        <div class="nav-content">
            <div class="nav-left">
                <div class="logo" onclick="location.href='${assetPath}index.html'">
                    <img src="${assetPath}assets/image/Caption.png" alt="AX2" class="logo-img">
                </div>
                <div class="service-tabs">
                    <a href="${assetPath}index.html" class="service-tab" data-page="index.html">
                        <span>자막생성</span>
                    </a>
                    <a href="${htmlPath}pricing.html" class="service-tab" data-page="pricing.html">
                        <span>크레딧/충전</span>
                    </a>
                    <a href="${htmlPath}used.html" class="service-tab" data-page="used.html">
                        <span>사용방법</span>
                    </a>
                </div>
            </div>
            <div class="nav-right">
                <div class="plan-info" id="plan-info-box">
                    <span id="free-credit-info"></span>
                </div>
                <a href="${htmlPath}login.html" class="login-btn">로그인</a>
                <a href="${htmlPath}signup.html" class="signup-btn">가입하기</a>
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
                        <div class="language-option" data-lang="fr">
                            <span>프랑스어</span>
                            <i class="fas fa-check" style="display: none;"></i>
                        </div>
                    </div>
                    <div class="mega-menu-content">
                        <!-- 1열: 기타 제품 -->
                        <div class="mega-menu-column">
                            <div class="mega-menu-section-title">기타 제품</div>
                            <a href="${assetPath}index.html" class="mega-menu-item">
                                <div class="mega-menu-item-icon"><i class="fas fa-closed-captioning"></i></div>
                                <div class="mega-menu-item-text">
                                    <div class="mega-menu-item-title">자막 생성</div>
                                    <div class="mega-menu-item-desc">영상 자막 자동 생성</div>
                                </div>
                                <i class="fas fa-arrow-right mega-menu-arrow"></i>
                            </a>
                            <a href="#" class="mega-menu-item">
                                <div class="mega-menu-item-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                                <div class="mega-menu-item-text">
                                    <div class="mega-menu-item-title">실시간 번역</div>
                                    <div class="mega-menu-item-desc">라이브 번역 및 자막</div>
                                </div>
                                <i class="fas fa-arrow-right mega-menu-arrow"></i>
                            </a>
                        </div>
                        <!-- 2열: 링크 목록 -->
                        <div class="mega-menu-column mega-menu-links">
                            <a href="${htmlPath}pricing.html" class="mega-menu-link">
                                <i class="fas fa-file-alt"></i>
                                <span>가격</span>
                            </a>
                            <a href="${htmlPath}security.html" class="mega-menu-link">
                                <i class="fas fa-lock"></i>
                                <span>보안</span>
                            </a>
                            <a href="${htmlPath}features.html" class="mega-menu-link">
                                <i class="fas fa-th-large"></i>
                                <span>기능</span>
                            </a>
                            <a href="${ax2HomePath}company.html" class="mega-menu-link" target="_blank">
                                <i class="fas fa-tags"></i>
                                <span>회사 소개</span>
                            </a>
                            <div class="mega-menu-divider" style="height: 1px; background: #e5e7eb; margin: 16px 0;"></div>
                            <div class="mega-menu-link has-submenu" id="helpMenuBtn">
                                <i class="fas fa-chevron-left"></i>
                                <span>도움</span>
                            </div>
                            <div class="mega-menu-link has-submenu" id="languageMenuBtn">
                                <i class="fas fa-chevron-left"></i>
                                <span>언어</span>
                            </div>
                        </div>
                        <!-- 도움 서브메뉴 -->
                        <div class="mega-submenu" id="helpSubmenu">
                            <a href="${htmlPath}faq.html" class="mega-submenu-item">
                                <i class="fas fa-question-circle"></i>
                                <span>자주 묻는 질문</span>
                            </a>
                            <a href="${htmlPath}tools.html" class="mega-submenu-item">
                                <i class="fas fa-tools"></i>
                                <span>도구</span>
                            </a>
                            <a href="${htmlPath}legal.html" class="mega-submenu-item">
                                <i class="fas fa-gavel"></i>
                                <span>법률</span>
                            </a>
                            <a href="${htmlPath}privacy.html" class="mega-submenu-item">
                                <i class="fas fa-user-shield"></i>
                                <span>개인정보보호</span>
                            </a>
                            <a href="${ax2HomePath}poem/index.html" class="mega-submenu-item" target="_blank">
                                <i class="fas fa-envelope"></i>
                                <span>문의</span>
                            </a>
                        </div>
                        <!-- 언어 서브메뉴 -->
                        <div class="mega-submenu" id="languageSubmenu">
                            <div class="mega-submenu-item language-option" data-lang="ko">
                                <span>한국어</span>
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="mega-submenu-item language-option" data-lang="en">
                                <span>English</span>
                                <i class="fas fa-check" style="visibility: hidden;"></i>
                            </div>
                            <div class="mega-submenu-item language-option" data-lang="ja">
                                <span>日本語</span>
                                <i class="fas fa-check" style="visibility: hidden;"></i>
                            </div>
                            <div class="mega-submenu-item language-option" data-lang="zh">
                                <span>中文</span>
                                <i class="fas fa-check" style="visibility: hidden;"></i>
                            </div>
                            <div class="mega-submenu-item language-option" data-lang="es">
                                <span>Español</span>
                                <i class="fas fa-check" style="visibility: hidden;"></i>
                            </div>
                            <div class="mega-submenu-item language-option" data-lang="fr">
                                <span>Français</span>
                                <i class="fas fa-check" style="visibility: hidden;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    }

    // 현재 페이지에 맞는 탭 활성화
    function setActiveTab() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.service-tab').forEach(tab => {
            const tabPage = tab.getAttribute('data-page');
            if (tabPage === currentPage || 
                (currentPage === 'index.html' && tabPage === 'index.html') ||
                (currentPage === 'edit.html' && tabPage === 'index.html') ||
                (currentPage === 'storage.html' && tabPage === 'index.html') ||
                (currentPage === 'pricing.html' && tabPage === 'pricing.html')) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // 서브메뉴 이벤트 초기화
    function initSubmenuEvents() {
        // 더보기 메뉴 토글 기능
        const moreMenuBtn = document.getElementById('moreMenuBtn');
        const moreMenuDropdown = document.getElementById('moreMenuDropdown');
        
        if (moreMenuBtn && moreMenuDropdown) {
            moreMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                moreMenuDropdown.classList.toggle('active');
                // 메뉴가 열릴 때 무조건 최상위로 올리기
                if (moreMenuDropdown.classList.contains('active')) {
                    moreMenuDropdown.style.zIndex = '99999';
                } else {
                    moreMenuDropdown.style.zIndex = '';
                }
            });
            
            // 외부 클릭 시 메뉴 닫기
            document.addEventListener('click', function(e) {
                if (!moreMenuBtn.contains(e.target) && !moreMenuDropdown.contains(e.target)) {
                    moreMenuDropdown.classList.remove('active');
                }
            });
        }
        
        const helpMenuBtn = document.getElementById('helpMenuBtn');
        const languageMenuBtn = document.getElementById('languageMenuBtn');
        const helpSubmenu = document.getElementById('helpSubmenu');
        const languageSubmenu = document.getElementById('languageSubmenu');
        const megaMenuContent = document.querySelector('.mega-menu-content');
        
        if (!helpMenuBtn || !languageMenuBtn || !helpSubmenu || !languageSubmenu || !megaMenuContent) return;

        // mega-menu-content 클릭 시 최상위로 올리기
        megaMenuContent.addEventListener('click', function(e) {
            e.stopPropagation();
            megaMenuContent.classList.add('active');
        });

        // 외부 클릭 시 active 클래스 제거
        document.addEventListener('click', function(e) {
            if (!megaMenuContent.contains(e.target)) {
                megaMenuContent.classList.remove('active');
            }
        });

        function showSubmenu(btn, submenu) {
            helpSubmenu.classList.remove('active');
            languageSubmenu.classList.remove('active');
            helpMenuBtn.classList.remove('active');
            languageMenuBtn.classList.remove('active');
            submenu.classList.add('active');
            btn.classList.add('active');
            megaMenuContent.classList.add('blurred');
        }
        
        function hideAllSubmenus() {
            helpSubmenu.classList.remove('active');
            languageSubmenu.classList.remove('active');
            helpMenuBtn.classList.remove('active');
            languageMenuBtn.classList.remove('active');
            megaMenuContent.classList.remove('blurred');
        }
        
        let submenuTimeout = null;
        function delayedHide() {
            submenuTimeout = setTimeout(() => { hideAllSubmenus(); }, 100);
        }
        function cancelHide() {
            if (submenuTimeout) { clearTimeout(submenuTimeout); submenuTimeout = null; }
        }
        
        helpMenuBtn.addEventListener('mouseenter', () => showSubmenu(helpMenuBtn, helpSubmenu));
        helpMenuBtn.addEventListener('mouseleave', (e) => { if (!helpSubmenu.contains(e.relatedTarget)) delayedHide(); });
        helpMenuBtn.addEventListener('mouseenter', cancelHide);
        helpSubmenu.addEventListener('mouseleave', delayedHide);
        helpSubmenu.addEventListener('mouseenter', cancelHide);

        languageMenuBtn.addEventListener('mouseenter', () => showSubmenu(languageMenuBtn, languageSubmenu));
        languageMenuBtn.addEventListener('mouseleave', (e) => { if (!languageSubmenu.contains(e.relatedTarget)) delayedHide(); });
        languageMenuBtn.addEventListener('mouseenter', cancelHide);
        languageSubmenu.addEventListener('mouseleave', delayedHide);
        languageSubmenu.addEventListener('mouseenter', cancelHide);
        
        // 다른 메뉴 링크에 마우스 올리면 서브메뉴 닫기
        document.querySelectorAll('.mega-menu-link:not(.has-submenu)').forEach(link => {
            link.addEventListener('mouseenter', hideAllSubmenus);
        });
        document.querySelectorAll('.mega-menu-column:not(.mega-menu-links)').forEach(col => {
            col.addEventListener('mouseenter', hideAllSubmenus);
        });
        
        const menuDropdown = document.getElementById('moreMenuDropdown');
        if (menuDropdown) menuDropdown.addEventListener('mouseleave', hideAllSubmenus);
        
        // 언어 선택 처리
        document.querySelectorAll('#languageSubmenu .language-option').forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.dataset.lang;
                document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
                    opt.querySelector('.fa-check').style.visibility = 'hidden';
                });
                this.querySelector('.fa-check').style.visibility = 'visible';
                localStorage.setItem('siteLanguage', lang);
                
                // i18n으로 언어 변경 적용
                if (window.i18n && window.i18n.setLanguage) {
                    window.i18n.setLanguage(lang);
                }
            });
        });
    }

    // 네비게이션 바 삽입
    function insertNavBar() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.innerHTML = createNavBar();
            setActiveTab();
            initSubmenuEvents();
            
            // 네비게이션 바 삽입 직후 크레딧 정보 즉시 설정
            const updateCreditDisplay = () => {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const planInfoBox = document.getElementById('plan-info-box');
                const freeCreditInfoEl = document.getElementById('free-credit-info');
                
                if (!planInfoBox || !freeCreditInfoEl) {
                    return;
                }
                
                if (isLoggedIn) {
                    planInfoBox.style.display = 'none';
                    freeCreditInfoEl.textContent = '';
                } else {
                    // 비로그인 상태: 강제로 표시 (setProperty로 !important 적용)
                    planInfoBox.style.setProperty('display', 'flex', 'important');
                    planInfoBox.style.setProperty('visibility', 'visible', 'important');
                    planInfoBox.style.setProperty('opacity', '1', 'important');
                    
                    // 무료 크레딧 정보 설정
                    const freeTrialUsed = localStorage.getItem('freeTrialUsed') === 'true';
                    if (freeTrialUsed) {
                        const freeCreditBalance = parseInt(localStorage.getItem('freeCreditBalance') || '0');
                        freeCreditInfoEl.textContent = `${freeCreditBalance.toLocaleString()} 크레딧`;
                    } else {
                        freeCreditInfoEl.textContent = '100 크레딧';
                    }
                    freeCreditInfoEl.style.display = 'inline';
                    freeCreditInfoEl.style.visibility = 'visible';
                }
            };
            
            // 즉시 실행 및 여러 시점에서 재실행
            updateCreditDisplay();
            setTimeout(updateCreditDisplay, 10);
            setTimeout(updateCreditDisplay, 50);
            setTimeout(updateCreditDisplay, 100);
            setTimeout(updateCreditDisplay, 200);
            setTimeout(updateCreditDisplay, 500);
            
            // 주기적으로 확인하고 복구 (다른 스크립트가 숨겼을 경우)
            const restoreInterval = setInterval(() => {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                const planInfoBox = document.getElementById('plan-info-box');
                if (planInfoBox && !isLoggedIn && planInfoBox.style.display === 'none') {
                    updateCreditDisplay();
                }
            }, 1000);
            
            // 페이지 언로드 시 interval 정리
            window.addEventListener('beforeunload', () => {
                clearInterval(restoreInterval);
            });
            
            // 네비게이션 바 로드 완료 이벤트 발생 (다른 스크립트가 먼저 로드되도록 지연)
            setTimeout(function() {
                document.dispatchEvent(new CustomEvent('navBarLoaded'));
                updateCreditDisplay();
                // 무료 크레딧 정보 업데이트
                if (typeof window.updateFreeCreditInfo === 'function') {
                    window.updateFreeCreditInfo();
                    setTimeout(() => window.updateFreeCreditInfo(), 50);
                    setTimeout(() => window.updateFreeCreditInfo(), 200);
                    setTimeout(() => window.updateFreeCreditInfo(), 500);
                }
            }, 10);
        }
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNavBar);
    } else {
        insertNavBar();
    }
})();

