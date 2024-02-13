import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        
           // Login
            {
                path: "/login",
                name: "Login",
                meta: {title: 'Login'},
                component: importComponent('Login'),
            },
        {
                path: "/",
                component: importComponent('DashboardLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/dashboard",
                        name: "Dashboard",
                        meta: {title: 'Dashboard'},
                        component: importComponent('Dashboard'),
                    },

                    //Pengaduan
                    {
                        path: "/pengaduan",
                        name: "Pengaduan",
                        meta: {title: 'Pengaduan'},
                        component: importComponent('DataMaster/Pengaduan'),
                    },

                    //Verifikasi
                    {
                        path: "/verifikasi",
                        name: "Verifikasi",
                        meta: {title: 'Verifikasi'},
                        component: importComponent('DataMaster/Verifikasi'),
                    },

                    //Laporan
                    {
                        path: "/laporan",
                        name: "Laporan",
                        meta: {title: 'Laporan'},
                        component: importComponent('DataMaster/Laporan'),
                    },
                ]
        },

        {
            path: '*',
            redirect: '/'
        },

    ]
});

//set judul


export default router;