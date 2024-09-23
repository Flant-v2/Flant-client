import Avatar from './Avatar';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Component/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar은 유저 프로필을 표시하는 컴포넌트입니다',
      },
    },
  },
  argTypes: {
    imageUrl: {
      control: { type: 'text' },
      description: '아바타에 표시할 이미지 URL',
    },
    userId: {
      control: { type: 'text' },
      description: '유저 ID',
    },
    createdAt: {
      control: { type: 'text' },
      description: '유저 생성 날짜',
    },
  },
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl:
      'https://image.xportsnews.com/contents/images/upload/article/2022/0528/mb_1653693108898879.jpg',
    userId: 'user123',
    createdAt: '2024-09-05T01:13:23.090Z',
  },
};

export const WithoutImage: Story = {
  args: {
    imageUrl: '',
    userId: 'user456',
    createdAt: '2024-09-05T01:13:23.090Z',
  },
};

export const LongUserId: Story = {
  args: {
    imageUrl:
      'https://image.xportsnews.com/contents/images/upload/article/2022/0528/mb_1653693108898879.jpg',
    userId: 'this_is_a_very_long_user_id_that_should_be_ellipsis',
    createdAt: '2024-09-05T01:13:23.090Z',
  },
  render: args => (
    <div className="flex w-[200px]">
      <Avatar {...args} imageUrl={args.imageUrl} />
    </div>
  ),
};

export default meta;
