import { request } from '@/utils/request';
import { FindActionReply } from '@/api/model/actionModel';

const Api = {
  CreateAction: '/auth/action/create',
  FindAction: '/auth/action/list',
  UpdateAction: '/auth/action/update',
  DeleteAction: '/auth/action/delete',
};

export function createAction(token, data) {
  return request.post({
    url: Api.CreateAction,
    data,
    headers: {
      'x-idempotent': token,
    },
  });
}

export function findAction(params) {
  return request.get<FindActionReply>({
    url: Api.FindAction,
    params,
  });
}

export function updateAction(data) {
  return request.patch({
    url: Api.UpdateAction,
    data,
  });
}

export function deleteAction(ids) {
  return request.delete({
    url: `${Api.DeleteAction}?ids=${ids.join(',')}`,
  });
}
