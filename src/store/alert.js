
export const state = () => ({
    message: '',
    description: '',
    duration: '',
    type: ''
})

export const mutations = {
    setState(state, data) {
        Object.keys(state).forEach((k) => {
            state[k] = data[k]
        })
    },
    reset(state) {
        Object.keys(state).forEach((k) => {
            state[k] = ''
        })
    }
}
