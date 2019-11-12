
export const state = () => ({
    default: '',
    defaultName: 'index',
    login: 'authentication/login'
})

export const mutations = {
    setDefaultRoute(state, mq) {
        if (mq === 'desktop') {
            state.default = 'documents/budget'
            state.defaultName = 'documents-budget'
        } else {
            state.default = 'human_resources/attendance'
            state.defaultName = 'human_resources-attendance'
        }
    }
}
