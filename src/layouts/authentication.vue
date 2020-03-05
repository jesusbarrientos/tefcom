<template>
    <a-locale-provider :locale="es_ES">
        <div id="authentication-layout" class="layout">
            <mq-layout mq="desktop">
                <div id="desktop">
                    <div id="content-desktop">
                        <nuxt />
                    </div>

                    <div id="footer-desktop">
                        Todos los derechos reservados.
                    </div>
                </div>
            </mq-layout>

            <mq-layout :mq="['mobile', 'tablet']">
                <div id="mobile">
                    <div id="content-mobile">
                        <nuxt />
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

    export default {
        name: 'Authentication',
        data() {
            return {
                es_ES,
                showSaveScreen: true
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
