const zhCN = {
  meta: {
    title: '构成我的9款游戏｜游戏清单生成器',
    description: '创建你的“构成我的9款游戏”页面，支持多语言与自定义格子，一键导出高清图片。',
  },
  global: {
    main_title: '构成我的9款游戏',
  },
  cell_titles: [
    '最爱的',
    '最影响我的',
    '最惊艳的',
    '最长情的',
    '最快乐的',
    '最想安利的',
    '最喜欢的剧情',
    '最喜欢的画面',
    '最喜欢的配乐',
    '最喜欢的配音',
    '最喜欢的角色',
    '最喜欢的结局',
    '最爽快的',
    '最受苦的',
    '最治愈的',
    '最致郁的',
    '最被低估的',
    '最被高估的',
    '玩的第一款',
    '消磨时间就玩',
    '我咋会喜欢这个',
    '总有一天能打完',
    '爷青回',
    '它好小众我好爱',
  ],
  ui: {
    tip_edit:
      '提示：点击顶部标题、格子标题或游戏名称可以编辑；也可直接拖拽图片到格子中。',
    generate: '生成{title}！',
  },
  dialog: {
    edit_title: '编辑标题',
    edit_game_name: '编辑游戏名称',
    edit_main_title: '编辑主标题',
  },
  common: {
    cancel: '取消',
    save: '保存',
    close: '关闭',
    confirm: '确认',
  },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: '如果觉得对你有用请点 →',
    friend_link: '友情链接：',
    friend_link_movie: '电影生涯清单',
    powered_by: 'Powered by SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: '版权声明',
    privacy_title: '隐私协议',
    copyright_p1:
      '本网站为个人非商业项目，仅提供“构成我的9款游戏”等图片生成工具，不提供任何游戏、影视、音乐、电子书等受版权保护作品的下载、在线播放或获取渠道。',
    copyright_p2:
      '页面中展示的游戏名称与封面等资料来自第三方接口（如 SteamGridDB、Bangumi），相关版权归原权利人所有，仅用于信息展示和个人喜好整理。如认为本站内容存在侵权或不当使用，请通过 GitHub 仓库 Issues 联系维护者，我们会尽快处理。',
    copyright_p3:
      '用户自行上传或拖拽到页面中的图片仅在浏览器本地处理与保存，不会上传到服务器；其版权由用户本人或原权利人享有，用户应确保其有权使用和分享该类图片。',
    privacy_p1:
      '本站不要求注册登录，编辑的格子内容与生成记录默认保存在浏览器的 localStorage / IndexedDB 中，仅在本地设备上使用。您可以通过清除浏览器数据的方式删除这些本地记录。',
    privacy_p2:
      '部署环境可能会记录常规服务端日志（如 IP 地址、User-Agent、访问时间和请求路径），仅用于安全、防滥用与性能排查，不用于识别特定个人。',
    privacy_p3:
      '在配置了 NEXT_PUBLIC_GA_ID 且处于生产环境时，本站会启用 Google Analytics 4，用于统计访问量和使用情况。相关数据由 Google 依据其隐私政策处理，您可以通过浏览器设置、广告拦截或禁用 JavaScript 等方式限制或拒绝此类统计。',
    privacy_p4:
      '本站可能同时使用托管服务提供方（如 Vercel）提供的基础监控与分析功能，这些数据仅用于改进站点稳定性和性能，不会出售或主动提供给其他第三方。',
  },
  seo: {
    intro:
      '“构成我的9款游戏”在线生成器。支持多语言标题与自定义格子，拖拽或搜索添加封面，一键导出高分辨率图片。',
  },
  search: {
    title: '搜索游戏',
    source: '搜索源：',
    placeholder: '输入游戏名称开始搜索',
    searching: '搜索中',
    search: '搜索',
    retry: '重试',
    no_results: '未找到相关游戏',
    try_keywords: '请尝试不同的关键词',
    idle_hint: '输入游戏名称开始搜索',
    results_count: '找到 {count} 个结果',
    clear: '清除搜索',
    upload_image: '上传图片',
    bangumi_tip: 'Bangumi 是专注动画、游戏的中文数据库，对 ACG 相关游戏支持较好。',
    sgdb_tip: 'SteamGridDB 是游戏封面数据库，收录丰富，但仅支持英文名搜索。',
  },
  crop: {
    title: '裁剪图片',
    tip: '拖动和缩放图片以调整裁剪区域',
    zoom: '缩放',
  },
  error: {
    file_too_large: '图片文件过大，请上传小于{size}的图片',
    image_load_failed_retry: '图片加载失败，请重试',
    image_load_failed_select_another: '图片加载失败，请重试或选择其他图片',
    loading: '加载中...',
    processing: '处理中...',
  },
};

export default zhCN;
