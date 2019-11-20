<template>
    <div>
        <mq-layout mq="desktop">
            <profile-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <profile-mobile :view-data="viewData" @event="onEvent($event)" />
        </mq-layout>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'
    import ProfileDesktop from './desktop/index'
    import ProfileMobile from './mobile/index'

    const viewData = {
        imageUrl: '',
        uploadingImage: false,
        event: {
            REMOVE_AVATAR: 'remove_avatar',
            EDIT_PROFILE: 'edit_profile',
            UPLOAD_AVATAR: 'upload_avatar',
            EDIT_PASSWORD: 'edit_password'
        }
    }

    export default {
        name: 'Profile',
        components: { ProfileMobile, ProfileDesktop },
        data() {
            return {
                viewData
            }
        },
        created() {
            this.$store.commit('menu/reset')
            viewData.imageUrl = this.$store.state.profile.avatar
        },
        methods: {
            /**
             * Método que se ejecuta cuando los componentes (mobile, tablet, desktop) de la vista hacen una acción.
             * @param $event evento emitido.
             */
            async onEvent($event) {
                switch ($event.type) {
                    case viewData.event.REMOVE_AVATAR: {
                        viewData.imageUrl = ''
                        break
                    }

                    case viewData.event.EDIT_PROFILE: {
                        await this.editProfile($event.body)
                        break
                    }

                    case viewData.event.UPLOAD_AVATAR: {
                        await this.changeAvatar($event.body)
                        break
                    }

                    case viewData.event.EDIT_PASSWORD: {
                        $event.callback(this.editPassword($event.body))
                        break
                    }
                }
            },

            /**
             * Llama a servicio aws-api-gateway para editar datos personales del usuario.
             * @param values nombre, apellido, correo, avatar.
             */
            async editProfile(values) {
                this.$store.commit('spin/set', { show: true, tip: 'Guardando Cambios' })

                await this.$axios.$post(process.env.apiBaseUrl + '/user/edit', {
                    ...values,
                    avatar: viewData.imageUrl !== '' && viewData.imageUrl !== null ? viewData.imageUrl : undefined
                })
                    .then((response) => {
                        if (response != null) {
                            this.$store.commit('profile/setProfile', {
                                avatar: viewData.imageUrl,
                                ...values
                            })

                            this.$message.success('Datos modificados.', 3)
                        } else
                            this.$message.error('Error inesperado.', 3)
                    })
                    .catch((e) => {
                        this.$message.error('Error inesperado.', 3)
                    })
                    .finally(() => {
                        this.$store.commit('spin/reset')
                    })
            },

            /**
             * Transforma imagen a code64.
             * @param img
             * @param callback
             */
            getBase64(img, callback) {
                const reader = new FileReader()
                reader.addEventListener('load', () => callback(reader.result))
                reader.readAsDataURL(img)
            },

            /**
             * Carga imagen del perfil.
             * @param info
             */
            changeAvatar(info) {
                if (info.file.status === 'uploading') {
                    viewData.imageUrl = ''
                    viewData.uploadingImage = true
                    return
                }
                if (info.file.status === 'done') {
                    this.getBase64(info.file.originFileObj, (imageUrl) => {
                        viewData.imageUrl = imageUrl
                        viewData.uploadingImage = false
                    })
                }
            },

            /**
             * Llama a servicio aws-amplify para editar contraseña del usuario.
             * @param values oldPassword, password.
             */
            editPassword(values) {
                this.$store.commit('spin/set', { show: true, tip: 'Cambiando Contraseña' })

                return new Promise(async (resolve, reject) => {
                    await Auth.currentAuthenticatedUser()
                        .then((user) => {
                            return Auth.changePassword(user, values.oldPassword, values.password)
                        })
                        .then((data) => {
                            if (data !== 'SUCCESS') {
                                if (data.code === 'NotAuthorizedException') {
                                    reject({
                                        code: 'NotAuthorizedException',
                                        message: 'Error!',
                                        description: 'La contraseña actual ingresada no es correcta.',
                                        duration: 8
                                    })
                                } else {
                                    reject({
                                        code: null,
                                        message: 'Error!',
                                        description: 'Error desconocido. Contacte a soporte.',
                                        duration: 8
                                    })
                                }
                            } else {
                                resolve({
                                    code: null,
                                    message: 'Contraseña Actualizada!',
                                    description: 'La contraseña se ha modificado correctamente.',
                                    duration: 3
                                })
                            }
                        })
                        .catch((error) => {
                            if (error.code === 'LimitExceededException') {
                                reject({
                                    code: 'LimitExceededException',
                                    message: 'Error!',
                                    description: 'Superó el número de intentos. Inténtelo más tarde.',
                                    duration: 8
                                })
                            } else {
                                reject({
                                    code: null,
                                    message: 'Error!',
                                    description: 'Error desconocido. Contacte a soporte.',
                                    duration: 8
                                })
                            }
                        })
                        .finally(() => {
                            this.$store.commit('spin/reset')
                        })
                })
            }
        }
    }
</script>

<style scoped>

</style>
