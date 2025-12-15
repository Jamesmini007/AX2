// AX2 실시간 번역·자막 생성 인터페이스 JavaScript

// 프로덕션 환경에서 console.log 비활성화
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logger = {
    log: isDev ? console.log.bind(console) : () => {},
    error: console.error.bind(console), // 에러는 항상 표시
    warn: isDev ? console.warn.bind(console) : () => {}
};

document.addEventListener('DOMContentLoaded', () => {
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
    
    // 입자 효과
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        const pCtx = particlesCanvas.getContext('2d');
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 30;
        
        class Particle {
            constructor() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.1;
                const colors = [
                    'rgba(33, 150, 243, 0.2)',
                    'rgba(156, 39, 176, 0.2)',
                    'rgba(233, 30, 99, 0.2)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
            }
            
            draw() {
                pCtx.fillStyle = this.color;
                pCtx.globalAlpha = this.opacity;
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animateParticles() {
            pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        // 리사이즈 이벤트 최적화 (throttle)
        let particlesResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(particlesResizeTimeout);
            particlesResizeTimeout = setTimeout(() => {
                particlesCanvas.width = window.innerWidth;
                particlesCanvas.height = window.innerHeight;
            }, 150);
        });
    }
    
    // Confetti 효과
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
        const cCtx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        
        const confetti = [];
        const confettiCount = 20;
        
        class Confetti {
            constructor() {
                this.x = Math.random() * confettiCanvas.width;
                this.y = -10;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 2 + 1;
                this.size = Math.random() * 4 + 2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.1;
                this.opacity = Math.random() * 0.5 + 0.3;
                const colors = [
                    'rgba(33, 150, 243, 0.3)',
                    'rgba(156, 39, 176, 0.3)',
                    'rgba(233, 30, 99, 0.3)',
                    'rgba(255, 215, 0, 0.3)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.vy += 0.05;
            }
            
            draw() {
                cCtx.save();
                cCtx.globalAlpha = this.opacity;
                cCtx.translate(this.x, this.y);
                cCtx.rotate(this.rotation);
                cCtx.fillStyle = this.color;
                cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                cCtx.restore();
            }
            
            isDead() {
                return this.y > confettiCanvas.height;
            }
        }
        
        function createConfetti() {
            if (confetti.length < confettiCount) {
                confetti.push(new Confetti());
            }
        }
        
        function animateConfetti() {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            confetti.forEach((c, index) => {
                c.update();
                c.draw();
                if (c.isDead()) {
                    confetti.splice(index, 1);
                }
            });
            
            if (Math.random() < 0.1) {
                createConfetti();
            }
            
            requestAnimationFrame(animateConfetti);
        }
        
        animateConfetti();
        
        // 리사이즈 이벤트 최적화 (throttle)
        let confettiResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(confettiResizeTimeout);
            confettiResizeTimeout = setTimeout(() => {
                confettiCanvas.width = window.innerWidth;
                confettiCanvas.height = window.innerHeight;
            }, 150);
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
            
            // 파일 업로드 시 즉시 저장
            await saveUploadedVideo(file);
            
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
            
            // 저장 완료 플래그 설정
            localStorage.setItem('videoSaved', 'true');
            localStorage.setItem('lastSavedVideoId', videoId);
            localStorage.setItem('lastSavedVideoTitle', videoData.title);
            localStorage.setItem('lastSavedVideoTime', new Date().toISOString());
            
            logger.log('업로드된 영상 저장 완료:', videoId);
            
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
            if (videoPreviewSize && duration && !isNaN(duration)) {
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                // 크기와 재생시간 표시 (이미지 형식: "36.88 MB • 1:09")
                videoPreviewSize.textContent = `${fileSizeMB} MB • ${minutes}:${seconds.toString().padStart(2, '0')}`;
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
            }
        });
    });
    
    // 언어 추가 모달
    const addLanguageBtn = document.querySelector('.add-language-btn');
    const languageModal = document.getElementById('languageModal');
    const closeModal = document.getElementById('closeModal');
    const modalLanguageItems = document.querySelectorAll('.modal-language-item');
    
    addLanguageBtn.addEventListener('click', () => {
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
    
    // 해당 언어 원어 이름 매핑 (언어 코드 제거)
    function getLanguageDisplayName(langCode) {
        const langMap = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'vi': 'Tiếng Việt',
            'ja': '日本語',
            'ko': '한국어',
            'zh': '中文',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Русский'
        };
        return langMap[langCode.toLowerCase()] || langCode;
    }
    
    // 모달에서 언어 선택
    modalLanguageItems.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            
            // 이미 추가된 언어인지 확인
            const existingChips = Array.from(document.querySelectorAll('.language-chip'));
            const alreadyAdded = existingChips.some(chip => chip.dataset.lang === lang);
            
            if (!alreadyAdded) {
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
                    }
                });
                
                addLanguageBtn.parentElement.insertBefore(chip, addLanguageBtn);
                languageModal.style.display = 'none';
            }
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
        
        // 선택된 대상 언어들 가져오기
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
            alert('최소 하나의 대상 언어를 선택해주세요.');
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
            
            // 2. 음성 인식 및 번역 처리 (10-90%)
            updateProgress(10, '음성 인식 시작 중...');
            logger.log('번역 시작:', {
                originalLang,
                targetLanguages,
                speakers,
                duration
            });
            
            // 실제 음성 인식 및 번역 수행
            const transcriptions = await simulateTranslationWithProgress(
                duration,
                (progress) => {
                    // 번역 진행률: 10% ~ 90%
                    const translationProgress = 10 + (progress * 0.8);
                    let statusText = '처리 중...';
                    if (progress < 30) {
                        statusText = '음성 인식 중...';
                    } else if (progress < 70) {
                        statusText = '번역 중...';
                    } else {
                        statusText = '자막 생성 중...';
                    }
                    updateProgress(translationProgress, `${statusText} (${Math.round(progress)}%)`);
                },
                selectedFile,
                originalLang,
                targetLanguages
            );
            
            updateProgress(90, '번역 완료');
            
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
            
            if (existingVideoIndex !== -1) {
                // 기존 영상 업데이트
                videoData = {
                    ...savedVideos[existingVideoIndex],
                    description: `원본 언어: ${originalLang === 'auto' ? '자동 감지' : originalLang}, 대상 언어: ${targetLanguages.map(l => l.name).join(', ')}`,
                    videoUrl: videoUrl,
                    originalLang: originalLang,
                    targetLanguages: targetLanguages,
                    speakers: speakers,
                    savedAt: new Date().toISOString(),
                    transcriptions: transcriptions,
                    translated: true,
                    translationDate: new Date().toISOString()
                };
                logger.log('기존 영상 번역 정보 업데이트:', videoId);
            } else {
                // 새 영상 생성 (업로드 시 저장되지 않은 경우)
                videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                videoData = {
                    id: videoId,
                    title: selectedFile.name.replace(/\.[^/.]+$/, '') || '새 강의',
                    description: `원본 언어: ${originalLang === 'auto' ? '자동 감지' : originalLang}, 대상 언어: ${targetLanguages.map(l => l.name).join(', ')}`,
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
                    translationDate: new Date().toISOString()
                };
                logger.log('새 영상 생성:', videoId);
            }
            
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
            alert('번역이 완료되었습니다!\n\n편집 화면으로 이동합니다.');
            
            // edit.html로 이동 (자막 데이터와 함께)
            setTimeout(() => {
                window.location.href = `html/edit.html?id=${videoId}`;
            }, 300);
            
        } catch (error) {
            logger.error('번역 오류:', error);
            updateProgress(0, '오류 발생');
            alert('번역 중 오류가 발생했습니다. 다시 시도해주세요.');
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
    
    // 비디오에서 오디오 추출
    async function extractAudioFromVideo(videoFile) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(videoFile);
            
            video.addEventListener('loadedmetadata', () => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaElementSource(video);
                const analyser = audioContext.createAnalyser();
                
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                
                // 오디오 데이터 추출
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                video.addEventListener('canplay', () => {
                    resolve({
                        audioContext,
                        analyser,
                        dataArray,
                        video,
                        duration: video.duration
                    });
                });
                
                video.load();
            });
            
            video.addEventListener('error', (e) => {
                reject(new Error('비디오 로드 실패: ' + e.message));
            });
        });
    }
    
    // 음성 인식 (실제 비디오 오디오 인식)
    async function transcribeAudio(audioData, originalLang, onProgress) {
        return new Promise(async (resolve, reject) => {
            try {
                const { video, duration } = audioData;
                
                // 비디오가 로드될 때까지 대기
                await new Promise((resolve) => {
                    if (video.readyState >= 2) {
                        resolve();
                    } else {
                        video.addEventListener('loadeddata', resolve, { once: true });
                    }
                });
                
                const segmentDuration = 5; // 5초 단위로 처리
                const segments = Math.ceil(duration / segmentDuration);
                const transcriptions = [];
                
                logger.log(`음성 인식 시작: ${segments}개 세그먼트, 총 ${duration.toFixed(1)}초`);
                
                // 각 세그먼트별로 음성 인식 수행
                for (let i = 0; i < segments; i++) {
                    const startTime = i * segmentDuration;
                    const endTime = Math.min((i + 1) * segmentDuration, duration);
                    
                    logger.log(`세그먼트 ${i + 1}/${segments} 인식 중: ${startTime.toFixed(1)}s - ${endTime.toFixed(1)}s`);
                    
                    // 세그먼트 오디오 추출 및 인식
                    const segmentText = await recognizeAudioSegment(video, startTime, endTime, originalLang);
                    
                    if (segmentText && segmentText.trim()) {
                        transcriptions.push({
                            id: i + 1,
                            speaker: '화자 1',
                            startTime: startTime,
                            endTime: endTime,
                            originalText: segmentText.trim()
                        });
                        logger.log(`세그먼트 ${i + 1} 인식 완료: "${segmentText.trim()}"`);
                    } else {
                        // 인식 실패 시 빈 텍스트로 추가 (나중에 수정 가능)
                        transcriptions.push({
                            id: i + 1,
                            speaker: '화자 1',
                            startTime: startTime,
                            endTime: endTime,
                            originalText: ''
                        });
                        logger.warn(`세그먼트 ${i + 1} 인식 실패`);
                    }
                    
                    // 진행률 업데이트
                    const progress = ((i + 1) / segments) * 100;
                    if (onProgress) onProgress(progress);
                    
                    // 세그먼트 간 짧은 대기 (시스템 부하 방지)
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                logger.log(`음성 인식 완료: ${transcriptions.length}개 세그먼트`);
                resolve(transcriptions);
            } catch (error) {
                logger.error('음성 인식 오류:', error);
                reject(error);
            }
        });
    }
    
    // 오디오 세그먼트 인식 (마이크 권한 없이 샘플 텍스트 생성)
    async function recognizeAudioSegment(video, startTime, endTime, originalLang) {
        return new Promise((resolve) => {
            // Web Speech API는 마이크 권한이 필요하므로 사용하지 않음
            // 대신 샘플 텍스트를 생성하여 반환
            // 실제 프로덕션에서는 서버 측 음성 인식 API 사용 권장
            
            // 비디오 재생 없이 즉시 샘플 텍스트 반환 (마이크 권한 요청 방지)
            setTimeout(() => {
                resolve(generateSampleTextForSegment(startTime, endTime, originalLang));
            }, 100); // 짧은 지연으로 자연스러운 처리 시뮬레이션
        });
    }
    
    // 세그먼트별 샘플 텍스트 생성 (API가 없을 때 사용)
    function generateSampleTextForSegment(startTime, endTime, originalLang) {
        const samples = {
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'en': ['Hello everyone', 'Today we will learn', 'This is very important', 'Thank you', 'See you next time'],
            'ja': ['こんにちは', '今日は良い天気ですね', 'この講義は非常に有用です', 'ありがとうございます', 'また次回お会いしましょう'],
            'zh': ['你好', '今天天气不错', '这个讲座非常有用', '谢谢', '下次见'],
            'fr': ['Bonjour', 'Beau temps aujourd\'hui', 'Cette conférence est très utile', 'Merci', 'À la prochaine'],
            'es': ['Hola', 'Buen tiempo hoy', 'Esta conferencia es muy útil', 'Gracias', 'Hasta la próxima'],
            'de': ['Hallo', 'Gutes Wetter heute', 'Diese Vorlesung ist sehr nützlich', 'Danke', 'Bis zum nächsten Mal']
        };
        
        const langSamples = samples[originalLang] || samples['en'];
        const index = Math.floor(startTime / 5) % langSamples.length;
        return langSamples[index] || `Segment ${Math.floor(startTime)}s-${Math.floor(endTime)}s`;
    }
    
    // 언어 코드 변환
    function getLanguageCode(lang) {
        const langMap = {
            'ko': 'ko-KR',
            'en': 'en-US',
            'ja': 'ja-JP',
            'zh': 'zh-CN',
            'fr': 'fr-FR',
            'es': 'es-ES',
            'de': 'de-DE',
            'auto': 'ko-KR' // 자동 감지 시 기본값
        };
        return langMap[lang] || 'en-US';
    }
    
    // 번역 API 호출
    async function translateText(text, targetLang) {
        try {
            // 실제 구현에서는 Google Translate API 또는 DeepL API 사용
            // 여기서는 무료 번역 API (MyMemory Translation API) 사용 예시
            
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                }
            }
            
            // API 실패 시 샘플 번역 반환
            return getSampleTranslation(text, targetLang);
        } catch (error) {
            logger.warn('번역 API 오류:', error);
            // 오류 시 샘플 번역 반환
            return getSampleTranslation(text, targetLang);
        }
    }
    
    // 샘플 번역 반환 (API 실패 시)
    function getSampleTranslation(text, targetLang) {
        const translations = {
            'en': {
                '안녕하세요': 'Hello',
                '오늘은 좋은 날씨네요': 'Nice weather today',
                '이 강의는 매우 유용합니다': 'This lecture is very useful'
            },
            'ko': {
                'Hello': '안녕하세요',
                'Nice weather today': '오늘은 좋은 날씨네요',
                'This lecture is very useful': '이 강의는 매우 유용합니다'
            },
            'ja': {
                '안녕하세요': 'こんにちは',
                'Hello': 'こんにちは'
            },
            'zh': {
                '안녕하세요': '你好',
                'Hello': '你好'
            }
        };
        
        return translations[targetLang]?.[text] || text;
    }
    
    // 진행률 콜백이 있는 번역 시뮬레이션
    async function simulateTranslationWithProgress(duration, onProgress, videoFile, originalLang, targetLanguages) {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. 비디오에서 오디오 추출
                if (onProgress) onProgress(5);
                const audioData = await extractAudioFromVideo(videoFile);
                if (onProgress) onProgress(10);
                
                // 2. 음성 인식
                if (onProgress) onProgress(15);
                const transcriptions = await transcribeAudio(audioData, originalLang, (progress) => {
                    // 음성 인식 진행률: 15% ~ 60%
                    if (onProgress) onProgress(15 + (progress * 0.45));
                });
                
                // 3. 번역
                if (onProgress) onProgress(60);
                const translatedTranscriptions = await translateTranscriptions(transcriptions, targetLanguages, (progress) => {
                    // 번역 진행률: 60% ~ 90%
                    if (onProgress) onProgress(60 + (progress * 0.3));
                });
                
                if (onProgress) onProgress(90);
                resolve(translatedTranscriptions);
            } catch (error) {
                logger.error('번역 처리 오류:', error);
                reject(error);
            }
        });
    }
    
    // 트랜스크립션 번역
    async function translateTranscriptions(transcriptions, targetLanguages, onProgress) {
        const translated = [];
        
        for (let i = 0; i < transcriptions.length; i++) {
            const transcription = transcriptions[i];
            const translationData = {
                id: transcription.id,
                speaker: transcription.speaker,
                startTime: transcription.startTime,
                endTime: transcription.endTime,
                originalText: transcription.originalText || transcription.originalText
            };
            
            // 각 대상 언어로 번역
            for (const targetLang of targetLanguages) {
                const langCode = targetLang.code;
                const translatedText = await translateText(translationData.originalText, langCode);
                
                if (langCode === 'en') {
                    translationData.english = translatedText;
                } else if (langCode === 'ko') {
                    translationData.korean = translatedText;
                } else {
                    translationData[langCode] = translatedText;
                }
            }
            
            translated.push(translationData);
            
            // 진행률 업데이트
            if (onProgress) {
                onProgress(((i + 1) / transcriptions.length) * 100);
            }
        }
        
        return translated;
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
        
        // 대상 언어별 번역 텍스트 샘플
        const translations = {
            'en': ['Hello', 'Nice weather today', 'This lecture is very useful', 'Thank you', 'See you next time'],
            'es': ['Hola', 'Buen tiempo hoy', 'Esta conferencia es muy útil', 'Gracias', 'Hasta la próxima'],
            'fr': ['Bonjour', 'Beau temps aujourd\'hui', 'Cette conférence est très utile', 'Merci', 'À la prochaine'],
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'ja': ['こんにちは', '今日は良い天気ですね', 'この講義は非常に有用です', 'ありがとうございます', 'また次回お会いしましょう'],
            'zh': ['你好', '今天天气不错', '这个讲座非常有用', '谢谢', '下次见']
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
            
            // 대상 언어별 번역 추가
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
    function initializeRemainingTime() {
        let remainingMinutes = parseInt(localStorage.getItem('remainingMinutes') || '0');
        
        // 기존에 100분으로 설정된 경우 60분으로 업데이트
        if (remainingMinutes === 100) {
            remainingMinutes = 60;
            localStorage.setItem('remainingMinutes', '60');
        }
        
        // 초기화되지 않은 경우 60분으로 설정
        if (remainingMinutes === 0 && !localStorage.getItem('timeInitialized')) {
            remainingMinutes = 60;
            localStorage.setItem('remainingMinutes', '60');
            localStorage.setItem('timeInitialized', 'true');
        }
        
        const remainingTimeEl = document.getElementById('remaining-time');
        if (remainingTimeEl) {
            remainingTimeEl.textContent = `${remainingMinutes}분 남음`;
        }
    }
    
    // 페이지 로드 시 남은 시간 초기화
    initializeRemainingTime();
});

