const ko = {
  meta: {
    title: '게임 취향 그리드',
    description: '나만의 게임 취향 그리드를 만들기',
  },
  global: { main_title: '게임 취향 그리드' },
  cell_titles: [
    '가장 좋아하는',
    '가장 영향 받은',
    '가장 놀라운',
    '가장 오래 한',
    '가장 즐거운',
    '가장 추천하는',
    '최고의 스토리',
    '최고의 비주얼',
    '최고의 음악',
    '최고의 보이스',
    '가장 좋아하는 캐릭터',
    '최고의 엔딩',
    '가장 짜릿한',
    '가장 고통스러운',
    '가장 힐링되는',
    '가장 우울한',
    '가장 과소평가된',
    '가장 과대평가된',
    '처음으로 한',
    '시간 때우기',
    '이상하게 좋아함',
    '언젠가 클리어',
    '추억 소환',
    '소수지만 사랑받는',
  ],
  ui: {
    tip_edit:
      '힌트: 상단 제목, 셀 제목 또는 게임 이름을 클릭해 편집할 수 있습니다. 이미지를 셀로 드래그 앤 드롭도 가능.',
    generate: '{title} 생성!',
    columns: '행당 열 수:',
    columns_value: '{count}열',
  },
  dialog: {
    edit_title: '제목 편집',
    edit_game_name: '게임 이름 편집',
    edit_description: '설명 편집',
    edit_main_title: '메인 제목 편집',
  },
  common: { cancel: '취소', save: '저장', close: '닫기', confirm: '확인' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: '도움이 되었다면 스타 부탁드립니다 →',
    friend_link: '우호 링크:',
    friend_link_movie: '영화 취향 그리드',
    powered_by: 'Powered by SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: '저작권 고지',
    privacy_title: '개인정보 처리 방침',
    copyright_p1:
      'This website is a personal, non-commercial project that only provides tools such as the "Game Preference Grid" image generator. It does not offer downloads, streaming or access to full copies of games, movies, music, ebooks or other copyrighted works.',
    copyright_p2:
      'Game titles, cover images and related metadata are retrieved from third-party APIs (such as SteamGridDB and Bangumi). All copyrights remain with their respective right holders and are shown here only for information and personal collection purposes. If you believe any content on this site infringes your rights, please contact the maintainer via GitHub issues and we will handle it as soon as possible.',
    copyright_p3:
      'Images that you upload or drag into the page are processed and stored only in your browser and are not uploaded to the server. Copyright for those images belongs to you or the original right holders, and you are responsible for ensuring you have the right to use them.',
    privacy_p1:
      'You do not need to sign in to use this site. Your grid edits and generated presets are stored by default in your browser (localStorage / IndexedDB) on your own device. You can delete them at any time by clearing your browser data.',
    privacy_p2:
      'The hosting environment may record standard server logs (such as IP address, user agent, time of access and requested path) for security, abuse prevention and debugging. These logs are not used to identify individual users.',
    privacy_p3:
      'When a NEXT_PUBLIC_GA_ID is configured and the site runs in production, Google Analytics 4 is used to measure visits and usage patterns. The data is processed by Google under its own privacy policy. You can limit or block this measurement via browser settings, ad blockers or disabling JavaScript.',
    privacy_p4:
      'The site may also use basic monitoring and analytics provided by the hosting provider (for example, Vercel). This data is only used to improve stability and performance and is not sold or voluntarily shared with other third parties.',
  },
  search: {
    title: '게임 검색',
    source: '소스:',
    placeholder: '게임 이름을 입력하여 검색',
    searching: '검색 중',
    search: '검색',
    retry: '재시도',
    no_results: '결과가 없습니다',
    try_keywords: '다른 키워드를 시도해 보세요',
    idle_hint: '게임 이름을 입력해 검색 시작',
    results_count: '{count}개 결과',
    clear: '지우기',
    upload_image: '이미지 업로드',
    bangumi_tip: 'Bangumi는 애니·게임에 특화된 중국어 DB입니다。',
    sgdb_tip: 'SteamGridDB는 게임 커버 DB(영문 검색만 지원)。',
  },
  crop: {
    title: '이미지 자르기',
    tip: '드래그 및 줌으로 자르기 영역 조정',
    zoom: '줌',
  },
  error: {
    file_too_large: '이미지 파일이 너무 큽니다. {size}보다 작은 이미지를 업로드하세요',
    image_load_failed_retry: '이미지 로드 실패, 다시 시도하세요',
    image_load_failed_select_another: '이미지 로드 실패, 다시 시도하거나 다른 이미지를 선택하세요',
    loading: '로딩 중...',
    processing: '처리 중...',
  },
};

export default ko;
