        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        let videos = []; // 저장된 실시간 강의 목록
        
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

        // 로컬 스토리지에서 데이터 로드 (실시간 강의 기록)
        function loadData() {
            try {
                const savedLiveLectures = localStorage.getItem('liveLectureVideos');
                
                if (savedLiveLectures) {
                    videos = JSON.parse(savedLiveLectures);
                    logger.log('실시간 강의 데이터 로드 완료:', videos.length, '개');
                } else {
                    videos = [];
                    logger.log('저장된 실시간 강의가 없습니다.');
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

        // 저장공간 대시보드 업데이트
        function updateStorageDashboard() {
            // 기본 제공: 1시간 무료 강의 (1GB)
            const freeStorageGB = 1;
            
            // 현재 사용량 계산
            let totalSizeGB = 0;
            let totalDurationSeconds = 0;
            
            videos.forEach(video => {
                // 파일 크기 계산 (GB 단위)
                if (video.size) {
                    if (video.size < 1) {
                        totalSizeGB += video.size;
                    } else if (video.size < 1024) {
                        totalSizeGB += video.size / 1024;
                    } else if (video.size < 1024 * 1024) {
                        totalSizeGB += video.size / (1024 * 1024);
                    } else if (video.size < 1024 * 1024 * 1024) {
                        totalSizeGB += video.size / (1024 * 1024 * 1024);
                    } else {
                        totalSizeGB += video.size;
                    }
                } else if (video.fileSize) {
                    totalSizeGB += video.fileSize / (1024 * 1024 * 1024);
                }
                
                // 재생 시간 계산
                if (video.duration) {
                    if (video.duration < 1000) {
                        totalDurationSeconds += video.duration;
                    } else {
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
                        <div class="empty-state-text">저장된 실시간 강의가 없습니다</div>
                        <div class="empty-state-hint" style="margin-top: 10px; font-size: 0.85rem; color: #999;">
                            실시간 강의를 시작하고 종료하면 여기에 표시됩니다.
                        </div>
                    </div>
                `;
                return;
            }
            
            logger.log('실시간 강의 렌더링 시작:', videos.length, '개, 필터:', filter);

            // 기본적으로 최근 순으로 정렬
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

                let translationBadge = '';
                if (video.translated) {
                    const targetLangs = video.targetLanguages ? video.targetLanguages.map(l => l.name || l.code).join(', ') : '';
                    translationBadge = `<span class="translation-badge" style="display: inline-block; background: #9c27b0; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px;">번역됨</span>`;
                }
                
                return `
                    <div class="video-card" onclick="viewLiveLecture('${video.id}')" data-video-id="${video.id}" style="cursor: pointer;">
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
                            <div class="video-title">${video.title || '실시간 강의'}${translationBadge}${expiryBadge}</div>
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
                        </div>
                    </div>
                `;
            }).join('');
            
            updateStorageDashboard();
            
            // 비디오 미리보기 로드
            setTimeout(() => {
                loadVideoThumbnails();
            }, 100);
        }
        
        // 비디오 썸네일 로드 (간소화 버전)
        function loadVideoThumbnails() {
            const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
            
            if (thumbnailContainers.length === 0) {
                return;
            }
            
            thumbnailContainers.forEach((container) => {
                const videoId = container.dataset.videoId;
                const videoElement = container.querySelector('.thumbnail-video');
                const placeholder = container.querySelector('.thumbnail-placeholder');
                
                if (!videoElement || !videoId) {
                    return;
                }
                
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
                                videoElement.src = url;
                                videoElement.addEventListener('loadedmetadata', () => {
                                    if (videoElement.duration > 0) {
                                        videoElement.currentTime = Math.min(Math.max(1, videoElement.duration * 0.15), videoElement.duration * 0.5);
                                    }
                                }, { once: true });
                                
                                videoElement.addEventListener('seeked', () => {
                                    if (placeholder) {
                                        placeholder.style.display = 'none';
                                    }
                                    videoElement.style.display = 'block';
                                }, { once: true });
                            } catch (error) {
                                logger.error('Blob 생성 오류:', error);
                            }
                        }
                    };
                };
            });
        }

        // 날짜 포맷
        function formatDate(date) {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
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

        // 실시간 강의 보기
        function viewLiveLecture(videoId) {
            // 실시간 강의 재생 페이지로 이동 (나중에 구현)
            alert('실시간 강의 재생 기능은 곧 제공될 예정입니다.');
        }
        window.viewLiveLecture = viewLiveLecture;

        // 영상 다운로드
        function downloadVideo(index) {
            if (event) {
                event.stopPropagation();
            }
            const video = videos[index];
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
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
                        a.download = video.fileName || video.title || 'live_lecture.mp4';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert(`"${video.title || '실시간 강의'}" 다운로드가 시작되었습니다.`);
                    } else {
                        alert('파일을 찾을 수 없습니다.');
                    }
                };
            };
        }
        window.downloadVideo = downloadVideo;

        // 영상 삭제
        function deleteVideo(index) {
            if (event) {
                event.stopPropagation();
            }
            
            const video = videos[index];
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            if (!confirm(`"${video.title || '실시간 강의'}" 영상을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
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
            };
            
            // localStorage에서 삭제
            videos.splice(index, 1);
            saveData();
            renderVideos();
            
            alert('영상이 삭제되었습니다.');
        }
        window.deleteVideo = deleteVideo;

        // 영상 공유 기능
        function shareVideo(videoId) {
            const video = videos.find(v => v.id === videoId);
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }

            const shareLink = `${window.location.origin}${window.location.pathname}?share=${videoId}`;
            navigator.clipboard.writeText(shareLink).then(() => {
                alert('공유 링크가 클립보드에 복사되었습니다.');
            }).catch(() => {
                alert('공유 링크 복사에 실패했습니다.');
            });
        }
        window.shareVideo = shareVideo;

        // 데이터 저장
        function saveData() {
            localStorage.setItem('liveLectureVideos', JSON.stringify(videos));
        }

        // 필터 버튼 이벤트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderVideos(this.dataset.filter);
            });
        });

        // 모달 관련 함수들 (편집 모달은 나중에 구현)
        function closeEditModal() {
            const modal = document.getElementById('edit-modal');
            if (modal) {
                modal.classList.remove('show');
            }
        }
        window.closeEditModal = closeEditModal;

        function saveEdit() {
            alert('편집 기능은 곧 제공될 예정입니다.');
        }
        window.saveEdit = saveEdit;

        // 초기화
        loadData();

