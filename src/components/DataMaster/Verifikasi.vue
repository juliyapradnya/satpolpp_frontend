<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Verifikasi</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="green" fab dark small @click="dialog = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="verifikasi" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Verifikasi</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_pengaduan"
              :items="pengaduans"
              item-text="nama"
              item-value="id"
              label="Nama Pelapor"
              outlined
              :rules="idPengaduanRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.temuan"
              label="Temuan"
              outlined
              :rules="temuanRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.tindakan"
              label="Tindak Lanjut"
              outlined
              :rules="tindakanRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.keterangan"
              label="Keterangan"
              outlined
              :rules="keteranganRules"
              required
            ></v-text-field>

            
              <v-file-input 
                class="custom-file-input"
                type="file"
                accept="image/*" 
                label="Select File..."
                v-model="form.upload_foto"
                required>
              </v-file-input>
            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="setForm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data verifikasi ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        
        { text: "Nama Pelapor", value: "nama" },
        { text: "Temuan", value: "temuan" },
        { text: "Tindak Lanjut", value: "tindakan" },
        { text: "Keterangan", value: "keterangan" },
        { text: "Upload Foto", value: "upload_foto" },
        { text: "Actions", value: "actions" },
      ],
      verifikasis: new FormData(),
      verifikasi: [],
      pengaduans: [],
      form: {
        id_pengaduan: null,
        temuan: null,
        tindakan: null,
        keterangan: null,
        upload_foto: null,
      },
      idPengaduanRules: [(v) => !!v || "Nama Pelapor tidak boleh kosong"],
      temuanRules: [(v) => !!v || "Temuan tidak boleh kosong"],
      tindakanRules: [(v) => !!v || "Tindak Lanjut tidak boleh kosong"],
      keteranganRules: [(v) => !!v || "Keterangan tidak boleh kosong"],
      fotoRules: [(v) => !!v || "Foto tidak boleh kosong"],
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/verifikasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.verifikasi = response.data.data;
        });
    },
    readDataPengaduan() {
      var url = this.$api + "/pengaduan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pengaduans = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.verifikasis.append("id_pengaduan", this.form.id_pengaduan);
        this.verifikasis.append("temuan", this.form.temuan);
        this.verifikasis.append("tindakan", this.form.tindakan);
        this.verifikasis.append("keterangan", this.form.keterangan);
        this.verifikasis.append("upload_foto", this.form.upload_foto);

        var url = this.$api + "/verifikasi/";
        this.load = true;
        this.$http
          .post(url, this.verifikasis, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.close();
            this.readData(); //mengambil data
            this.resetForm();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    //ubah
    update() {
      let newData = {
        id_pengaduan: this.form.id_pengaduan,
        temuan: this.form.temuan,
        tindakan: this.form.tindakan,
        keterangan: this.form.keterangan,
        upload_foto: this.form.upload_foto,
      };
      var url = this.$api + "/verifikasi/" + this.editId;
      this.load = true;
      this.$http
        .post(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/verifikasi/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.id_pengaduan = item.id_pengaduan;
      this.form.temuan = item.temuan;
      this.form.tindakan = item.tindakan;
      this.form.keterangan = item.keterangan;
      this.form.upload_foto = item.upload_foto;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataPengaduan();
  },
};
</script>
