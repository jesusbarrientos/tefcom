<template>
    <div />
</template>

<script>
    export default {
        async created() {
            await this.$store.commit('navigation/setDefaultRoute', this.$mq)
            this.$router.push({ path: this.$store.state.navigation.default })
        }
    }
</script>

<style scoped>

</style>
