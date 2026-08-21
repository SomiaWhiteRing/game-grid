const tr = {
  meta: { title: 'Oyun tercih ızgarası', description: 'Kişisel oyun tercih ızgaranı oluştur' },
  global: { main_title: 'Oyun tercih ızgarası' },
  cell_titles: [
    'En favori',
    'En etkileyici',
    'En şaşırtıcı',
    'En uzun ilişki',
    'En neşeli',
    'En tavsiye edilesi',
    'En iyi hikaye',
    'En iyi görseller',
    'En iyi müzik',
    'En iyi dublaj',
    'Favori karakter',
    'En iyi son',
    'En tatmin edici',
    'En acı verici',
    'En şifalı',
    'En depresif',
    'En az değer verilen',
    'En abartılan',
    'İlk oynadığım',
    'Vakit öldüren',
    'Gizli zevk',
    'Bir gün bitireceğim',
    'Nostalji',
    'Gizli mücevher',
  ],
  ui: { tip_edit: 'İpucu: Düzenlemek için tıklayın. Görselleri hücrelere sürükleyin.', generate: '{title} oluştur!', columns: 'Satır başına sütun:', columns_value: '{count} sütun' },
  dialog: { edit_title: 'Başlığı düzenle', edit_game_name: 'Oyun adını düzenle', edit_description: 'Açıklamayı düzenle', edit_main_title: 'Ana başlığı düzenle' },
  common: { cancel: 'İptal', save: 'Kaydet', close: 'Kapat', confirm: 'Onayla' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'İşe yaradıysa yıldız verin →',
    friend_link: 'Arkadaş bağlantısı:',
    friend_link_movie: 'Film tercih ızgarası',
    powered_by: 'SteamGridDB & Bangumi ile',
  },
  legal: {
    copyright_title: 'Telif hakkı bildirimi',
    privacy_title: 'Gizlilik politikası',
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
    title: 'Oyun ara',
    source: 'Kaynak:',
    placeholder: 'Oyun adını girin',
    searching: 'Aranıyor',
    search: 'Ara',
    retry: 'Yeniden dene',
    no_results: 'Sonuç yok',
    try_keywords: 'Farklı anahtar kelimeler deneyin',
    idle_hint: 'Başlamak için ad girin',
    results_count: '{count} sonuç',
    clear: 'Temizle',
    upload_image: 'Görsel yükle',
    bangumi_tip: 'Bangumi, anime ve oyun odaklı bir Çin veritabanıdır.',
    sgdb_tip: 'SteamGridDB kapak veritabanıdır (yalnızca İngilizce arama).',
  },
  crop: {
    title: 'Görseli kırp',
    tip: 'Kırpma alanını ayarlamak için sürükleyin ve yakınlaştırın',
    zoom: 'Yakınlaştır',
  },
  error: {
    file_too_large: 'Görsel dosyası çok büyük, lütfen {size} boyutundan küçük görseller yükleyin',
    image_load_failed_retry: 'Görsel yüklenemedi, lütfen tekrar deneyin',
    image_load_failed_select_another: 'Görsel yüklenemedi, tekrar deneyin veya başka bir görsel seçin',
    loading: 'Yüklenıyor...',
    processing: 'İşleniyor...',
  },
};

export default tr;
