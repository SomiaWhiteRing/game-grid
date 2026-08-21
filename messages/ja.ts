const ja = {
  meta: {
    title: 'ゲーム嗜好グリッド',
    description: '自分だけのゲーム嗜好グリッドを作成',
  },
  global: { main_title: 'ゲーム嗜好グリッド' },
  cell_titles: [
    '最も好き',
    '最も影響を受けた',
    '最も驚嘆した',
    '最も長く付き合った',
    '最も楽しい',
    '最も勧めたい',
    '最高のストーリー',
    '最高のビジュアル',
    '最高の音楽',
    '最高のボイス',
    'お気に入りのキャラ',
    '最高の結末',
    '最も爽快',
    '最もつらい',
    '最も癒やし',
    '最も鬱',
    '最も過小評価',
    '最も過大評価',
    '初めて遊んだ',
    '暇つぶし',
    '罪悪感のある好み',
    'いつかクリアする',
    '懐かしさ',
    '隠れた名作',
  ],
  ui: {
    tip_edit:
      'ヒント: 上部タイトル・セル名・ゲーム名は編集可能。画像をセルへドラッグ＆ドロップもできます。',
    generate: '{title} を生成！',
    columns: '1行の列数：',
    columns_value: '{count}列',
  },
  dialog: {
    edit_title: 'タイトルを編集',
    edit_game_name: 'ゲーム名を編集',
    edit_description: '説明を編集',
    edit_main_title: 'メインタイトルを編集',
  },
  common: { cancel: 'キャンセル', save: '保存', close: '閉じる', confirm: '確認' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: '役に立ったらスターをお願いします →',
    friend_link: '友情リンク:',
    friend_link_movie: '映画嗜好グリッド',
    powered_by: 'Powered by SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: '著作権について',
    privacy_title: 'プライバシーポリシー',
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
    title: 'ゲーム検索',
    source: 'ソース:',
    placeholder: 'ゲーム名を入力して検索',
    searching: '検索中',
    search: '検索',
    retry: '再試行',
    no_results: '結果が見つかりません',
    try_keywords: '別のキーワードを試してください',
    idle_hint: 'ゲーム名を入力して検索を開始',
    results_count: '{count} 件見つかりました',
    clear: 'クリア',
    upload_image: '画像をアップロード',
    bangumi_tip: 'Bangumi はアニメ・ゲームに特化した中国語データベースです。',
    sgdb_tip: 'SteamGridDB はゲームカバーのデータベース（英語名検索のみ）。',
  },
  crop: {
    title: '画像をトリミング',
    tip: 'ドラッグまたはズームでトリミング範囲を調整',
    zoom: 'ズーム',
  },
  error: {
    file_too_large: '画像ファイルが大きすぎます。{size}以下の画像をアップロードしてください',
    image_load_failed_retry: '画像の読み込みに失敗しました。再試行してください',
    image_load_failed_select_another: '画像の読み込みに失敗しました。再試行するか別の画像を選択してください',
    loading: '読み込み中...',
    processing: '処理中...',
  },
};

export default ja;
