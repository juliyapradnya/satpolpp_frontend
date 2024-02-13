<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Pengaduan</h3>

    <v-card  style="height: 200px;">
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

      <v-data-table :headers="headers" :items="pengaduan" :search="search">
        <template v-slot:[`item.status`]="{ item }">
          <v-chip v-if="item.status == '1'" class="ma-2" color="teal" dark>
            Terverifikasi
          </v-chip>

          <v-chip v-else class="ma-2" color="yellow" dark> Pending </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn 
            color="blue" 
            fab dark small 
            @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn 
            color="red" 
            fab dark small 
            @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>

          <v-btn 
            color="green" 
            fab dark small 
            @click="editHandlerVerif(item)">
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>

          <v-btn 
            color="indigo" 
            fab dark small 
            @click="tampilDataHandler(item)">
            <v-icon>mdi-book</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Pengaduan </span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="form.nama"
              label="Nama"
              outlined
              :rules="namaRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.nik"
              label="NIK"
              outlined
              :rules="nikRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.no_hp"
              label="Nomor Handphone"
              outlined
              :rules="noHpRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.sasaran"
              label="Sasaran"
              outlined
              :rules="sasaranRules"
              required
            ></v-text-field>

            <v-menu
              ref="menu"
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="waktu"
                  label="Pukul"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  :rules="waktuRules"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                
                v-model="waktu"
                full-width
                @click:minute="$refs.menu.save(waktu)"
              ></v-time-picker>
            </v-menu>

            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="tgl_pengaduan"
                  label="Tanggal Pengaduan"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="tglRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="tgl_pengaduan"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>

            <v-select
              v-model="form.id_kecamatan"
              :items="kecamatans"
              item-text="kecamatan"
              item-value="id"
              label="Lokasi"
              outlined
              :rules="lokasiRules"
              required
            ></v-select>

            <v-select
              v-model="form.id_jenis"
              :items="jenis_aduans"
              item-text="keterangan_aduan"
              item-value="id"
              label="Jenis Aduan"
              outlined
              :rules="jenisRules"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>

          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogVerif" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle2 }} Verifikasi</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form" enctype="multipart/form-data">
            <v-text-field
              v-model="form2.temuan"
              label="Temuan"
              outlined
              :rules="temuanRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form2.tindakan"
              label="Tindak Lanjut"
              outlined
              :rules="tindakanRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form2.keterangan"
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
              v-model="form2.upload_foto"
              :rules="fotoRules"
              required
            >
            </v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>

          <v-btn color="blue darken-1" text @click="setFormVerif"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogTampilData" persistent fullscreen>
      <v-card>
        <v-toolbar color="blue" dark>Tampil Foto </v-toolbar>
        <div id="tampilData">
          <v-card justify="center" align="center">
            <img :src="'http://127.0.0.1:8000/upload_foto/' + this.tempimage" />
          </v-card>
        </div>
        <v-card-actions class="justify-end">
          <v-btn text color="blue" @click="dialogTampilData = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data pengaduan ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
