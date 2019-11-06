const pkg = require('./package')
const aws = require('./src/static/aws')
const app = require('./src/static/app')

module.exports = {
    mode: 'spa',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.title,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'user-scalable=no, width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#00cdff' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        htmlAttrs: {
            lang: 'es'
        }
    },

    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },

    manifest: {
        lang: 'es',
        name: 'Tefcom',
        short_name: 'Tefcom',
        start_url: '/',
        orientation: 'portrait-primary',
        background_color: '#1e1e1e',
        display: 'fullscreen'
    },

    workbox: {
        dev: true,
        config: {
            debug: true
        }
    },

    /*
    ** Global CSS
    */
    css: [
        'ant-design-vue/dist/antd.css',
        '@/assets/styles/app.css'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@@/plugins/antd-ui',
        '@@/plugins/scroll',
        '@@/plugins/mask',
        '@@/plugins/aws',
        { src: '@@/plugins/mq', ssr: true }
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa'
        // '@nuxtjs/eslint-module'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
    ** Environment variables
    */
    env: {
        app,
        aws,
        apiBaseUrl: 'https://pzgpr1vjzg.execute-api.us-east-2.amazonaws.com/beta'
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },

    /*
    ** Source directory
    */
    srcDir: 'src/',

    /*
    ** Router options
    */
    router: {
        middleware: 'auth',
        extendRoutes(routes, resolve) {
            routes.push({
                name: 'custom',
                path: '*',
                redirect: 'authentication/login'
            })
        }
    }
}
