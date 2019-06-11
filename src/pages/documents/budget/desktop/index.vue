<template>
    <div id="budget-page-desktop">
        <a-back-top />

        <a-row type="flex" justify="center">
            <a-col :span="20">
                <a-card title="Generar Cotización" :bordered="false">
                    <!--EXTRA-->
                    <div slot="extra">
                        <a-button size="small" type="primary">
                            Cargar
                        </a-button>
                        <a-button size="small" type="primary" @click="exportToJsonFile">
                            Guardar
                        </a-button>
                        <a-button size="small" type="primary">
                            Imprimir
                        </a-button>
                    </div>

                    <!--GLOBAL DATA-->
                    <a-divider orientation="left">
                        Datos Globales
                    </a-divider>

                    <a-row :gutter="10">
                        <a-col :span="5">
                            <label for="badget-number">Número de Cotización</label>
                            <a-input-number id="badget-number" v-model="budget.number" :min="1" style="width: 100%" />
                        </a-col>

                        <a-col :span="5">
                            <label for="badget-date">Fecha de Solicitud</label>
                            <a-date-picker id="badget-date" v-model="budget.date" format="DD-MM-YYYY" placeholder="" />
                        </a-col>

                        <a-col :span="5">
                            <a-tooltip>
                                <template slot="title">
                                    Duración en días
                                </template>
                                <label for="badget-duration">Duración Estimada</label>
                                <a-input-number id="badget-duration" v-model="budget.duration" :min="1" style="width: 100%" />
                            </a-tooltip>
                        </a-col>

                        <a-col :span="5" :offset="4">
                            <label for="total">Total</label>
                            <a-input-number
                                id="total"
                                :value="calculateTotal()"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                :precision="2"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-col>
                    </a-row>

                    <!--CLIENT-->
                    <a-divider orientation="left">
                        Cliente
                    </a-divider>

                    <a-row :gutter="10">
                        <a-col :span="8">
                            <label for="badget-company">Nombre Empresa</label>
                            <a-input id="badget-company" v-model="budget.client.company" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-rut">Rut</label>
                            <a-input id="badget-rut" v-model="budget.client.rut" />
                        </a-col>

                        <a-col :span="8">
                            <label for="badget-contact">Contacto</label>
                            <a-input id="badget-contact" v-model="budget.client.contact" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-phone">Teléfono</label>
                            <a-input id="badget-phone" v-model="budget.client.phone" />
                        </a-col>
                    </a-row>

                    <a-row :gutter="10">
                        <a-col :span="6">
                            <label for="badget-email">Correo Electrónico</label>
                            <a-input id="badget-email" v-model="budget.client.email" />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-city">Ciudad</label>
                            <a-input id="badget-city" v-model="budget.client.city" />
                        </a-col>

                        <a-col :span="7">
                            <label for="badget-address">Dirección</label>
                            <a-input id="badget-address" v-model="budget.client.address" />
                        </a-col>

                        <a-col :span="3">
                            <label for="badget-discount">Descuento</label>
                            <a-input-number
                                id="badget-discount"
                                v-model="budget.client.discount"
                                :min="0"
                                :max="100"
                                :formatter="value => `${value}%`"
                                :parser="value => value.replace('%', '')"
                                style="width: 100%"
                            />
                        </a-col>

                        <a-col :span="4">
                            <label for="badget-payment">Tipo de Pago</label>
                            <a-input id="badget-payment" v-model="budget.client.paymentType" />
                        </a-col>
                    </a-row>

                    <!--DETAIL-->
                    <a-divider orientation="left">
                        Detalle
                    </a-divider>

                    <a-collapse>
                        <!--EMPLOYEES-->
                        <a-collapse-panel key="1" header="Mano de Obra">

                            <a-row v-for="(e, index) of budget.employees" type="flex" justify="space-between">
                                <a-col :span="20">
                                    <a-row type="flex" :gutter="10">
                                        <a-col :span="14">
                                            <a-select
                                                v-model="e.id"
                                                show-search
                                                placeholder="Seleccione un empleado"
                                                option-filter-prop="children"
                                                :filter-option="filterOption"
                                                style="width: 100%"
                                                @change="selectEmployee(e)"
                                            >
                                                <a-select-option v-for="employee of getEmployeeFilteredList(e.id)" :value="employee.id">
                                                    {{ getEmployeeFullName(employee.id) }}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>

                                        <a-col :span="5">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Horas Estimadas
                                                </template>
                                                <a-input-number v-model="e.hours" :min="1" style="width: 100%" />
                                            </a-tooltip>
                                        </a-col>

                                        <a-col :span="5">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Precio en el momento. Sirve para llevar registro del valor en el momento en que se hizo la cotización.
                                                </template>
                                                <a-input-number
                                                    :value="e.price"
                                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                    style="width: 100%; color: black"
                                                    disabled
                                                />
                                            </a-tooltip>
                                        </a-col>
                                    </a-row>
                                </a-col>

                                <a-button type="danger" @click="removeElement(index, budget.employees)">
                                    Eliminar
                                </a-button>
                            </a-row>

                            <a-row type="flex" justify="space-between" align="middle">
                                <a-col :span="5">
                                    <label for="total-employee">Subtotal</label>
                                    <a-input-number
                                        id="total-employee"
                                        :value="calculateTotalEmployees()"
                                        :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        style="width: 100%; color: black"
                                        disabled
                                    />
                                </a-col>

                                <a-button v-model="budget" type="primary" @click="addEmployee()">
                                    Agregar Empleado
                                </a-button>
                            </a-row>
                        </a-collapse-panel>

                        <!--MATERIALS-->
                        <a-collapse-panel key="2" header="Materiales">
                            <a-row v-for="(e, index) of budget.materials" type="flex" justify="space-between">
                                <a-col :span="20">
                                    <a-row type="flex" :gutter="10">
                                        <a-col :span="14">
                                            <a-select
                                                v-model="e.id"
                                                show-search
                                                placeholder="Seleccione un empleado"
                                                option-filter-prop="children"
                                                :filter-option="filterOption"
                                                style="width: 100%"
                                                @change="selectMaterial(e)"
                                            >
                                                <a-select-option v-for="material of getMaterialFilteredList(e.id)" :value="material.id">
                                                    {{ material.description }}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>

                                        <a-col :span="5">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Cantidad
                                                </template>
                                                <a-input-number v-model="e.count" :min="1" style="width: 100%" />
                                            </a-tooltip>
                                        </a-col>

                                        <a-col :span="5">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Precio en el momento. Sirve para llevar registro del valor en el momento en que se hizo la cotización.
                                                </template>
                                                <a-input-number
                                                    :value="e.price"
                                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                    style="width: 100%; color: black"
                                                    disabled
                                                />
                                            </a-tooltip>
                                        </a-col>
                                    </a-row>
                                </a-col>

                                <a-button type="danger" @click="removeElement(index, budget.materials)">
                                    Eliminar
                                </a-button>
                            </a-row>

                            <a-row type="flex" justify="space-between" align="middle">
                                <a-col :span="5">
                                    <label for="total-material">Subtotal</label>
                                    <a-input-number
                                        id="total-material"
                                        :value="calculateTotalMaterials()"
                                        :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        style="width: 100%; color: black"
                                        disabled
                                    />
                                </a-col>

                                <a-button type="primary" @click="addMaterial()">
                                    Agregar Material
                                </a-button>
                            </a-row>
                        </a-collapse-panel>

                        <!--OTHERS-->
                        <a-collapse-panel key="3" header="Otros">
                            <a-row v-for="(e, index) of budget.others" type="flex" justify="space-between">
                                <a-col :span="20">
                                    <a-row type="flex" align="middle" :gutter="10">
                                        <a-col :span="13">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Descripción
                                                </template>
                                                <a-input v-model="e.description" placeholder="Descripción" />
                                            </a-tooltip>
                                        </a-col>

                                        <a-col :span="4">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Precio
                                                </template>
                                                <a-input-number
                                                    v-model="e.price"
                                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                    style="width: 100%"
                                                />
                                            </a-tooltip>
                                        </a-col>

                                        <a-col :span="4">
                                            <a-tooltip>
                                                <template slot="title">
                                                    Cantidad
                                                </template>
                                                <a-input-number v-model="e.count" :min="1" style="width: 100%" />
                                            </a-tooltip>
                                        </a-col>

                                        <a-col :span="3">
                                            <a-tooltip>
                                                <template slot="title">
                                                    El precio incluye IVA
                                                </template>
                                                <a-checkbox @change="onChangeIva($event, e)">
                                                    IVA
                                                </a-checkbox>
                                            </a-tooltip>
                                        </a-col>
                                    </a-row>
                                </a-col>

                                <a-button type="danger" @click="removeElement(index, budget.others)">
                                    Eliminar
                                </a-button>
                            </a-row>

                            <a-row type="flex" justify="space-between" align="middle">
                                <a-col :span="5">
                                    <label for="total-other">Subtotal</label>
                                    <a-input-number
                                        id="total-other"
                                        :value="calculateTotalOthers()"
                                        :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        style="width: 100%; color: black"
                                        disabled
                                    />
                                </a-col>

                                <a-button type="primary" @click="addOther()">
                                    Agregar Concepto
                                </a-button>
                            </a-row>
                        </a-collapse-panel>
                    </a-collapse>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import moment from 'moment'

    const data = {
        employees: [{
            'id': 1,
            'name': 'Darryl',
            'lastName': 'Pires',
            'price': 4809
        }, {
            'id': 2,
            'name': 'Wileen',
            'lastName': 'Labbe',
            'price': 3712
        }, {
            'id': 3,
            'name': 'Shayla',
            'lastName': 'Smitham',
            'price': 6187
        }, {
            'id': 4,
            'name': 'Emma',
            'lastName': 'Valente',
            'price': 3406
        }, {
            'id': 5,
            'name': 'Malena',
            'lastName': 'Olivet',
            'price': 2697
        }, {
            'id': 6,
            'name': 'Sybilla',
            'lastName': "D'Agostino",
            'price': 2741
        }, {
            'id': 7,
            'name': 'Susy',
            'lastName': 'Tinniswood',
            'price': 2554
        }, {
            'id': 8,
            'name': 'Cherrita',
            'lastName': 'Raye',
            'price': 4802
        }],
        materials: [{
            'id': 1,
            'description': 'Oilfield Services/Equipment',
            'price': 8127
        }, {
            'id': 2,
            'description': 'Savings Institutions',
            'price': 9318
        }, {
            'id': 3,
            'description': 'Oil & Gas Production',
            'price': 2268
        }, {
            'id': 4,
            'description': 'Oilfield Services/Equipment',
            'price': 2236
        }, {
            'id': 5,
            'description': 'Agricultural Chemicals',
            'price': 4627
        }, {
            'id': 10,
            'description': 'Medical Specialities',
            'price': 3902
        }, {
            'id': 11,
            'description': 'Major Banks',
            'price': 1186
        }, {
            'id': 12,
            'description': 'Investment Bankers/Brokers/Service',
            'price': 3596
        }, {
            'id': 13,
            'description': 'Business Services',
            'price': 8871
        }, {
            'id': 15,
            'description': 'Computer Communications Equipment',
            'price': 6824
        }, {
            'id': 16,
            'description': 'Integrated oil Companies',
            'price': 9426
        }, {
            'id': 17,
            'description': 'Oil & Gas Production',
            'price': 8043
        }, {
            'id': 18,
            'description': 'Specialty Chemicals',
            'price': 5102
        }, {
            'id': 19,
            'description': 'Major Banks',
            'price': 2349
        }, {
            'id': 20,
            'description': 'Telecommunications Equipment',
            'price': 6576
        }]
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
            city: '',
            address: '',
            email: '',
            discount: 0,
            paymentType: ''
        },
        materials: [],
        employees: [],
        others: []
    }

    export default {
        name: 'BudgetDesktop',
        data() {
            return {
                moment,
                data,
                budget
            }
        },
        watch: {
            'budget.employees': function () {
                this.calculateTotalEmployees()
            },
            'budget.materials': function () {
                this.calculateTotalMaterials()
            }
        },
        methods: {
            calculateTotalEmployees() {
                let total = 0
                budget.employees.forEach((e) => {
                    total += this.getEmployeePrice(e.id) * e.hours
                })
                budget.subtotal.employees = total
                return total
            },
            getEmployeePrice(id) {
                const employee = this.data.employees.find(e => e.id === id)
                return employee ? employee.price : 0
            },
            getEmployeeFullName(id) {
                const e = data.employees.find(e => e.id === id)
                return `${e.name} ${e.lastName}`
            },
            calculateTotalMaterials() {
                let total = 0
                budget.materials.forEach((m) => {
                    total += this.getMaterialPrice(m.id) * m.count
                })
                budget.subtotal.materials = total
                return total
            },
            getMaterialPrice(id) {
                const material = this.data.materials.find(m => m.id === id)
                return material ? material.price : 0
            },
            calculateTotalOthers() {
                let total = 0
                budget.others.forEach((o) => {
                    if (o.includeIva)
                        total += o.price * o.count
                    else
                        total += (o.price * 1.19) * o.count
                })
                budget.subtotal.others = total
                return total
            },
            calculateTotal() {
                const subtotal = budget.subtotal.employees + budget.subtotal.materials + budget.subtotal.others
                const total = subtotal * (1 - budget.client.discount / 100)
                budget.total = total
                return total
            },
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            getFirstEmployeeOFFilteredList() {
                let employee = null
                let flag = false

                while (!flag) {
                    data.employees.every((e) => {
                        if (!this.existEmployeeInList(e.id)) {
                            employee = e
                            flag = true
                            return false
                        } else
                            return true
                    })

                    flag = true
                }

                return employee
            },
            getFirstElementOfFilteredList(list, budgetList) {
                let element = null
                let flag = false

                while (!flag) {
                    list.every((e) => {
                        if (!this.existElementInList(e.id, budgetList)) {
                            element = e
                            flag = true
                            return false
                        } else
                            return true
                    })

                    flag = true
                }

                return element
            },
            existElementInList(id, budgetList) {
                const e = budgetList.find(e => e.id === id)
                return !!e
            },
            addEmployee() {
                const employee = this.getFirstEmployeeOFFilteredList()

                if (employee)
                    budget.employees.push({ id: employee.id, price: employee.price, hours: 1 })
            },
            addMaterial() {
                const material = this.getFirstElementOfFilteredList(data.materials, budget.materials)

                if (material)
                    budget.materials.push({ id: material.id, price: material.price, count: 1 })
            },
            addOther() {
                budget.others.push({ description: '', price: 0, count: 1, includeIva: false })
            },
            removeElement(index, list) {
                list.splice(index, 1)
            },
            onChangeIva($event, other) {
                other.includeIva = $event.target.checked
            },
            selectEmployee(e) {
                e.price = this.getEmployeePrice(e.id)
            },
            selectMaterial(e) {
                e.price = this.getMaterialPrice(e.id)
            },
            existEmployeeInList(id) {
                const e = budget.employees.find(e => e.id === id)
                return !!e
            },
            getEmployeeFilteredList(id) {
                return data.employees.filter((e) => {
                    if (e.id !== id)
                        return !this.existEmployeeInList(e.id)
                    else
                        return true
                })
            },
            getMaterialFilteredList(id) {
                return data.materials.filter((e) => {
                    if (e.id !== id)
                        return !this.existElementInList(e.id, budget.materials)
                    else
                        return true
                })
            },
            exportToJsonFile() {
                const dataStr = JSON.stringify(budget)
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

                const now = new Date()
                const date = new Date(budget.date)
                const day = date.getDate()
                const month = date.getMonth() + 1
                const year = date.getFullYear()
                const hour = now.getHours()
                const min = now.getMinutes()

                const exportFileDefaultName = `cot_${day}${month}${year}_${hour}${min}.json`

                const linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
                linkElement.remove()
            }
        }
    }
</script>

<style scoped>

</style>
