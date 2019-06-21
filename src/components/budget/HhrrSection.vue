<template>
    <div class="job-content">
        <a-row v-for="(e, index) of job.employees" type="flex" justify="space-between" align="bottom">
            <a-col :span="20">
                <a-row type="flex" :gutter="10" align="bottom">

                    <!--EMPLOYEE LIST-->
                    <a-col :span="6">
                        <label for="employee">Empleado</label>
                        <a-select
                            id="employee"
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

                    <a-col :span="6">
                        <label for="hours">Horas Est. Diarias</label>
                        <a-input-group id="hours" compact>
                            <a-tooltip>
                                <template slot="title">
                                    Horas Estimadas Diarias en jornada de trabajo normal.
                                </template>
                                <a-input-number v-model="e.hours.normal" :min="0" :precision="1" style="width: 50%" />
                            </a-tooltip>

                            <a-tooltip>
                                <template slot="title">
                                    Horas Estimadas Diarias Extras de la jornada normal (fin de semana, más de las horas normales del día, feriados).
                                </template>
                                <a-input-number v-model="e.hours.extra" :min="0" :precision="1" style="width: 50%" />
                            </a-tooltip>
                        </a-input-group>
                    </a-col>

                    <a-col :span="6">
                        <label for="price">Precio</label>
                        <a-input-group id="price" compact>
                            <a-tooltip>
                                <template slot="title">
                                    Precio en jornada laboral normal.
                                </template>
                                <a-input-number
                                    :value="e.employee.price"
                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                    style="width: 50%; color: black"
                                    disabled
                                />
                            </a-tooltip>

                            <a-tooltip>
                                <template slot="title">
                                    Precio en jornada post-laboral (extra).
                                </template>
                                <a-input-number
                                    :value="e.employee.price_extra"
                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                    style="width: 50%; color: black"
                                    disabled
                                />
                            </a-tooltip>
                        </a-input-group>
                    </a-col>

                    <a-col :span="3">
                        <a-tooltip>
                            <template slot="title">
                                Factor de complejidad del trabajo. Este factor es relativo a las
                                tareas que ejecutará dicho empleado, ya que este podría hacer una tarea
                                con mayor, menor o de igual dificultad que otro. Este factor se multiplica al valor
                                total (suma entre los productos de horas con valores respectivos).
                            </template>
                            <label for="factor">Esfuerzo</label>
                            <a-input-number
                                id="factor"
                                v-model="e.factor"
                                :min="0"
                                :precision="2"
                                :step="0.01"
                                style="width: 100%"
                            />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="3">
                        <label for="emp-total">Total</label>
                        <a-input-number
                            id="emp-total"
                            :value="calculateTotalOfEmployee(e)"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="2"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>
                </a-row>
            </a-col>

            <a-col :span="4">
                <a-row type="flex" justify="end">
                    <a-button type="danger" @click="removeElement(index, job.employees)">
                        Eliminar
                    </a-button>
                </a-row>
            </a-col>

            <a-divider />
        </a-row>

        <a-row type="flex" justify="end" class="bottom-bar-button">
            <a-button type="primary" @click="addEmployee()">
                Agregar Empleado
            </a-button>
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
            job: {
                required: true
            }
        },
        methods: {
            /**
             * Agrega fila de empleado.
             */
            addEmployee() {
                const employee = this.getFirstEmployeeOfFilteredList()

                if (employee) {
                    this.job.employees.push({
                        employee: JSON.parse(JSON.stringify(employee)),
                        hours: {
                            normal: 0,
                            extra: 0
                        },
                        factor: 1,
                        total: 0
                    })
                }
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
             * Busca si existe o no empleado en lista para exportar (job).
             * @param rut
             */
            existEmployeeInBudgetList(rut) {
                const e = this.job.employees.find(e => e.employee.rut === rut)
                return !!e
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
             * Filtra lista de empleados con los que no se han seleccionado aún en la lista del job.
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
             * Calcula el total del empleado actual.
             */
            calculateTotalOfEmployee(e) {
                const total = ((e.employee.price * e.hours.normal) + (e.employee.price_extra * e.hours.extra)) * e.factor
                e.total = parseFloat(total.toFixed(2))
                return e.total
            },
            /**
             * Quita un empleado de la lista para exportar (job).
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
