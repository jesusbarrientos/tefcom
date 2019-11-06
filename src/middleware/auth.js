// LIBRERIAS
import { Auth, Hub } from 'aws-amplify'
const navigation = require('@/static/navigation/navigation')

function authValidation({ store, route, redirect }) {
    // Verifica sesión
    Auth.currentSession()
        .then(() => {
            // Si hay token y se está tratando de acceder al login, redirecciona al por defecto
            if (route.name === 'authentication-login')
                redirect(window.location.origin + '/' + navigation.defaultRoutePath)

            Auth.currentUserInfo()
                .then((user) => {
                    store.commit('user/setUser', user.attributes)
                })
        })
        .catch(() => {
            // Si no hay token y no se está consultando por el login mismo, redirecciona a login
            if (route.name !== 'authentication-login')
                redirect(window.location.origin + '/' + navigation.loginRoutePath)
        })
}

export default ({ store, route, redirect }) => {
    // Escuchar evento cuando se inicia o se cierra sesion
    Hub.listen('auth', ({ payload: { event, data } }) => {
        switch (event) {
            case 'signIn':
                authValidation({ store, route, redirect })
                break
            case 'signOut':
                redirect(window.location.origin + '/' + navigation.loginRoutePath)
                store.commit('user/reset')
                break
        }
    })

    authValidation({ store, route, redirect })
}
