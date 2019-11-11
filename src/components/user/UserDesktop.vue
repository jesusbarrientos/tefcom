<template>
    <div id="user-desktop-component">

        <a-row type="flex" align="middle">
            <div class="user-image">
                <a-avatar icon="user" :src="avatar" />
            </div>

            <div class="user-name">
                {{ fullName }}
            </div>
        </a-row>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex'

    export default {
        name: 'UserDesktop',
        computed: {
            ...mapState(['profile']),
            ...mapGetters({
                fullName: 'profile/fullName'
            }),
            avatar() {
                return this.profile.avatar
            }
        }
    }
</script>

<style scoped>

</style>
