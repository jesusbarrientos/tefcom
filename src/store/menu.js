
export const state = () => ({
    defaultSelectedKeys: [],
    defaultOpenKeys: []
})

export const mutations = {
    setSelectedKeys(state, data) {
        state.defaultSelectedKeys = data
    },
    setOpenKeys(state, data) {
        state.defaultOpenKeys = data
    },
    reset(state) {
        state.defaultSelectedKeys = []
        state.defaultOpenKeys = []
    }
}
