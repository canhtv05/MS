import { ResourceType } from '@/enums/common';

export interface IFileResponse {
  id: string;
  ownerId: string;
  totalSize: number;

  videos: IVideoResponse[];
  images: IImageResponse[];
  resourceType: ResourceType;
}

export interface IVideoResponse {
  playtimeSeconds: number;
  playtimeString: string;
  contentType: string;
  videoUrl: string;
  thumbnailUrl: string;
  previewVttUrl: string;
  fileSize: number;
  originFileName: string;
  publicId: string;
  createdAt: string;
  resourceType: ResourceType;
}

export interface IImageResponse {
  contentType: string;
  imageUrl: string;
  fileSize: number;
  originFileName: string;
  publicId: string;
  createdAt: string;
  resourceType: ResourceType;
}

export interface IMediaHistoryGroupDTO {
  data: IImageResponse[];
}
