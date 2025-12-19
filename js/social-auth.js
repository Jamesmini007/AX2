        // 소셜 인증 공통 모듈 (최적화)
        (function() {
            'use strict';
            
            // 프로덕션 환경에서 console.log 비활성화
            const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const logger = {
                log: isDev ? console.log.bind(console) : () => {},
                error: console.error.bind(console),
                warn: isDev ? console.warn.bind(console) : () => {}
            };
            
            // 설정 (실제 사용 시 환경 변수나 설정 파일에서 가져와야 함)
            const SOCIAL_CONFIG = {
                google: {
                    clientId: 'YOUR_GOOGLE_CLIENT_ID', // 실제 Google Client ID로 교체 필요
                    scope: 'profile email'
                },
                kakao: {
                    jsKey: 'YOUR_KAKAO_JS_KEY', // 실제 Kakao JavaScript Key로 교체 필요
                    redirectUri: window.location.origin + '/login.html'
                },
                naver: {
                    clientId: 'YOUR_NAVER_CLIENT_ID', // 실제 Naver Client ID로 교체 필요
                    callbackUrl: window.location.origin + '/login.html'
                }
            };
            
            // SDK 로딩 상태 추적
            const sdkStatus = {
                google: false,
                kakao: false,
                naver: false
            };
            
            // 사용자 데이터 저장 함수
            function saveUserData(userData, provider) {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const existingUserIndex = users.findIndex(u => 
                        (u.email && u.email === userData.email) || 
                        (u.provider === provider && u.providerId === userData.providerId)
                    );
                    
                    if (existingUserIndex !== -1) {
                        // 기존 사용자 업데이트
                        users[existingUserIndex] = {
                            ...users[existingUserIndex],
                            ...userData,
                            updatedAt: new Date().toISOString()
                        };
                    } else {
                        // 새 사용자 추가
                        users.push({
                            ...userData,
                            provider: provider,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                    
                    localStorage.setItem('users', JSON.stringify(users));
                    return true;
                } catch (error) {
                    logger.error('사용자 데이터 저장 오류:', error);
                    return false;
                }
            }
            
            // 로그인 상태 저장
            function saveLoginState(user) {
                try {
                    const loginData = {
                        userId: user.id,
                        email: user.email,
                        name: user.name,
                        provider: user.provider || 'email',
                        loginTime: new Date().toISOString()
                    };
                    localStorage.setItem('currentUser', JSON.stringify(loginData));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    // 로그인 버튼 업데이트 (auth-state.js가 로드된 경우)
                    if (window.updateLoginButton) {
                        window.updateLoginButton();
                    }
                    
                    return true;
                } catch (error) {
                    logger.error('로그인 상태 저장 오류:', error);
                    return false;
                }
            }
            
            // Google SDK 로드 (최적화: 동적 로딩)
            function loadGoogleSDK() {
                return new Promise((resolve, reject) => {
                    if (sdkStatus.google) {
                        resolve();
                        return;
                    }
                    
                    if (window.gapi && window.gapi.auth2) {
                        sdkStatus.google = true;
                        resolve();
                        return;
                    }
                    
                    // Google API 스크립트 동적 로드
                    const script = document.createElement('script');
                    script.src = 'https://accounts.google.com/gsi/client';
                    script.async = true;
                    script.defer = true;
                    script.onload = () => {
                        logger.log('Google SDK 로드 완료');
                        sdkStatus.google = true;
                        resolve();
                    };
                    script.onerror = () => {
                        logger.error('Google SDK 로드 실패');
                        reject(new Error('Google SDK 로드 실패'));
                    };
                    document.head.appendChild(script);
                });
            }
            
            // Kakao SDK 로드 (최적화: 동적 로딩)
            function loadKakaoSDK() {
                return new Promise((resolve, reject) => {
                    if (sdkStatus.kakao) {
                        resolve();
                        return;
                    }
                    
                    if (window.Kakao && window.Kakao.isInitialized()) {
                        sdkStatus.kakao = true;
                        resolve();
                        return;
                    }
                    
                    // Kakao SDK 스크립트 동적 로드
                    const script = document.createElement('script');
                    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
                    script.integrity = 'sha384-TiCueOO6HuAI1AiZ8LKvIMLfKpLKY86hKcF84y4s1Pc5R3pYd+Nc+KPI5M9zFz';
                    script.crossOrigin = 'anonymous';
                    script.async = true;
                    script.onload = () => {
                        if (window.Kakao && SOCIAL_CONFIG.kakao.jsKey) {
                            window.Kakao.init(SOCIAL_CONFIG.kakao.jsKey);
                            logger.log('Kakao SDK 로드 및 초기화 완료');
                            sdkStatus.kakao = true;
                            resolve();
                        } else {
                            reject(new Error('Kakao SDK 초기화 실패'));
                        }
                    };
                    script.onerror = () => {
                        logger.error('Kakao SDK 로드 실패');
                        reject(new Error('Kakao SDK 로드 실패'));
                    };
                    document.head.appendChild(script);
                });
            }
            
            // Naver SDK 로드 (최적화: 동적 로딩)
            function loadNaverSDK() {
                return new Promise((resolve, reject) => {
                    if (sdkStatus.naver) {
                        resolve();
                        return;
                    }
                    
                    if (window.naver && window.naver.Login) {
                        sdkStatus.naver = true;
                        resolve();
                        return;
                    }
                    
                    // Naver Login API 스크립트 동적 로드
                    const script = document.createElement('script');
                    script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
                    script.async = true;
                    script.onload = () => {
                        logger.log('Naver SDK 로드 완료');
                        sdkStatus.naver = true;
                        resolve();
                    };
                    script.onerror = () => {
                        logger.error('Naver SDK 로드 실패');
                        reject(new Error('Naver SDK 로드 실패'));
                    };
                    document.head.appendChild(script);
                });
            }
            
            // Google 로그인 (Google Identity Services 사용)
            async function loginWithGoogle() {
                try {
                    await loadGoogleSDK();
                    
                    return new Promise((resolve, reject) => {
                        if (!window.google) {
                            reject(new Error('Google SDK가 로드되지 않았습니다.'));
                            return;
                        }
                        
                        window.google.accounts.id.initialize({
                            client_id: SOCIAL_CONFIG.google.clientId,
                            callback: async (response) => {
                                try {
                                    // JWT 토큰 디코딩 (간단한 버전)
                                    const payload = JSON.parse(atob(response.credential.split('.')[1]));
                                    
                                    const userData = {
                                        id: payload.sub,
                                        name: payload.name || 'Google User',
                                        email: payload.email,
                                        picture: payload.picture,
                                        providerId: payload.sub
                                    };
                                    
                                    if (saveUserData(userData, 'google')) {
                                        saveLoginState(userData);
                                        resolve(userData);
                                    } else {
                                        reject(new Error('사용자 데이터 저장 실패'));
                                    }
                                } catch (error) {
                                    logger.error('Google 로그인 처리 오류:', error);
                                    reject(error);
                                }
                            }
                        });
                        
                        window.google.accounts.id.prompt((notification) => {
                            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                                // 프롬프트가 표시되지 않으면 One Tap 대신 팝업 사용
                                window.google.accounts.oauth2.initTokenClient({
                                    client_id: SOCIAL_CONFIG.google.clientId,
                                    scope: SOCIAL_CONFIG.google.scope,
                                    callback: async (tokenResponse) => {
                                        try {
                                            // 사용자 정보 가져오기
                                            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                                                headers: {
                                                    'Authorization': `Bearer ${tokenResponse.access_token}`
                                                }
                                            });
                                            const userInfo = await userInfoResponse.json();
                                            
                                            const userData = {
                                                id: userInfo.id,
                                                name: userInfo.name || 'Google User',
                                                email: userInfo.email,
                                                picture: userInfo.picture,
                                                providerId: userInfo.id
                                            };
                                            
                                            if (saveUserData(userData, 'google')) {
                                                saveLoginState(userData);
                                                resolve(userData);
                                            } else {
                                                reject(new Error('사용자 데이터 저장 실패'));
                                            }
                                        } catch (error) {
                                            logger.error('Google 사용자 정보 가져오기 오류:', error);
                                            reject(error);
                                        }
                                    }
                                }).requestAccessToken();
                            }
                        });
                    });
                } catch (error) {
                    logger.error('Google 로그인 오류:', error);
                    throw error;
                }
            }
            
            // Kakao 로그인
            async function loginWithKakao() {
                try {
                    await loadKakaoSDK();
                    
                    return new Promise((resolve, reject) => {
                        if (!window.Kakao || !window.Kakao.isInitialized()) {
                            reject(new Error('Kakao SDK가 초기화되지 않았습니다.'));
                            return;
                        }
                        
                        window.Kakao.Auth.login({
                            success: async (authObj) => {
                                try {
                                    // 사용자 정보 가져오기
                                    window.Kakao.API.request({
                                        url: '/v2/user/me',
                                        success: async (res) => {
                                            const userData = {
                                                id: res.id.toString(),
                                                name: res.kakao_account.profile?.nickname || 'Kakao User',
                                                email: res.kakao_account.email || `kakao_${res.id}@kakao.com`,
                                                picture: res.kakao_account.profile?.profile_image_url,
                                                providerId: res.id.toString()
                                            };
                                            
                                            if (saveUserData(userData, 'kakao')) {
                                                saveLoginState(userData);
                                                resolve(userData);
                                            } else {
                                                reject(new Error('사용자 데이터 저장 실패'));
                                            }
                                        },
                                        fail: (err) => {
                                            logger.error('Kakao 사용자 정보 가져오기 오류:', err);
                                            reject(err);
                                        }
                                    });
                                } catch (error) {
                                    logger.error('Kakao 로그인 처리 오류:', error);
                                    reject(error);
                                }
                            },
                            fail: (err) => {
                                logger.error('Kakao 로그인 오류:', err);
                                reject(err);
                            }
                        });
                    });
                } catch (error) {
                    logger.error('Kakao 로그인 오류:', error);
                    throw error;
                }
            }
            
            // Naver 로그인
            async function loginWithNaver() {
                try {
                    await loadNaverSDK();
                    
                    return new Promise((resolve, reject) => {
                        if (!window.naver || !window.naver.Login) {
                            reject(new Error('Naver SDK가 로드되지 않았습니다.'));
                            return;
                        }
                        
                        const naverLogin = new window.naver.LoginWithNaverId({
                            clientId: SOCIAL_CONFIG.naver.clientId,
                            callbackUrl: SOCIAL_CONFIG.naver.callbackUrl,
                            isPopup: false,
                            loginButton: { color: 'green', type: 3, height: 58 }
                        });
                        
                        naverLogin.init();
                        
                        // 로그인 버튼 클릭 시 팝업 열기
                        naverLogin.getLoginStatus((status) => {
                            if (status) {
                                // 이미 로그인된 경우
                                const userData = {
                                    id: naverLogin.user.id,
                                    name: naverLogin.user.name || 'Naver User',
                                    email: naverLogin.user.email || `naver_${naverLogin.user.id}@naver.com`,
                                    picture: naverLogin.user.profile_image,
                                    providerId: naverLogin.user.id
                                };
                                
                                if (saveUserData(userData, 'naver')) {
                                    saveLoginState(userData);
                                    resolve(userData);
                                } else {
                                    reject(new Error('사용자 데이터 저장 실패'));
                                }
                            } else {
                                // 로그인 팝업 열기
                                const popup = window.open(
                                    `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${SOCIAL_CONFIG.naver.clientId}&redirect_uri=${encodeURIComponent(SOCIAL_CONFIG.naver.callbackUrl)}&state=STATE_STRING`,
                    'naverLogin',
                    'width=500,height=600,scrollbars=yes,resizable=yes'
                                );
                                
                                // 팝업에서 로그인 완료 후 처리
                                const checkPopup = setInterval(() => {
                                    if (popup.closed) {
                                        clearInterval(checkPopup);
                                        reject(new Error('로그인이 취소되었습니다.'));
                                    }
                                }, 1000);
                            }
                        });
                    });
                } catch (error) {
                    logger.error('Naver 로그인 오류:', error);
                    throw error;
                }
            }
            
            // 전역 함수로 내보내기
            window.SocialAuth = {
                loginWithGoogle,
                loginWithKakao,
                loginWithNaver,
                loadGoogleSDK,
                loadKakaoSDK,
                loadNaverSDK,
                saveUserData,
                saveLoginState
            };
            
            logger.log('소셜 인증 모듈 로드 완료');
        })();

