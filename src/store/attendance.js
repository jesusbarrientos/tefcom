
export const state = () => ({
    rut: undefined,
    employee: undefined,
    old_date: undefined,
    entry: undefined,
    exit: undefined
})

export const mutations = {
    setOldDate(state, data) {
        state.old_date = data
    },
    setEntry(state, data) {
        state.entry = data
    },
    setExit(state, data) {
        state.exit = data
    },
    setAttendance(state, data) {
        Object.keys(data).forEach((k) => {
            state[k] = data[k]
        })
    },
    reset(state) {
        state.rut = undefined
        state.employee = undefined
        state.old_date = undefined
        state.entry = undefined
        state.exit = undefined
    }
}
