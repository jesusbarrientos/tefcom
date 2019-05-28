
export const state = () => ({
    selected: 'Dashboard',
    title: 'Dashboard'
})

export const mutations = {
    setSelected(state, title) {
        state.selected = title
    },
    setTitle(state, title) {
        state.title = title
    },
    reset(state) {
        state.selected = 'Dashboard'
        state.title = 'Dashboard'
    }
}
