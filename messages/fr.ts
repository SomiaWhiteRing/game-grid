const fr = {
  meta: { title: 'Grille de préférence de jeux', description: 'Créez votre grille personnelle de jeux' },
  global: { main_title: 'Grille de préférence de jeux' },
  cell_titles: [
    'Préféré',
    'Le plus influent',
    'Le plus impressionnant',
    'La plus longue relation',
    'Le plus joyeux',
    'À recommander',
    'Meilleure histoire',
    'Meilleurs visuels',
    'Meilleure musique',
    'Meilleur doublage',
    'Personnage préféré',
    'Meilleure fin',
    'Le plus satisfaisant',
    'Le plus douloureux',
    'Le plus apaisant',
    'Le plus déprimant',
    'Le plus sous-estimé',
    'Le plus surestimé',
    'Premier joué',
    'Passe-temps',
    'Plaisir coupable',
    'Je le finirai un jour',
    'Nostalgie',
    'Perle méconnue',
  ],
  ui: { tip_edit: "Astuce : cliquez pour éditer. Vous pouvez aussi glisser-déposer des images.", generate: 'Générer {title} !', columns: 'Colonnes par ligne :', columns_value: '{count} colonnes' },
  dialog: { edit_title: 'Modifier le titre', edit_game_name: 'Modifier le nom du jeu', edit_description: 'Modifier la description', edit_main_title: 'Modifier le titre principal' },
  common: { cancel: 'Annuler', save: 'Enregistrer', close: 'Fermer', confirm: 'Confirmer' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Utile ? Mettez une étoile →',
    friend_link: 'Lien ami :',
    friend_link_movie: 'Grille de préférence de films',
    powered_by: 'Propulsé par SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Avis de copyright',
    privacy_title: 'Politique de confidentialité',
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
    title: 'Rechercher un jeu',
    source: 'Source :',
    placeholder: 'Entrez le nom du jeu',
    searching: 'Recherche',
    search: 'Rechercher',
    retry: 'Réessayer',
    no_results: 'Aucun résultat',
    try_keywords: 'Essayez d’autres mots-clés',
    idle_hint: 'Saisissez un nom pour commencer',
    results_count: '{count} résultats',
    clear: 'Effacer',
    upload_image: 'Téléverser une image',
    bangumi_tip: "Bangumi est une base de données chinoise axée sur l'anime et le jeu.",
    sgdb_tip: 'SteamGridDB est une base de couvertures (recherche en anglais).',
  },
  crop: {
    title: 'Recadrer l\'image',
    tip: 'Faites glisser et zoomez pour ajuster la zone de recadrage',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Le fichier image est trop volumineux, veuillez télécharger une image inférieure à {size}',
    image_load_failed_retry: 'Échec du chargement de l\'image, veuillez réessayer',
    image_load_failed_select_another: 'Échec du chargement de l\'image, réessayez ou sélectionnez une autre image',
    loading: 'Chargement...',
    processing: 'Traitement...',
  },
};

export default fr;
