<template>
    <div id="employee-page-desktop">
        <!--REGISTER & LIST EMPLOYEES-->
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :span="16">
                <a-card title="Empleados" :bordered="false" class="employees-card">
                    <a-spin tip="Registrando..." :spinning="visibleSpin">
                        <div class="new-employee">

                            <h3>Nuevo Empleado</h3>

                            <form-add-employee @addEmployee="addEmployee" />
                        </div>
                    </a-spin>

                    <a-table
                        :columns="table.columns"
                        :data-source="data.employees"
                        :bordered="table.bordered"
                        :loading="table.loading"
                        :scroll="table.scroll"
                        :pagination="table.pagination"
                        row-key="rut"
                        position="bottom"
                    >
                        <label slot="name" slot-scope="record">{{ record['first_name'] }} {{ record['last_name'] }}</label>

                        <label slot="price" slot-scope="text">${{ text }}</label>
                        <span slot="priceText">
                            Valor (HH)
                            <a-popover placement="top">
                                <template slot="content">
                                    HH: Horas Hombre.
                                </template>
                                <template slot="title">
                                    Ayuda
                                </template>
                                <a-badge><a-icon type="question-circle" /></a-badge>
                            </a-popover>
                        </span>

                        <span slot="action" slot-scope="record">
                            <a @click="onShowMore(record)">Ficha</a>

                            <a-divider type="vertical" />

                            <a @click="onEdit(record)">Editar</a>

                            <a-divider type="vertical" />

                            <a-popconfirm title="¿Estás seguro de querer eliminar este empleado?" @confirm="onDelete(record)">
                                <a>Eliminar</a>
                            </a-popconfirm>
                        </span>
                    </a-table>
                </a-card>
            </a-col>
        </a-row>

        <!--INFO EMPLOYEE-->
        <a-drawer
            :title="infoDrawer.title"
            :placement="infoDrawer.placement"
            :closable="infoDrawer.closable"
            :visible="infoDrawer.visible"
            :width="infoDrawer.width"
            @close="onCloseInfoDrawer"
        >
            <a-row type="flex" justify="center">
                <a-col :span="24">
                    <a-divider orientation="left">
                        Datos Personales
                    </a-divider>

                    <div style="display: grid">
                        <span>
                            <b>Rut:</b>
                            <label>{{ infoDrawer.record.rut }}</label>
                        </span>

                        <span>
                            <b>Nombre:</b>
                            <label>{{ infoDrawer.record.first_name }} {{ infoDrawer.record.last_name }}</label>
                        </span>

                        <span>
                            <b>Ocupación:</b>
                            <label>{{ infoDrawer.record.occupation }}</label>
                        </span>
                    </div>

                    <a-divider orientation="left">
                        Contacto
                    </a-divider>

                    <div style="display: grid">
                        <span>
                            <b>Teléfono:</b>
                            <label>{{ infoDrawer.record.phone }}</label>
                        </span>

                        <span>
                            <b>Correo Electrónico:</b>
                            <label>{{ infoDrawer.record.email }}</label>
                        </span>
                    </div>

                    <a-divider orientation="left">
                        Otros
                    </a-divider>

                    <div style="display: grid">
                        <span>
                            <b>Valor Hora Hombre:</b>
                            <label>${{ infoDrawer.record.price }}</label>
                        </span>

                        <span>
                            <b>Valor Hora Hombre Extra:</b>
                            <label>${{ infoDrawer.record.price_extra }}</label>
                        </span>
                    </div>
                </a-col>
            </a-row>
        </a-drawer>

        <!--EDIT EMPLOYEE-->
        <a-drawer
            :title="editDrawer.title"
            :placement="editDrawer.placement"
            :closable="editDrawer.closable"
            :visible="editDrawer.visible"
            :width="editDrawer.width"
            :wrap-class-name="editDrawer.wrapClassName"
            :mask-closable="false"
            @close="onCloseEditDrawer"
        >
            <a-spin tip="Modificando..." :spinning="editVisibleSpin">
                <a-row type="flex" justify="center" :gutter="16">
                    <a-col :span="24">
                        <a-form :form="formEdit" @submit="editEmployee">
                            <a-row :gutter="10">
                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.rut.label" :extra="editDrawer.fields.rut.extra" :required="editDrawer.fields.rut.required">
                                        <a-input v-decorator="editDrawer.fields.rut.decorator" :placeholder="editDrawer.fields.rut.placeholder" disabled />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.nombre.label" :extra="editDrawer.fields.nombre.extra" :required="editDrawer.fields.nombre.required">
                                        <a-input v-decorator="editDrawer.fields.nombre.decorator" :placeholder="editDrawer.fields.nombre.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.apellido.label" :extra="editDrawer.fields.apellido.extra" :required="editDrawer.fields.apellido.required">
                                        <a-input v-decorator="editDrawer.fields.apellido.decorator" :placeholder="editDrawer.fields.apellido.placeholder" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="10">
                                <a-col :span="16">
                                    <a-form-item :label="editDrawer.fields.ocupacion.label" :extra="editDrawer.fields.ocupacion.extra" :required="editDrawer.fields.ocupacion.required">
                                        <a-input v-decorator="editDrawer.fields.ocupacion.decorator" :placeholder="editDrawer.fields.ocupacion.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.telefono.label" :extra="editDrawer.fields.telefono.extra" :required="editDrawer.fields.telefono.required">
                                        <a-input v-mask="editDrawer.fields.telefono.mask" v-decorator="editDrawer.fields.telefono.decorator" :placeholder="editDrawer.fields.telefono.placeholder" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="10">
                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.correo.label" :extra="editDrawer.fields.correo.extra" :required="editDrawer.fields.correo.required">
                                        <a-input v-decorator="editDrawer.fields.correo.decorator" :placeholder="editDrawer.fields.correo.placeholder" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.valor.label" :extra="editDrawer.fields.valor.extra" :required="editDrawer.fields.valor.required">
                                        <a-input-number
                                            v-decorator="editDrawer.fields.valor.decorator"
                                            :precision="0"
                                            :placeholder="editDrawer.fields.valor.placeholder"
                                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                            :min="1"
                                            :max="1000000"
                                        />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="8">
                                    <a-form-item :label="editDrawer.fields.valor_extra.label" :extra="editDrawer.fields.valor_extra.extra" :required="editDrawer.fields.valor_extra.required">
                                        <a-input-number
                                            v-decorator="editDrawer.fields.valor_extra.decorator"
                                            :precision="0"
                                            :placeholder="editDrawer.fields.valor_extra.placeholder"
                                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                            :min="1"
                                            :max="1000000"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row style="margin-bottom: 10px">
                                <label>* Campo obligatorio.</label>
                            </a-row>

                            <a-button type="primary" html-type="submit" block>
                                Modificar
                            </a-button>

                            <a-button type="danger" block @click="onCloseEditDrawer">
                                Cancelar
                            </a-button>
                        </a-form>
                    </a-col>
                </a-row>
            </a-spin>
        </a-drawer>
    </div>
