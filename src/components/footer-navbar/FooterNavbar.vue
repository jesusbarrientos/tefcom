<template>
    <div id="footer-navbar-component">
        <!--        <navbar-icon title="Dashboard" icon="dashboard" url="/dashboard" />-->
        <!--        <navbar-icon title="Módulos" icon="appstore" url="/modules" />-->
        <navbar-icon title="Cuenta" icon="user" url="/profile" />
        <navbar-icon title="Asistencia" icon="calendar" url="/human_resources/attendance" />
        <navbar-icon title="Cotizaciones" icon="file-text" url="/documents/budget" />
        <navbar-icon title="Materiales" icon="experiment" url="/material" />
        <navbar-icon title="Empleados" icon="team" url="/human_resources/employee" />
        <navbar-icon title="Asistencias" icon="file-text" url="/documents/attendance" />
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
