import { request } from '@/utils/request';
import { FindRoleReply } from '@/api/model/roleModel';

const Api = {
  CreateRole: '/auth/role/create',
  FindRole: '/auth/role/list',
  UpdateRole: '/auth/role/update',
  DeleteRole: '/auth/role/delete',
};

export function createRole(token, data) {
  return request.post({
    url: Api.CreateRole,
    data,
    headers: {
      'x-idempotent': token,
    },
  });
}

export function findRole(params) {
  return request.get<FindRoleReply>({
    url: Api.FindRole,
    params,
  });
}

export function updateRole(data) {
  return request.patch({
    url: Api.UpdateRole,
    data,
  });
}

export function deleteRole(ids) {
  return request.delete({
    url: `${Api.DeleteRole}?ids=${ids.join(',')}`,
  });
}
