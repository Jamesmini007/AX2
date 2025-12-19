        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        // 언어별 텍스트 데이터
        const translations = {
            'KO': {
                'main-headline': '만들고, 번역하고, 소통하세요',
                'sub-headline': '한 번의 클릭으로 언어의 장벽을 넘어보세요',
                'tagline': '고품질 영상, 촬영 불필요 - 간단한 클릭 한 번으로 복제하고 번역하세요.',
                'feature1': '실시간 음성 인식 및 번역',
                'feature2': '다국어 자막 자동 생성',
                'feature3': '강의 자동 저장 및 관리',
                'feature4': '간편한 공유 및 다운로드',
                'welcome-title': 'AX2에 오신 것을 환영합니다',
                'welcome-subtitle': '한 번의 클릭으로 언어를 넘어서세요',
                'google-btn': 'Google로 시작하기',
                'kakao-btn': '카카오톡으로 시작하기',
                'naver-btn': '네이버로 시작하기',
                'or': '또는',
                'email-placeholder': '이메일을 입력해 주세요.',
                'email-error': '올바른 이메일 주소를 입력해주세요.',
                'continue-btn': '계속',
                'guest-btn': '게스트',
                'signup-question': '아직 계정이 없으신가요?',
                'signup-link': '무료 회원가입',
                'success-message': '로그인 성공! 마이페이지로 이동합니다...',
                'login-error': '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
                'email-required': '이메일을 입력해주세요.',
                'user-not-found': '등록되지 않은 이메일입니다. 회원가입을 진행해주세요.',
                'go-to-signup': '회원가입 페이지로 이동하시겠습니까?'
            },
            'EN': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': 'One click to break language barriers',
                'tagline': 'High-Quality Videos, No Filming Needed - Clone and Translate with One Simple Click.',
                'feature1': 'Real-time Voice Recognition & Translation',
                'feature2': 'Automatic Multilingual Subtitle Generation',
                'feature3': 'Automatic Lecture Storage & Management',
                'feature4': 'Easy Sharing & Download',
                'welcome-title': 'Welcome to AX2',
                'welcome-subtitle': 'Transcend Languages with One Click',
                'google-btn': 'Continue with Google',
                'kakao-btn': 'Continue with Kakao',
                'naver-btn': 'Continue with Naver',
                'or': 'OR',
                'email-placeholder': 'Enter your email',
                'email-error': 'Please enter a valid email address.',
                'continue-btn': 'Continue',
                'guest-btn': 'Guest',
                'signup-question': "Don't have an account yet?",
                'signup-link': 'Free Sign Up',
                'success-message': 'Login successful! Redirecting to mypage...',
                'login-error': 'An error occurred during login. Please try again.',
                'email-required': 'Please enter your email.',
                'user-not-found': 'Email not registered. Please sign up.',
                'go-to-signup': 'Would you like to go to the signup page?'
            },
            'JA': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': 'ワンクリックで言語の壁を越える',
                'tagline': '高品質な動画、撮影不要 - ワンクリックで複製・翻訳',
                'feature1': 'リアルタイム音声認識と翻訳',
                'feature2': '多言語字幕の自動生成',
                'feature3': '講義の自動保存と管理',
                'feature4': '簡単な共有とダウンロード',
                'welcome-title': 'AX2へようこそ',
                'welcome-subtitle': 'ワンクリックで言語を超越',
                'google-btn': 'Googleで始める',
                'kakao-btn': 'カカオトークで始める',
                'naver-btn': 'ネイバーで始める',
                'or': 'または',
                'email-placeholder': 'メールアドレスを入力してください',
                'email-error': '有効なメールアドレスを入力してください。',
                'continue-btn': '続ける',
                'continue-btn': '続ける',
                'guest-btn': 'ゲスト',
                'signup-question': 'まだアカウントをお持ちでないですか？',
                'signup-link': '無料会員登録',
                'success-message': 'ログイン成功！マイページに移動します...',
                'login-error': 'ログイン中にエラーが発生しました。再度お試しください。',
                'email-required': 'メールアドレスを入力してください。',
                'user-not-found': '登録されていないメールアドレスです。会員登録を進めてください。',
                'go-to-signup': '会員登録ページに移動しますか？'
            },
            'ZH': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': '一键打破语言障碍',
                'tagline': '高质量视频，无需拍摄 - 一键克隆和翻译',
                'feature1': '实时语音识别和翻译',
                'feature2': '多语言字幕自动生成',
                'feature3': '课程自动保存和管理',
                'feature4': '便捷的共享和下载',
                'welcome-title': '欢迎使用 AX2',
                'welcome-subtitle': '一键超越语言',
                'google-btn': '使用 Google 继续',
                'kakao-btn': '使用 Kakao 继续',
                'naver-btn': '使用 Naver 继续',
                'or': '或',
                'email-placeholder': '请输入您的邮箱',
                'email-error': '请输入有效的邮箱地址。',
                'continue-btn': '继续',
                'guest-btn': '访客',
                'signup-question': '还没有账户？',
                'signup-link': '免费注册',
                'success-message': '登录成功！正在跳转到我的页面...',
                'login-error': '登录过程中发生错误。请重试。',
                'email-required': '请输入您的邮箱。',
                'user-not-found': '未注册的邮箱。请进行注册。',
                'go-to-signup': '是否要转到注册页面？'
            }
        };

        // DOM 요소 캐싱 (최적화)
        const DOMCache = {
            get languageSelector() { return document.getElementById('language-selector'); },
            get languageDropdown() { return document.getElementById('language-dropdown'); },
            get currentLangSpan() { return document.getElementById('current-lang'); },
            get languageOptions() { return document.querySelectorAll('.language-option'); },
            get emailInput() { return document.getElementById('email-input'); },
            get continueBtn() { return document.getElementById('continue-btn'); }
        };
        
        let currentLang = 'KO';

        // 페이지 번역 함수
        function translatePage(lang) {
            const langData = translations[lang];
            if (!langData) return;

            // 모든 data-i18n 속성을 가진 요소 번역
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langData[key]) {
                    element.textContent = langData[key];
                }
            });

            // placeholder 번역
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (langData[key]) {
                    element.placeholder = langData[key];
                }
            });
        }

        // 언어 선택기 초기화 (최적화)
        function initializeLanguageSelector() {
            const languageSelector = DOMCache.languageSelector;
            const languageDropdown = DOMCache.languageDropdown;
            const currentLangSpan = DOMCache.currentLangSpan;
            
            if (!languageSelector || !languageDropdown || !currentLangSpan) return;
            
            // 언어 선택기 토글
            languageSelector.addEventListener('click', function(e) {
                e.stopPropagation();
                languageDropdown.classList.toggle('show');
            });

            // 언어 옵션 선택
            DOMCache.languageOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const lang = this.dataset.lang;
                    currentLang = lang;
                    currentLangSpan.textContent = lang;
                    
                    // 활성 상태 업데이트
                    DOMCache.languageOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    languageDropdown.classList.remove('show');
                    
                    // 페이지 번역
                    translatePage(lang);
                });
            });

            // 외부 클릭 시 드롭다운 닫기
            document.addEventListener('click', function(e) {
                if (!languageSelector.contains(e.target) && !languageDropdown.contains(e.target)) {
                    languageDropdown.classList.remove('show');
                }
            });
        }

        // 이메일 검증
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // 에러 표시
        function showError(input, message) {
            input.classList.add('error');
            const errorDiv = document.getElementById('email-error');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }

        // 에러 제거
        function clearError(input) {
            input.classList.remove('error');
            document.getElementById('email-error').classList.remove('show');
        }

        // 로딩 상태 설정
        function setLoading(button, isLoading) {
            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        }

        // 성공 메시지 표시
        function showSuccessMessage(messageKey) {
            const successMsg = document.getElementById('success-message');
            const message = translations[currentLang][messageKey] || translations['KO'][messageKey];
            successMsg.textContent = message;
            successMsg.classList.add('show');
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 3000);
        }

        // 사용자 찾기 함수 (최적화)
        function findUserByEmail(email) {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                return users.find(user => user.email.toLowerCase() === email.toLowerCase());
            } catch (error) {
                logger.error('사용자 찾기 오류:', error);
                return null;
            }
        }

        // 소셜 로그인 사용자 찾기
        function findSocialUser(provider) {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                return users.find(user => user.provider === provider);
            } catch (error) {
                logger.error('소셜 사용자 찾기 오류:', error);
                return null;
            }
        }

        // 로그인 상태 저장
        function saveLoginState(user) {
            try {
                const loginData = {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    password: user.password || '',
                    provider: user.provider || 'email',
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(loginData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // 로그인 버튼 업데이트 (auth-state.js가 로드된 경우)
                if (window.updateLoginButton) {
                    window.updateLoginButton();
                }
            } catch (error) {
                logger.error('로그인 상태 저장 오류:', error);
            }
        }

        // 소셜 로그인 함수들 (최적화 및 API 연동)
        async function loginWithGoogle() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('Google 로그인 시작');
                
                // SocialAuth 모듈 사용
                if (window.SocialAuth && window.SocialAuth.loginWithGoogle) {
                    const user = await window.SocialAuth.loginWithGoogle();
                    logger.log('Google 로그인 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        if (!handleRedirectAfterLogin()) {
                            window.location.href = 'storage.html';
                        }
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('Google 로그인 오류:', error);
                alert(translations[currentLang]['login-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        async function loginWithKakao() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('카카오톡 로그인 시작');
                
                // SocialAuth 모듈 사용
                if (window.SocialAuth && window.SocialAuth.loginWithKakao) {
                    const user = await window.SocialAuth.loginWithKakao();
                    logger.log('카카오톡 로그인 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        if (!handleRedirectAfterLogin()) {
                            window.location.href = 'storage.html';
                        }
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('카카오톡 로그인 오류:', error);
                alert(translations[currentLang]['login-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        async function loginWithNaver() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('네이버 로그인 시작');
                
                // SocialAuth 모듈 사용
                if (window.SocialAuth && window.SocialAuth.loginWithNaver) {
                    const user = await window.SocialAuth.loginWithNaver();
                    logger.log('네이버 로그인 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        if (!handleRedirectAfterLogin()) {
                            window.location.href = 'storage.html';
                        }
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('네이버 로그인 오류:', error);
                alert(translations[currentLang]['login-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        // 이메일 로그인 (Firebase 연동)
        async function handleEmailLogin(event) {
            event.preventDefault();
            const emailInput = DOMCache.emailInput;
            const continueBtn = DOMCache.continueBtn;
            
            if (!emailInput || !continueBtn) return;
            
            const email = emailInput.value.trim().toLowerCase();
            
            // 에러 제거
            clearError(emailInput);
            
            // 이메일 검증
            if (!email) {
                const errorMsg = translations[currentLang]['email-required'] || '이메일을 입력해주세요.';
                showError(emailInput, errorMsg);
                return;
            }
            
            if (!validateEmail(email)) {
                const errorMsg = translations[currentLang]['email-error'];
                showError(emailInput, errorMsg);
                return;
            }
            
            // 로딩 시작
            setLoading(continueBtn, true);
            
            try {
                // localStorage에서 사용자 찾기
                const user = findUserByEmail(email);
                
                if (!user) {
                    const errorMsg = translations[currentLang]['user-not-found'] || '등록되지 않은 이메일입니다. 회원가입을 진행해주세요.';
                    showError(emailInput, errorMsg);
                    setLoading(continueBtn, false);
                    
                    setTimeout(() => {
                        if (confirm(translations[currentLang]['go-to-signup'] || '회원가입 페이지로 이동하시겠습니까?')) {
                            window.location.href = 'signup.html?email=' + encodeURIComponent(email);
                        }
                    }, 2000);
                    return;
                }
                
                // 로그인 상태 저장
                saveLoginState(user);
                
                logger.log('이메일 로그인 성공:', email);
                
                showSuccessMessage('success-message');
                
                setTimeout(() => {
                    if (!handleRedirectAfterLogin()) {
                        window.location.href = 'storage.html';
                    }
                }, 1500);
            } catch (error) {
                logger.error('이메일 로그인 오류:', error);
                const errorMsg = translations[currentLang]['login-error'];
                showError(emailInput, errorMsg + (error.message ? '\n' + error.message : ''));
            } finally {
                setLoading(continueBtn, false);
            }
        }

        // 입력 필드 이벤트 초기화 (최적화)
        function initializeInputEvents() {
            // 이메일 입력 시 실시간 검증
            if (DOMCache.emailInput) {
                DOMCache.emailInput.addEventListener('input', function() {
                    if (this.value.trim()) {
                        clearError(this);
                    }
                });
            }
        }

        // 게스트 로그인
        function loginAsGuest() {
            try {
                const guestUser = {
                    id: 'guest_' + Date.now(),
                    email: 'guest@ax2.com',
                    name: '게스트',
                    isGuest: true,
                    createdAt: new Date().toISOString()
                };
                
                // 게스트 계정 정보 저장
                saveLoginState(guestUser);
                
                logger.log('게스트 로그인 성공');
                
                showSuccessMessage('success-message');
                
                setTimeout(() => {
                    if (!handleRedirectAfterLogin()) {
                        window.location.href = '../index.html';
                    }
                }, 1500);
            } catch (error) {
                logger.error('게스트 로그인 오류:', error);
                alert('게스트 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }

        // 회원가입 표시
        function showSignup(event) {
            if (event) event.preventDefault();
            window.location.href = 'signup.html';
        }

        // 로그인 후 리디렉션 처리
        function handleRedirectAfterLogin() {
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                // 로그인 성공 후 원래 페이지로 돌아가기
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1500);
                return true;
            }
            return false;
        }
        
        // 초기화 함수 (최적화)
        function initialize() {
            // 언어 선택기 초기화
            initializeLanguageSelector();
            
            // 입력 필드 이벤트 초기화
            initializeInputEvents();
            
            // 페이지 번역
            translatePage('KO');
            
            // 이미 로그인된 경우 리디렉션 처리
            if (localStorage.getItem('isLoggedIn') === 'true') {
                if (handleRedirectAfterLogin()) {
                    return; // 리디렉션할 URL이 있으면 여기서 종료
                }
                // 리디렉션할 URL이 없으면 마이페이지로 이동
                window.location.href = 'storage.html';
            }
        }

        // DOM 로드 시 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        // 페이지 로드 시 애니메이션
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s';
                document.body.style.opacity = '1';
            }, 100);
        });
    