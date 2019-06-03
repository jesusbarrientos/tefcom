<template>
    <div id="material-page-desktop">
        <!--REGISTER & LIST MATERIALS-->
        <a-row type="flex" justify="center" :gutter="16">
            <a-col :span="16">
                <a-card title="Materiales" :bordered="false" class="materials-card">
                    <div class="new-material">

                        <h3>Nuevo Material</h3>

                        <a-form :form="formAdd" layout="vertical">
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item>
                                        <a-input placeholder="Descripción" />
                                    </a-form-item>
                                </a-col>

                                <a-col :span="12">
                                    <a-form-item>
                                        <a-input placeholder="Categoría" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row>
                                <a-collapse>
                                    <a-collapse-panel header="Proveedores">

                                        <a-row>
                                            <a-col>
                                                <p><a-icon type="info-circle" /> Todo precio debe ser expresado en Pesos Chilenos (CLP).</p>

                                                <a-row v-for="(supplier, index) of newMaterial.suppliers" :gutter="10" type="flex" align="middle">
                                                    <a-button
                                                        type="danger"
                                                        shape="circle"
                                                        size="small"
                                                        icon="minus"
                                                        class="delete-material-button"
                                                        @click="deleteSupplier(index, newMaterial.suppliers)"
                                                    />

                                                    <a-col :span="4">
                                                        <a-input v-model="supplier.name" placeholder="Nombre Proveedor" />
                                                    </a-col>

                                                    <a-col :span="4">
                                                        <a-select v-model="supplier.quality" :default-value="materials.options[0].value">
                                                            <a-select-option v-for="option of materials.options" :value="option.value">
                                                                {{ option.label }}
                                                            </a-select-option>
                                                        </a-select>
                                                    </a-col>

                                                    <a-col :span="4">
                                                        <a-tooltip>
                                                            <template slot="title">
                                                                Precio del material.
                                                            </template>
                                                            <a-input-number
                                                                v-model="supplier.price"
                                                                :default-value="0"
                                                                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                            />
                                                        </a-tooltip>
                                                    </a-col>

                                                    <a-tooltip>
                                                        <template slot="title">
                                                            IVA Incluido. Esto cambia el valor total del material.
                                                        </template>
                                                        <a-checkbox @change="changeIva($event, supplier)">
                                                            IVA
                                                        </a-checkbox>
                                                    </a-tooltip>

                                                    <a-col :span="3">
                                                        <a-tooltip>
                                                            <template slot="title">
                                                                Porcentaje de utilidad sobre el precio del material.
                                                            </template>
                                                            <a-input-number
                                                                v-model="supplier.utilityPercentaje"
                                                                :default-value="100"
                                                                :min="0"
                                                                :formatter="value => `${value}%`"
                                                                :parser="value => value.replace('%', '')"
                                                            />
                                                        </a-tooltip>
                                                    </a-col>

                                                    <a-col :span="5">
                                                        <label>Total: ${{ calculateTotal(supplier) }}</label>
                                                    </a-col>
                                                </a-row>

                                                <a-row type="flex" justify="center">
                                                    <a-button type="primary" class="add-material-button" @click="addSupplier">
                                                        Agregar Proveedor
                                                    </a-button>
                                                </a-row>
                                            </a-col>
                                        </a-row>

                                    </a-collapse-panel>
                                </a-collapse>
                            </a-row>

                            <a-row>
                                <a-button type="primary" block>
                                    Registrar
                                </a-button>
                            </a-row>
                        </a-form>
                    </div>

                    <a-table
                        :columns="materials.table.columns"
                        :data-source="materials.data"
                        :bordered="materials.table.bordered"
                        :loading="materials.table.loading"
                        :scroll="materials.table.scroll"
                        :pagination="materials.table.pagination"
                        :size="materials.table.size"
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
                            <label>{{ record.utilityPercentaje }}%</label>
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
            @close="onCloseEditDrawer"
        >
            <a-row type="flex" justify="center" :gutter="16">
                <a-col :span="24">
                    <a-form :form="formEdit" layout="vertical">
                        <a-row :gutter="10">
                            <a-col :span="12">
                                <a-form-item>
                                    <a-input placeholder="Descripción" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="12">
                                <a-form-item>
                                    <a-input placeholder="Categoría" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-collapse>
                                <a-collapse-panel header="Proveedores">

                                    <a-row>
                                        <a-col>
                                            <p><a-icon type="info-circle" /> Todo precio debe ser expresado en Pesos Chilenos (CLP).</p>

                                            <a-row v-for="(supplier, index) of editDrawer.record.suppliers" :gutter="10" type="flex" align="middle">
                                                <a-button
                                                    type="danger"
                                                    shape="circle"
                                                    size="small"
                                                    icon="minus"
                                                    class="delete-material-button"
                                                    @click="deleteSupplier(index, editDrawer.record.suppliers)"
                                                />

                                                <a-col :span="4">
                                                    <a-input v-model="supplier.name" placeholder="Nombre Proveedor" />
                                                </a-col>

                                                <a-col :span="4">
                                                    <a-select v-model="supplier.quality" :default-value="materials.options[0].value">
                                                        <a-select-option v-for="option of materials.options" :value="option.value">
                                                            {{ option.label }}
                                                        </a-select-option>
                                                    </a-select>
                                                </a-col>

                                                <a-col :span="4">
                                                    <a-tooltip>
                                                        <template slot="title">
                                                            Precio del material.
                                                        </template>
                                                        <a-input-number
                                                            v-model="supplier.price"
                                                            :default-value="0"
                                                            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                                            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                                        />
                                                    </a-tooltip>
                                                </a-col>

                                                <a-tooltip>
                                                    <template slot="title">
                                                        IVA Incluido. Esto cambia el valor total del material.
                                                    </template>
                                                    <a-checkbox @change="changeIva($event, supplier)">
                                                        IVA
                                                    </a-checkbox>
                                                </a-tooltip>

                                                <a-col :span="3">
                                                    <a-tooltip>
                                                        <template slot="title">
                                                            Porcentaje de utilidad sobre el precio del material.
                                                        </template>
                                                        <a-input-number
                                                            v-model="supplier.utilityPercentaje"
                                                            :default-value="100"
                                                            :min="0"
                                                            :formatter="value => `${value}%`"
                                                            :parser="value => value.replace('%', '')"
                                                        />
                                                    </a-tooltip>
                                                </a-col>

                                                <a-col :span="5">
                                                    <label>Total: ${{ calculateTotal(supplier) }}</label>
                                                </a-col>
                                            </a-row>

                                            <a-row type="flex" justify="center">
                                                <a-button type="primary" class="add-material-button" @click="addSupplier">
                                                    Agregar Proveedor
                                                </a-button>
                                            </a-row>
                                        </a-col>
                                    </a-row>

                                </a-collapse-panel>
                            </a-collapse>
                        </a-row>

                        <a-row>
                            <a-button type="primary" block>
                                Registrar
                            </a-button>
                        </a-row>

                        <a-row>
                            <a-button type="danger" class="delete-material-button" @click="onCloseEditDrawer" block>
                                Cancelar
                            </a-button>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
        </a-drawer>
    </div>
