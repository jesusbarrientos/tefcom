<template>
    <div class="job-content">
        <a-row v-for="(e, index) of job.materials" type="flex" justify="space-between" align="bottom">
            <a-col :span="24">
                <a-row type="flex" :gutter="10" align="bottom">
                    <a-col :span="24">
                        <label for="material">Material</label>
                        <a-select
                            id="material"
                            v-model="e.material.id"
                            show-search
                            placeholder="Seleccione un material"
                            option-filter-prop="children"
                            :filter-option="filterOption"
                            style="width: 100%; color: black"
                            disabled
                            @change="onSelectMaterial(e)"
                        >
                            <a-select-option v-for="material of data" :value="material.id">
                                {{ material.description }} | {{ material.category }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>

                <a-row type="flex" :gutter="10" align="bottom">
                    <!--<a-col :span="12">
                        <label for="material">Material</label>
                        <a-input-group id="material" compact>
                            <a-select
                                v-model="e.material.id"
                                show-search
                                placeholder="Seleccione un empleado"
                                option-filter-prop="children"
                                :filter-option="filterOption"
                                style="width: 60%"
                                @change="onSelectMaterial(e)"
                            >
                                <a-select-option v-for="material of getMaterialFilteredList(e)" :value="material.id">
                                    {{ material.description }} | {{ material.category }}
                                </a-select-option>
                            </a-select>

                            <a-select
                                v-model="e.supplier.id"
                                show-search
                                placeholder="Seleccione un proveedor"
                                option-filter-prop="children"
                                :filter-option="filterOption"
                                style="width: 40%"
                                @change="onSelectSupplier(e)"
                            >
                                <a-select-option v-for="supplier of getSupplierFilteredList(e)" :value="supplier.id">
                                    {{ supplier.name }} | {{ supplier.quality }}
                                </a-select-option>
                            </a-select>
                        </a-input-group>
                    </a-col>-->

                    <a-col :span="8">
                        <label for="price-count">Precio y Cantidad</label>
                        <a-input-group id="price-count" compact>
                            <a-input-number
                                :value="e.supplier.price"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                style="width: 50%; color: black"
                                disabled
                            />

                            <a-input-number v-model="e.count" :min="1" style="width: 50%" @change="setValue(e, 'count')" />
                        </a-input-group>
                    </a-col>

                    <a-col :span="5">
                        <label for="mat-total">Total</label>
                        <a-input-number
                            id="mat-total"
                            :value="calculateTotalOfMaterial(e)"
                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="2"
                            style="width: 100%; color: black"
                            disabled
                        />
                    </a-col>

                    <a-col :span="11">
                        <a-row type="flex" justify="end" align="bottom" style="margin: 0">
                            <a-button type="primary" style="margin-right: 5px" @click="openModalSelectMaterial(e)">
                                Seleccionar
                            </a-button>
                            <a-button type="danger" @click="removeElement(index, job.materials)">
                                Eliminar
                            </a-button>
                        </a-row>
                    </a-col>
                </a-row>
            </a-col>

            <a-divider />
        </a-row>

        <a-row type="flex" justify="end" align="bottom" class="bottom-bar-button">
            <a-button type="primary" @click="addMaterial()">
                Agregar Material
            </a-button>
        </a-row>

        <a-modal
            :visible="showModal"
            :centered="true"
            :footer="null"
            title="Selección de Material"
            wrap-class-name="modal-material"
            @cancel="closeModal()"
        >
            <a-table
                :columns="table.columns"
                :data-source="dataSource"
                :bordered="table.bordered"
                :loading="loadingData"
                :scroll="table.scroll"
                :pagination="table.pagination"
                :size="table.size"
                row-key="id"
            >
                <a-table
                    slot="expandedRowRender"
                    slot-scope="recordMaterial"
                    :columns="innerTable.columns"
                    :data-source="recordMaterial.suppliers"
                    :bordered="innerTable.bordered"
                    :pagination="innerTable.pagination"
                    :loading="innerTable.loading"
                    :size="innerTable.size"
                    row-key="id"
                >
                    <template slot="quality" slot-scope="record">
                        <label>{{ getQualityLabel(record) }}</label>
                    </template>

                    <template slot="price" slot-scope="record">
                        <label>${{ record.price }}</label>
                    </template>

                    <template slot="utility" slot-scope="record">
                        <label>{{ record.utility_percentaje }}%</label>
                    </template>

                    <template slot="total" slot-scope="record">
                        <label>${{ calculateTotal(record) }}</label>
                    </template>

                    <span slot="action" slot-scope="record">
                        <a @click="onSelectSupplierInDetail(record, recordMaterial)">Seleccionar</a>
                    </span>
                </a-table>
            </a-table>
        </a-modal>
    </div>
</template>

<script>

    const table = {
        bordered: false,
        loading: false,
        scroll: { x: '100%' },
        pagination: {
            defaultPageSize: 10,
            showSizeChanger: true,
            position: 'top'
        },
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
                filters: [],
                onFilter: (value, record) => record.category.indexOf(value) === 0,
                sorter: (a, b) => a.category.localeCompare(b.category)
            }
        ],
        innerColumns: [
            {
                title: 'Proveedor',
                key: 'supplier',
                dataIndex: 'description',
                sorter: (a, b) => a.description.localeCompare(b.description)
            },
            {
                title: 'Categoría',
                key: 'category',
                dataIndex: 'category',
                sorter: (a, b) => a.category.localeCompare(b.category)
            }
        ]
    }

    const options = [
        { key: 1, value: 'ECONÓMICO', label: 'Económico' },
        { key: 2, value: 'BAJA', label: 'Baja' },
        { key: 3, value: 'REGULAR', label: 'Regular' },
        { key: 4, value: 'BUENA', label: 'Buena' },
        { key: 5, value: 'RESISTENTE', label: 'Resistente' }
    ]

    export default {
        name: 'MaterialSection',
        props: {
            data: {
                required: true
            },
            job: {
                required: true
            }
        },
        data() {
            return {
                table,
                innerTable: {},
                showModal: false,
                loadingData: false,
                currentMaterial: undefined,
                dataSource: []
            }
        },
        created() {
            this.innerTable = {
                bordered: false,
                loading: false,
                scroll: { x: '100%' },
                pagination: false,
                size: 'default',
                columns: [
                    {
                        title: 'Nombre',
                        key: 'name',
                        dataIndex: 'name',
                        sorter: (a, b) => a.name.localeCompare(b.name),
                        width: '60%'
                    },
                    {
                        title: 'Calidad',
                        key: 'quality',
                        sorter: (a, b) => a.quality.localeCompare(b.quality),
                        filters: this.getQualityFilters(),
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
                        title: 'Acción',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
                        align: 'center',
                        scopedSlots: { customRender: 'action' }
                    }
                ],
                record: {}
            }
        },
        methods: {
            onSelectSupplierInDetail(record, recordMaterial) {
                this.currentMaterial.material = JSON.parse(JSON.stringify(recordMaterial)) // Genera clon
                this.currentMaterial.supplier = JSON.parse(JSON.stringify(record)) // Genera clon
                this.showModal = false
            },
            /**
             * Obtiene el nombre correspondiente al valor de la calidad (tema estético)
             * @param supplier proveedor
             * @returns {*} nombre de la calidad
             */
            getQualityLabel(supplier) {
                return options.find(option => option.value === supplier.quality).label
            },
            /**
             * Sirve para filtrar en la tabla de materiales por calidad
             * @returns {Array}
             */
            getQualityFilters() {
                const filters = []

                options.forEach((option) => {
                    filters.push({ text: option.label, value: option.value })
                })

                return filters
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
             * Agrega una fila de material para poder exportar con la cotización.
             */
            addMaterial() {
                const material = this.getFirstMaterialOfFilteredList()
                const supplier = material ? this.getSupplierFilteredListOfMaterial(material)[0] : null

                if (material && supplier) {
                    this.job.materials.push({
                        material: JSON.parse(JSON.stringify(material)),
                        supplier: JSON.parse(JSON.stringify(supplier)),
                        count: 1,
                        total: 0
                    })
                }
            },
            /**
             * Obtiene el primer elemento de la lista.
             */
            getFirstMaterialOfFilteredList() {
                const list = this.getAllMaterialFilteredList()
                return list.length > 0 ? list[0] : null
            },
            /**
             * Busca si existe o no material en lista.
             * @param id
             */
            existMaterialInList(id) {
                const e = this.job.materials.find(e => (e.material.id === id))
                return !!e
            },
            /**
             * Calcula el total del material actual.
             */
            calculateTotalOfMaterial(e) {
                let total = 0

                if (e.supplier.include_iva)
                    total = (e.count * e.supplier.price)
                else
                    total = (e.count * (e.supplier.price * 1.19))

                e.total = parseFloat(total.toFixed(2))

                return e.total
            },
            /**
             * Filtra lista de materiales con los que no se han seleccionado aún sus proveedores, excluye el actual seleccionado.
             */
            getMaterialFilteredList(m) {
                return this.data.filter((e) => {
                    if (e.id !== m.material.id)
                        return !this.areAllSuppliersSelected(e)
                    else
                        return true
                })
            },
            /**
             * Filtra lista de materiales con los que no se han seleccionado aún sus proveedores.
             */
            getAllMaterialFilteredList() {
                return this.data.filter((e) => {
                    return !this.areAllSuppliersSelected(e)
                })
            },
            /**
             * Filtra lista de proveedores con los que no se han seleccionado aún.
             */
            getSupplierFilteredList(e) {
                return e.material.suppliers.filter((s) => {
                    if (s.id !== e.supplier.id)
                        return !this.isSupplierUsed(s)
                    else
                        return true
                })
            },
            /**
             * Filtra lista de proveedores con los que no se han seleccionado aún.
             */
            getSupplierFilteredListOfMaterial(m) {
                return m.suppliers.filter((s) => {
                    return !this.isSupplierUsed(s)
                })
            },
            /**
             * Revisa si el proveedor ya ha sido ocupado anteriormente.
             */
            isSupplierUsed(s) {
                let exist = false

                for (const e of this.job.materials) {
                    if (e.supplier.id === s.id) {
                        exist = true
                        break
                    }
                }

                return exist
            },
            /**
             * Revisa si todos los proveedores se han seleccionado.
             */
            areAllSuppliersSelected(m) {
                let flag = true

                for (const s of m.suppliers) {
                    let exist = false

                    for (const e of this.job.materials) {
                        if (e.supplier.id === s.id) {
                            exist = true
                            break
                        }
                    }

                    if (!exist) {
                        flag = false
                        break
                    }
                }

                return flag
            },
            /**
             * Al seleccionar un material, se configuran los atributos.
             * @param e material
             */
            onSelectMaterial(e) {
                e.material = JSON.parse(JSON.stringify(this.getMaterial(e.material.id))) // Genera clon
                // e.supplier = this.getFirstSupplierOfMaterial(e)
            },
            /**
             * Obtiene el primer proveedor del material.
             * @param e
             */
            getFirstSupplierOfMaterial(e) {
                return JSON.parse(JSON.stringify(this.getSupplierFilteredList(e)[0]))
            },
            /**
             * Al seleccionar un proveedor, se configuran los atributos.
             * @param e supplier
             */
            onSelectSupplier(e) {
                e.supplier = JSON.parse(JSON.stringify(this.getSupplier(e.supplier.id, e.material))) // Genera clon
            },
            /**
             * Obtiene material del data según el id.
             * @param id
             */
            getMaterial(id) {
                const material = this.data.find(e => e.id === id)
                return material || {}
            },
            /**
             * Obtiene proveedor del data según el id.
             * @param id
             * @param material
             */
            getSupplier(id, material) {
                const supplier = this.getMaterial(material.id).suppliers.find(e => e.id === id)
                return supplier || {}
            },
            /**
             * Quita un material de la lista para exportar (job).
             */
            removeElement(index, list) {
                list.splice(index, 1)
            },
            /**
             * Sirve para mostrar sólo las coincidencias cuando se escribe en el select.
             */
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            setValue(e, attr) {
                switch (attr) {
                    case 'count': {
                        if (!e.count)
                            e.count = 1
                        break
                    }
                }
            },
            openModalSelectMaterial(e) {
                this.dataSource = this.getAllMaterialFilteredList(e)
                this.setOptionsCategory()
                this.currentMaterial = e
                this.showModal = true
            },
            closeModal() {
                this.showModal = false
            },
            setOptionsCategory() {
                let options = []

                this.dataSource.forEach((e, key) => {
                    let exists = options.find((o) => { return o.value === e.category })

                    if (!exists) {
                        options.push({
                            key,
                            value: e.category,
                            text: e.category
                        })
                    }
                })

                table.columns[1].filters = options
            }
        }
    }
</script>

<style scoped>

</style>
