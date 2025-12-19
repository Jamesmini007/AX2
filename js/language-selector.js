// iLovePDF 스타일 Language 드롭다운 JavaScript
// 순수 CSS 호버 기반이지만, 언어 선택 기능은 JavaScript로 처리

(function() {
    'use strict';

    // 언어 이름 매핑
    const languageNames = {
        'ko': '한국어',
        'en': 'English',
        'ja': '日本語',
        'zh': '中文',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
        'pt': 'Português',
        'ru': 'Русский',
        'ar': 'العربية',
        'hi': 'हिन्दी'
    };

    // 상태 관리
    const state = {
        currentLang: localStorage.getItem('siteLanguage') || 'ko'
    };

    // DOM 요소 캐싱
    const DOMCache = {
        languageItems: null,
        languageBtn: null,
        initialized: false
    };

    // DOM 초기화
    function initDOMCache() {
        if (DOMCache.initialized) return;
        
        DOMCache.languageItems = document.querySelectorAll('.language-item');
        DOMCache.languageBtn = document.getElementById('languageBtn');
        
        DOMCache.initialized = true;
    }

    // 언어 버튼 텍스트 업데이트
    function updateLanguageButtonText(lang) {
        if (!DOMCache.languageBtn) return;
        
        const languageText = languageNames[lang] || 'Language';
        const languageTextSpan = DOMCache.languageBtn.querySelector('.language-btn-text');
        
        if (languageTextSpan) {
            languageTextSpan.textContent = languageText;
        }
    }

    // 언어 선택 업데이트
    function updateLanguageSelection(lang) {
        if (!DOMCache.languageItems || DOMCache.languageItems.length === 0) return;
        
        requestAnimationFrame(() => {
            DOMCache.languageItems.forEach(item => {
                const itemLang = item.dataset.lang;
                const checkIcon = item.querySelector('.language-check');
                
                if (itemLang === lang) {
                    item.classList.add('active');
                    item.setAttribute('aria-selected', 'true');
                    if (checkIcon) {
                        checkIcon.style.display = 'inline-block';
                    }
                } else {
                    item.classList.remove('active');
                    item.setAttribute('aria-selected', 'false');
                    if (checkIcon) {
                        checkIcon.style.display = 'none';
                    }
                }
            });
            
            // 언어 버튼 텍스트 업데이트
            updateLanguageButtonText(lang);
        });
    }

    // 언어 변경 처리
    function handleLanguageChange(lang) {
        if (state.currentLang === lang) {
            return;
        }
        
        state.currentLang = lang;
        
        // localStorage 저장
        try {
            localStorage.setItem('siteLanguage', lang);
        } catch (e) {
            console.warn('localStorage 저장 실패:', e);
        }
        
        // UI 업데이트
        updateLanguageSelection(lang);
        
        // 언어 변경 이벤트 발생
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
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // 언어 아이템 클릭 처리
    function handleLanguageItemClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const item = e.target.closest('.language-item');
        if (!item) return;
        
        const lang = item.dataset.lang;
        if (lang) {
            handleLanguageChange(lang);
        }
    }

    // 초기화
    function init() {
        initDOMCache();
        
        if (!DOMCache.languageItems || DOMCache.languageItems.length === 0) {
            console.warn('Language items not found');
            return;
        }

        // 언어 아이템 클릭 이벤트 (이벤트 위임)
        const languageContainer = document.getElementById('languageDropdownContainer');
        if (languageContainer) {
            languageContainer.addEventListener('click', handleLanguageItemClick, true);
        }

        // 각 언어 아이템에 직접 이벤트도 추가
        DOMCache.languageItems.forEach(item => {
            if (!item.hasAttribute('data-listener-added')) {
                item.setAttribute('data-listener-added', 'true');
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = item.dataset.lang;
                    if (lang) {
                        handleLanguageChange(lang);
                    }
                });
            }
        });

        // 키보드 접근성
        if (languageContainer) {
            languageContainer.addEventListener('keydown', (e) => {
                const item = e.target.closest('.language-item');
                if (!item) return;
                
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = item.dataset.lang;
                    if (lang) {
                        handleLanguageChange(lang);
                    }
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const items = Array.from(DOMCache.languageItems);
                    const currentIndex = items.indexOf(item);
                    const nextIndex = e.key === 'ArrowDown' 
                        ? (currentIndex + 1) % items.length
                        : (currentIndex - 1 + items.length) % items.length;
                    items[nextIndex].focus();
                }
            });
        }

        // 초기 언어 선택 상태 복원
        updateLanguageSelection(state.currentLang);
        
        // 초기 언어 버튼 텍스트 설정
        updateLanguageButtonText(state.currentLang);
        
        // 접근성: ARIA 속성 추가
        if (DOMCache.languageBtn) {
            DOMCache.languageBtn.setAttribute('aria-label', '언어 선택');
            DOMCache.languageBtn.setAttribute('aria-expanded', 'false');
            DOMCache.languageBtn.setAttribute('aria-haspopup', 'true');
        }
        
        if (languageContainer) {
            languageContainer.setAttribute('role', 'menu');
            languageContainer.setAttribute('aria-label', '언어 선택 메뉴');
        }
        
        DOMCache.languageItems.forEach(item => {
            item.setAttribute('role', 'menuitemradio');
            item.setAttribute('tabindex', item.classList.contains('active') ? '0' : '-1');
        });

        // 호버 시 ARIA 속성 업데이트
        const languageWrapper = document.querySelector('.language-selector-wrapper');
        if (languageWrapper && DOMCache.languageBtn) {
            languageWrapper.addEventListener('mouseenter', () => {
                DOMCache.languageBtn.setAttribute('aria-expanded', 'true');
            });
            
            languageWrapper.addEventListener('mouseleave', () => {
                DOMCache.languageBtn.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // DOMContentLoaded 또는 즉시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 전역으로 내보내기
    window.LanguageSelector = {
        setLanguage: handleLanguageChange,
        getCurrentLanguage: () => state.currentLang
    };

})();

