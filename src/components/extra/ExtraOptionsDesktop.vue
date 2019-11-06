<template>
    <div id="extra-options-desktop-components">
        <a-popover title="Opciones" placement="bottomRight">
            <a-icon type="setting" class="config" />

            <a slot="content" @click="logOut">Cerrar Sesión</a>
        </a-popover>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'

    export default {
        name: 'ExtraOptionsDesktop',
        methods: {
            logOut() {
                this.$confirm({
                    title: 'Cerrar Sesión',
                    content: 'Está a punto de cerrar la sesión. ¿Desea continuar?',
                    okText: 'Continuar',
                    cancelText: 'Cancelar',
                    centered: true,
                    onOk() {
                        Auth.signOut()
                    },
                    onCancel() {}
                })
            }
        }
    }
</script>

<style scoped>

</style>
