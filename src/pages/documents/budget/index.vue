<template>
    <div>
        <mq-layout mq="desktop">
            <budget-desktop :data="data" :budget="budget" />
        </mq-layout>

        <mq-layout :mq="['mobile', 'tablet']">
            <budget-mobile />
        </mq-layout>
    </div>
</template>

<script>
    import moment from 'moment'
    import BudgetDesktop from './desktop/index'
    import BudgetMobile from './mobile/index'

    const data = {
        company: {},
        employees: [],
        materials: [],
        comunas: []
    }
    const budget = {
        number: 1,
        date: moment(new Date()),
        duration: 1,
        subtotal: {
            employees: 0,
            materials: 0,
            others: 0
        },
        total: 0,
        client: {
            company: '',
            rut: '',
            phone: '',
            contact: '',
            comuna: '',
            address: '',
            email: '',
            discount: 0,
            paymentType: ''
        },
        materials: [],
        employees: [],
        others: [],
        procedure: '',
        payment_condition: '',
        notes: []
    }

    export default {
        name: 'Budget',
        components: { BudgetMobile, BudgetDesktop },
        data() {
            return {
                moment,
                data,
                budget
            }
        },
        created() {
            this.loadData()
        },
        methods: {
            async loadData() {
                this.loadCompany()
                this.loadEmployees()
                this.loadMaterials()
                this.loadChileCities()
            },
            loadCompany() {
            },
            loadEmployees() {
                this.$axios.$get(process.env.apiBaseUrl + '/employee/getall')
                    .then((response) => {
                        this.data.employees = response.body
                        this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los empleados.'
                        })
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los empleados. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus = false
                    })
            },
            loadMaterials() {
                this.$axios.$get(process.env.apiBaseUrl + '/material/getall')
                    .then((response) => {
                        this.data.materials = response.body
                        this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los materiales.'
                        })
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los empleados. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus = false
                    })
            },
            loadChileCities() {
                this.$axios.$get(process.env.apiChileCitiesUrl)
                    .then((response) => {
                        this.data.comunas = response
                    })
            }
        }
    }
</script>

<style scoped>

</style>
