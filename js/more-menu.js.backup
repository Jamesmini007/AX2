// AX2 More Menu & Language Selector - 최적화된 버전
// 이벤트 위임, DOM 캐싱, 디바운싱 적용

(function() {
    'use strict';

    // DOM 요소 캐싱 (한 번만 쿼리)
    const DOMCache = {
        moreMenuBtn: null,
        moreMenuDropdown: null,
        languageDropdownMenu: null,
        languageSettingItem: null,
        languageOptions: null,
        initialized: false
    };

    // 상태 관리
    const state = {
        currentLang: localStorage.getItem('siteLanguage') || 'ko',
        isMenuOpen: false,
        isLanguageMenuVisible: false,
        hoverTimeout: null
    };

    // 디바운스 유틸리티
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // DOM 요소 초기화 (지연 로딩)
    function initDOMCache() {
        if (DOMCache.initialized) return;
        
        DOMCache.moreMenuBtn = document.getElementById('moreMenuBtn');
        DOMCache.moreMenuDropdown = document.getElementById('moreMenuDropdown');
        DOMCache.languageDropdownMenu = document.getElementById('languageDropdownMenu');
        DOMCache.languageSettingItem = document.getElementById('languageSettingBtn');
        DOMCache.languageOptions = document.querySelectorAll('.language-option');
        
        DOMCache.initialized = true;
    }

    // 언어 선택 업데이트 (최적화: requestAnimationFrame 사용)
    function updateLanguageSelection(lang) {
        // DOMCache 재확인 (동적으로 추가된 요소 대응)
        DOMCache.languageOptions = document.querySelectorAll('.language-dropdown-menu .language-option');
        
        if (!DOMCache.languageOptions || DOMCache.languageOptions.length === 0) return;
        
        // DOM 업데이트를 requestAnimationFrame으로 배치하여 성능 최적화
        requestAnimationFrame(() => {
            DOMCache.languageOptions.forEach(option => {
                const optionLang = option.dataset.lang;
                const checkIcon = option.querySelector('.fa-check');
                
                if (optionLang === lang) {
                    option.classList.add('active');
                    option.setAttribute('aria-selected', 'true');
                    if (checkIcon) {
                        checkIcon.style.display = 'inline-block';
                        checkIcon.setAttribute('aria-hidden', 'false');
                    }
                } else {
                    option.classList.remove('active');
                    option.setAttribute('aria-selected', 'false');
                    if (checkIcon) {
                        checkIcon.style.display = 'none';
                        checkIcon.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        });
    }

    // 언어 변경 처리 (최적화: 배치 업데이트)
    function handleLanguageChange(lang) {
        if (state.currentLang === lang) {
            console.log('이미 선택된 언어입니다:', lang);
            return; // 중복 방지
        }
        
        console.log('언어 변경:', state.currentLang, '->', lang);
        state.currentLang = lang;
        
        // localStorage 저장 (비동기로 처리하여 메인 스레드 블로킹 방지)
        try {
            localStorage.setItem('siteLanguage', lang);
            console.log('localStorage에 저장됨:', lang);
        } catch (e) {
            console.warn('localStorage 저장 실패:', e);
        }
        
        // 언어 선택 UI 업데이트
        updateLanguageSelection(lang);
        
        // 언어 변경 이벤트 발생 (다른 스크립트에서 사용 가능)
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang },
            bubbles: true
        });
        document.dispatchEvent(event);
        
        // 접근성: 스크린 리더 알림
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = `언어가 ${lang}로 변경되었습니다.`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
        
        // 사용자 피드백 (선택 확인)
        console.log('언어 변경 완료:', lang);
    }

    // 메뉴 토글 (접근성 개선)
    function toggleMenu() {
        if (!DOMCache.moreMenuDropdown || !DOMCache.moreMenuBtn) return;
        
        state.isMenuOpen = !state.isMenuOpen;
        
        if (state.isMenuOpen) {
            DOMCache.moreMenuDropdown.classList.add('active');
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'true');
            // 외부 클릭 감지를 위한 이벤트 리스너 추가
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick, true);
            }, 0);
        } else {
            DOMCache.moreMenuDropdown.classList.remove('active');
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'false');
            hideLanguageMenu();
            document.removeEventListener('click', handleOutsideClick, true);
        }
    }

    // 외부 클릭 처리
    function handleOutsideClick(e) {
        if (!DOMCache.moreMenuDropdown || !DOMCache.moreMenuBtn) return;
        
        const isClickInside = DOMCache.moreMenuDropdown.contains(e.target) ||
                             DOMCache.moreMenuBtn.contains(e.target);
        
        if (!isClickInside && state.isMenuOpen) {
            toggleMenu();
        }
    }

    // 언어 메뉴 표시/숨김 (개선된 로직)
    let languageMenuTimeout = null;
    
    function showLanguageMenu() {
        if (!DOMCache.languageDropdownMenu || !DOMCache.moreMenuDropdown) return;
        
        // 기존 타이머 취소
        if (languageMenuTimeout) {
            clearTimeout(languageMenuTimeout);
            languageMenuTimeout = null;
        }
        
        state.isLanguageMenuVisible = true;
        
        // 드롭다운 메뉴 확장
        DOMCache.moreMenuDropdown.classList.add('expanded');
        
        // 즉시 표시하되 애니메이션 적용
        if (DOMCache.languageDropdownMenu.style.display === 'none' || 
            !DOMCache.languageDropdownMenu.style.display) {
            DOMCache.languageDropdownMenu.style.display = 'block';
            // 리플로우 강제 후 애니메이션 시작
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    DOMCache.languageDropdownMenu.classList.add('visible');
                });
            });
        } else {
            DOMCache.languageDropdownMenu.classList.add('visible');
        }
    }

    function hideLanguageMenu() {
        if (!DOMCache.languageDropdownMenu || !DOMCache.moreMenuDropdown) return;
        
        // 기존 타이머 취소
        if (languageMenuTimeout) {
            clearTimeout(languageMenuTimeout);
        }
        
        // 약간의 지연을 두어 메뉴 간 이동 시 끊김 방지
        languageMenuTimeout = setTimeout(() => {
            state.isLanguageMenuVisible = false;
            
            // 드롭다운 메뉴 축소
            DOMCache.moreMenuDropdown.classList.remove('expanded');
            
            DOMCache.languageDropdownMenu.classList.remove('visible');
            
            // 애니메이션 완료 후 숨김
            setTimeout(() => {
                if (!state.isLanguageMenuVisible) {
                    DOMCache.languageDropdownMenu.style.display = 'none';
                }
            }, 200);
        }, 150); // 지연 시간 약간 증가로 안정성 향상
    }

    // 이벤트 위임을 사용한 언어 옵션 클릭 처리
    function handleLanguageOptionClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const option = e.target.closest('.language-option');
        if (!option) return;
        
        const lang = option.dataset.lang;
        if (lang) {
            handleLanguageChange(lang);
            
            // 언어 선택 후 피드백 (선택된 언어 표시)
            console.log('언어가 변경되었습니다:', lang);
        }
    }

    // 초기화 함수
    function init() {
        initDOMCache();
        
        if (!DOMCache.moreMenuBtn || !DOMCache.moreMenuDropdown) {
            console.warn('More menu elements not found');
            return;
        }

        // 더보기 버튼 클릭 이벤트
        DOMCache.moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // 언어 설정 아이템 호버 이벤트 (개선된 로직)
        if (DOMCache.languageSettingItem && DOMCache.languageDropdownMenu) {
            // 언어 설정 아이템과 드롭다운 메뉴를 하나의 영역으로 처리
            const languageMenuArea = document.createElement('div');
            languageMenuArea.style.cssText = 'position: relative;';
            
            // 마우스가 언어 설정 영역에 있을 때
            const handleMouseEnter = () => {
                showLanguageMenu();
            };
            
            const handleMouseLeave = (e) => {
                // 마우스가 언어 설정 아이템이나 드롭다운 메뉴를 벗어났는지 확인
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget) {
                    hideLanguageMenu();
                    return;
                }
                
                const isLeavingToMenu = DOMCache.languageDropdownMenu.contains(relatedTarget);
                const isLeavingToItem = DOMCache.languageSettingItem.contains(relatedTarget);
                
                if (!isLeavingToMenu && !isLeavingToItem) {
                    hideLanguageMenu();
                }
            };
            
            DOMCache.languageSettingItem.addEventListener('mouseenter', handleMouseEnter);
            DOMCache.languageSettingItem.addEventListener('mouseleave', handleMouseLeave);
            
            DOMCache.languageDropdownMenu.addEventListener('mouseenter', handleMouseEnter);
            DOMCache.languageDropdownMenu.addEventListener('mouseleave', handleMouseLeave);
        }

        // 언어 옵션 클릭 이벤트 (이벤트 위임) - 개선
        if (DOMCache.languageDropdownMenu) {
            // 클릭 이벤트 리스너 추가 (capture phase에서도 처리)
            DOMCache.languageDropdownMenu.addEventListener('click', handleLanguageOptionClick, true);
            
            // 각 언어 옵션에 직접 클릭 이벤트도 추가 (확실한 작동 보장)
            if (DOMCache.languageOptions && DOMCache.languageOptions.length > 0) {
                DOMCache.languageOptions.forEach(option => {
                    // 중복 방지를 위해 한 번만 추가
                    if (!option.hasAttribute('data-listener-added')) {
                        option.setAttribute('data-listener-added', 'true');
                        option.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const lang = option.dataset.lang;
                            if (lang) {
                                handleLanguageChange(lang);
                            }
                        });
                    }
                });
            }
            
            // 키보드 접근성 추가
            DOMCache.languageDropdownMenu.addEventListener('keydown', (e) => {
                const option = e.target.closest('.language-option');
                if (!option) return;
                
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = option.dataset.lang;
                    if (lang) {
                        handleLanguageChange(lang);
                    }
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const options = Array.from(DOMCache.languageOptions);
                    const currentIndex = options.indexOf(option);
                    const nextIndex = e.key === 'ArrowDown' 
                        ? (currentIndex + 1) % options.length
                        : (currentIndex - 1 + options.length) % options.length;
                    options[nextIndex].focus();
                }
            });
        }

        // 초기 언어 선택 상태 복원
        updateLanguageSelection(state.currentLang);
        
        // 접근성: ARIA 속성 추가
        if (DOMCache.moreMenuBtn) {
            DOMCache.moreMenuBtn.setAttribute('aria-label', '더보기 메뉴');
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'false');
            DOMCache.moreMenuBtn.setAttribute('aria-haspopup', 'true');
        }
        
        if (DOMCache.moreMenuDropdown) {
            DOMCache.moreMenuDropdown.setAttribute('role', 'menu');
            DOMCache.moreMenuDropdown.setAttribute('aria-label', '더보기 메뉴');
        }
        
        if (DOMCache.languageOptions) {
            DOMCache.languageOptions.forEach(option => {
                option.setAttribute('role', 'menuitemradio');
                option.setAttribute('tabindex', option.classList.contains('active') ? '0' : '-1');
            });
        }

        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) {
                toggleMenu();
            }
        });
    }

    // DOMContentLoaded 또는 즉시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 전역으로 내보내기 (필요시)
    window.MoreMenu = {
        toggle: toggleMenu,
        setLanguage: handleLanguageChange,
        getCurrentLanguage: () => state.currentLang
    };

})();

