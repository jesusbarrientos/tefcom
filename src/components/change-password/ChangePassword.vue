<template>
    <div>
        <a-modal
            :visible="visible"
            wrap-class-name="change-password-component"
            title="Cambio de Contraseña Requerido"
            centered
            :closable="false"
            :mask-closable="false"
            ok-text="Confirmar"
            cancel-text="cancelar"
            :confirm-loading="loading"
            :cancel-button-props="cancelButtonProps"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-alert v-if="showAlert" type="error" message="Error desconocido. Inténtelo nuevamente." style="margin-bottom: 15px" />

            <a-form :form="formChange">
                <a-row :gutter="10">
                    <a-col :span="12">
                        <a-form-item :colon="false" :label="fields.name['label']" :extra="fields.name['extra']" :required="fields.name['required']">
                            <a-input v-decorator="fields.name['decorator']" :placeholder="fields.name['placeholder']" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :colon="false" :label="fields.lastName['label']" :extra="fields.lastName['extra']" :required="fields.lastName['required']">
                            <a-input v-decorator="fields.lastName['decorator']" :placeholder="fields.lastName['placeholder']" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row>
                    <a-col :span="24">
                        <a-form-item :colon="false" :label="fields.password['label']" :extra="fields.password['extra']" :required="fields.password['required']">
                            <a-input v-decorator="fields.password['decorator']" type="password" :placeholder="fields.password['placeholder']" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row>
                    <a-col :span="24">
                        <a-form-item :colon="false" :label="fields.passwordConfirm['label']" :extra="fields.passwordConfirm['extra']" :required="fields.passwordConfirm['required']">
                            <a-input v-decorator="fields.passwordConfirm['decorator']" type="password" :placeholder="fields.passwordConfirm['placeholder']" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    let formChange

    const fields = {
        name: {
            label: 'Nombre',
            extra: '',
            required: true,
            placeholder: 'Nombre',
            decorator: [
                'name',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese un nombre.' }
                    ]
                }
            ]
        },
        lastName: {
            label: 'Apellido',
            extra: '',
            required: true,
            placeholder: 'Apellido',
            decorator: [
                'lastName',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese un apellido.' }
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
        },
        passwordConfirm: {
            label: 'Confirmar Contraseña',
            extra: '',
            required: true,
            placeholder: 'Confirmar Contraseña',
            decorator: [
                'passwordConfirm',
                {
                    initialValue: undefined,
                    rules: [
                        { validator: passwordValidator, message: 'Las contraseñas deben coincidir.' }
                    ]
                }
            ]
        }
    }

    function passwordValidator(rule, value, callback) {
        return formChange.getFieldValue('password') === value
    }

    export default {
        name: 'ChangePassword',
        props: ['show', 'dataForm'],
        data() {
            return {
                fields,
                formChange,
                loading: false,
                cancelButtonProps: {
                    props: {
                        disabled: false
                    }
                },
                showAlert: false
            }
        },
        computed: {
            visible: function () {
                return this.show
            }
        },
        beforeCreate() {
            formChange = this.$form.createForm(this)
        },
        created() {
            this.formChange.setFieldsValue({
                name: this.dataForm['name'],
                lastName: this.dataForm['family_name']
            })
        },
        methods: {
            handleOk() {
                this.formChange.validateFields((erros, values) => {
                    if (!erros) {
                        this.showAlert = false
                        this.loading = true
                        this.cancelButtonProps.props.disabled = true

                        const params = {
                            body: values,
                            callback: (error) => {
                                if (error) {
                                    this.loading = false
                                    this.cancelButtonProps.props.disabled = false
                                    this.showAlert = true
                                }
                            }
                        }

                        this.$emit('accept', params)
                    }
                })
            },
            handleCancel() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
