<template>
    <div id="profile-page-mobile">
        <a-collapse default-active-key="1">
            <a-collapse-panel key="1" header="Datos Personales y Fotografía">

                <!--AVATAR-->
                <a-row type="flex" justify="center" :gutter="10" class="avatar-row">
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        :before-upload="beforeUploadAvatar"
                        @change="handleChangeAvatar"
                    >
                        <img v-if="viewData.imageUrl" :src="viewData.imageUrl" alt="avatar">
                        <div v-else>
                            <a-icon :type="viewData.uploadingImage ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                                Cargar Avatar
                            </div>
                        </div>
                    </a-upload>
                </a-row>

                <a-row type="flex" justify="center" :gutter="10">
                    <a-button class="delete-btn" type="danger" size="large" block @click="removeAvatar">
                        Eliminar Imagen
                    </a-button>
                </a-row>

                <!--DATA-->
                <a-form :form="form" layout="vertical" @submit="editProfile">
                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.name.label" :extra="fields.name.extra" :required="fields.name.required">
                            <a-input v-decorator="fields.name.decorator" :placeholder="fields.name.placeholder" size="large" />
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.lastName.label" :extra="fields.lastName.extra" :required="fields.lastName.required">
                            <a-input v-decorator="fields.lastName.decorator" :placeholder="fields.lastName.placeholder" size="large" />
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.email.label" :extra="fields.email.extra" :required="fields.email.required">
                            <a-input v-decorator="fields.email.decorator" :placeholder="fields.email.placeholder" disabled size="large" />
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="end" :gutter="10">
                        <a-button class="save-btn" type="primary" html-type="submit" size="large" block>
                            Guardar Cambios
                        </a-button>
                    </a-row>

                    <a-row type="flex" justify="end" :gutter="10">
                        <a-button class="save-btn" type="danger" size="large" block @click="logOut()">
                            Cerrar Sesión
                        </a-button>
                    </a-row>
                </a-form>
            </a-collapse-panel>

            <a-collapse-panel key="2" header="Datos de Sesión">
                <a-form :form="formPassword" layout="vertical" @submit="editPassword">
                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.oldPassword.label" :extra="fields.oldPassword.extra" :required="fields.oldPassword.required">
                            <a-input v-decorator="fields.oldPassword.decorator" type="password" :placeholder="fields.oldPassword.placeholder" size="large" />
                        </a-form-item>

                        <a-form-item :label="fields.password.label" :extra="fields.password.extra" :required="fields.password.required">
                            <a-input v-decorator="fields.password.decorator" type="password" :placeholder="fields.password.placeholder" size="large" />
                        </a-form-item>

                        <a-form-item :label="fields.passwordConfirm.label" :extra="fields.passwordConfirm.extra" :required="fields.passwordConfirm.required">
                            <a-input v-decorator="fields.passwordConfirm.decorator" type="password" :placeholder="fields.passwordConfirm.placeholder" size="large" />
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="end" :gutter="10">
                        <a-button class="save-btn" type="primary" html-type="submit" block size="large">
                            Cambiar Contraseña
                        </a-button>
                    </a-row>
                </a-form>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'

    let formPassword

    function passwordValidator(rule, value, callback) {
        return formPassword.getFieldValue('password') === value
    }

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
                        { required: true, message: 'Ingrese su nombre.' }
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
                        { required: true, message: 'Ingrese su apellido.' }
                    ]
                }
            ]
        },
        email: {
            label: 'Correo Electrónico',
            extra: '',
            required: true,
            placeholder: 'Correo Electrónico',
            decorator: [
                'email',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese un correo electrónico.' }
                    ]
                }
            ]
        },
        oldPassword: {
            label: 'Contraseña Actual',
            extra: '',
            required: true,
            placeholder: 'Contraseña Actual',
            decorator: [
                'oldPassword',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese una contraseña.' },
                        { min: 8, message: 'Contraseña debe tener al menos 8 caracteres.' }
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
                        { required: true, message: 'Ingrese una contraseña.' },
                        { validator: passwordValidator, message: 'Las contraseñas deben coincidir.' }
                    ]
                }
            ]
        }
    }

    export default {
        name: 'ProfileMobile',
        props: {
            viewData: {
                required: true
            }
        },
        data() {
            return {
                fields,
                formPassword
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
            formPassword = this.$form.createForm(this)
        },
        mounted() {
            this.form.setFieldsValue({
                name: this.$store.state.profile.name,
                lastName: this.$store.state.profile.lastName,
                email: this.$store.state.profile.email
            })
        },
        methods: {
            /**
             * Emite evento para editar perfil.
             */
            editProfile(event) {
                event.preventDefault()

                this.form.validateFields((errors, fields) => {
                    if (!errors) {
                        this.$emit('event', {
                            type: this.viewData.event.EDIT_PROFILE,
                            body: fields
                        })
                    }
                })
            },

            /**
             * Elimina imagen de perfil.
             */
            removeAvatar() {
                this.$emit('event', {
                    type: this.viewData.event.REMOVE_AVATAR
                })
            },

            /**
             * Hace validaciones previas a cargar la imagen.
             * @param file
             * @returns {boolean}
             */
            beforeUploadAvatar(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'

                if (!isJPG)
                    this.$message.error('Solo se permiten imágenes en formato JPG y PNG.')

                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isLt2M)
                    this.$message.error('La imágen debe ser inferior a 2MB.')

                return isJPG && isLt2M
            },

            /**
             * Emite evento para cargar imagen.
             * @param file
             */
            handleChangeAvatar(file) {
                this.$emit('event', {
                    type: this.viewData.event.UPLOAD_AVATAR,
                    body: file
                })
            },

            /**
             * Emite evento para editar contraseña.
             * @param event
             */
            editPassword(event) {
                event.preventDefault()

                formPassword.validateFields((errors, fields) => {
                    if (!errors) {
                        let self = this

                        this.$emit('event', {
                            type: this.viewData.event.EDIT_PASSWORD,
                            body: fields,
                            callback: (promise) => {
                                promise
                                    .then((data) => {
                                        formPassword.setFieldsValue({
                                            oldPassword: undefined,
                                            password: undefined,
                                            passwordConfirm: undefined
                                        })

                                        self.$message.success(data.description, data.duration)
                                    })
                                    .catch((error) => {
                                        if (error.code === 'NotAuthorizedException') {
                                            formPassword.setFieldsValue({
                                                oldPassword: undefined
                                            })
                                        }

                                        self.$message.error(error.description, error.duration)
                                    })
                            }
                        })
                    }
                })
            },

            /**
             * Cierra la sesión actual.
             */
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
