        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        // 성능 최적화: 디바운싱 함수
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

        // 성능 최적화: 쓰로틀링 함수
        function throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // 성능 최적화: requestAnimationFrame 기반 쓰로틀링
        function rafThrottle(func) {
            let rafId = null;
            return function(...args) {
                if (rafId === null) {
                    rafId = requestAnimationFrame(() => {
                        func.apply(this, args);
                        rafId = null;
                    });
                }
            };
        }

        // URL에서 비디오 ID 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('id');

        let currentVideo = null;
        let transcriptions = [];
        let currentLang = 'ko';
        let isPlaying = false;
        let currentTime = 0;
        let videoDuration = 59; // 초 단위
        let videoPlayer = null;
        let currentTab = 'original'; // 'original' or 'translation'
        let isMuted = false;
        let playbackRate = 1.0;
        let showSubtitles = true;
        let availableLanguages = []; // 번역 설정에서 가져온 언어 목록
        let originalLang = 'ko'; // 원본 언어
        let targetLanguages = []; // 대상 언어들
        let blobUrls = []; // Blob URL 추적용 배열

        // DOM 요소 캐싱 (최적화)
        const DOMCache = {
            get videoPlayer() { return document.getElementById('video-player'); },
            get dropZone() { return document.getElementById('video-drop-zone'); },
            get videoPlayerWrapper() { return document.getElementById('video-player-wrapper'); },
            get placeholder() { return document.getElementById('video-placeholder'); },
            get transcriptionList() { return document.getElementById('transcription-list'); },
            get languageTabs() { return document.querySelector('.language-tabs'); },
            get playBtn() { return document.getElementById('play-btn'); },
            get progressBar() { return document.getElementById('progress-bar'); },
            get progressFill() { return document.getElementById('progress-fill'); },
            get timeDisplay() { return document.getElementById('time-display'); },
            get subtitleText() { return document.getElementById('subtitle-text'); },
            get applyBtn() { return document.querySelector('.apply-btn-inline'); },
            get videoTitleText() { return document.getElementById('video-title-text'); }
        };

        // 비디오 플레이어 표시/숨김 통합 함수 (최적화)
        function toggleVideoPlayerElements(showPlayer) {
            const { dropZone, videoPlayerWrapper, placeholder, videoPlayer } = DOMCache;
            
            if (showPlayer) {
                // 드롭존 확실히 숨기기
                if (dropZone) {
                    dropZone.style.display = 'none';
                    dropZone.style.visibility = 'hidden';
                    dropZone.style.opacity = '0';
                }
                // 플레이어 표시
                if (videoPlayerWrapper) {
                    videoPlayerWrapper.style.display = 'flex';
                    videoPlayerWrapper.style.visibility = 'visible';
                    videoPlayerWrapper.style.opacity = '1';
                    // 비디오 섹션이 보이도록 보장
                    const videoSection = document.querySelector('.video-section');
                    if (videoSection) {
                        videoSection.style.display = 'flex';
                        videoSection.style.visibility = 'visible';
                    }
                }
                if (videoPlayer) {
                    videoPlayer.style.display = 'block';
                    videoPlayer.style.visibility = 'visible';
                    // 비디오가 로드되도록 강제
                    if (!videoPlayer.src) {
                        logger.warn('비디오 src가 없습니다');
                    }
                }
                if (placeholder) {
                    placeholder.style.display = 'none';
                    placeholder.style.visibility = 'hidden';
                }
                logger.log('비디오 플레이어 표시됨, 드롭존 숨김');
            } else {
                if (placeholder) placeholder.style.display = 'flex';
                if (dropZone) dropZone.style.display = 'none';
                if (videoPlayerWrapper) videoPlayerWrapper.style.display = 'none';
                if (videoPlayer) videoPlayer.style.display = 'none';
                logger.log('비디오 플레이어 숨김');
            }
        }

        // 드롭존 표시 함수
        function showDropZone() {
            const { dropZone, videoPlayerWrapper, placeholder } = DOMCache;
            if (placeholder) placeholder.style.display = 'none';
            if (dropZone) dropZone.style.display = 'flex';
            if (videoPlayerWrapper) videoPlayerWrapper.style.display = 'none';
        }

        // 데이터 로드 (최적화 및 개선)
        async function loadVideoData() {
            // videoId 검증
            if (!videoId) {
                logger.error('비디오 ID가 없습니다.');
                alert('영상을 찾을 수 없습니다.\n마이페이지로 이동합니다.');
                window.location.href = 'storage.html';
                return;
            }
            
            // 로딩 상태 표시
            showLoadingState(true);
            
            try {
                // localStorage에서 비디오 데이터 로드
                const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                currentVideo = savedVideos.find(v => v.id === videoId);
                
                if (!currentVideo) {
                    logger.error('비디오를 찾을 수 없습니다:', videoId);
                    alert('강의를 찾을 수 없습니다.\n마이페이지로 이동합니다.');
                    window.location.href = 'storage.html';
                    return;
                }
                
                logger.log('비디오 데이터 로드 완료:', currentVideo.title);

                // 제목 표시
                if (DOMCache.videoTitleText) {
                    DOMCache.videoTitleText.textContent = currentVideo.title || '강의 제목';
                }

                // 번역 설정 로드 (originalLang, targetLanguages)
                originalLang = currentVideo.originalLang || 'ko';
                targetLanguages = currentVideo.targetLanguages || [{ code: 'en', name: '영어' }];
                
                // 사용 가능한 언어 목록 생성 (원본 언어 + 대상 언어들)
                availableLanguages = [];
                
                // 원본 언어 추가 (auto인 경우는 제외)
                if (originalLang && originalLang !== 'auto') {
                    const originalLangInfo = getLanguageInfo(originalLang);
                    availableLanguages.push({
                        code: originalLang,
                        name: originalLangInfo.name,
                        flag: originalLangInfo.flag,
                        isOriginal: true
                    });
                }
                // auto인 경우는 탭에 표시하지 않음
                
                // 대상 언어들 추가
                targetLanguages.forEach(targetLang => {
                    const langInfo = getLanguageInfo(targetLang.code || targetLang);
                    // 원본 언어와 중복되지 않는 경우만 추가
                    if (langInfo.code !== originalLang) {
                        availableLanguages.push({
                            code: langInfo.code,
                            name: targetLang.name || langInfo.name,
                            flag: langInfo.flag,
                            isOriginal: false
                        });
                    }
                });
                
                // 기본 언어가 없으면 한국어와 영어 추가
                if (availableLanguages.length === 0) {
                    availableLanguages = [
                        { code: 'ko', name: '한국어', flag: '🇰🇷', isOriginal: true },
                        { code: 'en', name: '영어', flag: '🇺🇸', isOriginal: false }
                    ];
                }
                
                // 첫 번째 언어를 기본 선택 (auto 제외)
                const firstNonAutoLang = availableLanguages.find(lang => lang.code !== 'auto');
                currentLang = firstNonAutoLang ? firstNonAutoLang.code : (availableLanguages[0]?.code || 'ko');
                
                logger.log('번역 설정 로드:', {
                    originalLang,
                    targetLanguages,
                    availableLanguages
                });
                
                // 언어 탭 동적 생성
                renderLanguageTabs();
                
                // 트랜스크립션 데이터 로드
                if (currentVideo.transcriptions && Array.isArray(currentVideo.transcriptions) && currentVideo.transcriptions.length > 0) {
                    transcriptions = currentVideo.transcriptions;
                    logger.log('저장된 트랜스크립션 로드:', transcriptions.length, '개');
                } else {
                    // 트랜스크립션이 없으면 샘플 생성
                    transcriptions = generateSampleTranscriptions();
                    logger.log('샘플 트랜스크립션 생성:', transcriptions.length, '개');
                }
                
                // 트랜스크립션 렌더링
                renderTranscriptions();
                
                // 비디오 플레이어 초기화
                await initializeVideoPlayer();
                
                // 로딩 상태 숨김
                showLoadingState(false);
                
            } catch (error) {
                logger.error('데이터 로드 오류:', error);
                showLoadingState(false);
                alert('영상을 불러오는 중 오류가 발생했습니다.\n다시 시도해주세요.');
            }
        }
        
        // 로딩 상태 표시 (최적화)
        function showLoadingState(show) {
            const videoContainer = document.querySelector('.video-container');
            
            if (show) {
                // 로딩 인디케이터 표시
                if (videoContainer && !document.getElementById('loading-indicator')) {
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.id = 'loading-indicator';
                    loadingIndicator.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white;">
                            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <div>영상을 불러오는 중...</div>
                        </div>
                    `;
                    loadingIndicator.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 10;';
                    videoContainer.appendChild(loadingIndicator);
                }
            } else {
                // 로딩 인디케이터 제거
                const loadingIndicator = document.getElementById('loading-indicator');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
            }
        }
        
        // IndexedDB에서 파일 로드 (최적화 및 재시도 로직)
        function loadFileFromIndexedDB(videoId, retryCount = 0) {
            return new Promise((resolve, reject) => {
                const maxRetries = 3;
                
                const request = indexedDB.open('AX2_Videos', 1);
                
                request.onerror = () => {
                    logger.error('IndexedDB 열기 실패:', request.error);
                    if (retryCount < maxRetries) {
                        logger.log(`IndexedDB 재시도 ${retryCount + 1}/${maxRetries}`);
                        setTimeout(() => {
                            loadFileFromIndexedDB(videoId, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000 * (retryCount + 1)); // 지수 백오프
                    } else {
                        reject(new Error('IndexedDB에 접근할 수 없습니다.'));
                    }
                };
                
                request.onsuccess = () => {
                    const db = request.result;
                    const transaction = db.transaction(['videos'], 'readonly');
                    const store = transaction.objectStore('videos');
                    const getRequest = store.get(videoId);
                    
                    getRequest.onsuccess = () => {
                        if (getRequest.result && getRequest.result.data) {
                            try {
                                const blob = new Blob([getRequest.result.data], { 
                                    type: getRequest.result.type || 'video/mp4' 
                                });
                                const url = URL.createObjectURL(blob);
                                logger.log('IndexedDB에서 파일 로드 성공:', videoId);
                                resolve(url);
                            } catch (error) {
                                logger.error('Blob 생성 오류:', error);
                                reject(new Error('파일을 생성할 수 없습니다.'));
                            }
                        } else {
                            console.warn('IndexedDB에 파일이 없습니다:', videoId);
                            reject(new Error('파일을 찾을 수 없습니다.'));
                        }
                    };
                    
                    getRequest.onerror = () => {
                        logger.error('IndexedDB 조회 오류:', getRequest.error);
                        if (retryCount < maxRetries) {
                            setTimeout(() => {
                                loadFileFromIndexedDB(videoId, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000 * (retryCount + 1));
                        } else {
                            reject(getRequest.error);
                        }
                    };
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('videos')) {
                        db.createObjectStore('videos', { keyPath: 'id' });
                    }
                };
            });
        }
        
        // 비디오 플레이어 초기화 (최적화 및 강화)
        async function initializeVideoPlayer() {
            videoPlayer = DOMCache.videoPlayer;
            
            if (!videoPlayer) {
                logger.error('비디오 플레이어 요소를 찾을 수 없습니다.');
                return;
            }
            
            if (!currentVideo) {
                logger.error('비디오 데이터가 없습니다.');
                showDropZone();
                return;
            }
            
            logger.log('비디오 플레이어 초기화 시작:', {
                hasVideoUrl: !!currentVideo.videoUrl,
                hasFile: !!currentVideo.file,
                hasId: !!currentVideo.id,
                videoId: currentVideo.id
            });
            
            // 비디오 URL 설정
            let videoSrc = null;
            let videoLoaded = false;
            
            // 1순위: IndexedDB에서 파일 로드 시도
            if (currentVideo.id) {
                logger.log('IndexedDB에서 비디오 로드 시도:', currentVideo.id);
                try {
                    videoSrc = await loadFileFromIndexedDB(currentVideo.id);
                    if (videoSrc) {
                        currentVideo.videoUrl = videoSrc;
                        videoPlayer.src = videoSrc;
                        videoPlayer.load();
                        videoLoaded = true;
                        logger.log('IndexedDB에서 비디오 로드 성공, src 설정 완료');
                        
                        // localStorage 업데이트
                        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                        const index = savedVideos.findIndex(v => v.id === currentVideo.id);
                        if (index !== -1) {
                            savedVideos[index].videoUrl = videoSrc;
                            localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
                        }
                        
                        // 비디오 플레이어 표시
                        toggleVideoPlayerElements(true);
                        
                        // 비디오 로드 대기
                        await new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => {
                                reject(new Error('비디오 로드 타임아웃'));
                            }, 10000);
                            
                            const checkLoaded = () => {
                                if (videoPlayer.readyState >= 2) {
                                    clearTimeout(timeout);
                                    resolve();
                                } else if (videoPlayer.error) {
                                    clearTimeout(timeout);
                                    reject(videoPlayer.error);
                                } else {
                                    setTimeout(checkLoaded, 100);
                                }
                            };
                            checkLoaded();
                        }).catch(err => {
                            logger.warn('비디오 로드 대기 중 오류:', err);
                        });
                    }
                } catch (err) {
                    logger.warn('IndexedDB에서 파일 로드 실패, 다른 방법 시도:', err);
                }
            }
            
            // 2순위: videoUrl이 있고 유효한 경우
            if (!videoLoaded && currentVideo.videoUrl) {
                try {
                    videoSrc = currentVideo.videoUrl;
                    videoPlayer.src = videoSrc;
                    videoPlayer.load();
                    videoLoaded = true;
                    logger.log('videoUrl에서 비디오 로드 성공');
                    toggleVideoPlayerElements(true);
                } catch (e) {
                    logger.error('비디오 URL 설정 오류:', e);
                }
            }
            
            // 3순위: File 객체인 경우
            if (!videoLoaded && currentVideo.file) {
                try {
                    const url = URL.createObjectURL(currentVideo.file);
                    blobUrls.push(url);
                    videoSrc = url;
                    videoPlayer.src = url;
                    videoLoaded = true;
                    logger.log('File 객체에서 비디오 로드 성공');
                    toggleVideoPlayerElements(true);
                } catch (err) {
                    logger.error('File 객체 로드 실패:', err);
                }
            }
            
            // 모든 시도 실패 시
            if (!videoLoaded || !videoSrc) {
                logger.error('비디오를 로드할 수 없습니다.');
                showDropZone();
                return;
            }
            
            // 비디오 이벤트 리스너 설정 (최적화: 쓰로틀링 적용)
            const throttledTimeUpdate = rafThrottle(() => {
                currentTime = videoPlayer.currentTime;
                updateProgress();
                updateSubtitle();
            });
            
            videoPlayer.addEventListener('timeupdate', throttledTimeUpdate);
            
            videoPlayer.addEventListener('ended', () => {
                isPlaying = false;
                if (DOMCache.playBtn) DOMCache.playBtn.textContent = '▶';
            });
            
            // 비디오 로드 성공 이벤트
            const handleVideoLoaded = () => {
                if (videoPlayer.duration) {
                    videoDuration = videoPlayer.duration;
                    updateProgress();
                }
                toggleVideoPlayerElements(true);
                // 커스텀 컨트롤 초기화
                setTimeout(() => {
                    initializeCustomControls();
                }, 100);
                logger.log('비디오 로드 완료, 플레이어 표시');
            };
            
            videoPlayer.addEventListener('loadedmetadata', handleVideoLoaded, { once: true });
            videoPlayer.addEventListener('canplay', handleVideoLoaded, { once: true });
            videoPlayer.addEventListener('loadeddata', () => {
                toggleVideoPlayerElements(true);
                setTimeout(() => {
                    initializeCustomControls();
                }, 100);
                logger.log('비디오 데이터 로드 완료');
            }, { once: true });
            
            videoPlayer.addEventListener('error', async (e) => {
                logger.error('비디오 로드 오류:', e);
                logger.error('비디오 오류 상세:', {
                    error: videoPlayer.error,
                    networkState: videoPlayer.networkState,
                    readyState: videoPlayer.readyState,
                    src: videoPlayer.src
                });
                
                // IndexedDB에서 파일 재로드 시도
                if (currentVideo && currentVideo.id && !videoLoaded) {
                    try {
                        logger.log('IndexedDB에서 비디오 재로드 시도');
                        const newUrl = await loadFileFromIndexedDB(currentVideo.id);
                        if (newUrl) {
                            currentVideo.videoUrl = newUrl;
                            videoPlayer.src = newUrl;
                            videoPlayer.load();
                            videoLoaded = true;
                            logger.log('IndexedDB에서 비디오 재로드 성공');
                            toggleVideoPlayerElements(true);
                            return;
                        }
                    } catch (err) {
                        logger.error('IndexedDB에서 파일 재로드 실패:', err);
                    }
                }
                
                // 모든 시도 실패 시 placeholder 표시
                toggleVideoPlayerElements(false);
                if (DOMCache.placeholder) {
                    DOMCache.placeholder.style.display = 'flex';
                }
            });
            
            // 비디오가 이미 로드되어 있는 경우 즉시 표시
            if (videoPlayer.readyState >= 2) {
                handleVideoLoaded();
            }
        }

        // 샘플 트랜스크립션 생성
        function generateSampleTranscriptions() {
            return [
                {
                    id: 1,
                    speaker: '화자 1',
                    startTime: 0,
                    endTime: 3.41,
                    korean: '이 과자의 정체가 뭔지 아시는 분이 계시다면 제발 한 번만 도와주세요.',
                    english: 'If anyone knows what this snack is, please, just help me out, for once.'
                },
                {
                    id: 2,
                    speaker: '화자 1',
                    startTime: 3,
                    endTime: 9,
                    korean: '제가 저번에 두바이 초콜릿 맛을 과자를 하나를 얻어먹었는데 이게 이렇게 맛있을 줄 모르고 아무 데도 없이 껍데기를 버린 거예요.',
                    english: 'I tried a Dubai chocolate-flavored snack the other day, but I had no idea it would be this good, so I threw away the wrapper without thinking.'
                },
                {
                    id: 3,
                    speaker: '화자 1',
                    startTime: 9,
                    endTime: 15,
                    korean: '제가 기억하는 그 과자 맛을 똑같이 재현을 해볼게요. 먼저 이렇게 둥글고 짤막한 웨이퍼 재질의 과자였거든요.',
                    english: "I'll try to recreate the snack exactly as I remember. First, it was a round, short, wafer-textured snack."
                },
                {
                    id: 4,
                    speaker: '화자 1',
                    startTime: 15,
                    endTime: 19,
                    korean: '지금 여기에는 커피 크림이 채워져 있는데 그 과자에는 피스타치오 맛 크림이 채워져 있었거든요.',
                    english: 'Now, this one is filled with coffee cream, but that snack had a pistachio cream filling.'
                },
                {
                    id: 5,
                    speaker: '화자 1',
                    startTime: 19,
                    endTime: 23.10,
                    korean: '그래서 오늘은 피스타치오 맛 크림을 만들어서 이 과자에 채워넣어 볼게요.',
                    english: 'So today, I\'ll make a pistachio cream and fill this snack with it.'
                }
            ];
        }

        // 언어 정보 가져오기 (최적화: 번역 설정 반영)
        function getLanguageInfo(langCode) {
            if (!langCode) {
                return { name: '알 수 없음', flag: '🌐', code: 'unknown' };
            }
            
            const langMap = {
                'ko': { name: '한국어', flag: '🇰🇷', code: 'ko' },
                'en': { name: '영어', flag: '🇺🇸', code: 'en' },
                'es': { name: '스페인어', flag: '🇪🇸', code: 'es' },
                'fr': { name: '프랑스어', flag: '🇫🇷', code: 'fr' },
                'de': { name: '독일어', flag: '🇩🇪', code: 'de' },
                'ja': { name: '일본어', flag: '🇯🇵', code: 'ja' },
                'zh': { name: '중국어', flag: '🇨🇳', code: 'zh' },
                'it': { name: '이탈리아어', flag: '🇮🇹', code: 'it' },
                'pt': { name: '포르투갈어', flag: '🇵🇹', code: 'pt' },
                'ru': { name: '러시아어', flag: '🇷🇺', code: 'ru' },
                'auto': { name: '자동 감지', flag: '🌐', code: 'auto' }
            };
            
            return langMap[langCode.toLowerCase()] || { name: langCode, flag: '🌐', code: langCode };
        }
        
        // 언어 탭 렌더링 (최적화)
        function renderLanguageTabs() {
            const languageTabsContainer = DOMCache.languageTabs;
            if (!languageTabsContainer) return;
            
            // 번역 설정에서 가져온 언어들로 탭 동적 생성 (HTML의 하드코딩된 탭 무시)
            if (availableLanguages.length === 0) {
                logger.warn('사용 가능한 언어가 없습니다. 기본 언어를 사용합니다.');
                // 기본 언어 설정
                availableLanguages = [
                    { code: 'ko', name: '한국어', flag: '🇰🇷', isOriginal: true },
                    { code: 'en', name: '영어', flag: '🇺🇸', isOriginal: false }
                ];
            }
            
            // 언어 탭 동적 생성 (번역 설정에 따라, 'auto' 제외)
            languageTabsContainer.innerHTML = availableLanguages
                .filter(lang => lang.code !== 'auto') // 'auto' 언어 탭 제거
                .map((lang, index) => {
                    const isActive = index === 0 || lang.code === currentLang;
                    
                    return `
                        <div class="lang-tab ${isActive ? 'active' : ''}" data-lang="${lang.code}">
                            <span>${lang.name}</span>
                        </div>
                    `;
                }).join('');
            
            // 초기 언어 설정 (auto 제외)
            const filteredLanguages = availableLanguages.filter(lang => lang.code !== 'auto');
            if (filteredLanguages.length > 0) {
                currentLang = filteredLanguages[0].code;
            }
            
            // 언어 탭 이벤트 설정
            setupLanguageTabEvents();
            
            logger.log('언어 탭 렌더링 완료:', availableLanguages.map(l => l.name).join(', '));
        }
        
        // 언어 탭 이벤트 설정
        function setupLanguageTabEvents() {
            document.querySelectorAll('.lang-tab').forEach(tab => {
                // 기존 이벤트 리스너 제거를 위해 클론
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                
                newTab.addEventListener('click', function() {
                    document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentLang = this.dataset.lang;
                    
                    // 자막 언어 업데이트
                    updateSubtitle();
                    
                    // 트랜스크립션 다시 렌더링 (선택된 언어만 표시)
                    renderTranscriptions();
                    
                    // 텍스트 입력 이벤트 다시 설정
                    setupTextInputEvents();
                });
            });
        }
        
        // 페이지 로드 시 언어 탭 이벤트 초기화
        document.addEventListener('DOMContentLoaded', function() {
            // HTML에 이미 있는 언어 탭에 이벤트 설정
            setTimeout(() => {
                setupLanguageTabEvents();
            }, 100);
        });
        
        // 트랜스크립션 렌더링 (탭 기반 - 선택된 언어만 표시) (최적화)
        function renderTranscriptions() {
            const list = DOMCache.transcriptionList;
            if (!list) return;
            
            // 현재 선택된 언어의 정보 가져오기
            const currentLangInfo = availableLanguages.find(lang => lang.code === currentLang) || availableLanguages[0];
            
            list.innerHTML = transcriptions.map(segment => {
                const duration = (segment.endTime - segment.startTime).toFixed(2);
                const startTime = formatTime(segment.startTime);
                const endTime = formatTime(segment.endTime);
                
                // 현재 선택된 언어의 텍스트만 가져오기
                const langCode = currentLangInfo.code;
                const text = segment[langCode] || segment[getLanguageFieldName(langCode)] || '';
                const placeholder = currentLangInfo.isOriginal ? `${currentLangInfo.name} 자막을 입력하세요` : `${currentLangInfo.name} subtitle`;
                
                // 원본 언어 텍스트 가져오기 (자동 감지)
                // originalLang이 'auto'인 경우, 실제로 감지된 언어나 첫 번째 사용 가능한 언어 사용
                let actualOriginalLang = originalLang;
                let originalText = '';
                
                if (originalLang === 'auto') {
                    // auto인 경우, 세그먼트에 저장된 원본 언어 필드 찾기
                    // 일반적으로 'korean', 'english' 등 필드명이나 언어 코드로 저장됨
                    // 먼저 세그먼트에 원본 언어 정보가 있는지 확인
                    if (segment.originalLang && segment.originalLang !== 'auto') {
                        actualOriginalLang = segment.originalLang;
                    } else {
                        // 세그먼트에 저장된 텍스트 필드 중 첫 번째로 찾기
                        const possibleFields = ['korean', 'english', 'ko', 'en'];
                        for (const field of possibleFields) {
                            if (segment[field]) {
                                originalText = segment[field];
                                actualOriginalLang = field === 'korean' ? 'ko' : (field === 'english' ? 'en' : field);
                                break;
                            }
                        }
                    }
                }
                
                // 원본 텍스트가 아직 없으면 언어 코드로 찾기
                if (!originalText) {
                    originalText = segment[actualOriginalLang] || segment[getLanguageFieldName(actualOriginalLang)] || '';
                }
                const outputText = text;
                const outputCharCount = (outputText || '').length;
                
                // 언어 정보 가져오기
                const langInfo = getLanguageInfo(langCode);
                
                return `
                    <div class="transcription-item" data-segment-id="${segment.id}">
                        <div class="segment-header">
                            <div class="speaker-icon">${segment.speaker ? segment.speaker.charAt(segment.speaker.length - 1) : '1'}</div>
                            <span class="speaker-name">${segment.speaker || '화자 1'}</span>
                            <div class="timestamp-controls">
                                <span class="timestamp">${startTime} - ${endTime} ${duration}sec</span>
                                <button class="edit-time-btn" onclick="editSegmentTime(${segment.id})" title="시간 편집">
                                    <i class="fas fa-clock"></i>
                                </button>
                                <button class="delete-segment-btn" onclick="deleteSegment(${segment.id})" title="세그먼트 삭제">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <span class="char-count-badge">${outputCharCount}</span>
                            </div>
                        </div>
                        <div class="text-content">
                            <div class="original-text">
                                <div class="auto-detect-label">
                                    <i class="fas fa-globe"></i>
                                    <span>자동 감지</span>
                                </div>
                                <textarea class="text-input" data-lang="${originalLang}" data-segment-id="${segment.id}" placeholder="자동 감지 자막을 입력하세요">${originalText}</textarea>
                            </div>
                            <div class="arrow-icon">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                            <div class="translation-text">
                                <div class="output-label">
                                    <span>${currentLangInfo.name || langInfo.name}</span>
                                </div>
                                <textarea class="text-input" data-lang="${langCode}" data-segment-id="${segment.id}" placeholder="${placeholder}">${outputText}</textarea>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // 텍스트 입력 이벤트 설정
            setupTextInputEvents();
        }
        
        // 텍스트 입력 이벤트 설정 함수 (재사용 가능)
        function setupTextInputEvents() {
            // 기존 이벤트 리스너 제거를 위해 새로 생성
            document.querySelectorAll('.text-input').forEach(input => {
                // 기존 이벤트 리스너 제거를 위해 클론
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                
                // 최적화: 디바운싱된 입력 핸들러
                const debouncedInput = debounce(function() {
                    const segmentId = parseInt(this.dataset.segmentId);
                    const lang = this.dataset.lang;
                    const segment = transcriptions.find(s => s.id === segmentId);
                    
                    if (segment) {
                        // 언어 코드로 직접 저장
                        segment[lang] = this.value;
                        
                        // 하위 호환성을 위해 필드명으로도 저장
                        const fieldName = getLanguageFieldName(lang);
                        if (fieldName !== lang) {
                            segment[fieldName] = this.value;
                        }
                        
                        // 문자 수 업데이트
                        const charCount = document.querySelector(`.char-count[data-lang="${lang}"][data-segment-id="${segmentId}"]`);
                        if (charCount) {
                            charCount.textContent = this.value.length;
                        }
                        
                        // 실시간 자막 미리보기 업데이트
                        if (videoPlayer && !videoPlayer.paused) {
                            updateSubtitle();
                        }
                        
                        // 변경사항 표시
                        markAsChanged(segmentId);
                    }
                }, 300);
                
                // 즉시 업데이트가 필요한 경우 (문자 수 등)
                newInput.addEventListener('input', function() {
                    const segmentId = parseInt(this.dataset.segmentId);
                    const lang = this.dataset.lang;
                    
                    // 문자 수는 즉시 업데이트
                    const charCount = document.querySelector(`.char-count[data-lang="${lang}"][data-segment-id="${segmentId}"]`);
                    if (charCount) {
                        charCount.textContent = this.value.length;
                    }
                    
                    // 나머지는 디바운싱
                    debouncedInput.call(this);
                });
                
                // 포커스 시 해당 세그먼트 하이라이트
                newInput.addEventListener('focus', function() {
                    const segmentId = parseInt(this.dataset.segmentId);
                    const segmentItem = document.querySelector(`.transcription-item[data-segment-id="${segmentId}"]`);
                    if (segmentItem) {
                        segmentItem.classList.add('editing');
                        segmentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                
                newInput.addEventListener('blur', function() {
                    const segmentId = parseInt(this.dataset.segmentId);
                    const segmentItem = document.querySelector(`.transcription-item[data-segment-id="${segmentId}"]`);
                    if (segmentItem) {
                        segmentItem.classList.remove('editing');
                    }
                });
                
                // 키보드 단축키 (Ctrl+S: 저장)
                newInput.addEventListener('keydown', function(e) {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.key === 's') {
                            e.preventDefault();
                            applyChanges();
                        }
                    }
                });
            });
            
            // 자막 클릭 시 해당 시간으로 이동 (최적화: 이벤트 위임)
            const transcriptionList = DOMCache.transcriptionList;
            if (transcriptionList) {
                transcriptionList.addEventListener('click', function(e) {
                    if (e.target.classList.contains('timestamp') || e.target.closest('.timestamp')) {
                        const timestamp = e.target.classList.contains('timestamp') ? e.target : e.target.closest('.timestamp');
                        const segmentItem = timestamp.closest('.transcription-item');
                        if (segmentItem) {
                            const segmentId = parseInt(segmentItem.dataset.segmentId);
                            const segment = transcriptions.find(s => s.id === segmentId);
                            if (segment) {
                                seekToTime(segment.startTime);
                            }
                        }
                    }
                });
            }
        }
        
        // 해당 시간으로 이동 (최적화)
        function seekToTime(time) {
            if (videoPlayer) {
                videoPlayer.currentTime = time;
                updateProgress();
                updateSubtitle();
                
                // 재생 중이 아니면 재생
                if (videoPlayer.paused) {
                    videoPlayer.play();
                    isPlaying = true;
                    if (DOMCache.playBtn) DOMCache.playBtn.textContent = '⏸';
                }
            }
        }
        
        // 세그먼트 시간 편집
        function editSegmentTime(segmentId) {
            const segment = transcriptions.find(s => s.id === segmentId);
            if (!segment) return;
            
            const newStartTime = prompt('시작 시간을 입력하세요 (초):', segment.startTime);
            if (newStartTime !== null && !isNaN(newStartTime)) {
                segment.startTime = parseFloat(newStartTime);
            }
            
            const newEndTime = prompt('종료 시간을 입력하세요 (초):', segment.endTime);
            if (newEndTime !== null && !isNaN(newEndTime)) {
                segment.endTime = parseFloat(newEndTime);
            }
            
            renderTranscriptions();
        }
        
        // 세그먼트 삭제
        function deleteSegment(segmentId) {
            if (!confirm('이 자막 세그먼트를 삭제하시겠습니까?')) return;
            
            const index = transcriptions.findIndex(s => s.id === segmentId);
            if (index !== -1) {
                transcriptions.splice(index, 1);
                renderTranscriptions();
                markAsChanged();
            }
        }
        
        // 변경사항 표시 (최적화)
        function markAsChanged(segmentId) {
            if (segmentId) {
                const segmentItem = document.querySelector(`.transcription-item[data-segment-id="${segmentId}"]`);
                if (segmentItem) {
                    segmentItem.classList.add('changed');
                }
            }
            
            // 변경사항 적용 버튼 활성화
            if (DOMCache.applyBtn) {
                DOMCache.applyBtn.classList.add('has-changes');
                DOMCache.applyBtn.textContent = '변경사항 적용하기 (저장됨)';
            }
        }

        // 시간 포맷
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 100);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }

        // 언어 필드명 매핑 (하위 호환성)
        function getLanguageFieldName(langCode) {
            const fieldMap = {
                'ko': 'korean',
                'en': 'english',
                'es': 'spanish',
                'fr': 'french',
                'de': 'german',
                'ja': 'japanese',
                'zh': 'chinese',
                'it': 'italian',
                'pt': 'portuguese',
                'ru': 'russian'
            };
            return fieldMap[langCode] || langCode;
        }

        // 비디오 탭 전환
        document.querySelectorAll('.video-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentTab = this.dataset.tab;
                updateVideoMode();
            });
        });
        
        // 비디오 모드 업데이트 (원본/번역) (최적화)
        function updateVideoMode() {
            if (!videoPlayer) return;
            
            // 원본/번역 모드에 따라 자막 표시 여부 결정
            // 실제로는 원본 비디오와 번역 비디오를 전환해야 하지만,
            // 여기서는 자막 표시만 토글
            if (currentTab === 'translation') {
                showSubtitles = true;
            } else {
                showSubtitles = false;
                if (DOMCache.subtitleText) DOMCache.subtitleText.textContent = '';
            }
        }

        // 재생 버튼 (최적화)
        if (DOMCache.playBtn) {
            DOMCache.playBtn.addEventListener('click', function() {
                if (!videoPlayer) return;
                
                if (videoPlayer.paused) {
                    videoPlayer.play();
                    isPlaying = true;
                    this.textContent = '⏸';
                } else {
                    videoPlayer.pause();
                    isPlaying = false;
                    this.textContent = '▶';
                }
            });
        }

        // 진행 바 클릭 (최적화)
        if (DOMCache.progressBar) {
            DOMCache.progressBar.addEventListener('click', function(e) {
                if (!videoPlayer || !videoDuration) return;
                
                const rect = this.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                currentTime = videoDuration * percent;
                videoPlayer.currentTime = currentTime;
                updateProgress();
            });
        }

        // 진행 상태 업데이트 (최적화: requestAnimationFrame 사용)
        let progressUpdateRaf = null;
        function updateProgress() {
            if (!videoDuration) return;
            
            if (progressUpdateRaf) {
                cancelAnimationFrame(progressUpdateRaf);
            }
            
            progressUpdateRaf = requestAnimationFrame(() => {
            const percent = Math.min(100, Math.max(0, (currentTime / videoDuration) * 100));
            
            if (DOMCache.progressFill) {
                DOMCache.progressFill.style.width = percent + '%';
            }
            if (DOMCache.timeDisplay) {
                DOMCache.timeDisplay.textContent = formatTimeDisplay(currentTime);
            }
                progressUpdateRaf = null;
            });
        }
        
        // 자막 업데이트 (최적화: requestAnimationFrame 사용)
        let subtitleUpdateRaf = null;
        function updateSubtitle() {
            if (!showSubtitles || !videoPlayer) {
                if (DOMCache.subtitleText) DOMCache.subtitleText.textContent = '';
                return;
            }
            
            if (subtitleUpdateRaf) {
                cancelAnimationFrame(subtitleUpdateRaf);
            }
            
            subtitleUpdateRaf = requestAnimationFrame(() => {
            const currentTime = videoPlayer.currentTime;
            const subtitleText = DOMCache.subtitleText;
            
                if (!subtitleText) {
                    subtitleUpdateRaf = null;
                    return;
                }
            
            // 현재 시간에 맞는 자막 찾기
            const currentSegment = transcriptions.find(segment => {
                return currentTime >= segment.startTime && currentTime < segment.endTime;
            });
            
            if (currentSegment) {
                // 현재 선택된 언어에 따라 자막 표시 (번역 설정 반영)
                const langCode = currentLang;
                let text = '';
                
                // 1순위: 언어 코드로 직접 접근 (예: ko, en, es, fr 등)
                if (currentSegment[langCode]) {
                    text = currentSegment[langCode];
                }
                // 2순위: 필드명으로 접근 (예: korean, english, spanish 등)
                else {
                    const fieldName = getLanguageFieldName(langCode);
                    if (currentSegment[fieldName]) {
                        text = currentSegment[fieldName];
                    }
                }
                // 3순위: 하위 호환성 (기존 데이터)
                if (!text) {
                    if (langCode === 'ko') {
                        text = currentSegment.korean || '';
                    } else if (langCode === 'en') {
                        text = currentSegment.english || '';
                    }
                }
                
                subtitleText.textContent = text;
                subtitleText.style.opacity = text ? '1' : '0';
            } else {
                subtitleText.style.opacity = '0';
            }
                
                subtitleUpdateRaf = null;
            });
        }

        // 시간 표시 포맷
        function formatTimeDisplay(seconds) {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // 변경사항 적용 (최적화 및 개선)
        function applyChanges() {
            if (!currentVideo) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }

            // 트랜스크립션 저장
            currentVideo.transcriptions = transcriptions;
            currentVideo.updatedAt = new Date().toISOString();

            // 로컬 스토리지에 저장
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const index = savedVideos.findIndex(v => v.id === videoId);
            if (index !== -1) {
                savedVideos[index] = currentVideo;
                localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
                
                // 변경사항 표시 제거
                document.querySelectorAll('.transcription-item.changed').forEach(item => {
                    item.classList.remove('changed');
                });
                
                // 버튼 텍스트 복원
                if (DOMCache.applyBtn) {
                    DOMCache.applyBtn.classList.remove('has-changes');
                    DOMCache.applyBtn.textContent = '✓ 저장 완료!';
                    DOMCache.applyBtn.style.background = '#4caf50';
                }
                
                logger.log('변경사항 저장 완료:', currentVideo.title);
                
                // 저장 완료 후 마이페이지로 이동
                setTimeout(() => {
                    window.location.href = 'storage.html';
                }, 1000);
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        }
        
        // 전역 함수로 등록
        window.seekToTime = seekToTime;
        window.editSegmentTime = editSegmentTime;
        window.deleteSegment = deleteSegment;
        window.applyChanges = applyChanges;


        // 남은 시간 초기화 및 표시 (초 단위로 관리)
        function initializeRemainingTime() {
            let remainingSeconds = parseInt(localStorage.getItem('remainingSeconds') || '0');
            const lastUpdate = parseInt(localStorage.getItem('lastTimeUpdate') || '0');
            const now = Date.now();
            
            // 기존 분 단위 데이터 마이그레이션
            const oldMinutes = parseInt(localStorage.getItem('remainingMinutes') || '0');
            if (oldMinutes > 0 && remainingSeconds === 0) {
                remainingSeconds = oldMinutes * 60;
                localStorage.removeItem('remainingMinutes');
            }
            
            // 초기화되지 않은 경우 5분(300초)으로 설정
            if (remainingSeconds === 0 && !localStorage.getItem('timeInitialized')) {
                remainingSeconds = 5 * 60;
                localStorage.setItem('remainingSeconds', remainingSeconds.toString());
                localStorage.setItem('lastTimeUpdate', now.toString());
                localStorage.setItem('timeInitialized', 'true');
            }
            
            // 마지막 업데이트 이후 경과 시간 계산하여 차감
            if (lastUpdate > 0 && remainingSeconds > 0) {
                const elapsedSeconds = Math.floor((now - lastUpdate) / 1000);
                remainingSeconds = Math.max(0, remainingSeconds - elapsedSeconds);
                localStorage.setItem('remainingSeconds', remainingSeconds.toString());
            }
            localStorage.setItem('lastTimeUpdate', now.toString());
        }
        
        // 컨트롤 아이콘 기능 활성화
        const captionBtn = document.getElementById('caption-btn');
        const volumeBtn = document.getElementById('volume-btn');
        const speedBtn = document.getElementById('speed-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        // 자막 ON/OFF (최적화)
        if (captionBtn) {
            captionBtn.addEventListener('click', function() {
                showSubtitles = !showSubtitles;
                this.style.opacity = showSubtitles ? '1' : '0.5';
                if (!showSubtitles) {
                    if (DOMCache.subtitleText) DOMCache.subtitleText.textContent = '';
                } else {
                    updateSubtitle();
                }
            });
        }
        
        // 볼륨 ON/OFF (최적화)
        if (volumeBtn && videoPlayer) {
            volumeBtn.addEventListener('click', function() {
                if (!videoPlayer) return;
                isMuted = !isMuted;
                videoPlayer.muted = isMuted;
                const volumeIcon = this.querySelector('.volume-icon');
                if (volumeIcon) {
                    if (isMuted) {
                        // 음소거 상태: X 표시 추가
                        volumeIcon.innerHTML = `
                            <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        `;
                    } else {
                        // 볼륨 ON 상태: 파동 표시
                        volumeIcon.innerHTML = `
                            <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <path class="volume-wave" d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                            <path class="volume-wave" d="M18.36 5.64a9 9 0 0 1 0 12.72" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                        `;
                    }
                }
            });
        }
        
        // 재생 속도 변경 (최적화)
        const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        let speedIndex = 2; // 1.0
        
        if (speedBtn && videoPlayer) {
            speedBtn.addEventListener('click', function() {
                if (!videoPlayer) return;
                speedIndex = (speedIndex + 1) % speedOptions.length;
                playbackRate = speedOptions[speedIndex];
                videoPlayer.playbackRate = playbackRate;
                this.textContent = playbackRate + 'x';
            });
        }
        
        // 전체화면
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function() {
                const videoContainer = document.querySelector('.video-container');
                if (!videoContainer) return;
                
                if (!document.fullscreenElement) {
                    videoContainer.requestFullscreen().catch(err => {
                        logger.error('전체화면 오류:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
        
        // 전체화면 변경 감지
        document.addEventListener('fullscreenchange', () => {
            const fullscreenIcon = document.getElementById('fullscreen-btn');
            if (fullscreenIcon) {
                fullscreenIcon.textContent = document.fullscreenElement ? '⛶' : '⛶';
            }
        });
        
        // 모바일 메뉴 토글
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            // 모바일에서만 버튼 표시
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
            }
            
            // 윈도우 리사이즈 이벤트 (최적화: 쓰로틀링 적용)
            const throttledResize = throttle(() => {
                if (window.innerWidth <= 768) {
                    mobileMenuBtn.style.display = 'block';
                } else {
                    mobileMenuBtn.style.display = 'none';
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                }
            }, 250);
            
            window.addEventListener('resize', throttledResize);
            
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
        
        // 드래그 앤 드롭 초기화 (최적화)
        function initializeDragAndDrop() {
            const dropZone = DOMCache.dropZone;
            const fileInput = document.getElementById('video-file-input');
            const videoPlayerWrapper = DOMCache.videoPlayerWrapper;
            const videoPlayer = DOMCache.videoPlayer;
            
            if (!dropZone || !fileInput || !videoPlayer) return;
            
            let dragCounter = 0;
            
            // 드래그 이벤트 방지
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // 드래그 오버
            dropZone.addEventListener('dragenter', (e) => {
                preventDefaults(e);
                dragCounter++;
                if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                    dropZone.classList.add('drag-over');
                }
            });
            
            // 드래그 리브
            dropZone.addEventListener('dragleave', (e) => {
                preventDefaults(e);
                dragCounter--;
                if (dragCounter === 0) {
                    dropZone.classList.remove('drag-over');
                }
            });
            
            // 드롭
            dropZone.addEventListener('drop', (e) => {
                preventDefaults(e);
                dropZone.classList.remove('drag-over');
                dragCounter = 0;
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleVideoFile(files[0]);
                }
            });
            
            // 파일 선택
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleVideoFile(e.target.files[0]);
                }
            });
            
            // 비디오 파일 처리
            function handleVideoFile(file) {
                // 파일 유효성 검사
                if (!file.type.startsWith('video/')) {
                    alert('영상 파일만 업로드 가능합니다.');
                    return;
                }
                
                if (file.size > 2 * 1024 * 1024 * 1024) {
                    alert('파일 크기는 2GB를 초과할 수 없습니다.');
                    return;
                }
                
                // 비디오 URL 생성
                const videoUrl = URL.createObjectURL(file);
                
                // 비디오 플레이어에 설정
                videoPlayer.src = videoUrl;
                videoPlayer.load();
                
                // 드롭존 숨기고 플레이어 표시
                toggleVideoPlayerElements(true);
                
                // 비디오 메타데이터 로드
                videoPlayer.addEventListener('loadedmetadata', () => {
                    videoDuration = videoPlayer.duration;
                    updateProgress();
                    setTimeout(() => {
                        initializeCustomControls();
                    }, 100);
                }, { once: true });
                
                // 비디오 로드 오류 처리
                videoPlayer.addEventListener('error', () => {
                    logger.error('비디오 로드 오류');
                    showDropZone();
                    alert('비디오를 로드할 수 없습니다. 다른 파일을 시도해주세요.');
                }, { once: true });
                
                logger.log('비디오 파일 업로드 완료:', file.name);
            }
        }
        
        // 제목 편집 모달 기능
        function initializeTitleEditModal() {
            const editTitleBtn = document.getElementById('edit-title-btn');
            const titleEditModal = document.getElementById('title-edit-modal');
            const titleEditInput = document.getElementById('title-edit-input');
            const titleEditClose = document.getElementById('title-edit-modal-close');
            const titleEditCancel = document.getElementById('title-edit-cancel-btn');
            const titleEditSave = document.getElementById('title-edit-save-btn');
            const titleModalBackdrop = document.getElementById('title-modal-backdrop');
            const titleCharCount = document.getElementById('title-char-count');

            if (!editTitleBtn || !titleEditModal || !titleEditInput) return;

            // 연필 아이콘 클릭 시 모달 열기
            editTitleBtn.addEventListener('click', () => {
                if (currentVideo && currentVideo.title) {
                    titleEditInput.value = currentVideo.title;
                } else {
                    titleEditInput.value = '';
                }
                updateCharCount();
                titleEditModal.style.display = 'flex';
                titleEditInput.focus();
                titleEditInput.select();
            });

            // 문자 수 업데이트
            function updateCharCount() {
                if (titleCharCount) {
                    titleCharCount.textContent = titleEditInput.value.length;
                }
            }

            titleEditInput.addEventListener('input', updateCharCount);

            // 모달 닫기 함수
            function closeModal() {
                titleEditModal.style.display = 'none';
            }

            // 닫기 버튼들
            if (titleEditClose) {
                titleEditClose.addEventListener('click', closeModal);
            }
            if (titleEditCancel) {
                titleEditCancel.addEventListener('click', closeModal);
            }
            if (titleModalBackdrop) {
                titleModalBackdrop.addEventListener('click', closeModal);
            }

            // 저장 버튼
            if (titleEditSave) {
                titleEditSave.addEventListener('click', () => {
                    const newTitle = titleEditInput.value.trim();
                    if (newTitle && currentVideo) {
                        currentVideo.title = newTitle;
                        if (DOMCache.videoTitleText) {
                            DOMCache.videoTitleText.textContent = newTitle;
                        }
                        logger.log('제목 업데이트:', newTitle);
                        closeModal();
                    } else if (!newTitle) {
                        alert('제목을 입력해주세요.');
                        titleEditInput.focus();
                    }
                });
            }

            // ESC 키로 모달 닫기
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && titleEditModal.style.display === 'flex') {
                    closeModal();
                }
            });

            // Enter 키로 저장 (Ctrl+Enter 또는 단독 Enter)
            titleEditInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (titleEditSave) {
                        titleEditSave.click();
                    }
                }
            });
        }

        // 커스텀 비디오 컨트롤 바 초기화
        let controlsInitialized = false;
        function initializeCustomControls() {
            if (controlsInitialized) return;
            
            const playPauseBtn = document.getElementById('play-pause-btn');
            const currentTimeEl = document.getElementById('current-time');
            const totalTimeEl = document.getElementById('total-time');
            const ccBtn = document.getElementById('cc-btn');
            const volumeBtn = document.getElementById('volume-btn');
            const playbackSpeedEl = document.getElementById('playback-speed');
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            const customControls = document.getElementById('custom-video-controls');

            if (!videoPlayer || !customControls) return;
            
            controlsInitialized = true;

            // 시간 포맷 함수
            function formatTime(seconds) {
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = Math.floor(seconds % 60);
                return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }

            // 시간 업데이트
            function updateTimeDisplay() {
                if (currentTimeEl && videoPlayer) {
                    currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
                }
                if (totalTimeEl && videoPlayer && videoPlayer.duration) {
                    totalTimeEl.textContent = formatTime(videoPlayer.duration);
                }
            }

            // 재생/일시정지 버튼
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', () => {
                    if (videoPlayer.paused) {
                        videoPlayer.play();
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        isPlaying = true;
                    } else {
                        videoPlayer.pause();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                        isPlaying = false;
                    }
                });
            }

            // 비디오 이벤트 리스너
            videoPlayer.addEventListener('play', () => {
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
            });

            videoPlayer.addEventListener('pause', () => {
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
            });

            videoPlayer.addEventListener('timeupdate', () => {
                updateTimeDisplay();
            });

            videoPlayer.addEventListener('loadedmetadata', () => {
                updateTimeDisplay();
            });

            // 자막 버튼
            if (ccBtn) {
                ccBtn.addEventListener('click', () => {
                    showSubtitles = !showSubtitles;
                    const subtitleOverlay = document.getElementById('subtitle-overlay');
                    if (subtitleOverlay) {
                        subtitleOverlay.style.display = showSubtitles ? 'block' : 'none';
                    }
                    ccBtn.style.opacity = showSubtitles ? '1' : '0.5';
                });
            }

            // 볼륨 버튼
            if (volumeBtn) {
                volumeBtn.addEventListener('click', () => {
                    isMuted = !isMuted;
                    videoPlayer.muted = isMuted;
                    if (isMuted) {
                        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    } else {
                        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    }
                });
            }

            // 재생 속도
            const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
            let speedIndex = 2; // 1x가 기본값

            if (playbackSpeedEl) {
                playbackSpeedEl.addEventListener('click', () => {
                    speedIndex = (speedIndex + 1) % speeds.length;
                    playbackRate = speeds[speedIndex];
                    videoPlayer.playbackRate = playbackRate;
                    playbackSpeedEl.textContent = playbackRate + 'x';
                });
            }

            // 전체화면 버튼
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    const videoWrapper = document.querySelector('.video-player-wrapper');
                    if (!document.fullscreenElement) {
                        if (videoWrapper && videoWrapper.requestFullscreen) {
                            videoWrapper.requestFullscreen();
                        } else if (videoWrapper && videoWrapper.webkitRequestFullscreen) {
                            videoWrapper.webkitRequestFullscreen();
                        } else if (videoWrapper && videoWrapper.mozRequestFullScreen) {
                            videoWrapper.mozRequestFullScreen();
                        } else if (videoWrapper && videoWrapper.msRequestFullscreen) {
                            videoWrapper.msRequestFullscreen();
                        }
                        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    }
                });

                // 전체화면 변경 감지
                document.addEventListener('fullscreenchange', () => {
                    if (fullscreenBtn) {
                        fullscreenBtn.innerHTML = document.fullscreenElement 
                            ? '<i class="fas fa-compress"></i>' 
                            : '<i class="fas fa-expand"></i>';
                    }
                });
            }

            // 초기 상태 설정
            updateTimeDisplay();
            if (playbackSpeedEl) playbackSpeedEl.textContent = playbackRate + 'x';
        }

        // 초기화 (최적화)
        initializeRemainingTime();
        initializeDragAndDrop();
        initializeTitleEditModal();
        
        if (videoId) {
            loadVideoData();
        } else {
            // videoId가 없으면 드롭존 표시
            showDropZone();
        }
    