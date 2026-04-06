import { v2 as cloudinary } from 'cloudinary';
import { ExternalConfig, externalConfig } from 'src/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [externalConfig.KEY],
  useFactory: (externalConfig: ExternalConfig) => {
    return cloudinary.config({
      cloud_name: externalConfig.cloudinaryName,
      api_key: externalConfig.cloudinaryApiKey,
      api_secret: externalConfig.cloudinaryApiSecret,
    });
  },
};
