const en = {
  meta: {
    title: 'Game Preference Grid',
    description: 'Create your personal game preference grid',
  },
  global: {
    main_title: 'Game Preference Grid',
  },
  cell_titles: [
    'Most Favorite',
    'Most Influential',
    'Most Stunning',
    'Longest Relationship',
    'Most Joyful',
    'Most Recommendable',
    'Best Story',
    'Best Visuals',
    'Best Music',
    'Best Voice Acting',
    'Favorite Character',
    'Best Ending',
    'Most Satisfying',
    'Most Painful',
    'Most Healing',
    'Most Depressing',
    'Most Underrated',
    'Most Overrated',
    'First Ever Played',
    'Time Killer',
    'Guilty Pleasure',
    'Someday I will finish',
    'Nostalgia Hit',
    'Beloved Hidden Gem',
  ],
  ui: {
    tip_edit:
      'Tip: Click the top title, cell title, game name or description to edit. You can also drag-and-drop images directly into cells.',
    generate: 'Generate {title}!',
    columns: 'Columns per row:',
    columns_value: '{count} columns',
  },
  dialog: {
    edit_title: 'Edit Title',
    edit_game_name: 'Edit Game Name',
    edit_description: 'Edit Description',
    edit_main_title: 'Edit Main Title',
  },
  common: {
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    confirm: 'Confirm',
  },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'If you find it useful, please star →',
    friend_link: 'Friend Link:',
    friend_link_movie: 'Movie Preference Grid',
    powered_by: 'Powered by SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Copyright Notice',
    privacy_title: 'Privacy Policy',
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
    title: 'Search Game',
    source: 'Source:',
    placeholder: 'Enter game name to search',
    searching: 'Searching',
    search: 'Search',
    retry: 'Retry',
    no_results: 'No results found',
    try_keywords: 'Try different keywords',
    idle_hint: 'Type a game name to start searching',
    results_count: 'Found {count} results',
    clear: 'Clear',
    upload_image: 'Upload image',
    bangumi_tip: 'Bangumi is a Chinese DB focused on anime and games; good coverage for ACG-related titles.',
    sgdb_tip: 'SteamGridDB is a cover database with many games; search supports English names only.',
  },
  crop: {
    title: 'Crop Image',
    tip: 'Drag and zoom to adjust crop area',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Image file is too large, please upload images smaller than {size}',
    image_load_failed_retry: 'Image failed to load, please retry',
    image_load_failed_select_another: 'Image failed to load, please retry or select another image',
    loading: 'Loading...',
    processing: 'Processing...',
  },
};

export default en;
