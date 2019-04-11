// 产品管理路由配置
import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/product-list',
  name: 'Product',
  meta: { title: 'product', icon: 'shopping' },
  children: [
    {
      path: 'product-list',
      component: () => import('@/views/product/product-list'),
      name: 'ProductList',
      meta: { title: 'productList' }
    },
    // {
    //   path: 'product-list',
    //   component: () => import('@/views/product/product-list'),
    //   name: 'ProductList',
    //   meta: { title: 'productList' }
    // }
  ]
}

export default productRouter
