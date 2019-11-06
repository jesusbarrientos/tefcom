
export const state = () => ({
    name: undefined,
    family_name: undefined,
    email: undefined,
    email_verified: false
})

export const mutations = {
    setUser(state, data) {
        Object.keys(data).forEach((k) => {
            state[k] = data[k]
        })
    },
    reset(state) {
        state.name = undefined
        state.family_name = undefined
        state.email = undefined
        state.email_verified = false
    }
}

export const getters = {
    fullName(state) {
        return `${state.name} ${state.family_name}`
    }
}
