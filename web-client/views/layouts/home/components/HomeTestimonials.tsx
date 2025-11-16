'use client';

import { Heart } from '@/components/animate-ui/icons/heart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import { Viewport } from '@/enums';
import { StarIcon } from 'lucide-react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface HomeTestimonialsCardProps {
  content: string;
  fullname: string;
  role: string;
  avatar: string;
}
const homeTestimonials: HomeTestimonialsCardProps[] = [
  {
    fullname: 'Nguyễn Minh Tuấn',
    role: 'Social Media Influencer',
    avatar: '/imgs/avatars/avatar5.jpg',
    content:
      'Mạng xã hội này giúp tôi kết nối với cộng đồng và chia sẻ nội dung sáng tạo mỗi ngày.',
  },
  {
    fullname: 'Trần Thị Lan',
    role: 'Marketing Specialist',
    avatar: '/imgs/avatars/avatar6.jpg',
    content:
      'Tôi có thể xây dựng thương hiệu cá nhân và doanh nghiệp một cách dễ dàng nhờ nền tảng này.',
  },
  {
    fullname: 'Lê Văn Hoàng',
    role: 'Content Creator',
    avatar: '/imgs/avatars/avatar7.jpg',
    content:
      'Khám phá các cộng đồng phù hợp với sở thích giúp tôi mở rộng mối quan hệ và tìm kiếm cơ hội hợp tác.',
  },
  {
    fullname: 'Phạm Thị Hương',
    role: 'Digital Marketer',
    avatar: '/imgs/avatars/avatar8.jpg',
    content: 'Các công cụ trên nền tảng này giúp tôi quản lý chiến dịch quảng cáo hiệu quả hơn.',
  },
  {
    fullname: 'Ngô Văn Nam',
    role: 'YouTuber',
    avatar: '/imgs/avatars/avatar9.jpg',
    content: 'Tôi dễ dàng chia sẻ video của mình và nhận phản hồi trực tiếp từ cộng đồng.',
  },
  {
    fullname: 'Trương Thị Mai',
    role: 'Community Manager',
    avatar: '/imgs/avatars/avatar10.jpg',
    content:
      'Nền tảng giúp tôi quản lý nhóm và kết nối thành viên một cách thuận tiện và sinh động.',
  },
  {
    fullname: 'Đặng Quang Huy',
    role: 'Photographer',
    avatar: '/imgs/avatars/avatar11.jpg',
    content: 'Chia sẻ hình ảnh và nhận được sự tương tác tích cực từ những người cùng đam mê.',
  },
  {
    fullname: 'Vũ Thị Nhung',
    role: 'Blogger',
    avatar: '/imgs/avatars/avatar12.jpg',
    content: 'Tôi dễ dàng viết và đăng bài, xây dựng lượng độc giả trung thành trên mạng xã hội.',
  },
  {
    fullname: 'Phan Văn Duy',
    role: 'Entrepreneur',
    avatar: '/imgs/avatars/avatar13.jpg',
    content:
      'Nền tảng này giúp tôi tiếp cận khách hàng tiềm năng và xây dựng thương hiệu doanh nghiệp.',
  },
  {
    fullname: 'Nguyễn Thị Thanh',
    role: 'Influencer',
    avatar: '/imgs/avatars/avatar14.jpg',
    content: 'Tôi có thể kết nối với những người cùng sở thích và mở rộng tầm ảnh hưởng của mình.',
  },
];

const HomeTestimonialsCard = ({ content, avatar, fullname, role }: HomeTestimonialsCardProps) => {
  return (
    <div className="linear-3 p-5 rounded-lg flex flex-col h-full min-h-[250px]">
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} className="size-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        <p className="italic mt-4 font-thin text-gray-400 mb-3">{`"${content}"`}</p>

        <div className="flex items-end gap-5">
          <Avatar className="size-10">
            <AvatarImage src={avatar} />
            <AvatarFallback>{fullname}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h4 className="text-black">{fullname}</h4>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeTestimonials = () => {
  return (
    <div className="md:px-20 md:py-32 px-10 py-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 flex items-center gap-2 rounded-full px-3 py-2">
          <Heart autoAnimate className="text-primary size-4 fill-primary" />
          <span className="text-primary text-sm font-bold">Testimonials</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Loved by
          <span className="text-linear ml-2">Millions</span>
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          See what our community members have to say about their experience
        </p>
      </div>
      <div className="mt-10">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ pauseOnMouseEnter: true, delay: 2000 }}
          spaceBetween={12}
          className="rounded-sm h-full"
          slidesPerView={1}
          breakpoints={{
            [Viewport.MD]: { slidesPerView: 2 },
            [Viewport.LG]: { slidesPerView: 3 },
            [Viewport.XL]: { slidesPerView: 4 },
          }}
          loop={true}
        >
          {homeTestimonials.map((card, index) => (
            <SwiperSlide key={index} className="flex h-full">
              <HomeTestimonialsCard {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeTestimonials;
