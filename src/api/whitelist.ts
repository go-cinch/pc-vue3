import { request } from '@/utils/request';
import { FindWhitelistReply } from '@/api/model/whitelistModel';

const Api = {
  CreateWhitelist: '/auth/whitelist/create',
  FindWhitelist: '/auth/whitelist/list',
  UpdateWhitelist: '/auth/whitelist/update',
  DeleteWhitelist: '/auth/whitelist/delete',
};

export function createWhitelist(token, data) {
  return request.post({
    url: Api.CreateWhitelist,
    data,
    headers: {
      'x-idempotent': token,
    },
  });
}

export function findWhitelist(params) {
  return request.get<FindWhitelistReply>({
    url: Api.FindWhitelist,
    params,
  });
}

export function updateWhitelist(data) {
  return request.patch({
    url: Api.UpdateWhitelist,
    data,
  });
}

export function deleteWhitelist(ids) {
  return request.delete({
    url: `${Api.DeleteWhitelist}?ids=${ids.join(',')}`,
  });
}
