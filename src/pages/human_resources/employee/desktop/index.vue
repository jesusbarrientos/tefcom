<template>
    <div id="employee-page-desktop">
        <!--REGISTER & LIST EMPLOYEES-->
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :span="16">
                <a-card title="Empleados" :bordered="false" class="employees-card">
                    <div class="new-employee">

                        <h3>Nuevo Empleado</h3>

                        <form-add-employee @addEmployee="addEmployee" />
                    </div>

                    <a-table
                        :columns="table.columns"
                        :data-source="data.employees"
                        :bordered="table.bordered"
                        :loading="table.loading"
                        :scroll="table.scroll"
                        :pagination="table.pagination"
                        row-key="id"
                        position="bottom"
                    >
                        <label slot="name" slot-scope="record">{{ record['name'] }} {{ record['last_name'] }}</label>

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
                            <label>{{ infoDrawer.record.name }} {{ infoDrawer.record.lastName }}</label>
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
            @close="onCloseEditDrawer"
        >
            <a-row type="flex" justify="center" :gutter="16">
                <a-col :span="24">
                    <a-form :form="formEdit" layout="vertical">
                        <a-row :gutter="10">
                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.rut" placeholder="Rut" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.name" placeholder="Nombre" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.lastName" placeholder="Apellido" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.occupation" placeholder="Ocupación" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row :gutter="10">
                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.phone" placeholder="Teléfono" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.email" type="email" placeholder="Correo Electrónico" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item>
                                    <a-input v-model="editDrawer.record.price" placeholder="Valor Hora/Hombre" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-button type="primary" block>
                            Registrar
                        </a-button>

                        <a-button type="danger" block>
                            Cancelar
                        </a-button>
                    </a-form>
                </a-col>
            </a-row>
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
                sorter: (a, b) => `${a.name} ${a['last_name']}`.localeCompare(`${b.name} ${b['last_name']}`),
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
        record: {}
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
                editDrawer
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
                this.editDrawer.record = JSON.parse(JSON.stringify(record))
                this.editDrawer.visible = true
            },
            /**
             * Cuando se desea eliminar, se notifica al padre para que haga la operación.
             * @param record
             */
            onDelete(record) {
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
                this.editDrawer.record = {}
            },

            /**
             * Emite evento para registrar empleado.
             */
            addEmployee($event) {
                this.$emit('emit', { type: this.events.CREATE, body: $event.body })
            }
        }
    }
</script>
