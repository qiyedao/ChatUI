import { defineConfig, DefaultTheme } from 'vitepress';

const ogDescription = 'Next Generation Frontend Tooling';
const ogImage = 'https://vitejs.dev/og-image.png';
const ogTitle = 'Vite';
const ogUrl = 'https://vitejs.dev';

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || '';
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev';

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main';
    case '':
      return 'local';
    default:
      return 'release';
  }
})();
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)';
    case 'local':
      return ' (local)';
    case 'release':
      return '';
  }
})();
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 4 Docs (release)',
          link: 'https://vitejs.dev',
        },
        {
          text: 'Vite 3 Docs',
          link: 'https://v3.vitejs.dev',
        },
        {
          text: 'Vite 2 Docs',
          link: 'https://v2.vitejs.dev',
        },
      ];
    case 'release':
      return [
        {
          text: 'Vite 3 Docs',
          link: 'https://v3.vitejs.dev',
        },
        {
          text: 'Vite 2 Docs',
          link: 'https://v2.vitejs.dev',
        },
      ];
  }
})();

export default defineConfig({
  title: `ChatPro${additionalTitle}`,
  description: 'Chat Tooling',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  vue: {
    reactivityTransform: true,
  },

  themeConfig: {
    logo: '/logo.svg',

    // editLink: {
    //   pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
    //   text: 'Suggest changes to this page',
    // },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vitejs/vite' }],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en'],
      },
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    localeLinks: {
      text: '简体中文',
      items: [{ text: '简体中文', link: '' }],
    },

    footer: {
      message: `ChatPro (${commitRef})`,
      copyright: 'Copyright © 2019-present',
    },

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Config', link: '/config/', activeMatch: '/config/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Why Chat Pro',
              link: '/guide/why',
            },
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'ChatUI',
              link: 'https://chatui.io/docs/quick-start',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Config',
          items: [
            {
              text: 'Root Options',
              link: '/config/',
            },
            {
              text: 'Config Options',
              link: '/config/sdk-config',
            },
            {
              text: 'Requests Options',
              link: '/config/requests',
            },
            {
              text: 'Components Options',
              link: '/config/components',
            },
            {
              text: 'Handlers Options',
              link: '/config/handlers',
            },
            {
              text: 'API-Ctx',
              link: '/config/API-ctx',
            },
          ],
        },
      ],
    },
  },
});
