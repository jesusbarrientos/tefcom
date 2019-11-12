<template>
    <div id="login-page-mobile">
        <div class="content">
            <!--LOGOTYPE-->
            <div class="logo-container">
                <logo-white class="logo" />
            </div>

            <!--FORM-->
            <div class="form">
                <a-alert v-if="viewData.alert.display" :message="viewData.alert.message" type="error" class="alert" />

                <a-form :form="form" @submit="loginSubmit($event)">
                    <a-form-item :required="fields.username.required">
                        <a-input v-decorator="fields.username.decorator" :placeholder="fields.username.placeholder" size="large">
                            <a-icon slot="prefix" type="user" class="input-icon" />
                        </a-input>
                    </a-form-item>

                    <a-form-item :required="fields.password.required">
                        <a-input v-decorator="fields.password.decorator" type="password" :placeholder="fields.password.placeholder" size="large">
                            <a-icon slot="prefix" type="lock" class="input-icon" />
                        </a-input>
                    </a-form-item>

                    <a-button type="primary" html-type="submit" class="button-submit" size="large">
                        Iniciar Sesión
                    </a-button>
                </a-form>

                <div class="item-forgot">
                    <a @click="showModalForgotPassword">Recuperar Contraseña</a>
                </div>
            </div>
        </div>

        <a-spin v-if="viewData.isLogin" class="spin" size="large" tip="Iniciando Sesión" :spinning="true" />

        <!--FORGOT-PASSWORD-MODAL-->
        <a-drawer
            title="Recuperar Contraseña"
            :centered="true"
            :closable="true"
            :mask-closable="true"
            :visible="viewData.modal.forgotPassword.display"
            placement="bottom"
            wrap-class-name="drawer-mobile-forgot-password"
            @close="closeModalForgotPassword"
        >
            <a-spin tip="Cargando" size="large" :spinning="viewData.modal.forgotPassword.loading">
                <div class="container">

                    <a-alert
                        v-if="viewData.modal.forgotPassword.alert.display"
                        :message="viewData.modal.forgotPassword.alert.message"
                        :type="viewData.modal.forgotPassword.alert.type"
                        style="margin-bottom: 20px"
                    />

                    <a-form :form="formForgot">

                        <a-row :gutter="10">
                            <a-col :span="24">
                                <a-form-item :colon="false" :label="fieldsFgt.username['label']" :extra="fieldsFgt.username['extra']" :required="fieldsFgt.username['required']">
                                    <a-input v-decorator="fieldsFgt.username['decorator']" :placeholder="fieldsFgt.username['placeholder']" size="large" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row :gutter="10">
                            <a-col :span="24">
                                <a-form-item :colon="false" :label="fieldsFgt.code['label']" :extra="fieldsFgt.code['extra']" :required="fieldsFgt.code['required']">
                                    <a-input v-decorator="fieldsFgt.code['decorator']" :placeholder="fieldsFgt.code['placeholder']" size="large" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row :gutter="10">
                            <a-col :span="24">
                                <a-form-item :colon="false" :label="fieldsFgt.password['label']" :extra="fieldsFgt.password['extra']" :required="fieldsFgt.password['required']">
                                    <a-input v-decorator="fieldsFgt.password['decorator']" type="password" :placeholder="fieldsFgt.password['placeholder']" size="large" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                    </a-form>
                </div>

                <div class="send-code">
                    <a @click="sendCode">Reenviar Código de Autorización</a>
                </div>

                <div class="buttons">
                    <a-button type="primary" size="large" block @click="changePassword">
                        Cambiar Contraseña
                    </a-button>

                    <a-button size="large" block @click="closeModalForgotPassword">
                        Cancelar
                    </a-button>
                </div>

            </a-spin>
        </a-drawer>
    </div>
</template>

<script>
    import LogoWhite from '../../../../components/logo/LogoWhite'

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
                        { required: true, message: 'Ingrese una contraseña.' },
                        { min: 8, message: 'Contraseña debe tener al menos 8 caracteres.' }
                    ]
                }
            ]
        }
    }

    const fieldsFgt = {
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
        code: {
            label: 'Código',
            extra: '',
            required: true,
            placeholder: 'Código',
            decorator: [
                'code',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese código.' }
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
                        { required: true, message: 'Ingrese una contraseña.' },
                        { min: 8, message: 'Contraseña debe tener al menos 8 caracteres.' }
                    ]
                }
            ]
        }
    }

    export default {
        name: 'LoginMobile',
        components: { LogoWhite },
        props: {
            viewData: {
                required: true
            }
        },
        data() {
            return {
                fields,
                fieldsFgt
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
            this.formForgot = this.$form.createForm(this)
        },
        methods: {
            loginSubmit($event) {
                $event.preventDefault()

                this.form.validateFields((errors, values) => {
                    if (!errors) {
                        this.$emit('event', {
                            type: this.viewData.event.LOGIN,
                            body: {
                                username: values.username.toLowerCase(),
                                password: values.password
                            }
                        })
                    }
                })
            },

            /**
             * Captura evento para destruir modal.
             */
            closeModalForgotPassword() {
                if (!this.viewData.modal.forgotPassword.loading)
                    this.viewData.modal.forgotPassword.display = false
            },

            /**
             * Muestra modal de recuperar contraseña.
             */
            showModalForgotPassword() {
                this.viewData.modal.forgotPassword.display = true
            },

            /**
             * Emite evento para re-enviar código de autorización.
             */
            sendCode() {
                this.formForgot.resetFields(['code', 'password'])

                this.formForgot.validateFields(['username'], (errors, fields) => {
                    if (!errors) {
                        const params = {
                            type: this.viewData.event.SEND_CODE,
                            body: fields.username
                        }

                        this.$emit('event', params)
                    }
                })
            },

            /**
             * Emite evento para cambiar contraseña.
             */
            changePassword() {
                this.formForgot.validateFields((errors, fields) => {
                    if (!errors) {
                        const params = {
                            type: this.viewData.event.RECOVER_PASSWORD,
                            body: fields
                        }

                        this.$emit('event', params)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
