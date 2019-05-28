<template>
    <div id="navbar-icon-component">
        <a :class="{focus: selected}" @click="onClick()">
            <a-icon :type="icon" />
            {{ title }}
        </a>
    </div>
</template>

<script>
    export default {
        name: 'NavbarIcon',
        props: {
            title: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        computed: {
            selected() {
                return this.$store.state.navbar.selected === this.title
            }
        },
        methods: {
            onClick() {
                this.$store.commit('navbar/setTitle', this.title)
                this.$store.commit('navbar/setSelected', this.title)
                this.$router.push({ path: this.url })
            }
        }
    }
</script>

<style scoped>

</style>
