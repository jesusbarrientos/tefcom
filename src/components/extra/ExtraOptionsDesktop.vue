<template>
    <div id="extra-options-desktop-components">
        <a-popover v-model="visible" title="Opciones" trigger="click" placement="bottomRight">
            <a-icon type="setting" class="config" />

            <div slot="content">
                <a-row style="margin-bottom: 10px">
                    <a @click="toProfile">Mi Cuenta</a>
                </a-row>
                <a-row>
                    <a @click="logOut">Cerrar Sesión</a>
                </a-row>
            </div>
        </a-popover>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'

    export default {
        name: 'ExtraOptionsDesktop',
        data() {
            return {
                visible: false
            }
        },
        methods: {
            toProfile() {
                let self = this
                this.visible = false

                if (self.$route.name !== 'profile') {
                    this.$confirm({
                        title: 'Configuración de Cuenta',
                        content: 'Está a punto de dirigirse a la seccion de perfil. Toda actividad no guardada se podría perder, ¿desea continuar?',
                        okText: 'Continuar',
                        cancelText: 'Cancelar',
                        centered: true,
                        onOk() {
                            self.$router.push({ name: 'profile' })
                        },
                        onCancel() {}
                    })
                }
            },
            logOut() {
                this.visible = false

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
