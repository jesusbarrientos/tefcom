<template>
    <div id="budget-page-desktop">
        <a-row type="flex" justify="center">
            <a-col :span="20">
                <a-card title="Generar Cotización" :bordered="false">
                    <!--EXTRA-->
                    <div slot="extra">
                        <a-button size="small" type="primary">
                            Cargar
                        </a-button>
                        <a-button size="small" type="primary">
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
                            <label for="badget-duration">Duración Estimada</label>
                            <a-input-number id="badget-duration" v-model="budget.duration" :min="1" style="width: 100%" />
                        </a-col>

                        <a-col :span="5" :offset="4">
                            <label for="total">Total</label>
                            <a-input-number
                                id="total"
                                :value="calculateTotal()"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
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
                                        <a-col :span="19">
                                            <a-select
                                                v-model="e.id"
                                                show-search
                                                placeholder="Seleccione un empleado"
                                                option-filter-prop="children"
                                                :filter-option="filterOption"
                                                style="width: 100%"
                                            >
                                                <a-select-option v-for="employee of data.employees" :value="employee.id">
                                                    {{ employee.name }} {{ employee.lastName }}
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

                                <a-button type="primary" v-model="budget" @click="addEmployee()">
                                    Agregar Empleado
                                </a-button>
                            </a-row>
                        </a-collapse-panel>

                        <!--MATERIALS-->
                        <a-collapse-panel key="2" header="Materiales">
                            <a-row v-for="(e, index) of budget.materials" type="flex" justify="space-between">
                                <a-col :span="20">
                                    <a-row type="flex" :gutter="10">
                                        <a-col :span="19">
                                            <a-select
                                                v-model="e.id"
                                                show-search
                                                placeholder="Seleccione un empleado"
                                                option-filter-prop="children"
                                                :filter-option="filterOption"
                                                style="width: 100%"
                                            >
                                                <a-select-option v-for="material of data.materials" :value="material.id">
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

                                <a-button type="primary">
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
        employees: [
            { id: 1, name: 'Jesus', lastName: 'Barrientos', price: 5000 },
            { id: 2, name: 'Dani', lastName: 'Zubicueta', price: 2000 },
            { id: 3, name: 'Matias', lastName: 'Barrientos', price: 1300 }
        ],
        materials: [
            { id: 1, description: 'A', price: 1000 },
            { id: 2, description: 'B', price: 100 },
            { id: 3, description: 'C', price: 5 }
        ]
    }

    const budget = {
        number: 0,
        date: moment(new Date()),
        duration: 1,
        subtotal: {
            employees: 0,
            materials: 0,
            others: 0
        },
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
                return budget.subtotal.employees + budget.subtotal.materials + budget.subtotal.others
            },
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            addEmployee() {
                budget.employees.push({ id: data.employees[0].id, hours: 1 })
            },
            addMaterial() {
                budget.materials.push({ id: data.materials[0].id, count: 1 })
            },
            removeElement(index, list) {
                list.splice(index, 1)
            }
        }
    }
</script>

<style scoped>

</style>
