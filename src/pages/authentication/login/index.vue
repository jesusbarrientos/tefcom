<template>
    <div>
        <mq-layout mq="desktop">
            <login-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <login-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import LoginDesktop from './desktop/index'
    import LoginMobile from './mobile/index'

    export default {
        name: 'Login',
        layout: 'authentication',
        components: { LoginMobile, LoginDesktop }
    }
</script>

<style scoped>

</style>
