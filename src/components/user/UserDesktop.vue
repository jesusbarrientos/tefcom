<template>
    <div id="user-desktop-component">

        <a-row type="flex" align="middle">
            <div class="user-image">
                <a-avatar icon="user" />
            </div>

            <div class="user-name">
                {{ fullName }}
            </div>
        </a-row>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'UserDesktop',
        computed: {
            ...mapGetters({
                fullName: 'user/fullName'
            })
        }
    }
</script>

<style scoped>

</style>
