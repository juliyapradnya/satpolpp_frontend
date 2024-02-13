<template>
  <v-main class="list">
    <v-card class="mx-auto" justify-center max-width="600" outlined style="height: 500px;">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h3 mb-1">
            Cetak Laporan Pengaduan
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card class="pa-md-4 mx-lg-auto" color="azure" width="250px" style="height: 180px;" justify="center">
      <v-card-actions>
        <v-btn class="pa-md-4 mx-lg-auto" color="#3F51B5" x-large justify="center" width="120px" style="height: 120px;" @click="dialogLaporanHarian = true">
          <v-icon>mdi-checkbook</v-icon>
          
        </v-btn>
      </v-card-actions>
      </v-card>

      <v-dialog v-model="dialogLaporanHarian" persistent max-width="500px">
        <v-card>
          <span class="headline">{{ formTitle }} Laporan Harian </span>

          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="fade-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="Tanggal"
                    
                    prepend-icon="mdi-calendar-month"
                    readonly
                    v-bind="attrs"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>

              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                transition="fade-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="Tanggal"
                    
                    prepend-icon="mdi-calendar-month"
                    readonly
                    v-bind="attrs"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue"
              dark
              @click="
                dialogLaporanHarian = false;
                resetForm();
              "
            >
              Back
            </v-btn>

            <v-btn
              color="blue"
              dark
              @click="
                dialogLaporanHarian = false;
                readLaporanHarian(startDate,endDate);
                dialogHarian = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogHarian" persistent fullscreen>
        <v-card>
          <div id="cetakLaporanHarian">
            <v-card-text class="mt-2 px-12 py-15 text-center">
              <div>
                
                <hr />
                <p class="fontBottom">LAPORAN PENGADUAN</p>
                <hr />
                <p style="text-align: left">
                  LAPORAN PENGADUAN<br />PERIODE: {{ startDate }} s/d
                {{ endDate }} 
                </p>
                <hr style="height: 5px" />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersLaporan"
                  :items="lapHarian"
                  :search="search"
                >
                </v-data-table>
              </div>
            </v-card-text>
          </div>

          <v-card-actions class="justify-end">
            <v-btn
              text
              color="blue"
              @click="
                dialogHarian = false;
                resetForm();
                resetTabel();
              "
              >Cancel</v-btn
            >
            <v-btn text color="blue" @click="cetakLaporanHarian()">
              Cetak</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      
    </v-card>
  </v-main>
</template>

<script>
import html2PDF from "jspdf-html2canvas";
//import { MonthPicker } from "vue-month-picker";
export default {
  name: "List",
  data() {
    return {
      dialogLaporanHarian: false,
      dialogLaporanBulanan: false,
      dialogBulanan: false,
      dialogHarian: false,
      lapHarian: [],
      lapBulanan: [],
      pengaduan: [],
      pengaduans: [],
      headersLaporan: [
        { text: "Tanggal Pengaduan", value: "tanggal" },
        { text: "Pukul", value: "pukul" },
        { text: "Sasaran", value: "sasaran" },
        { text: "Lokasi", value: "lokasi" },
        { text: "Temuan", value: "temuan" },
        { text: "Tindak Lanjut", value: "tindak_lanjut" },
        { text: "Keterangan", value: "keterangan" },
      ],
      date: {
        from: null,
        to: null,
        month: null,
        monthIndex: null,
        rangeFrom: null,
        rangeTo: null,
        rangeFromMonth: null,
        rangeToMonth: null,
        year: null,
      },
      menu: false,
      menu1: false,
      menu2: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
    };
  },
  // components: {
  //   MonthPicker,
  // },
  methods: {
    showDate(date) {
      this.date = date;
    },
    cetakLaporanHarian() {
      let print = document.getElementById("cetakLaporanHarian");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollx: 0,
          scrollY: -window.scrollY,
        },
        output: "Laporan-Harian",
      });
    },
    cetakLaporanBulanan() {
      let print = document.getElementById("cetakLaporanBulanan");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollx: 0,
          scrollY: -window.scrollY,
        },
        output: "Laporan-Bulanan",
      });
    },
    readLaporanHarian(date1,date2)
    {
      
      var url = this.$api + "/laporanharian/" + date1 + "," + date2;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          
          this.lapHarian = response.data.data;
          
        });
    },
    readLaporanBulanan(month, year) {
      var url = this.$api + "/laporanbulanan/" + month + "," + year;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.lapBulanan = response.data.data;
        });
    },
    readPengaduan() {
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
    resetForm() {
      this.$refs.form.reset();
    },
    resetTabel() {
      this.lapBulanan;
      this.lapHarian;
    },
    computed: {
      years() {
        const year = new Date().getFullYear();
        return Array.from(
          { length: year - 1900 },
          (value, index) => 2000 + index
        );
      },
    },
    mounted() {
      this.readPengaduan();
    },
  },
};
</script>
