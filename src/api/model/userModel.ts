import { Page } from '@/api/model/pageModel';
import { Role } from '@/api/model/roleModel';

export interface UserLoginReply {
  code: number;
  reason: string;
  message: string;
  token: string;
  expires: string;
}

export interface UserCaptchaReply {
  captcha: {
    id: string;
    img: string;
  };
}

export interface UserStatusReply {
  captcha: {
    id: string;
    img: string;
  };
  locked: boolean;
  lockExpire: string;
}

export interface UserInfoReply {
  id: string;
  username: string;
  code: string;
  mobile: string;
  permission: {
    resources: Array<string>;
    menus: Array<string>;
    btns: Array<string>;
  };
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  code: string;
  mobile: string;
  status: string;
  locked: string;
  lockMsg: string;
  platform: string;
  lastLogin: string;
  roleId: string;
  role: Role;
}

export interface FindUserReply {
  page: Page;
  list: Array<User>;
}
