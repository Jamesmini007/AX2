        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        let videos = []; // 저장된 영상 목록
        
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
                updateStorageDashboard();
            } catch (error) {
                logger.error('데이터 로드 오류:', error);
                videos = [];
                renderVideos();
                updateStorageDashboard();
            }
        }

        // 저장공간 대시보드 업데이트 (최적화 및 실제 데이터 반영)
        function updateStorageDashboard() {
            // 기본 제공: 1시간 무료 강의 (1GB)
            const freeStorageGB = 1;
            
            // 현재 사용량 계산
            let totalSizeGB = 0;
            let totalDurationSeconds = 0;
            
            videos.forEach(video => {
                // 파일 크기 계산 (GB 단위)
                if (video.size) {
                    // size가 이미 GB 단위인지 확인
                    if (video.size < 1) {
                        // 1보다 작으면 GB 단위로 간주
                        totalSizeGB += video.size;
                    } else if (video.size < 1024) {
                        // 1~1024 사이면 MB로 간주하고 GB로 변환
                        totalSizeGB += video.size / 1024;
                    } else if (video.size < 1024 * 1024) {
                        // KB로 간주하고 GB로 변환
                        totalSizeGB += video.size / (1024 * 1024);
                    } else if (video.size < 1024 * 1024 * 1024) {
                        // 바이트로 간주하고 GB로 변환
                        totalSizeGB += video.size / (1024 * 1024 * 1024);
                    } else {
                        // 이미 GB 단위
                        totalSizeGB += video.size;
                    }
                } else if (video.fileSize) {
                    // fileSize가 있으면 바이트 단위로 간주하고 GB로 변환
                    totalSizeGB += video.fileSize / (1024 * 1024 * 1024);
                }
                
                // 재생 시간 계산 (초 단위로 저장되어 있다고 가정)
                if (video.duration) {
                    // duration이 초 단위인지 분 단위인지 확인
                    // 일반적으로 비디오 duration은 초 단위
                    if (video.duration < 1000) {
                        // 1000보다 작으면 초 단위로 간주
                        totalDurationSeconds += video.duration;
                    } else {
                        // 1000보다 크면 밀리초 단위로 간주하고 초로 변환
                        totalDurationSeconds += video.duration / 1000;
                    }
                }
                
            });
            
            // GB로 변환 및 제한
            const usedGB = Math.min(totalSizeGB, freeStorageGB);
            const usedPercentage = Math.min(100, (usedGB / freeStorageGB) * 100);
            
            // 초를 분으로 변환
            const totalDurationMinutes = Math.floor(totalDurationSeconds / 60);
            const totalDurationHours = Math.floor(totalDurationMinutes / 60);
            const remainingMinutes = totalDurationMinutes % 60;
            
            // UI 업데이트
            const storageUsedEl = document.getElementById('storage-used');
            const storageTotalEl = document.getElementById('storage-total');
            const storageProgressFillEl = document.getElementById('storage-progress-fill');
            const storagePercentageEl = document.getElementById('storage-percentage');
            const totalVideosEl = document.getElementById('total-videos');
            const totalDurationEl = document.getElementById('total-duration');
            
            if (storageUsedEl) {
                storageUsedEl.textContent = usedGB.toFixed(2) + ' GB';
            }
            if (storageTotalEl) {
                storageTotalEl.textContent = freeStorageGB + ' GB';
            }
            if (storageProgressFillEl) {
                storageProgressFillEl.style.width = usedPercentage + '%';
                // 사용량에 따라 색상 변경
                if (usedPercentage >= 90) {
                    storageProgressFillEl.style.background = '#f44336';
                } else if (usedPercentage >= 70) {
                    storageProgressFillEl.style.background = '#ff9800';
                } else {
                    storageProgressFillEl.style.background = '#4caf50';
                }
            }
            if (storagePercentageEl) {
                storagePercentageEl.textContent = usedPercentage.toFixed(1) + '% 사용';
            }
            if (totalVideosEl) {
                totalVideosEl.textContent = videos.length;
            }
            if (totalDurationEl) {
                if (totalDurationHours > 0) {
                    totalDurationEl.textContent = totalDurationHours + '시간 ' + remainingMinutes + '분';
                } else if (totalDurationMinutes > 0) {
                    totalDurationEl.textContent = totalDurationMinutes + '분';
                } else {
                    totalDurationEl.textContent = '0분';
                }
            }
            
            logger.log('저장공간 대시보드 업데이트:', {
                totalVideos: videos.length,
                usedGB: usedGB.toFixed(2),
                totalDuration: `${totalDurationHours}시간 ${remainingMinutes}분`
            });
        }

        // 영상 목록 렌더링
        function renderVideos(filter = 'all') {
            const videoGrid = document.getElementById('video-grid');
            
            if (!videoGrid) {
                logger.error('video-grid 요소를 찾을 수 없습니다.');
                return;
            }
            
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
                return;
            }
            
            logger.log('영상 렌더링 시작:', videos.length, '개, 필터:', filter);

            // 기본적으로 최근 순으로 정렬 (savedAt 또는 createdAt 기준 내림차순)
            let sortedVideos = videos.slice().sort((a, b) => {
                const dateA = a.savedAt ? new Date(a.savedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
                const dateB = b.savedAt ? new Date(b.savedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
                return dateB - dateA;
            });
            
            let filteredVideos = sortedVideos;
            
            if (filter === 'recent') {
                filteredVideos = sortedVideos.slice(0, 10);
            } else if (filter === 'expiring') {
                const now = new Date();
                filteredVideos = sortedVideos.filter(video => {
                    if (!video.expiryDate) return false;
                    const expiry = new Date(video.expiryDate);
                    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                });
            }

            // 원본 배열에서의 인덱스를 찾기 위해 ID로 매핑
            const videoIdMap = new Map();
            videos.forEach((v, idx) => videoIdMap.set(v.id, idx));

            videoGrid.innerHTML = filteredVideos.map((video) => {
                const originalIndex = videoIdMap.get(video.id);
                const savedDate = new Date(video.savedAt || video.createdAt || Date.now());
                const expiryDate = video.expiryDate ? new Date(video.expiryDate) : null;
                const now = new Date();
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
                
                return `
                    <div class="video-card" onclick="editVideo('${video.id}')" data-video-id="${video.id}" style="cursor: pointer;">
                        <div class="video-thumbnail" data-video-id="${video.id}">
                            <video class="thumbnail-video" preload="metadata" muted>
                                <source src="" type="video/mp4">
                            </video>
                            <div class="thumbnail-placeholder">
                                <i class="fas fa-video" style="font-size: 2rem; color: #999;"></i>
                                <div style="margin-top: 8px; font-size: 14px; color: #999;">영상 로딩 중...</div>
                            </div>
                            <div class="video-duration">${formatDuration(video.duration || 0)}</div>
                            ${video.translated ? '<div style="position: absolute; top: 8px; right: 8px; background: rgba(156, 39, 176, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">번역 완료</div>' : ''}
                            <div class="play-overlay">
                                <i class="fas fa-play" style="font-size: 2rem; color: white;"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <div class="video-title">${video.title}${translationBadge}${expiryBadge}</div>
                            ${video.description ? `<div class="video-description" style="font-size: 13px; color: #666666; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${video.description}</div>` : ''}
                            <div class="video-meta">
                                저장일: ${formatDate(savedDate)}<br>
                                크기: ${(video.size || 0).toFixed(2)} GB
                                ${video.targetLanguages && video.targetLanguages.length > 0 ? `<br>번역 언어: ${video.targetLanguages.map(l => l.name || l.code).join(', ')}` : ''}
                                ${video.category ? `<br>카테고리: ${getCategoryName(video.category)}` : ''}
                            </div>
                            <div class="video-actions" onclick="event.stopPropagation()">
                                <button class="action-btn share" onclick="event.stopPropagation(); shareVideo('${video.id}')" title="공유">
                                    <i class="fas fa-share-alt"></i>
                                    <span>공유</span>
                                </button>
                                <button class="action-btn primary" onclick="event.stopPropagation(); downloadVideo(${originalIndex})">다운로드</button>
                                <button class="action-btn danger" onclick="event.stopPropagation(); deleteVideo(${originalIndex})">삭제</button>
                            </div>
                            <div class="subtitle-preview" id="subtitle-preview-${video.id}" style="display: none;">
                                <div class="subtitle-preview-header">
                                    <i class="fas fa-closed-captioning"></i>
                                    <span>실시간 번역·자막</span>
                                </div>
                                <div class="subtitle-preview-content" id="subtitle-content-${video.id}">
                                    <!-- 자막이 여기에 표시됩니다 -->
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // 렌더링 후 저장공간 대시보드 업데이트
            updateStorageDashboard();
            
            // 비디오 미리보기 로드 (즉시 로드 시도)
            setTimeout(() => {
                loadVideoThumbnails();
            }, 100);
            
            // 추가로 1초 후에도 한 번 더 시도 (IndexedDB 저장 완료 대기)
            setTimeout(() => {
                const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
                thumbnailContainers.forEach((container) => {
                    const videoElement = container.querySelector('.thumbnail-video');
                    const placeholder = container.querySelector('.thumbnail-placeholder');
                    // placeholder가 여전히 보이면 재시도
                    if (placeholder && placeholder.style.display !== 'none' && videoElement) {
                        const videoId = container.dataset.videoId;
                        logger.log('썸네일 재시도 (IndexedDB 저장 완료 대기):', videoId);
                        loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                    }
                });
            }, 1000);
            
            // 추가로 3초 후에도 한 번 더 시도 (최종 재시도)
            setTimeout(() => {
                const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
                thumbnailContainers.forEach((container) => {
                    const videoElement = container.querySelector('.thumbnail-video');
                    const placeholder = container.querySelector('.thumbnail-placeholder');
                    // placeholder가 여전히 보이면 재시도
                    if (placeholder && placeholder.style.display !== 'none' && videoElement) {
                        const videoId = container.dataset.videoId;
                        logger.log('썸네일 최종 재시도:', videoId);
                        loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                    }
                });
            }, 3000);
        }
        
        // 비디오 썸네일 로드 (최적화 및 재시도 로직 추가)
        function loadVideoThumbnails() {
            const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
            
            if (thumbnailContainers.length === 0) {
                logger.log('썸네일 컨테이너를 찾을 수 없습니다.');
                return;
            }
            
            logger.log('썸네일 로드 시작:', thumbnailContainers.length, '개');
            
            // 각 썸네일을 순차적으로 로드 (너무 많은 동시 요청 방지)
            thumbnailContainers.forEach((container, index) => {
                const videoId = container.dataset.videoId;
                const videoElement = container.querySelector('.thumbnail-video');
                const placeholder = container.querySelector('.thumbnail-placeholder');
                
                if (!videoElement || !videoId) {
                    logger.warn('썸네일 요소를 찾을 수 없습니다:', videoId);
                    return;
                }
                
                // 약간의 지연을 두어 순차 로드 (성능 최적화)
                // 첫 번째 썸네일(최신 영상)은 즉시 로드 시도
                const delay = index === 0 ? 0 : index * 100;
                setTimeout(() => {
                    loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                }, delay);
            });
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
                            setupVideoThumbnail(url);
                        } catch (error) {
                            logger.error('Blob 생성 오류:', error);
                            // localStorage의 videoUrl로 fallback
                            tryLoadFromLocalStorage();
                        }
                    } else {
                        // IndexedDB에 없으면 localStorage의 videoUrl 사용 또는 재시도
                        if (retryCount < maxRetries) {
                            logger.log(`IndexedDB에 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                            setTimeout(() => {
                                loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                            }, 1000 * (retryCount + 1));
                        } else {
                            tryLoadFromLocalStorage();
                        }
                    }
                };
                
                getRequest.onerror = () => {
                    logger.error('IndexedDB 조회 오류:', videoId);
                    if (retryCount < maxRetries) {
                        setTimeout(() => {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                        }, 1000 * (retryCount + 1));
                    } else {
                        tryLoadFromLocalStorage();
                    }
                };
            };
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패');
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                    }, 1000 * (retryCount + 1));
                } else {
                    tryLoadFromLocalStorage();
                }
            };
            
            // localStorage에서 videoUrl 로드 시도
            function tryLoadFromLocalStorage() {
                const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                const video = savedVideos.find(v => v.id === videoId);
                
                if (video && video.videoUrl) {
                    // Blob URL이 만료되었을 수 있으므로 확인
                    if (video.videoUrl.startsWith('blob:')) {
                        setupVideoThumbnail(video.videoUrl);
                    } else {
                        // 일반 URL인 경우
                        setupVideoThumbnail(video.videoUrl);
                    }
                } else {
                    // 재시도 로직: IndexedDB 저장이 아직 완료되지 않았을 수 있음
                    if (retryCount < maxRetries) {
                        logger.log(`localStorage에도 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                        setTimeout(() => {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                        }, 1000 * (retryCount + 1));
                    } else {
                        showError('영상 없음');
                    }
                }
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
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
        function downloadVideo(index) {
            if (event) {
                event.stopPropagation(); // 카드 클릭 이벤트 방지
            }
            const video = videos[index];
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // IndexedDB에서 파일 가져오기
            const request = indexedDB.open('AX2_Videos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readonly');
                const store = transaction.objectStore('videos');
                const getRequest = store.get(video.id);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        const blob = new Blob([getRequest.result.data], { type: getRequest.result.type });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = video.fileName || video.title || 'video.mp4';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert(`"${video.title}" 다운로드가 시작되었습니다.`);
                    } else {
                        alert('파일을 찾을 수 없습니다.');
                    }
                };
                
                getRequest.onerror = () => {
                    alert('다운로드 중 오류가 발생했습니다.');
                };
            };
            
            request.onerror = () => {
                alert('저장소에 접근할 수 없습니다.');
            };
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

        // 필터 버튼 이벤트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderVideos(this.dataset.filter);
            });
        });

        // 자동 삭제 체크 (만료된 영상 삭제)
        function checkAndDeleteExpired() {
            const now = new Date();
            let deleted = false;
            
            videos = videos.filter(video => {
                if (video.expiryDate) {
                    const expiry = new Date(video.expiryDate);
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
        
        // URL 파라미터 확인 (저장 완료 후 이동)
        const urlParams = new URLSearchParams(window.location.search);
        const refresh = urlParams.get('refresh');
        const savedVideoId = urlParams.get('saved');
        
        if (refresh === 'true' || savedVideoId) {
            // 강제 새로고침
            logger.log('저장 완료 후 이동 감지, 데이터 새로고침, 영상 ID:', savedVideoId);
            // 즉시 로드
            loadData();
            // IndexedDB 저장 완료를 기다린 후 추가 새로고침
            setTimeout(() => {
                loadData();
                // URL 정리 (히스토리 업데이트)
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', 'mypage.html');
                }
            }, 500);
        }
        
        // 페이지 포커스 시 데이터 새로고침
        window.addEventListener('focus', () => {
            loadData();
        });
        
        // 페이지 가시성 변경 시 데이터 새로고침
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                loadData();
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
        
        // 초기화
        loadData();
        checkAndDeleteExpired();
        initializeRemainingTime();
        
        // 주기적으로 만료된 영상 체크 (1시간마다) - 최적화: 페이지가 보일 때만 실행
        let expiredCheckInterval;
        let refreshInterval;
        
        function startIntervals() {
            // 기존 인터벌 정리
            if (expiredCheckInterval) clearInterval(expiredCheckInterval);
            if (refreshInterval) clearInterval(refreshInterval);
            
            expiredCheckInterval = setInterval(checkAndDeleteExpired, 60 * 60 * 1000);
            
            // 주기적으로 데이터 새로고침 (30초마다) - 페이지가 활성화되어 있을 때만
            refreshInterval = setInterval(() => {
                if (!document.hidden) {
                    loadData();
                }
            }, 30000);
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
                loadData(); // 페이지가 다시 보일 때 즉시 로드
            }
        });
        
        startIntervals();
    