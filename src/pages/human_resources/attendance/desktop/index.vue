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
                                            <a-date-picker v-decorator="fields.date.decorator" :allow-clear="false" :placeholder="fields.date.placeholder" />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="8">
                                        <a-form-item :label="fields.time.label" :extra="fields.time.extra" :required="fields.time.required">
                                            <a-time-picker v-decorator="fields.time.decorator" use12hours :allow-empty="false" format="h:mm:ss A" :placeholder="fields.time.placeholder" />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="8">
                                        <a-form-item :label="fields.employee.label" :extra="fields.employee.extra" :required="fields.employee.required">
                                            <a-select v-decorator="fields.employee.decorator" :placeholder="fields.employee.placeholder" />
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
        time: {
            label: 'Hora',
            extra: '',
            required: true,
            placeholder: 'Hora',
            decorator: [
                'time',
                {
                    initialValue: moment(new Date()),
                    rules: [
                        { required: true, message: 'Ingrese hora de entrada/salida.' }
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
            addAttendance() {

            }
        }
    }
</script>

<style scoped>

</style>
