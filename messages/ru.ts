const ru = {
  meta: { title: 'Сетка игровых предпочтений', description: 'Создайте личную сетку предпочтений' },
  global: { main_title: 'Сетка игровых предпочтений' },
  cell_titles: [
    'Любимая',
    'Самая влиятельная',
    'Самая впечатляющая',
    'Самые длительные отношения',
    'Самая радостная',
    'Самая рекомендуемая',
    'Лучшая история',
    'Лучшая графика',
    'Лучшая музыка',
    'Лучшее озвучивание',
    'Любимый персонаж',
    'Лучший финал',
    'Самая удовлетворяющая',
    'Самая болезненная',
    'Самая исцеляющая',
    'Самая депрессивная',
    'Самая недооценённая',
    'Самая переоценённая',
    'Первая игра',
    'Убивает время',
    'Запретное удовольствие',
    'Когда‑нибудь пройду',
    'Ностальгия',
    'Скрытый шедевр',
  ],
  ui: { tip_edit: 'Подсказка: нажмите для редактирования. Перетащите изображения в ячейки.', generate: 'Создать {title}!', columns: 'Столбцов в строке:', columns_value: '{count} столбцов' },
  dialog: { edit_title: 'Редактировать заголовок', edit_game_name: 'Редактировать имя', edit_description: 'Редактировать описание', edit_main_title: 'Редактировать основной заголовок' },
  common: { cancel: 'Отменить', save: 'Сохранить', close: 'Закрыть', confirm: 'Подтвердить' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Полезно? Поставьте звезду →',
    friend_link: 'Дружеская ссылка:',
    friend_link_movie: 'Сетка кинопредпочтений',
    powered_by: 'При поддержке SteamGridDB и Bangumi',
  },
  legal: {
    copyright_title: 'Уведомление об авторских правах',
    privacy_title: 'Политика конфиденциальности',
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
    title: 'Поиск игры',
    source: 'Источник:',
    placeholder: 'Введите название игры',
    searching: 'Поиск',
    search: 'Искать',
    retry: 'Повторить',
    no_results: 'Ничего не найдено',
    try_keywords: 'Попробуйте другие запросы',
    idle_hint: 'Введите название, чтобы начать',
    results_count: 'Найдено: {count}',
    clear: 'Очистить',
    upload_image: 'Загрузить изображение',
    bangumi_tip: 'Bangumi — китайская база по аниме и играм.',
    sgdb_tip: 'SteamGridDB — база обложек (поиск на английском).',
  },
  crop: {
    title: 'Обрезать изображение',
    tip: 'Перетаскивайте и масштабируйте для настройки области обрезки',
    zoom: 'Масштаб',
  },
  error: {
    file_too_large: 'Файл изображения слишком большой, пожалуйста загрузите изображение менее {size}',
    image_load_failed_retry: 'Не удалось загрузить изображение, попробуйте ещё раз',
    image_load_failed_select_another: 'Не удалось загрузить изображение, попробуйте ещё раз или выберите другое изображение',
    loading: 'Загрузка...',
    processing: 'Обработка...',
  },
};

export default ru;
