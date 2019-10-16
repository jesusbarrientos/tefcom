<template>
    <div class="job-content">
        <a-row v-for="(e, index) of job.materials" type="flex" justify="space-between" align="bottom">
            <a-col :span="20">
                <a-row type="flex" :gutter="10" align="bottom">
                    <a-col :span="12">
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
                    </a-col>

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

                    <a-col :span="4">
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
                </a-row>
            </a-col>

            <a-col :span="4">
                <a-row type="flex" justify="end">
                    <a-button type="danger" @click="removeElement(index, job.materials)">
                        Eliminar
                    </a-button>
                </a-row>
            </a-col>

            <a-divider />
        </a-row>

        <a-row type="flex" justify="end" align="bottom" class="bottom-bar-button">
            <a-button type="primary" @click="addMaterial()">
                Agregar Material
            </a-button>
        </a-row>
    </div>
</template>

<script>
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
        methods: {
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

                if (e.material.include_iva)
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
                e.supplier = this.getFirstSupplierOfMaterial(e)
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
            }
        }
    }
</script>

<style scoped>

</style>
