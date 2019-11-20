<template>
    <div>
        <a-modal
            :mask-closable="false"
            :closable="false"
            :centered="true"
            cancel-text="Cancelar"
            ok-text="Cambiar Contraseña"
            :visible="visible"
            title="Recuperar Contraseña"
            wrap-class-name="recover-password-component"
            :width="450"
            :confirm-loading="confirmLoading"
            :cancel-button-props="cancelButtonProps"
            @cancel="onCancel"
            @ok="recoverPassword"
        >
            <a-spin tip="Cargando..." :spinning="loading">
                <a-alert v-if="showAlert" :message="message" :type="type" style="margin-bottom: 20px" />

                <a-form :form="formRecover">
                    <a-row :gutter="10">
                        <a-col :span="24">
                            <a-form-item :colon="false" :label="fields.username['label']" :extra="fields.username['extra']" :required="fields.username['required']">
                                <a-input v-decorator="fields.username['decorator']" :placeholder="fields.username['placeholder']" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="10">
                        <a-col :span="24">
                            <a-form-item :colon="false" :label="fields.code['label']" :extra="fields.code['extra']" :required="fields.code['required']">
                                <a-input v-decorator="fields.code['decorator']" :placeholder="fields.code['placeholder']" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="10">
                        <a-col :span="24">
                            <a-form-item :colon="false" :label="fields.password['label']" :extra="fields.password['extra']" :required="fields.password['required']">
                                <a-input v-decorator="fields.password['decorator']" type="password" :placeholder="fields.password['placeholder']" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <a-row :gutter="10">
                    <a-col :span="24" style="text-align: center; margin-top: 15px">
                        <a @click="sendCode">Enviar Código de Autorización</a>
                    </a-col>
                </a-row>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'

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
        name: 'RecoverPassword',
        props: ['show'],
        data() {
            return {
                fields,
                showAlert: false,
                message: '',
                type: 'success',
                loading: false,
                confirmLoading: false,
                cancelButtonProps: {
                    props: {
                        disabled: false
                    }
                }
            }
        },
        computed: {
            visible: function () {
                return this.show
            }
        },
        beforeCreate() {
            this.formRecover = this.$form.createForm(this)
        },
        methods: {
            onCancel() {
                this.$emit('cancel')
            },
            sendCode() {
                this.formRecover.validateFields(['username'], async (errors, values) => {
                    if (!errors) {
                        this.showAlert = false
                        this.loading = true
                        this.cancelButtonProps.props.disabled = true
                        this.confirmLoading = true

                        await Auth.forgotPassword(values.username)
                            .then((data) => {
                                this.message = 'El código de autorización fue enviado al correo: ' + data.CodeDeliveryDetails.Destination
                                this.type = 'success'
                                this.showAlert = true
                            })
                            .catch(() => {
                                this.message = 'Error desconocido.'
                                this.type = 'error'
                                this.showAlert = true
                            })
                            .finally(() => {
                                this.loading = false
                                this.cancelButtonProps.props.disabled = false
                                this.confirmLoading = false
                            })
                    }
                })
            },
            recoverPassword() {
                this.formRecover.validateFields(async (errors, values) => {
                    if (!errors) {
                        this.showAlert = false
                        this.loading = true
                        this.cancelButtonProps.props.disabled = true
                        this.confirmLoading = true

                        await Auth.forgotPasswordSubmit(values.username, values.code, values.password)
                            .then(() => {
                                this.message = 'Su contraseña fue restablecida correctamente.'
                                this.type = 'success'
                                this.showAlert = true
                            })
                            .catch((error) => {
                                if (error.code === 'CodeMismatchException')
                                    this.message = 'El código ingresado es incorrecto.'
                                else if (error.code === 'ExpiredCodeException')
                                    this.message = 'Código incorrecto o expirado. Solicite uno nuevo e inténte restablecer la contraseña nuevamente.'
                                else
                                    this.message = 'Error desconocido. Inténtelo nuevamente.'

                                this.type = 'error'
                                this.showAlert = true
                            })
                            .finally(() => {
                                this.cancelButtonProps.props.disabled = false
                                this.confirmLoading = false
                                this.loading = false
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
