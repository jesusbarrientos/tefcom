<template>
    <div id="employee-page-desktop">
        <!--REGISTER & LIST EMPLOYEES-->
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :span="16">
                <a-card title="Empleados" :bordered="false" class="employees-card">
                    <div class="new-employee">

                        <h3>Nuevo Empleado</h3>

                        <a-form :form="formAdd" layout="vertical">
                            <a-row :gutter="10">
                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Rut" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Nombre" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Apellido" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Ocupación" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="10">
                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Teléfono" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Correo Electrónico" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="6">
                                    <a-form-item>
                                        <a-input placeholder="Valor Hora/Hombre" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row>
                                <a-button type="primary" block>
                                    Registrar
                                </a-button>
                            </a-row>
                        </a-form>
                    </div>

                    <a-table
                        :columns="employees.table.columns"
                        :data-source="employees.data"
                        :bordered="employees.table.bordered"
                        :loading="employees.table.loading"
                        :scroll="employees.table.scroll"
                        :pagination="employees.table.pagination"
                        position="bottom"
                    >
                        <label slot="name" slot-scope="record">{{ record.name }} {{ record.lastName }}</label>

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

    const employees = {
        data: [{
            'key': 1,
            'rut': '17.565.499-3',
            'name': 'Darb',
            'lastName': 'Wickenden',
            'occupation': 'Cost Accountant',
            'phone': '560-919-7192',
            'email': 'dwickenden0@yahoo.co.jp',
            'price': 4056
        }, {
            'key': 2,
            'rut': '16.649.496-8',
            'name': 'Quillan',
            'lastName': 'Haddrill',
            'occupation': 'Help Desk Operator',
            'phone': '835-670-5500',
            'email': 'qhaddrill1@storify.com',
            'price': 1229
        }, {
            'key': 3,
            'rut': '18.103.108-2',
            'name': 'Eirena',
            'lastName': 'Kirtlan',
            'occupation': 'Desktop Support Technician',
            'phone': '104-358-8975',
            'email': 'ekirtlan2@is.gd',
            'price': 7063
        }, {
            'key': 4,
            'rut': '16.475.251-6',
            'name': 'Moyra',
            'lastName': 'Blofeld',
            'occupation': 'Assistant Media Planner',
            'phone': '688-347-4532',
            'email': 'mblofeld3@imdb.com',
            'price': 6933
        }, {
            'key': 5,
            'rut': '16.276.267-0',
            'name': 'Meridith',
            'lastName': 'Crottagh',
            'occupation': 'Account Executive',
            'phone': '848-245-5168',
            'email': 'mcrottagh4@macromedia.com',
            'price': 6411
        }, {
            'key': 6,
            'rut': '13.693.316-4',
            'name': 'Adriena',
            'lastName': 'Hullot',
            'occupation': 'Cost Accountant',
            'phone': '787-319-0125',
            'email': 'ahullot5@tripadvisor.com',
            'price': 2646
        }, {
            'key': 7,
            'rut': '14.103.946-6',
            'name': 'Lilias',
            'lastName': 'Gerty',
            'occupation': 'Cost Accountant',
            'phone': '901-312-1043',
            'email': 'lgerty6@gnu.org',
            'price': 4391
        }, {
            'key': 8,
            'rut': '19.192.888-7',
            'name': 'Peg',
            'lastName': 'Crosseland',
            'occupation': 'Budget/Accounting Analyst II',
            'phone': '890-115-1806',
            'email': 'pcrosseland7@deliciousdays.com',
            'price': 1299
        }, {
            'key': 9,
            'rut': '14.145.308-6',
            'name': 'Wilhelmina',
            'lastName': 'Mildenhall',
            'occupation': 'General Manager',
            'phone': '389-814-5655',
            'email': 'wmildenhall8@tmall.com',
            'price': 8064
        }, {
            'key': 10,
            'rut': '18.434.788-9',
            'name': 'Coraline',
            'lastName': 'Shobrook',
            'occupation': 'VP Product Management',
            'phone': '786-573-6493',
            'email': 'cshobrook9@wired.com',
            'price': 7768
        }, {
            'key': 11,
            'rut': '11.409.932-6',
            'name': 'Obediah',
            'lastName': 'Gentreau',
            'occupation': 'Legal Assistant',
            'phone': '492-616-5086',
            'email': 'ogentreaua@free.fr',
            'price': 8158
        }, {
            'key': 12,
            'rut': '15.692.866-6',
            'name': 'Emmanuel',
            'lastName': 'Dullingham',
            'occupation': 'Nurse',
            'phone': '141-672-4297',
            'email': 'edullinghamb@wix.com',
            'price': 2342
        }, {
            'key': 13,
            'rut': '15.321.648-7',
            'name': 'Booth',
            'lastName': 'Upward',
            'occupation': 'Teacher',
            'phone': '381-367-7864',
            'email': 'bupwardc@jalbum.net',
            'price': 3751
        }, {
            'key': 14,
            'rut': '17.604.923-2',
            'name': 'Lindsy',
            'lastName': 'Revett',
            'occupation': 'General Manager',
            'phone': '329-670-8472',
            'email': 'lrevettd@paypal.com',
            'price': 1411
        }, {
            'key': 15,
            'rut': '15.963.489-9',
            'name': 'Tom',
            'lastName': 'Pethrick',
            'occupation': 'Internal Auditor',
            'phone': '436-904-3865',
            'email': 'tpethricke@bravesites.com',
            'price': 4812
        }, {
            'key': 16,
            'rut': '13.576.551-7',
            'name': 'Laurena',
            'lastName': 'Januszewski',
            'occupation': 'Web Developer III',
            'phone': '931-122-4170',
            'email': 'ljanuszewskif@360.cn',
            'price': 3749
        }, {
            'key': 17,
            'rut': '14.462.999-6',
            'name': 'Vinny',
            'lastName': 'Bertelmot',
            'occupation': 'Accounting Assistant IV',
            'phone': '658-900-5611',
            'email': 'vbertelmotg@aboutads.info',
            'price': 9916
        }, {
            'key': 18,
            'rut': '19.308.928-7',
            'name': 'Eada',
            'lastName': 'Harrild',
            'occupation': 'Chief Design Engineer',
            'phone': '284-128-4937',
            'email': 'eharrildh@thetimes.co.uk',
            'price': 7791
        }, {
            'key': 19,
            'rut': '10.854.500-2',
            'name': 'Saloma',
            'lastName': 'Oxenbury',
            'occupation': 'Recruiting Manager',
            'phone': '197-142-7747',
            'email': 'soxenburyi@homestead.com',
            'price': 6261
        }, {
            'key': 20,
            'rut': '11.705.338-0',
            'name': 'Sergei',
            'lastName': 'Heard',
            'occupation': 'Engineer I',
            'phone': '528-171-4241',
            'email': 'sheardj@unesco.org',
            'price': 1337
        }],
        table: {
            bordered: true,
            loading: false,
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
                    sorter: (a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`),
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
        components: { AFormItem },
        data() {
            return {
                employees,
                infoDrawer,
                editDrawer
            }
        },
        beforeCreate() {
            this.formAdd = this.$form.createForm(this)
            this.formEdit = this.$form.createForm(this)
        },
        methods: {
            onShowMore(record) {
                this.infoDrawer.record = record
                this.infoDrawer.visible = true
            },
            onEdit(record) {
                this.editDrawer.record = JSON.parse(JSON.stringify(record))
                this.editDrawer.visible = true
            },
            onDelete(record) {
                const data = [...this.employees.data]
                this.employees.data = data.filter(item => item.key !== record.key)
            },
            onCloseInfoDrawer() {
                this.infoDrawer.visible = false
                this.infoDrawer.record = {}
            },
            onCloseEditDrawer() {
                this.editDrawer.visible = false
                this.editDrawer.record = {}
            }
        }
    }
</script>

<style scoped>

</style>
