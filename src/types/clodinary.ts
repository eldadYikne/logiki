export interface CloudinaryUploadEvent {
  event: string;
  info: {
    id: string;
    batchId: string;
    assetId: string;
    publicId: string;
    version: number;
    versionId: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resourceType: string;
    createdAt: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secureUrl: string;
    folder: string;
    accessMode: string;
    originalFilename: string;
    path: string;
    thumbnailUrl: string;
  };
}
