const es = {
  meta: { title: 'Cuadrícula de preferencias', description: 'Crea tu cuadrícula personal de juegos' },
  global: { main_title: 'Cuadrícula de preferencias' },
  cell_titles: [
    'Favorito',
    'Más influyente',
    'Más sorprendente',
    'Relación más larga',
    'Más alegre',
    'Más recomendable',
    'Mejor historia',
    'Mejores gráficos',
    'Mejor música',
    'Mejor doblaje',
    'Personaje favorito',
    'Mejor final',
    'Más satisfactorio',
    'Más doloroso',
    'Más curativo',
    'Más deprimente',
    'Más infravalorado',
    'Más sobrevalorado',
    'Primer juego',
    'Mata‑tiempo',
    'Placer culposo',
    'Algún día lo terminaré',
    'Nostalgia',
    'Joya oculta',
  ],
  ui: { tip_edit: 'Consejo: haga clic para editar. Arrastre imágenes a celdas.', generate: 'Generar {title}!', columns: 'Columnas por fila:', columns_value: '{count} columnas' },
  dialog: { edit_title: 'Editar título', edit_game_name: 'Editar nombre', edit_description: 'Editar descripción', edit_main_title: 'Editar título principal' },
  common: { cancel: 'Cancelar', save: 'Guardar', close: 'Cerrar', confirm: 'Confirmar' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: '¿Te sirve? Dale una estrella →',
    friend_link: 'Enlace amigo:',
    friend_link_movie: 'Cuadrícula de preferencias de películas',
    powered_by: 'Con la ayuda de SteamGridDB y Bangumi',
  },
  legal: {
    copyright_title: 'Aviso de copyright',
    privacy_title: 'Política de privacidad',
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
    title: 'Buscar juego',
    source: 'Fuente:',
    placeholder: 'Introduce el nombre del juego',
    searching: 'Buscando',
    search: 'Buscar',
    retry: 'Reintentar',
    no_results: 'Sin resultados',
    try_keywords: 'Prueba otras palabras clave',
    idle_hint: 'Escribe un nombre para empezar',
    results_count: '{count} resultados',
    clear: 'Limpiar',
    upload_image: 'Subir imagen',
    bangumi_tip: 'Bangumi es una base de datos china centrada en anime y juegos.',
    sgdb_tip: 'SteamGridDB es una base de portadas (búsqueda en inglés).',
  },
  crop: {
    title: 'Recortar imagen',
    tip: 'Arrastra y amplía para ajustar el área de recorte',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Archivo de imagen demasiado grande, por favor sube imágenes menores de {size}',
    image_load_failed_retry: 'Error al cargar la imagen, inténtalo de nuevo',
    image_load_failed_select_another: 'Error al cargar la imagen, inténtalo de nuevo o selecciona otra imagen',
    loading: 'Cargando...',
    processing: 'Procesando...',
  },
};

export default es;
