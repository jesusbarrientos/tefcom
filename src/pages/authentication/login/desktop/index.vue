<template>
    <div id="login-page-desktop">
        <a-row type="flex" justify="center" align="middle">
            <a-col>
                <!--LOGOTYPE-->
                <logo class="logo" />

                <!--CARD-->
                <a-spin :spinning="loading" tip="Iniciando Sesión">
                    <a-card class="card">
                        <!--ALERT-->
                        <a-alert v-if="showAlert" :message="alertMessage" :type="alertType" style="margin-bottom: 10px" />

                        <!--FORM-->
                        <a-form :form="form" class="form" @submit="loginSubmit($event)">
                            <a-form-item :required="fields.username.required">
                                <a-input v-decorator="fields.username.decorator" :placeholder="fields.username.placeholder">
                                    <a-icon slot="prefix" type="user" class="input-icon" />
                                </a-input>
                            </a-form-item>

                            <a-form-item :required="fields.password.required">
                                <a-input v-decorator="fields.password.decorator" type="password" :placeholder="fields.password.placeholder">
                                    <a-icon slot="prefix" type="lock" class="input-icon" />
                                </a-input>
                            </a-form-item>

                            <a-form-item style="margin-bottom: 0; text-align: center">
                                <a @click="showRecoverPassword">Olvidé la Contraseña</a>

                                <a-button type="primary" html-type="submit" class="button-submit">
                                    Iniciar Sesión
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-card>
                </a-spin>
            </a-col>
        </a-row>

        <change-password :data-form="changeData" :show="showChangePassModal" @accept="changePassword" @close="closeChangePassword" />

        <recover-password :show="showRecover" @cancel="recoverClose" />
    </div>
</template>

<script>
    import navigation from '@/static/navigation/navigation.json'
    import { Auth } from 'aws-amplify'
    import Logo from '../../../../components/logo/Logo'
    import ChangePassword from '../../../../components/change-password/ChangePassword'
    import RecoverPassword from '../../../../components/recover-password/RecoverPassword'

    const fields = {
        username: {
            label: 'Usuario',
            extra: '',
            required: true,
            placeholder: 'Usuario',
            decorator: [
                'username',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese un usuario.' }
                    ]
                }
            ]
        },
        password: {
            label: 'Contraseña',
            extra: '',
            required: true,
            placeholder: 'Contraseña',
            decorator: [
                'password',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese una contraseña.' }
                    ]
                }
            ]
        }
    }

    export default {
        name: 'LoginDesktop',
        components: { RecoverPassword, ChangePassword, Logo },
        data() {
            return {
                fields,
                showAlert: false,
                alertMessage: '',
                alertType: 'success',
                loading: false,
                showChangePassModal: false,
                changeData: {},
                user: undefined,
                showRecover: false
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        methods: {
            closeChangePassword() {
                this.showChangePassModal = false
            },
            async getUserData(email) {
                await this.$axios.$post(process.env.apiBaseUrl + '/user/get', {
                    email
                })
                    .then((response) => {
                        this.$store.commit('profile/setProfile', {
                            avatar: response.body.avatar,
                            name: response.body.name,
                            lastName: response.body.lastName,
                            email: response.body.email
                        })

                        this.$router.push({ name: navigation.defaultRoute })
                    })
                    .catch(() => {
                        this.alertMessage = 'Error al obtener datos del usuario.'
                        this.alertType = 'error'
                        this.showAlert = true
                    })
            },
            async loginSubmit($event) {
                $event.preventDefault()

                this.form.validateFields(async (errors, values) => {
                    if (!errors) {
                        this.loading = true

                        this.form.setFieldsValue({
                            username: this.form.getFieldValue('username').toLowerCase()
                        })

                        await Auth.signIn(this.form.getFieldValue('username'), values.password)
                            .then(async (response) => {
                                this.user = response
                                this.showAlert = false

                                if (response.challengeName === 'NEW_PASSWORD_REQUIRED') {
                                    this.changeData = {}
                                    this.changeData = response.challengeParam.userAttributes
                                    this.showChangePassModal = true
                                } else
                                    await this.getUserData(this.user.attributes.email)
                            })
                            .catch((error) => {
                                switch (error.code) {
                                    case 'UserNotFoundException': {
                                        this.alertMessage = 'El usuario no existe.'
                                        this.alertType = 'error'
                                        this.showAlert = true
                                        break
                                    }

                                    case 'NotAuthorizedException': {
                                        this.alertMessage = 'La contraseña ingresada es incorrecta.'
                                        this.alertType = 'error'
                                        this.showAlert = true
                                        break
                                    }
                                }
                            })
                            .finally(() => {
                                this.loading = false
                            })
                    }
                })
            },
            async changePassword(params) {
                const data = {
                    name: params.body.name ? params.body.name : '',
                    family_name: params.body.lastName ? params.body.lastName : ''
                }

                await Auth.completeNewPassword(
                    this.user,
                    params.body.password,
                    data
                )
                    .then(() => {
                        this.$router.push({ name: navigation.defaultRoute })
                    })
                    .catch(() => {
                        params.callback(true)
                    })
            },
            showRecoverPassword() {
                this.showRecover = true
            },
            recoverClose() {
                this.showRecover = false
            }
        }
    }
</script>

<style scoped>

</style>
