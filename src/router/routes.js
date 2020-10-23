export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/mainViews/Home.vue')
            },
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('../views/mainViews/Menu.vue')
            },
            {
                path: 'shopbag',
                name: 'Shopbag',
                component: () => import('../views/mainViews/Shopbag.vue')
            },
            {
                path: 'my',
                name: 'My',
                component: () => import('../views/mainViews/My.vue')
            }
        ]
    },

    {
        path: '/detail',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () => import('../views/Pay.vue')
    },
    {
        path: '/center',
        name: 'Center',
        component: () => import('../views/Center.vue')
    },
    {
        path: '/shippingaddress',
        name: 'Shippingaddress',
        component: () => import('../views/Shippingaddress.vue')
    },
    {
        path: '/newAddress',
        name: 'NewAddress',
        component: () => import('../views/NewAddress.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import('../views/Order.vue')
    },
   
    {
        path: '/collect',
        name: 'Collect',
        component: () => import('../views/Collect.vue')
    },
    {
        path: '/person',
        name: 'Person',
        component: () => import('../views/Person.vue')
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import('../views/Forgot.vue')
    },
    {
        path: '/adv',
        name: 'Adv',
        component: () => import('../views/Adv.vue')
    },
    {
        path: '/giude',
        name: 'Guide',
        component: () => import('../views/Guide.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/now',
        name: 'Now',
        component: () => import('../views/Now.vue')
    },
  
    {
        path: '*',
        redirect: {
            name: 'Guide'
        }
    }

]