<template>
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
    </div>
</template>

<script>
    export default {
        name: 'Authentication'
    }
</script>

<style scoped>

</style>
