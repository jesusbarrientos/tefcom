
export const state = () => ({
    show: false,
    tip: 'Cargando'
})

export const mutations = {
    set(state, data) {
        state.show = data.show
        state.tip = data.tip
    },
    reset(state) {
        state.show = false
        state.tip = 'Cargando'
    }
}
