<template>
    <div id="header-desktop-component">

        <div class="logo">
            <logo />
        </div>

        <div class="user">
            <user-desktop />
            <a-divider type="vertical" class="divider" />
        </div>

        <div class="extra">
            <extra-options-desktop />
        </div>
    </div>
</template>

<script>
    import Logo from '../logo/Logo'
    import UserDesktop from '../user/UserDesktop'
    import ExtraOptionsDesktop from '../extra/ExtraOptionsDesktop'

    export default {
        name: 'HeaderDesktop',
        components: { ExtraOptionsDesktop, UserDesktop, Logo }
    }
</script>

<style scoped>

</style>
