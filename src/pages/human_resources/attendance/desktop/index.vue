<template>
    <div id="attendance-page-desktop">
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                <a-card title="Asistencia" :bordered="false" class="attendance-card">
                    <a-spin :tip="spinTip" :spinning="spinning">
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
                                                <a-select-option v-for="option of viewData.data.employees" :value="option.rut">
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
                                    <a @click="openEditDrawer(record)">Editar</a>

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

        <!--CONFIRM-ADD-ATTENDANCE-->
        <a-modal :visible="viewData.modal.confirmAdd.display" :closable="false" :centered="true">
            <template slot="title">
                <div style="display: flex">
                    <a-icon type="question-circle" style="color: #ffcf00; font-size: 1.2rem; margin: 2px 10px 0 0" />
                    <h4>Existe una asistencia con salida pendiente para este empleado. ¿Qué desea hacer?</h4>
                </div>
            </template>

            <p align="center">
                Fecha de Entrada: {{ viewData.modal.confirmAdd.data.date }}
            </p>

            <template slot="footer">
                <a-button key="cancel" @click="viewData.modal.confirmAdd.data.onCancel()">
                    Cancelar
                </a-button>

                <a-button key="entry" type="primary" ghost @click="viewData.modal.confirmAdd.data.onEntry()">
                    Registrar como Entrada
                </a-button>

                <a-button key="exit" type="primary" @click="viewData.modal.confirmAdd.data.onExit()">
                    Registrar como Salida
                </a-button>
            </template>
        </a-modal>

        <!--CONFIRM-EDIT-ATTENDANCE-->
        <edit-attendance :view-data="viewData" :show="showEditDrawer" :current-attendance="currentAttendance" @close="closeDrawerEdit" @edit="onEdit($event)" />
    </div>
</template>

