import { Page } from '@/api/model/pageModel';

export interface UserGroup {
  id: string;
  name: string;
  code: string;
  word: string;
  resource: string;
}

export interface FindUserGroupReply {
  page: Page;
  list: Array<UserGroup>;
}
