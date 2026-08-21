const nl = {
  meta: { title: 'Spelvoorkeurenraster', description: 'Maak je persoonlijke raster' },
  global: { main_title: 'Spelvoorkeurenraster' },
  cell_titles: [
    'Favoriet',
    'Meest invloedrijk',
    'Meest indrukwekkend',
    'Langste relatie',
    'Meest vrolijk',
    'Meest aan te raden',
    'Beste verhaal',
    'Beste visuals',
    'Beste muziek',
    'Beste stemacteerwerk',
    'Favoriete personage',
    'Beste einde',
    'Meest bevredigend',
    'Meest pijnlijk',
    'Meest helend',
    'Meest deprimerend',
    'Meest onderschat',
    'Meest overschat',
    'Eerste ooit',
    'Tijdverdrijf',
    'Guilty pleasure',
    'Ooit maak ik het uit',
    'Nostalgie',
    'Verborgen parel',
  ],
  ui: { tip_edit: 'Tip: klik om te bewerken. Sleep afbeeldingen naar cellen.', generate: 'Genereer {title}!', columns: 'Kolommen per rij:', columns_value: '{count} kolommen' },
  dialog: { edit_title: 'Titel bewerken', edit_game_name: 'Spelnaam bewerken', edit_description: 'Beschrijving bewerken', edit_main_title: 'Hoofdtitel bewerken' },
  common: { cancel: 'Annuleren', save: 'Opslaan', close: 'Sluiten', confirm: 'Bevestigen' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Handig? Geef een ster →',
    friend_link: 'Vriendschapslink:',
    friend_link_movie: 'Filmvoorkeurenraster',
    powered_by: 'Mede mogelijk gemaakt door SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Copyright-mededeling',
    privacy_title: 'Privacybeleid',
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
    title: 'Spel zoeken',
    source: 'Bron:',
    placeholder: 'Voer spelnaam in',
    searching: 'Zoeken',
    search: 'Zoek',
    retry: 'Opnieuw',
    no_results: 'Geen resultaten',
    try_keywords: 'Probeer andere zoekwoorden',
    idle_hint: 'Voer een naam in om te starten',
    results_count: '{count} resultaten',
    clear: 'Wissen',
    upload_image: 'Afbeelding uploaden',
    bangumi_tip: 'Bangumi is een Chinese DB voor anime en games.',
    sgdb_tip: 'SteamGridDB is een covers-DB (alleen Engels zoeken).',
  },
  crop: {
    title: 'Afbeelding bijsnijden',
    tip: 'Sleep en zoom om het bijsnijgebied aan te passen',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Afbeeldingsbestand te groot, upload afbeeldingen kleiner dan {size}',
    image_load_failed_retry: 'Laden van afbeelding mislukt, probeer opnieuw',
    image_load_failed_select_another: 'Laden van afbeelding mislukt, probeer opnieuw of selecteer een andere afbeelding',
    loading: 'Laden...',
    processing: 'Verwerken...',
  },
};

export default nl;
