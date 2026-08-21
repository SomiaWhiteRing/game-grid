const it = {
  meta: { title: 'Griglia di preferenze di gioco', description: 'Crea la tua griglia personale' },
  global: { main_title: 'Griglia di preferenze di gioco' },
  cell_titles: [
    'Preferito',
    'Più influente',
    'Più sorprendente',
    'Relazione più lunga',
    'Più divertente',
    'Più consigliabile',
    'Miglior storia',
    'Migliori visual',
    'Miglior musica',
    'Miglior doppiaggio',
    'Personaggio preferito',
    'Miglior finale',
    'Più soddisfacente',
    'Più doloroso',
    'Più rilassante',
    'Più deprimente',
    'Più sottovalutato',
    'Più sopravvalutato',
    'Primo giocato',
    'Ammazza‑tempo',
    'Guilty pleasure',
    'Lo finirò un giorno',
    'Nostalgia',
    'Gioiello nascosto',
  ],
  ui: { tip_edit: 'Suggerimento: clic per modificare. Trascina immagini nelle celle.', generate: 'Genera {title}!', columns: 'Colonne per riga:', columns_value: '{count} colonne' },
  dialog: { edit_title: 'Modifica titolo', edit_game_name: 'Modifica nome', edit_description: 'Modifica descrizione', edit_main_title: 'Modifica titolo principale' },
  common: { cancel: 'Annulla', save: 'Salva', close: 'Chiudi', confirm: 'Conferma' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Utile? Metti una stella →',
    friend_link: 'Link amico:',
    friend_link_movie: 'Griglia di preferenze di film',
    powered_by: 'Con SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Avviso di copyright',
    privacy_title: 'Informativa sulla privacy',
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
    title: 'Cerca gioco',
    source: 'Fonte:',
    placeholder: 'Inserisci il nome del gioco',
    searching: 'Ricerca in corso',
    search: 'Cerca',
    retry: 'Riprova',
    no_results: 'Nessun risultato',
    try_keywords: 'Prova altre parole chiave',
    idle_hint: 'Digita un nome per iniziare',
    results_count: '{count} risultati',
    clear: 'Pulisci',
    upload_image: 'Carica immagine',
    bangumi_tip: 'Bangumi è un DB cinese focalizzato su anime e giochi.',
    sgdb_tip: 'SteamGridDB è un DB di copertine (ricerca in inglese).',
  },
  crop: {
    title: 'Ritaglia immagine',
    tip: 'Trascina e zoom per regolare l\'area di ritaglio',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'File immagine troppo grande, carica immagini più piccole di {size}',
    image_load_failed_retry: 'Caricamento immagine fallito, riprova',
    image_load_failed_select_another: 'Caricamento immagine fallito, riprova o seleziona un\'altra immagine',
    loading: 'Caricamento...',
    processing: 'Elaborazione...',
  },
};

export default it;
