<template>
    <a-drawer
        title="Editar Asistencia"
        placement="right"
        :closable="false"
        :visible="show"
        width="400"
    >
        <a-spin :spinning="loading">
            <a-form :form="formEdit" @submit="editAttendance">
                <a-row :gutter="10">
                    <a-col :span="24">
                        <a-form-item :label="fields.employee.label" :extra="fields.employee.extra" :required="fields.employee.required">
                            <a-input v-decorator="fields.employee.decorator" :placeholder="fields.employee.placeholder" :disabled="true" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="10">
                    <a-col :span="24">
                        <a-form-item :label="fields.entry.label" :extra="fields.entry.extra" :required="fields.entry.required">
                            <a-date-picker
                                v-decorator="fields.entry.decorator"
                                show-time
                                format="DD-MM-YYYY HH:mm:ss"
                                :allow-clear="false"
                                :placeholder="fields.entry.placeholder"
                                :disabled-date="disabledDateEntry"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="10">
                    <a-col :span="24">
                        <a-form-item :label="fields.exit.label" :extra="fields.exit.extra" :required="fields.exit.required">
                            <a-date-picker
                                v-decorator="fields.exit.decorator"
                                show-time
                                format="DD-MM-YYYY HH:mm:ss"
                                :allow-clear="true"
                                :placeholder="fields.exit.placeholder"
                                :disabled-date="disabledDateExit"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="10">
                    <a-col :span="12">
                        <a-button type="primary" html-type="submit" block>
                            Editar
                        </a-button>
                    </a-col>

                    <a-col :span="12">
                        <a-button type="danger" block @click="closeDrawer">
                            Cancelar
                        </a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-drawer>
</template>

<script>

    const fields = {
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
                        { required: true, message: 'Se necesita un empleado.' }
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

    export default {
        name: 'EditAttendanceDesktop',
        props: {
            show: {
                required: true,
                default: false
            },
            event: {
                required: true
            },
            setValue: {
                required: true
            }
        },
        data() {
            return {
                fields,
                loading: false,
                formEdit: this.$form.createForm(this, {
                    onFieldsChange: this.setValue
                })
            }
        },
        watch: {
            show: function () {
                setTimeout(() => {
                    if (this.show) {
                        this.formEdit.setFieldsValue({
                            employee: this.$store.state.attendance.employee,
                            entry: this.$store.state.attendance.entry,
                            exit: this.$store.state.attendance.exit
                        })
                    }
                }, 100)
            }
        },
        methods: {
            editAttendance($event) {
                $event.preventDefault()

                this.loading = true

                if (this.formEdit.validateFields) {
                    this.$emit('emit', {
                        type: this.event.CONFIRM_EDIT,
                        callback: (promise) => {
                            promise.finally(() => {
                                this.loading = false
                            })
                        }
                    })
                }
            },
            closeDrawer() {
                this.$emit('emit', {
                    type: this.event.SHOW_EDIT
                })
            },
            disabledDateExit(current) {
                return current <= this.formEdit.getFieldValue('entry')
            },
            disabledDateEntry(current) {
                if (this.formEdit.getFieldValue('exit'))
                    return current >= this.formEdit.getFieldValue('exit')
                else
                    return false
            }
        }
    }
</script>

<style scoped>

</style>
