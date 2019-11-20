<template>
    <div id="footer-navbar-component">
        <!--        <navbar-icon title="Dashboard" icon="dashboard" url="/dashboard" />-->
        <!--        <navbar-icon title="Módulos" icon="appstore" url="/modules" />-->
        <navbar-icon title="Cuenta" icon="user" url="/profile" />
        <navbar-icon title="Asistencia" icon="calendar" url="/human_resources/attendance" />
    </div>
</template>

<script>
    import NavbarIcon from '../navbar-icon/NavbarIcon'

    export default {
        name: 'FooterNavbar',
        components: { NavbarIcon }
    }
</script>

<style scoped>

</style>
