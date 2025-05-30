
import { WebsiteImage, IMAGE_USAGE_MAP } from '@/services/images';
import { Info, Upload, X } from 'lucide-react';
import { ImageCropHandler } from '../upload/crop-handler';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImagePreviewProps {
  previewUrl: string | null;
  image: WebsiteImage;
  isReplacing: boolean;
  file: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCroppedFile: (file: File) => void;
  onCancelReplace: () => void;
}

const ImagePreview = ({ 
  previewUrl, 
  image, 
  isReplacing,
  file,
  onFileChange,
  onCroppedFile,
  onCancelReplace
}: ImagePreviewProps) => {
  const usageLocation = IMAGE_USAGE_MAP[image.key] || 'Custom image (not tied to a specific website section)';
  const isMobile = useIsMobile();
  
  // Determine if image is used as cover or contain based on usage key
  const getObjectFit = (): 'cover' | 'contain' => {
    if (
      image.key.includes('hero') || 
      image.key.includes('background') || 
      image.key.includes('banner') ||
      image.key.includes('villalab') ||
      image.key.includes('experience')
    ) {
      return 'cover';
    }
    return 'contain';
  };
  
  const objectFit = getObjectFit();
  
  if (isReplacing && file && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-navy">Replace Image</h3>
          <button
            type="button"
            onClick={onCancelReplace}
            className="text-gray-500 hover:text-gray-700"
            title="Cancel replacement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <ImageCropHandler 
          imageSrc={previewUrl}
          uploadFile={file}
          onCroppedFile={onCroppedFile}
          imageKey={image.key}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="border rounded-lg overflow-hidden relative">
          <div className="bg-navy bg-opacity-10 rounded-t-lg px-2 py-1 text-xs text-center">
            {objectFit === 'cover' ? 'Image fills the entire container' : 'Image fully visible within container'}
          </div>
          <img 
            src={previewUrl} 
            alt={image.alt_text || 'Image preview'} 
            className={`w-full ${isMobile ? 'max-h-[300px]' : 'max-h-[400px]'} object-${objectFit} mx-auto bg-white`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
            <label className="cursor-pointer bg-navy text-white rounded-md px-3 py-2 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Replace Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileChange}
              />
            </label>
          </div>
        </div>
      )}
      
      <div className="bg-navy bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-navy">Usage Location:</h3>
          <p className="text-sm text-gray-700">{usageLocation}</p>
          <p className="text-xs text-gray-500 mt-1">
            Images with fixed keys replace placeholder images throughout the website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
