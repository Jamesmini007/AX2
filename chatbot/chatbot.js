// 챗봇 데이터 및 상태 관리
let chatbotData = null;
let chatbotState = {
    isOpen: false,
    messages: [],
    currentButtons: []
};

// 이미지 경로 동적 설정
function getChatbotImagePath() {
    const isInHtmlFolder = window.location.pathname.includes('/html/');
    return isInHtmlFolder ? '../assets/image/chatbot.png' : 'assets/image/chatbot.png';
}

// HTML 이스케이프 함수
function escapeHTML(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 챗봇 초기화
function initChatbot() {
    try {
        // chatbotData가 전역 변수로 로드되었는지 확인
        if (typeof window.chatbotData !== 'undefined') {
            chatbotData = window.chatbotData;
        } else {
            // data.js가 로드되지 않은 경우
            console.error('chatbotData가 로드되지 않았습니다. data.js 파일이 포함되어 있는지 확인하세요.');
            const messagesContainer = document.querySelector('.chatbot-messages');
            if (messagesContainer) {
                addBotMessage('죄송합니다. 챗봇 데이터를 불러올 수 없습니다.\n\n페이지를 새로고침해주세요.');
            }
            return;
        }
        
        if (!chatbotData || !chatbotData.greeting) {
            throw new Error('챗봇 데이터 형식이 올바르지 않습니다.');
        }
        
        console.log('챗봇 데이터 로드 성공');
        
        // 헤더 상태 업데이트
        const statusElement = document.querySelector('.chatbot-status span:last-child');
        if (statusElement && chatbotData.status) {
            statusElement.textContent = chatbotData.status;
        }
        
        // 초기 인사 메시지 추가
        addBotMessage(chatbotData.greeting);
        
        // 약간의 지연 후 버튼 표시 (자연스러운 느낌)
        setTimeout(() => {
            showInitialButtons();
        }, 300);
    } catch (error) {
        console.error('챗봇 초기화 실패:', error);
        const messagesContainer = document.querySelector('.chatbot-messages');
        if (messagesContainer) {
            addBotMessage('죄송합니다. 챗봇을 초기화하는 중 오류가 발생했습니다.\n\n페이지를 새로고침해주세요.');
        }
    }
}

// 챗봇 토글
function toggleChatbot() {
    const window = document.querySelector('.chatbot-window');
    const toggle = document.querySelector('.chatbot-toggle');
    
    chatbotState.isOpen = !chatbotState.isOpen;
    
    if (chatbotState.isOpen) {
        window.classList.add('active');
        toggle.classList.add('active');
    } else {
        window.classList.remove('active');
        toggle.classList.remove('active');
    }
}

// 챗봇 닫기
function closeChatbot() {
    chatbotState.isOpen = false;
    document.querySelector('.chatbot-window').classList.remove('active');
    document.querySelector('.chatbot-toggle').classList.remove('active');
}

// 봇 메시지 추가
function addBotMessage(text, showButtonsAfter = false) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    
    if (!messagesContainer) {
        console.error('메시지 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    
    // 줄바꿈을 <br>로 변환하고 HTML 태그 이스케이프
    const safeText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    
    const imagePath = getChatbotImagePath();
    messageDiv.innerHTML = `
        <div class="chatbot-message-avatar"><img src="${imagePath}" alt="챗봇" /></div>
        <div class="chatbot-message-bubble">
            <div class="chatbot-answer-content">${safeText}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // 버튼을 메시지 아래에 추가할 경우
    if (showButtonsAfter) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'chatbot-message-buttons';
        messagesContainer.appendChild(buttonContainer);
    }
    
    scrollToBottom();
    
    // 상태 저장
    chatbotState.messages.push({
        type: 'bot',
        text: text
    });
}

// 사용자 메시지 추가
function addUserMessage(text) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user';
    
    messageDiv.innerHTML = `
        <div class="chatbot-message-avatar">👤</div>
        <div class="chatbot-message-bubble">${text}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // 상태 저장
    chatbotState.messages.push({
        type: 'user',
        text: text
    });
}

// 초기 질문 버튼 표시
function showInitialButtons() {
    // 기존 하단 버튼 영역 숨기기
    const bottomButtonsContainer = document.querySelector('.chatbot-buttons .chatbot-button-list');
    if (bottomButtonsContainer) {
        bottomButtonsContainer.innerHTML = '';
    }
    
    // 기존 버튼 컨테이너 제거
    const existingButtons = document.querySelectorAll('.chatbot-message-buttons');
    existingButtons.forEach(btn => btn.remove());
    
    // 메시지 영역에 새 버튼 컨테이너 생성
    const messagesContainer = document.querySelector('.chatbot-messages');
    if (!messagesContainer) {
        console.error('메시지 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'chatbot-message-buttons';
    messagesContainer.appendChild(buttonsContainer);
    
    if (!chatbotData || !chatbotData.questions) {
        console.error('챗봇 데이터가 로드되지 않았습니다.');
        return;
    }
    
    // 주요 질문들 표시 (아이콘과 색상 포함) - 2x2 그리드
    const mainQuestions = [
        { id: 'service', text: '서비스 소개', icon: '💡', color: 'blue' },
        { id: 'features', text: '주요 기능', icon: '⚙️', color: 'green' },
        { id: 'pricing', text: '요금 안내', icon: '💰', color: 'orange' },
        { id: 'how-to-start', text: '시작하기', icon: '🚀', color: 'purple' },
        { id: 'languages', text: '지원 언어', icon: '🌐', color: 'blue' },
        { id: 'accuracy', text: '번역 정확도', icon: '🎯', color: 'green' },
        { id: 'session-save', text: '세션 저장', icon: '💾', color: 'orange' },
        { id: 'payment-methods', text: '결제 수단', icon: '💳', color: 'purple' },
        { id: 'contact', text: '상담원 연결', icon: '💬', color: 'blue' }
    ];
    
    mainQuestions.forEach(q => {
        const button = createButton(q.text, () => handleQuestionClick(q.id), q.icon, q.color);
        buttonsContainer.appendChild(button);
    });
    
    scrollToBottom();
    chatbotState.currentButtons = mainQuestions;
}

// 질문 버튼 클릭 처리
function handleQuestionClick(questionId) {
    if (!chatbotData || !chatbotData.questions) {
        addBotMessage('죄송합니다. 챗봇 데이터를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    const question = chatbotData.questions.find(q => q.id === questionId);
    
    if (!question) {
        addBotMessage('죄송합니다. 해당 질문을 찾을 수 없습니다.');
        return;
    }
    
    // 사용자 메시지 추가
    addUserMessage(question.question);
    
    // 약간의 지연 후 답변 (자연스러운 느낌)
    setTimeout(() => {
        // 답변 추가
        addBotMessage(question.answer);
        
        // 추가 버튼 표시
        showAnswerButtons(question);
    }, 300);
}

// 답변 후 버튼 표시
function showAnswerButtons(question) {
    // 기존 버튼 컨테이너 제거
    const existingButtons = document.querySelectorAll('.chatbot-message-buttons');
    existingButtons.forEach(btn => btn.remove());
    
    // 메시지 영역에 새 버튼 컨테이너 생성
    const messagesContainer = document.querySelector('.chatbot-messages');
    if (!messagesContainer) {
        console.error('메시지 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'chatbot-message-buttons';
    messagesContainer.appendChild(buttonsContainer);
    
    // 관련 질문들 찾기
    const relatedQuestions = chatbotData.questions.filter(q => 
        q.category === question.category && q.id !== question.id
    ).slice(0, 3);
    
    // 관련 질문 버튼 추가
    if (relatedQuestions.length > 0) {
        const colors = ['blue', 'green', 'orange', 'purple'];
        relatedQuestions.forEach((q, index) => {
            const color = colors[index % colors.length];
            const button = createButton(q.question, () => handleQuestionClick(q.id), '💬', color);
            buttonsContainer.appendChild(button);
        });
    }
    
    // 상담원 연결 버튼 표시
    if (question.showContact) {
        // 문의 페이지 경로 동적 설정
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        const ax2HomePath = isInHtmlFolder ? '../ax2_home/' : 'ax2_home/';
        const inquiryUrl = ax2HomePath + 'poem/index.html';
        
        const contactButton = createButton('상담원 연결하기', () => {
            if (question.contactUrl) {
                // 외부 URL인 경우 새 창으로 열기
                if (question.contactUrl.startsWith('http://') || question.contactUrl.startsWith('https://')) {
                    window.open(question.contactUrl, '_blank');
                } else {
                    // 상대 경로인 경우 현재 창에서 이동
                    window.location.href = question.contactUrl;
                }
            } else {
                // contactUrl이 없으면 문의 페이지로 이동
                window.location.href = inquiryUrl;
            }
        }, '💬', 'blue');
        
        buttonsContainer.appendChild(contactButton);
    }
    
    // 항상 "다른 질문하기" 옵션 제공
    const moreButton = createButton('다른 질문하기', () => resetToMain(), '🔄', 'blue');
    buttonsContainer.appendChild(moreButton);
    
    scrollToBottom();
    chatbotState.currentButtons = relatedQuestions;
}

// 메인 화면으로 리셋
function resetToMain() {
    // 기존 버튼 컨테이너 제거
    const existingButtons = document.querySelectorAll('.chatbot-message-buttons');
    existingButtons.forEach(btn => btn.remove());
    
    // 메시지 영역에 새 버튼 컨테이너 생성
    const messagesContainer = document.querySelector('.chatbot-messages');
    if (!messagesContainer) {
        console.error('메시지 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'chatbot-message-buttons';
    messagesContainer.appendChild(buttonsContainer);
    
    // 초기 질문 버튼들 표시
    const mainQuestions = [
        { id: 'service', text: '서비스 소개', icon: '💡', color: 'blue' },
        { id: 'features', text: '주요 기능', icon: '⚙️', color: 'green' },
        { id: 'pricing', text: '요금 안내', icon: '💰', color: 'orange' },
        { id: 'how-to-start', text: '시작하기', icon: '🚀', color: 'purple' },
        { id: 'languages', text: '지원 언어', icon: '🌐', color: 'blue' },
        { id: 'accuracy', text: '번역 정확도', icon: '🎯', color: 'green' },
        { id: 'session-save', text: '세션 저장', icon: '💾', color: 'orange' },
        { id: 'payment-methods', text: '결제 수단', icon: '💳', color: 'purple' },
        { id: 'contact', text: '상담원 연결', icon: '💬', color: 'blue' }
    ];
    
    mainQuestions.forEach(q => {
        const button = createButton(q.text, () => handleQuestionClick(q.id), q.icon, q.color);
        buttonsContainer.appendChild(button);
    });
    
    scrollToBottom();
    chatbotState.currentButtons = mainQuestions;
}

// 버튼 생성
function createButton(text, onClick, icon = null, color = 'blue') {
    const button = document.createElement('button');
    button.className = `chatbot-button ${color}`;
    
    if (icon) {
        // 이모지나 유니코드 기호인 경우 (⚙️, 💡, 🚀 등)
        if (icon.match(/[\u{1F300}-\u{1F9FF}]/u) || icon.match(/[\u2600-\u26FF]/u) || icon.length === 1) {
            button.innerHTML = `
                <span class="chatbot-button-icon">${icon}</span>
                <span style="line-height: 1.4;">${escapeHTML(text)}</span>
            `;
        } else {
            // Font Awesome 아이콘인 경우
            button.innerHTML = `
                <i class="${icon} chatbot-button-icon"></i>
                <span style="line-height: 1.4;">${escapeHTML(text)}</span>
            `;
        }
    } else {
        // 아이콘 없이 텍스트만
        button.innerHTML = `<span style="line-height: 1.4;">${escapeHTML(text)}</span>`;
    }
    
    button.onclick = function(e) {
        e.stopPropagation(); // 이벤트 버블링 방지
        onClick();
    };
    return button;
}

// 스크롤 하단으로
function scrollToBottom() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 챗봇 HTML 구조 생성
    const imagePath = getChatbotImagePath();
    const chatbotHTML = `
        <div class="chatbot-container">
            <button class="chatbot-toggle" onclick="toggleChatbot()" aria-label="챗봇 열기">
                <i class="fas fa-comments"></i>
            </button>
            <div class="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar"><img src="${imagePath}" alt="챗봇" /></div>
                        <div class="chatbot-header-text">
                            <div class="chatbot-service-name">CAPTION 고객센터</div>
                            <div class="chatbot-status">
                                <span class="chatbot-status-dot"></span>
                                <span>몇 분 내 답변 가능</span>
                            </div>
                        </div>
                    </div>
                    <button class="chatbot-close" onclick="closeChatbot()" aria-label="챗봇 닫기">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-buttons">
                    <div class="chatbot-button-list"></div>
                </div>
                <div class="chatbot-input-area">
                    <div class="chatbot-input-placeholder">
                        <i class="fas fa-comment"></i>
                        <span>버튼을 클릭하여 질문하세요</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 챗봇을 body에 추가
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // data.js가 로드되었는지 확인 후 초기화
    // data.js가 로드되면 window.chatbotData가 설정됨
    if (typeof window.chatbotData !== 'undefined') {
        initChatbot();
    } else {
        // data.js가 아직 로드되지 않은 경우, 약간의 지연 후 재시도
        setTimeout(function() {
            if (typeof window.chatbotData !== 'undefined') {
                initChatbot();
            } else {
                console.error('chatbotData를 찾을 수 없습니다. data.js 파일이 로드되었는지 확인하세요.');
                const messagesContainer = document.querySelector('.chatbot-messages');
                if (messagesContainer) {
                    addBotMessage('죄송합니다. 챗봇 데이터를 불러올 수 없습니다.\n\n페이지를 새로고침해주세요.');
                }
            }
        }, 100);
    }
    
    // 외부 클릭 시 닫기 (토글 버튼 및 챗봇 내부 요소 제외)
    document.addEventListener('click', function(e) {
        const container = document.querySelector('.chatbot-container');
        const window = document.querySelector('.chatbot-window');
        const toggle = document.querySelector('.chatbot-toggle');
        
        // 챗봇 내부 요소인지 확인 (버튼, 메시지 등)
        const isInsideChatbot = container && container.contains(e.target);
        const isToggleButton = toggle && toggle.contains(e.target);
        const isChatbotButton = e.target.closest('.chatbot-button') || e.target.closest('.chatbot-contact-button');
        
        if (chatbotState.isOpen && 
            !isInsideChatbot && 
            !isToggleButton &&
            !isChatbotButton) {
            closeChatbot();
        }
    });
});

// 전역 함수로 노출
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;

