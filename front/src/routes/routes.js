function home_index() {
  return import(/* webpackChunkName: "home-index" */ '../pages/home/index.vue')
}
function sign_in_index() {
  return import(
    /* webpackChunkName: "sign_in-index" */ '../pages/sign_in/index.vue'
  )
}

export default [
  {
    name: 'home',
    path: '/home',
    component: home_index,
  },
  {
    name: 'sign_in',
    path: '/sign_in',
    component: sign_in_index,
  },
]
