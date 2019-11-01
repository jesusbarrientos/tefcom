<template>
    <div id="login-page-desktop">
        <a-row type="flex" justify="center" align="middle">
            <a-col>
                <!--LOGOTYPE-->
                <logo class="logo" />

                <!--CARD-->
                <a-card class="card">
                    <!--FORM-->
                    <a-form :form="form" class="form" @submit="loginSubmit($event)">
                        <a-form-item>
                            <a-input placeholder="Usuario">
                                <a-icon slot="prefix" type="user" class="input-icon" />
                            </a-input>
                        </a-form-item>

                        <a-form-item>
                            <a-input type="password" placeholder="Contraseña">
                                <a-icon slot="prefix" type="lock" class="input-icon" />
                            </a-input>
                        </a-form-item>

                        <a-form-item style="margin-bottom: 0">
                            <a-checkbox class="item-remember">
                                Recuérdame
                            </a-checkbox>

                            <a class="item-forgot">Olvidé la Contraseña</a>

                            <a-button type="primary" html-type="submit" class="button-submit">
                                Iniciar Sesión
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import navigation from '@/static/navigation/navigation.json'
    import Logo from '../../../../components/logo/Logo'

    export default {
        name: 'LoginDesktop',
        components: { Logo },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        methods: {
            loginSubmit($event) {
                // TODO: falta implementar función
                $event.preventDefault()
                this.$router.push({ name: navigation.defaultRoute })
            }
        }
    }
</script>

<style scoped>

</style>
