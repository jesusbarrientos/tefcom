<template>
    <a-spin :spinning="loading" tip="Cargando...">

        <div id="document-attendance-page-desktop">
            <a-row type="flex" justify="center">
                <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                    <a-card title="Reporte de Asistencia" :bordered="false">
                        <!--EXTRA-->
                        <div slot="extra">
                            <no-ssr>
                                <a-button size="small" type="primary" @click="generatePDF">
                                    Generar PDF
                                </a-button>
                            </no-ssr>
                        </div>

                        <!--FILTER-->
                        <div class="filter">
                            <h3>Filtro de Asistencias</h3>

                            <a-row :gutter="10">
                                <a-col :span="8">
                                    <label for="start-date">Fecha Inicio</label>
                                    <a-date-picker id="start-date" v-model="startDate" :allow-clear="false" @change="onChange" />
                                </a-col>

                                <a-col :span="8">
                                    <label for="end-date">Fecha Fin</label>
                                    <a-date-picker id="end-date" v-model="endDate" :allow-clear="false" @change="onChange" />
                                </a-col>

                                <a-col :span="8">
                                    <a-tooltip>
                                        <template slot="title">
                                            <span>Puede dejar este campo sin seleccionar para filtrar con todos los empleados.</span>
                                        </template>

                                        <label for="employee">Empleado</label>
                                        <a-select id="employee" v-model="employee" placeholder="Seleccione un empleado" :allow-clear="true" style="width: 100%">
                                            <a-select-option v-for="e in data.employees" :key="e.rut">
                                                {{ e.first_name }} {{ e.last_name }}
                                            </a-select-option>
                                        </a-select>
                                    </a-tooltip>
                                </a-col>
                            </a-row>

                            <a-row type="flex" justify="end" :gutter="10" style="margin-top: 20px">
                                <a-col :span="6">
                                    <a-button type="primary" block @click="filterAttendances">
                                        Filtrar
                                    </a-button>
                                </a-col>
                            </a-row>
                        </div>

                        <!--OPTIONS-->
                        <div class="options">
                            <a-row>
                                <a-col>
                                    <h3>Opciones</h3>
                                </a-col>
                            </a-row>

                            <a-row type="flex" justify="start" :gutter="10" style="margin-bottom: 10px">
                                <a-col :span="4">
                                    <label for="normal-hours">Hora Entrada</label>
                                    <a-time-picker id="normal-hours" v-model="normalHours" />
                                </a-col>

                                <a-col :span="4">
                                    <label for="normal-hours-end">Hora Salida</label>
                                    <a-time-picker id="normal-hours-end" v-model="normalHoursEnd" />
                                </a-col>

                                <a-col :span="4">
                                    <label for="total-hours">Horas Normales</label>
                                    <a-input-number id="total-hours" v-model="totalHours" disabled style="color: rgba(0, 0, 0, 0.65);" />
                                </a-col>
                            </a-row>

                            <a-row>
                                <a-col>
                                    <label for="sw-weekend">Considerar fines de semana como valor hora hombre extra</label>
                                    <a-switch id="sw-weekend" v-model="swWeekend" default-checked />
                                </a-col>
                            </a-row>
                        </div>

                        <!--TABLE RESUME-->
                        <div style="margin-bottom: 20px">
                            <a-table
                                :columns="tableResume.columns"
                                :data-source="dataSourceResume"
                                :bordered="tableResume.bordered"
                                :loading="tableResume.loading"
                                :scroll="tableResume.scroll"
                                :pagination="tableResume.pagination"
                                row-key="key"
                                position="bottom"
                            >
                                <template slot="title">
                                    <h3>Resumen de Asistencias</h3>
                                </template>

                                <label slot="price" slot-scope="text">${{ text }}</label>

                                <label slot="extra_price" slot-scope="text">${{ text }}</label>

                                <label slot="total" slot-scope="text">${{ text }}</label>
                            </a-table>
                        </div>

                        <!--TABLE-->
                        <div>
                            <a-table
                                :columns="table.columns"
                                :data-source="dataSource"
                                :bordered="table.bordered"
                                :loading="table.loading"
                                :scroll="table.scroll"
                                :pagination="table.pagination"
                                row-key="key"
                                position="bottom"
                            >
                                <template slot="title">
                                    <h3>Asistencias</h3>
                                </template>
                            </a-table>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>

    </a-spin>
