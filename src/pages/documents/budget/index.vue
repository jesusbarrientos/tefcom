<template>
    <div>
        <mq-layout mq="desktop">
            <budget-desktop :data="data" :budget="budget" :loading-status="loading" :methods="methods" @loadBudget="loadBudget" />
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
    let budget = {
        number: 1,
        status: 'new' || 'saved',
        date: moment(new Date()),
        duration: 1,
        total: {},
        client: {
            company: undefined,
            rut: undefined,
            phone: undefined,
            contact: undefined,
            comuna: undefined,
            address: undefined,
            email: undefined,
            discount: 0,
            paymentType: undefined
        },
        payment_condition: undefined,
        notes: undefined,
        jobs: []
    }

    /**
     * Calcula el total neto del presupuesto.
     * @returns {number}
     */
    budget.total.subtotal = (b) => {
        let total = 0
        b.jobs.forEach((j) => {
            total += j.total
        })
        total = total * (1 - (b.client.discount / 100))
        return parseFloat(total.toFixed(2))
    }

    /**
     * Calcula el IVA del total neto.
     * @returns {number}
     */
    budget.total.iva = (b) => {
        return b.total.subtotal(b) * 0.19
    }

    /**
     * Calcula la suma del IVA con el total neto.
     * @returns {number}
     */
    budget.total.total = (b) => {
        return b.total.subtotal(b) + b.total.iva(b)
    }

    export default {
        name: 'Budget',
        components: { BudgetMobile, BudgetDesktop },
        data() {
            return {
                moment,
                data,
                budget,
                loadingStatus: {
                    number: false,
                    company: false,
                    employees: false,
                    materials: false,
                    cities: false,
                    save: true,
                    load: true,
                    edit: true
                },
                methods: {
                    saveBudget: this.saveBudget,
                    loadBudget: this.loadBudget,
                    loadLastNumber: this.loadLastNumber,
                    setValue: this.setValue
                }
            }
        },
        computed: {
            loading: function () {
                let status = false
                for (let key of Object.keys(this.loadingStatus)) {
                    if (!this.loadingStatus[key]) {
                        status = true
                        break
                    }
                }

                return status
            }
        },
        created() {
            this.loadData()
            this.budget.status = 'new'
        },
        methods: {
            async loadData() {
                this.loadNewNumber()
                this.loadCompany()
                this.loadEmployees()
                this.loadMaterials()
                this.loadChileCities()
            },
            loadNewNumber() {
                this.$axios.$get(process.env.apiBaseUrl + '/budget/getnewid')
                    .then((response) => {
                        this.budget.number = response.body
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención del número de cotización. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.number = true
                    })
            },
            loadCompany() {
                this.$axios.$get(process.env.apiBaseUrl + '/company/get')
                    .then((response) => {
                        this.data.company = response.body[0]
                        this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se ha cargado la información de la compañía.',
                            duration: 2
                        })
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los datos de la empresa. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.company = true
                    })
            },
            loadEmployees() {
                this.$axios.$get(process.env.apiBaseUrl + '/employee/getall')
                    .then((response) => {
                        this.data.employees = response.body
                        this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los empleados.',
                            duration: 2
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
                        this.loadingStatus.employees = true
                    })
            },
            loadMaterials() {
                this.$axios.$get(process.env.apiBaseUrl + '/material/getall')
                    .then((response) => {
                        this.data.materials = response.body
                        this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los materiales.',
                            duration: 2
                        })
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los materiales. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.materials = true
                    })
            },
            loadChileCities() {
                this.$axios.$get(process.env.apiChileCitiesUrl)
                    .then((response) => {
                        this.data.comunas = response
                    })
                    .finally(() => {
                        this.loadingStatus.cities = true
                    })
            },
            saveBudget() {
                if (this.budget.status === 'new')
                    this.confirmSave()
                else
                    this.editBudget()
            },
            confirmSave() {
                this.loadingStatus.save = false

                this.budget.status = 'saved'

                const clone = JSON.parse(JSON.stringify(this.budget))
                delete clone.total

                const request = {
                    id: this.budget.number,
                    budget: clone
                }

                this.$axios.$put(process.env.apiBaseUrl + '/budget/new', request)
                    .then((response) => {
                        // Exito en el guardado
                        if (response.ok) {
                            this.$notification.success({
                                message: 'Guardado Exitoso!',
                                description: response.message
                            })
                        } else {
                            this.$notification.error({
                                message: 'Error!',
                                description: response.message,
                                duration: 8
                            })

                            this.budget.status = 'new'
                        }
                    })
                    .catch(() => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la petición, inténtelo nuevamente. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })

                        this.budget.status = 'new'
                    })
                    .finally(() => {
                        this.loadingStatus.save = true
                    })
            },
            editBudget() {
                this.loadingStatus.edit = false

                const clone = JSON.parse(JSON.stringify(this.budget))
                delete clone.total

                const request = {
                    id: this.budget.number,
                    budget: clone
                }

                this.$axios.$post(process.env.apiBaseUrl + '/budget/edit', request)
                    .then((response) => {
                        if (response.ok) {
                            this.$notification.success({
                                message: 'Exito en Modificación!',
                                description: response.message
                            })
                        } else {
                            this.$notification.error({
                                message: 'Error!',
                                description: response.message
                            })
                        }
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la obtención de los datos de la empresa. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.edit = true
                    })
            },
            loadBudget(request) {
                this.loadingStatus.load = false

                this.$axios.$post(process.env.apiBaseUrl + '/budget/get', request)
                    .then((response) => {
                        const responseClone = JSON.parse(JSON.stringify(response.body.budget))
                        responseClone.date = moment(new Date(response.body.budget.date))
                        responseClone.status = request.status

                        this.budget = {
                            ...this.budget,
                            ...responseClone
                        }

                        if (request.status === 'new')
                            this.loadNewNumber()
                    })
                    .catch((e) => {
                        this.$notification.error({
                            message: 'Error!',
                            description: 'Ha ocurrido un error en la carga de la cotización. Si sigue teniendo este problema, contáctece con soporte.',
                            duration: 8
                        })
                    })
                    .finally(() => {
                        this.loadingStatus.load = true
                    })
            },
            loadLastNumber() {
                this.loadingStatus.load = false

                return new Promise((resolve, reject) => {
                    this.$axios.$get(process.env.apiBaseUrl + '/budget/get-last-id')
                        .then((response) => {
                            resolve(response.body)
                        })
                        .catch((e) => {
                            reject(null)
                        })
                        .finally(() => {
                            this.loadingStatus.load = true
                        })
                })
            },
            setValue(attr) {
                switch (attr) {
                    case 'client-company': {
                        if (this.budget.client.company === '')
                            this.budget.client.company = undefined
                        break
                    }
                    case 'client-rut': {
                        if (this.budget.client.rut === '')
                            this.budget.client.rut = undefined
                        break
                    }
                    case 'client-phone': {
                        if (this.budget.client.phone === '')
                            this.budget.client.phone = undefined
                        break
                    }
                    case 'client-contact': {
                        if (this.budget.client.contact === '')
                            this.budget.client.contact = undefined
                        break
                    }
                    case 'client-comuna': {
                        if (this.budget.client.comuna === '')
                            this.budget.client.comuna = undefined
                        break
                    }
                    case 'client-address': {
                        if (this.budget.client.address === '')
                            this.budget.client.address = undefined
                        break
                    }
                    case 'client-email': {
                        if (this.budget.client.email === '')
                            this.budget.client.email = undefined
                        break
                    }
                    case 'client-paymentType': {
                        if (this.budget.client.paymentType === '')
                            this.budget.client.paymentType = undefined
                        break
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
