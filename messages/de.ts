const de = {
  meta: { title: 'Spielpräferenz-Gitter', description: 'Erstelle dein persönliches Spielgitter' },
  global: { main_title: 'Spielpräferenz-Gitter' },
  cell_titles: [
    'Lieblingsspiel',
    'Am einflussreichsten',
    'Am beeindruckendsten',
    'Längste Beziehung',
    'Am fröhlichsten',
    'Am empfehlenswertesten',
    'Beste Story',
    'Beste Grafik',
    'Beste Musik',
    'Beste Sprachausgabe',
    'Lieblingscharakter',
    'Bestes Ende',
    'Am befriedigendsten',
    'Am schmerzhaftesten',
    'Am heilsamsten',
    'Am deprimierendsten',
    'Am unterschätztesten',
    'Am überschätztesten',
    'Erstes Spiel',
    'Zeitvertreib',
    'Guilty Pleasure',
    'Irgendwann beende ich es',
    'Nostalgie',
    'Verstecktes Juwel',
  ],
  ui: { tip_edit: 'Tipp: Klicken zum Bearbeiten. Bilder per Drag & Drop in Zellen.', generate: '{title} erzeugen!', columns: 'Spalten pro Zeile:', columns_value: '{count} Spalten' },
  dialog: { edit_title: 'Titel bearbeiten', edit_game_name: 'Spielname bearbeiten', edit_description: 'Beschreibung bearbeiten', edit_main_title: 'Haupttitel bearbeiten' },
  common: { cancel: 'Abbrechen', save: 'Speichern', close: 'Schließen', confirm: 'Bestätigen' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Nützlich? Bitte einen Stern →',
    friend_link: 'Freundschaftslink:',
    friend_link_movie: 'Film-Präferenz-Gitter',
    powered_by: 'Bereitgestellt von SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Copyright-Hinweis',
    privacy_title: 'Datenschutzerklärung',
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
    title: 'Spiel suchen',
    source: 'Quelle:',
    placeholder: 'Spielname eingeben',
    searching: 'Suche läuft',
    search: 'Suchen',
    retry: 'Erneut versuchen',
    no_results: 'Keine Ergebnisse',
    try_keywords: 'Andere Stichwörter versuchen',
    idle_hint: 'Spielname eingeben, um zu starten',
    results_count: '{count} Ergebnisse',
    clear: 'Löschen',
    upload_image: 'Bild hochladen',
    bangumi_tip: 'Bangumi ist eine chinesische DB für Anime und Spiele.',
    sgdb_tip: 'SteamGridDB ist eine Cover-DB (nur englische Suche).',
  },
  crop: {
    title: 'Bild zuschneiden',
    tip: 'Ziehen und zoomen, um den Zuschnitt anzupassen',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Bilddatei zu groß, bitte Bilder kleiner als {size} hochladen',
    image_load_failed_retry: 'Bild konnte nicht geladen werden, bitte erneut versuchen',
    image_load_failed_select_another: 'Bild konnte nicht geladen werden, erneut versuchen oder anderes Bild wählen',
    loading: 'Laden...',
    processing: 'Verarbeitung...',
  },
};

export default de;
