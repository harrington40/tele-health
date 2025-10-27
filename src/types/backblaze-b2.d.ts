declare module 'backblaze-b2' {
  interface B2Options {
    applicationKeyId: string;
    applicationKey: string;
  }

  interface AuthorizeResponse {
    accountId: string;
    authorizationToken: string;
    apiUrl: string;
    downloadUrl: string;
  }

  interface GetUploadUrlResponse {
    bucketId: string;
    uploadUrl: string;
    authorizationToken: string;
  }

  interface UploadFileResponse {
    fileId: string;
    fileName: string;
    accountId: string;
    bucketId: string;
    contentLength: number;
    contentSha1: string;
    contentType: string;
    fileInfo: Record<string, string>;
    action: string;
    uploadTimestamp: number;
  }

  interface ListFileNamesResponse {
    files: Array<{
      fileId: string;
      fileName: string;
      size: number;
      uploadTimestamp: number;
      action: string;
    }>;
    nextFileName?: string;
  }

  class B2 {
    constructor(options: B2Options);

    authorize(): Promise<AuthorizeResponse>;
    getUploadUrl(bucketId: string): Promise<GetUploadUrlResponse>;
    uploadFile(options: {
      uploadUrl: string;
      uploadAuthToken: string;
      fileName: string;
      data: Buffer | string;
      contentType?: string;
      contentLength?: number;
    }): Promise<UploadFileResponse>;
    listFileNames(options: {
      bucketId: string;
      startFileName?: string;
      maxFileCount?: number;
    }): Promise<ListFileNamesResponse>;
    deleteFileVersion(options: {
      fileName: string;
      fileId: string;
    }): Promise<{ fileId: string; fileName: string }>;
    getDownloadUrlById(options: {
      fileId: string;
      bucketName?: string;
    }): string;
  }

  export = B2;
}