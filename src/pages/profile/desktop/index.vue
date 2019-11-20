<template>
    <div id="profile-page-desktop">
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                <a-card title="Mi Cuenta" :bordered="false" class="attendance-card">
                    <a-spin tip="Cargando..." :spinning="loadingSpin">

                        <!--IMAGE-->
                        <a-divider orientation="left">
                            Foto de Perfil
                        </a-divider>

                        <a-row type="flex" justify="center" :gutter="10" class="avatar-row">
                            <a-upload
                                name="avatar"
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                :before-upload="beforeUpload"
                                @change="handleChangeAvatar"
                            >
                                <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                                <div v-else>
                                    <a-icon :type="loading ? 'loading' : 'plus'" />
                                    <div class="ant-upload-text">
                                        Cargar Avatar
                                    </div>
                                </div>
                            </a-upload>
                        </a-row>

                        <a-row type="flex" justify="center" :gutter="10">
                            <a-button type="danger" @click="removeAvatar">
                                Eliminar Imagen de Perfil
                            </a-button>
                        </a-row>

                        <!--DATA-->
                        <a-divider orientation="left">
                            Datos Personales
                        </a-divider>

                        <a-form :form="formEdit" layout="vertical" @submit="editProfile">
                            <a-row type="flex" justify="center" :gutter="10">
                                <a-col :sm="{ span: 9 }" :xxl="{ span: 6 }">
                                    <a-form-item :label="fields.name.label" :extra="fields.name.extra" :required="fields.name.required">
                                        <a-input v-decorator="fields.name.decorator" :placeholder="fields.name.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :sm="{ span: 9 }" :xxl="{ span: 6 }">
                                    <a-form-item :label="fields.lastName.label" :extra="fields.lastName.extra" :required="fields.lastName.required">
                                        <a-input v-decorator="fields.lastName.decorator" :placeholder="fields.lastName.placeholder" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row type="flex" justify="center" :gutter="10">
                                <a-col :sm="{ span: 18 }" :xxl="{ span: 12 }">
                                    <a-form-item :label="fields.email.label" :extra="fields.email.extra" :required="fields.email.required">
                                        <a-input v-decorator="fields.email.decorator" :placeholder="fields.email.placeholder" disabled />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row type="flex" justify="end" :gutter="10">
                                <a-col>
                                    <a-button type="primary" html-type="submit">
                                        Guardar Cambios
                                    </a-button>
                                </a-col>

                                <a-col :sm="{ span: 3 }" :xxl="{ span: 6 }" />
                            </a-row>
                        </a-form>

                        <!--SESSION-->
                        <a-divider orientation="left">
                            Datos de Sesión
                        </a-divider>

                        <a-form :form="formPassword" layout="vertical" @submit="editPassword">
                            <a-row type="flex" justify="center" :gutter="10">
                                <a-col :sm="{ span: 6 }" :xxl="{ span: 4 }">
                                    <a-form-item :label="fields.oldPassword.label" :extra="fields.oldPassword.extra" :required="fields.oldPassword.required">
                                        <a-input v-decorator="fields.oldPassword.decorator" type="password" :placeholder="fields.oldPassword.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :sm="{ span: 6 }" :xxl="{ span: 4 }">
                                    <a-form-item :label="fields.password.label" :extra="fields.password.extra" :required="fields.password.required">
                                        <a-input v-decorator="fields.password.decorator" type="password" :placeholder="fields.password.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :sm="{ span: 6 }" :xxl="{ span: 4 }">
                                    <a-form-item :label="fields.passwordConfirm.label" :extra="fields.passwordConfirm.extra" :required="fields.passwordConfirm.required">
                                        <a-input v-decorator="fields.passwordConfirm.decorator" type="password" :placeholder="fields.passwordConfirm.placeholder" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row type="flex" justify="end" :gutter="10">
                                <a-col>
                                    <a-button type="primary" html-type="submit">
                                        Cambiar Contraseña
                                    </a-button>
                                </a-col>

                                <a-col :sm="{ span: 3 }" :xxl="{ span: 6 }" />
                            </a-row>
                        </a-form>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { Auth } from 'aws-amplify'

    let formPassword

    function getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

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
        name: 'ProfileDesktop',
        data() {
            return {
                fields,
                formPassword,
                loadingSpin: false,
                loading: false,
                imageUrl: ''
            }
        },
        computed: {
            ...mapState['profile'],
            name() {
                return this.profile.name
            },
            lastName() {
                return this.profile.lastName
            },
            email() {
                return this.profile.email
            }
        },
        beforeCreate() {
            this.formEdit = this.$form.createForm(this)
            formPassword = this.$form.createForm(this)
        },
        mounted() {
            this.imageUrl = this.$store.state.profile.avatar

            this.formEdit.setFieldsValue({
                name: this.$store.state.profile.name,
                lastName: this.$store.state.profile.lastName,
                email: this.$store.state.profile.email
            })
        },
        methods: {
            handleChangeAvatar(info) {
                if (info.file.status === 'uploading') {
                    this.imageUrl = ''
                    this.loading = true
                    return
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.imageUrl = imageUrl
                        this.loading = false
                    })
                }
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'

                if (!isJPG)
                    this.$message.error('Solo se permiten imágenes en formato JPG y PNG!')

                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isLt2M)
                    this.$message.error('La imágen debe ser inferior a 2MB!')

                return isJPG && isLt2M
            },
            removeAvatar() {
                this.imageUrl = ''
            },
            editProfile(event) {
                event.preventDefault()

                this.formEdit.validateFields((errors, fields) => {
                    if (!errors) {
                        this.loadingSpin = true

                        this.$axios.$post(process.env.apiBaseUrl + '/user/edit', {
                            ...fields,
                            avatar: this.imageUrl !== '' && this.imageUrl !== null ? this.imageUrl : undefined
                        })
                            .then((response) => {
                                if (response != null) {
                                    this.$store.commit('profile/setProfile', {
                                        avatar: this.imageUrl,
                                        ...fields
                                    })

                                    this.$notification.success({
                                        message: 'Actualización Correcta!',
                                        description: 'Los datos se han modificado correctamente.'
                                    })
                                } else {
                                    this.$notification.error({
                                        message: 'Error!',
                                        description: 'Ha ocurrido un error al editar sus datos. Si sigue teniendo este problema, contáctece con soporte.',
                                        duration: 8
                                    })
                                }
                            })
                            .catch((e) => {
                                this.$notification.error({
                                    message: 'Error!',
                                    description: 'Ha ocurrido un error al editar sus datos. Si sigue teniendo este problema, contáctece con soporte.',
                                    duration: 8
                                })
                            })
                            .finally(() => {
                                this.loadingSpin = false
                            })
                    }
                })
            },
            editPassword(event) {
                event.preventDefault()

                formPassword.validateFields((errors, fields) => {
                    if (!errors) {
                        this.loadingSpin = true

                        Auth.currentAuthenticatedUser()
                            .then((user) => {
                                return Auth.changePassword(user, fields.oldPassword, fields.password)
                            })
                            .then((data) => {
                                if (data !== 'SUCCESS') {
                                    if (data.code === 'NotAuthorizedException') {
                                        formPassword.setFieldsValue({
                                            oldPassword: undefined
                                        })

                                        this.$notification.error({
                                            message: 'Error!',
                                            description: 'La contraseña actual ingresada no es correcta.',
                                            duration: 8
                                        })
                                    } else {
                                        this.$notification.error({
                                            message: 'Error!',
                                            description: 'Error desconocido. Contacte a soporte.',
                                            duration: 8
                                        })
                                    }
                                } else {
                                    formPassword.setFieldsValue({
                                        oldPassword: undefined,
                                        password: undefined,
                                        passwordConfirm: undefined
                                    })

                                    this.$notification.success({
                                        message: 'Contraseña Actualizada!',
                                        description: 'La contraseña se ha modificado correctamente.'
                                    })
                                }
                            })
                            .catch((error) => {
                                if (error.code === 'LimitExceededException') {
                                    this.$notification.error({
                                        message: 'Error!',
                                        description: 'Por su seguridad intente cambiar su contraseña más tarde. Sobrepasó el número de intentos.',
                                        duration: 8
                                    })
                                } else {
                                    this.$notification.error({
                                        message: 'Error!',
                                        description: 'Error desconocido. Contacte a soporte.',
                                        duration: 8
                                    })
                                }
                            })
                            .finally(() => {
                                this.loadingSpin = false
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
