<template>
    <div>
        <mq-layout mq="desktop">
            <login-desktop />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <login-mobile :view-data="viewData" @event="onEvent($event)" />
        </mq-layout>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'
    import LoginDesktop from './desktop/index'
    import LoginMobile from './mobile/index'

    const viewData = {
        isLogin: false,
        modal: {
            forgotPassword: {
                display: false,
                loading: false,
                alert: {
                    display: false,
                    type: 'success',
                    message: ''
                }
            }
        },
        alert: {
            display: false,
            message: ''
        },
        event: {
            LOGIN: 'login',
            SEND_CODE: 'send_code',
            RECOVER_PASSWORD: 'recover_pwd'
        }
    }

    export default {
        name: 'Login',
        layout: 'authentication',
        components: { LoginMobile, LoginDesktop },
        data() {
            return {
                viewData,
                user: undefined,
                changeData: undefined
            }
        },
        methods: {
            /**
             * Método que se ejecuta cuando los componentes (mobile, tablet, desktop) de la vista hacen una acción.
             * @param $event evento emitido.
             */
            async onEvent($event) {
                switch ($event.type) {
                    case viewData.event.LOGIN: {
                        await this.loginAccount($event.body)
                        break
                    }

                    case viewData.event.SEND_CODE: {
                        await this.sendCode($event.body)
                        break
                    }

                    case viewData.event.RECOVER_PASSWORD: {
                        await this.recoverPassword($event.body)
                        break
                    }
                }
            },

            /**
             * Llama a servicio de aws-amplify para iniciar sesión.
             * @param values valores de los inputs (username, password).
             */
            async loginAccount(values) {
                viewData.isLogin = true

                await Auth.signIn(values.username, values.password)
                    .then(async (response) => {
                        this.user = response
                        viewData.alert.display = false

                        if (response.challengeName === 'NEW_PASSWORD_REQUIRED') {
                            if (this.$mq === 'desktop') {
                                this.changeData = {}
                                this.changeData = response.challengeParam.userAttributes
                                viewData.isLogin = false
                                viewData.modal.setPassword = true
                            } else {
                                viewData.alert.message = 'Debe configurar primero sus datos de sesión. Inicie sesión por primera vez desde el navegador y siga los pasos indicados.'
                                viewData.alert.display = true
                            }
                        } else
                            this.$router.push({ name: this.$store.state.navigation.defaultName })
                    })
                    .catch((error) => {
                        switch (error.code) {
                            case 'UserNotFoundException': {
                                viewData.alert.message = 'El usuario ingresado no existe.'
                                viewData.alert.display = true
                                break
                            }

                            case 'NotAuthorizedException': {
                                viewData.alert.message = 'La contraseña ingresada es incorrecta.'
                                viewData.alert.display = true
                                break
                            }
                        }

                        viewData.isLogin = false
                    })
            },

            /**
             * Llama a servicio de aws-amplify para obtener código al correo electrónico.
             * @param values valor del username.
             */
            async sendCode(values) {
                viewData.modal.forgotPassword.alert.display = false
                viewData.modal.forgotPassword.loading = true

                await Auth.forgotPassword(values.toLowerCase())
                    .then((data) => {
                        viewData.modal.forgotPassword.alert.message = 'El código de autorización fue enviado al correo: ' + data.CodeDeliveryDetails.Destination
                        viewData.modal.forgotPassword.alert.type = 'success'
                        viewData.modal.forgotPassword.alert.display = true
                    })
                    .catch((error) => {
                        if (error.code === 'UserNotFoundException')
                            viewData.modal.forgotPassword.alert.message = 'El usuario ingresado no existe.'
                        else
                            viewData.modal.forgotPassword.alert.message = 'Error desconocido. Contacte a soporte.'

                        viewData.modal.forgotPassword.alert.type = 'error'
                        viewData.modal.forgotPassword.alert.display = true
                    })
                    .finally(() => {
                        viewData.modal.forgotPassword.loading = false
                    })
            },

            /**
             * Llama a servicio de aws-amplify para restablecer la contraseña.
             * @param values campos username, code, password.
             */
            async recoverPassword(values) {
                viewData.modal.forgotPassword.alert.display = false
                viewData.modal.forgotPassword.loading = true

                await Auth.forgotPasswordSubmit(values.username.toLowerCase(), values.code, values.password)
                    .then(() => {
                        viewData.modal.forgotPassword.alert.message = 'La contraseña fue restablecida correctamente.'
                        viewData.modal.forgotPassword.alert.type = 'success'
                        viewData.modal.forgotPassword.alert.display = true
                    })
                    .catch((error) => {
                        if (error.code === 'CodeMismatchException')
                            viewData.modal.forgotPassword.alert.message = 'El código ingresado es incorrecto.'
                        else if (error.code === 'ExpiredCodeException')
                            viewData.modal.forgotPassword.alert.message = 'Código incorrecto o expirado. Solicite uno nuevo e inténte restablecer la contraseña nuevamente.'
                        else
                            viewData.modal.forgotPassword.alert.message = 'Error desconocido. Inténtelo nuevamente.'

                        viewData.modal.forgotPassword.alert.type = 'error'
                        viewData.modal.forgotPassword.alert.display = true
                    })
                    .finally(() => {
                        viewData.modal.forgotPassword.loading = false
                    })
            }
        }
    }
</script>

<style scoped>

</style>
