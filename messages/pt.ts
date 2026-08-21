const pt = {
  meta: { title: 'Grade de preferências de jogos', description: 'Crie sua grade pessoal de jogos' },
  global: { main_title: 'Grade de preferências de jogos' },
  cell_titles: [
    'Favorito',
    'Mais influente',
    'Mais impressionante',
    'Relacionamento mais longo',
    'Mais divertido',
    'Mais recomendável',
    'Melhor história',
    'Melhores visuais',
    'Melhor trilha sonora',
    'Melhor dublagem',
    'Personagem favorito',
    'Melhor final',
    'Mais satisfatório',
    'Mais doloroso',
    'Mais relaxante',
    'Mais depressivo',
    'Mais subestimado',
    'Mais superestimado',
    'Primeiro jogado',
    'Passa-tempo',
    'Guilty pleasure',
    'Um dia eu termino',
    'Nostalgia',
    'Jóia escondida',
  ],
  ui: { tip_edit: 'Dica: clique para editar. Arraste imagens para as células.', generate: 'Gerar {title}!', columns: 'Colunas por linha:', columns_value: '{count} colunas' },
  dialog: { edit_title: 'Editar título', edit_game_name: 'Editar nome', edit_description: 'Editar descrição', edit_main_title: 'Editar título principal' },
  common: { cancel: 'Cancelar', save: 'Salvar', close: 'Fechar', confirm: 'Confirmar' },
  footer: {
    made_with: 'made with Copilot & Codex',
    if_useful_star: 'Achou útil? Dê uma estrela →',
    friend_link: 'Link amigo:',
    friend_link_movie: 'Grade de preferências de filmes',
    powered_by: 'Com SteamGridDB & Bangumi',
  },
  legal: {
    copyright_title: 'Aviso de direitos autorais',
    privacy_title: 'Política de privacidade',
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
    title: 'Buscar jogo',
    source: 'Fonte:',
    placeholder: 'Digite o nome do jogo',
    searching: 'Buscando',
    search: 'Buscar',
    retry: 'Tentar novamente',
    no_results: 'Nenhum resultado',
    try_keywords: 'Tente outras palavras-chave',
    idle_hint: 'Digite um nome para começar',
    results_count: '{count} resultados',
    clear: 'Limpar',
    upload_image: 'Enviar imagem',
    bangumi_tip: 'Bangumi é um banco de dados chinês focado em anime e jogos.',
    sgdb_tip: 'SteamGridDB é um banco de capas (busca em inglês).',
  },
  crop: {
    title: 'Recortar imagem',
    tip: 'Arraste e amplie para ajustar a área de recorte',
    zoom: 'Zoom',
  },
  error: {
    file_too_large: 'Arquivo de imagem muito grande, por favor envie imagens menores que {size}',
    image_load_failed_retry: 'Falha ao carregar imagem, tente novamente',
    image_load_failed_select_another: 'Falha ao carregar imagem, tente novamente ou selecione outra imagem',
    loading: 'Carregando...',
    processing: 'Processando...',
  },
};

export default pt;
