const zhTW = {
  meta: {
    title: '遊戲生涯個人喜好表',
    description: '建立你的遊戲生涯個人喜好表',
  },
  global: {
    main_title: '遊戲生涯個人喜好表',
  },
  cell_titles: [
    '最喜愛的',
    '最影響我的',
    '最驚豔的',
    '最長情的',
    '最快樂的',
    '最想安利的',
    '最喜歡的劇情',
    '最喜歡的畫面',
    '最喜歡的配樂',
    '最喜歡的配音',
    '最喜歡的角色',
    '最喜歡的結局',
    '最爽快的',
    '最受苦的',
    '最治癒的',
    '最致鬱的',
    '最被低估的',
    '最被高估的',
    '玩的第一款',
    '消磨時間就玩',
    '我怎會喜歡這個',
    '總有一天能打完',
    '爺青回',
    '它好小眾我好愛',
  ],
  ui: {
    tip_edit:
      '提示：點擊頂部標題、格子標題、遊戲名稱或描述可編輯；也可直接拖曳圖片到格子中。',
    generate: '生成 {title}！',
    columns: '每行欄數：',
    columns_value: '{count} 欄',
  },
  dialog: {
    edit_title: '編輯標題',
    edit_game_name: '編輯遊戲名稱',
    edit_description: '編輯描述',
    edit_main_title: '編輯主標題',
  },
  common: { cancel: '取消', save: '儲存', close: '關閉', confirm: '確認' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: '如果覺得有幫助請點 →',
    friend_link: '友情連結：',
    friend_link_movie: '電影生涯個人喜好表',
    powered_by: 'Powered by SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: '版權聲明',
    privacy_title: '隱私權條款',
    copyright_p1:
      '本網站為個人非商業專案，只提供「遊戲生涯個人喜好表」等圖片產生工具，不提供任何遊戲、影視、音樂、電子書等受版權保護作品的下載、線上播放或取得管道。',
    copyright_p2:
      '頁面中顯示的遊戲名稱與封面等資料來源於第三方介面（如 SteamGridDB、Bangumi），相關版權皆屬原權利人所有，僅用於資訊展示與個人喜好整理。如認為本站內容有侵權或不當使用，請透過 GitHub 儲存庫 Issues 聯繫維護者，我們會儘快處理。',
    copyright_p3:
      '使用者自行上傳或拖曳至頁面的圖片僅在瀏覽器本地處理與保存，不會上傳至伺服器；其版權由使用者本人或原權利人享有，使用者應確保自己有權使用與分享該等圖片。',
    privacy_p1:
      '本站不要求註冊登入，編輯的格子內容與產生紀錄預設儲存在瀏覽器的 localStorage / IndexedDB 中，只在本機裝置上使用。您可以透過清除瀏覽器資料的方式刪除這些本地紀錄。',
    privacy_p2:
      '部署環境可能會紀錄一般伺服器日誌（如 IP 位址、User-Agent、存取時間與請求路徑），僅用於安全、防濫用與效能除錯，不會用來識別特定個人。',
    privacy_p3:
      '在設定了 NEXT_PUBLIC_GA_ID 且處於正式環境時，本站會啟用 Google Analytics 4，用於統計流量與使用情況。相關資料由 Google 依其隱私權政策處理，您可以透過瀏覽器設定、廣告阻擋工具或停用 JavaScript 等方式限制或拒絕此類統計。',
    privacy_p4:
      '本站亦可能使用託管服務提供者（如 Vercel）提供的基礎監控與分析功能，相關資料僅用於改善網站穩定性與效能，不會出售或主動提供給其他第三方。',
  },
  search: {
    title: '搜尋遊戲',
    source: '搜尋來源：',
    placeholder: '輸入遊戲名稱開始搜尋',
    searching: '搜尋中',
    search: '搜尋',
    retry: '重試',
    no_results: '未找到相關遊戲',
    try_keywords: '請嘗試不同關鍵字',
    idle_hint: '輸入遊戲名稱開始搜尋',
    results_count: '找到 {count} 個結果',
    clear: '清除搜尋',
    upload_image: '上傳圖片',
    bangumi_tip: 'Bangumi 是專注動畫、遊戲的中文資料庫，對 ACG 相關遊戲支援良好。',
    sgdb_tip: 'SteamGridDB 是遊戲封面資料庫，收錄豐富，但僅支援英文名搜尋。',
  },
  crop: {
    title: '裁剪圖片',
    tip: '拖動和縮放圖片以調整裁剪區域',
    zoom: '縮放',
  },
  error: {
    file_too_large: '圖片檔案過大，請上傳小於{size}的圖片',
    image_load_failed_retry: '圖片載入失敗，請重試',
    image_load_failed_select_another: '圖片載入失敗，請重試或選擇其他圖片',
    loading: '載入中...',
    processing: '處理中...',
  },
};

export default zhTW;