</template>

<script>
    import moment from 'moment'
    import { exportAttendancesPDF } from './../../../../utils/pdfExportAttendances'

    const table = {
        bordered: true,
        loading: false,
        scroll: { x: '100%' },
        pagination: { pageSize: 5 },
        columns: [
            {
                title: 'Empleado',
                dataIndex: 'employee',
                key: 'employee',
                sorter: (a, b) => `${a['employee']}`.localeCompare(`${b['employee']}`)
            },
            {
                title: 'Entrada',
                children: [
                    {
                        title: 'Fecha',
                        dataIndex: 'entry_date',
                        key: 'entry_date',
                        sorter: (a, b) => {
                            let xDate = a.entry_date.split('-')
                            let yDate = b.entry_date.split('-')
                            let x = new Date(xDate[2], xDate[1] - 1, xDate[0])
                            let y = new Date(yDate[2], yDate[1] - 1, yDate[0])
                            return x - y
                        }
                    },
                    {
                        title: 'Hora',
                        dataIndex: 'entry_hour',
                        key: 'entry_hour',
                        sorter: (a, b) => {
                            let xTime = a.entry_hour.split(':')
                            let yTime = b.entry_hour.split(':')
                            let x = new Date(1990, 0, 1, xTime[0], xTime[1], xTime[2])
                            let y = new Date(1990, 0, 1, yTime[0], yTime[1], yTime[2])
                            return x.getTime() - y.getTime()
                        }
                    }
                ]
            },
            {
                title: 'Salida',
                children: [
                    {
                        title: 'Fecha',
                        dataIndex: 'exit_date',
                        key: 'exit_date',
                        sorter: (a, b) => {
                            let xDate = a.exit_date.split('-')
                            let yDate = b.exit_date.split('-')
                            let x = new Date(xDate[2], xDate[1] - 1, xDate[0])
                            let y = new Date(yDate[2], yDate[1] - 1, yDate[0])
                            return x - y
                        }
                    },
                    {
                        title: 'Hora',
                        dataIndex: 'exit_hour',
                        key: 'exit_hour',
                        sorter: (a, b) => {
                            let xTime = a.exit_hour.split(':')
                            let yTime = b.exit_hour.split(':')
                            let x = new Date(1990, 0, 1, xTime[0], xTime[1], xTime[2])
                            let y = new Date(1990, 0, 1, yTime[0], yTime[1], yTime[2])
                            return x.getTime() - y.getTime()
                        }
                    }
                ]
            },
            {
                title: 'Horas Totales',
                dataIndex: 'hours_count',
                key: 'hours_count',
                width: 100,
                align: 'center',
                sorter: (a, b) => a.hours_count - b.hours_count
            }
        ]
    }

    const tableResume = {
        bordered: true,
        loading: false,
        scroll: { x: '100%' },
        pagination: { pageSize: 5 },
        columns: [
            {
                title: 'Empleado',
                dataIndex: 'employee',
                key: 'employee',
                sorter: (a, b) => `${a['employee']}`.localeCompare(`${b['employee']}`)
            },
            {
                title: 'Precio Normal',
                dataIndex: 'normal_price',
                key: 'normal_price',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.normal_price - b.normal_price
            },
            {
                title: 'Precio Extra',
                dataIndex: 'extra_price',
                key: 'extra_price',
                scopedSlots: { customRender: 'extra_price' },
                sorter: (a, b) => a.extra_price - b.extra_price
            },
            {
                title: 'Horas',
                children: [
                    {
                        title: 'Normales',
                        dataIndex: 'normal_hour',
                        key: 'normal_hour',
                        sorter: (a, b) => a.normal_hour - b.normal_hour
                    },
                    {
                        title: 'Extras',
                        dataIndex: 'extra_hour',
                        key: 'extra_hour',
                        sorter: (a, b) => a.extra_hour - b.extra_hour
                    }
                ]
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => a.extra_price - b.extra_price
            }
        ]
    }

    export default {
        name: 'DocumentAttendanceDesktop',
        props: {
            loading: {
                required: true
            },
            data: {
                required: true
            },
            event: {
                required: true
            },
            dataRequest: {
                required: true
            }
        },
        data() {
            return {
                startDate: moment().startOf('month'),
                endDate: moment().endOf('day'),
                employee: undefined,
                table,
                tableResume,
                lastPage: 1,
                normalHours: moment('09:00:00', 'HH:mm:ss'),
                normalHoursEnd: moment('18:00:00', 'HH:mm:ss'),
                swWeekend: true,
                dataSourceForPDF: [],
                dataSourceResumeForPDF: [],
                moment
            }
        },
        computed: {
            totalHours: function () {
                return this.normalHoursEnd.diff(this.normalHours, 'hours')
            },
            dataSource: function () {
                let newDataSource = []

                this.data.attendances.forEach((e, k) => {
                    newDataSource.push({
                        key: k,
                        rut: e.rut,
                        employee: this.getEmployee(e.rut),
                        entry: this.getFullDate(e.entry_date),
                        entry_date: this.getDate(e.entry_date),
                        entry_hour: this.getTime(e.entry_date),
                        exit: this.getFullDate(e.exit_date),
                        exit_date: this.getDate(e.exit_date),
                        exit_hour: this.getTime(e.exit_date),
                        hours_count: this.getHoursCount(e)
                    })
                })

                return newDataSource
            },
            dataSourceResume: function () {
                let self = this
                let employeeObject = {}
                let newDataSource = []
                let totalHours = 0
                self.dataSourceForPDF = []

                this.dataSource.forEach((e) => {
                    let employee = this.getEmployeeData(e.rut)
                    totalHours = 0

                    if (!employeeObject[e.rut]) {
                        employeeObject[e.rut] = {
                            key: e.key,
                            employee: e.employee,
                            normal_price: employee.price,
                            extra_price: employee.price_extra,
                            normal_hour: 0,
                            extra_hour: 0
                        }
                    }

                    let normalHours = 0
                    let extraHours = 0

                    let entryInsideRange
                    let exitInsideRange

                    let entryHour = moment(e.entry, 'DD-MM-YYYY HH:mm:ss')
                    let exitHour = moment(e.exit, 'DD-MM-YYYY HH:mm:ss')
                    totalHours = self.roundHours(entryHour, exitHour)

                    const parsedNormalHours = moment(this.normalHours.toISOString())
                    const parsedNormalHoursEnd = moment(this.normalHoursEnd.toISOString())

                    parsedNormalHours.set({ year: entryHour.get('year'), month: entryHour.get('month'), date: entryHour.get('date') })
                    parsedNormalHoursEnd.set({ year: entryHour.get('year'), month: entryHour.get('month'), date: entryHour.get('date') })

                    // Calcula las horas
                    function calculateHours(self) {
                        let normalHours = 0
                        let extraHours = 0

                        // Posibles casos donde la entrada esta dentro del rango
                        if (entryInsideRange) {
                            if (exitInsideRange) {
                                // Quiere decir que la jornada de trabajo fue dentro del rango y no paso de las 24hrs.
                                if (totalHours <= self.totalHours) {
                                    normalHours = totalHours
                                    extraHours = 0
                                } else {
                                    normalHours = self.roundHours(entryHour, parsedNormalHoursEnd)
                                    extraHours = totalHours - normalHours
                                }
                            } else {
                                normalHours = self.roundHours(entryHour, parsedNormalHoursEnd)
                                extraHours = totalHours - normalHours
                            }
                        } else if (entryHour < parsedNormalHours) { // Posibles casos donde la entrada esta fuera del rango. Verifica si la hora de entrada esta antes o despues de la entrada del rango.
                            if (exitInsideRange) {
                                normalHours = self.roundHours(parsedNormalHours, exitHour)
                                extraHours = self.roundHours(entryHour, parsedNormalHours)
                            } else {
                                normalHours = self.totalHours
                                extraHours = self.roundHours(entryHour, parsedNormalHours) + self.roundHours(parsedNormalHoursEnd, exitHour)
                            }
                        } else {
                            extraHours = totalHours
                            normalHours = 0
                        }

                        return {
                            normalHours,
                            extraHours
                        }
                    }

                    if (e.exit_date) {
                        // Verifico si está dentro o fuera del rango la hora de entrada
                        if (parsedNormalHours <= entryHour && entryHour <= (parsedNormalHoursEnd - 1))
                            entryInsideRange = true
                        else
                            entryInsideRange = false

                        // Verifico si está dentro o fuera del rango la hora de salida
                        if ((parsedNormalHours + 1) <= exitHour && exitHour <= parsedNormalHoursEnd)
                            exitInsideRange = true
                        else
                            exitInsideRange = false

                        if (this.swWeekend) {
                            // Esta fuera de la semana
                            let day = moment(e.entry, 'DD-MM-YYYY HH:mm:ss').day()
                            if (day === 0 || day === 6) {
                                normalHours = 0
                                extraHours = totalHours
                            } else {
                                let hours = calculateHours(self)
                                normalHours = hours.normalHours
                                extraHours = hours.extraHours
                            }
                        } else {
                            let hours = calculateHours(self)
                            normalHours = hours.normalHours
                            extraHours = hours.extraHours
                        }

                        employeeObject[e.rut] = {
                            ...employeeObject[e.rut],
                            normal_hour: employeeObject[e.rut]['normal_hour'] + normalHours,
                            extra_hour: employeeObject[e.rut]['extra_hour'] + extraHours
                        }
                    }

                    self.dataSourceForPDF.push({
                        key: e.key,
                        employee: e.employee,
                        normal_price: employee.price,
                        extra_price: employee.price_extra,
                        normal_hour: normalHours,
                        extra_hour: extraHours,
                        entry: e.entry,
                        exit: e.exit,
                        hours_count: totalHours
                    })
                })

                Object.keys(employeeObject).forEach((key) => {
                    newDataSource.push({
                        ...employeeObject[key],
                        total: (employeeObject[key]['normal_hour'] * employeeObject[key]['normal_price']) + (employeeObject[key]['extra_hour'] * employeeObject[key]['extra_price'])
                    })
                })

                self.dataSourceResumeForPDF = newDataSource
                return newDataSource
            }
        },
        created() {
            this.onChange()
        },
        methods: {
            generatePDF() {
                if (this.dataSourceForPDF.length > 0)
                    exportAttendancesPDF(this.data.resume, this.dataSourceForPDF, this.dataSourceResumeForPDF)
                else {
                    this.$notification.warn({
                        message: 'Alerta!',
                        description: 'No se han cargado registros de asistencia.'
                    })
                }
            },
            onChange() {
                this.data.resume.start = this.startDate
                this.data.resume.end = this.endDate
            },
            filterAttendances() {
                this.dataRequest['start'] = this.startDate
                this.dataRequest['end'] = this.endDate

                if (this.employee != null)
                    this.dataRequest['employee'] = this.employee
                else
                    delete this.dataRequest['employee']

                this.$emit('emit', {
                    type: this.event.FILTER
                })
            },
            onPaginate(pagination, filters, sorter) {
                let size = pagination.current * this.table.pagination.pageSize

                if (pagination.current > this.lastPage && size >= this.data.attendances.length) {
                    this.$emit('emit', {
                        type: this.event.GET
                    })
                }

                this.lastPage = pagination.current
            },
            getEmployeeData(rut) {
                return this.data.employees.find((e) => {
                    return e.rut === rut
                })
            },
            getEmployee(rut) {
                let employee = this.data.employees.find((e) => {
                    return e.rut === rut
                })

                if (employee)
                    return employee.first_name + ' ' + employee.last_name
                else
                    return ''
            },
            getDate(date) {
                if (date != null)
                    return moment(date).format('DD-MM-YYYY')
                else
                    return ''
            },
            getTime(time) {
                if (time != null)
                    return moment(time).format('HH:mm:ss')
                else
                    return ''
            },
            getHoursCount(attendance) {
                if (attendance.exit_date)
                    return this.roundHours(moment(attendance.entry_date), moment(attendance.exit_date))
                else
                    return 0
            },
            getFullDate(date) {
                return date ? moment(date).format('DD-MM-YYYY HH:mm:ss') : 'Sin Fecha'
            },
            roundHours(time, timeEnd) {
                let hours = timeEnd.diff(time, 'hours')
                let minutes = timeEnd.diff(time, 'minutes')
                let extraMinutes = minutes - hours * 60

                return extraMinutes > 44 ? hours + 1 : hours
            }
        }
    }
</script>

<style scoped>

</style>