<script>
    import moment from 'moment'
    import AFormItem from 'ant-design-vue/es/form/FormItem'
    import EditAttendance from '../../../../components/edit-attendance/index'

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
        components: { EditAttendance, AFormItem },
        props: {
            viewData: {
                required: true
            }
        },
        data() {
            return {
                moment,
                fields,
                table,
                lastPage: 1,
                confirmVisible: false,
                currentAttendance: {},
                showEditDrawer: false
            }
        },
        computed: {
            dataSource: function () {
                let newDataSource = []

                this.viewData.data.attendances.forEach((e, k) => {
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
            spinning: function () {
                return this.$store.state.spin.show
            },
            spinTip: function () {
                return this.$store.state.spin.tip
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        created() {
            this.$store.subscribe((mutation, state) => {
                switch (mutation.type) {
                    case 'alert/setState': {
                        if (mutation.payload.type === 'error') {
                            this.$notification.error({
                                message: mutation.payload.message,
                                description: mutation.payload.description,
                                duration: mutation.payload.duration
                            })
                        }
                        break
                    }
                }
            })
        },
        mounted() {
            this.form.setFieldsValue({
                date: moment(new Date())
            })
        },
        methods: {
            /**
             * Emite evento para agregar registro de asistencia.
             */
            addAttendance(event) {
                event.preventDefault()

                this.form.validateFields((errors, fields) => {
                    if (!errors) {
                        let self = this

                        this.$emit('event', {
                            type: this.viewData.event.REGISTER,
                            body: this.getBodyData(fields),
                            callback: (promise) => {
                                promise
                                    .then((data) => {
                                        if (data === true) {
                                            self.viewData.bodyData.use_as_exit = true
                                            self.viewData.bodyData.new_attendance = false
                                            self.addAttendance(event)
                                            self.viewData.bodyData.use_as_exit = false
                                            self.viewData.bodyData.new_attendance = true
                                        } else if (data === false) {
                                            self.viewData.bodyData.use_as_exit = false
                                            self.viewData.bodyData.new_attendance = false
                                            self.addAttendance(event)
                                            self.viewData.bodyData.use_as_exit = false
                                            self.viewData.bodyData.new_attendance = true
                                        } else if (data !== null) {
                                            self.$notification.success({
                                                message: data.message,
                                                description: data.description,
                                                duration: data.duration
                                            })
                                        }
                                    })
                                    .catch((error) => {
                                        self.$notification.error({
                                            message: error.message,
                                            description: error.description,
                                            duration: error.duration
                                        })
                                    })
                            }
                        })
                    }
                })
            },

            /**
             * Mapea el request para registrar asitencia.
             */
            getBodyData() {
                return {
                    ...this.viewData.bodyData,
                    rut: this.form.getFieldValue('employee'),
                    date: this.form.getFieldValue('date').toISOString()
                }
            },

            /**
             * Abre drawer para editar asistencia.
             */
            openEditDrawer(record) {
                let entry = this.getFullDate(record.entry_date, record.entry_hour)
                let exit = this.getFullDate(record.exit_date, record.exit_hour)

                this.currentAttendance = {
                    rut: record.rut,
                    employee: record.employee,
                    old_date: entry,
                    entry: entry,
                    exit: (exit !== null && exit.isValid()) ? exit : null
                }

                this.showEditDrawer = true
            },

            /**
             * Cierra drawer de editar asistencia.
             */
            closeDrawerEdit() {
                this.showEditDrawer = false
                this.currentAttendance = {}
            },

            /**
             * Emite evento para editar asistencia.
             */
            onEdit(fields) {
                let self = this
                this.showEditDrawer = false

                const params = {
                    type: this.viewData.event.EDIT,
                    body: {
                        ...this.currentAttendance,
                        entry: fields.entry,
                        exit: fields.exit
                    },
                    callback: (promise) => {
                        promise
                            .then((data) => {
                                self.$notification.success({
                                    message: data.message,
                                    description: data.description,
                                    duration: data.duration
                                })
                            })
                            .catch((error) => {
                                self.$notification.error({
                                    message: error.message,
                                    description: error.description,
                                    duration: error.duration
                                })
                            })
                    }
                }

                this.$emit('event', params)
            },

            /**
             * Emite evento para eliminar asistencia.
             */
            onDelete(record) {
                let self = this

                let entry = this.getFullDate(record.entry_date, record.entry_hour)
                let exit = this.getFullDate(record.exit_date, record.exit_hour)

                this.currentAttendance = {
                    rut: record.rut,
                    employee: record.employee,
                    old_date: entry,
                    entry: entry,
                    exit: (exit !== null && exit.isValid()) ? exit : null
                }

                this.$emit('event', {
                    type: this.viewData.event.DELETE,
                    body: this.currentAttendance,
                    callback: (promise) => {
                        promise
                            .then((data) => {
                                self.$notification.success({
                                    message: data.message,
                                    description: data.description,
                                    duration: data.duration
                                })
                            })
                            .catch((error) => {
                                self.$notification.error({
                                    message: error.message,
                                    description: error.description,
                                    duration: error.duration
                                })
                            })
                    }
                })
            },

            /**
             * Retorna nombre completo del empleado.
             * @param rut
             * @returns {string}
             */
            getEmployee(rut) {
                let employee = this.viewData.data.employees.find((e) => {
                    return e.rut === rut
                })

                if (employee)
                    return employee.first_name + ' ' + employee.last_name
                else
                    return ''
            },

            /**
             * Retorna format de fecha.
             * @param date
             * @returns {string}
             */
            getDate(date) {
                if (date != null)
                    return moment(date).format('DD-MM-YYYY')
                else
                    return ''
            },

            /**
             * Retorna format de hora.
             * @param time
             * @returns {string}
             */
            getTime(time) {
                if (time != null)
                    return moment(time).format('HH:mm:ss')
                else
                    return ''
            },

            /**
             * Retorna fecha completa.
             * @param date
             * @param time
             * @returns moment
             */
            getFullDate(date, time) {
                if (date && date !== '') {
                    let dateArray = date.split('-')
                    return moment(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]} ${time}`)
                } else
                    return null
            },

            /**
             * Retorna la cantidad de horas de diferencia entre las horas de entrada y salida.
             * @param attendance
             * @returns {number}
             */
            getHoursCount(attendance) {
                if (attendance.exit_date)
                    return moment(attendance.exit_date).diff(moment(attendance.entry_date), 'hours')
                else
                    return 0
            },

            /**
             * Bloquea fechas antes de la de entrada.
             * @param current
             * @returns {boolean}
             */
            disabledDateExit(current) {
                return current <= this.formEdit.getFieldValue('entry')
            },

            /**
             * Bloquea fechas despues de la de salida.
             * @param current
             * @returns {boolean}
             */
            disabledDateEntry(current) {
                if (this.formEdit.getFieldValue('exit'))
                    return current >= this.formEdit.getFieldValue('exit')
                else
                    return false
            },

            /**
             * Refresca tabla de asistencias cuando cambia de pagina.
             * @param pagination
             * @param filters
             * @param sorter
             */
            onPaginate(pagination, filters, sorter) {
                let size = pagination.current * this.table.pagination.pageSize

                if (pagination.current > this.lastPage && size >= this.viewData.data.attendances.length) {
                    this.$emit('event', {
                        type: this.viewData.event.GET
                    })
                }

                this.lastPage = pagination.current
            }
        }
    }
</script>

<style scoped>

</style>
