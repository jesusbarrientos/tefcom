<template>
    <div id="modules-page">
        <a-row type="flex" justify="center" align="top">
            <a-col :span="24">
                <a-collapse accordion>
                    <a-collapse-panel v-for="module of modules" :key="module.key" :header="module.label">
                        <a-button v-for="submenu of module.menu" :key="submenu.key" block class="module-button" @click="onClick(submenu.label, submenu.url)">
                            {{ submenu.label }}
                        </a-button>
                    </a-collapse-panel>
                </a-collapse>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import navigation from '@@/static/navigation/navigation.json'

    export default {
        name: 'Modules',
        data() {
            return {
                navigation
            }
        },
        computed: {
            modules: function () {
                return this.navigation.menu.filter((item) => {
                    return item.key !== this.navigation.defaultSelectedKeys[0]
                })
            }
        },
        methods: {
            onClick(title, url) {
                this.$store.commit('navbar/setTitle', title)
                this.$router.push({ path: url })
            }
        }
    }
</script>

<style scoped>

</style>
