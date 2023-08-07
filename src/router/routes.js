export const HOME = "home";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: HOME,
        component: () => import('pages/IndexPage.vue'),
        meta: {
          title: 'Home'
        }

      },
    ]
  },
]

export default routes;
