<template>
    <a-form :form="formAdd" layout="vertical" @submit="addEmployee">
        <a-row :gutter="10">
            <a-col :span="6">
                <a-form-item :label="fields.rut.label" :extra="fields.rut.extra" :required="fields.rut.required">
                    <a-input v-decorator="fields.rut.decorator" :placeholder="fields.rut.placeholder" />
                </a-form-item>
            </a-col>

            <a-col :span="6">
                <a-form-item :label="fields.nombre.label" :extra="fields.nombre.extra" :required="fields.nombre.required">
                    <a-input v-decorator="fields.nombre.decorator" :placeholder="fields.nombre.placeholder" />
                </a-form-item>
            </a-col>

            <a-col :span="6">
                <a-form-item :label="fields.apellido.label" :extra="fields.apellido.extra" :required="fields.apellido.required">
                    <a-input v-decorator="fields.apellido.decorator" :placeholder="fields.apellido.placeholder" />
                </a-form-item>
            </a-col>

            <a-col :span="6">
                <a-form-item :label="fields.ocupacion.label" :extra="fields.ocupacion.extra" :required="fields.ocupacion.required">
                    <a-input v-decorator="fields.ocupacion.decorator" :placeholder="fields.ocupacion.placeholder" />
                </a-form-item>
            </a-col>
        </a-row>

        <a-row :gutter="10">
            <a-col :span="6">
                <a-form-item :label="fields.telefono.label" :extra="fields.telefono.extra" :required="fields.telefono.required">
                    <a-input v-decorator="fields.telefono.decorator" :placeholder="fields.telefono.placeholder" />
                </a-form-item>
            </a-col>

            <a-col :span="6">
                <a-form-item :label="fields.correo.label" :extra="fields.correo.extra" :required="fields.correo.required">
                    <a-input v-decorator="fields.correo.decorator" :placeholder="fields.correo.placeholder" />
                </a-form-item>
            </a-col>

            <a-col :span="6">
                <a-form-item :label="fields.valor.label" :extra="fields.valor.extra" :required="fields.valor.required">
                    <a-input-number
                        v-decorator="fields.valor.decorator"
                        :precision="0"
                        :placeholder="fields.valor.placeholder"
                        :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        :min="1"
                        :max="1000000"
                    />
                </a-form-item>
            </a-col>
        </a-row>

        <a-row>
            <a-button type="primary" html-type="submit" block>
                Registrar
            </a-button>
        </a-row>
    </a-form>
</template>

<script>

    const fields = {
        rut: {
            label: 'Rut',
            required: true,
            extra: 'Formato: 12.345.678-9.',
            placeholder: 'Rut',
            decorator: [
                'rut',
                {
                    rules: [
                        { required: true, message: 'Ingrese un rut.' },
                        { pattern: new RegExp('^[1-9]{1}\\d{0,1}\\.\\d{3}\\.\\d{3}[-][0-9kK]{1}$'), message: 'Ingrese un rut con formato válido.' }
                    ]
                }
            ]
        },
        nombre: {
            label: 'Nombre',
            required: true,
            extra: '',
            placeholder: 'Nombre',
            decorator: [
                'nombre',
                {
                    rules: [
                        { required: true, message: 'El nombre es obligatorio.' },
                        { max: 32, message: 'Excede el máximo de caracteres permitidos (32).' }
                    ]
                }
            ]
        },
        apellido: {
            label: 'Apellido',
            required: true,
            extra: '',
            placeholder: 'Apellido',
            decorator: [
                'apellido',
                {
                    rules: [
                        { required: true, message: 'El apellido es obligatorio.' },
                        { max: 32, message: 'Excede el máximo de caracteres permitidos (32).' }
                    ]
                }
            ]
        },
        ocupacion: {
            label: 'Ocupación',
            required: false,
            extra: '',
            placeholder: 'Ocupación',
            decorator: [
                'ocupacion',
                {
                    rules: [
                        { max: 200, message: 'Excede el máximo de caracteres permitidos (200).' }
                    ]
                }
            ]
        },
        telefono: {
            label: 'Teléfono',
            required: false,
            extra: 'Formato: +(56) 32 123-1234.',
            placeholder: 'Teléfono',
            decorator: [
                'telefono',
                {
                    rules: [
                        { pattern: new RegExp('^[+]{1}\\(\\d{1,2}\\)[ ]\\d{1,2}[ ]\\d{3,4}[-]\\d{4}$'), message: 'Ingrese un teléfono con formato válido.' }
                    ]
                }
            ]
        },
        correo: {
            label: 'Correo Electrónico',
            required: false,
            extra: '',
            placeholder: 'Correo electrónico',
            decorator: [
                'correo',
                {
                    rules: [
                        { type: 'email', message: 'Ingrese un correo válido.' },
                        { max: 200, message: 'Excede el máximo de caracteres permitidos (200).' }
                    ]
                }
            ]
        },
        valor: {
            label: 'Valor Hora/Hombre',
            required: true,
            extra: 'Valor expresado en CLP.',
            placeholder: 'Valor Hora/Hombre',
            decorator: [
                'valor',
                {
                    rules: [
                        { required: true, message: 'El valor es obligatorio.' },
                        { type: 'number', message: 'El valor debe ser numérico.' }
                    ]
                }
            ]
        }
    }

    export default {
        name: 'FormAddEmployee',
        data() {
            return {
                fields
            }
        },
        beforeCreate() {
            this.formAdd = this.$form.createForm(this)
        },
        methods: {
            /**
             * Emite evento para registrar empleado.
             */
            addEmployee($event) {
                $event.preventDefault()
                this.formAdd.validateFields((error) => {
                    if (!error)
                        this.$emit('addEmployee', { body: 'Hola Mundo!' })
                })
            }
        }
    }
</script>

<style scoped>

</style>
