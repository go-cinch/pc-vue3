import { request } from '@/utils/request';
import { Idempotent } from '@/api/model/idempotentModel';

const Api = {
  AuthIdempotent: '/auth/idempotent',
  // u can add other service idempotent
};

export function authIdempotent() {
  return request.get<Idempotent>({
    url: Api.AuthIdempotent,
  });
}