//import moment from "moment";
//import Datepicker from 'vuejs-datepicker';
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      inputTypeVerif: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogVerif: false,
      dialogConfirm: false,
      dialogTampilData: false,
      time: null,
      menu2: false,
      menu1: false,
      headers: [
        { text: "Nama", value: "nama" },
        { text: "NIK", value: "nik" },
        { text: "Nomor HP", value: "no_hp" },
        { text: "Sasaran", value: "sasaran" },
        { text: "Waktu", value: "waktu" },
        { text: "Tanggal Pengaduan", value: "tgl_pengaduan" },
        { text: "Lokasi", value: "kecamatan" },
        { text: "Jenis Aduan", value: "keterangan_aduan" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ],
      pengaduans: new FormData(),
      pengaduan: [],
      kecamatans: [],
      jenis_aduans: [],
      verifikasis: [],
      form: {
        nama: null,
        nik: null,
        no_hp: null,
        sasaran: null,
        waktu: null,
        tgl_pengaduan: null,
        id_kecamatan: null,
        id_jenis: null,
        status: null,
      },
      form2: {
        temuan: null,
        tindakan: null,
        keterangan: null,
        upload_foto: null,
      },
      namaRules: [(v) => !!v || "Nama Pelapor tidak boleh kosong"],
      nikRules: [(v) => !!v || "NIK tidak boleh kosong"],
      noHpRules: [(v) => !!v || "Nomor HP tidak boleh kosong"],
      sasaranRules: [(v) => !!v || "Sasaran tidak boleh kosong"],
      waktuRules: [(v) => !!v || "Waktu tidak boleh kosong"],
      tglRules: [(v) => !!v || "Tanggal Pengaduan tidak boleh kosong"],
      lokasiRules: [(v) => !!v || "Lokasi tidak boleh kosong"],
      jenisRules: [(v) => !!v || "Jenis Aduan tidak boleh kosong"],
      temuanRules: [(v) => !!v || "Temuan tidak boleh kosong"],
      tindakanRules: [(v) => !!v || "Tindakan tidak boleh kosong"],
      keteranganRules: [(v) => !!v || "Keterangan tidak boleh kosong"],
      fotoRules: [(v) => !!v || "Foto tidak boleh kosong"],
      deleteId: "",
      editId: "",
      editVerifId: "",
      tampilDataId: "",
      tgl_pengaduan: new Date().toISOString().substr(0, 10),
    };
  },
  methods: {
    allowedStep: m => m % 15 === 0,
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    setFormVerif() {
      if (this.inputTypeVerif === "Tambah") {
        this.updateVerif();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/pengaduan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pengaduan = response.data.data;
          console.log(this.pengaduan);
        });
    },
    readDataKecamatan() {
      var url = this.$api + "/kecamatan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.kecamatans = response.data.data;
        });
    },
    readDataJenisAduan() {
      var url = this.$api + "/jenisaduan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.jenis_aduans = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.pengaduans.append("nama", this.form.nama);
        this.pengaduans.append("nik", this.form.nik);
        this.pengaduans.append("no_hp", this.form.no_hp);
        this.pengaduans.append("sasaran", this.form.sasaran);
        this.pengaduans.append("waktu", this.waktu);
        this.pengaduans.append("tgl_pengaduan", this.tgl_pengaduan);
        this.pengaduans.append("id_kecamatan", this.form.id_kecamatan);
        this.pengaduans.append("id_jenis", this.form.id_jenis);
        this.pengaduans.append("status", 0);

        var url = this.$api + "/pengaduan/";
        this.load = true;
        this.$http
          .post(url, this.pengaduans, {
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
        nama: this.form.nama,
        nik: this.form.nik,
        no_hp: this.form.no_hp,
        sasaran: this.form.sasaran,
        waktu: this.waktu,
        tgl_pengaduan: this.tgl_pengaduan,
        id_kecamatan: this.form.id_kecamatan,
        id_jenis: this.form.id_jenis,
        //status: this.form.status,
      };
      var url = this.$api + "/pengaduan/" + this.editId;
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
    //update verif
    updateVerif() {
      this.pengaduans.append("status", 1);
      this.pengaduans.append("temuan", this.form2.temuan);
      this.pengaduans.append("tindakan", this.form2.tindakan);
      this.pengaduans.append("keterangan", this.form2.keterangan);
      this.pengaduans.append("upload_foto", this.form2.upload_foto);

      var url = this.$api + "/pengaduan/verifikasi/" + this.editVerifId;
      this.load = true;
      this.$http
        .post(url, this.pengaduans, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            //'Content-Type' : 'image/png'
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          //this.resetFormVerif();
          this.inputTypeVerif = "Tambah";
        })
        .catch((error) => {
          console.log(error);
          // this.error_message = error.response.data.message;
          // this.color = "red";
          // this.snackbar = true;
          // this.load = false;
        });
    },
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/pengaduan/" + this.deleteId;
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
      this.form.nama = item.nama;
      this.form.nik = item.nik;
      this.form.no_hp = item.no_hp;
      this.form.sasaran = item.sasaran;
      this.form.waktu = item.waktu;
      this.form.tgl_pengaduan = item.tgl_pengaduan;
      this.form.id_kecamatan = item.id_kecamatan;
      this.form.id_jenis = item.id_jenis;
      this.form.status = item.status;
      this.dialog = true;
    },
    editHandlerVerif(item) {
      this.inputTypeVerif = "Tambah";
      this.editVerifId = item.id;
      this.form2.temuan = item.temuan;
      this.form2.tindakan = item.tindakan;
      this.form2.keterangan = item.keterangan;
      this.form2.upload_foto = item.upload_foto;
      this.dialogVerif = true;
      console.log(item.upload_foto);
    },
    tampilDataHandler(item) {
      // this.inputTypeVerif = "Tambah";
      // this.tampilDataId = item.id;
      // this.form2.temuan = item.temuan;
      // this.form2.tindakan = item.tindakan;
      // this.form2.keterangan = item.keterangan;
      this.tempimage = item.upload_foto;
      this.dialogTampilData = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogVerif = false;
      this.dialogTampilData = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
      this.inputType2 = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogVerif = false;
      this.inputType = "Tambah";
      this.inputType2 = "Tambah";
    },
    resetForm() {
      this.$refs.form.reset();
    },
    // resetFormVerif() {
    //   this.$refs.form2.reset();
    // },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
    formTitle2() {
      return this.inputType2;
    },
  },
  mounted() {
    this.readData();
    this.readDataKecamatan();
    this.readDataJenisAduan();
  },
};
</script>
