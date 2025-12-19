// AX2 실시간 번역·자막 생성 인터페이스 JavaScript

// 프로덕션 환경에서 console.log 비활성화
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logger = {
    log: isDev ? console.log.bind(console) : () => {},
    error: console.error.bind(console), // 에러는 항상 표시
    warn: isDev ? console.warn.bind(console) : () => {}
};

// ============================================
// 크레딧 관리 시스템
// ============================================
const CreditSystem = {
    // 크레딧 단위: 1 크레딧 = 6초, 10 크레딧 = 1분
    CREDIT_PER_SECOND: 1/6, // 초당 크레딧
    CREDIT_PER_MINUTE: 10, // 분당 기본 크레딧
    TRANSLATION_CREDIT_PER_MINUTE: 5, // 번역 언어당 분당 추가 크레딧
    
    /**
     * 영상 길이와 번역 언어 수를 기반으로 필요한 크레딧 계산
     * @param {number} durationSeconds - 영상 길이 (초)
     * @param {number} translationLanguageCount - 번역 언어 수
     * @returns {number} 필요한 크레딧
     */
    calculateRequiredCredits(durationSeconds, translationLanguageCount = 0) {
        // 영상 길이를 분 단위로 올림 처리 (61초 → 2분)
        const durationMinutes = Math.ceil(durationSeconds / 60);
        
        // 기본 자막 생성: 분당 10 크레딧
        const baseCredits = durationMinutes * this.CREDIT_PER_MINUTE;
        
        // 번역 자막: 언어당 분당 5 크레딧
        const translationCredits = durationMinutes * this.TRANSLATION_CREDIT_PER_MINUTE * translationLanguageCount;
        
        return baseCredits + translationCredits;
    },
    
    /**
     * 크레딧 잔액 조회
     * 로그인 상태에 따라 다른 크레딧을 반환
     * @returns {number} 현재 크레딧 잔액
     */
    getBalance() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // 로그인 상태: 로그인 후 크레딧 사용
            return parseInt(localStorage.getItem('creditBalance') || '0');
        } else {
            // 비로그인 상태: 무료 크레딧 사용
            return parseInt(localStorage.getItem('freeCreditBalance') || '0');
        }
    },
    
    /**
     * 크레딧 예약 (선차감)
     * @param {string} jobId - 작업 ID
     * @param {number} amount - 예약할 크레딧
     * @returns {Object} 예약 결과 {success: boolean, reservedId: string, balance: number}
     */
    reserveCredits(jobId, amount) {
        const currentBalance = this.getBalance();
        
        if (currentBalance < amount) {
            return {
                success: false,
                error: 'INSUFFICIENT_CREDITS',
                required: amount,
                balance: currentBalance
            };
        }
        
        // 예약 ID 생성
        const reservedId = `reserve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 잔액 차감 (로그인 상태에 따라 다른 크레딧 차감)
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const newBalance = currentBalance - amount;
        if (isLoggedIn) {
            localStorage.setItem('creditBalance', newBalance.toString());
        } else {
            localStorage.setItem('freeCreditBalance', newBalance.toString());
        }
        
        // 무료 크레딧 정보 업데이트
        if (typeof updateFreeCreditInfo === 'function') {
            updateFreeCreditInfo();
        }
        
        // 예약 내역 저장
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        reservations.push({
            id: reservedId,
            jobId: jobId,
            amount: amount,
            reservedAt: new Date().toISOString(),
            status: 'reserved'
        });
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        logger.log(`크레딧 예약: ${amount} 크레딧 (작업 ID: ${jobId}, 예약 ID: ${reservedId})`);
        
        return {
            success: true,
            reservedId: reservedId,
            balance: newBalance
        };
    },
    
    /**
     * 예약된 크레딧 확정 차감
     * @param {string} reservedId - 예약 ID
     * @param {string} jobId - 작업 ID
     * @param {string} description - 설명
     */
    confirmDeduction(reservedId, jobId, description) {
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        const reservation = reservations.find(r => r.id === reservedId && r.jobId === jobId);
        
        if (!reservation) {
            logger.error('예약을 찾을 수 없습니다:', reservedId);
            return false;
        }
        
        // 예약 상태를 확정으로 변경
        reservation.status = 'confirmed';
        reservation.confirmedAt = new Date().toISOString();
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        // 크레딧 사용 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        const currentBalance = this.getBalance();
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: '사용',
            description: description,
            amount: reservation.amount,
            balance: currentBalance,
            jobId: jobId,
            reservedId: reservedId
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        logger.log(`크레딧 확정 차감: ${reservation.amount} 크레딧 (작업 ID: ${jobId})`);
        return true;
    },
    
    /**
     * 예약된 크레딧 환불
     * @param {string} reservedId - 예약 ID
     * @param {string} jobId - 작업 ID
     * @param {string} reason - 환불 사유
     * @param {number} partialAmount - 부분 환불 금액 (전액 환불 시 null)
     */
    refundCredits(reservedId, jobId, reason, partialAmount = null) {
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        const reservation = reservations.find(r => r.id === reservedId && r.jobId === jobId);
        
        if (!reservation) {
            logger.error('예약을 찾을 수 없습니다:', reservedId);
            return false;
        }
        
        // 환불할 크레딧 계산
        const refundAmount = partialAmount !== null ? partialAmount : reservation.amount;
        
        // 잔액 복구 (로그인 상태에 따라 다른 크레딧 복구)
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + refundAmount;
        if (isLoggedIn) {
            localStorage.setItem('creditBalance', newBalance.toString());
        } else {
            localStorage.setItem('freeCreditBalance', newBalance.toString());
        }
        
        // 무료 크레딧 정보 업데이트
        if (typeof updateFreeCreditInfo === 'function') {
            updateFreeCreditInfo();
        }
        
        // 예약 상태를 환불로 변경
        reservation.status = 'refunded';
        reservation.refundedAt = new Date().toISOString();
        reservation.refundReason = reason;
        reservation.refundAmount = refundAmount;
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        // 환불 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: '환불',
            description: reason,
            amount: refundAmount,
            balance: newBalance,
            jobId: jobId,
            reservedId: reservedId
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        logger.log(`크레딧 환불: ${refundAmount} 크레딧 (작업 ID: ${jobId}, 사유: ${reason})`);
        return true;
    }
};

// ============================================
// 무료 크레딧 관리 시스템 (계정 당 1회 제공)
// ============================================
const FreeTrialSystem = {
    FREE_TRIAL_CREDITS: 100,
    FREE_TRIAL_MAX_DURATION: 600, // 10분 (초)
    FREE_TRIAL_MAX_LANGUAGES: 1,
    FREE_TRIAL_STORAGE_HOURS: 3,
    
    /**
     * 무료 크레딧 사용 여부 확인
     * @returns {boolean} 무료 크레딧 사용 여부
     */
    isUsed() {
        return localStorage.getItem('freeTrialUsed') === 'true';
    },
    
    /**
     * 무료 크레딧 사용 표시 (계정 당 1회)
     */
    markAsUsed() {
        localStorage.setItem('freeTrialUsed', 'true');
        localStorage.setItem('freeTrialUsedAt', new Date().toISOString());
    },
    
    /**
     * 무료 크레딧 자격 확인
     * @param {number} durationSeconds - 영상 길이 (초)
     * @param {number} languageCount - 번역 언어 수
     * @returns {Object} {eligible: boolean, reason: string}
     */
    checkEligibility(durationSeconds, languageCount) {
        if (this.isUsed()) {
            return {
                eligible: false,
                reason: '이미 무료 크레딧을 사용하셨습니다. 계정 당 1회만 제공됩니다.'
            };
        }
        
        if (durationSeconds > this.FREE_TRIAL_MAX_DURATION) {
            return {
                eligible: false,
                reason: `무료 크레딧은 최대 ${this.FREE_TRIAL_MAX_DURATION / 60}분까지 가능합니다.`
            };
        }
        
        if (languageCount > this.FREE_TRIAL_MAX_LANGUAGES) {
            return {
                eligible: false,
                reason: `무료 크레딧은 최대 ${this.FREE_TRIAL_MAX_LANGUAGES}개 언어까지 가능합니다.`
            };
        }
        
        return { eligible: true };
    },
    
    /**
     * 무료 크레딧 지급 (계정 당 1회)
     * 무료 크레딧은 freeCreditBalance에 별도로 저장
     */
    grantFreeCredits() {
        const currentBalance = parseInt(localStorage.getItem('freeCreditBalance') || '0');
        const newBalance = currentBalance + this.FREE_TRIAL_CREDITS;
        localStorage.setItem('freeCreditBalance', newBalance.toString());
        
        // 크레딧 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: 'charge',
            description: '계정 당 1회 무료 크레딧',
            amount: this.FREE_TRIAL_CREDITS,
            balance: newBalance
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        this.markAsUsed();
        logger.log(`무료 크레딧 지급: ${this.FREE_TRIAL_CREDITS} 크레딧`);
        
        // 무료 크레딧 정보 업데이트
        if (typeof updateFreeCreditInfo === 'function') {
            updateFreeCreditInfo();
        }
    }
};

// ============================================
// 작업 상태 관리 시스템
// ============================================
const JobStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

const JobManager = {
    /**
     * 작업 생성
     * @param {string} videoId - 비디오 ID
     * @param {Object} jobData - 작업 데이터
     * @returns {string} 작업 ID
     */
    createJob(videoId, jobData) {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const job = {
            id: jobId,
            videoId: videoId,
            status: JobStatus.PENDING,
            createdAt: new Date().toISOString(),
            ...jobData
        };
        
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        
        logger.log('작업 생성:', jobId);
        return jobId;
    },
    
    /**
     * 작업 상태 업데이트
     * @param {string} jobId - 작업 ID
     * @param {string} status - 새 상태
     * @param {Object} data - 추가 데이터
     */
    updateJobStatus(jobId, status, data = {}) {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const job = jobs.find(j => j.id === jobId);
        
        if (!job) {
            logger.error('작업을 찾을 수 없습니다:', jobId);
            return false;
        }
        
        job.status = status;
        job.updatedAt = new Date().toISOString();
        Object.assign(job, data);
        
        localStorage.setItem('jobs', JSON.stringify(jobs));
        logger.log(`작업 상태 업데이트: ${jobId} → ${status}`);
        return true;
    },
    
    /**
     * 작업 조회
     * @param {string} jobId - 작업 ID
     * @returns {Object|null} 작업 데이터
     */
    getJob(jobId) {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        return jobs.find(j => j.id === jobId) || null;
    }
};

// ============================================
// 보관 기간 관리 시스템
// ============================================
const StorageManager = {
    /**
     * 크레딧 충전 여부 확인
     * @returns {boolean} 크레딧 충전 여부
     */
    hasChargedCredits() {
        const totalCharged = parseInt(localStorage.getItem('totalCharged') || '0');
        return totalCharged > 0;
    },
    
    /**
     * 보관 용량 조회
     * @returns {number} 보관 용량 (GB)
     */
    getStorageCapacity() {
        const baseCapacity = this.hasChargedCredits() ? 5 : 1; // 충전 사용자: 5GB, 무료: 1GB
        
        // 확장 옵션 확인 (만료 확인 포함)
        const storageExtension = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        if (storageExtension && storageExtension.expiresAt) {
            const expiryDate = new Date(storageExtension.expiresAt);
            const now = new Date();
            if (expiryDate > now) {
                // 활성 확장 옵션
                if (storageExtension.type === 'plus') {
                    return baseCapacity + 5; // +5GB
                } else if (storageExtension.type === 'pro') {
                    return baseCapacity + 20; // +20GB
                }
            } else {
                // 만료된 확장 옵션 제거
                localStorage.removeItem('storageExtension');
            }
        }
        
        return baseCapacity;
    },
    
    /**
     * 보관 기간 조회 (일 단위)
     * @returns {number} 보관 기간 (일)
     */
    getStoragePeriod() {
        // 확장 옵션 확인 (만료 확인 포함)
        const storageExtension = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        if (storageExtension && storageExtension.expiresAt) {
            const expiryDate = new Date(storageExtension.expiresAt);
            const now = new Date();
            if (expiryDate > now) {
                // 활성 확장 옵션
                if (storageExtension.type === 'plus') {
                    return 30; // Storage Plus: 30일
                } else if (storageExtension.type === 'pro') {
                    return 90; // Storage Pro: 90일
                }
            } else {
                // 만료된 확장 옵션 제거
                localStorage.removeItem('storageExtension');
            }
        }
        
        // 기본 보관 기간: 모든 영상 7일
        return 7;
    },
    
    /**
     * 보관 만료 시간 계산
     * @param {boolean} isFreeTrial - 무료 크레딧 여부
     * @returns {Date} 만료 시간
     */
    calculateExpiryDate(isFreeTrial = false) {
        const now = new Date();
        
        // 모든 영상 7일 보관 (확장 옵션 제외)
        const storagePeriod = this.getStoragePeriod();
        now.setDate(now.getDate() + storagePeriod);
        
        return now.toISOString();
    },
    
    /**
     * 만료된 영상 자동 삭제
     */
    cleanupExpiredVideos() {
        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
        const now = new Date();
        let deletedCount = 0;
        
        const activeVideos = savedVideos.filter(video => {
            if (!video.expiresAt) {
                return true; // 만료 시간이 없으면 유지
            }
            
            const expiryDate = new Date(video.expiresAt);
            if (expiryDate <= now) {
                deletedCount++;
                logger.log(`만료된 영상 삭제: ${video.id} (${video.title})`);
                return false;
            }
            return true;
        });
        
        if (deletedCount > 0) {
            localStorage.setItem('savedVideos', JSON.stringify(activeVideos));
            logger.log(`만료된 영상 ${deletedCount}개 삭제 완료`);
        }
        
        return deletedCount;
    }
};

// 보관 기간 관리 초기화 (페이지 로드 시 실행)
if (typeof window !== 'undefined') {
    // 만료된 영상 정리 (페이지 로드 시)
    StorageManager.cleanupExpiredVideos();
    
    // 주기적으로 만료된 영상 정리 (1시간마다)
    setInterval(() => {
        StorageManager.cleanupExpiredVideos();
    }, 60 * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    // 드롭다운 스크롤 문제 해결 (드롭다운 크기 고정 및 모달 스크롤 차단)
    const originalLangSelect = document.getElementById('originalLang');
    const translationLangSelect = document.getElementById('translationLang');
    const modalContentWrapper = document.querySelector('.modal-content-wrapper');
    
    let isSelectActive = false;
    let modalScrollPosition = 0;
    
    // select가 포커스를 받을 때 (드롭다운이 열릴 때)
    const handleSelectFocus = (e) => {
        if (e.target === originalLangSelect || e.target === translationLangSelect) {
            isSelectActive = true;
            // 현재 모달 스크롤 위치 저장
            if (modalContentWrapper) {
                modalScrollPosition = modalContentWrapper.scrollTop;
                // 모달 스크롤을 막기 위해 overflow를 임시로 조정
                modalContentWrapper.style.overflow = 'hidden';
                // 모달 위치 고정 (드롭다운이 위로 커지지 않도록)
                modalContentWrapper.style.position = 'fixed';
                const rect = modalContentWrapper.getBoundingClientRect();
                modalContentWrapper.style.top = rect.top + 'px';
                modalContentWrapper.style.left = rect.left + 'px';
                modalContentWrapper.style.width = rect.width + 'px';
            }
        }
    };
    
    // select가 포커스를 잃을 때 (드롭다운이 닫힐 때)
    const handleSelectBlur = (e) => {
        if (e.target === originalLangSelect || e.target === translationLangSelect) {
            // 약간의 지연을 두어 드롭다운이 완전히 닫힐 때까지 대기
            setTimeout(() => {
                isSelectActive = false;
                if (modalContentWrapper) {
                    // 원래 상태로 복원
                    modalContentWrapper.style.overflow = '';
                    modalContentWrapper.style.position = '';
                    modalContentWrapper.style.top = '';
                    modalContentWrapper.style.left = '';
                    modalContentWrapper.style.width = '';
                    // 스크롤 위치 복원
                    modalContentWrapper.scrollTop = modalScrollPosition;
                }
            }, 300);
        }
    };
    
    // 모달의 wheel 이벤트를 캡처하여 select가 포커스되어 있을 때 완전 차단
    if (modalContentWrapper) {
        modalContentWrapper.addEventListener('wheel', (e) => {
            if (isSelectActive) {
                // select가 포커스되어 있으면 모달 스크롤 완전 차단
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false, capture: true });
    }
    
    // select 요소에 포커스/블러 이벤트 추가
    if (originalLangSelect) {
        originalLangSelect.addEventListener('focus', handleSelectFocus);
        originalLangSelect.addEventListener('blur', handleSelectBlur);
    }
    
    if (translationLangSelect) {
        translationLangSelect.addEventListener('focus', handleSelectFocus);
        translationLangSelect.addEventListener('blur', handleSelectBlur);
    }
    
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        // 모바일에서만 버튼 표시
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        }
        
        // 윈도우 리사이즈 이벤트 (throttle 적용)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth <= 768) {
                    mobileMenuBtn.style.display = 'block';
                } else {
                    mobileMenuBtn.style.display = 'none';
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                }
            }, 150);
        });
        
        // 메뉴 버튼 클릭
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('active');
        });
        
        // 오버레이 클릭 시 메뉴 닫기
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
        });
        
        // 사이드바 링크 클릭 시 메뉴 닫기 (모바일)
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-item');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }
    
    // 드래그 앤 드롭
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const translationModal = document.getElementById('translationModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeTranslationModal = document.getElementById('closeTranslationModal');
    
    // 선택된 파일 저장
    let selectedFile = null;
    let currentVideoDuration = 0; // 현재 선택된 영상의 길이 (초)
    
    // 클릭으로 업로드 (드롭존 영역 클릭 시)
    dropZone.addEventListener('click', (e) => {
        // 로그인 상태 확인
        if (!checkLoginStatus()) {
            alert('영상을 업로드하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
            redirectToLogin();
            return;
        }
        fileInput.click();
    });
    
    // 드래그 오버
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    // 드롭
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        // 로그인 상태 확인
        if (!checkLoginStatus()) {
            alert('영상을 업로드하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
            redirectToLogin();
            return;
        }
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // 파일 선택
    fileInput.addEventListener('change', (e) => {
        // 로그인 상태 확인
        if (!checkLoginStatus()) {
            alert('영상을 업로드하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
            redirectToLogin();
            // 파일 입력 초기화
            e.target.value = '';
            return;
        }
        
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    // 로그인 상태 확인 함수
    function checkLoginStatus() {
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const currentUser = localStorage.getItem('currentUser');
            return isLoggedIn && currentUser;
        } catch (error) {
            logger.error('로그인 상태 확인 오류:', error);
            return false;
        }
    }
    
    // 로그인 페이지로 리디렉션
    function redirectToLogin() {
        // 현재 페이지 URL을 저장하여 로그인 후 돌아올 수 있도록
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        window.location.href = 'html/login.html';
    }
    
    async function handleFile(file) {
        // 로그인 상태 확인
        if (!checkLoginStatus()) {
            alert('영상을 업로드하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
            redirectToLogin();
            return;
        }
        
        if (file.type.startsWith('video/')) {
            selectedFile = file;
            
            // 파일 업로드 시 즉시 저장 (작업 이력에 표시되도록)
            await saveUploadedVideo(file);
            
            // 저장 완료 플래그 설정 (작업 이력 페이지에서 새로고침하도록)
            localStorage.setItem('videoSaved', 'true');
            localStorage.setItem('lastSavedVideoId', selectedFile.uploadVideoId);
            
            // 번역 설정 모달 팝업 표시
            showTranslationModal();
        } else {
            alert('영상 파일을 업로드해주세요.');
        }
    }
    
    // 업로드된 비디오 즉시 저장 함수
    async function saveUploadedVideo(file) {
        try {
            // 비디오 메타데이터 추출
            const videoUrl = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = videoUrl;
            
            // 비디오 메타데이터 로드 대기
            await new Promise((resolve, reject) => {
                video.addEventListener('loadedmetadata', () => {
                    resolve();
                }, { once: true });
                video.addEventListener('error', reject, { once: true });
            });
            
            const duration = video.duration || 0;
            const fileSizeGB = file.size / (1024 * 1024 * 1024);
            
            // localStorage에서 기존 영상 확인
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const existingIndex = savedVideos.findIndex(v => 
                v.fileName === file.name && v.fileSize === file.size
            );
            
            let videoId;
            if (existingIndex !== -1) {
                // 기존 영상이 있으면 기존 ID 사용
                videoId = savedVideos[existingIndex].id;
                logger.log('기존 영상 ID 사용:', videoId);
            } else {
                // 새 비디오 ID 생성
                videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            // 파일 객체에 videoId 저장 (번역 완료 후 사용)
            file.uploadVideoId = videoId;
            
            // 비디오 데이터 생성 (번역 전 상태)
            const videoData = {
                id: videoId,
                title: file.name.replace(/\.[^/.]+$/, '') || '새 강의',
                description: '업로드된 영상',
                videoUrl: videoUrl,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                duration: duration,
                size: fileSizeGB,
                createdAt: new Date().toISOString(),
                savedAt: new Date().toISOString(),
                translated: false,
                category: '',
                tags: []
            };
            
            // localStorage에 저장
            if (existingIndex !== -1) {
                // 기존 영상 업데이트
                savedVideos[existingIndex] = { ...savedVideos[existingIndex], ...videoData };
                logger.log('기존 영상 업데이트:', videoId);
            } else {
                // 새 영상 추가
                savedVideos.push(videoData);
                logger.log('새 영상 추가:', videoId);
            }
            
            localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
            
            // IndexedDB에 저장 (백그라운드)
            saveFileToIndexedDB(videoId, file)
                .then(() => {
                    logger.log('IndexedDB 저장 완료:', videoId);
                })
                .catch((error) => {
                    logger.error('IndexedDB 저장 오류:', error);
                });
            
            // 저장 완료 플래그 설정 (작업 이력 페이지에서 새로고침하도록)
            localStorage.setItem('videoSaved', 'true');
            localStorage.setItem('lastSavedVideoId', videoId);
            localStorage.setItem('lastSavedVideoTitle', videoData.title);
            localStorage.setItem('lastSavedVideoTime', new Date().toISOString());
            
            logger.log('업로드된 영상 저장 완료 (작업 이력에 추가됨):', videoId);
            
        } catch (error) {
            logger.error('영상 저장 오류:', error);
        }
    }
    
    // 번역 설정 모달 표시 함수
    function showTranslationModal() {
        if (translationModal) {
            // 이전 비디오 미리보기 정리
            clearVideoPreview();
            
            // 비디오 미리보기 설정
            if (selectedFile) {
                setupVideoPreview(selectedFile);
            }
            
            translationModal.style.display = 'flex';
            // 페이드인 애니메이션
            setTimeout(() => {
                translationModal.style.opacity = '0';
                translationModal.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    translationModal.style.opacity = '1';
                }, 10);
            }, 10);
            
            // 크레딧 정보 초기화 (비디오 로드 후 자동 업데이트됨)
            const creditInfoEl = document.getElementById('creditInfo');
            if (creditInfoEl) {
                creditInfoEl.style.display = 'none';
            }
        }
    }
    
    // 비디오 미리보기 설정
    function setupVideoPreview(file) {
        const videoPreviewContainer = document.getElementById('videoPreviewContainer');
        const videoPreview = document.getElementById('videoPreview');
        const videoPreviewName = document.getElementById('videoPreviewName');
        const videoPreviewSize = document.getElementById('videoPreviewSize');
        
        if (!videoPreviewContainer || !videoPreview || !file) {
            logger.error('비디오 미리보기 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 이전 이벤트 리스너 제거
        const newVideoPreview = videoPreview.cloneNode(true);
        videoPreview.parentNode.replaceChild(newVideoPreview, videoPreview);
        
        // 비디오 URL 생성
        const videoUrl = URL.createObjectURL(file);
        newVideoPreview.src = videoUrl;
        newVideoPreview.id = 'videoPreview';
        
        // 파일 정보 표시
        if (videoPreviewName) {
            let fileName = file.name || '영상 파일';
            // 파일명이 너무 길면 자르기 (이미지처럼 긴 파일명 처리)
            if (fileName.length > 60) {
                fileName = fileName.substring(0, 57) + '...';
            }
            videoPreviewName.textContent = fileName;
        }
        
        if (videoPreviewSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            videoPreviewSize.textContent = `${fileSizeMB} MB`;
        }
        
        // 미리보기 컨테이너 표시
        videoPreviewContainer.style.display = 'block';
        
        // 비디오 메타데이터 로드 후 재생 시간 표시
        newVideoPreview.addEventListener('loadedmetadata', () => {
            const duration = newVideoPreview.duration;
            if (duration && !isNaN(duration)) {
                // 영상 길이 저장
                currentVideoDuration = duration;
                
                if (videoPreviewSize) {
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    // 크기와 재생시간 표시 (이미지 형식: "36.88 MB • 1:09")
                    videoPreviewSize.textContent = `${fileSizeMB} MB • ${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
                
                // 크레딧 정보 업데이트
                updateCreditInfo();
            }
        });
        
        // 비디오 로드 오류 처리
        newVideoPreview.addEventListener('error', (e) => {
            logger.error('비디오 로드 오류:', e);
            if (videoPreviewSize) {
                videoPreviewSize.textContent = '로드 실패';
            }
        });
    }
    
    // 번역 설정 모달 닫기 함수
    function closeTranslationModalFunc() {
        if (translationModal) {
            // 비디오 미리보기 정리
            clearVideoPreview();
            
            // 크레딧 정보 숨기기
            const creditInfoEl = document.getElementById('creditInfo');
            if (creditInfoEl) {
                creditInfoEl.style.display = 'none';
            }
            
            // 영상 길이 초기화
            currentVideoDuration = 0;
            
            translationModal.style.opacity = '0';
            translationModal.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                translationModal.style.display = 'none';
            }, 300);
        }
    }
    
    // 비디오 미리보기 정리
    function clearVideoPreview() {
        const videoPreviewContainer = document.getElementById('videoPreviewContainer');
        const videoPreview = document.getElementById('videoPreview');
        
        if (videoPreview && videoPreview.src) {
            // Blob URL 해제
            if (videoPreview.src.startsWith('blob:')) {
                URL.revokeObjectURL(videoPreview.src);
            }
            videoPreview.src = '';
        }
        
        if (videoPreviewContainer) {
            videoPreviewContainer.style.display = 'none';
        }
        
        const videoPreviewName = document.getElementById('videoPreviewName');
        const videoPreviewSize = document.getElementById('videoPreviewSize');
        if (videoPreviewName) videoPreviewName.textContent = '';
        if (videoPreviewSize) videoPreviewSize.textContent = '';
    }
    
    // 모달 닫기 이벤트
    if (closeTranslationModal) {
        closeTranslationModal.addEventListener('click', closeTranslationModalFunc);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeTranslationModalFunc);
    }
    
    
    // 언어 칩 제거
    const languageChips = document.querySelectorAll('.language-chip');
    languageChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-times')) {
                chip.remove();
                // 크레딧 정보 업데이트
                updateCreditInfo();
            }
        });
    });
    
    // 언어 추가 모달
    const addLanguageBtn = document.querySelector('.add-language-btn');
    const languageModal = document.getElementById('languageModal');
    const closeModal = document.getElementById('closeModal');
    const modalLanguageItems = document.querySelectorAll('.modal-language-item');
    
    // 모달이 열릴 때 현재 선택된 언어들을 표시
    addLanguageBtn.addEventListener('click', () => {
        // 현재 선택된 언어 칩들 가져오기
        const existingChips = Array.from(document.querySelectorAll('.language-chip'));
        const selectedLangs = existingChips.map(chip => chip.dataset.lang);
        
        // 모달의 언어 아이템들에 선택 상태 표시
        modalLanguageItems.forEach(item => {
            const lang = item.dataset.lang;
            if (selectedLangs.includes(lang)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        languageModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        languageModal.style.display = 'none';
    });
    
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.style.display = 'none';
        }
    });
    
    // 해당 언어 원어 이름 매핑
    function getLanguageDisplayName(langCode) {
        const langMap = {
            'ko': '한국어',
            'en': 'English',
            'ja': '日本語',
            'zh': '中文(간체)',
            'zh-TW': '中文(번체)',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'pt': 'Português',
            'it': 'Italiano',
            'ru': 'Русский',
            'vi': 'Tiếng Việt',
            'th': 'ไทย',
            'id': 'Bahasa Indonesia',
            'hi': 'हिन्दी',
            'ar': 'العربية',
            'tr': 'Türkçe',
            'pl': 'Polski',
            'nl': 'Nederlands',
            'sv': 'Svenska',
            'no': 'Norsk',
            'da': 'Dansk',
            'fi': 'Suomi',
            'cs': 'Čeština',
            'hu': 'Magyar',
            'el': 'Ελληνικά',
            'he': 'עברית',
            'uk': 'Українська',
            'ms': 'Bahasa Melayu',
            'ro': 'Română'
        };
        return langMap[langCode] || langCode;
    }
    
    // 크레딧 정보 업데이트 함수
    function updateCreditInfo() {
        const creditInfoEl = document.getElementById('creditInfo');
        if (!creditInfoEl || !currentVideoDuration || currentVideoDuration === 0) {
            if (creditInfoEl) creditInfoEl.style.display = 'none';
            return;
        }
        
        // 선택된 언어 수 계산
        const selectedLanguages = Array.from(document.querySelectorAll('.language-chip'));
        const translationCount = selectedLanguages.length;
        
        // 크레딧 계산
        const requiredCredits = CreditSystem.calculateRequiredCredits(currentVideoDuration, translationCount);
        
        // 크레딧 정보 표시
        creditInfoEl.textContent = `${requiredCredits.toLocaleString()} 크레딧`;
        creditInfoEl.style.display = 'inline-block';
    }
    
    // 모달에서 언어 선택/해제 토글 - 즉시 적용
    modalLanguageItems.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            
            // 현재 언어 칩들 가져오기
            const existingChips = Array.from(document.querySelectorAll('.language-chip'));
            const alreadyAdded = existingChips.some(chip => chip.dataset.lang === lang);
            
            if (alreadyAdded) {
                // 이미 추가된 언어면 제거
                const chipToRemove = existingChips.find(chip => chip.dataset.lang === lang);
                if (chipToRemove) {
                    chipToRemove.remove();
                }
                // 선택 상태 제거
                item.classList.remove('selected');
            } else {
                // 추가되지 않은 언어면 추가
                const chip = document.createElement('div');
                chip.className = 'language-chip';
                chip.dataset.lang = lang;
                const displayName = getLanguageDisplayName(lang);
                chip.innerHTML = `
                    <span>${displayName}</span>
                    <i class="fas fa-times"></i>
                `;
                
                chip.addEventListener('click', (e) => {
                    if (e.target.classList.contains('fa-times')) {
                        chip.remove();
                        // 칩 제거 시 모달의 선택 상태도 업데이트
                        const modalItem = Array.from(modalLanguageItems).find(i => i.dataset.lang === lang);
                        if (modalItem) {
                            modalItem.classList.remove('selected');
                        }
                        // 크레딧 정보 업데이트
                        updateCreditInfo();
                    }
                });
                
                addLanguageBtn.parentElement.insertBefore(chip, addLanguageBtn);
                // 선택 상태 추가
                item.classList.add('selected');
            }
            
            // 크레딧 정보 업데이트
            updateCreditInfo();
        });
    });
    
    // Translate Now 버튼
    const translateBtn = document.getElementById('translateBtn');
    if (!translateBtn) {
        console.warn('번역 버튼을 찾을 수 없습니다.');
    } else {
        translateBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('영상 파일을 먼저 업로드해주세요.');
            return;
        }
        
        // 번역 시작 애니메이션
        translateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            translateBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 번역 설정 가져오기
        const originalLang = document.getElementById('originalLang').value;
        const speakers = 'auto'; // 기본값: 자동 감지
        
        // 선택된 번역 언어들 가져오기
        const targetLanguages = Array.from(document.querySelectorAll('.language-chip'))
            .map(chip => {
                const langCode = chip.dataset.lang;
                const displayText = chip.querySelector('span').textContent;
                // 원어 이름만 사용 (이미 언어 코드가 제거된 상태)
                return {
                    code: langCode,
                    name: displayText
                };
            });
        
        if (targetLanguages.length === 0) {
            alert('최소 하나의 번역 언어를 선택해주세요.');
            return;
        }
        
        // 버튼 비활성화 및 로딩 표시
        translateBtn.disabled = true;
        const originalText = translateBtn.innerHTML;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>번역 중...</span>';
        
        // 진행률 표시 영역 표시
        const progressContainer = document.getElementById('translationProgressContainer');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressPercent = document.getElementById('progressPercent');
        const progressStatus = document.getElementById('progressText');
        const infoText = document.getElementById('infoText');
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        if (infoText) {
            infoText.style.display = 'none';
        }
        
        // 진행률 업데이트 함수
        const updateProgress = (percent, status) => {
            if (progressBarFill) {
                progressBarFill.style.width = percent + '%';
            }
            if (progressPercent) {
                progressPercent.textContent = Math.round(percent) + '%';
            }
            if (progressStatus) {
                progressStatus.textContent = status;
            }
        };
        
        // 변수 선언 (try-catch 블록 외부에서 선언하여 스코프 문제 해결)
        let reservation = null;
        let jobId = null;
        let isFreeTrial = false;
        
        try {
            // 1. 비디오 메타데이터 가져오기 (0-10%)
            updateProgress(0, '비디오 분석 중...');
            const videoUrl = URL.createObjectURL(selectedFile);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = videoUrl;
            
            await new Promise((resolve, reject) => {
                video.addEventListener('loadedmetadata', () => {
                    updateProgress(10, '비디오 분석 완료');
                    setTimeout(resolve, 300);
                });
                video.addEventListener('error', reject);
            });
            
            const duration = video.duration;
            const fileSizeGB = selectedFile.size / (1024 * 1024 * 1024);
            
            // 번역 언어 수 계산
            const translationLanguageCount = targetLanguages.length;
            
            // 무료 크레딧 자격 확인
            const freeTrialCheck = FreeTrialSystem.checkEligibility(duration, translationLanguageCount);
            
            if (freeTrialCheck.eligible && !FreeTrialSystem.isUsed()) {
                // 무료 크레딧 사용 확인
                if (confirm('무료 크레딧을 사용하시겠습니까?\n\n• 100 크레딧 제공\n• 최대 10분 영상\n• 1개 언어 번역\n• 24시간 보관\n• 다운로드 불가\n\n계정 당 1회만 제공됩니다.')) {
                    isFreeTrial = true;
                    FreeTrialSystem.grantFreeCredits();
                }
            } else if (!freeTrialCheck.eligible && !FreeTrialSystem.isUsed()) {
                // 무료 크레딧 자격 미충족
                alert(`무료 크레딧 제한:\n${freeTrialCheck.reason}\n\n일반 크레딧으로 진행하시겠습니까?`);
            }
            
            // 크레딧 계산 (1 크레딧 = 6초, 기본 10크레딧/분, 번역 +5크레딧/분)
            const requiredCredits = CreditSystem.calculateRequiredCredits(duration, translationLanguageCount);
            const currentBalance = CreditSystem.getBalance();
            
            // 크레딧 잔액 확인
            if (currentBalance < requiredCredits) {
                updateProgress(0, '크레딧 부족');
                const isInHtmlFolder = window.location.pathname.includes('/html/');
                const pricingPath = isInHtmlFolder ? 'pricing.html' : 'html/pricing.html';
                
                if (confirm(`크레딧이 부족합니다.\n필요 크레딧: ${requiredCredits.toLocaleString()} 크레딧\n보유 크레딧: ${currentBalance.toLocaleString()} 크레딧\n\n크레딧 충전 페이지로 이동하시겠습니까?`)) {
                    window.location.href = pricingPath;
                }
                
                translateBtn.disabled = false;
                translateBtn.innerHTML = originalText;
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                if (infoText) {
                    infoText.style.display = 'flex';
                }
                return;
            }
            
            // 작업 ID 생성
            jobId = JobManager.createJob(null, {
                videoFileName: selectedFile.name,
                duration: duration,
                originalLang: originalLang,
                targetLanguages: targetLanguages,
                translationLanguageCount: translationLanguageCount,
                requiredCredits: requiredCredits,
                isFreeTrial: isFreeTrial
            });
            
            // 크레딧 예약 (선차감)
            reservation = CreditSystem.reserveCredits(jobId, requiredCredits);
            if (!reservation.success) {
                updateProgress(0, '크레딧 예약 실패');
                const isInHtmlFolder = window.location.pathname.includes('/html/');
                const pricingPath = isInHtmlFolder ? 'pricing.html' : 'html/pricing.html';
                
                if (reservation.error === 'INSUFFICIENT_CREDITS') {
                    if (confirm(`크레딧이 부족합니다.\n필요 크레딧: ${reservation.required.toLocaleString()} 크레딧\n보유 크레딧: ${reservation.balance.toLocaleString()} 크레딧\n\n크레딧 충전 페이지로 이동하시겠습니까?`)) {
                        window.location.href = pricingPath;
                    }
                } else {
                    alert(`크레딧 예약에 실패했습니다.\n필요 크레딧: ${reservation.required.toLocaleString()} 크레딧\n보유 크레딧: ${reservation.balance.toLocaleString()} 크레딧`);
                }
                
                JobManager.updateJobStatus(jobId, JobStatus.FAILED, { error: 'INSUFFICIENT_CREDITS' });
                translateBtn.disabled = false;
                translateBtn.innerHTML = originalText;
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                if (infoText) {
                    infoText.style.display = 'flex';
                }
                return;
            }
            
            // 작업 상태를 처리 중으로 변경
            JobManager.updateJobStatus(jobId, JobStatus.PROCESSING);
            
            logger.log(`크레딧 예약 완료: ${requiredCredits} 크레딧 (작업 ID: ${jobId}, 예약 ID: ${reservation.reservedId}, 남은 크레딧: ${reservation.balance})`);
            
            // 2. STT 처리 (10-50%)
            updateProgress(10, '음성 인식 중...');
            logger.log('번역 시작:', {
                originalLang,
                targetLanguages,
                speakers,
                duration
            });
            
            // STT 시뮬레이션
            let sttSuccess = true;
            try {
                await simulateTranslationWithProgress(duration, (progress) => {
                    // STT 진행률: 10% ~ 50%
                    const sttProgress = 10 + (progress * 0.4);
                    updateProgress(sttProgress, `음성 인식 중... (${Math.round(progress)}%)`);
                });
                updateProgress(50, '음성 인식 완료');
            } catch (error) {
                sttSuccess = false;
                logger.error('STT 실패:', error);
                // STT 실패 시 전액 환불
                CreditSystem.refundCredits(reservation.reservedId, jobId, 'STT 처리 실패로 인한 환불');
                JobManager.updateJobStatus(jobId, JobStatus.FAILED, { error: 'STT_FAILED', errorMessage: error.message });
                updateProgress(0, '음성 인식 실패');
                alert('음성 인식 처리 중 오류가 발생했습니다. 크레딧이 환불되었습니다.');
                translateBtn.disabled = false;
                translateBtn.innerHTML = originalText;
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                if (infoText) {
                    infoText.style.display = 'flex';
                }
                return;
            }
            
            // 3. 번역 처리 (50-80%)
            updateProgress(50, '번역 시작 중...');
            const translationResults = {};
            let translationFailed = false;
            const failedLanguages = [];
            
            // 각 언어별 번역 처리
            for (let i = 0; i < targetLanguages.length; i++) {
                const lang = targetLanguages[i];
                try {
                    await new Promise((resolve) => {
                        // 번역 시뮬레이션 (각 언어당 약간의 시간)
                        const translationTime = Math.min(2000, Math.max(500, duration * 10));
                        setTimeout(() => {
                            const progress = 50 + ((i + 1) / targetLanguages.length * 30);
                            updateProgress(progress, `${lang.name} 번역 중...`);
                            translationResults[lang.code] = true;
                            resolve();
                        }, translationTime);
                    });
                } catch (error) {
                    logger.error(`번역 실패 (${lang.name}):`, error);
                    translationResults[lang.code] = false;
                    translationFailed = true;
                    failedLanguages.push(lang.name);
                }
            }
            
            // 번역 실패 처리
            if (translationFailed) {
                // 실패한 언어에 대한 크레딧만 환불
                const failedLanguageCount = failedLanguages.length;
                const refundAmount = Math.ceil(duration / 60) * CreditSystem.TRANSLATION_CREDIT_PER_MINUTE * failedLanguageCount;
                
                if (refundAmount > 0) {
                    CreditSystem.refundCredits(reservation.reservedId, jobId, 
                        `번역 실패 (${failedLanguages.join(', ')})로 인한 부분 환불`, refundAmount);
                }
                
                // 일부 언어만 실패한 경우 경고만 표시
                if (failedLanguageCount < targetLanguages.length) {
                    alert(`일부 언어 번역에 실패했습니다: ${failedLanguages.join(', ')}\n해당 언어에 대한 크레딧이 환불되었습니다.`);
                } else {
                    // 모든 번역 실패 시 작업 실패 처리
                    JobManager.updateJobStatus(jobId, JobStatus.FAILED, { error: 'TRANSLATION_FAILED', failedLanguages: failedLanguages });
                    updateProgress(0, '번역 실패');
                    alert('번역 처리 중 오류가 발생했습니다.');
                    translateBtn.disabled = false;
                    translateBtn.innerHTML = originalText;
                    if (progressContainer) {
                        progressContainer.style.display = 'none';
                    }
                    if (infoText) {
                        infoText.style.display = 'flex';
                    }
                    return;
                }
            }
            
            updateProgress(80, '번역 완료');
            
            // 4. 번역된 자막 생성 (80-90%)
            updateProgress(80, '자막 생성 중...');
            const transcriptions = generateSampleTranscriptions(duration, originalLang, targetLanguages);
            
            // 자막 생성 시뮬레이션
            await new Promise(resolve => {
                let segmentProgress = 0;
                const totalSegments = transcriptions.length;
                const interval = setInterval(() => {
                    segmentProgress += 2;
                    const progress = 70 + (segmentProgress / totalSegments * 20);
                    updateProgress(Math.min(progress, 90), `자막 생성 중... (${Math.round(segmentProgress / totalSegments * 100)}%)`);
                    
                    if (segmentProgress >= totalSegments) {
                        clearInterval(interval);
                        updateProgress(90, '자막 생성 완료');
                        setTimeout(resolve, 300);
                    }
                }, 50);
            });
            
            logger.log('번역 완료, 자막 생성:', transcriptions.length, '개 세그먼트');
            
            // 크레딧 확정 차감
            const description = `영상 자막 생성 (${Math.floor(duration / 60)}분 ${Math.floor(duration % 60)}초, ${translationLanguageCount}개 언어)`;
            CreditSystem.confirmDeduction(reservation.reservedId, jobId, description);
            
            // 업로드 시 저장된 videoId 사용 (없으면 새로 생성)
            let videoId = selectedFile.uploadVideoId;
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            let existingVideoIndex = -1;
            
            if (videoId) {
                // 업로드 시 저장된 ID로 기존 영상 찾기
                existingVideoIndex = savedVideos.findIndex(v => v.id === videoId);
            } else {
                // 업로드 시 저장되지 않은 경우 파일명과 크기로 찾기
                existingVideoIndex = savedVideos.findIndex(v => 
                    v.fileName === selectedFile.name && v.fileSize === selectedFile.size
                );
                if (existingVideoIndex !== -1) {
                    videoId = savedVideos[existingVideoIndex].id;
                }
            }
            
            let videoData;
            
            // 보관 만료 시간 계산
            const expiresAt = StorageManager.calculateExpiryDate(isFreeTrial);
            
            if (existingVideoIndex !== -1) {
                // 기존 영상 업데이트
                videoData = {
                    ...savedVideos[existingVideoIndex],
                    description: `원본 언어: ${originalLang === 'auto' ? '자동 감지' : originalLang}, 번역 언어: ${targetLanguages.map(l => l.name).join(', ')}`,
                    videoUrl: videoUrl,
                    originalLang: originalLang,
                    targetLanguages: targetLanguages,
                    speakers: speakers,
                    savedAt: new Date().toISOString(),
                    transcriptions: transcriptions,
                    translated: true,
                    translationDate: new Date().toISOString(),
                    jobId: jobId,
                    expiresAt: expiresAt,
                    isFreeTrial: isFreeTrial,
                    downloadable: !isFreeTrial // 무료 크레딧은 다운로드 불가
                };
                logger.log('기존 영상 번역 정보 업데이트:', videoId);
            } else {
                // 새 영상 생성 (업로드 시 저장되지 않은 경우)
                videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                videoData = {
                    id: videoId,
                    title: selectedFile.name.replace(/\.[^/.]+$/, '') || '새 강의',
                    description: `원본 언어: ${originalLang === 'auto' ? '자동 감지' : originalLang}, 번역 언어: ${targetLanguages.map(l => l.name).join(', ')}`,
                    videoUrl: videoUrl,
                    fileName: selectedFile.name,
                    fileSize: selectedFile.size,
                    fileType: selectedFile.type,
                    duration: duration,
                    size: fileSizeGB,
                    originalLang: originalLang,
                    targetLanguages: targetLanguages,
                    speakers: speakers,
                    createdAt: new Date().toISOString(),
                    savedAt: new Date().toISOString(),
                    transcriptions: transcriptions,
                    category: '',
                    tags: [],
                    translated: true,
                    translationDate: new Date().toISOString(),
                    jobId: jobId,
                    expiresAt: expiresAt,
                    isFreeTrial: isFreeTrial,
                    downloadable: !isFreeTrial // 무료 크레딧은 다운로드 불가
                };
                logger.log('새 영상 생성:', videoId);
            }
            
            // 작업에 videoId 연결
            JobManager.updateJobStatus(jobId, JobStatus.COMPLETED, { videoId: videoId });
            
            logger.log('비디오 데이터 생성 완료:', videoId);
            
            // 4. 저장 중 (90-92%) - 최적화된 병렬 저장
            updateProgress(90, '저장 준비 중...');
            
            // IndexedDB와 localStorage를 병렬로 저장하여 속도 최적화
            updateProgress(91, '저장 중...');
            
            const savePromises = [];
            
            // localStorage 저장 (빠른 저장)
            const localStorageSavePromise = (async () => {
                try {
                    const currentSavedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                    
                    // 중복 체크 (같은 ID가 있으면 업데이트, 없으면 추가)
                    const existingIndex = currentSavedVideos.findIndex(v => v.id === videoId);
                    if (existingIndex !== -1) {
                        currentSavedVideos[existingIndex] = videoData;
                        logger.log('기존 영상 업데이트:', videoId);
                    } else {
                        currentSavedVideos.push(videoData);
                        logger.log('새 영상 추가:', videoId);
                    }
                    
                    localStorage.setItem('savedVideos', JSON.stringify(currentSavedVideos));
                    
                    // 저장 확인
                    const verifySaved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                    const savedVideo = verifySaved.find(v => v.id === videoId);
                    
                    if (savedVideo) {
                        logger.log('로컬 스토리지 저장 완료, 총 영상 수:', currentSavedVideos.length);
                        return true;
                    } else {
                        throw new Error('저장 확인 실패');
                    }
                } catch (error) {
                    logger.error('localStorage 저장 오류:', error);
                    throw error;
                }
            })();
            
            // IndexedDB 저장 (백그라운드에서 실행)
            const indexDbSavePromise = saveFileToIndexedDB(videoId, selectedFile)
                .then(() => {
                    logger.log('IndexedDB 저장 완료');
                    return true;
                })
                .catch((error) => {
                    logger.error('IndexedDB 저장 오류:', error);
                    // IndexedDB 저장 실패해도 계속 진행
                    return false;
                });
            
            // 병렬 저장 실행
            updateProgress(92, '파일 저장 중...');
            
            try {
                // localStorage는 빠르게 완료되어야 하므로 우선 대기
                await localStorageSavePromise;
                logger.log('localStorage 저장 완료');
                
                // IndexedDB는 백그라운드에서 계속 진행
                indexDbSavePromise.then((success) => {
                    if (success) {
                        logger.log('IndexedDB 백그라운드 저장 완료');
                    }
                });
                
                // 저장 완료 확인
                const finalCheck = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                const finalVideo = finalCheck.find(v => v.id === videoId);
                
                if (!finalVideo) {
                    throw new Error('저장 확인 실패');
                }
                
                logger.log('저장 완료:', {
                    videoId: finalVideo.id,
                    title: finalVideo.title
                });
                
            } catch (error) {
                logger.error('저장 오류:', error);
                // 재시도
                try {
                    const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                    const existingIndex = savedVideos.findIndex(v => v.id === videoId);
                    if (existingIndex !== -1) {
                        savedVideos[existingIndex] = videoData;
                    } else {
                        savedVideos.push(videoData);
                    }
                    localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
                    logger.log('재시도 저장 완료');
                } catch (retryError) {
                    logger.error('재시도 저장 실패:', retryError);
                    throw error;
                }
            }
            
            // 완료
            updateProgress(100, '번역 완료!');
            
            // 파일 입력 초기화
            if (fileInput) {
                fileInput.value = '';
            }
            selectedFile = null;
            
            // 완료 후 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 저장 완료 플래그 설정 (마이페이지에서 새로고침하도록)
            localStorage.setItem('videoSaved', 'true');
            localStorage.setItem('lastSavedVideoId', videoId);
            localStorage.setItem('lastSavedVideoTitle', videoData.title);
            localStorage.setItem('lastSavedVideoTime', new Date().toISOString());
            
            // 모달 닫기
            closeTranslationModalFunc();
            
            // 성공 메시지 표시
            const expiryDate = new Date(expiresAt);
            const expiryDateStr = `${expiryDate.getFullYear()}.${String(expiryDate.getMonth() + 1).padStart(2, '0')}.${String(expiryDate.getDate()).padStart(2, '0')} ${String(expiryDate.getHours()).padStart(2, '0')}:${String(expiryDate.getMinutes()).padStart(2, '0')}`;
            
            // 보관 기간 정보 가져오기
            const storagePeriod = StorageManager.getStoragePeriod();
            const periodText = storagePeriod === 1 ? '24시간' : `${storagePeriod}일`;
            
            let successMessage = '번역이 완료되었습니다!\n\n번역된 영상이 저장되었으며, 나의 작업에서 확인할 수 있습니다.';
            if (isFreeTrial) {
                successMessage += `\n\n[무료 크레딧]\n보관 기간: ${expiryDateStr}까지 (7일)\n다운로드 불가`;
            } else {
                successMessage += `\n\n보관 기간: ${expiryDateStr}까지 (${periodText})`;
            }
            alert(successMessage);
            
            // storage.html로 이동 (새로고침 강제)
            setTimeout(() => {
                window.location.href = 'html/storage.html?refresh=true&saved=' + videoId;
            }, 300);
            
        } catch (error) {
            logger.error('번역 오류:', error);
            
            // 오류 발생 시 크레딧 환불
            if (reservation && reservation.success && jobId) {
                CreditSystem.refundCredits(reservation.reservedId, jobId, '처리 중 오류 발생으로 인한 환불');
            }
            
            // 작업 상태를 실패로 변경
            if (jobId) {
                JobManager.updateJobStatus(jobId, JobStatus.FAILED, { error: 'PROCESSING_ERROR', errorMessage: error.message });
            }
            
            updateProgress(0, '오류 발생');
            alert('번역 중 오류가 발생했습니다. 크레딧이 환불되었습니다. 다시 시도해주세요.');
            translateBtn.disabled = false;
            translateBtn.innerHTML = originalText;
            
            // 진행률 표시 숨기기
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
            if (infoText) {
                infoText.style.display = 'flex';
            }
        }
    });
    }
    
    // 번역 시뮬레이션 (실제로는 API 호출)
    function simulateTranslation(duration) {
        return new Promise((resolve) => {
            // 번역 시간 시뮬레이션 (비디오 길이에 비례, 최소 2초, 최대 5초)
            const translationTime = Math.min(5000, Math.max(2000, duration * 100));
            setTimeout(resolve, translationTime);
        });
    }
    
    // 진행률 콜백이 있는 번역 시뮬레이션
    function simulateTranslationWithProgress(duration, onProgress) {
        return new Promise((resolve) => {
            // 번역 시간 시뮬레이션 (비디오 길이에 비례, 최소 2초, 최대 5초)
            const translationTime = Math.min(5000, Math.max(2000, duration * 100));
            const steps = 20; // 20단계로 나눔
            const stepTime = translationTime / steps;
            let currentStep = 0;
            
            const interval = setInterval(() => {
                currentStep++;
                const progress = (currentStep / steps) * 100;
                onProgress(progress);
                
                if (currentStep >= steps) {
                    clearInterval(interval);
                    resolve();
                }
            }, stepTime);
        });
    }
    
    // IndexedDB에 파일 저장
    function saveFileToIndexedDB(videoId, file) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AX2_Videos', 1);
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readwrite');
                const store = transaction.objectStore('videos');
                
                const fileReader = new FileReader();
                
                fileReader.onload = (e) => {
                    const fileData = {
                        id: videoId,
                        data: e.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        savedAt: new Date().toISOString()
                    };
                    
                    // 최적화: 저장 확인 단계 제거하여 속도 향상
                    const putRequest = store.put(fileData);
                    putRequest.onsuccess = () => {
                        logger.log('IndexedDB 파일 저장 성공:', videoId);
                        resolve(); // 저장 확인 단계 제거하여 속도 향상
                    };
                    putRequest.onerror = () => {
                        logger.error('IndexedDB 저장 실패:', putRequest.error);
                        reject(putRequest.error);
                    };
                };
                
                fileReader.onerror = () => {
                    logger.error('파일 읽기 실패:', fileReader.error);
                    reject(fileReader.error);
                };
                
                fileReader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        logger.log(`파일 읽기 진행률: ${percent.toFixed(1)}%`);
                    }
                };
                
                fileReader.readAsArrayBuffer(file);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('videos')) {
                    const objectStore = db.createObjectStore('videos', { keyPath: 'id' });
                    objectStore.createIndex('savedAt', 'savedAt', { unique: false });
                    logger.log('IndexedDB objectStore 생성 완료');
                }
            };
        });
    }
    
    // 샘플 트랜스크립션 생성 (실제로는 API에서 받아옴)
    function generateSampleTranscriptions(duration, originalLang, targetLanguages) {
        const transcriptions = [];
        const segmentDuration = 5; // 각 세그먼트 5초
        let currentTime = 0;
        let segmentId = 1;
        
        // 원본 언어 텍스트 샘플
        const originalTexts = {
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'en': ['Hello', 'Nice weather today', 'This lecture is very useful', 'Thank you', 'See you next time'],
            'auto': ['안녕하세요', 'Hello', 'こんにちは', 'Hola']
        };
        
        // 번역 언어별 번역 텍스트 샘플
        const translations = {
            'en': ['Hello', 'Nice weather today', 'This lecture is very useful', 'Thank you', 'See you next time'],
            'es': ['Hola', 'Buen tiempo hoy', 'Esta conferencia es muy útil', 'Gracias', 'Hasta la próxima'],
            'fr': ['Bonjour', 'Beau temps aujourd\'hui', 'Cette conférence est très utile', 'Merci', 'À la prochaine'],
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'ja': ['こんにちは', '今日は良い天気ですね', 'この講義は非常に有用です', 'ありがとうございます', 'また次回お会いしましょう'],
            'zh': ['你好', '今天天气不错', '这个讲座非常有用', '谢谢', '下次见'],
            'vi': ['Xin chào', 'Thời tiết hôm nay đẹp', 'Bài giảng này rất hữu ích', 'Cảm ơn bạn', 'Hẹn gặp lại lần sau']
        };
        
        const originalTextArray = originalTexts[originalLang] || originalTexts['auto'];
        let textIndex = 0;
        
        while (currentTime < duration) {
            const endTime = Math.min(currentTime + segmentDuration, duration);
            const originalText = originalTextArray[textIndex % originalTextArray.length];
            
            // 번역 데이터 생성
            const translationData = {
                id: segmentId++,
                speaker: '화자 1',
                startTime: currentTime,
                endTime: endTime,
                korean: originalLang === 'ko' ? originalText : `번역된 텍스트 (${Math.floor(currentTime)}s-${Math.floor(endTime)}s)`,
                english: ''
            };
            
            // 번역 언어별 번역 추가
            targetLanguages.forEach(targetLang => {
                const langCode = targetLang.code;
                const translatedText = translations[langCode] ? 
                    translations[langCode][textIndex % translations[langCode].length] : 
                    `Translated text (${Math.floor(currentTime)}s-${Math.floor(endTime)}s)`;
                
                if (langCode === 'en') {
                    translationData.english = translatedText;
                } else if (langCode === 'ko') {
                    translationData.korean = translatedText;
                } else {
                    // 다른 언어는 동적으로 추가 가능
                    translationData[langCode] = translatedText;
                }
            });
            
            transcriptions.push(translationData);
            currentTime = endTime;
            textIndex++;
        }
        
        return transcriptions;
    }
    
    // 스크롤 시 네비게이션 효과
    let lastScroll = 0;
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.8)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        lastScroll = currentScroll;
    });
    
    // Floating 애니메이션
    const floatingElements = document.querySelectorAll('.upload-icon, .logo-circle');
    floatingElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'float-icon 2s ease-in-out infinite';
        });
    });
    
    // 사이드바 아이템 클릭 이벤트
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = item.dataset.page;
            
            // 마이페이지인 경우 mypage.html로 이동
            if (page === 'projects') {
                window.location.href = 'html/mypage.html';
                return;
            }
            
            // 다른 페이지는 기본 동작 허용 또는 처리
            if (item.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // 모든 아이템에서 active 제거
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // 클릭한 아이템에 active 추가
            item.classList.add('active');
            
            // 페이지 전환 로직 (필요시 구현)
            logger.log(`${page} 페이지로 이동`);
        });
    });
    
    // 남은 시간 초기화 및 표시
    // 무료 크레딧 정보 업데이트 (비로그인 상태에서만 무료 크레딧 표시) - 전역 함수로 정의
    window.updateFreeCreditInfo = function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const planInfoBox = document.getElementById('plan-info-box');
        const freeCreditInfoEl = document.getElementById('free-credit-info');
        
        if (!planInfoBox || !freeCreditInfoEl) {
            return; // 요소가 없으면 종료
        }
        
        if (isLoggedIn) {
            // 로그인 상태: 무료 크레딧 표시 숨김 (로그인 후 크레딧은 auth-state.js에서 표시)
            planInfoBox.style.display = 'none';
            freeCreditInfoEl.textContent = '';
            return;
        }
        
        // 비로그인 상태: plan-info-box 강제 표시 (다른 스크립트가 숨기지 못하도록)
        planInfoBox.style.display = 'flex';
        planInfoBox.style.visibility = 'visible';
        planInfoBox.style.opacity = '1';
        planInfoBox.setAttribute('data-force-display', 'true');
        
        // 주기적으로 plan-info-box가 숨겨졌는지 확인하고 복구
        const checkAndRestore = () => {
            if (!isLoggedIn && planInfoBox.style.display === 'none') {
                planInfoBox.style.display = 'flex';
                planInfoBox.style.visibility = 'visible';
            }
        };
        setTimeout(checkAndRestore, 100);
        setTimeout(checkAndRestore, 500);
        
        // 무료 크레딧 표시
        const isUsed = FreeTrialSystem.isUsed();
        let displayText = '';
        
        if (isUsed) {
            // 무료 크레딧을 사용한 경우: 실제 무료 크레딧 잔액 표시
            const freeCreditBalance = parseInt(localStorage.getItem('freeCreditBalance') || '0');
            displayText = `${freeCreditBalance.toLocaleString()} 크레딧`;
        } else {
            // 무료 크레딧을 사용하지 않은 경우: 제공될 크레딧 표시 (항상 100 크레딧)
            displayText = `${FreeTrialSystem.FREE_TRIAL_CREDITS.toLocaleString()} 크레딧`;
        }
        
        // 텍스트 업데이트
        freeCreditInfoEl.textContent = displayText;
        freeCreditInfoEl.style.display = 'inline';
        freeCreditInfoEl.style.visibility = 'visible';
    };
    
    // 네비게이션 바 로드 후 무료 크레딧 정보 업데이트
    function initFreeCreditInfo() {
        // MutationObserver로 DOM 변경 감지하여 자동 업데이트
        const observer = new MutationObserver(function(mutations) {
            const freeCreditInfoEl = document.getElementById('free-credit-info');
            if (freeCreditInfoEl && freeCreditInfoEl.textContent === '100 크레딧') {
                // 기본값이면 업데이트
                updateFreeCreditInfo();
            }
        });
        
        // 네비게이션 바가 로드될 때까지 대기
        const checkNavBar = () => {
            const navPlaceholder = document.getElementById('nav-placeholder');
            const freeCreditInfoEl = document.getElementById('free-credit-info');
            
            if (navPlaceholder && freeCreditInfoEl) {
                // MutationObserver 시작
                observer.observe(navPlaceholder, { childList: true, subtree: true });
                
                // 즉시 업데이트
                updateFreeCreditInfo();
                
                // 여러 시점에서 업데이트 보장
                setTimeout(() => updateFreeCreditInfo(), 50);
                setTimeout(() => updateFreeCreditInfo(), 100);
                setTimeout(() => updateFreeCreditInfo(), 200);
                setTimeout(() => updateFreeCreditInfo(), 500);
                setTimeout(() => updateFreeCreditInfo(), 1000);
            } else {
                // 네비게이션 바가 아직 로드되지 않았으면 다시 시도
                setTimeout(checkNavBar, 50);
            }
        };
        
        // navBarLoaded 이벤트 리스너 (여러 번 호출 보장)
        const handleNavBarLoaded = function() {
            setTimeout(() => updateFreeCreditInfo(), 10);
            setTimeout(() => updateFreeCreditInfo(), 50);
            setTimeout(() => updateFreeCreditInfo(), 100);
            setTimeout(() => updateFreeCreditInfo(), 200);
            setTimeout(() => updateFreeCreditInfo(), 500);
        };
        document.addEventListener('navBarLoaded', handleNavBarLoaded);
        
        // window.load 이벤트에서도 호출
        window.addEventListener('load', function() {
            setTimeout(() => updateFreeCreditInfo(), 100);
            setTimeout(() => updateFreeCreditInfo(), 300);
            setTimeout(() => updateFreeCreditInfo(), 500);
        });
        
        // DOMContentLoaded에서도 호출
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => checkNavBar(), 100);
            });
        } else {
            checkNavBar();
        }
    }
    
    // 페이지 로드 시 무료 크레딧 정보 초기화
    initFreeCreditInfo();
    
    // localStorage 변경 감지 (크레딧 잔액이 변경될 때마다 업데이트)
    let lastFreeCreditBalance = parseInt(localStorage.getItem('freeCreditBalance') || '0');
    let lastFreeTrialUsed = localStorage.getItem('freeTrialUsed') === 'true';
    setInterval(function() {
        const currentFreeCreditBalance = parseInt(localStorage.getItem('freeCreditBalance') || '0');
        const currentFreeTrialUsed = localStorage.getItem('freeTrialUsed') === 'true';
        if (currentFreeCreditBalance !== lastFreeCreditBalance || currentFreeTrialUsed !== lastFreeTrialUsed) {
            lastFreeCreditBalance = currentFreeCreditBalance;
            lastFreeTrialUsed = currentFreeTrialUsed;
            updateFreeCreditInfo();
        }
    }, 500); // 0.5초마다 체크
    
    // 주기적으로 강제 업데이트 (다른 스크립트가 값을 변경했을 경우 대비)
    setInterval(function() {
        const freeCreditInfoEl = document.getElementById('free-credit-info');
        if (freeCreditInfoEl) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                // 비로그인 상태에서만 업데이트
                updateFreeCreditInfo();
            }
        }
    }, 2000); // 2초마다 강제 업데이트
});

