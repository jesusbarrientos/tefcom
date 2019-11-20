<template>
    <a-menu
        id="navigation-component"
        v-model="defaultSelectedKeys"
        :open-keys="defaultOpenKeys"
        mode="inline"
        @openChange="onClick"
    >
        <a-menu-item v-for="item in nav.menu" v-if="item.responsive.includes($mq) && item.menu.length <= 0" :key="item.key">
            <nuxt-link :to="item.url">
                <a-icon v-if="item.icon" :type="item.icon" /><span>{{ item.label }}</span>
            </nuxt-link>
        </a-menu-item>

        <a-sub-menu v-else-if="item.responsive.includes($mq)" :key="item.key">
            <span slot="title"><a-icon :type="item.icon" />{{ item.label }}</span>

            <a-menu-item v-for="subItem in item.menu" v-if="subItem.responsive.includes($mq)" :key="subItem.key">
                <nuxt-link :to="subItem.url">
                    <a-icon v-if="subItem.icon" :type="subItem.icon" /><span>{{ subItem.label }}</span>
                </nuxt-link>
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>

<script>
    import { mapState } from 'vuex'
    import navigation from '@/static/navigation/navigation.json'

    export default {
        name: 'Navigation',
        data() {
            return {
                navigation
            }
        },
        computed: {
            ...mapState(['menu']),
            nav: function () {
                return this.navigation
            },
            defaultSelectedKeys: {
                set(selectedKeys) {
                    this.$store.commit('menu/setSelectedKeys', selectedKeys)
                },
                get() {
                    return this.menu.defaultSelectedKeys
                }
            },
            defaultOpenKeys: {
                get() {
                    return this.menu.defaultOpenKeys
                }
            }
        },
        created() {
            this.$store.commit('menu/setSelectedKeys', navigation.defaultSelectedKeys)
            this.$store.commit('menu/setOpenKeys', navigation.defaultOpenKeys)
        },
        methods: {
            onClick(openKeys) {
                this.$store.commit('menu/setOpenKeys', openKeys)
            }
        }
    }
</script>
