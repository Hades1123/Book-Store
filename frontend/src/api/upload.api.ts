import axios from './axios.customize';

export type TUploadFolder = 'avatar' | 'product';

export interface UploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export const uploadFile = async (
  file: File,
  folder: TUploadFolder
): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const result = await axios.post<ApiResponse<UploadResponse>>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
};
