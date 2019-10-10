<template>
    <a-menu id="navigation-component" mode="inline" :default-selected-keys="menu.defaultSelectedKeys">
        <a-menu-item v-for="item in menu.menu" v-if="item.responsive.includes($mq) && item.menu.length <= 0" :key="item.key">
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
    import navigation from '@/static/navigation/navigation.json'

    export default {
        name: 'Navigation',
        data() {
            return {
                navigation
            }
        },
        computed: {
            menu: function () {
                return this.navigation
            }
        },
        methods: {
            handleClick(e) {
                console.log('click', e)
            }
        }
    }
</script>
