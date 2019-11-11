// LIBRERIAS
import { Auth, Hub } from 'aws-amplify'
import axios from 'axios'
const navigation = require('@/static/navigation/navigation')

async function authValidation({ store, route, redirect }) {
    // Verifica sesión
    await Auth.currentSession()
        .then(async () => {
            await Auth.currentUserInfo()
                .then(async (user) => {
                    await getUserData(user.attributes.email, store, redirect, route)
                })
        })
        .catch(() => {
            // Si no hay token y no se está consultando por el login mismo, redirecciona a login
            if (route.name !== 'authentication-login')
                redirect(window.location.origin + '/' + navigation.loginRoutePath)
        })
}

async function getUserData(email, store, redirect, route) {
    if (store.state.profile.email === '') {
        await axios.post(process.env.apiBaseUrl + '/user/get', {
            email
        })
            .then((response) => {
                store.commit('profile/setProfile', {
                    avatar: response.data.body.avatar,
                    name: response.data.body.name,
                    lastName: response.data.body.lastName,
                    email: response.data.body.email
                })

                // Si hay token y se está tratando de acceder al login, redirecciona al por defecto
                if (route.name === 'authentication-login')
                    redirect(window.location.origin + '/' + navigation.defaultRoutePath)
            })
    } else if (route.name === 'authentication-login') {
        // Si hay token y se está tratando de acceder al login, redirecciona al por defecto
        redirect(window.location.origin + '/' + navigation.defaultRoutePath)
    }
}

export default async ({ store, route, redirect }) => {
    // Escuchar evento cuando se inicia o se cierra sesion
    await Hub.listen('auth', async ({ payload: { event, data } }) => {
        switch (event) {
            case 'signIn':
                await authValidation({ store, route, redirect })
                break
            case 'signOut':
                redirect(window.location.origin + '/' + navigation.loginRoutePath)
                store.commit('profile/reset')
                break
        }
    })

    await authValidation({ store, route, redirect })
}
