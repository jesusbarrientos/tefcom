<template>
    <div id="material-page-desktop">
        <!--REGISTER & LIST MATERIALS-->
        <a-row type="flex" justify="center">
            <a-col :sm="{ span: 24 }" :xxl="{ span: 20 }">
                <a-card title="Materiales" :bordered="false" class="materials-card">
                    <a-spin tip="Registrando..." :spinning="visibleSpin">
                        <div class="new-material">

                            <h3>Nuevo Material</h3>

                            <a-form :form="formAdd" layout="vertical" @submit="addMaterial">
                                <a-row :gutter="10">
                                    <a-col :span="12">
                                        <a-form-item :label="fields.description.label" :extra="fields.description.extra" :required="fields.description.required">
                                            <a-input v-decorator="fields.description.decorator" :placeholder="fields.description.placeholder" />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="12">
                                        <a-form-item :label="fields.category.label" :extra="fields.category.extra" :required="fields.category.required">
                                            <a-input v-decorator="fields.category.decorator" :placeholder="fields.category.placeholder" />
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row>
                                    <a-collapse>
                                        <a-collapse-panel header="Proveedores">

                                            <a-row>
                                                <a-col>
                                                    <a-row v-for="(supplier, index) of newMaterial.suppliers" :gutter="10" type="flex" align="bottom">
                                                        <a-col :span="5">
                                                            <label for="supplier_name">Nombre Proveedor</label>
                                                            <a-input id="supplier_name" v-model="supplier.name" placeholder="Nombre Proveedor" />
                                                        </a-col>

                                                        <a-col :span="5">
                                                            <label for="quality">Calidad</label>
                                                            <a-select id="quality" v-model="supplier.quality" :default-value="materials.options[0].value">
                                                                <a-select-option v-for="option of materials.options" :value="option.value">
                                                                    {{ option.label }}
                                                                </a-select-option>
                                                            </a-select>
                                                        </a-col>

                                                        <a-col :span="4">
                                                            <a-tooltip>
                                                                <template slot="title">
                                                                    El precio se debe expresar en Pesos Chilenos (CLP).
                                                                </template>
                                                                <label for="price">Precio</label>
                                                                <a-input-number
                                                                    id="price"
                                                                    v-model="supplier.price"
                                                                    :default-value="0"
                                                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                                    :precision="2"
                                                                />
                                                            </a-tooltip>
                                                        </a-col>

                                                        <a-col :span="3">
                                                            <a-tooltip>
                                                                <template slot="title">
                                                                    ¿El precio incluye IVA?
                                                                </template>
                                                                <label for="iva">IVA</label>
                                                                <a-select id="iva" v-model="supplier.include_iva" :default-value="false">
                                                                    <a-select-option :value="true">
                                                                        Si
                                                                    </a-select-option>

                                                                    <a-select-option :value="false">
                                                                        No
                                                                    </a-select-option>
                                                                </a-select>
                                                            </a-tooltip>
                                                        </a-col>

                                                        <a-col :span="4">
                                                            <label for="total-value">Total</label>
                                                            <a-input-number
                                                                id="total-value"
                                                                :value="calculateTotal(supplier)"
                                                                :default-value="0"
                                                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                                :precision="2"
                                                                disabled
                                                                style="color: black"
                                                            />
                                                        </a-col>

                                                        <a-col :span="3">
                                                            <a-button type="danger" @click="deleteSupplier(index, newMaterial.suppliers)">
                                                                Eliminar
                                                            </a-button>
                                                        </a-col>
                                                    </a-row>

                                                    <a-row type="flex" justify="start">
                                                        <a-button type="primary" class="add-material-button" @click="addSupplier">
                                                            Agregar Proveedor
                                                        </a-button>
                                                    </a-row>
                                                </a-col>
                                            </a-row>

                                        </a-collapse-panel>
                                    </a-collapse>
                                </a-row>

                                <a-row type="flex" justify="end" :gutter="10" style="margin-top: 20px">
                                    <a-col :span="6">
                                        <a-button type="primary" html-type="submit" block>
                                            Registrar Material
                                        </a-button>
                                    </a-col>
                                </a-row>
                            </a-form>
                        </div>
                    </a-spin>

                    <a-table
                        :columns="materials.table.columns"
                        :data-source="data"
                        :bordered="materials.table.bordered"
                        :loading="loadingData"
                        :scroll="materials.table.scroll"
                        :pagination="materials.table.pagination"
                        :size="materials.table.size"
                        row-key="id"
                        position="bottom"
                    >
                        <span slot="action" slot-scope="record">
                            <a @click="onShowMore(record)">Ficha</a>

                            <a-divider type="vertical" />

                            <a @click="onEdit(record)">Editar</a>

                            <a-divider type="vertical" />

                            <a-popconfirm title="¿Estás seguro de querer eliminar este material?" @confirm="onDelete(record)">
                                <a>Eliminar</a>
                            </a-popconfirm>
                        </span>
                    </a-table>
                </a-card>
            </a-col>
        </a-row>

        <!--INFO MATERIAL-->
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
                        Datos Generales
                    </a-divider>

                    <div style="display: grid">
                        <span>
                            <b>Descripción:</b>
                            <label>{{ infoDrawer.record.description }}</label>
                        </span>

                        <span>
                            <b>Categoría:</b>
                            <label>{{ infoDrawer.record.category }}</label>
                        </span>
                    </div>

                    <a-divider orientation="left">
                        Proveedores
                    </a-divider>

                    <a-table
                        :columns="infoDrawer.table.columns"
                        :data-source="infoDrawer.record.suppliers"
                        :bordered="infoDrawer.table.bordered"
                        :pagination="infoDrawer.table.pagination"
                        :loading="infoDrawer.table.loading"
                    >
                        <template slot="quality" slot-scope="record">
                            <label>{{ getQualityLabel(record) }}</label>
                        </template>

                        <template slot="price" slot-scope="record">
                            <label>${{ record.price }}</label>
                        </template>

                        <template slot="includeIva" slot-scope="record">
                            <label>{{ includeIva(record) }}</label>
                        </template>

                        <template slot="utility" slot-scope="record">
                            <label>{{ record.utility_percentaje }}%</label>
                        </template>

                        <template slot="total" slot-scope="record">
                            <label>${{ calculateTotal(record) }}</label>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-drawer>

        <!--EDIT MATERIAL-->
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
            <a-spin tip="Modificando..." :spinning="visibleSpinEdit">
                <a-row type="flex" justify="center" :gutter="16">
                    <a-col :span="24">
                        <a-form :form="formEdit" layout="vertical" @submit="editMaterial">
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item :label="fields.description.label" :extra="fields.description.extra" :required="fields.description.required">
                                        <a-input v-decorator="fields.description.decorator" :placeholder="fields.description.placeholder" disabled style="color: black" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="12">
                                    <a-form-item :label="fields.category.label" :extra="fields.category.extra" :required="fields.category.required">
                                        <a-input v-decorator="fields.category.decorator" :placeholder="fields.category.placeholder" disabled style="color: black" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row>
                                <a-collapse>
                                    <a-collapse-panel header="Proveedores">

                                        <a-row>
                                            <a-col>
                                                <a-row v-for="(supplier, index) of editDrawer.record.suppliers" :gutter="10" type="flex" align="bottom">
                                                    <a-col :span="5">
                                                        <label for="edit_supplier_name">Nombre Proveedor</label>
                                                        <a-input id="edit_supplier_name" v-model="supplier.name" placeholder="Nombre Proveedor" />
                                                    </a-col>

                                                    <a-col :span="5">
                                                        <label for="edit_quality">Calidad</label>
                                                        <a-select id="edit_quality" v-model="supplier.quality" :default-value="materials.options[0].value">
                                                            <a-select-option v-for="option of materials.options" :value="option.value">
                                                                {{ option.label }}
                                                            </a-select-option>
                                                        </a-select>
                                                    </a-col>

                                                    <a-col :span="4">
                                                        <a-tooltip>
                                                            <template slot="title">
                                                                El precio se debe expresar en Pesos Chilenos (CLP).
                                                            </template>
                                                            <label for="edit_price">Precio</label>
                                                            <a-input-number
                                                                id="edit_price"
                                                                v-model="supplier.price"
                                                                :default-value="0"
                                                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                            />
                                                        </a-tooltip>
                                                    </a-col>

                                                    <a-col :span="3">
                                                        <a-tooltip>
                                                            <template slot="title">
                                                                ¿El precio incluye IVA?
                                                            </template>
                                                            <label for="edit_iva">IVA</label>
                                                            <a-select id="edit_iva" v-model="supplier.include_iva" :default-value="false">
                                                                <a-select-option :value="true">
                                                                    Si
                                                                </a-select-option>

                                                                <a-select-option :value="false">
                                                                    No
                                                                </a-select-option>
                                                            </a-select>
                                                        </a-tooltip>
                                                    </a-col>

                                                    <a-col :span="4">
                                                        <label for="edit_total-value">Total</label>
                                                        <a-input-number
                                                            id="edit_total-value"
                                                            :value="calculateTotal(supplier)"
                                                            :default-value="0"
                                                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                            :precision="2"
                                                            disabled
                                                            style="color: black"
                                                        />
                                                    </a-col>

                                                    <a-col :span="3">
                                                        <a-button type="danger" @click="deleteSupplier(index, editDrawer.record.suppliers)">
                                                            Eliminar
                                                        </a-button>
                                                    </a-col>
                                                </a-row>

                                                <a-row type="flex" justify="start">
                                                    <a-button type="primary" class="add-material-button" @click="addEditSupplier">
                                                        Agregar Proveedor
                                                    </a-button>
                                                </a-row>
                                            </a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                            </a-row>

                            <a-row type="flex" justify="end" :gutter="10" style="margin-top: 20px">
                                <a-col :span="6">
                                    <a-button type="primary" html-type="submit" block>
                                        Modificar
                                    </a-button>
                                </a-col>

                                <a-col :span="6">
                                    <a-button type="danger" class="delete-material-button" block @click="onCloseEditDrawer">
                                        Cancelar
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-form>
                    </a-col>
                </a-row>
            </a-spin>
        </a-drawer>
    </div>
