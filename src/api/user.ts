import { request } from '@/utils/request';
import { FindUserReply, UserCaptchaReply, UserInfoReply, UserLoginReply, UserStatusReply } from '@/api/model/userModel';

const Api = {
  UserLogin: '/auth/pub/login',
  UserLogout: '/auth/logout',
  UserCaptcha: '/auth/pub/captcha',
  UserStatus: '/auth/pub/status',
  UserInfo: '/auth/info',
  Register: '/auth/pub/register',
  FindUser: '/auth/user/list',
  UpdateUser: '/auth/user/update',
  DeleteUser: '/auth/user/delete',
};

export function login(data) {
  return request.post<UserLoginReply>({
    url: Api.UserLogin,
    data,
  });
}

export function logout() {
  return request.post({
    url: Api.UserLogout,
  });
}

export function captcha() {
  return request.get<UserCaptchaReply>({
    url: Api.UserCaptcha,
  });
}

export function userStatus(params) {
  return request.get<UserStatusReply>({
    url: Api.UserStatus,
    params,
  });
}

export function userInfo() {
  return request.get<UserInfoReply>({
    url: Api.UserInfo,
  });
}

export function register(data) {
  return request.post({
    url: Api.Register,
    data,
  });
}

export function findUser(params) {
  return request.get<FindUserReply>({
    url: Api.FindUser,
    params,
  });
}

export function updateUser(data) {
  return request.patch({
    url: Api.UpdateUser,
    data,
  });
}

export function deleteUser(ids) {
  return request.delete({
    url: `${Api.DeleteUser}?ids=${ids.join(',')}`,
  });
}
