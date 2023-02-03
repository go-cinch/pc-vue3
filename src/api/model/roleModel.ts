import { Page } from '@/api/model/pageModel';

export interface Role {
  id: string;
  name: string;
  word: string;
}

export interface FindRoleReply {
  page: Page;
  list: Array<Role>;
}