</template>

<script>
    import AFormItem from 'ant-design-vue/es/form/FormItem'

    const materialDesktop = {
        name: 'MaterialDesktop',
        components: { AFormItem },
        data() {
            return {
                materials,
                newMaterial,
                infoDrawer,
                editDrawer
            }
        },
        beforeCreate() {
            this.formAdd = this.$form.createForm(this)
            this.formEdit = this.$form.createForm(this)
        },
        methods: {
            addSupplier() {
                this.newMaterial.suppliers.push({ name: '', quality: this.materials.options[0].value, price: 0, includeIva: false, utilityPercentaje: 100 })
            },
            deleteSupplier(index, suppliers) {
                suppliers.splice(index, 1)
            },
            changeIva($event, supplier) {
                supplier.includeIva = $event.target.checked
            },
            calculateTotal(supplier) {
                if (supplier.includeIva)
                    return supplier.price + (supplier.price * (supplier.utilityPercentaje / 100))
                else
                    return (supplier.price * 1.19) + ((supplier.price * 1.19) * (supplier.utilityPercentaje / 100))
            },
            includeIva(supplier) {
                if (supplier.includeIva)
                    return 'Si'
                else
                    return 'No'
            },
            getQualityLabel(supplier) {
                return materials.options.find(option => option.value === supplier.quality).label
            },
            getQualityFilters() {
                const filters = []

                materials.options.forEach((option) => {
                    filters.push({ text: option.label, value: option.value })
                })

                return filters
            },
            onShowMore(record) {
                this.infoDrawer.record = record
                this.infoDrawer.visible = true
            },
            onEdit(record) {
                this.editDrawer.record = JSON.parse(JSON.stringify(record))
                this.editDrawer.visible = true
            },
            onDelete(record) {
                const data = [...this.materials.data]
                this.materials.data = data.filter(item => item.key !== record.key)
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

    const materials = {
        data: [{
            'key': 1,
            'description': 'Broken',
            'category': 'Horror|Thriller',
            suppliers: [
                { name: 'Hola', quality: 'BUENA', price: 1, includeIva: true, utilityPercentaje: 200 },
                { name: 'Chao', quality: 'ECONÓMICO', price: 100, includeIva: false, utilityPercentaje: 100 },
                { name: 'Alo', quality: 'RESISTENTE', price: 3580, includeIva: true, utilityPercentaje: 75 }
            ]
        }, {
            'key': 2,
            'description': 'Breakaway (Speedy Singhs)',
            'category': 'Comedy|Drama'
        }, {
            'key': 3,
            'description': 'Shepard & Dark',
            'category': 'Documentary'
        }, {
            'key': 4,
            'description': 'Dazed and Confused',
            'category': 'Comedy'
        }, {
            'key': 5,
            'description': 'Bad Asses (Bad Ass 2)',
            'category': 'Action|Drama'
        }, {
            'key': 6,
            'description': 'Rehearsals for Extinct Anatomies',
            'category': 'Animation'
        }, {
            'key': 7,
            'description': 'Audition (Konkurs)',
            'category': 'Documentary'
        }, {
            'key': 8,
            'description': 'Take the Money and Run',
            'category': 'Comedy|Crime'
        }, {
            'key': 9,
            'description': 'Executive Target',
            'category': 'Action|Adventure|Crime|Thriller'
        }, {
            'key': 10,
            'description': 'Heavy Metal',
            'category': 'Action|Adventure|Animation|Horror|Sci-Fi'
        }, {
            'key': 11,
            'description': 'Gone Girl',
            'category': 'Drama|Thriller'
        }, {
            'key': 12,
            'description': 'Oppai Volleyball (Oppai barê)',
            'category': 'Comedy'
        }, {
            'key': 13,
            'description': 'The Robot vs. the Aztec Mummy',
            'category': 'Horror|Sci-Fi'
        }, {
            'key': 14,
            'description': 'Sorry, Wrong Number',
            'category': 'Drama|Film-Noir|Thriller'
        }, {
            'key': 15,
            'description': 'Rosa Luxemburg',
            'category': 'Drama'
        }, {
            'key': 16,
            'description': "She's Out of Control",
            'category': 'Comedy'
        }, {
            'key': 17,
            'description': "Tuya's Marriage (Tuya de hun shi)",
            'category': 'Drama|Romance'
        }, {
            'key': 18,
            'description': 'In a Better World (Hævnen)',
            'category': 'Drama'
        }, {
            'key': 19,
            'description': 'Ponette',
            'category': 'Drama'
        }, {
            'key': 20,
            'description': 'Into the Blue 2: The Reef',
            'category': 'Action|Adventure|Thriller'
        }, {
            'key': 21,
            'description': 'Rookie, The',
            'category': 'Action|Comedy|Thriller'
        }, {
            'key': 22,
            'description': 'Ce que mes yeux ont vu',
            'category': 'Drama|Mystery|Thriller'
        }, {
            'key': 23,
            'description': 'Macabre',
            'category': 'Horror|Thriller'
        }, {
            'key': 24,
            'description': 'Blade on the Feather (Deep Cover)',
            'category': 'Mystery'
        }, {
            'key': 25,
            'description': 'Superweib, Das',
            'category': 'Comedy'
        }, {
            'key': 26,
            'description': 'Intermezzo',
            'category': 'Drama|Romance'
        }, {
            'key': 27,
            'description': 'Bourne Ultimatum, The',
            'category': 'Action|Crime|Thriller'
        }, {
            'key': 28,
            'description': 'London River',
            'category': 'Drama|Mystery'
        }, {
            'key': 29,
            'description': 'Hardware',
            'category': 'Action|Horror|Sci-Fi'
        }, {
            'key': 30,
            'description': 'Trash',
            'category': 'Adventure|Crime|Drama|Thriller'
        }, {
            'key': 31,
            'description': '3 Idiots',
            'category': 'Comedy|Drama|Romance'
        }, {
            'key': 32,
            'description': "Female Agents (Les femmes de l'ombre)",
            'category': 'Drama|War'
        }, {
            'key': 33,
            'description': 'Sune på bilsemester',
            'category': 'Children|Comedy'
        }, {
            'key': 34,
            'description': 'Godsend',
            'category': 'Drama|Horror|Thriller'
        }, {
            'key': 35,
            'description': 'Fever',
            'category': 'Drama'
        }, {
            'key': 36,
            'description': 'Christmas on Mars',
            'category': 'Sci-Fi'
        }, {
            'key': 37,
            'description': "Baby's Day Out",
            'category': 'Comedy'
        }, {
            'key': 38,
            'description': 'My Sucky Teen Romance',
            'category': 'Comedy'
        }, {
            'key': 39,
            'description': "Four Friends (a.k.a. Georgia's Friends)",
            'category': 'Drama'
        }, {
            'key': 40,
            'description': 'Thank You, Mr. Moto',
            'category': 'Crime|Drama|Mystery'
        }, {
            'key': 41,
            'description': 'Set Me Free (Emporte-moi)',
            'category': 'Drama'
        }, {
            'key': 42,
            'description': 'So Big!',
            'category': 'Drama'
        }, {
            'key': 43,
            'description': 'Naked Blood: Megyaku (Nekeddo burâddo: Megyaku)',
            'category': 'Horror'
        }, {
            'key': 44,
            'description': 'Carnosaur 3: Primal Species',
            'category': 'Horror|Sci-Fi'
        }, {
            'key': 45,
            'description': 'Tourist, The',
            'category': 'Drama|Thriller'
        }, {
            'key': 46,
            'description': 'Soldier',
            'category': 'Action|Sci-Fi|War'
        }, {
            'key': 47,
            'description': 'Diana Vreeland: The Eye Has to Travel',
            'category': 'Documentary'
        }, {
            'key': 48,
            'description': 'Bleeding, The',
            'category': 'Action|Horror'
        }, {
            'key': 49,
            'description': 'Mask of Fu Manchu, The',
            'category': 'Adventure|Horror|Sci-Fi'
        }, {
            'key': 50,
            'description': 'Ice Age Columbus: Who Were the First Americans?',
            'category': 'Documentary'
        }, {
            'key': 51,
            'description': 'Winter of Discontent',
            'category': 'Drama'
        }, {
            'key': 52,
            'description': 'Summer Holiday',
            'category': 'Musical|Romance'
        }, {
            'key': 53,
            'description': "Acadia Acadia?!? (L'acadie, l'Acadie)",
            'category': 'Documentary'
        }, {
            'key': 54,
            'description': 'Green Butchers, The (Grønne slagtere, De)',
            'category': 'Comedy|Crime|Drama|Romance'
        }, {
            'key': 55,
            'description': 'Lady Terminator (Pembalasan ratu pantai selatan)',
            'category': 'Action|Adventure|Horror|Sci-Fi|Thriller'
        }, {
            'key': 56,
            'description': 'Back to School with Franklin',
            'category': 'Animation|Children'
        }, {
            'key': 57,
            'description': 'Nocturna',
            'category': 'Adventure|Animation|Children|Fantasy|Mystery'
        }, {
            'key': 58,
            'description': 'Toronto Stories',
            'category': 'Drama'
        }, {
            'key': 59,
            'description': 'Mare Nostrum',
            'category': 'War'
        }, {
            'key': 60,
            'description': 'Color Purple, The',
            'category': 'Drama'
        }, {
            'key': 61,
            'description': 'Macbeth',
            'category': 'Drama'
        }, {
            'key': 62,
            'description': 'Speechless',
            'category': 'Comedy|Romance'
        }, {
            'key': 63,
            'description': '12 Rounds',
            'category': 'Action|Thriller'
        }, {
            'key': 64,
            'description': 'Dobermann',
            'category': 'Action|Crime'
        }, {
            'key': 65,
            'description': 'Mummy, The',
            'category': 'Horror|Romance'
        }, {
            'key': 66,
            'description': 'Straight Shooting',
            'category': 'Western'
        }, {
            'key': 67,
            'description': 'Commitments, The',
            'category': 'Comedy|Drama|Musical'
        }, {
            'key': 68,
            'description': 'The Whisperer in Darkness',
            'category': 'Horror|Mystery|Sci-Fi|Thriller'
        }, {
            'key': 69,
            'description': 'Magnificent Obsession',
            'category': 'Drama|Romance'
        }, {
            'key': 70,
            'description': 'Charming Mass Suicide, A (Hurmaava joukkoitsemurha)',
            'category': 'Comedy'
        }, {
            'key': 71,
            'description': 'Don Verdean',
            'category': 'Comedy'
        }, {
            'key': 72,
            'description': 'The Dark Knight',
            'category': 'Action|Crime|Drama|Thriller'
        }, {
            'key': 73,
            'description': 'Beautician and the Beast, The',
            'category': 'Comedy|Romance'
        }, {
            'key': 74,
            'description': 'Twilight Saga: New Moon, The',
            'category': 'Drama|Fantasy|Horror|Romance|Thriller'
        }, {
            'key': 75,
            'description': "This Girl's Life",
            'category': 'Drama'
        }, {
            'key': 76,
            'description': 'Sherlock Holmes',
            'category': 'Action|Crime|Mystery|Thriller'
        }, {
            'key': 77,
            'description': 'Feuerzangenbowle, Die',
            'category': 'Comedy'
        }, {
            'key': 78,
            'description': 'In the Midst of Life (Au coeur de la vie)',
            'category': 'Drama|War'
        }, {
            'key': 79,
            'description': 'Tokyo!',
            'category': 'Drama'
        }, {
            'key': 80,
            'description': 'Cars That Ate Paris, The',
            'category': 'Comedy|Horror|Thriller'
        }, {
            'key': 81,
            'description': 'I Knew It Was You: Rediscovering John Cazale',
            'category': 'Documentary'
        }, {
            'key': 82,
            'description': 'Down Terrace',
            'category': 'Comedy|Crime|Drama'
        }, {
            'key': 83,
            'description': 'Oedipus Rex (Edipo re)',
            'category': 'Drama'
        }, {
            'key': 84,
            'description': 'Ocean Waves (Umi ga kikoeru)',
            'category': 'Animation|Drama|Romance'
        }, {
            'key': 85,
            'description': 'Mystic Pizza',
            'category': 'Comedy|Drama|Romance'
        }, {
            'key': 86,
            'description': 'Hansel & Gretel',
            'category': 'Drama|Fantasy|Horror|Mystery|Thriller'
        }, {
            'key': 87,
            'description': 'Detention',
            'category': 'Action|Drama|Thriller'
        }, {
            'key': 88,
            'description': 'Violette (Violette Nozière)',
            'category': 'Crime|Drama|Thriller'
        }, {
            'key': 89,
            'description': 'Talk to Me',
            'category': 'Drama'
        }, {
            'key': 90,
            'description': 'Outrageous Class (Hababam sinifi)',
            'category': 'Comedy|Drama'
        }, {
            'key': 91,
            'description': 'Gamera: The Giant Monster (Daikaijû Gamera)',
            'category': 'Sci-Fi'
        }, {
            'key': 92,
            'description': 'The Inhabited Island',
            'category': 'Fantasy|Sci-Fi'
        }, {
            'key': 93,
            'description': 'V/H/S',
            'category': 'Horror|Thriller'
        }, {
            'key': 94,
            'description': 'Billy Liar',
            'category': 'Comedy'
        }, {
            'key': 95,
            'description': 'Debut, The',
            'category': 'Comedy|Drama'
        }, {
            'key': 96,
            'description': 'Cinematographer Style',
            'category': 'Documentary'
        }, {
            'key': 97,
            'description': 'American Ninja 2: The Confrontation',
            'category': 'Action|Adventure'
        }, {
            'key': 98,
            'description': 'Aelita: The Queen of Mars (Aelita)',
            'category': 'Action|Adventure|Drama|Fantasy|Romance|Sci-Fi|Thriller'
        }, {
            'key': 99,
            'description': 'Where Are the Dreams of Youth? (Seishun no yume imaizuko)',
            'category': 'Drama'
        }, {
            'key': 100,
            'description': 'Beast with a Million Eyes, The',
            'category': 'Sci-Fi'
        }],
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
                    title: '% Utilidad',
                    key: 'utilityPercentaje',
                    align: 'center',
                    scopedSlots: { customRender: 'utility' }
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
        width: 660,
        wrapClassName: 'material-page-desktop-drawer-edit',
        record: {}
    }

    export default materialDesktop
</script>

<style scoped>

</style>
