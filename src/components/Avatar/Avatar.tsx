import { FC, SVGProps } from 'react';
import Image from 'next/image';
import { DefaultProfileIcon } from '@/icons';
import { dayFormatter } from '@/utils/day';

type AvatarProps = {
  imageUrl: string;
  userName: string;
  createdAt: string;
  Icon?: FC<SVGProps<SVGElement>>;
};

const Avatar = ({ imageUrl, userName: userId, createdAt, Icon }: AvatarProps) => {
  return (
    <div className="flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
      {imageUrl && (
        <Image
          alt="유저 이미지"
          src={imageUrl}
          width={36}
          height={36}
          className="flex h-[36px] w-[36px] flex-shrink-0 overflow-hidden rounded-full object-cover"
        />
      )}
      {!imageUrl && (
        <DefaultProfileIcon className="flex h-[36px] w-[36px] flex-shrink-0 overflow-hidden rounded-full object-cover" />
      )}
      <div className="flex flex-col justify-between overflow-hidden text-ellipsis whitespace-nowrap">
        <div className="flex items-center gap-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[600] text-black">
            {userId}
          </strong>
          {Icon && (
            <div className="flex max-h-[24px] max-w-[24px] items-center justify-center">
              <Icon />
            </div>
          )}
        </div>

        <time className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-[400] text-[#B0B0B0]">
          {dayFormatter(createdAt).format('YYYY.MM.DD HH:mm')}
        </time>
      </div>
    </div>
  );
};

export default Avatar;
