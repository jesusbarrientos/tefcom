<template>
    <a-locale-provider :locale="es_ES">
        <div id="default-layout" class="layout">
            <mq-layout mq="desktop">
                <div id="desktop">

                    <div id="header-desktop">
                        <header-desktop />
                    </div>

                    <div id="sider-desktop">
                        <navigation />
                    </div>

                    <div id="content-desktop">
                        <div id="page-content">
                            <nuxt />
                        </div>

                        <div id="footer-desktop">
                            Todos los derechos reservados.
                        </div>
                    </div>

                </div>
            </mq-layout>

            <mq-layout :mq="['mobile', 'tablet']">
                <a-spin v-if="loadingData" class="spin-loading" :tip="tip" size="large" />

                <div id="mobile">

                    <div id="header-mobile">
                        <header-mobile />
                    </div>

                    <div id="content-mobile" style="padding-bottom: 100px">
                        <nuxt />
                    </div>

                    <div id="footer-mobile">
                        <footer-navbar />
                    </div>

                </div>
            </mq-layout>

            <div v-if="showSaveScreen" id="layout-save-screen" />
        </div>
    </a-locale-provider>
</template>

<script>
    // eslint-disable-next-line camelcase
    import es_ES from 'ant-design-vue/lib/locale-provider/es_ES'
    import HeaderDesktop from '../components/header/HeaderDesktop'
    import Navigation from '../components/navigation/Navigation'
    import HeaderMobile from '../components/header/HeaderMobile'
    import FooterNavbar from '../components/footer-navbar/FooterNavbar'

    export default {
        name: 'Default',
        components: { FooterNavbar, HeaderMobile, Navigation, HeaderDesktop },
        data() {
            return {
                es_ES,
                showSaveScreen: true
            }
        },
        computed: {
            loadingData() {
                return this.$store.state.spin.show
            },
            tip() {
                return this.$store.state.spin.tip
            }
        },
        mounted() {
            setTimeout(() => {
                this.showSaveScreen = false
            }, 100)
        }
    }
</script>

<style scoped>

</style>
