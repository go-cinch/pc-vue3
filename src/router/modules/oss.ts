import { shallowRef } from 'vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/oss',
    component: shallowRef(Layout),
    redirect: '/oss/minio',
    name: 'oss',
    meta: { title: '对象存储', icon: 'upload' },
    children: [
      {
        path: 'minio',
        name: 'OssMinio',
        component: () => import('@/pages/oss/minio/index.vue'),
        meta: { title: 'Minio' },
      },
    ],
  },
];
