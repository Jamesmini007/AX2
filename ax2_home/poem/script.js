// EmailJS 설정
const EMAILJS_CONFIG = {
    serviceID: 'service_5u6ktz4',
    templateID: 'template_3a9czho',
    publicKey: 'Az3XOt1U8hcC9WoRY',
    toEmail: 'leo4@4csoft.com'
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const consentCheckbox = document.getElementById('consent');
    const submitButton = document.querySelector('.submit-btn');
    
    // 체크박스 상태에 따라 제출 버튼 활성화/비활성화
    function updateSubmitButton() {
        if (consentCheckbox && submitButton) {
            if (consentCheckbox.checked) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            } else {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.5';
                submitButton.style.cursor = 'not-allowed';
            }
        }
    }
    
    // 초기 상태 설정
    updateSubmitButton();
    
    // 체크박스 변경 시 제출 버튼 상태 업데이트
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', updateSubmitButton);
    }
    
    // 에러 메시지 표시/숨김 함수
    function showError(id, message) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = message;
            el.classList.add('show');
        }
    }
    
    function hideError(id) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = '';
            el.classList.remove('show');
        }
    }
    
    // 국가 코드에 따른 전화번호 플레이스홀더 업데이트
    const countryCodeSelect = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');
    
    const phonePlaceholders = {
        'KR': '010-2000-0000',
        'US': '(555) 123-4567',
        'JP': '90-1234-5678',
        'CN': '138-0000-0000',
        'GB': '20 1234 5678'
    };
    
    countryCodeSelect.addEventListener('change', function() {
        const selectedCode = this.value;
        phoneInput.placeholder = phonePlaceholders[selectedCode] || phonePlaceholders['KR'];
    });
    
    // 전화번호 자동 포맷팅 함수
    function formatPhoneNumber(value, countryCode) {
        // 숫자만 추출
        const numbers = value.replace(/\D/g, '');
        
        if (countryCode === 'KR') {
            // 한국 전화번호 포맷팅
            if (numbers.length <= 3) {
                return numbers;
            } else if (numbers.length <= 7) {
                return numbers.slice(0, 3) + '-' + numbers.slice(3);
            } else if (numbers.length <= 11) {
                return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
            } else {
                return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
            }
        } else if (countryCode === 'US') {
            // 미국 전화번호 포맷팅: (555) 123-4567
            if (numbers.length <= 3) {
                return numbers;
            } else if (numbers.length <= 6) {
                return '(' + numbers.slice(0, 3) + ') ' + numbers.slice(3);
            } else {
                return '(' + numbers.slice(0, 3) + ') ' + numbers.slice(3, 6) + '-' + numbers.slice(6, 10);
            }
        } else if (countryCode === 'JP') {
            // 일본 전화번호 포맷팅: 90-1234-5678
            if (numbers.length <= 2) {
                return numbers;
            } else if (numbers.length <= 6) {
                return numbers.slice(0, 2) + '-' + numbers.slice(2);
            } else {
                return numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6, 10);
            }
        } else if (countryCode === 'CN') {
            // 중국 전화번호 포맷팅: 138-0000-0000
            if (numbers.length <= 3) {
                return numbers;
            } else if (numbers.length <= 7) {
                return numbers.slice(0, 3) + '-' + numbers.slice(3);
            } else {
                return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
            }
        } else if (countryCode === 'GB') {
            // 영국 전화번호 포맷팅: 20 1234 5678
            if (numbers.length <= 2) {
                return numbers;
            } else if (numbers.length <= 6) {
                return numbers.slice(0, 2) + ' ' + numbers.slice(2);
            } else {
                return numbers.slice(0, 2) + ' ' + numbers.slice(2, 6) + ' ' + numbers.slice(6, 10);
            }
        }
        
        return numbers;
    }
    
    // 전화번호 입력 시 자동 포맷팅
    phoneInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const countryCode = countryCodeSelect.value;
        const formatted = formatPhoneNumber(value, countryCode);
        
        // 커서 위치 저장
        const cursorPosition = e.target.selectionStart;
        const beforeCursor = value.substring(0, cursorPosition).replace(/\D/g, '').length;
        
        e.target.value = formatted;
        
        // 커서 위치 복원 (하이픈 추가로 인한 위치 조정)
        let newCursorPosition = 0;
        let digitCount = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
                digitCount++;
                if (digitCount === beforeCursor) {
                    newCursorPosition = i + 1;
                    break;
                }
            }
        }
        if (newCursorPosition === 0) {
            newCursorPosition = formatted.length;
        }
        
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });
    
    // 국가 코드 변경 시 전화번호 재포맷팅
    countryCodeSelect.addEventListener('change', function() {
        if (phoneInput.value) {
            const numbers = phoneInput.value.replace(/\D/g, '');
            phoneInput.value = formatPhoneNumber(numbers, this.value);
        }
    });
    
    // 커스텀 드롭다운
    document.querySelectorAll('.custom-select').forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const dropdown = select.querySelector('.select-dropdown');
        const valueSpan = select.querySelector('.select-value');
        const hiddenInput = select.querySelector('input[type="hidden"]');
        const options = select.querySelectorAll('.select-option');
        const fieldName = select.getAttribute('data-field');
        
        // 드롭다운 열기/닫기
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 다른 드롭다운 닫기
            document.querySelectorAll('.select-dropdown').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('open');
                    dd.closest('.custom-select').querySelector('.select-trigger').classList.remove('active');
                }
            });
            
            // 현재 드롭다운 토글
            dropdown.classList.toggle('open');
            trigger.classList.toggle('active');
        });
        
        // 옵션 선택
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                // 선택된 옵션 표시
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // 값 업데이트
                valueSpan.textContent = text;
                valueSpan.classList.remove('placeholder');
                if (hiddenInput) {
                    hiddenInput.value = value;
                }
                
                // 드롭다운 닫기
                dropdown.classList.remove('open');
                trigger.classList.remove('active');
            });
        });
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (!select.contains(e.target)) {
                dropdown.classList.remove('open');
                trigger.classList.remove('active');
            }
        });
    });
    
    // 간단한 해시 함수 (문자열을 해시로 변환)
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        return Math.abs(hash).toString(36);
    }
    
    // 폼 데이터 해시 생성 (이름+이메일+회사명)
    function generateFormHash(firstName, lastName, email, company) {
        const combined = `${firstName}|${lastName}|${email.toLowerCase()}|${company}`;
        return simpleHash(combined);
    }
    
    // 이메일 주소 기반 1시간 제한 체크
    function checkEmailRateLimit(email) {
        const emailKey = `email_submit_${email.toLowerCase()}`;
        const lastSubmitTime = localStorage.getItem(emailKey);
        
        if (lastSubmitTime) {
            const now = Date.now();
            const timeDiff = now - parseInt(lastSubmitTime);
            const oneHour = 60 * 60 * 1000; // 1시간 (밀리초)
            
            if (timeDiff < oneHour) {
                const remainingMinutes = Math.ceil((oneHour - timeDiff) / (60 * 1000));
                return {
                    allowed: false,
                    remainingMinutes: remainingMinutes,
                    type: 'email'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // 브라우저별 1시간 제한 체크
    function checkBrowserRateLimit() {
        const browserKey = 'browser_submit';
        const lastSubmitTime = localStorage.getItem(browserKey);
        
        if (lastSubmitTime) {
            const now = Date.now();
            const timeDiff = now - parseInt(lastSubmitTime);
            const oneHour = 60 * 60 * 1000; // 1시간 (밀리초)
            
            if (timeDiff < oneHour) {
                const remainingMinutes = Math.ceil((oneHour - timeDiff) / (60 * 1000));
                return {
                    allowed: false,
                    remainingMinutes: remainingMinutes,
                    type: 'browser'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // 폼 데이터 해시 기반 1시간 제한 체크
    function checkFormHashRateLimit(formHash) {
        const storageKey = `form_submit_${formHash}`;
        const lastSubmitTime = localStorage.getItem(storageKey);
        
        if (lastSubmitTime) {
            const now = Date.now();
            const timeDiff = now - parseInt(lastSubmitTime);
            const oneHour = 60 * 60 * 1000; // 1시간 (밀리초)
            
            if (timeDiff < oneHour) {
                const remainingMinutes = Math.ceil((oneHour - timeDiff) / (60 * 1000));
                return {
                    allowed: false,
                    remainingMinutes: remainingMinutes,
                    type: 'form'
                };
            }
        }
        
        return { allowed: true };
    }
    
    // 모든 제한 체크 (이메일, 브라우저, 폼 데이터 해시)
    function checkAllRateLimits(email, formHash) {
        // 1. 이메일 주소 기반 체크
        const emailCheck = checkEmailRateLimit(email);
        if (!emailCheck.allowed) {
            return emailCheck;
        }
        
        // 2. 브라우저별 체크
        const browserCheck = checkBrowserRateLimit();
        if (!browserCheck.allowed) {
            return browserCheck;
        }
        
        // 3. 폼 데이터 해시 기반 체크
        const formCheck = checkFormHashRateLimit(formHash);
        if (!formCheck.allowed) {
            return formCheck;
        }
        
        return { allowed: true };
    }
    
    // 제출 시간 저장 (모든 제한 타입)
    function saveSubmitTime(email, formHash) {
        const now = Date.now().toString();
        
        // 이메일 주소 기반 저장
        const emailKey = `email_submit_${email.toLowerCase()}`;
        localStorage.setItem(emailKey, now);
        
        // 브라우저별 저장
        localStorage.setItem('browser_submit', now);
        
        // 폼 데이터 해시 기반 저장
        const formKey = `form_submit_${formHash}`;
        localStorage.setItem(formKey, now);
    }
    
    // 폼 제출 중복 방지 플래그
    let isSubmitting = false;
    
    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 이미 제출 중이면 무시
        if (isSubmitting) {
            console.log('이미 제출 중입니다. 중복 제출을 방지합니다.');
            return;
        }
        
        let isValid = true;
        
        // 이름 검증
        const firstName = document.getElementById('firstName').value.trim();
        if (!firstName) {
            showError('firstNameError', '이름을 입력해주세요.');
            isValid = false;
        } else {
            hideError('firstNameError');
        }
        
        // 성 검증
        const lastName = document.getElementById('lastName').value.trim();
        if (!lastName) {
            showError('lastNameError', '성을 입력해주세요.');
            isValid = false;
        } else {
            hideError('lastNameError');
        }
        
        // 이메일 검증
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('emailError', '올바른 이메일 주소를 입력해주세요.');
            isValid = false;
        } else {
            hideError('emailError');
        }
        
        // 회사명 검증
        const company = document.getElementById('company').value.trim();
        if (!company) {
            showError('companyError', '회사명을 입력해주세요.');
            isValid = false;
        } else {
            hideError('companyError');
        }
        
        // 연락처 검증
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            showError('phoneError', '전화번호를 입력해주세요.');
            isValid = false;
        } else {
            hideError('phoneError');
        }
        
        // 동의 검증
        const consent = document.getElementById('consent').checked;
        if (!consent) {
            showError('consentError', '서비스 약관 및 개인정보 보호정책에 동의해주세요.');
            isValid = false;
        } else {
            hideError('consentError');
        }
        
        if (isValid) {
            // 제출 시작 - 플래그 설정 및 버튼 비활성화
            isSubmitting = true;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = '전송 중...';
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
            }
            
            // 폼 데이터 해시 생성
            const formHash = generateFormHash(firstName, lastName, email, company);
            
            // 모든 제한 체크 (이메일, 브라우저, 폼 데이터 해시)
            const rateLimitCheck = checkAllRateLimits(email, formHash);
            
            if (!rateLimitCheck.allowed) {
                // 제한에 걸린 경우 - 플래그 해제 및 버튼 복원
                isSubmitting = false;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '도입 문의하기';
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                }
                const limitType = rateLimitCheck.type || 'general';
                showRateLimitModal(rateLimitCheck.remainingMinutes, limitType);
                return;
            }
            
            // 폼 데이터 수집
            const formData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                company: company,
                countryCode: document.getElementById('countryCode').value,
                phone: phone,
                source: document.getElementById('source').value,
                message: document.getElementById('message') ? document.getElementById('message').value : '',
                consent: consent
            };
            
            // EmailJS를 사용한 이메일 전송
            // 설정은 config.js 파일에서 관리합니다
            const serviceID = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG.serviceID : 'YOUR_SERVICE_ID';
            const templateID = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG.templateID : 'YOUR_TEMPLATE_ID';
            const publicKey = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG.publicKey : 'YOUR_PUBLIC_KEY';
            const toEmail = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG.toEmail : 'your-email@example.com';
            
            // EmailJS 초기화 (한 번만 실행)
            if (typeof emailjs !== 'undefined' && publicKey !== 'YOUR_PUBLIC_KEY') {
                emailjs.init(publicKey);
            }
            
            // 현재 시간 포맷팅
            const now = new Date();
            const timeString = now.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            // 알게 된 경로 변환
            const sourceValue = document.getElementById('source').value;
            const sourceLabels = {
                'search': '네이버',
                'recommendation': '지인 추천',
                'advertisement': '광고',
                'exhibition': '전시회/세미나',
                'other': '기타'
            };
            const sourceLabel = sourceLabels[sourceValue] || '선택 안함';

            // 이메일 전송 파라미터 설정
            const emailParams = {
                to_email: toEmail,  // 받을 이메일 주소 (config.js에서 설정)
                from_name: `${lastName}${firstName}`,
                from_email: email,
                company: company,
                phone: `${countryCodeSelect.value} ${phone}`,
                source: sourceLabel,
                message: formData.message || '',
                reply_to: email,
                time: timeString
            };
            
            // 이메일 전송 시도
            console.log('EmailJS 설정 확인:', {
                emailjs: typeof emailjs !== 'undefined',
                serviceID: serviceID,
                templateID: templateID,
                publicKey: publicKey ? '설정됨' : '없음',
                emailParams: emailParams
            });
            
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS 라이브러리가 로드되지 않았습니다.');
                alert('이메일 전송 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.');
                return;
            }
            
            if (serviceID === 'YOUR_SERVICE_ID' || templateID === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
                console.error('EmailJS 설정이 완료되지 않았습니다.');
                alert('이메일 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.');
                return;
            }
            
            // EmailJS v4에서는 publicKey를 send 메서드에 직접 전달
            // 또는 초기화가 필요 없을 수 있음
            // 이메일 전송
            emailjs.send(serviceID, templateID, emailParams, publicKey)
                .then(function(response) {
                    console.log('이메일 전송 성공!', response.status, response.text);
                    // 제출 시간 저장 (이메일, 브라우저, 폼 데이터 해시 모두)
                    saveSubmitTime(email, formHash);
                    showModal('successModal');
                    form.reset();
                    resetForm();
                    // 제출 완료 - 플래그 해제 및 버튼 복원
                    isSubmitting = false;
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = '도입 문의하기';
                        submitButton.style.opacity = '1';
                        submitButton.style.cursor = 'pointer';
                    }
                })
                .catch(function(error) {
                    console.error('이메일 전송 실패:', error);
                    console.error('에러 상세:', {
                        status: error.status,
                        text: error.text,
                        message: error.message
                    });
                    // 더 자세한 에러 메시지 표시
                    let errorMessage = '문의 접수 중 오류가 발생했습니다.';
                    if (error.text) {
                        errorMessage += '<br>' + error.text;
                    }
                    document.querySelector('#errorModal .modal-message').innerHTML = errorMessage;
                    showModal('errorModal');
                    // 제출 실패 - 플래그 해제 및 버튼 복원
                    isSubmitting = false;
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = '도입 문의하기';
                        submitButton.style.opacity = '1';
                        submitButton.style.cursor = 'pointer';
                    }
                });
        }
    });
    
    // 폼 초기화 함수
    function resetForm() {
            
        // 드롭다운 초기화
        document.querySelectorAll('.custom-select').forEach(select => {
            const valueSpan = select.querySelector('.select-value');
            const hiddenInput = select.querySelector('input[type="hidden"]');
            const options = select.querySelectorAll('.select-option');
            const trigger = select.querySelector('.select-trigger');
            const dropdown = select.querySelector('.select-dropdown');
            
            valueSpan.textContent = '선택해주세요';
            valueSpan.classList.add('placeholder');
            if (hiddenInput) {
                hiddenInput.value = '';
            }
            options.forEach(opt => opt.classList.remove('selected'));
            dropdown.classList.remove('open');
            trigger.classList.remove('active');
        });
        
        // 에러 메시지 숨김
        document.querySelectorAll('.form-helper').forEach(helper => {
            helper.classList.remove('show');
        });
    }
    
    // 모달 표시 함수
    window.showModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
        }
    };
    
    // 제한 모달 표시 함수
    window.showRateLimitModal = function(remainingMinutes, limitType) {
        const modal = document.getElementById('rateLimitModal');
        const messageEl = document.getElementById('rateLimitMessage');
        
        if (modal && messageEl) {
            let message = '';
            
            if (limitType === 'email') {
                message = remainingMinutes > 0 
                    ? `같은 이메일 주소로는 1시간에 한 번만 문의하실 수 있습니다.<br>약 ${remainingMinutes}분 후에 다시 시도해주세요.`
                    : '같은 이메일 주소로는 1시간에 한 번만 문의하실 수 있습니다.';
            } else if (limitType === 'browser') {
                message = remainingMinutes > 0
                    ? `이 브라우저에서는 1시간에 한 번만 문의하실 수 있습니다.<br>약 ${remainingMinutes}분 후에 다시 시도해주세요.`
                    : '이 브라우저에서는 1시간에 한 번만 문의하실 수 있습니다.';
            } else if (limitType === 'form') {
                message = remainingMinutes > 0
                    ? `같은 정보로는 1시간에 한 번만 문의하실 수 있습니다.<br>약 ${remainingMinutes}분 후에 다시 시도해주세요.`
                    : '같은 정보로는 1시간에 한 번만 문의하실 수 있습니다.';
            } else {
                message = remainingMinutes > 0
                    ? `1시간에 한 번만 문의하실 수 있습니다.<br>약 ${remainingMinutes}분 후에 다시 시도해주세요.`
                    : '1시간에 한 번만 문의하실 수 있습니다.';
            }
            
            messageEl.innerHTML = message;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('rateLimitModal 또는 rateLimitMessage 요소를 찾을 수 없습니다.');
        }
    };
    
    // 모달 닫기 함수
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // 스크롤 복원
        }
    };
    
    // 모달 배경 클릭 시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
    });
});
