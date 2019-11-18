<template>
    <div id="attendance-page-mobile">
        <a-collapse default-active-key="1">
            <a-collapse-panel key="1" header="Registrar Asistencia">

                <a-form :form="form" layout="vertical" @submit="addAttendance">
                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.date.label" :extra="fields.date.extra" :required="fields.date.required">
                            <a-date-picker
                                v-decorator="fields.date.decorator"
                                show-time
                                format="DD-MM-YYYY HH:mm:ss"
                                :allow-clear="false"
                                :placeholder="fields.date.placeholder"
                                size="large"
                            />
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="center" :gutter="10">
                        <a-form-item :label="fields.employee.label" :extra="fields.employee.extra" :required="fields.employee.required">
                            <a-select v-decorator="fields.employee.decorator" :placeholder="fields.employee.placeholder" size="large">
                                <a-select-option v-for="option of viewData.data.employees" :value="option.rut">
                                    {{ option.first_name }} {{ option.last_name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-row>

                    <a-row type="flex" justify="end" :gutter="10">
                        <a-button class="save-btn" type="primary" html-type="submit" size="large" block>
                            Registrar Asistencia
                        </a-button>
                    </a-row>
                </a-form>
            </a-collapse-panel>

            <a-collapse-panel key="2" header="Lista de Registros">
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
                    <span slot="expandedRowRender" slot-scope="record">
                        <div>
                            <a-row>
                                <p>Rut: {{ record.rut }}</p>
                            </a-row>

                            <a-row>
                                <p>Entrada: {{ record.entry_date }} {{ record.entry_hour }}</p>
                            </a-row>

                            <a-row>
                                <p>Salida: {{ record.exit_date }} {{ record.exit_hour }}</p>
                            </a-row>

                            <a-row>
                                <p>Horas Totales: {{ record.hours_count }} horas.</p>
                            </a-row>

                            <a-row>
                                <a-button type="primary" size="large" block @click="openEditDrawer(record)">Editar</a-button>
                            </a-row>
                        </div>
                    </span>
                </a-table>
            </a-collapse-panel>
        </a-collapse>

        <!--CONFIRM-ADD-ATTENDANCE-->
        <a-drawer
            title="Confirmar Registro"
            :centered="true"
            :closable="true"
            :mask-closable="true"
            :visible="viewData.modal.confirmAdd.display"
            placement="bottom"
            wrap-class-name="drawer-mobile-confirm-add-attendance"
            @close="viewData.modal.confirmAdd.data.onCancel()"
        >
            <div>
                <a-row type="flex" justify="center" :gutter="10">
                    <p align="justify">
                        Existe una asistencia con salida pendiente para este empleado. ¿Qué desea hacer?
                    </p>
                    <p>
                        Fecha de Entrada: {{ viewData.modal.confirmAdd.data.date }}
                    </p>
                </a-row>

                <a-row type="flex" justify="center" :gutter="10">
                    <a-button type="primary" block class="btn" size="large" @click="viewData.modal.confirmAdd.data.onExit()">
                        Registrar como Salida
                    </a-button>
                </a-row>

                <a-row type="flex" justify="center" :gutter="10">
                    <a-button block size="large" class="btn" @click="viewData.modal.confirmAdd.data.onEntry()">
                        Registrar como Entrada
                    </a-button>
                </a-row>

                <a-row type="flex" justify="center" :gutter="10">
                    <a-button type="danger" block size="large" class="btn" @click="viewData.modal.confirmAdd.data.onCancel()">
                        Cancelar
                    </a-button>
                </a-row>
            </div>
        </a-drawer>

        <!--CONFIRM-EDIT-ATTENDANCE-->
        <a-drawer
            title="Editar Asistencia"
            :centered="true"
            :closable="true"
            :mask-closable="true"
            :visible="showEditDrawer"
            placement="bottom"
            wrap-class-name="drawer-mobile-confirm-edit-attendance"
            @close="closeDrawerEdit()"
        >
            <div>
                <a-form :form="formEdit">
                    <a-row :gutter="10">
                        <a-form-item :label="fields.employee.label" :extra="fields.employee.extra" :required="fields.employee.required">
                            <a-input v-decorator="fields.employee.decorator" :placeholder="fields.employee.placeholder" :disabled="true" size="large" />
                        </a-form-item>
                    </a-row>

                    <a-row :gutter="10">
                        <a-form-item :label="fields.entry.label" :extra="fields.entry.extra" :required="fields.entry.required">
                            <a-date-picker
                                v-decorator="fields.entry.decorator"
                                show-time
                                format="DD-MM-YYYY HH:mm:ss"
                                size="large"
                                :allow-clear="false"
                                :placeholder="fields.entry.placeholder"
                                :disabled-date="disabledDateEntry"
                            />
                        </a-form-item>
                    </a-row>

                    <a-row :gutter="10">
                        <a-form-item :label="fields.exit.label" :extra="fields.exit.extra" :required="fields.exit.required">
                            <a-date-picker
                                v-decorator="fields.exit.decorator"
                                show-time
                                format="DD-MM-YYYY HH:mm:ss"
                                size="large"
                                :allow-clear="true"
                                :placeholder="fields.exit.placeholder"
                                :disabled-date="disabledDateExit"
                            />
                        </a-form-item>
                    </a-row>
                </a-form>

                <a-row :gutter="10">
                    <a-button type="primary" size="large" block class="btn" @click="onEdit()">
                        Editar
                    </a-button>
                </a-row>

                <a-row :gutter="10">
                    <a-popconfirm
                        title="¿Estás seguro de querer eliminar esta asistencia?"
                        ok-text="Si"
                        cancel-text="No"
                        placement="top"
                        @confirm="onDelete()"
                    >
                        <a-button size="large" block class="btn">
                            Eliminar
                        </a-button>
                    </a-popconfirm>
                </a-row>

                <a-row :gutter="10">
                    <a-button type="danger" size="large" block class="btn" @click="closeDrawerEdit()">
                        Cancelar
                    </a-button>
                </a-row>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import voca from 'voca'
    import moment from 'moment'

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
        },
        entry: {
            label: 'Fecha/Hora Entrada',
            extra: '',
            required: true,
            placeholder: 'Fecha/Hora Entrada',
            decorator: [
                'entry',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Se necesita una fecha de entrada.' }
                    ]
                }
            ]
        },
        exit: {
            label: 'Fecha/Hora Salida',
            extra: '',
            required: false,
            placeholder: 'Fecha/Hora Salida',
            decorator: [
                'exit',
                {
                    initialValue: undefined,
                    rules: [
                        { required: false, message: 'Se necesita una fecha de salida.' }
                    ]
                }
            ]
        }
    }

    const table = {
        bordered: false,
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
                dataIndex: 'entry_date',
                key: 'entry_date',
                sorter: (a, b) => {
                    let xDate = a.entry_date.split('-')
                    let yDate = b.entry_date.split('-')
                    let x = new Date(xDate[2], xDate[1] - 1, xDate[0])
                    let y = new Date(yDate[2], yDate[1] - 1, yDate[0])
                    return x - y
                }
            }
        ]
    }

    export default {
        name: 'AttendanceMobile',
        props: {
            viewData: {
                required: true
            }
        },
        data() {
            return {
                fields,
                table,
                showEditDrawer: false,
                currentAttendance: {},
                lastPage: 1
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
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
            this.formEdit = this.$form.createForm(this)
        },
        created() {
            this.$store.subscribe((mutation, state) => {
                switch (mutation.type) {
                    case 'alert/setState': {
                        if (mutation.payload.type === 'error')
                            this.$message.error(mutation.payload.description, mutation.payload.duration)
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
                                        } else if (data !== null)
                                            self.$message.success(data.description, data.duration)
                                    })
                                    .catch((error) => {
                                        self.$message.error(error.description, error.duration)
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
                this.showEditDrawer = true

                let entry = this.getFullDate(record.entry_date, record.entry_hour)
                let exit = this.getFullDate(record.exit_date, record.exit_hour)

                this.currentAttendance = {
                    rut: record.rut,
                    employee: record.employee,
                    old_date: entry,
                    entry: entry,
                    exit: (exit !== null && exit.isValid()) ? exit : null
                }

                setTimeout(() => {
                    this.formEdit.setFieldsValue({
                        employee: record.employee,
                        entry: entry,
                        exit: this.currentAttendance.exit
                    })
                }, 100)
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
            onEdit() {
                let self = this
                this.showEditDrawer = false

                this.formEdit.validateFields((errors, fields) => {
                    if (!errors) {
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
                                        self.$message.success(data.description, data.duration)
                                    })
                                    .catch((error) => {
                                        self.$message.error(error.description, error.duration)
                                    })
                            }
                        }

                        this.$emit('event', params)
                    }
                })
            },

            /**
             * Emite evento para eliminar asistencia.
             */
            onDelete() {
                let self = this
                this.showEditDrawer = false

                this.$emit('event', {
                    type: this.viewData.event.DELETE,
                    body: this.currentAttendance,
                    callback: (promise) => {
                        promise
                            .then((data) => {
                                self.$message.success(data.description, data.duration)
                            })
                            .catch((error) => {
                                self.$message.error(error.description, error.duration)
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
                    return voca.charAt(employee.first_name, 0).toUpperCase() + '. ' + employee.last_name
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
