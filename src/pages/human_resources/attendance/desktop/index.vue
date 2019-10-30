<template>
    <div id="attendance-page-desktop">
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                <a-card title="Asistencia" :bordered="false" class="attendance-card">
                    <a-spin tip="Cargando..." :spinning="loading">
                        <div class="new-attendance">
                            <h3>Registrar</h3>

                            <a-form :form="form" layout="vertical" @submit="addAttendance">
                                <a-row :gutter="10">
                                    <a-col :span="8">
                                        <a-form-item :label="fields.date.label" :extra="fields.date.extra" :required="fields.date.required">
                                            <a-date-picker v-decorator="fields.date.decorator" show-time format="DD-MM-YYYY HH:mm:ss" :allow-clear="false" :placeholder="fields.date.placeholder" />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="8">
                                        <a-form-item :label="fields.employee.label" :extra="fields.employee.extra" :required="fields.employee.required">
                                            <a-select v-decorator="fields.employee.decorator" :placeholder="fields.employee.placeholder">
                                                <a-select-option v-for="option of body.employees" :value="option.rut">
                                                    {{ option.first_name }} {{ option.last_name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row style="margin-bottom: 10px">
                                    <label>* Campo obligatorio.</label>
                                </a-row>

                                <a-row>
                                    <a-button type="primary" html-type="submit" block>
                                        Registrar
                                    </a-button>
                                </a-row>
                            </a-form>
                        </div>

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
                                <span slot="action" slot-scope="record">
                                    <a @click="onEdit(record)">Editar</a>

                                    <a-divider type="vertical" />

                                    <a-popconfirm title="¿Estás seguro de querer eliminar esta asistencia?" @confirm="onDelete(record)">
                                        <a>Eliminar</a>
                                    </a-popconfirm>
                                </span>
                            </a-table>
                        </div>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import moment from 'moment'
    import AFormItem from 'ant-design-vue/es/form/FormItem'

    const fields = {
        date: {
            label: 'Fecha',
            extra: '',
            required: true,
            placeholder: 'Fecha',
            decorator: [
                'date',
                {
                    initialValue: moment(new Date()),
                    rules: [
                        { required: true, message: 'Se necesita una fecha.' }
                    ]
                }
            ]
        },
        employee: {
            label: 'Empleado',
            extra: '',
            required: true,
            placeholder: 'Empleado',
            decorator: [
                'employee',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Seleccione empleado.' }
                    ]
                }
            ]
        }
    }

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
            },
            {
                title: 'Acción',
                key: 'action',
                fixed: 'right',
                width: 200,
                align: 'center',
                scopedSlots: { customRender: 'action' }
            }
        ]
    }

    export default {
        name: 'AttendanceDesktop',
        components: { AFormItem },
        props: {
            body: {
                required: true,
                default: {}
            },
            event: {
                required: true
            },
            bodyData: {
                required: true
            },
            loading: {
                required: true
            }
        },
        data() {
            return {
                moment,
                fields,
                table,
                lastPage: 1
            }
        },
        computed: {
            dataSource: function () {
                let newDataSource = []

                this.body.attendances.forEach((e, k) => {
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
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        methods: {
            getBodyData() {
                return {
                    ...this.bodyData,
                    rut: this.form.getFieldValue('employee'),
                    date: this.form.getFieldValue('date').toISOString()
                }
            },
            addAttendance($event) {
                $event.preventDefault()

                this.form.validateFields((error) => {
                    if (!error) {
                        const param = {
                            type: this.event.REGISTER,
                            body: this.getBodyData(),
                            callback: (promise) => {
                                promise
                                    .then((response) => {
                                        if (response === true) {
                                            this.bodyData.use_as_exit = true
                                            this.bodyData.new_attendance = false
                                            this.addAttendance($event)
                                            this.bodyData.use_as_exit = false
                                            this.bodyData.new_attendance = true
                                        } else if (response === false) {
                                            this.bodyData.use_as_exit = false
                                            this.bodyData.new_attendance = false
                                            this.addAttendance($event)
                                            this.bodyData.use_as_exit = false
                                            this.bodyData.new_attendance = true
                                        }
                                    })
                            }
                        }

                        this.$emit('emit', param)
                    }
                })
            },
            onEdit(record) {
                this.$emit('emit', {
                    type: this.event.EDIT,
                    body: record
                })
            },
            onDelete(record) {
                this.$emit('emit', {
                    type: this.event.DELETE,
                    body: record
                })
            },
            getEmployee(rut) {
                let employee = this.body.employees.find((e) => {
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
            getFullDate(date, time) {
                return moment(date + ' ' + time)
            },
            getHoursCount(attendance) {
                if (attendance.exit_date)
                    return moment(attendance.exit_date).diff(moment(attendance.entry_date), 'hours')
                else
                    return 0
            },
            onPaginate(pagination, filters, sorter) {
                let size = pagination.current * this.table.pagination.pageSize

                if (pagination.current > this.lastPage && size >= this.body.attendances.length) {
                    this.$emit('emit', {
                        type: this.event.GET
                    })
                }

                this.lastPage = pagination.current
            }
        }
    }
</script>

<style scoped>

</style>
