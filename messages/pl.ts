const pl = {
  meta: { title: 'Siatka preferencji gier', description: 'Utwórz własną siatkę preferencji' },
  global: { main_title: 'Siatka preferencji gier' },
  cell_titles: [
    'Ulubiona',
    'Najbardziej wpływowa',
    'Najbardziej zachwycająca',
    'Najdłuższa relacja',
    'Najbardziej radosna',
    'Najbardziej polecana',
    'Najlepsza fabuła',
    'Najlepsza grafika',
    'Najlepsza muzyka',
    'Najlepszy dubbing',
    'Ulubiona postać',
    'Najlepsze zakończenie',
    'Najbardziej satysfakcjonująca',
    'Najbardziej bolesna',
    'Najbardziej kojąca',
    'Najbardziej przygnębiająca',
    'Najbardziej niedoceniona',
    'Najbardziej przeceniona',
    'Pierwsza zagrana',
    'Zabijacz czasu',
    'Guilty pleasure',
    'Kiedyś ją skończę',
    'Nostalgia',
    'Ukryty skarb',
  ],
  ui: { tip_edit: 'Wskazówka: kliknij, aby edytować. Przeciągnij obrazy do komórek.', generate: 'Generuj {title}!', columns: 'Kolumn w wierszu:', columns_value: '{count} kolumn' },
  dialog: { edit_title: 'Edytuj tytuł', edit_game_name: 'Edytuj nazwę', edit_description: 'Edytuj opis', edit_main_title: 'Edytuj tytuł główny' },
  common: { cancel: 'Anuluj', save: 'Zapisz', close: 'Zamknij', confirm: 'Potwierdź' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Przydatne? Daj gwiazdkę →',
    friend_link: 'Link przyjacielski:',
    friend_link_movie: 'Siatka preferencji filmowych',
    powered_by: 'Dzięki SteamGridDB i Bangumi',
  },
  legal: {
    copyright_title: 'Informacja o prawach autorskich',
    privacy_title: 'Polityka prywatności',
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
    title: 'Szukaj gry',
    source: 'Źródło:',
    placeholder: 'Wpisz nazwę gry',
    searching: 'Wyszukiwanie',
    search: 'Szukaj',
    retry: 'Ponów',
    no_results: 'Brak wyników',
    try_keywords: 'Spróbuj innych słów kluczowych',
    idle_hint: 'Wpisz nazwę, aby zacząć',
    results_count: '{count} wyników',
    clear: 'Wyczyść',
    upload_image: 'Prześlij obraz',
    bangumi_tip: 'Bangumi to chińska baza danych o anime i grach.',
    sgdb_tip: 'SteamGridDB to baza okładek (wyszukiwanie po angielsku).',
  },
  crop: {
    title: 'Przytnij obraz',
    tip: 'Przeciągnij i przybliż, aby dostosować obszar przycinania',
    zoom: 'Powiększenie',
  },
  error: {
    file_too_large: 'Plik obrazu jest za duży, prześlij obrazy mniejsze niż {size}',
    image_load_failed_retry: 'Nie udało się załadować obrazu, spróbuj ponownie',
    image_load_failed_select_another: 'Nie udało się załadować obrazu, spróbuj ponownie lub wybierz inny obraz',
    loading: 'Ładowanie...',
    processing: 'Przetwarzanie...',
  },
};

export default pl;
