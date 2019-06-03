<template>
    <div>
        <mq-layout mq="desktop">
            <material-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <material-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import MaterialDesktop from './desktop/index'
    import MaterialMobile from './mobile/index'

    export default {
        name: 'Material',
        components: { MaterialMobile, MaterialDesktop }
    }
</script>

<style scoped>

</style>
