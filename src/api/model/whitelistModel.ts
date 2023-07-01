import { Page } from '@/api/model/pageModel';

export interface Whitelist {
  id: string;
  category: number;
  resource: string;
}

export interface FindWhitelistReply {
  page: Page;
  list: Array<Whitelist>;
}
