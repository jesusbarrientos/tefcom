<template>
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
            <div id="mobile">

                <div id="header-mobile">
                    <header-mobile />
                </div>

                <div id="content-mobile">
                    <nuxt />
                </div>

                <div id="footer-mobile">
                    <footer-navbar />
                </div>

            </div>
        </mq-layout>
    </div>
</template>

<script>
    import HeaderDesktop from '../components/header/HeaderDesktop'
    import Navigation from '../components/navigation/Navigation'
    import HeaderMobile from '../components/header/HeaderMobile'
    import FooterNavbar from '../components/footer_navbar/FooterNavbar'

    export default {
        name: 'Default',
        components: { FooterNavbar, HeaderMobile, Navigation, HeaderDesktop }
    }
</script>

<style scoped>

</style>
