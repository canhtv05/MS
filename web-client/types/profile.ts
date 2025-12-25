export type { IProfileDTO as IUserProfileDTO } from './auth';

export interface IMediaHistoryDTO {
  id: string;
  userId: string;
  url: string;
  type: string;
  createdAt: string;
}

export interface IMediaHistoryGroupDTO {
  date: string;
  items: IMediaHistoryDTO[];
}

export interface ChangeCoverByUrlReq {
  url: string;
}
