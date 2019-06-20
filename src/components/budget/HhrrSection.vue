<template>
    <div>
        <a-row v-for="(e, index) of budget.employees" type="flex" justify="space-between">
            <a-col :span="20">
                <a-row type="flex" :gutter="10">

                    <!--EMPLOYEE LIST-->
                    <a-col :span="14">
                        <a-select
                            v-model="e.employee.rut"
                            show-search
                            placeholder="Seleccione un empleado"
                            option-filter-prop="children"
                            :filter-option="filterOption"
                            style="width: 100%"
                            @change="onSelectEmployee(e)"
                        >
                            <a-select-option v-for="employee of getEmployeeFilteredList(e.employee.rut)" :value="employee.rut">
                                {{ getEmployeeFullName(employee.rut) }}
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
                                :value="e.employee.price"
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

        <a-row type="flex" justify="space-between" align="bottom">
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

            <a-col :lg="{ span: 8 }" :xl="{ span: 5 }">
                <a-button v-model="budget" type="primary" block @click="addEmployee()">
                    Agregar Empleado
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: 'HhrrSection',
        props: {
            data: {
                required: true
            },
            budget: {
                required: true
            }
        },
        watch: {
            'budget.employees': function () {
                this.calculateTotalEmployees()
            }
        },
        methods: {
            /**
             * Agrega fila de empleado.
             */
            addEmployee() {
                const employee = this.getFirstEmployeeOfFilteredList()

                if (employee)
                    this.budget.employees.push({ employee: JSON.parse(JSON.stringify(employee)), hours: 1 })
            },
            /**
             * Al seleccionar un empleado, se configura su precio.
             * @param e empleado
             */
            onSelectEmployee(e) {
                e.employee = JSON.parse(JSON.stringify(this.getEmployee(e.employee.rut))) // Genera clon
            },
            /**
             * Obtiene empleado del data según el rut.
             * @param rut
             */
            getEmployee(rut) {
                const employee = this.data.find(e => e.rut === rut)
                return employee || {}
            },
            /**
             * Obtiene valor según el rut del empleado.
             * @param rut
             */
            getEmployeePrice(rut) {
                const employee = this.data.find(e => e.rut === rut)
                return employee ? employee.price : 0
            },
            /**
             * Busca si existe o no empleado en lista para exportar (budget).
             * @param rut
             */
            existEmployeeInBudgetList(rut) {
                const e = this.budget.employees.find(e => e.employee.rut === rut)
                return !!e
            },
            /**
             * Calcula el total de la mano de obra.
             * @returns {number} total
             */
            calculateTotalEmployees() {
                let total = 0
                this.budget.employees.forEach((e) => {
                    total += this.getEmployeePrice(e.employee.rut) * e.hours
                })
                this.budget.subtotal.employees = total
                return total
            },
            /**
             * Obtiene primer empleado de la lista filtrada.
             */
            getFirstEmployeeOfFilteredList() {
                let employee = null
                let flag = false

                while (!flag) {
                    this.data.every((e) => {
                        if (!this.existEmployeeInBudgetList(e.rut)) {
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
            /**
             * Obtiene nombre completo del empleado según el rut.
             * @param rut
             */
            getEmployeeFullName(rut) {
                const e = this.data.find(e => e.rut === rut)
                return `${e.first_name} ${e.last_name}`
            },
            /**
             * Filtra lista de empleados con los que no se han seleccionado aún en la lista del budget.
             * @param rut
             * @returns {T[]}
             */
            getEmployeeFilteredList(rut) {
                return this.data.filter((e) => {
                    if (e.rut !== rut)
                        return !this.existEmployeeInBudgetList(e.rut)
                    else
                        return true // Agrega al actual empleado seleccionado. Si se omite, produce error al no encontrarlo.
                })
            },
            /**
             * Quita un empleado de la lista para exportar (budget).
             */
            removeElement(index, list) {
                list.splice(index, 1)
            },
            /**
             * Sirve para mostrar sólo las coincidencias cuando se escribe en el select.
             */
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        }
    }
</script>

<style scoped>

</style>
