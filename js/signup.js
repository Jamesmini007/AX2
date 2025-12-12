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
                'back-link': '← 로그인으로 돌아가기',
                'welcome-title': '회원가입',
                'welcome-subtitle': 'AX2와 함께 언어의 장벽을 넘어보세요',
                'google-btn': 'Google로 가입하기',
                'kakao-btn': '카카오톡으로 가입하기',
                'naver-btn': '네이버로 가입하기',
                'or': '또는',
                'name-label': '이름',
                'name-placeholder': '이름을 입력해 주세요',
                'name-error': '이름을 입력해주세요.',
                'email-label': '이메일',
                'email-placeholder': '이메일을 입력해 주세요',
                'email-error': '올바른 이메일 주소를 입력해주세요.',
                'password-label': '비밀번호',
                'password-placeholder': '비밀번호를 입력해 주세요',
                'password-error': '비밀번호는 8자 이상이어야 합니다.',
                'password-confirm-label': '비밀번호 확인',
                'password-confirm-placeholder': '비밀번호를 다시 입력해 주세요',
                'password-confirm-error': '비밀번호가 일치하지 않습니다.',
                'terms-link': '이용약관',
                'terms-and': ' 및 ',
                'privacy-link': '개인정보처리방침',
                'terms-agree': '에 동의합니다.',
                'marketing-agree': '마케팅 정보 수신에 동의합니다 (선택)',
                'signup-btn': '회원가입',
                'login-question': '이미 계정이 있으신가요?',
                'login-link': '로그인',
                'success-message': '회원가입 성공! 로그인 페이지로 이동합니다...',
                'password-weak': '약함',
                'password-medium': '보통',
                'password-strong': '강함',
                'terms-alert': '이용약관에 동의해주세요.',
                'signup-error': '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
                'terms-coming': '이용약관 페이지는 준비 중입니다.',
                'privacy-coming': '개인정보처리방침 페이지는 준비 중입니다.',
                'email-duplicate': '이미 사용 중인 이메일입니다.'
            },
            'EN': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': 'One click to break language barriers',
                'tagline': 'High-Quality Videos, No Filming Needed - Clone and Translate with One Simple Click.',
                'feature1': 'Real-time Voice Recognition & Translation',
                'feature2': 'Automatic Multilingual Subtitle Generation',
                'feature3': 'Automatic Lecture Storage & Management',
                'feature4': 'Easy Sharing & Download',
                'back-link': '← Back to Login',
                'welcome-title': 'Sign Up',
                'welcome-subtitle': 'Break language barriers with AX2',
                'google-btn': 'Sign up with Google',
                'kakao-btn': 'Sign up with Kakao',
                'naver-btn': 'Sign up with Naver',
                'or': 'OR',
                'name-label': 'Name',
                'name-placeholder': 'Enter your name',
                'name-error': 'Please enter your name.',
                'email-label': 'Email',
                'email-placeholder': 'Enter your email',
                'email-error': 'Please enter a valid email address.',
                'password-label': 'Password',
                'password-placeholder': 'Enter your password',
                'password-error': 'Password must be at least 8 characters.',
                'password-confirm-label': 'Confirm Password',
                'password-confirm-placeholder': 'Re-enter your password',
                'password-confirm-error': 'Passwords do not match.',
                'terms-link': 'Terms of Service',
                'terms-and': ' and ',
                'privacy-link': 'Privacy Policy',
                'terms-agree': 'I agree to the ',
                'marketing-agree': 'I agree to receive marketing information (Optional)',
                'signup-btn': 'Sign Up',
                'login-question': 'Already have an account?',
                'login-link': 'Log In',
                'success-message': 'Sign up successful! Redirecting to login page...',
                'password-weak': 'Weak',
                'password-medium': 'Medium',
                'password-strong': 'Strong',
                'terms-alert': 'Please agree to the Terms of Service.',
                'signup-error': 'An error occurred during sign up. Please try again.',
                'terms-coming': 'Terms of Service page is coming soon.',
                'privacy-coming': 'Privacy Policy page is coming soon.',
                'email-duplicate': 'This email is already in use.'
            },
            'JA': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': 'ワンクリックで言語の壁を越える',
                'tagline': '高品質な動画、撮影不要 - ワンクリックで複製・翻訳',
                'feature1': 'リアルタイム音声認識と翻訳',
                'feature2': '多言語字幕の自動生成',
                'feature3': '講義の自動保存と管理',
                'feature4': '簡単な共有とダウンロード',
                'back-link': '← ログインに戻る',
                'welcome-title': '会員登録',
                'welcome-subtitle': 'AX2で言語の壁を越えましょう',
                'google-btn': 'Googleで登録',
                'kakao-btn': 'カカオトークで登録',
                'naver-btn': 'ネイバーで登録',
                'or': 'または',
                'name-label': '名前',
                'name-placeholder': '名前を入力してください',
                'name-error': '名前を入力してください。',
                'email-label': 'メールアドレス',
                'email-placeholder': 'メールアドレスを入力してください',
                'email-error': '有効なメールアドレスを入力してください。',
                'password-label': 'パスワード',
                'password-placeholder': 'パスワードを入力してください',
                'password-error': 'パスワードは8文字以上である必要があります。',
                'password-confirm-label': 'パスワード確認',
                'password-confirm-placeholder': 'パスワードを再入力してください',
                'password-confirm-error': 'パスワードが一致しません。',
                'terms-link': '利用規約',
                'terms-and': ' および ',
                'privacy-link': 'プライバシーポリシー',
                'terms-agree': 'に同意します。',
                'marketing-agree': 'マーケティング情報の受信に同意します（任意）',
                'signup-btn': '会員登録',
                'login-question': 'すでにアカウントをお持ちですか？',
                'login-link': 'ログイン',
                'success-message': '会員登録成功！ログインページに移動します...',
                'password-weak': '弱い',
                'password-medium': '普通',
                'password-strong': '強い',
                'terms-alert': '利用規約に同意してください。',
                'signup-error': '会員登録中にエラーが発生しました。再度お試しください。',
                'terms-coming': '利用規約ページは準備中です。',
                'privacy-coming': 'プライバシーポリシーページは準備中です。',
                'email-duplicate': 'このメールアドレスは既に使用されています。'
            },
            'ZH': {
                'main-headline': 'Create, Translate, and Interact',
                'sub-headline': '一键打破语言障碍',
                'tagline': '高质量视频，无需拍摄 - 一键克隆和翻译',
                'feature1': '实时语音识别和翻译',
                'feature2': '多语言字幕自动生成',
                'feature3': '课程自动保存和管理',
                'feature4': '便捷的共享和下载',
                'back-link': '← 返回登录',
                'welcome-title': '注册',
                'welcome-subtitle': '与 AX2 一起打破语言障碍',
                'google-btn': '使用 Google 注册',
                'kakao-btn': '使用 Kakao 注册',
                'naver-btn': '使用 Naver 注册',
                'or': '或',
                'name-label': '姓名',
                'name-placeholder': '请输入您的姓名',
                'name-error': '请输入您的姓名。',
                'email-label': '邮箱',
                'email-placeholder': '请输入您的邮箱',
                'email-error': '请输入有效的邮箱地址。',
                'password-label': '密码',
                'password-placeholder': '请输入您的密码',
                'password-error': '密码必须至少8个字符。',
                'password-confirm-label': '确认密码',
                'password-confirm-placeholder': '请再次输入您的密码',
                'password-confirm-error': '密码不匹配。',
                'terms-link': '服务条款',
                'terms-and': ' 和 ',
                'privacy-link': '隐私政策',
                'terms-agree': '我同意',
                'marketing-agree': '我同意接收营销信息（可选）',
                'signup-btn': '注册',
                'login-question': '已有账户？',
                'login-link': '登录',
                'success-message': '注册成功！正在跳转到登录页面...',
                'password-weak': '弱',
                'password-medium': '中',
                'password-strong': '强',
                'terms-alert': '请同意服务条款。',
                'signup-error': '注册过程中发生错误。请重试。',
                'terms-coming': '服务条款页面即将推出。',
                'privacy-coming': '隐私政策页面即将推出。',
                'email-duplicate': '此电子邮件已被使用。'
            }
        };

        // DOM 요소 캐싱 (최적화)
        const DOMCache = {
            get languageSelector() { return document.getElementById('language-selector'); },
            get languageDropdown() { return document.getElementById('language-dropdown'); },
            get currentLangSpan() { return document.getElementById('current-lang'); },
            get languageOptions() { return document.querySelectorAll('.language-option'); },
            get passwordInput() { return document.getElementById('password-input'); },
            get passwordConfirmInput() { return document.getElementById('password-confirm-input'); },
            get nameInput() { return document.getElementById('name-input'); },
            get emailInput() { return document.getElementById('email-input'); }
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

        // 비밀번호 강도 검사
        function checkPasswordStrength(password) {
            let strength = 0;
            const bars = document.querySelectorAll('.strength-bar');
            const strengthText = document.getElementById('strength-text');
            
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z\d]/.test(password)) strength++;

            bars.forEach((bar, index) => {
                bar.className = 'strength-bar';
                if (index < strength) {
                    if (strength <= 2) {
                        bar.classList.add('weak');
                        strengthText.textContent = translations[currentLang]['password-weak'];
                        strengthText.style.color = '#ff6b6b';
                    } else if (strength <= 3) {
                        bar.classList.add('medium');
                        strengthText.textContent = translations[currentLang]['password-medium'];
                        strengthText.style.color = '#ffa500';
                    } else {
                        bar.classList.add('strong');
                        strengthText.textContent = translations[currentLang]['password-strong'];
                        strengthText.style.color = '#4caf50';
                    }
                }
            });

            return strength;
        }

        // 에러 표시
        function showError(inputId, messageId, messageKey) {
            const input = document.getElementById(inputId);
            const errorDiv = document.getElementById(messageId);
            const message = translations[currentLang][messageKey] || translations['KO'][messageKey];
            input.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }

        // 에러 제거
        function clearError(inputId, messageId) {
            const input = document.getElementById(inputId);
            const errorDiv = document.getElementById(messageId);
            input.classList.remove('error');
            errorDiv.classList.remove('show');
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

        // 입력 필드 이벤트 초기화 (최적화)
        function initializeInputEvents() {
            // 비밀번호 입력 시 강도 검사
            if (DOMCache.passwordInput) {
                DOMCache.passwordInput.addEventListener('input', function() {
                    const password = this.value;
                    if (password) {
                        checkPasswordStrength(password);
                        clearError('password-input', 'password-error');
                    } else {
                        document.querySelectorAll('.strength-bar').forEach(bar => {
                            bar.className = 'strength-bar';
                        });
                        const strengthText = document.getElementById('strength-text');
                        if (strengthText) strengthText.textContent = '';
                    }
                });
            }

            // 비밀번호 확인 검증
            if (DOMCache.passwordConfirmInput) {
                DOMCache.passwordConfirmInput.addEventListener('input', function() {
                    const password = DOMCache.passwordInput ? DOMCache.passwordInput.value : '';
                    const confirmPassword = this.value;
                    
                    if (confirmPassword && password !== confirmPassword) {
                        showError('password-confirm-input', 'password-confirm-error', 'password-confirm-error');
                    } else {
                        clearError('password-confirm-input', 'password-confirm-error');
                    }
                });
            }

            // 입력 필드 실시간 검증
            if (DOMCache.nameInput) {
                DOMCache.nameInput.addEventListener('input', function() {
                    if (this.value.trim()) {
                        clearError('name-input', 'name-error');
                    }
                });
            }

            if (DOMCache.emailInput) {
                DOMCache.emailInput.addEventListener('input', function() {
                    const email = this.value.trim();
                    if (email && validateEmail(email)) {
                        clearError('email-input', 'email-error');
                    }
                });
            }
        }

        // 소셜 회원가입 함수들 (최적화 및 API 연동)
        async function signupWithGoogle() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('Google 회원가입 시작');
                
                // SocialAuth 모듈 사용 (로그인과 동일한 플로우)
                if (window.SocialAuth && window.SocialAuth.loginWithGoogle) {
                    const user = await window.SocialAuth.loginWithGoogle();
                    logger.log('Google 회원가입 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('Google 회원가입 오류:', error);
                alert(translations[currentLang]['signup-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        async function signupWithKakao() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('카카오톡 회원가입 시작');
                
                // SocialAuth 모듈 사용
                if (window.SocialAuth && window.SocialAuth.loginWithKakao) {
                    const user = await window.SocialAuth.loginWithKakao();
                    logger.log('카카오톡 회원가입 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('카카오톡 회원가입 오류:', error);
                alert(translations[currentLang]['signup-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        async function signupWithNaver() {
            const btn = event.target.closest('.social-btn');
            if (!btn) return;
            
            setLoading(btn, true);
            
            try {
                logger.log('네이버 회원가입 시작');
                
                // SocialAuth 모듈 사용
                if (window.SocialAuth && window.SocialAuth.loginWithNaver) {
                    const user = await window.SocialAuth.loginWithNaver();
                    logger.log('네이버 회원가입 성공:', user);
                    
                    showSuccessMessage('success-message');
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    throw new Error('SocialAuth 모듈이 로드되지 않았습니다.');
                }
            } catch (error) {
                logger.error('네이버 회원가입 오류:', error);
                alert(translations[currentLang]['signup-error'] + '\n' + (error.message || ''));
            } finally {
                setLoading(btn, false);
            }
        }

        // 이메일 중복 체크 (최적화)
        function isEmailExists(email) {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                return users.some(user => user.email.toLowerCase() === email.toLowerCase());
            } catch (error) {
                logger.error('이메일 중복 체크 오류:', error);
                return false;
            }
        }

        // 회원가입 처리 (최적화 및 활성화)
        async function handleSignup(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById('name-input');
            const emailInput = document.getElementById('email-input');
            const passwordInput = document.getElementById('password-input');
            const passwordConfirmInput = document.getElementById('password-confirm-input');
            const termsCheckbox = document.getElementById('terms-checkbox');
            const marketingCheckbox = document.getElementById('marketing-checkbox');
            const signupBtn = document.getElementById('signup-btn');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value;
            const passwordConfirm = passwordConfirmInput.value;
            
            // 모든 에러 제거
            clearError('name-input', 'name-error');
            clearError('email-input', 'email-error');
            clearError('password-input', 'password-error');
            clearError('password-confirm-input', 'password-confirm-error');
            
            // 검증
            let hasError = false;
            
            if (!name) {
                showError('name-input', 'name-error', 'name-error');
                hasError = true;
            }
            
            if (!email) {
                showError('email-input', 'email-error', 'email-error');
                hasError = true;
            } else if (!validateEmail(email)) {
                showError('email-input', 'email-error', 'email-error');
                hasError = true;
            } else if (isEmailExists(email)) {
                // 중복 이메일 체크
                const errorMsg = translations[currentLang]['email-duplicate'] || '이미 사용 중인 이메일입니다.';
                const emailError = document.getElementById('email-error');
                emailInput.classList.add('error');
                emailError.textContent = errorMsg;
                emailError.classList.add('show');
                hasError = true;
            }
            
            if (!password) {
                showError('password-input', 'password-error', 'password-error');
                hasError = true;
            } else if (password.length < 8) {
                showError('password-input', 'password-error', 'password-error');
                hasError = true;
            }
            
            if (!passwordConfirm) {
                showError('password-confirm-input', 'password-confirm-error', 'password-confirm-error');
                hasError = true;
            } else if (password !== passwordConfirm) {
                showError('password-confirm-input', 'password-confirm-error', 'password-confirm-error');
                hasError = true;
            }
            
            if (!termsCheckbox.checked) {
                alert(translations[currentLang]['terms-alert']);
                hasError = true;
            }
            
            if (hasError) {
                return;
            }
            
            // 로딩 시작
            setLoading(signupBtn, true);
            
            try {
                // 사용자 데이터 저장
                const userData = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    password: password, // 실제로는 해시화해야 함
                    marketingAgree: marketingCheckbox.checked,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                // localStorage에 사용자 저장
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                
                logger.log('회원가입 성공:', { name, email });
                
                // 성공 메시지 표시
                showSuccessMessage('success-message');
                
                // 로그인 페이지로 이동
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } catch (error) {
                logger.error('회원가입 오류:', error);
                alert(translations[currentLang]['signup-error']);
            } finally {
                setLoading(signupBtn, false);
            }
        }

        // 약관 표시
        function showTerms(event) {
            event.preventDefault();
            alert(translations[currentLang]['terms-coming']);
        }

        function showPrivacy(event) {
            event.preventDefault();
            alert(translations[currentLang]['privacy-coming']);
        }

        // 초기화 함수 (최적화)
        function initialize() {
            // 언어 선택기 초기화
            initializeLanguageSelector();
            
            // 입력 필드 이벤트 초기화
            initializeInputEvents();
            
            // 페이지 번역
            translatePage('KO');
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
    