<template>
    <div id="login-page-mobile">
        <div class="content">
            <!--LOGOTYPE-->
            <div class="logo-container">
                <logo-white class="logo" />
            </div>

            <!--FORM-->
            <div class="form">
                <a-form :form="form" @submit="loginSubmit($event)">
                    <a-form-item>
                        <a-input placeholder="Usuario" size="large">
                            <a-icon slot="prefix" type="user" class="input-icon" />
                        </a-input>
                    </a-form-item>

                    <a-form-item>
                        <a-input type="password" placeholder="Contraseña" size="large">
                            <a-icon slot="prefix" type="lock" class="input-icon" />
                        </a-input>
                    </a-form-item>

                    <a-button type="primary" html-type="submit" class="button-submit" size="large">
                        Iniciar Sesión
                    </a-button>
                </a-form>

                <div class="item-forgot">
                    <a>Recuperar Contraseña</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LogoWhite from '../../../../components/logo/LogoWhite'

    export default {
        name: 'LoginMobile',
        components: { LogoWhite },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        methods: {
            loginSubmit($event) {
                // TODO: falta implementar función
                $event.preventDefault()
                console.log('Login!')
                this.$store.commit('navbar/reset')
                this.$router.push({ name: 'dashboard' })
            }
        }
    }
</script>

<style scoped>

</style>
