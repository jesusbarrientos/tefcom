<template>
    <div id="header-mobile-component">
        <h3>{{ title }}</h3>
    </div>
</template>

<script>
    export default {
        name: 'HeaderMobile',
        computed: {
            title() {
                return this.$store.state.navbar.title
            }
        }
    }
</script>

<style scoped>

</style>
