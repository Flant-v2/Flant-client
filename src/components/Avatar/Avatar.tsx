import Image from 'next/image';
import { DefaultProfileIcon } from '@/icons';

type AvatarProps = {
  imageUrl: string;
  userId: string;
  createdAt: string;
};

function Avatar({ imageUrl, userId, createdAt }: AvatarProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {imageUrl && (
        <Image
          alt="유저 이미지"
          src={imageUrl}
          width={36}
          height={36}
          style={{ objectFit: 'cover' }}
          className="h-[36px] w-[36px] overflow-hidden rounded-full"
        />
      )}
      {!imageUrl && (
        <DefaultProfileIcon className="h-[36px] w-[36px] overflow-hidden rounded-full object-cover" />
      )}
      <div className="flex flex-col justify-between">
        <div className="overflow-hidden text-ellipsis text-[14px] font-[600] text-black">
          {userId}
        </div>
        <div className="overflow-hidden text-ellipsis text-[11px] font-[400] text-[#B0B0B0]">
          {createdAt}
        </div>
      </div>
    </div>
  );
}

export default Avatar;
