        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        let videos = []; // 저장된 영상 목록
        let currentFilter = 'all'; // 현재 필터 상태
        let thumbnailLoadObserver = null; // Intersection Observer for lazy loading
        let renderCache = null; // 렌더링 캐시
        let isRendering = false; // 렌더링 중 플래그
        
        // 모바일 메뉴 토글
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            // 모바일에서만 버튼 표시
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
            }
            
            // 윈도우 리사이즈 이벤트
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    mobileMenuBtn.style.display = 'block';
                } else {
                    mobileMenuBtn.style.display = 'none';
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                }
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

        // 로컬 스토리지에서 데이터 로드
        function loadData() {
            try {
                const savedVideos = localStorage.getItem('savedVideos');
                
                if (savedVideos) {
                    videos = JSON.parse(savedVideos);
                    logger.log('영상 데이터 로드 완료:', videos.length, '개');
                } else {
                    videos = [];
                    logger.log('저장된 영상이 없습니다.');
                }
                
                renderVideos();
                if (window.StorageManager) {
                    window.StorageManager.updateStorageDashboard(videos);
                }
            } catch (error) {
                logger.error('데이터 로드 오류:', error);
                videos = [];
                renderVideos();
                if (window.StorageManager) {
                    window.StorageManager.updateStorageDashboard(videos);
                }
            }
        }

        // 디바운스 함수
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
        
        // 영상 목록 렌더링 (최적화: 중복 렌더링 방지)
        function renderVideos(filter = 'all') {
            // 이미 같은 필터로 렌더링 중이면 스킵
            if (isRendering && currentFilter === filter) {
                logger.log('이미 렌더링 중입니다. 스킵:', filter);
                return;
            }
            
            const videoGrid = document.getElementById('video-grid');
            
            if (!videoGrid) {
                logger.error('video-grid 요소를 찾을 수 없습니다.');
                return;
            }
            
            isRendering = true;
            currentFilter = filter;
            
            if (videos.length === 0) {
                videoGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">📹</div>
                        <div class="empty-state-text">저장된 영상이 없습니다</div>
                        <div class="empty-state-hint" style="margin-top: 10px; font-size: 0.85rem; color: #999;">
                            홈페이지에서 영상을 업로드하고 번역하면 여기에 표시됩니다.
                        </div>
                    </div>
                `;
                isRendering = false;
                return;
            }
            
            logger.log('영상 렌더링 시작:', videos.length, '개, 필터:', filter);

            // 정렬 옵션 가져오기 (기본값: oldest)
            const currentSort = localStorage.getItem('currentSort') || 'oldest';
            
            // 정렬 적용
            let sortedVideos = videos.slice().sort((a, b) => {
                const dateA = a.savedAt ? new Date(a.savedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
                const dateB = b.savedAt ? new Date(b.savedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
                
                if (currentSort === 'latest') {
                    return dateB - dateA; // 내림차순 (최신순)
                } else {
                    return dateA - dateB; // 오름차순 (오래된순)
                }
            });
            
            let filteredVideos = sortedVideos;
            const now = new Date();
            
            if (filter === 'processing') {
                // 처리 중: jobId가 있고 상태가 processing인 경우, 또는 translated가 false인 경우
                const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
                filteredVideos = sortedVideos.filter(video => {
                    // 번역되지 않은 영상도 처리 중으로 간주
                    if (video.translated === false) {
                        return true;
                    }
                    // jobId가 있고 상태가 processing인 경우
                    if (video.jobId) {
                        const job = jobs.find(j => j.id === video.jobId);
                        if (job && job.status === 'processing') {
                            return true;
                        }
                    }
                    return false;
                });
            } else if (filter === 'completed') {
                // 완료: translated가 true인 영상
                filteredVideos = sortedVideos.filter(video => video.translated === true);
            } else if (filter === 'expiring') {
                // 만료 예정 (D-3): 3일 이내 만료되는 영상
                filteredVideos = sortedVideos.filter(video => {
                    if (!video.expiresAt && !video.expiryDate) return false;
                    const expiry = new Date(video.expiresAt || video.expiryDate);
                    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
                    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
                });
            }
            // 'all' 필터는 filteredVideos = sortedVideos (변경 없음)

            // 원본 배열에서의 인덱스를 찾기 위해 ID로 매핑
            const videoIdMap = new Map();
            videos.forEach((v, idx) => videoIdMap.set(v.id, idx));

            videoGrid.innerHTML = filteredVideos.map((video) => {
                const originalIndex = videoIdMap.get(video.id);
                const savedDate = new Date(video.savedAt || video.createdAt || Date.now());
                const expiryDate = (video.expiresAt || video.expiryDate) ? new Date(video.expiresAt || video.expiryDate) : null;
                const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) : null;
                
                let expiryBadge = '';
                if (expiryDate) {
                    if (daysUntilExpiry <= 0) {
                        expiryBadge = '<span class="expiry-badge warning">만료됨</span>';
                    } else if (daysUntilExpiry <= 3) {
                        expiryBadge = `<span class="expiry-badge warning">${daysUntilExpiry}일 후 만료</span>`;
                    } else if (daysUntilExpiry <= 7) {
                        expiryBadge = `<span class="expiry-badge">${daysUntilExpiry}일 후 만료</span>`;
                    }
                }

                // 번역 상태 표시
                let translationBadge = '';
                if (video.translated) {
                    const targetLangs = video.targetLanguages ? video.targetLanguages.map(l => l.name || l.code).join(', ') : '';
                    translationBadge = `<span class="translation-badge" style="display: inline-block; background: #9c27b0; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px;">번역됨</span>`;
                }
                
                // 상태 배지 생성 (간결하게)
                let statusBadge = '';
                if (expiryDate && daysUntilExpiry !== null) {
                    if (daysUntilExpiry <= 0) {
                        statusBadge = '<span class="status-badge status-expired">만료됨</span>';
                    } else if (daysUntilExpiry <= 3) {
                        statusBadge = `<span class="status-badge status-warning">D-${daysUntilExpiry}</span>`;
                    }
                } else if (video.translated) {
                    statusBadge = '<span class="status-badge status-success">완료</span>';
                } else if (video.jobId) {
                    const job = JSON.parse(localStorage.getItem('jobs') || '[]').find(j => j.id === video.jobId);
                    if (job && job.status === 'processing') {
                        statusBadge = '<span class="status-badge status-processing">처리 중</span>';
                    }
                }
                
                // 사용 크레딧 계산
                const duration = video.duration || 0;
                const translationCount = video.targetLanguages ? video.targetLanguages.length : 0;
                const durationMinutes = Math.ceil(duration / 60);
                const usedCredits = durationMinutes * 10 + durationMinutes * 5 * translationCount;
                
                // 보관 정보 (간결하게)
                let expiryInfo = '';
                if (expiryDate && daysUntilExpiry !== null) {
                    const expiryDateStr = `${expiryDate.getFullYear()}.${String(expiryDate.getMonth() + 1).padStart(2, '0')}.${String(expiryDate.getDate()).padStart(2, '0')}`;
                    expiryInfo = `<div class="expiry-info">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${expiryDateStr}까지</span>
                    </div>`;
                }
                
                return `
                    <div class="video-card" data-video-id="${video.id}" onclick="handleVideoCardClick(event, '${video.id}')" ${daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry > 0 ? 'data-expiring="true"' : ''} style="cursor: pointer;">
                        <div class="video-thumbnail" data-video-id="${video.id}">
                            <video class="thumbnail-video" preload="metadata" muted>
                                <source src="" type="video/mp4">
                            </video>
                            <div class="thumbnail-placeholder">
                                <i class="fas fa-video"></i>
                            </div>
                            <div class="video-duration">${formatDuration(duration)}</div>
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                            ${statusBadge ? `<div class="status-badge-overlay">${statusBadge}</div>` : ''}
                        </div>
                        <div class="video-info">
                            <div class="video-header">
                                <h3 class="video-title">${video.title}</h3>
                                ${expiryInfo}
                            </div>
                            
                            <div class="video-meta-grid">
                                <div class="meta-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${formatDuration(duration)}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-hdd"></i>
                                    <span>${formatFileSize(video.size || 0)}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-coins"></i>
                                    <span>${usedCredits.toLocaleString()}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>${savedDate.getFullYear()}.${String(savedDate.getMonth() + 1).padStart(2, '0')}.${String(savedDate.getDate()).padStart(2, '0')}</span>
                                </div>
                                ${translationCount > 0 ? `
                                <div class="meta-item">
                                    <i class="fas fa-language"></i>
                                    <span>${video.targetLanguages.map(l => l.name || l.code).join(', ')}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="video-actions" onclick="event.stopPropagation()">
                                ${(video.isFreeTrial || video.downloadable === false) 
                                    ? '<button class="btn-download disabled" disabled><i class="fas fa-download"></i> 다운로드</button>' 
                                    : `<button class="btn-download" onclick="event.stopPropagation(); downloadVideo(${originalIndex}, event)"><i class="fas fa-download"></i> 다운로드</button>`}
                                <button class="btn-share" onclick="event.stopPropagation(); shareVideo('${video.id}')">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn-delete" onclick="event.stopPropagation(); deleteVideo(${originalIndex})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // 렌더링 후 저장공간 대시보드 업데이트 (storage.js에서 처리)
            if (window.StorageManager) {
                window.StorageManager.updateStorageDashboard(videos);
                window.StorageManager.updateExpiryBanner(videos);
                window.StorageManager.updateStorageExtensionSection();
            }
            
            // 렌더링 완료 플래그 설정
            isRendering = false;
            
            // 비디오 미리보기 로드 (Intersection Observer 사용)
            requestAnimationFrame(() => {
                loadVideoThumbnails();
            });
            
            // 추가로 즉시 로드 시도 (첫 3개는 즉시 표시)
            setTimeout(() => {
                const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
                thumbnailContainers.forEach((container, index) => {
                    if (index < 3) {
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId && placeholder && placeholder.style.display !== 'none') {
                            // localStorage에서 즉시 확인
                            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                            const video = savedVideos.find(v => v.id === videoId);
                            
                            if (video && video.videoUrl) {
                                // videoUrl이 있으면 즉시 사용
                                const url = video.videoUrl;
                                if (url.startsWith('blob:') || url.startsWith('http')) {
                                    videoElement.src = url;
                                    videoElement.addEventListener('loadedmetadata', () => {
                                        if (videoElement.duration > 0) {
                                            videoElement.currentTime = Math.min(
                                                Math.max(1, videoElement.duration * 0.15),
                                                videoElement.duration * 0.5
                                            );
                                        }
                                    }, { once: true });
                                    
                                    videoElement.addEventListener('seeked', () => {
                                        if (placeholder) {
                                            placeholder.style.display = 'none';
                                        }
                                        videoElement.style.display = 'block';
                                    }, { once: true });
                                }
                            }
                        }
                    }
                });
            }, 200);
        }
        
        // Intersection Observer를 사용한 지연 로딩 초기화
        function initThumbnailObserver() {
            if (!('IntersectionObserver' in window)) {
                // Intersection Observer를 지원하지 않는 브라우저는 기존 방식 사용
                return null;
            }
            
            return new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const container = entry.target;
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                            // 로드 시작 후 관찰 중지
                            thumbnailLoadObserver.unobserve(container);
                        }
                    }
                });
            }, {
                rootMargin: '50px', // 뷰포트 50px 전에 미리 로드
                threshold: 0.1
            });
        }
        
        // 비디오 썸네일 로드 (최적화: Intersection Observer 사용)
        function loadVideoThumbnails() {
            const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
            
            if (thumbnailContainers.length === 0) {
                logger.log('썸네일 컨테이너를 찾을 수 없습니다.');
                return;
            }
            
            logger.log('썸네일 로드 시작:', thumbnailContainers.length, '개');
            
            // Intersection Observer 사용 (지연 로딩)
            if (thumbnailLoadObserver) {
                thumbnailContainers.forEach(container => {
                    thumbnailLoadObserver.observe(container);
                });
            } else {
                // Fallback: 기존 방식 (첫 3개만 즉시 로드)
                thumbnailContainers.forEach((container, index) => {
                    if (index < 3) {
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                        }
                    }
                });
            }
        }
        
        // IndexedDB에서 비디오 썸네일 로드 (최적화 및 재시도 로직 추가)
        function loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount = 0) {
            const maxRetries = 3; // 최대 3번 재시도
            let thumbnailLoaded = false;
            let currentVideoElement = videoElement; // 현재 사용 중인 비디오 요소 추적
            
            // 타임아웃 설정 (8초로 증가)
            const timeout = setTimeout(() => {
                if (!thumbnailLoaded && placeholder) {
                    placeholder.innerHTML = '<i class="fas fa-video-slash" style="font-size: 2rem; color: #999;"></i><div style="margin-top: 8px; font-size: 14px; color: #999;">로드 중...</div>';
                }
            }, 8000);
            
            // 비디오 로드 성공 처리 함수
            const showThumbnail = () => {
                if (placeholder) {
                    placeholder.style.display = 'none';
                    placeholder.style.visibility = 'hidden';
                    placeholder.style.opacity = '0';
                }
                // 현재 사용 중인 비디오 요소에 스타일 적용
                if (currentVideoElement) {
                    currentVideoElement.style.display = 'block';
                    currentVideoElement.style.visibility = 'visible';
                    currentVideoElement.style.opacity = '1';
                    // 강제로 리플로우 트리거
                    currentVideoElement.offsetHeight;
                }
                thumbnailLoaded = true;
                clearTimeout(timeout);
                logger.log('썸네일 로드 성공:', videoId);
            };
            
            // 비디오 로드 실패 처리 함수
            const showError = (message) => {
                clearTimeout(timeout);
                if (placeholder) {
                    placeholder.innerHTML = `<i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #999;"></i><div style="margin-top: 8px; font-size: 14px; color: #999;">${message || '로드 실패'}</div>`;
                }
            };
            
            // 비디오 URL 설정 및 로드
            const setupVideoThumbnail = (url) => {
                // 이전 이벤트 리스너 제거
                const newVideoElement = videoElement.cloneNode(true);
                videoElement.parentNode.replaceChild(newVideoElement, videoElement);
                newVideoElement.id = videoElement.id;
                newVideoElement.className = videoElement.className;
                currentVideoElement = newVideoElement; // 현재 요소 업데이트
                
                newVideoElement.src = url;
                
                // 비디오 메타데이터 로드 후 특정 시간으로 이동하여 썸네일 생성
                newVideoElement.addEventListener('loadedmetadata', () => {
                    if (newVideoElement.duration > 0) {
                        // 비디오의 중간 지점 또는 10% 지점으로 이동 (더 나은 썸네일)
                        const seekTime = Math.min(
                            Math.max(1, newVideoElement.duration * 0.15), // 15% 지점
                            newVideoElement.duration * 0.5 // 최대 50% 지점
                        );
                        newVideoElement.currentTime = seekTime;
                    } else {
                        // duration을 가져올 수 없으면 첫 프레임 표시
                        showThumbnail();
                    }
                }, { once: true });
                
                newVideoElement.addEventListener('seeked', () => {
                    showThumbnail();
                }, { once: true });
                
                newVideoElement.addEventListener('loadeddata', () => {
                    // 메타데이터만 로드된 경우에도 표시 (fallback)
                    if (newVideoElement.readyState >= 2 && !thumbnailLoaded) {
                        showThumbnail();
                    }
                }, { once: true });
                
                newVideoElement.addEventListener('error', () => {
                    logger.error('비디오 썸네일 로드 오류:', videoId);
                    if (retryCount < maxRetries) {
                        // 재시도
                        logger.log(`썸네일 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                        setTimeout(() => {
                            loadVideoThumbnailFromIndexedDB(videoId, newVideoElement, placeholder, retryCount + 1);
                        }, 1000 * (retryCount + 1)); // 지수 백오프
                    } else {
                        showError('로드 실패');
                    }
                }, { once: true });
            };
            
            // IndexedDB에서 로드 시도
            const request = indexedDB.open('AX2_Videos', 1);
            
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
                            if (!thumbnailLoaded) {
                                setupVideoThumbnail(url);
                            }
                        } catch (error) {
                            logger.error('Blob 생성 오류:', error);
                            if (!thumbnailLoaded) {
                                tryLoadFromLocalStorage();
                            }
                        }
                    } else {
                        // IndexedDB에 없으면 localStorage의 videoUrl 사용 또는 재시도
                        if (retryCount < maxRetries && !thumbnailLoaded) {
                            logger.log(`IndexedDB에 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                            setTimeout(() => {
                                if (!thumbnailLoaded) {
                                    loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                                }
                            }, 1000 * (retryCount + 1));
                        } else if (!thumbnailLoaded) {
                            tryLoadFromLocalStorage();
                        }
                    }
                };
                
                getRequest.onerror = () => {
                    logger.error('IndexedDB 조회 오류:', videoId);
                    if (retryCount < maxRetries && !thumbnailLoaded) {
                        setTimeout(() => {
                            if (!thumbnailLoaded) {
                                loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                            }
                        }, 1000 * (retryCount + 1));
                    } else if (!thumbnailLoaded) {
                        tryLoadFromLocalStorage();
                    }
                };
            };
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패');
                if (retryCount < maxRetries && !thumbnailLoaded) {
                    setTimeout(() => {
                        if (!thumbnailLoaded) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                        }
                    }, 1000 * (retryCount + 1));
                } else if (!thumbnailLoaded) {
                    tryLoadFromLocalStorage();
                }
            };
            
            // localStorage에서 videoUrl 로드 시도
            function tryLoadFromLocalStorage() {
                if (thumbnailLoaded) return; // 이미 로드되었으면 중단
                
                const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                const video = savedVideos.find(v => v.id === videoId);
                
                if (video && video.videoUrl) {
                    // Blob URL이 만료되었을 수 있으므로 확인
                    if (video.videoUrl.startsWith('blob:')) {
                        // Blob URL이 만료되었을 수 있으므로 IndexedDB에서 다시 시도
                        if (retryCount < maxRetries) {
                            logger.log(`Blob URL 만료 가능, IndexedDB 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                            setTimeout(() => {
                                if (!thumbnailLoaded) {
                                    loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                                }
                            }, 1000 * (retryCount + 1));
                        } else {
                            // 마지막 시도로 Blob URL 사용
                            setupVideoThumbnail(video.videoUrl);
                        }
                    } else {
                        // 일반 URL인 경우
                        setupVideoThumbnail(video.videoUrl);
                    }
                } else {
                    // 재시도 로직: IndexedDB 저장이 아직 완료되지 않았을 수 있음
                    if (retryCount < maxRetries) {
                        logger.log(`localStorage에도 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                        setTimeout(() => {
                            if (!thumbnailLoaded) {
                                loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                            }
                        }, 1000 * (retryCount + 1));
                    } else {
                        showError('영상 없음');
                    }
                }
            }
            
            // localStorage에서 즉시 확인 (Blob URL이 아닌 경우)
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const video = savedVideos.find(v => v.id === videoId);
            
            if (video && video.videoUrl && !video.videoUrl.startsWith('blob:')) {
                // 일반 URL인 경우 즉시 사용 (IndexedDB보다 빠름)
                setupVideoThumbnail(video.videoUrl);
            } else {
                // Blob URL이거나 없으면 IndexedDB 시도 후 localStorage fallback
                // tryLoadFromLocalStorage는 IndexedDB 실패 시 호출됨
            }
        }

        // 날짜 포맷
        function formatDate(date) {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // 시간 포맷
        // 시간 포맷 (시:분:초.밀리초)
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 100);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }

        function formatDuration(seconds) {
            // 소수점 제거: 초를 정수로 반올림
            const totalSeconds = Math.round(seconds);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
        
        // 파일 크기 포맷 (소수점 제거)
        function formatFileSize(sizeGB) {
            if (!sizeGB || sizeGB === 0) {
                return '0GB';
            }
            
            // GB 단위가 1 이상이면 정수로 표시
            if (sizeGB >= 1) {
                return Math.round(sizeGB) + 'GB';
            }
            
            // 1GB 미만이면 MB 단위로 변환하여 정수로 표시
            const sizeMB = sizeGB * 1024;
            if (sizeMB >= 1) {
                return Math.round(sizeMB) + 'MB';
            }
            
            // 1MB 미만이면 KB 단위로 변환하여 정수로 표시
            const sizeKB = sizeMB * 1024;
            if (sizeKB >= 1) {
                return Math.round(sizeKB) + 'KB';
            }
            
            // 1KB 미만이면 바이트 단위로 표시
            return Math.round(sizeKB * 1024) + 'B';
        }

        // 카테고리 이름 반환
        function getCategoryName(category) {
            const categories = {
                'business': '비즈니스',
                'education': '교육',
                'technology': '기술',
                'marketing': '마케팅',
                'other': '기타'
            };
            return categories[category] || category;
        }

        // 영상 다운로드 (활성화)
        function downloadVideo(index, e) {
            if (e) {
                e.stopPropagation(); // 카드 클릭 이벤트 방지
            }
            const video = videos[index];
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 무료 체험 사용자는 다운로드 불가
            if (video.isFreeTrial || video.downloadable === false) {
                alert('무료 체험 사용자는 다운로드할 수 없습니다.\n크레딧을 충전하여 일반 사용자로 전환하시면 다운로드가 가능합니다.');
                return;
            }
            
            // 파일 다운로드 실행 함수
            const executeDownload = (blob, filename) => {
                try {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    // 약간의 지연 후 URL 해제 (다운로드 시작 대기)
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                    alert(`"${video.title}" 다운로드가 시작되었습니다.`);
                } catch (error) {
                    logger.error('다운로드 실행 오류:', error);
                    alert('다운로드 중 오류가 발생했습니다.');
                }
            };
            
            // IndexedDB에서 파일 가져오기
            const request = indexedDB.open('AX2_Videos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readonly');
                const store = transaction.objectStore('videos');
                const getRequest = store.get(video.id);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result && getRequest.result.data) {
                        // IndexedDB에서 파일 찾음
                        const blob = new Blob([getRequest.result.data], { 
                            type: getRequest.result.type || 'video/mp4' 
                        });
                        const filename = video.fileName || video.title || 'video.mp4';
                        // 파일명에 확장자가 없으면 추가
                        const finalFilename = filename.includes('.') ? filename : filename + '.mp4';
                        executeDownload(blob, finalFilename);
                    } else {
                        // IndexedDB에 없으면 videoUrl 사용 시도
                        tryDownloadFromUrl();
                    }
                };
                
                getRequest.onerror = () => {
                    logger.error('IndexedDB 조회 오류:', getRequest.error);
                    // IndexedDB 오류 시 videoUrl 사용 시도
                    tryDownloadFromUrl();
                };
            };
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패:', request.error);
                // IndexedDB 접근 실패 시 videoUrl 사용 시도
                tryDownloadFromUrl();
            };
            
            // videoUrl에서 다운로드 시도
            function tryDownloadFromUrl() {
                if (video.videoUrl) {
                    // Blob URL인 경우 fetch로 가져오기
                    if (video.videoUrl.startsWith('blob:')) {
                        fetch(video.videoUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                const filename = video.fileName || video.title || 'video.mp4';
                                const finalFilename = filename.includes('.') ? filename : filename + '.mp4';
                                executeDownload(blob, finalFilename);
                            })
                            .catch(error => {
                                logger.error('Blob URL 다운로드 오류:', error);
                                alert('파일을 다운로드할 수 없습니다.\n파일이 만료되었거나 삭제되었을 수 있습니다.');
                            });
                    } else {
                        // 일반 URL인 경우 직접 링크로 다운로드
                        try {
                            const a = document.createElement('a');
                            a.href = video.videoUrl;
                            a.download = video.fileName || video.title || 'video.mp4';
                            a.target = '_blank';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            alert(`"${video.title}" 다운로드가 시작되었습니다.`);
                        } catch (error) {
                            logger.error('URL 다운로드 오류:', error);
                            alert('파일을 다운로드할 수 없습니다.');
                        }
                    }
                } else {
                    alert('파일을 찾을 수 없습니다.\nIndexedDB와 저장된 URL 모두에서 파일을 찾을 수 없습니다.');
                }
            }
        }
        
        // 전역 함수로 등록
        window.downloadVideo = downloadVideo;


        // 영상 편집 - 번역 편집 페이지로 이동
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
        
        // 로그인 확인 팝업 표시
        function showLoginConfirmDialog() {
            return new Promise((resolve) => {
                // 커스텀 팝업 생성
                const popup = document.createElement('div');
                popup.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                `;
                
                const popupContent = document.createElement('div');
                popupContent.style.cssText = `
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    text-align: center;
                `;
                
                const title = document.createElement('h3');
                title.textContent = '로그인이 필요합니다';
                title.style.cssText = 'margin: 0 0 15px 0; font-size: 1.3rem; color: #333;';
                
                const message = document.createElement('p');
                message.textContent = '강의를 편집하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.';
                message.style.cssText = 'margin: 0 0 25px 0; font-size: 1rem; color: #666; white-space: pre-line;';
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
                
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = '확인';
                confirmBtn.style.cssText = `
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                `;
                
                confirmBtn.addEventListener('mouseenter', () => {
                    confirmBtn.style.transform = 'translateY(-2px)';
                    confirmBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                });
                
                confirmBtn.addEventListener('mouseleave', () => {
                    confirmBtn.style.transform = 'translateY(0)';
                    confirmBtn.style.boxShadow = 'none';
                });
                
                confirmBtn.addEventListener('click', () => {
                    document.body.removeChild(popup);
                    resolve(true);
                });
                
                buttonContainer.appendChild(confirmBtn);
                popupContent.appendChild(title);
                popupContent.appendChild(message);
                popupContent.appendChild(buttonContainer);
                popup.appendChild(popupContent);
                
                document.body.appendChild(popup);
                
                // 배경 클릭 시 닫기
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        document.body.removeChild(popup);
                        resolve(false);
                    }
                });
            });
        }
        
        // 영상 카드 클릭 핸들러 (버튼 영역 제외)
        function handleVideoCardClick(event, videoId) {
            // 버튼이나 액션 영역을 클릭한 경우 이벤트 전파 중지
            if (event.target.closest('.video-actions') || 
                event.target.closest('.btn-download') || 
                event.target.closest('.btn-share') || 
                event.target.closest('.btn-delete')) {
                return;
            }
            
            // 편집 화면으로 이동
            editVideo(videoId);
        }
        
        function editVideo(videoId) {
            if (!videoId) {
                logger.error('비디오 ID가 없습니다.');
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 로그인 상태 확인
            if (!checkLoginStatus()) {
                logger.log('로그인하지 않은 사용자가 강의 편집 시도');
                showLoginConfirmDialog().then((confirmed) => {
                    if (confirmed) {
                        // 현재 페이지 URL을 저장하여 로그인 후 돌아올 수 있도록
                        const currentUrl = window.location.href;
                        sessionStorage.setItem('redirectAfterLogin', currentUrl);
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            logger.log('편집 페이지로 이동:', videoId);
            
            // 저장된 영상 확인
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const video = savedVideos.find(v => v.id === videoId);
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 편집 페이지로 이동
            window.location.href = `edit.html?id=${videoId}`;
        }
        
        // 전역 스코프에 함수 등록 (HTML에서 onclick으로 호출하기 위해)
        window.editVideo = editVideo;
        window.handleVideoCardClick = handleVideoCardClick;

        function closeEditModal() {
            document.getElementById('edit-modal').classList.remove('show');
            currentEditVideoId = null;
        }

        function saveEdit() {
            if (!currentEditVideoId) return;

            const video = videos.find(v => v.id === currentEditVideoId);
            if (!video) return;

            // 편집된 내용 저장
            video.title = document.getElementById('edit-title').value.trim() || video.title;
            video.description = document.getElementById('edit-description').value.trim();
            
            // 태그 처리
            const tagsInput = document.getElementById('edit-tags').value.trim();
            video.tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            video.category = document.getElementById('edit-category').value;
            video.updatedAt = new Date().toISOString();

            // 데이터 저장
            saveData();
            closeEditModal();
            renderVideos();
            
            alert('강의 정보가 저장되었습니다.');
        }

        // 영상 삭제 (활성화 및 최적화)
        function deleteVideo(index) {
            if (event) {
                event.stopPropagation(); // 카드 클릭 이벤트 방지
            }
            
            const video = videos[index];
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            if (!confirm(`"${video.title}" 영상을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
                return;
            }
            
            // IndexedDB에서도 삭제
            const request = indexedDB.open('AX2_Videos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readwrite');
                const store = transaction.objectStore('videos');
                const deleteRequest = store.delete(video.id);
                
                deleteRequest.onsuccess = () => {
                    logger.log('IndexedDB에서 영상 삭제 완료:', video.id);
                };
                
                deleteRequest.onerror = () => {
                    logger.error('IndexedDB 삭제 오류:', deleteRequest.error);
                };
            };
            
            // localStorage에서 삭제
            videos.splice(index, 1);
            saveData();
            renderVideos();
            
            alert('영상이 삭제되었습니다.');
        }
        
        // 영상 공유 기능
        function shareVideo(videoId) {
            const video = videos.find(v => v.id === videoId);
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }

            // 공유 링크 생성 (실제로는 서버에서 생성해야 하지만, 여기서는 클라이언트에서 생성)
            const shareLink = `${window.location.origin}${window.location.pathname}?share=${videoId}`;
            
            // 공유 모달 표시
            showShareModal(video, shareLink);
        }

        // 공유 모달 표시
        function showShareModal(video, shareLink) {
            // 기존 모달이 있으면 제거
            const existingModal = document.getElementById('share-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // 모달 생성
            const modal = document.createElement('div');
            modal.id = 'share-modal';
            modal.className = 'share-modal';
            modal.innerHTML = `
                <div class="share-modal-backdrop" onclick="closeShareModal()"></div>
                <div class="share-modal-content">
                    <div class="share-modal-header">
                        <h3>
                            <i class="fas fa-share-alt"></i>
                            강의 공유
                        </h3>
                        <button class="share-modal-close" onclick="closeShareModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="share-modal-body">
                        <div class="share-video-info">
                            <div class="share-video-title">${video.title || '강의 제목'}</div>
                            <div class="share-video-meta">
                                ${video.duration ? `재생 시간: ${formatDuration(video.duration)}` : ''}
                                ${video.targetLanguages && video.targetLanguages.length > 0 ? `<br>번역 언어: ${video.targetLanguages.map(l => l.name || l.code).join(', ')}` : ''}
                            </div>
                        </div>
                        <div class="share-link-section">
                            <label class="share-label">공유 링크</label>
                            <div class="share-link-input-wrapper">
                                <input type="text" class="share-link-input" id="share-link-input" value="${shareLink}" readonly>
                                <button class="share-copy-btn" onclick="copyShareLink()">
                                    <i class="fas fa-copy"></i>
                                    복사
                                </button>
                            </div>
                        </div>
                        <div class="share-options">
                            <button class="share-option-btn" onclick="shareToSocial('facebook', '${shareLink}')">
                                <i class="fab fa-facebook"></i>
                                Facebook
                            </button>
                            <button class="share-option-btn" onclick="shareToSocial('twitter', '${shareLink}')">
                                <i class="fab fa-twitter"></i>
                                Twitter
                            </button>
                            <button class="share-option-btn" onclick="shareToSocial('kakao', '${shareLink}')">
                                <i class="fas fa-comment"></i>
                                카카오톡
                            </button>
                            <button class="share-option-btn" onclick="shareToSocial('email', '${shareLink}')">
                                <i class="fas fa-envelope"></i>
                                이메일
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // 공유 링크 복사
        function copyShareLink() {
            const shareLinkInput = document.getElementById('share-link-input');
            if (shareLinkInput) {
                shareLinkInput.select();
                document.execCommand('copy');
                
                // 복사 확인 메시지
                const copyBtn = document.querySelector('.share-copy-btn');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨';
                    copyBtn.style.background = '#4caf50';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }
            }
        }

        // 소셜 미디어 공유
        function shareToSocial(platform, link) {
            const title = encodeURIComponent('AX2 강의 공유');
            const text = encodeURIComponent('이 강의를 확인해보세요!');
            
            let shareUrl = '';
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${text}`;
                    break;
                case 'kakao':
                    // 카카오톡 공유는 Kakao SDK가 필요하지만, 여기서는 링크만 제공
                    if (navigator.share) {
                        navigator.share({
                            title: title,
                            text: text,
                            url: link
                        });
                        return;
                    }
                    alert('카카오톡 공유는 모바일에서만 가능합니다.');
                    return;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${text}%20${encodeURIComponent(link)}`;
                    window.location.href = shareUrl;
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        }

        // 공유 모달 닫기
        function closeShareModal() {
            const modal = document.getElementById('share-modal');
            if (modal) {
                modal.remove();
            }
        }

        // 자막 미리보기 표시/숨김
        function toggleSubtitlePreview(videoId) {
            const preview = document.getElementById(`subtitle-preview-${videoId}`);
            if (preview) {
                if (preview.style.display === 'none') {
                    preview.style.display = 'block';
                    loadSubtitlePreview(videoId);
                } else {
                    preview.style.display = 'none';
                }
            }
        }

        // 자막 미리보기 로드
        function loadSubtitlePreview(videoId) {
            const video = videos.find(v => v.id === videoId);
            if (!video || !video.transcriptions) {
                return;
            }

            const contentEl = document.getElementById(`subtitle-content-${videoId}`);
            if (!contentEl) return;

            // 첫 번째 언어의 자막만 미리보기로 표시 (최대 5개)
            const previews = video.transcriptions.slice(0, 5).map(segment => {
                const text = segment.korean || segment.english || segment[Object.keys(segment).find(k => k !== 'id' && k !== 'startTime' && k !== 'endTime' && k !== 'speaker')] || '';
                const time = formatTime(segment.startTime);
                return `<div class="subtitle-preview-item"><span class="subtitle-time">${time}</span> ${text}</div>`;
            }).join('');

            contentEl.innerHTML = previews || '<div class="subtitle-preview-empty">자막이 없습니다.</div>';
        }

        // 전역 함수로 등록
        window.shareVideo = shareVideo;
        window.copyShareLink = copyShareLink;
        window.shareToSocial = shareToSocial;
        window.closeShareModal = closeShareModal;
        window.toggleSubtitlePreview = toggleSubtitlePreview;
        window.deleteVideo = deleteVideo;

        // 데이터 저장
        function saveData() {
            localStorage.setItem('savedVideos', JSON.stringify(videos));
        }

        // 필터 버튼 이벤트 (DOMContentLoaded 후 실행되도록 보장)
        function initializeFilterButtons() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            if (filterButtons.length === 0) {
                logger.warn('필터 버튼을 찾을 수 없습니다. 잠시 후 다시 시도합니다.');
                // 버튼이 아직 로드되지 않았을 수 있으므로 재시도
                setTimeout(initializeFilterButtons, 100);
                return;
            }
            
            filterButtons.forEach(btn => {
                // 기존 이벤트 리스너 제거 (중복 방지)
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const filter = this.dataset.filter || 'all';
                    
                    // 모든 버튼의 active 클래스 제거
                    document.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    
                    // 클릭된 버튼에 active 클래스 추가
                    this.classList.add('active');
                    
                    // 필터 적용
                    logger.log('필터 변경:', filter);
                    renderVideos(filter);
                });
            });
            
            logger.log('필터 버튼 초기화 완료:', filterButtons.length, '개');
        }
        
        // 필터 버튼 초기화 (DOMContentLoaded 또는 즉시 실행)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFilterButtons);
        } else {
            // DOM이 이미 로드된 경우 즉시 실행
            initializeFilterButtons();
        }

        // 자동 삭제 체크 (만료된 영상 삭제)
        function checkAndDeleteExpired() {
            const now = new Date();
            let deleted = false;
            
            videos = videos.filter(video => {
                if (video.expiresAt || video.expiryDate) {
                    const expiry = new Date(video.expiresAt || video.expiryDate);
                    if (expiry <= now) {
                        deleted = true;
                        return false;
                    }
                }
                return true;
            });
            
            if (deleted) {
                saveData();
                renderVideos();
            }
        }

        // 모달 외부 클릭 시 닫기
        document.getElementById('edit-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeEditModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeEditModal();
            }
        });

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
        
        // URL 파라미터 확인 (저장 완료 후 이동)
        const urlParams = new URLSearchParams(window.location.search);
        const refresh = urlParams.get('refresh');
        const savedVideoId = urlParams.get('saved');
        
        if (refresh === 'true' || savedVideoId) {
            // 강제 새로고침
            logger.log('저장 완료 후 이동 감지, 데이터 새로고침, 영상 ID:', savedVideoId);
            // 즉시 로드
            loadData();
            // IndexedDB 저장 완료를 기다린 후 추가 새로고침 및 하단 스크롤
            setTimeout(() => {
                loadData();
                // URL 정리 (히스토리 업데이트)
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', 'storage.html');
                }
                // 하단으로 스크롤 (최신 영상이 하단에 표시되므로)
                setTimeout(() => {
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 300);
            }, 500);
        }
        
        // 해시가 #bottom이면 하단으로 스크롤
        if (window.location.hash === '#bottom') {
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
                // 해시 제거
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', window.location.pathname + window.location.search);
                }
            }, 1000);
        }
        
        // 디바운스된 데이터 로드 함수
        const debouncedLoadData = debounce(() => {
            loadData();
        }, 300);
        
        // 페이지 포커스 시 데이터 새로고침 (디바운스 적용)
        window.addEventListener('focus', debouncedLoadData);
        
        // 페이지 가시성 변경 시 데이터 새로고침 (디바운스 적용)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                debouncedLoadData();
            }
        });
        
        // 저장 완료 플래그 확인
        const videoSaved = localStorage.getItem('videoSaved');
        if (videoSaved === 'true') {
            const lastSavedVideoId = localStorage.getItem('lastSavedVideoId');
            logger.log('저장 완료 플래그 확인, 영상 ID:', lastSavedVideoId);
            localStorage.removeItem('videoSaved');
            localStorage.removeItem('lastSavedVideoId');
            
            // 즉시 데이터 새로고침
            loadData();
            
            // IndexedDB 저장 완료를 기다린 후 추가 새로고침
            setTimeout(() => {
                loadData();
            }, 1000);
        }
        
        // 비디오 카드 클릭 이벤트 (동적으로 생성된 카드에 이벤트 위임)
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.video-card');
            if (videoCard && !e.target.closest('.video-actions') && !e.target.closest('button')) {
                const videoId = videoCard.dataset.videoId || videoCard.getAttribute('data-video-id');
                if (videoId) {
                    editVideo(videoId);
                }
            }
        });
        
        // Intersection Observer 초기화
        thumbnailLoadObserver = initThumbnailObserver();
        
        // 초기화
        loadData();
        checkAndDeleteExpired();
        initializeRemainingTime();
        
        // 필터 버튼 초기화 (데이터 로드 후)
        requestAnimationFrame(() => {
            initializeFilterButtons();
        });
        
        // 주기적으로 만료된 영상 체크 (1시간마다) - 최적화: 페이지가 보일 때만 실행
        let expiredCheckInterval;
        let refreshInterval;
        
        function startIntervals() {
            // 기존 인터벌 정리
            if (expiredCheckInterval) clearInterval(expiredCheckInterval);
            if (refreshInterval) clearInterval(refreshInterval);
            
            expiredCheckInterval = setInterval(checkAndDeleteExpired, 60 * 60 * 1000);
            
            // 주기적으로 데이터 새로고침 (60초마다로 변경하여 부하 감소) - 페이지가 활성화되어 있을 때만
            refreshInterval = setInterval(() => {
                if (!document.hidden && !isRendering) {
                    debouncedLoadData();
                }
            }, 60000); // 30초 -> 60초로 변경
        }
        
        function stopIntervals() {
            if (expiredCheckInterval) clearInterval(expiredCheckInterval);
            if (refreshInterval) clearInterval(refreshInterval);
        }
        
        // 페이지 가시성 변경 시 인터벌 관리
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopIntervals();
            } else {
                startIntervals();
                // 페이지가 다시 보일 때 즉시 로드 (디바운스 적용)
                debouncedLoadData();
            }
        });
        
        // storage 업데이트 이벤트 리스너 (storage.js에서 발생)
        document.addEventListener('storageUpdated', () => {
            // 저장공간 확장 옵션 구매 후 업데이트
            loadData();
        });
        
        // 정렬 변경 이벤트 리스너
        document.addEventListener('sortChanged', (e) => {
            const sortType = e.detail.sortType;
            const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderVideos(currentFilter);
        });
        
        // renderVideos 함수를 전역으로 노출
        window.renderVideos = renderVideos;
        
        startIntervals();
    