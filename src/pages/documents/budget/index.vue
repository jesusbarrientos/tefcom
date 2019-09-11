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
    import voca from 'voca'
    import BudgetDesktop from './desktop/index'
    import BudgetMobile from './mobile/index'

    const data = {
        company: {},
        employees: [],
        materials: [],
        comunas: []
    }
    let initialBudget = {
        number: 1,
        status: 'new' || 'saved',
        date: moment(new Date()),
        duration: 1,
        total: {},
        pdf: {
            subtotal: 0,
            discount: 0,
            neto: 0,
            iva: 0
        },
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
    let budget = {
        number: 1,
        status: 'new' || 'saved',
        date: moment(new Date()),
        duration: 1,
        total: {},
        pdf: {
            subtotal: 0,
            discount: 0,
            neto: 0,
            iva: 0
        },
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

    function numberWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    /**
     * Calcula el total neto del presupuesto aplicando descuento.
     * @returns {number}
     */
    budget.total.subtotal = (b) => {
        let total = 0
        b.jobs.forEach((j) => {
            total += j.total
        })

        b.pdf.subtotal = numberWithCommas(total.toFixed(2))
        b.pdf.discount = numberWithCommas((total * (b.client.discount / 100)).toFixed(2))
        b.pdf.neto = numberWithCommas((total * (1 - (b.client.discount / 100))).toFixed(2))
        b.pdf.iva = numberWithCommas(((total * (1 - (b.client.discount / 100))) * 0.19).toFixed(2))

        total = total * (1 - (b.client.discount / 100))

        b.pdf.total = numberWithCommas((total + ((total * 0.19))).toFixed(2))

        return parseFloat(total.toFixed(2))
    }
    initialBudget.total.subtotal = budget.total.subtotal

    /**
     * Calcula el IVA del total neto.
     * @returns {number}
     */
    budget.total.iva = (b) => {
        return b.total.subtotal(b) * 0.19
    }
    initialBudget.total.iva = budget.total.iva

    /**
     * Calcula la suma del IVA con el total neto.
     * @returns {number}
     */
    budget.total.total = (b) => {
        return b.total.subtotal(b) + b.total.iva(b)
    }
    initialBudget.total.total = budget.total.total

    export default {
        name: 'Budget',
        components: { BudgetMobile, BudgetDesktop },
        data() {
            return {
                moment,
                data,
                budget,
                initialBudget,
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
                    newBudget: this.newBudget,
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
                        /* this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se ha cargado la información de la compañía.',
                            duration: 2
                        }) */
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
                        /* this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los empleados.',
                            duration: 2
                        }) */
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
                        /* this.$notification.success({
                            message: 'Éxito!',
                            description: 'Se han cargado todos los materiales.',
                            duration: 2
                        }) */
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
            newBudget() {
                this.loadingStatus.number = false
                this.resetBudget()
                this.loadNewNumber()
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

                        this.resetBudget()

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
                        if (this.getParseBudget().client.company === '')
                            this.budget.client.company = undefined
                        break
                    }
                    case 'client-rut': {
                        if (this.getParseBudget().client.rut === '')
                            this.budget.client.rut = undefined
                        break
                    }
                    case 'client-phone': {
                        if (this.getParseBudget().client.phone === '')
                            this.budget.client.phone = undefined
                        break
                    }
                    case 'client-contact': {
                        if (this.getParseBudget().client.contact === '')
                            this.budget.client.contact = undefined
                        break
                    }
                    case 'client-comuna': {
                        if (this.getParseBudget().client.comuna === '')
                            this.budget.client.comuna = undefined
                        break
                    }
                    case 'client-address': {
                        if (this.getParseBudget().client.address === '')
                            this.budget.client.address = undefined
                        break
                    }
                    case 'client-email': {
                        if (this.getParseBudget().client.email === '')
                            this.budget.client.email = undefined
                        break
                    }
                    case 'client-paymentType': {
                        if (this.getParseBudget().client.paymentType === '')
                            this.budget.client.paymentType = undefined
                        break
                    }
                    case 'client-discount': {
                        if (!this.getParseBudget().client.discount)
                            this.budget.client.discount = 0
                        break
                    }
                }
            },
            resetBudget() {
                const clone = JSON.parse(JSON.stringify(this.initialBudget))
                clone.date = this.initialBudget.date
                clone.status = 'new'
                clone.total.subtotal = this.budget.total.subtotal
                clone.total.iva = this.budget.total.iva
                clone.total.total = this.budget.total.total

                this.budget = clone
            },
            getParseBudget() {
                this.budget.client.address = voca.upperCase(this.budget.client.address)
                this.budget.client.company = voca.upperCase(this.budget.client.company)
                this.budget.client.comuna = voca.upperCase(this.budget.client.comuna)
                this.budget.client.contact = voca.upperCase(this.budget.client.contact)
                this.budget.client.email = voca.upperCase(this.budget.client.email)
                this.budget.client.paymentType = voca.upperCase(this.budget.client.paymentType)

                return this.budget
            }
        }
    }
</script>

<style scoped>

</style>
