
export const state = () => ({
    selected: 'Asistencia',
    title: 'Asistencia'
})

export const mutations = {
    setSelected(state, title) {
        state.selected = title
    },
    setTitle(state, title) {
        state.title = title
    },
    reset(state) {
        state.selected = 'Asistencia'
        state.title = 'Asistencia'
    }
}
