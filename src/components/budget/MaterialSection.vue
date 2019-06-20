<template>
    <div>
        <a-row v-for="(e, index) of budget.materials" type="flex" justify="space-between">
            <a-col :span="20">
                <a-row type="flex" :gutter="10">
                    <a-col :span="8">
                        <a-select
                            v-model="e.material.id"
                            show-search
                            placeholder="Seleccione un empleado"
                            option-filter-prop="children"
                            :filter-option="filterOption"
                            style="width: 100%"
                            @change="onSelectMaterial(e)"
                        >
                            <a-select-option v-for="material of getMaterialFilteredList(e)" :value="material.id">
                                {{ material.description }} | {{ material.category }}
                            </a-select-option>
                        </a-select>
                    </a-col>

                    <a-col :span="6">
                        <a-select
                            v-model="e.supplier.id"
                            show-search
                            placeholder="Seleccione un proveedor"
                            option-filter-prop="children"
                            :filter-option="filterOption"
                            style="width: 100%"
                            @change="onSelectSupplier(e)"
                        >
                            <a-select-option v-for="supplier of getSupplierFilteredList(e)" :value="supplier.id">
                                {{ supplier.name }} | {{ supplier.quality }}
                            </a-select-option>
                        </a-select>
                    </a-col>

                    <a-col :span="5">
                        <a-tooltip>
                            <template slot="title">
                                Cantidad
                            </template>
                            <a-input-number v-model="e.count" :min="1" style="width: 100%" />
                        </a-tooltip>
                    </a-col>

                    <a-col :span="5">
                        <a-tooltip>
                            <template slot="title">
                                Precio en el momento. Sirve para llevar registro del valor en el momento en que se hizo la cotización.
                            </template>
                            <a-input-number
                                :value="e.supplier.price"
                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                style="width: 100%; color: black"
                                disabled
                            />
                        </a-tooltip>
                    </a-col>
                </a-row>
            </a-col>

            <a-button type="danger" @click="removeElement(index, budget.materials)">
                Eliminar
            </a-button>
        </a-row>

        <a-row type="flex" justify="space-between" align="bottom">
            <a-col :span="5">
                <label for="total-material">Subtotal</label>
                <a-input-number
                    id="total-material"
                    :value="calculateTotalMaterials()"
                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    style="width: 100%; color: black"
                    disabled
                />
            </a-col>

            <a-col :lg="{ span: 8 }" :xl="{ span: 5 }">
                <a-button type="primary" block @click="addMaterial()">
                    Agregar Material
                </a-button>
            </a-col>
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
            budget: {
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
                    this.budget.materials.push({
                        material: JSON.parse(JSON.stringify(material)),
                        supplier: JSON.parse(JSON.stringify(supplier)),
                        count: 1
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
                const e = this.budget.materials.find(e => (e.material.id === id))
                return !!e
            },
            /**
             * Calcula el total de los materiales seleccionados.
             * @returns {number}
             */
            calculateTotalMaterials() {
                let total = 0
                this.budget.materials.forEach((m) => {
                    total += m.supplier.price * m.count
                })
                this.budget.subtotal.materials = total
                return total
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

                for (const e of this.budget.materials) {
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

                    for (const e of this.budget.materials) {
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
                this.calculateTotalMaterials()
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
                this.calculateTotalMaterials()
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
             * Quita un material de la lista para exportar (budget).
             */
            removeElement(index, list) {
                list.splice(index, 1)
            },
            /**
             * Sirve para mostrar sólo las coincidencias cuando se escribe en el select.
             */
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        }
    }
</script>

<style scoped>

</style>
