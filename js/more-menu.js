// AX2 More Menu & Language Selector - 최적화된 버전
// 이벤트 위임, DOM 캐싱, 디바운싱 적용

(function() {
    'use strict';
    
    // 언어별 번역 데이터
    const translations = {
        'ko': {
            'nav-auto-translate': '자막생성',
            'nav-usage': '사용방법',
            'nav-pricing': '크레딧/충전',
            'nav-login': '로그인',
            'nav-signup': '가입하기',
            'menu-other-products': '기타 제품',
            'menu-subtitle-gen': '자막생성',
            'menu-subtitle-desc': 'AI 기반 실시간 번역',
            'menu-lecture-trans': '강의 번역',
            'menu-lecture-desc': '라이브 번역 및 자막',
            'menu-solutions': '솔루션',
            'menu-business': '비즈니스',
            'menu-business-desc': '비즈니스 팀을 위한 PDF 편집 및 워크플로 간소화',
            'menu-applications': '응용 프로그램',
            'menu-desktop': '데스크톱 앱',
            'menu-desktop-desc': 'Mac 및 Windows에서 사용 가능',
            'menu-mobile': '모바일 앱',
            'menu-mobile-desc': 'iOS 및 안드로이드에서 사용 가능',
            'menu-pricing': '가격',
            'menu-security': '보안',
            'menu-features': '기능',
            'menu-about': '회사 소개',
            'menu-help': '도움',
            'menu-language': '언어',
            'help-usage': '사용방법',
            'help-faq': '자주 묻는 질문',
            'help-tools': '도구',
            'help-legal': '법률 & 개인 정보 보호',
            'help-contact': '문의',
            'main-title': '강의 영상을 업로드하세요',
            'main-subtitle': 'AI가 자동으로 자막을 생성하고 번역합니다.',
            'upload-drag': '여기로 파일을 드래그하거나 클릭하세요',
            'upload-info': 'MP4, MOV, AVI (최대 2GB)'
        },
        'ja': {
            'nav-auto-translate': '字幕生成',
            'nav-usage': '使用方法',
            'nav-pricing': 'プラン/決済',
            'nav-login': 'ログイン',
            'nav-signup': '登録',
            'menu-other-products': 'その他の製品',
            'menu-subtitle-gen': '字幕生成',
            'menu-subtitle-desc': 'AIベースのリアルタイム翻訳',
            'menu-lecture-trans': '講義翻訳',
            'menu-lecture-desc': 'ライブ翻訳と字幕',
            'menu-solutions': 'ソリューション',
            'menu-business': 'ビジネス',
            'menu-business-desc': 'ビジネスチーム向けPDF編集とワークフロー簡素化',
            'menu-applications': 'アプリケーション',
            'menu-desktop': 'デスクトップアプリ',
            'menu-desktop-desc': 'MacおよびWindowsで利用可能',
            'menu-mobile': 'モバイルアプリ',
            'menu-mobile-desc': 'iOSおよびAndroidで利用可能',
            'menu-pricing': '価格',
            'menu-security': 'セキュリティ',
            'menu-features': '機能',
            'menu-about': '会社概要',
            'menu-help': 'ヘルプ',
            'menu-language': '言語',
            'help-faq': 'よくある質問',
            'help-tools': 'ツール',
            'help-legal': '法律とプライバシー',
            'help-contact': 'お問い合わせ',
            'main-title': '講義動画をアップロードしてください',
            'main-subtitle': 'AIが自動的に字幕を生成し、翻訳します。',
            'upload-drag': 'ここにファイルをドラッグするかクリックしてください',
            'upload-info': 'MP4, MOV, AVI (最大2GB)'
        },
        'zh': {
            'nav-auto-translate': '字幕生成',
            'nav-usage': '使用方法',
            'nav-pricing': '价格/支付',
            'nav-login': '登录',
            'nav-signup': '注册',
            'menu-other-products': '其他产品',
            'menu-subtitle-gen': '字幕生成',
            'menu-subtitle-desc': '基于AI的实时翻译',
            'menu-lecture-trans': '讲座翻译',
            'menu-lecture-desc': '实时翻译和字幕',
            'menu-solutions': '解决方案',
            'menu-business': '商业',
            'menu-business-desc': '为商业团队简化PDF编辑和工作流程',
            'menu-applications': '应用程序',
            'menu-desktop': '桌面应用',
            'menu-desktop-desc': '适用于Mac和Windows',
            'menu-mobile': '移动应用',
            'menu-mobile-desc': '适用于iOS和Android',
            'menu-pricing': '价格',
            'menu-security': '安全',
            'menu-features': '功能',
            'menu-about': '公司介绍',
            'menu-help': '帮助',
            'menu-language': '语言',
            'help-usage': '使用方法',
            'help-faq': '常见问题',
            'help-tools': '工具',
            'help-legal': '法律与隐私',
            'help-contact': '联系我们',
            'main-title': '上传讲座视频',
            'main-subtitle': 'AI将自动生成并翻译字幕。',
            'upload-drag': '将文件拖到此处或点击',
            'upload-info': 'MP4, MOV, AVI (最大2GB)'
        },
        'de': {
            'nav-auto-translate': 'Untertitel erstellen',
            'nav-usage': 'Verwendung',
            'nav-pricing': 'Preise/Zahlung',
            'nav-login': 'Anmelden',
            'nav-signup': 'Registrieren',
            'menu-other-products': 'Weitere Produkte',
            'menu-subtitle-gen': 'Untertitel erstellen',
            'menu-subtitle-desc': 'KI-basierte Echtzeitübersetzung',
            'menu-lecture-trans': 'Vorlesungsübersetzung',
            'menu-lecture-desc': 'Live-Übersetzung und Untertitel',
            'menu-solutions': 'Lösungen',
            'menu-business': 'Business',
            'menu-business-desc': 'PDF-Bearbeitung und Workflow-Vereinfachung für Geschäftsteams',
            'menu-applications': 'Anwendungen',
            'menu-desktop': 'Desktop-App',
            'menu-desktop-desc': 'Verfügbar für Mac und Windows',
            'menu-mobile': 'Mobile App',
            'menu-mobile-desc': 'Verfügbar für iOS und Android',
            'menu-pricing': 'Preise',
            'menu-security': 'Sicherheit',
            'menu-features': 'Funktionen',
            'menu-about': 'Über uns',
            'menu-help': 'Hilfe',
            'menu-language': 'Sprache',
            'help-faq': 'Häufig gestellte Fragen',
            'help-tools': 'Tools',
            'help-legal': 'Rechtliches & Datenschutz',
            'help-contact': 'Kontakt',
            'main-title': 'Vorlesungsvideo hochladen',
            'main-subtitle': 'KI erstellt und übersetzt automatisch Untertitel.',
            'upload-drag': 'Datei hierher ziehen oder klicken',
            'upload-info': 'MP4, MOV, AVI (max. 2GB)'
        },
        'fr': {
            'nav-auto-translate': 'Génération de sous-titres',
            'nav-usage': 'Mode d\'emploi',
            'nav-pricing': 'Tarifs/Paiement',
            'nav-login': 'Connexion',
            'nav-signup': 'S\'inscrire',
            'menu-other-products': 'Autres produits',
            'menu-subtitle-gen': 'Génération de sous-titres',
            'menu-subtitle-desc': 'Traduction en temps réel basée sur l\'IA',
            'menu-lecture-trans': 'Traduction de cours',
            'menu-lecture-desc': 'Traduction en direct et sous-titres',
            'menu-solutions': 'Solutions',
            'menu-business': 'Entreprise',
            'menu-business-desc': 'Édition PDF et simplification des flux de travail pour les équipes',
            'menu-applications': 'Applications',
            'menu-desktop': 'Application de bureau',
            'menu-desktop-desc': 'Disponible pour Mac et Windows',
            'menu-mobile': 'Application mobile',
            'menu-mobile-desc': 'Disponible pour iOS et Android',
            'menu-pricing': 'Tarifs',
            'menu-security': 'Sécurité',
            'menu-features': 'Fonctionnalités',
            'menu-about': 'À propos',
            'menu-help': 'Aide',
            'menu-language': 'Langue',
            'help-usage': 'Mode d\'emploi',
            'help-faq': 'Questions fréquentes',
            'help-tools': 'Outils',
            'help-legal': 'Légal et confidentialité',
            'help-contact': 'Contact',
            'main-title': 'Télécharger une vidéo de cours',
            'main-subtitle': 'L\'IA génère et traduit automatiquement les sous-titres.',
            'upload-drag': 'Glissez le fichier ici ou cliquez',
            'upload-info': 'MP4, MOV, AVI (max. 2GB)'
        }
    };
    
    // 페이지 번역 함수 (즉시 적용) - 핵심 함수
    function translatePage(lang) {
        // 1. 번역 데이터 확인
        const langData = translations[lang];
        if (!langData) {
            console.warn('번역 데이터가 없습니다:', lang);
            return;
        }
        
        // 2. 모든 data-i18n 요소 찾기 및 번역 (동기적으로 즉시 실행)
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && langData[key]) {
                const newText = langData[key];
                // textContent로 즉시 업데이트
                element.textContent = newText;
            }
        });
        
        // 3. placeholder 번역
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (key && langData[key]) {
                element.placeholder = langData[key];
            }
        });
        
        // 4. title 속성 번역
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (key && langData[key]) {
                element.setAttribute('title', langData[key]);
            }
        });
    }

    // DOM 요소 캐싱 (한 번만 쿼리)
    const DOMCache = {
        moreMenuBtn: null,
        moreMenuDropdown: null,
        languageDropdownMenu: null,
        languageSettingItem: null,
        languageOptions: null,
        initialized: false
    };

    // URL 파라미터에서 언어 가져오기 (우선순위: URL > localStorage > 기본값)
    function getInitialLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            return urlLang;
        }
        const storedLang = localStorage.getItem('siteLanguage');
        if (storedLang) {
            return storedLang;
        }
        return 'ko'; // 기본값
    }
    
    // 상태 관리
    const state = {
        currentLang: getInitialLanguage(),
        isMenuOpen: false,
        isLanguageMenuVisible: false,
        hoverTimeout: null
    };
    
    // 초기 언어 설정 적용
    document.documentElement.setAttribute('lang', state.currentLang);

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
        DOMCache.languageSettingItem = document.querySelector('.language-setting-item');
        DOMCache.languageOptions = document.querySelectorAll('.language-option');
        
        DOMCache.initialized = true;
    }

    // 언어 선택 업데이트 (최적화: requestAnimationFrame 사용)
    function updateLanguageSelection(lang) {
        // 모든 언어 아이템 찾기 (language-item 사용)
        const languageItems = document.querySelectorAll('.language-item');
        
        if (!languageItems || languageItems.length === 0) return;
        
        // DOM 업데이트를 requestAnimationFrame으로 배치하여 성능 최적화
        requestAnimationFrame(() => {
            languageItems.forEach(item => {
                const itemLang = item.dataset.lang;
                const checkIcon = item.querySelector('.language-check');
                
                if (itemLang === lang) {
                    item.classList.add('active');
                    item.setAttribute('aria-selected', 'true');
                    if (checkIcon) {
                        checkIcon.style.display = 'inline-block';
                        checkIcon.setAttribute('aria-hidden', 'false');
                    }
                } else {
                    item.classList.remove('active');
                    item.setAttribute('aria-selected', 'false');
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
        console.log('handleLanguageChange 호출:', lang, '현재 언어:', state.currentLang);
        if (state.currentLang === lang) {
            console.log('이미 선택된 언어입니다:', lang);
            // 이미 선택된 언어여도 메뉴는 닫기
            closeLanguageMenu();
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
        
        // HTML lang 속성 변경 (즉시)
        document.documentElement.setAttribute('lang', lang);
        
        // 🔥 핵심: 페이지 번역 즉시 적용 (동기적으로 실행)
        translatePage(lang);
        
        // 언어 선택 UI 업데이트
        updateLanguageSelection(lang);
        
        // 언어 변경 이벤트 발생 (다른 스크립트에서 사용 가능)
        const event = new CustomEvent('languageChanged', {
            detail: { language: lang },
            bubbles: true
        });
        document.dispatchEvent(event);
        
        // URL 파라미터 업데이트 (페이지 리로드 없이 언어 변경)
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
        
        // 접근성: 스크린 리더 알림
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        
        // 언어별 메시지
        const langMessages = {
            'ko': '언어가 한국어로 변경되었습니다.',
            'ja': '言語が日本語に変更されました。',
            'zh': '语言已更改为简体中文。',
            'de': 'Sprache wurde auf Deutsch geändert.',
            'fr': 'La langue a été changée en français.'
        };
        announcement.textContent = langMessages[lang] || `언어가 ${lang}로 변경되었습니다.`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
        
        // 언어 선택 후 메뉴 닫기
        closeLanguageMenu();
        
        // 사용자 피드백 (선택 확인)
        console.log('언어 변경 완료:', lang);
        
        // 페이지 리로드하여 언어 변경 적용 (선택적)
        // 주석을 해제하면 언어 선택 시 페이지가 리로드됩니다
        // window.location.reload();
    }

    // 언어 메뉴 닫기 함수
    function closeLanguageMenu() {
        const languageSubmenuPanel = document.getElementById('languageSubmenuPanel');
        const helpSubmenuPanel = document.getElementById('helpSubmenuPanel');
        
        if (languageSubmenuPanel) {
            languageSubmenuPanel.classList.remove('visible');
        }
        if (helpSubmenuPanel) {
            helpSubmenuPanel.classList.remove('visible');
        }
    }

    // 메뉴 토글 (접근성 개선)
    function toggleMenu() {
        if (!DOMCache.moreMenuDropdown || !DOMCache.moreMenuBtn) return;
        
        state.isMenuOpen = !state.isMenuOpen;
        
        if (state.isMenuOpen) {
            // 사용자 정보 드롭다운이 열려있으면 강제로 닫기 (항상 닫기)
            const userDropdown = document.querySelector('.user-dropdown-menu');
            if (userDropdown) {
                userDropdown.style.display = 'none';
            }
            // 모든 사용자 드롭다운 요소 찾아서 닫기
            const allUserDropdowns = document.querySelectorAll('.user-dropdown-menu');
            allUserDropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
            
            DOMCache.moreMenuDropdown.classList.add('active');
            DOMCache.moreMenuDropdown.classList.remove('has-submenu-active'); // 메뉴 열 때 블러 효과 제거
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'true');
            // 메뉴가 열릴 때 무조건 최상위로 올리기
            DOMCache.moreMenuDropdown.style.zIndex = '99999';
            
            // 외부 클릭 감지를 위한 이벤트 리스너 추가
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick, true);
            }, 0);
        } else {
            // 메뉴 닫을 때 언어/도움 드롭다운도 함께 닫기
            closeLanguageMenu();
            DOMCache.moreMenuDropdown.classList.remove('active');
            DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'false');
            // 메뉴가 닫힐 때 z-index 복원
            DOMCache.moreMenuDropdown.style.zIndex = '';
            document.removeEventListener('click', handleOutsideClick, true);
        }
    }

    // 외부 클릭 처리
    function handleOutsideClick(e) {
        if (!DOMCache.moreMenuDropdown || !DOMCache.moreMenuBtn) return;
        
        // 서브메뉴 패널도 확인
        const helpSubmenuPanel = document.getElementById('helpSubmenuPanel');
        const languageSubmenuPanel = document.getElementById('languageSubmenuPanel');
        
        // 사용자 정보 드롭다운도 확인
        const userInfoDisplay = document.querySelector('.user-info-display');
        const userDropdown = document.querySelector('.user-dropdown-menu');
        const isUserDropdownClick = (userInfoDisplay && userInfoDisplay.contains(e.target)) ||
                                   (userDropdown && userDropdown.contains(e.target));
        
        const isClickInside = DOMCache.moreMenuDropdown.contains(e.target) ||
                             DOMCache.moreMenuBtn.contains(e.target) ||
                             (helpSubmenuPanel && helpSubmenuPanel.contains(e.target)) ||
                             (languageSubmenuPanel && languageSubmenuPanel.contains(e.target)) ||
                             isUserDropdownClick;
        
        // 사용자 정보 드롭다운을 클릭한 경우 더보기 메뉴 닫기
        if (isUserDropdownClick && state.isMenuOpen) {
            toggleMenu();
        } else if (!isClickInside && state.isMenuOpen) {
            toggleMenu();
        }
    }

    // 언어 메뉴는 CSS :hover로 처리되므로 JavaScript는 선택 기능만 처리


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
            
            // 사용자 정보 드롭다운이 열려있으면 강제로 닫기 (조건 없이 항상 닫기)
            const allUserDropdowns = document.querySelectorAll('.user-dropdown-menu');
            allUserDropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
            
            // 사용자 정보 표시 요소도 확인
            const userInfoDisplay = document.querySelector('.user-info-display');
            if (userInfoDisplay) {
                const userWrapper = userInfoDisplay.closest('.user-info-wrapper');
                if (userWrapper) {
                    const userDropdown = userWrapper.querySelector('.user-dropdown-menu');
                    if (userDropdown) {
                        userDropdown.style.display = 'none';
                    }
                }
            }
            
            toggleMenu();
        });

        // 도움 메뉴 호버 이벤트 - 솔루션 부분에 서브메뉴 패널 표시
        const helpSettingItem = document.querySelector('.help-setting-item');
        if (helpSettingItem) {
            const helpSubmenuPanel = document.getElementById('helpSubmenuPanel');
            const languageSubmenuPanel = document.getElementById('languageSubmenuPanel');
            const businessSection = document.querySelector('.menu-comp__business');
            
            if (helpSubmenuPanel) {
                let helpMenuTimeout = null;
                window.helpMenuTimeout = null; // 전역에서 접근 가능하도록
                
                const handleHelpEnter = () => {
                    // 메뉴가 열려있지 않으면 먼저 열기
                    if (!state.isMenuOpen) {
                        toggleMenu();
                    }
                    
                    // 타임아웃 취소
                    if (helpMenuTimeout) {
                        clearTimeout(helpMenuTimeout);
                        helpMenuTimeout = null;
                    }
                    
                    // 언어 서브메뉴 패널 닫기
                    if (languageSubmenuPanel) {
                        languageSubmenuPanel.classList.remove('visible');
                    }
                    
                    // 언어 메뉴 타임아웃 취소 (도움으로 이동할 때)
                    const languageMenuTimeout = window.languageMenuTimeout;
                    if (languageMenuTimeout) {
                        clearTimeout(languageMenuTimeout);
                        window.languageMenuTimeout = null;
                    }
                    
                    // 솔루션 섹션 숨기기
                    if (businessSection) {
                        businessSection.classList.add('hidden');
                    }
                    
                    // 왼쪽/오른쪽 열 블러 처리 (항상 유지)
                    if (DOMCache.moreMenuDropdown) {
                        DOMCache.moreMenuDropdown.classList.add('has-submenu-active');
                    }
                    
                    // 도움 서브메뉴 패널 열기
                    helpSubmenuPanel.classList.add('visible');
                };
                
                const handleHelpLeave = (e) => {
                    const relatedTarget = e.relatedTarget;
                    
                    // 타임아웃 설정
                    if (helpMenuTimeout) {
                        clearTimeout(helpMenuTimeout);
                        helpMenuTimeout = null;
                        window.helpMenuTimeout = null;
                    }
                    
                    if (!relatedTarget) {
                        // 더보기 메뉴 밖으로 나간 경우
                        helpMenuTimeout = setTimeout(() => {
                            helpSubmenuPanel.classList.remove('visible');
                            if (businessSection) {
                                businessSection.classList.remove('hidden');
                            }
                            if (DOMCache.moreMenuDropdown) {
                                DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
                            }
                            helpMenuTimeout = null;
                            window.helpMenuTimeout = null;
                        }, 150);
                        window.helpMenuTimeout = helpMenuTimeout; // 전역에도 저장
                        return;
                    }
                    
                    const isLeavingToPanel = helpSubmenuPanel.contains(relatedTarget);
                    const isLeavingToItem = helpSettingItem.contains(relatedTarget);
                    const isLeavingToLanguageItem = DOMCache.languageSettingItem && DOMCache.languageSettingItem.contains(relatedTarget);
                    
                    // 서브 패널, 도움 아이템, 또는 언어 아이템으로 이동하는 경우가 아니면 닫기
                    if (!isLeavingToPanel && !isLeavingToItem && !isLeavingToLanguageItem) {
                        helpMenuTimeout = setTimeout(() => {
                            helpSubmenuPanel.classList.remove('visible');
                            if (businessSection) {
                                businessSection.classList.remove('hidden');
                            }
                            if (DOMCache.moreMenuDropdown) {
                                DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
                            }
                            helpMenuTimeout = null;
                            window.helpMenuTimeout = null;
                        }, 150);
                        window.helpMenuTimeout = helpMenuTimeout; // 전역에도 저장
                    }
                };
                
                helpSettingItem.addEventListener('mouseenter', handleHelpEnter);
                helpSettingItem.addEventListener('mouseleave', handleHelpLeave);
                
                helpSubmenuPanel.addEventListener('mouseenter', () => {
                    // 타임아웃 취소 및 블러 효과 유지
                    if (helpMenuTimeout) {
                        clearTimeout(helpMenuTimeout);
                        helpMenuTimeout = null;
                    }
                    // 서브 패널로 이동했을 때도 블러 효과 유지
                    if (DOMCache.moreMenuDropdown) {
                        DOMCache.moreMenuDropdown.classList.add('has-submenu-active');
                    }
                });
                
                helpSubmenuPanel.addEventListener('mouseleave', handleHelpLeave);
            }
        }

        // 언어 설정 아이템 호버 이벤트 - 솔루션 부분에 서브메뉴 패널 표시
        if (DOMCache.languageSettingItem) {
            const languageSubmenuPanel = document.getElementById('languageSubmenuPanel');
            const helpSubmenuPanel = document.getElementById('helpSubmenuPanel');
            const businessSection = document.querySelector('.menu-comp__business');
            
            if (languageSubmenuPanel) {
                let languageMenuTimeout = null;
                window.languageMenuTimeout = null; // 전역에서 접근 가능하도록
                
                // languageMenuTimeout을 window에 저장하여 다른 함수에서 접근 가능하도록
                const updateLanguageTimeout = (timeout) => {
                    languageMenuTimeout = timeout;
                    window.languageMenuTimeout = timeout;
                };
                
                const handleLanguageEnter = () => {
                    // 메뉴가 열려있지 않으면 먼저 열기
                    if (!state.isMenuOpen) {
                        toggleMenu();
                    }
                    
                    // 타임아웃 취소
                    if (languageMenuTimeout) {
                        clearTimeout(languageMenuTimeout);
                        languageMenuTimeout = null;
                    }
                    
                    // 도움 서브메뉴 패널 닫기
                    if (helpSubmenuPanel) {
                        helpSubmenuPanel.classList.remove('visible');
                    }
                    
                    // 도움 메뉴 타임아웃 취소 (언어로 이동할 때)
                    const helpMenuTimeout = window.helpMenuTimeout;
                    if (helpMenuTimeout) {
                        clearTimeout(helpMenuTimeout);
                        window.helpMenuTimeout = null;
                    }
                    
                    // 솔루션 섹션 숨기기
                    if (businessSection) {
                        businessSection.classList.add('hidden');
                    }
                    
                    // 왼쪽/오른쪽 열 블러 처리 (항상 유지)
                    if (DOMCache.moreMenuDropdown) {
                        DOMCache.moreMenuDropdown.classList.add('has-submenu-active');
                    }
                    
                    // 언어 서브메뉴 패널 열기
                    languageSubmenuPanel.classList.add('visible');
                };
                
                const handleLanguageLeave = (e) => {
                    const relatedTarget = e.relatedTarget;
                    
                    // 타임아웃 설정
                    if (languageMenuTimeout) {
                        clearTimeout(languageMenuTimeout);
                        languageMenuTimeout = null;
                        window.languageMenuTimeout = null;
                    }
                    
                    if (!relatedTarget) {
                        // 더보기 메뉴 밖으로 나간 경우
                        languageMenuTimeout = setTimeout(() => {
                            languageSubmenuPanel.classList.remove('visible');
                            if (businessSection) {
                                businessSection.classList.remove('hidden');
                            }
                            if (DOMCache.moreMenuDropdown) {
                                DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
                            }
                            languageMenuTimeout = null;
                            window.languageMenuTimeout = null;
                        }, 150);
                        window.languageMenuTimeout = languageMenuTimeout; // 전역에도 저장
                        return;
                    }
                    
                    const isLeavingToPanel = languageSubmenuPanel.contains(relatedTarget);
                    const isLeavingToLanguageItem = relatedTarget.closest('.language-item') !== null;
                    const isLeavingToItem = DOMCache.languageSettingItem.contains(relatedTarget);
                    const isLeavingToHelpItem = helpSettingItem && helpSettingItem.contains(relatedTarget);
                    
                    // 서브 패널, 언어 아이템, 언어 설정 아이템, 또는 도움 아이템으로 이동하는 경우가 아니면 닫기
                    if (!isLeavingToPanel && !isLeavingToLanguageItem && !isLeavingToItem && !isLeavingToHelpItem) {
                        languageMenuTimeout = setTimeout(() => {
                            languageSubmenuPanel.classList.remove('visible');
                            if (businessSection) {
                                businessSection.classList.remove('hidden');
                            }
                            if (DOMCache.moreMenuDropdown) {
                                DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
                            }
                            languageMenuTimeout = null;
                            window.languageMenuTimeout = null;
                        }, 150);
                        window.languageMenuTimeout = languageMenuTimeout; // 전역에도 저장
                    }
                };
                
                DOMCache.languageSettingItem.addEventListener('mouseenter', handleLanguageEnter);
                DOMCache.languageSettingItem.addEventListener('mouseleave', handleLanguageLeave);
                
                languageSubmenuPanel.addEventListener('mouseenter', () => {
                    // 타임아웃 취소 및 블러 효과 유지
                    if (languageMenuTimeout) {
                        clearTimeout(languageMenuTimeout);
                        languageMenuTimeout = null;
                    }
                    // 서브 패널로 이동했을 때도 블러 효과 유지
                    if (DOMCache.moreMenuDropdown) {
                        DOMCache.moreMenuDropdown.classList.add('has-submenu-active');
                    }
                });
                
                languageSubmenuPanel.addEventListener('mouseleave', handleLanguageLeave);
                
                // 언어 아이템들에도 mouseenter 이벤트 추가
                const languageItems = languageSubmenuPanel.querySelectorAll('.language-item');
                languageItems.forEach(item => {
                    item.addEventListener('mouseenter', () => {
                        // 타임아웃 취소
                        if (languageMenuTimeout) {
                            clearTimeout(languageMenuTimeout);
                            languageMenuTimeout = null;
                        }
                    });
                });
            }
        }

        // 언어 옵션 클릭 이벤트 (이벤트 위임) - language-item 사용
        const languageSubmenuPanel = document.getElementById('languageSubmenuPanel');
        if (languageSubmenuPanel) {
            const languageList = languageSubmenuPanel.querySelector('.language-menu-list');
            if (languageList) {
                // 클릭 이벤트 리스너 추가
                languageList.addEventListener('click', (e) => {
                    const item = e.target.closest('.language-item');
                    if (!item) return;
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const lang = item.dataset.lang;
                    if (lang) {
                        // 🔥 핵심: 언어 변경 즉시 적용
                        handleLanguageChange(lang);
                        
                        // 언어 선택 후 서브메뉴 패널 닫기
                        const businessSection = document.querySelector('.menu-comp__business');
                        languageSubmenuPanel.classList.remove('visible');
                        if (businessSection) {
                            businessSection.classList.remove('hidden');
                        }
                        if (DOMCache.moreMenuDropdown) {
                            DOMCache.moreMenuDropdown.classList.remove('has-submenu-active');
                        }
                    }
                });
                
                // 키보드 접근성 추가
                languageList.addEventListener('keydown', (e) => {
                    const item = e.target.closest('.language-item');
                    if (!item) return;
                    
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        const lang = item.dataset.lang;
                        if (lang) {
                            handleLanguageChange(lang);
                            // 언어 선택 후 서브메뉴 패널 닫기
                            languageSubmenuPanel.classList.remove('visible');
                        }
                    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const items = Array.from(languageList.querySelectorAll('.language-item'));
                        const currentIndex = items.indexOf(item);
                        const nextIndex = e.key === 'ArrowDown' 
                            ? (currentIndex + 1) % items.length
                            : (currentIndex - 1 + items.length) % items.length;
                        items[nextIndex].focus();
                    }
                });
            }
        }

        // 초기 언어 선택 상태 복원
        updateLanguageSelection(state.currentLang);
        
        // 초기 페이지 번역 적용
        translatePage(state.currentLang);
        
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
        
        // 초기 상태 확인: 메뉴가 이미 열려있는 경우 외부 클릭 이벤트 등록
        if (DOMCache.moreMenuDropdown && DOMCache.moreMenuDropdown.classList.contains('active')) {
            state.isMenuOpen = true;
            DOMCache.moreMenuBtn.setAttribute('aria-expanded', 'true');
            document.addEventListener('click', handleOutsideClick, true);
        }
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
        getCurrentLanguage: () => state.currentLang,
        closeMenu: function() {
            if (state.isMenuOpen) {
                toggleMenu();
            }
        },
        state: state
    };

})();

