<template>
    <a-spin :spinning="loading" tip="Cargando...">

        <div id="document-attendance-page-desktop">
            <a-row type="flex" justify="center">
                <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                    <a-card title="Reporte de Asistencia" :bordered="false">
                        <!--EXTRA-->
                        <div slot="extra">
                            <no-ssr>
                                <a-button size="small" type="primary" @click="exportPDF()">
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
                                    <a-date-picker id="start-date" v-model="startDate" :allow-clear="false" />
                                </a-col>

                                <a-col :span="8">
                                    <label for="end-date">Fecha Fin</label>
                                    <a-date-picker id="end-date" v-model="endDate" :allow-clear="false" />
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
                            <a-row type="flex" justify="start" :gutter="50">
                                <a-col :span="3">
                                    <h3>Opciones</h3>
                                </a-col>

                                <a-col :span="5" style="padding-left: 0; padding-right: 0">
                                    <label for="normal-hours">Horas Normales</label>
                                    <a-input-number id="normal-hours" v-model="normalHours" :min="0" :precision="0" />
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
                                @change="onPaginate"
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
                key: 'normal_price'
            },
            {
                title: 'Precio Extra',
                dataIndex: 'extra_price',
                key: 'extra_price'
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
                endDate: moment().startOf('day'),
                employee: undefined,
                table,
                tableResume,
                lastPage: 1,
                normalHours: 8
            }
        },
        computed: {
            dataSource: function () {
                let newDataSource = []

                this.data.attendances.forEach((e, k) => {
                    newDataSource.push({
                        key: k,
                        rut: e.rut,
                        employee: this.getEmployee(e.rut),
                        entry_date: this.getDate(e.entry_date),
                        entry_hour: this.getTime(e.entry_date),
                        exit_date: this.getDate(e.exit_date),
                        exit_hour: this.getTime(e.exit_date),
                        hours_count: this.getHoursCount(e)
                    })
                })

                return newDataSource
            },
            dataSourceResume: function () {
                return []
            }
        },
        methods: {
            exportPDF() {

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
                    return moment(attendance.exit_date).diff(moment(attendance.entry_date), 'hours')
                else
                    return 0
            },
            applyOptions() {

            }
        }
    }
</script>

<style scoped>

</style>
