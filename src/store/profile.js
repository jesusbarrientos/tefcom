
export const state = () => ({
    avatar: '',
    name: '',
    lastName: '',
    email: ''
})

export const mutations = {
    setProfile(state, data) {
        Object.keys(data).forEach((k) => {
            state[k] = data[k]
        })
    },
    reset(state) {
        Object.keys(state).forEach((k) => {
            state[k] = ''
        })
    }
}

export const getters = {
    fullName(state) {
        return `${state.name} ${state.lastName}`
    }
}
