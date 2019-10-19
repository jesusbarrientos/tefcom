<template>
    <div id="attendance-page-desktop">
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                <a-card title="Asistencia" :bordered="false" class="attendance-card">
                    <a-spin tip="Registrando..." :spinning="visibleSpin">
                        <div class="new-attendance">

                            <h3>Registrar</h3>

                            <a-form :form="form" layout="vertical" @submit="addAttendance">
                                <a-row :gutter="10">
                                    <a-col :span="8">
                                        <a-form-item :label="fields.date.label" :extra="fields.date.extra" :required="fields.date.required">
                                            <a-date-picker v-decorator="fields.date.decorator" showTime format="DD-MM-YYYY HH:mm:ss" :allow-clear="false" :placeholder="fields.date.placeholder" />
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
                        { required: true, message: 'Se necesita una fecha de jornada.' }
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

    export default {
        name: 'AttendanceDesktop',
        components: { AFormItem },
        props: {
            body: {
                required: true
            },
            event: {
                required: true
            },
            bodyData: {
                required: true
            }
        },
        data() {
            return {
                moment,
                visibleSpin: false,
                fields
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
                        this.visibleSpin = true

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
                                    .finally(() => { this.visibleSpin = false })
                            }
                        }

                        this.$emit('emit', param)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
