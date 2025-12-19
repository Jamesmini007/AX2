// 다국어 지원 (i18n - internationalization)
(function() {
    'use strict';

    // 번역 데이터
    const translations = {
        ko: {
            // 네비게이션
            'nav.subtitle': '자막생성',
            'nav.pricing': '크레딧/충전',
            'nav.guide': '사용방법',
            'nav.login': '로그인',
            'nav.signup': '가입하기',
            'nav.logout': '로그아웃',
            'nav.mywork': '나의 작업',
            'nav.remaining': '분 남음',
            
            // 더보기 메뉴
            'menu.products': '기타 제품',
            'menu.subtitle_gen': '자막 생성',
            'menu.subtitle_desc': '영상 자막 자동 생성',
            'menu.lecture': '실시간 번역',
            'menu.lecture_desc': '라이브 번역 및 자막',
            'menu.price': '가격',
            'menu.security': '보안',
            'menu.features': '기능',
            'menu.about': '회사 소개',
            'menu.help': '도움',
            'menu.language': '언어',
            'menu.faq': '자주 묻는 질문',
            'menu.tools': '도구',
            'menu.legal': '법률',
            'menu.privacy': '개인정보보호',
            'menu.contact': '문의',
            
            // 메인 페이지
            'main.title': '영상 자막 자동 생성',
            'main.subtitle': '영상 자막을 정확하고 빠르게 생성하세요.',
            'main.dropzone': '여기로 파일을 드래그하거나 클릭하세요',
            'main.supported': '지원 형식: MP4, AVI, MOV, MKV (최대 500MB)',
            
            // 드롭다운 메뉴
            'dropdown.edit': '정보수정',
            'dropdown.password': '비밀번호변경',
            'dropdown.payment': '결제정보',
            
            // 공통
            'common.free': 'Free',
            'common.student': '학생',
            'common.general': '일반',
            'common.pro': '프로',
            
            // index.html (메인 페이지)
            'index.title': '영상 자막 자동 생성',
            'index.subtitle': '영상 자막을 정확하고 빠르게 생성하세요.',
            'index.dropzone': '여기로 파일을 드래그하거나 클릭하세요',
            'index.fileinfo': 'MP4, MOV, AVI (최대 2GB)',
            'index.settings': '번역 설정',
            'index.original': '원본 언어',
            'index.target': '번역 언어',
            'index.autodetect': '자동 감지',
            'index.generate': '자막 생성',
            
            // guide.html (사용방법)
            'guide.title': '사용방법',
            'guide.subtitle.title': '자막 생성하기',
            'guide.step1.title': '영상 업로드',
            'guide.step1.desc': '자막을 생성할 영상 파일을 드래그 앤 드롭하거나, 파일 선택 버튼을 클릭하여 업로드합니다.',
            'guide.step2.title': '언어 설정',
            'guide.step2.desc': '영상의 원본 언어와 번역할 언어를 선택합니다.',
            'guide.step3.title': '자막 생성',
            'guide.step3.desc': '자막생성 버튼을 클릭하면 AI가 자동으로 음성을 인식하고 자막을 생성합니다.',
            
            // mypage.html (마이페이지)
            'mypage.title': '마이페이지',
            'mypage.profile': '정보수정',
            'mypage.password': '비밀번호 변경',
            'mypage.payment': '결제정보',
            'mypage.withdraw': '회원탈퇴',
            'mypage.nickname': '닉네임',
            'mypage.email': '이메일',
            'mypage.save': '저장하기',
            'mypage.current_pw': '현재 비밀번호',
            'mypage.new_pw': '새 비밀번호',
            'mypage.confirm_pw': '새 비밀번호 확인',
            'mypage.change': '변경하기',
            
            // storage.html (나의 작업)
            'storage.title': '나의 작업',
            'storage.new': '새 작업 시작',
            'storage.total': '전체 작업',
            'storage.completed': '완료된 작업',
            'storage.video_time': '총 영상 시간',
            'storage.monthly': '이번 달 작업',
            'storage.space': '저장공간',
            'storage.used': '사용 중',
            
            // pricing.html (요금제)
            'pricing.title': '요금제',
            'pricing.free': '무료',
            'pricing.student': '학생',
            'pricing.general': '일반',
            'pricing.pro': '프로',
            'pricing.subscribe': '구독하기',
            'pricing.current': '현재 플랜'
        },
        en: {
            // Navigation
            'nav.subtitle': 'Subtitles',
            'nav.pricing': 'Pricing',
            'nav.guide': 'Guide',
            'nav.login': 'Login',
            'nav.signup': 'Sign Up',
            'nav.logout': 'Logout',
            'nav.mywork': 'My Work',
            'nav.remaining': 'min left',
            
            // More menu
            'menu.products': 'Other Products',
            'menu.subtitle_gen': 'Subtitle Generation',
            'menu.subtitle_desc': 'Automatic generation of video subtitles',
            'menu.lecture': 'Real-time Translation',
            'menu.lecture_desc': 'Live translation & subtitles',
            'menu.price': 'Pricing',
            'menu.security': 'Security',
            'menu.features': 'Features',
            'menu.about': 'About Us',
            'menu.help': 'Help',
            'menu.language': 'Language',
            'menu.faq': 'FAQ',
            'menu.tools': 'Tools',
            'menu.legal': 'Legal',
            'menu.privacy': 'Privacy',
            'menu.contact': 'Contact',
            
            // Main page
            'main.title': 'Auto Generate Video Subtitles',
            'main.subtitle': 'Generate accurate subtitles quickly.',
            'main.dropzone': 'Drag files here or click to upload',
            'main.supported': 'Supported: MP4, AVI, MOV, MKV (Max 500MB)',
            
            // Dropdown menu
            'dropdown.edit': 'Edit Profile',
            'dropdown.password': 'Change Password',
            'dropdown.payment': 'Payment Info',
            
            // Common
            'common.free': 'Free',
            'common.student': 'Student',
            'common.general': 'Standard',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Auto Generate Video Subtitles',
            'index.subtitle': 'Generate accurate subtitles quickly.',
            'index.dropzone': 'Drag files here or click to upload',
            'index.fileinfo': 'MP4, MOV, AVI (Max 2GB)',
            'index.settings': 'Translation Settings',
            'index.original': 'Original Language',
            'index.target': 'Target Language',
            'index.autodetect': 'Auto Detect',
            'index.generate': 'Generate Subtitles',
            
            // guide.html
            'guide.title': 'User Guide',
            'guide.subtitle.title': 'Generate Subtitles',
            'guide.step1.title': 'Upload Video',
            'guide.step1.desc': 'Drag and drop or click to upload your video file.',
            'guide.step2.title': 'Language Settings',
            'guide.step2.desc': 'Select the original language and target language.',
            'guide.step3.title': 'Generate Subtitles',
            'guide.step3.desc': 'Click generate and AI will automatically create subtitles.',
            
            // mypage.html
            'mypage.title': 'My Page',
            'mypage.profile': 'Edit Profile',
            'mypage.password': 'Change Password',
            'mypage.payment': 'Payment Info',
            'mypage.withdraw': 'Delete Account',
            'mypage.nickname': 'Nickname',
            'mypage.email': 'Email',
            'mypage.save': 'Save',
            'mypage.current_pw': 'Current Password',
            'mypage.new_pw': 'New Password',
            'mypage.confirm_pw': 'Confirm Password',
            'mypage.change': 'Change',
            
            // storage.html
            'storage.title': 'My Work',
            'storage.new': 'Start New',
            'storage.total': 'Total Tasks',
            'storage.completed': 'Completed',
            'storage.video_time': 'Total Video Time',
            'storage.monthly': 'This Month',
            'storage.space': 'Storage',
            'storage.used': 'Used',
            
            // pricing.html
            'pricing.title': 'Pricing',
            'pricing.free': 'Free',
            'pricing.student': 'Student',
            'pricing.general': 'Standard',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'Subscribe',
            'pricing.current': 'Current Plan'
        },
        ja: {
            // ナビゲーション
            'nav.subtitle': '字幕生成',
            'nav.pricing': '料金プラン',
            'nav.guide': 'ガイド',
            'nav.login': 'ログイン',
            'nav.signup': '新規登録',
            'nav.logout': 'ログアウト',
            'nav.mywork': 'マイワーク',
            'nav.remaining': '分残り',
            
            // その他メニュー
            'menu.products': 'その他の製品',
            'menu.subtitle_gen': '字幕生成',
            'menu.subtitle_desc': '動画字幕自動生成',
            'menu.lecture': 'リアルタイム翻訳',
            'menu.lecture_desc': 'ライブ翻訳と字幕',
            'menu.price': '料金',
            'menu.security': 'セキュリティ',
            'menu.features': '機能',
            'menu.about': '会社概要',
            'menu.help': 'ヘルプ',
            'menu.language': '言語',
            'menu.faq': 'よくある質問',
            'menu.tools': 'ツール',
            'menu.legal': '法的情報',
            'menu.privacy': 'プライバシー',
            'menu.contact': 'お問い合わせ',
            
            // メインページ
            'main.title': '動画字幕自動生成',
            'main.subtitle': '正確で素早く字幕を生成します。',
            'main.dropzone': 'ファイルをドラッグまたはクリック',
            'main.supported': '対応形式: MP4, AVI, MOV, MKV (最大500MB)',
            
            // ドロップダウンメニュー
            'dropdown.edit': '情報編集',
            'dropdown.password': 'パスワード変更',
            'dropdown.payment': '決済情報',
            
            // 共通
            'common.free': '無料',
            'common.student': '学生',
            'common.general': '一般',
            'common.pro': 'プロ',
            
            // index.html
            'index.title': '動画字幕自動生成',
            'index.subtitle': '正確で素早く字幕を生成します。',
            'index.dropzone': 'ファイルをドラッグまたはクリック',
            'index.fileinfo': 'MP4, MOV, AVI (最大2GB)',
            'index.settings': '翻訳設定',
            'index.original': '元の言語',
            'index.target': '対象言語',
            'index.autodetect': '自動検出',
            'index.generate': '字幕生成',
            
            // guide.html
            'guide.title': '使用ガイド',
            'guide.subtitle.title': '字幕を生成する',
            'guide.step1.title': '動画アップロード',
            'guide.step1.desc': 'ドラッグ＆ドロップまたはクリックして動画をアップロード。',
            'guide.step2.title': '言語設定',
            'guide.step2.desc': '元の言語と対象言語を選択します。',
            'guide.step3.title': '字幕生成',
            'guide.step3.desc': '生成ボタンをクリックすると、AIが自動的に字幕を作成します。',
            
            // mypage.html
            'mypage.title': 'マイページ',
            'mypage.profile': '情報編集',
            'mypage.password': 'パスワード変更',
            'mypage.payment': '決済情報',
            'mypage.withdraw': '退会',
            'mypage.nickname': 'ニックネーム',
            'mypage.email': 'メール',
            'mypage.save': '保存',
            'mypage.current_pw': '現在のパスワード',
            'mypage.new_pw': '新しいパスワード',
            'mypage.confirm_pw': 'パスワード確認',
            'mypage.change': '変更',
            
            // storage.html
            'storage.title': 'マイワーク',
            'storage.new': '新規作成',
            'storage.total': '全タスク',
            'storage.completed': '完了',
            'storage.video_time': '総動画時間',
            'storage.monthly': '今月',
            'storage.space': 'ストレージ',
            'storage.used': '使用中',
            
            // pricing.html
            'pricing.title': '料金プラン',
            'pricing.free': '無料',
            'pricing.student': '学生',
            'pricing.general': '一般',
            'pricing.pro': 'プロ',
            'pricing.subscribe': '購読する',
            'pricing.current': '現在のプラン'
        },
        zh: {
            // 导航
            'nav.subtitle': '字幕生成',
            'nav.pricing': '价格/支付',
            'nav.guide': '使用指南',
            'nav.login': '登录',
            'nav.signup': '注册',
            'nav.logout': '退出',
            'nav.mywork': '我的工作',
            'nav.remaining': '分钟剩余',
            
            // 更多菜单
            'menu.products': '其他产品',
            'menu.subtitle_gen': '字幕生成',
            'menu.subtitle_desc': '视频字幕自动生成',
            'menu.lecture': '实时翻译',
            'menu.lecture_desc': '实时翻译和字幕',
            'menu.price': '价格',
            'menu.security': '安全',
            'menu.features': '功能',
            'menu.about': '关于我们',
            'menu.help': '帮助',
            'menu.language': '语言',
            'menu.faq': '常见问题',
            'menu.tools': '工具',
            'menu.legal': '法律',
            'menu.privacy': '隐私',
            'menu.contact': '联系我们',
            
            // 主页
            'main.title': '视频字幕自动生成',
            'main.subtitle': '快速准确地生成字幕。',
            'main.dropzone': '拖放文件或点击上传',
            'main.supported': '支持格式: MP4, AVI, MOV, MKV (最大500MB)',
            
            // 下拉菜单
            'dropdown.edit': '编辑资料',
            'dropdown.password': '修改密码',
            'dropdown.payment': '支付信息',
            
            // 通用
            'common.free': '免费',
            'common.student': '学生',
            'common.general': '普通',
            'common.pro': '专业',
            
            // index.html
            'index.title': '视频字幕自动生成',
            'index.subtitle': '快速准确地生成字幕。',
            'index.dropzone': '拖放文件或点击上传',
            'index.fileinfo': 'MP4, MOV, AVI (最大2GB)',
            'index.settings': '翻译设置',
            'index.original': '原始语言',
            'index.target': '目标语言',
            'index.autodetect': '自动检测',
            'index.generate': '生成字幕',
            
            // guide.html
            'guide.title': '使用指南',
            'guide.subtitle.title': '生成字幕',
            'guide.step1.title': '上传视频',
            'guide.step1.desc': '拖放或点击上传您的视频文件。',
            'guide.step2.title': '语言设置',
            'guide.step2.desc': '选择原始语言和目标语言。',
            'guide.step3.title': '生成字幕',
            'guide.step3.desc': '点击生成，AI将自动创建字幕。',
            
            // mypage.html
            'mypage.title': '我的页面',
            'mypage.profile': '编辑资料',
            'mypage.password': '修改密码',
            'mypage.payment': '支付信息',
            'mypage.withdraw': '注销账户',
            'mypage.nickname': '昵称',
            'mypage.email': '邮箱',
            'mypage.save': '保存',
            'mypage.current_pw': '当前密码',
            'mypage.new_pw': '新密码',
            'mypage.confirm_pw': '确认密码',
            'mypage.change': '修改',
            
            // storage.html
            'storage.title': '我的工作',
            'storage.new': '新建',
            'storage.total': '全部任务',
            'storage.completed': '已完成',
            'storage.video_time': '总视频时长',
            'storage.monthly': '本月',
            'storage.space': '存储空间',
            'storage.used': '已使用',
            
            // pricing.html
            'pricing.title': '价格方案',
            'pricing.free': '免费',
            'pricing.student': '学生',
            'pricing.general': '普通',
            'pricing.pro': '专业',
            'pricing.subscribe': '订阅',
            'pricing.current': '当前方案'
        },
        es: {
            // Navegación
            'nav.subtitle': 'Subtítulos',
            'nav.pricing': 'Precios',
            'nav.guide': 'Guía',
            'nav.login': 'Iniciar sesión',
            'nav.signup': 'Registrarse',
            'nav.logout': 'Cerrar sesión',
            'nav.mywork': 'Mi trabajo',
            'nav.remaining': 'min restantes',
            
            // Menú más
            'menu.products': 'Otros productos',
            'menu.subtitle_gen': 'Generación de subtítulos',
            'menu.subtitle_desc': 'Generación automática de subtítulos de video',
            'menu.lecture': 'Traducción en tiempo real',
            'menu.lecture_desc': 'Traducción y subtítulos en vivo',
            'menu.price': 'Precios',
            'menu.security': 'Seguridad',
            'menu.features': 'Características',
            'menu.about': 'Acerca de nosotros',
            'menu.help': 'Ayuda',
            'menu.language': 'Idioma',
            'menu.faq': 'Preguntas frecuentes',
            'menu.tools': 'Herramientas',
            'menu.legal': 'Legal',
            'menu.privacy': 'Privacidad',
            'menu.contact': 'Contacto',
            
            // Página principal
            'main.title': 'Generación automática de subtítulos',
            'main.subtitle': 'Genere subtítulos precisos rápidamente.',
            'main.dropzone': 'Arrastre archivos aquí o haga clic para subir',
            'main.supported': 'Formatos soportados: MP4, AVI, MOV, MKV (Máx. 500MB)',
            
            // Menú desplegable
            'dropdown.edit': 'Editar perfil',
            'dropdown.password': 'Cambiar contraseña',
            'dropdown.payment': 'Información de pago',
            
            // Común
            'common.free': 'Gratis',
            'common.student': 'Estudiante',
            'common.general': 'Estándar',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Generación automática de subtítulos',
            'index.subtitle': 'Genere subtítulos precisos rápidamente.',
            'index.dropzone': 'Arrastre archivos aquí o haga clic para subir',
            'index.fileinfo': 'MP4, MOV, AVI (Máx. 2GB)',
            'index.settings': 'Configuración de traducción',
            'index.original': 'Idioma original',
            'index.target': 'Idioma de destino',
            'index.autodetect': 'Detección automática',
            'index.generate': 'Generar subtítulos',
            
            // guide.html
            'guide.title': 'Guía de usuario',
            'guide.subtitle.title': 'Generar subtítulos',
            'guide.step1.title': 'Subir video',
            'guide.step1.desc': 'Arrastre y suelte o haga clic para subir su archivo de video.',
            'guide.step2.title': 'Configuración de idioma',
            'guide.step2.desc': 'Seleccione el idioma original y el idioma de destino.',
            'guide.step3.title': 'Generar subtítulos',
            'guide.step3.desc': 'Haga clic en generar y la IA creará automáticamente los subtítulos.',
            
            // mypage.html
            'mypage.title': 'Mi página',
            'mypage.profile': 'Editar perfil',
            'mypage.password': 'Cambiar contraseña',
            'mypage.payment': 'Información de pago',
            'mypage.withdraw': 'Eliminar cuenta',
            'mypage.nickname': 'Apodo',
            'mypage.email': 'Correo electrónico',
            'mypage.save': 'Guardar',
            'mypage.current_pw': 'Contraseña actual',
            'mypage.new_pw': 'Nueva contraseña',
            'mypage.confirm_pw': 'Confirmar contraseña',
            'mypage.change': 'Cambiar',
            
            // storage.html
            'storage.title': 'Mi trabajo',
            'storage.new': 'Comenzar nuevo',
            'storage.total': 'Tareas totales',
            'storage.completed': 'Completadas',
            'storage.video_time': 'Tiempo total de video',
            'storage.monthly': 'Este mes',
            'storage.space': 'Almacenamiento',
            'storage.used': 'Usado',
            
            // pricing.html
            'pricing.title': 'Precios',
            'pricing.free': 'Gratis',
            'pricing.student': 'Estudiante',
            'pricing.general': 'Estándar',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'Suscribirse',
            'pricing.current': 'Plan actual'
        },
        fr: {
            // Navigation
            'nav.subtitle': 'Sous-titres',
            'nav.pricing': 'Tarifs',
            'nav.guide': 'Guide',
            'nav.login': 'Connexion',
            'nav.signup': 'S\'inscrire',
            'nav.logout': 'Déconnexion',
            'nav.mywork': 'Mon travail',
            'nav.remaining': 'min restantes',
            
            // Menu plus
            'menu.products': 'Autres produits',
            'menu.subtitle_gen': 'Génération de sous-titres',
            'menu.subtitle_desc': 'Génération automatique de sous-titres vidéo',
            'menu.lecture': 'Traduction en temps réel',
            'menu.lecture_desc': 'Traduction et sous-titres en direct',
            'menu.price': 'Tarifs',
            'menu.security': 'Sécurité',
            'menu.features': 'Fonctionnalités',
            'menu.about': 'À propos',
            'menu.help': 'Aide',
            'menu.language': 'Langue',
            'menu.faq': 'FAQ',
            'menu.tools': 'Outils',
            'menu.legal': 'Légal',
            'menu.privacy': 'Confidentialité',
            'menu.contact': 'Contact',
            
            // Page principale
            'main.title': 'Génération automatique de sous-titres',
            'main.subtitle': 'Générez des sous-titres précis rapidement.',
            'main.dropzone': 'Glissez-déposez des fichiers ou cliquez pour télécharger',
            'main.supported': 'Formats pris en charge: MP4, AVI, MOV, MKV (Max 500MB)',
            
            // Menu déroulant
            'dropdown.edit': 'Modifier le profil',
            'dropdown.password': 'Changer le mot de passe',
            'dropdown.payment': 'Informations de paiement',
            
            // Commun
            'common.free': 'Gratuit',
            'common.student': 'Étudiant',
            'common.general': 'Standard',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Génération automatique de sous-titres',
            'index.subtitle': 'Générez des sous-titres précis rapidement.',
            'index.dropzone': 'Glissez-déposez des fichiers ou cliquez pour télécharger',
            'index.fileinfo': 'MP4, MOV, AVI (Max 2GB)',
            'index.settings': 'Paramètres de traduction',
            'index.original': 'Langue originale',
            'index.target': 'Langue cible',
            'index.autodetect': 'Détection automatique',
            'index.generate': 'Générer les sous-titres',
            
            // guide.html
            'guide.title': 'Guide utilisateur',
            'guide.subtitle.title': 'Générer des sous-titres',
            'guide.step1.title': 'Télécharger la vidéo',
            'guide.step1.desc': 'Glissez-déposez ou cliquez pour télécharger votre fichier vidéo.',
            'guide.step2.title': 'Paramètres de langue',
            'guide.step2.desc': 'Sélectionnez la langue originale et la langue cible.',
            'guide.step3.title': 'Générer des sous-titres',
            'guide.step3.desc': 'Cliquez sur générer et l\'IA créera automatiquement les sous-titres.',
            
            // mypage.html
            'mypage.title': 'Ma page',
            'mypage.profile': 'Modifier le profil',
            'mypage.password': 'Changer le mot de passe',
            'mypage.payment': 'Informations de paiement',
            'mypage.withdraw': 'Supprimer le compte',
            'mypage.nickname': 'Pseudonyme',
            'mypage.email': 'E-mail',
            'mypage.save': 'Enregistrer',
            'mypage.current_pw': 'Mot de passe actuel',
            'mypage.new_pw': 'Nouveau mot de passe',
            'mypage.confirm_pw': 'Confirmer le mot de passe',
            'mypage.change': 'Changer',
            
            // storage.html
            'storage.title': 'Mon travail',
            'storage.new': 'Commencer nouveau',
            'storage.total': 'Tâches totales',
            'storage.completed': 'Terminées',
            'storage.video_time': 'Temps vidéo total',
            'storage.monthly': 'Ce mois-ci',
            'storage.space': 'Stockage',
            'storage.used': 'Utilisé',
            
            // pricing.html
            'pricing.title': 'Tarifs',
            'pricing.free': 'Gratuit',
            'pricing.student': 'Étudiant',
            'pricing.general': 'Standard',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'S\'abonner',
            'pricing.current': 'Plan actuel'
        }
    };

    // 현재 언어 가져오기
    function getCurrentLanguage() {
        return localStorage.getItem('siteLanguage') || 'ko';
    }

    // 번역 텍스트 가져오기
    function t(key) {
        const lang = getCurrentLanguage();
        return translations[lang]?.[key] || translations['ko'][key] || key;
    }

    // 페이지 텍스트 업데이트
    function updatePageLanguage() {
        const lang = getCurrentLanguage();
        const trans = translations[lang];
        if (!trans) return;
        
        // data-i18n 속성이 있는 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.textContent = trans[key];
            }
        });
        
        // data-i18n-placeholder 속성이 있는 모든 요소 업데이트
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (trans[key]) {
                el.placeholder = trans[key];
            }
        });

        // 네비게이션 바 업데이트 (동적으로 생성된 요소)
        updateNavBarLanguage(lang);
        
        // 현재 페이지에 따른 텍스트 업데이트
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        updateCurrentPageLanguage(lang, currentPage);
        
        // HTML lang 속성 업데이트
        document.documentElement.lang = lang;
        
        // 언어 변경 이벤트 발생
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
    
    // 현재 페이지 텍스트 업데이트
    function updateCurrentPageLanguage(lang, page) {
        const trans = translations[lang];
        if (!trans) return;
        
        // index.html
        if (page === 'index.html' || page === '') {
            const title = document.querySelector('.upload-title');
            const subtitle = document.querySelector('.upload-subtitle');
            const dropzone = document.querySelector('.drop-zone-text');
            const fileinfo = document.querySelector('.drop-zone-file-info');
            const settings = document.querySelector('.panel-title');
            const originalLabel = document.querySelector('.setting-label');
            
            if (title) title.textContent = trans['index.title'];
            if (subtitle) subtitle.textContent = trans['index.subtitle'];
            if (dropzone) dropzone.textContent = trans['index.dropzone'];
            if (fileinfo) fileinfo.textContent = trans['index.fileinfo'];
        }
        
        // mypage.html
        if (page === 'mypage.html') {
            // 탭 버튼들
            const tabs = document.querySelectorAll('.tab-btn');
            if (tabs[0]) tabs[0].textContent = trans['mypage.profile'];
            if (tabs[1]) tabs[1].textContent = trans['mypage.password'];
            if (tabs[2]) tabs[2].textContent = trans['mypage.payment'];
            if (tabs[3]) tabs[3].textContent = trans['mypage.withdraw'];
            
            // 섹션 타이틀
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach((title, index) => {
                if (index === 0) title.textContent = trans['mypage.profile'];
                if (index === 1) title.textContent = trans['mypage.password'];
            });
            
            // 폼 라벨
            const labels = document.querySelectorAll('.form-label');
            if (labels[0]) labels[0].textContent = trans['mypage.nickname'];
            if (labels[1]) labels[1].textContent = trans['mypage.email'];
            
            // 버튼
            const saveBtn = document.querySelector('.submit-btn');
            if (saveBtn && saveBtn.textContent.includes('저장') || saveBtn?.textContent.includes('Save')) {
                saveBtn.textContent = trans['mypage.save'];
            }
            
            // 비밀번호 입력 필드 placeholder
            const currentPw = document.getElementById('current-password');
            const newPw = document.getElementById('new-password');
            const confirmPw = document.getElementById('confirm-password');
            if (currentPw) currentPw.placeholder = trans['mypage.current_pw'];
            if (newPw) newPw.placeholder = trans['mypage.new_pw'];
            if (confirmPw) confirmPw.placeholder = trans['mypage.confirm_pw'];
        }
        
        // storage.html
        if (page === 'storage.html') {
            const title = document.querySelector('.page-title');
            if (title) title.textContent = trans['storage.title'];
            
            const newBtn = document.querySelector('.new-task-btn');
            if (newBtn) {
                const icon = newBtn.querySelector('i');
                newBtn.innerHTML = '';
                if (icon) newBtn.appendChild(icon);
                newBtn.appendChild(document.createTextNode(' ' + trans['storage.new']));
            }
            
            const statLabels = document.querySelectorAll('.stat-label');
            if (statLabels[0]) statLabels[0].textContent = trans['storage.total'];
            if (statLabels[1]) statLabels[1].textContent = trans['storage.completed'];
            if (statLabels[2]) statLabels[2].textContent = trans['storage.video_time'];
            if (statLabels[3]) statLabels[3].textContent = trans['storage.monthly'];
            
            const storageTitle = document.querySelector('.storage-title');
            if (storageTitle) storageTitle.textContent = trans['storage.space'];
        }
        
        // pricing.html
        if (page === 'pricing.html') {
            const planNames = document.querySelectorAll('.plan-name');
            if (planNames[0]) planNames[0].textContent = trans['pricing.free'];
            if (planNames[1]) planNames[1].textContent = trans['pricing.student'];
            if (planNames[2]) planNames[2].textContent = trans['pricing.general'];
            if (planNames[3]) planNames[3].textContent = trans['pricing.pro'];
        }
    }

    // 네비게이션 바 언어 업데이트
    function updateNavBarLanguage(lang) {
        const trans = translations[lang];
        if (!trans) return;

        // 서비스 탭
        const serviceTabs = document.querySelectorAll('.service-tab span');
        if (serviceTabs[0]) serviceTabs[0].textContent = trans['nav.subtitle'];
        if (serviceTabs[1]) serviceTabs[1].textContent = trans['nav.pricing'];
        if (serviceTabs[2]) serviceTabs[2].textContent = trans['nav.guide'];

        // 로그인/가입 버튼
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        if (loginBtn && !loginBtn.style.display !== 'none') {
            if (loginBtn.textContent === '로그인' || loginBtn.textContent === 'Login' || 
                loginBtn.textContent === 'ログイン' || loginBtn.textContent === '登录') {
                loginBtn.textContent = trans['nav.login'];
            }
        }
        if (signupBtn && signupBtn.style.display !== 'none') {
            signupBtn.textContent = trans['nav.signup'];
        }

        // 나의 작업 버튼
        const myWorkLink = document.querySelector('.my-work-link');
        if (myWorkLink) myWorkLink.textContent = trans['nav.mywork'];

        // 메가 메뉴
        const sectionTitle = document.querySelector('.mega-menu-section-title');
        if (sectionTitle) sectionTitle.textContent = trans['menu.products'];

        const menuItems = document.querySelectorAll('.mega-menu-item');
        if (menuItems[0]) {
            const title0 = menuItems[0].querySelector('.mega-menu-item-title');
            const desc0 = menuItems[0].querySelector('.mega-menu-item-desc');
            if (title0) title0.textContent = trans['menu.subtitle_gen'];
            if (desc0) desc0.textContent = trans['menu.subtitle_desc'];
        }
        if (menuItems[1]) {
            const title1 = menuItems[1].querySelector('.mega-menu-item-title');
            const desc1 = menuItems[1].querySelector('.mega-menu-item-desc');
            if (title1) title1.textContent = trans['menu.lecture'];
            if (desc1) desc1.textContent = trans['menu.lecture_desc'];
        }

        // 링크 메뉴 (a 태그들)
        const menuLinksA = document.querySelectorAll('.mega-menu-links > a.mega-menu-link span');
        if (menuLinksA[0]) menuLinksA[0].textContent = trans['menu.price'];
        if (menuLinksA[1]) menuLinksA[1].textContent = trans['menu.security'];
        if (menuLinksA[2]) menuLinksA[2].textContent = trans['menu.features'];
        if (menuLinksA[3]) menuLinksA[3].textContent = trans['menu.about'];

        // 도움, 언어 버튼
        const helpBtn = document.getElementById('helpMenuBtn');
        const langBtn = document.getElementById('languageMenuBtn');
        if (helpBtn) {
            const helpSpan = helpBtn.querySelector('span');
            if (helpSpan) helpSpan.textContent = trans['menu.help'];
        }
        if (langBtn) {
            const langSpan = langBtn.querySelector('span');
            if (langSpan) langSpan.textContent = trans['menu.language'];
        }

        // 도움 서브메뉴
        const helpSubmenu = document.getElementById('helpSubmenu');
        if (helpSubmenu) {
            const helpItems = helpSubmenu.querySelectorAll('.mega-submenu-item span');
            if (helpItems[0]) helpItems[0].textContent = trans['menu.faq'];
            if (helpItems[1]) helpItems[1].textContent = trans['menu.tools'];
            if (helpItems[2]) helpItems[2].textContent = trans['menu.legal'];
            if (helpItems[3]) helpItems[3].textContent = trans['menu.privacy'];
            if (helpItems[4]) helpItems[4].textContent = trans['menu.contact'];
        }
        
        // 사용자 드롭다운 메뉴
        const dropdownItems = document.querySelectorAll('.user-dropdown-item span');
        if (dropdownItems[0]) dropdownItems[0].textContent = trans['dropdown.edit'];
        if (dropdownItems[1]) dropdownItems[1].textContent = trans['dropdown.password'];
        if (dropdownItems[2]) dropdownItems[2].textContent = trans['dropdown.payment'];
    }

    // 언어 변경
    function setLanguage(lang) {
        if (!translations[lang]) {
            console.warn('Unsupported language:', lang);
            return;
        }
        
        localStorage.setItem('siteLanguage', lang);
        updatePageLanguage();
        
        // 언어 선택 UI 업데이트 (체크 표시)
        document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
            const check = opt.querySelector('.fa-check');
            if (check) {
                check.style.visibility = opt.dataset.lang === lang ? 'visible' : 'hidden';
            }
        });
    }

    // 초기화
    function init() {
        // 페이지 로드 시 저장된 언어 적용
        const currentLang = getCurrentLanguage();
        updatePageLanguage();
        
        // 체크 표시 초기화
        setTimeout(function() {
            document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
                const check = opt.querySelector('.fa-check');
                if (check) {
                    check.style.visibility = opt.dataset.lang === currentLang ? 'visible' : 'hidden';
                }
            });
        }, 100);
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // navBarLoaded 이벤트 수신
    document.addEventListener('navBarLoaded', function() {
        const currentLang = getCurrentLanguage();
        setTimeout(function() {
            updatePageLanguage();
            // 체크 표시 업데이트
            document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
                const check = opt.querySelector('.fa-check');
                if (check) {
                    check.style.visibility = opt.dataset.lang === currentLang ? 'visible' : 'hidden';
                }
            });
        }, 50);
    });

    // 전역으로 내보내기
    window.i18n = {
        t: t,
        setLanguage: setLanguage,
        getCurrentLanguage: getCurrentLanguage,
        updatePageLanguage: updatePageLanguage
    };

})();

