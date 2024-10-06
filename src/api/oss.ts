import { request } from '@/utils/request';
import { OssPreSignedReply } from '@/api/model/ossModel';

const Api = {
  OssPreSigned: '/oss/pre/signed',
};

export function preSigned(data) {
  return request.post<OssPreSignedReply>({
    url: Api.OssPreSigned,
    data,
  });
}