</template>

<script>
    import AFormItem from 'ant-design-vue/es/form/FormItem'

    const materialDesktop = {
        name: 'MaterialDesktop',
        components: { AFormItem },
        props: {
            data: {
                required: true
            },
            events: {
                required: true
            },
            loadingData: {
                required: true
            }
        },
        data() {
            return {
                fields,
                materials,
                newMaterial,
                infoDrawer,
                editDrawer,
                visibleSpin: false,
                visibleSpinEdit: false
            }
        },
        beforeCreate() {
            this.formAdd = this.$form.createForm(this)
            this.formEdit = this.$form.createForm(this)
        },
        methods: {
            /**
             * Agrega una nueva fila para un proveedor del material a registrar.
             */
            addSupplier() {
                const currentDate = new Date()
                const date = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + '/' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ':' + currentDate.getMilliseconds()
                const id = `SUP-${date}`
                this.newMaterial.suppliers.push({ id: id, name: '', quality: this.materials.options[0].value, price: 1, include_iva: false })
            },
            /**
             * Agrega una nueva fila para un proveedor del material a modificar.
             */
            addEditSupplier() {
                const currentDate = new Date()
                const date = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + '/' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ':' + currentDate.getMilliseconds()
                const id = `SUP-${date}`
                this.editDrawer.record.suppliers.push({ id: id, name: '', quality: this.materials.options[0].value, price: 1, include_iva: false })
            },
            /**
             * Elimina proveedor de la lista para el material.
             * @param index índice del proveedor
             * @param suppliers lista de proveedores
             */
            deleteSupplier(index, suppliers) {
                suppliers.splice(index, 1)
            },
            /**
             * Cambia valor del check para saber si incluye o no IVA el precio del material.
             * @param $event evento que se gatilla, trae valor de verdad
             * @param supplier proveedor
             */
            changeIva($event, supplier) {
                supplier.include_iva = $event.target.checked
            },
            /**
             * Calcula el total del proveedor
             * @param supplier proveedor
             * @returns {number|*} precio final
             */
            calculateTotal(supplier) {
                if (supplier.include_iva)
                    return supplier.price.toFixed(2)
                else
                    return (supplier.price * 1.19).toFixed(2)
            },
            /**
             * Retorna si o no dependiendo de si incluye o no IVA (tema estético)
             * @param supplier proveedor
             * @returns {string} si o no
             */
            includeIva(supplier) {
                if (supplier.include_iva)
                    return 'Si'
                else
                    return 'No'
            },
            /**
             * Obtiene el nombre correspondiente al valor de la calidad (tema estético)
             * @param supplier proveedor
             * @returns {*} nombre de la calidad
             */
            getQualityLabel(supplier) {
                return materials.options.find(option => option.value === supplier.quality).label
            },
            /**
             * Sirve para filtrar en la tabla de materiales por calidad
             * @returns {Array}
             */
            getQualityFilters() {
                const filters = []

                materials.options.forEach((option) => {
                    filters.push({ text: option.label, value: option.value })
                })

                return filters
            },
            /**
             * Muestra drawer de información
             * @param record material seleccionado en la tabla
             */
            onShowMore(record) {
                this.infoDrawer.record = record
                this.infoDrawer.visible = true
            },
            /**
             * Muestra drawer para editar material
             * @param record material seleccionado en la tabla
             */
            onEdit(record) {
                const cloneRecord = JSON.parse(JSON.stringify(record))
                this.editDrawer.record = cloneRecord
                this.editDrawer.visible = true

                setTimeout(() => {
                    this.formEdit.setFieldsValue({
                        description: cloneRecord.description,
                        category: cloneRecord.category
                    })
                }, 100)
            },
            /**
             * Elimina material
             * @param record
             */
            onDelete(record) {
                const body = {
                    description: record.description,
                    category: record.category
                }

                this.$emit('emit', { type: this.events.DELETE, body: body })
            },
            /**
             * Cierra drawer de información
             */
            onCloseInfoDrawer() {
                this.infoDrawer.visible = false
                this.infoDrawer.record = {}
            },
            /**
             * Cierra drawer para editar material
             */
            onCloseEditDrawer() {
                this.editDrawer.visible = false
                this.editDrawer.record = {}
            },
            /**
             * Agrega un nuevo material
             */
            addMaterial($event) {
                $event.preventDefault()

                this.formAdd.validateFields((error) => {
                    if (!error) {
                        this.visibleSpin = true

                        const material = {
                            description: this.formAdd.getFieldValue('description'),
                            category: this.formAdd.getFieldValue('category'),
                            suppliers: []
                        }

                        // Agrega solo los proveedores que tienen al menos un nombre
                        newMaterial.suppliers.forEach((s) => {
                            if (s.name && s.name !== '')
                                material.suppliers.push(s)
                        })

                        const params = {
                            type: this.events.CREATE,
                            body: material,
                            callback: (promise) => {
                                promise
                                    // En caso de ser registrado correctamente
                                    .then(() => {
                                        this.formAdd.resetFields()
                                        this.newMaterial.suppliers = []
                                    })
                                    .finally(() => {
                                        this.visibleSpin = false
                                    })
                            }
                        }

                        this.$emit('emit', params)
                    }
                })
            },
            /**
             * Editar un material
             */
            editMaterial($event) {
                $event.preventDefault()

                this.formEdit.validateFields((error) => {
                    if (!error) {
                        this.visibleSpinEdit = true

                        const material = {
                            description: this.formEdit.getFieldValue('description'),
                            category: this.formEdit.getFieldValue('category'),
                            suppliers: []
                        }

                        // Agrega solo los proveedores que tienen al menos un nombre
                        this.editDrawer.record.suppliers.forEach((s) => {
                            if (s.name && s.name !== '')
                                material.suppliers.push(s)
                        })

                        const params = {
                            type: this.events.EDIT,
                            body: material,
                            callback: (promise) => {
                                promise
                                    // En caso de ser modificado correctamente
                                    .then(() => {
                                        this.formEdit.resetFields()
                                        this.editDrawer.record.suppliers = []
                                    })
                                    .finally(() => {
                                        this.visibleSpinEdit = false
                                    })
                            }
                        }

                        this.$emit('emit', params)
                    }
                })
            }
        }
    }

    const fields = {
        description: {
            label: 'Descripción',
            required: true,
            extra: '',
            placeholder: 'Descripción',
            decorator: [
                'description',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese una descripción.' }
                    ]
                }
            ]
        },
        category: {
            label: 'Categoría',
            required: true,
            extra: '',
            placeholder: 'Categoría',
            decorator: [
                'category',
                {
                    initialValue: undefined,
                    rules: [
                        { required: true, message: 'Ingrese una categoría.' }
                    ]
                }
            ]
        }
    }
    const materials = {
        options: [
            { key: 1, value: 'ECONÓMICO', label: 'Económico' },
            { key: 2, value: 'BAJA', label: 'Baja' },
            { key: 3, value: 'REGULAR', label: 'Regular' },
            { key: 4, value: 'BUENA', label: 'Buena' },
            { key: 5, value: 'RESISTENTE', label: 'Resistente' }
        ],
        table: {
            bordered: true,
            loading: false,
            scroll: { x: '100%' },
            pagination: { pageSize: 7 },
            size: 'default',
            columns: [
                {
                    title: 'Descripción',
                    key: 'description',
                    dataIndex: 'description',
                    sorter: (a, b) => a.description.localeCompare(b.description)
                },
                {
                    title: 'Categoría',
                    key: 'category',
                    dataIndex: 'category',
                    sorter: (a, b) => a.category.localeCompare(b.category)
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
    const newMaterial = {
        description: '',
        category: '',
        suppliers: []
    }
    const infoDrawer = {
        title: 'Datos del Material',
        visible: false,
        closable: true,
        placement: 'right',
        width: 660,
        record: {},
        table: {
            bordered: true,
            loading: false,
            scroll: { x: '100%' },
            pagination: { pageSize: 7 },
            size: 'default',
            columns: [
                {
                    title: 'Nombre',
                    key: 'name',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.localeCompare(b.name)
                },
                {
                    title: 'Calidad',
                    key: 'quality',
                    sorter: (a, b) => a.quality.localeCompare(b.quality),
                    filters: materialDesktop.methods.getQualityFilters(),
                    onFilter: (value, record) => record.quality.indexOf(value) === 0,
                    scopedSlots: { customRender: 'quality' }
                },
                {
                    title: 'Precio',
                    key: 'price',
                    sorter: (a, b) => a.price - b.price,
                    scopedSlots: { customRender: 'price' }
                },
                {
                    title: 'IVA',
                    key: 'includeIva',
                    align: 'center',
                    scopedSlots: { customRender: 'includeIva' }
                },
                {
                    title: 'Total',
                    key: 'total',
                    sorter: (a, b) => materialDesktop.methods.calculateTotal(a) - materialDesktop.methods.calculateTotal(b),
                    scopedSlots: { customRender: 'total' }
                }
            ]
        }
    }
    const editDrawer = {
        title: 'Editar Material',
        visible: false,
        closable: false,
        placement: 'right',
        width: 760,
        wrapClassName: 'material-page-desktop-drawer-edit',
        record: {}
    }

    export default materialDesktop
</script>

<style scoped>

</style>
