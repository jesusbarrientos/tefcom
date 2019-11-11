<template>
    <div>
        <mq-layout mq="desktop">
            <profile-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <profile-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import ProfileDesktop from './desktop/index'
    import ProfileMobile from './mobile/index'

    export default {
        name: 'Profile',
        components: { ProfileMobile, ProfileDesktop },
        created() {
            this.$store.commit('menu/reset')
        }
    }
</script>

<style scoped>

</style>