</template>

<script>

    import AFormItem from 'ant-design-vue/es/form/FormItem'
    import FormAddEmployee from '../../../../components/forms/employee/add/FormAddEmployee'

    const table = {
        bordered: true,
        loading: true,
        scroll: { x: '100%' },
        pagination: { pageSize: 5 },
        columns: [
            {
                title: 'Rut',
                key: 'rut',
                dataIndex: 'rut'
            },
            {
                title: 'Nombre Completo',
                key: 'name',
                sorter: (a, b) => `${a['first_name']} ${a['last_name']}`.localeCompare(`${b['first_name']} ${b['last_name']}`),
                scopedSlots: { customRender: 'name' }
            },
            {
                title: 'Ocupación',
                key: 'occupation',
                dataIndex: 'occupation'
            },
            {
                key: 'price',
                dataIndex: 'price',
                sorter: (a, b) => a.price - b.price,
                slots: { title: 'priceText' },
                scopedSlots: { customRender: 'price' }
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
    const infoDrawer = {
        title: 'Ficha del Empleado',
        visible: false,
        closable: true,
        placement: 'right',
        width: 660,
        record: {}
    }
    const editDrawer = {
        title: 'Editar Empleado',
        visible: false,
        closable: false,
        placement: 'right',
        width: 660,
        wrapClassName: 'employee-page-desktop-drawer-edit',
        fields: {
            rut: {
                label: 'Rut',
                required: true,
                extra: '',
                placeholder: 'Rut',
                decorator: [
                    'rut',
                    {
                        initialValue: undefined,
                        rules: [
                            { required: true, message: 'Ingrese un rut.' },
                            { pattern: new RegExp('^[1-9]{1}\\d{0,1}\\.\\d{3}\\.\\d{3}[-][0-9kK]{1}$'), message: 'Ingrese un rut con formato válido (12.345.678-K).' }
                        ]
                    }
                ],
                mask: {
                    mask: ['F.###.###-V', 'F#.###.###-V'],
                    tokens: {
                        '#': {
                            pattern: /[0-9]/
                        },
                        'V': {
                            pattern: /[0-9kK]/,
                            transform: v => v.toLocaleUpperCase()
                        },
                        'F': {
                            pattern: /[1-9]/
                        }
                    }
                }
            },
            nombre: {
                label: 'Nombre',
                required: true,
                extra: '',
                placeholder: 'Nombre',
                decorator: [
                    'first_name',
                    {
                        initialValue: undefined,
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
                    'last_name',
                    {
                        initialValue: undefined,
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
                    'occupation',
                    {
                        initialValue: undefined,
                        rules: [
                            { max: 200, message: 'Excede el máximo de caracteres permitidos (200).' }
                        ]
                    }
                ]
            },
            telefono: {
                label: 'Teléfono',
                required: false,
                extra: '',
                placeholder: 'Teléfono',
                decorator: [
                    'phone',
                    {
                        initialValue: undefined,
                        rules: [
                            { pattern: new RegExp('^[+]{1}\\(\\d{1,2}\\)[ ]\\d{1,2}[ ]\\d{3,4}[-]\\d{4}$'), message: 'Ingrese un teléfono con formato válido (+(56) 9 1234-1234).' }
                        ]
                    }
                ],
                mask: {
                    mask: ['+(56) F ####-####', '+(56) FF ###-####'],
                    tokens: {
                        '#': {
                            pattern: /[0-9]/
                        },
                        'F': {
                            pattern: /[1-9]/
                        }
                    }
                }
            },
            correo: {
                label: 'Correo Electrónico',
                required: false,
                extra: '',
                placeholder: 'Correo electrónico',
                decorator: [
                    'email',
                    {
                        initialValue: undefined,
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
                    'price',
                    {
                        initialValue: 1,
                        rules: [
                            { required: true, message: 'El valor es obligatorio.' },
                            { type: 'number', message: 'El valor debe ser numérico.' }
                        ]
                    }
                ]
            },
            valor_extra: {
                label: 'Valor HH Extra',
                required: true,
                extra: 'Valor expresado en CLP.',
                placeholder: 'Valor Hora/Hombre Extra',
                decorator: [
                    'price_extra',
                    {
                        initialValue: 1,
                        rules: [
                            { required: true, message: 'El valor es obligatorio.' },
                            { type: 'number', message: 'El valor debe ser numérico.' }
                        ]
                    }
                ]
            }
        }
    }

    export default {
        name: 'EmployeeDesktop',
        components: { FormAddEmployee, AFormItem },
        props: {
            data: {
                required: true
            },
            loadingData: {
                required: true
            },
            events: {
                required: true
            }
        },
        data() {
            return {
                table,
                infoDrawer,
                editDrawer,
                rut: '',
                visibleSpin: false,
                editVisibleSpin: false
            }
        },
        watch: {
            loadingData: function () {
                this.table.loading = this.loadingData
            }
        },
        beforeCreate() {
            this.formEdit = this.$form.createForm(this)
        },
        methods: {
            /**
             * Muestra la información detallada del empleado.
             * @param record
             */
            onShowMore(record) {
                this.infoDrawer.record = record
                this.infoDrawer.visible = true
            },
            /**
             * Muestra drawer con información clonada del empleado.
             * Esta no se modifica hasta que se confirme.
             * @param record
             */
            onEdit(record) {
                const cloneRecord = JSON.parse(JSON.stringify(record))
                this.editDrawer.visible = true

                setTimeout(() => {
                    this.formEdit.setFieldsValue({
                        rut: cloneRecord.rut,
                        first_name: cloneRecord.first_name,
                        last_name: cloneRecord.last_name,
                        occupation: cloneRecord.occupation,
                        phone: cloneRecord.phone,
                        email: cloneRecord.email,
                        price: cloneRecord.price,
                        price_extra: cloneRecord.price_extra
                    })
                }, 100)
            },
            /**
             * Cuando se desea eliminar, se notifica al padre para que haga la operación.
             * @param record
             */
            onDelete(record) {
                const body = {
                    rut: record.rut,
                    first_name: record.first_name
                }

                this.$emit('emit', { type: this.events.DELETE, body: body })
            },
            /**
             * Cierra drawer de información detallada.
             */
            onCloseInfoDrawer() {
                this.infoDrawer.visible = false
                this.infoDrawer.record = {}
            },
            /**
             * Cierra drawer con formulario de edición de empleado.
             */
            onCloseEditDrawer() {
                this.editDrawer.visible = false
                this.formEdit.resetFields()
            },
            /**
             * Emite evento para registrar empleado.
             */
            addEmployee($event) {
                this.showSpin()

                const param = {
                    type: this.events.CREATE,
                    body: $event.body,
                    callback: (promise) => {
                        promise
                            // En caso de ser registrado correctamente
                            .then(() => {
                                this.hideSpin()
                            })
                            // En caso de error
                            .catch(() => {
                                this.hideSpin()
                            })
                            .finally(() => $event.callback(promise))
                    }
                }

                this.$emit('emit', param)
            },
            /**
             * Emite evento para editar empleado.
             */
            editEmployee($event) {
                $event.preventDefault()

                this.formEdit.validateFields((error) => {
                    if (!error) {
                        this.showEditSpin()

                        const params = {
                            type: this.events.EDIT,
                            body: this.formEdit.getFieldsValue(),
                            callback: (promise) => {
                                promise
                                    // En caso de ser modificado correctamente
                                    .then(() => {
                                        this.onCloseEditDrawer()
                                    })
                                    .finally(() => {
                                        this.hideEditSpin()
                                    })
                            }
                        }

                        this.$emit('emit', params)
                    }
                })
            },
            /**
             * Muestra spin de carga.
             */
            showSpin() {
                this.visibleSpin = true
            },
            /**
             * Esconde spin de carga.
             */
            hideSpin() {
                this.visibleSpin = false
            },
            /**
             * Muestra spin de carga en drawer edit.
             */
            showEditSpin() {
                this.editVisibleSpin = true
            },
            /**
             * Esconde spin de carga en drawer edit.
             */
            hideEditSpin() {
                this.editVisibleSpin = false
            }
        }
    }
</script>
