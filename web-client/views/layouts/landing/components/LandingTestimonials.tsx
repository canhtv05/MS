'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient';
import { StaticImageData } from 'next/image';
import images from '@/public/imgs';
import { Heart } from '@solar-icons/react-perf/Bold';
import { Star } from '@solar-icons/react-perf/Outline';

interface LandingTestimonialsCardProps {
  content: string;
  fullname: string;
  role: string;
  avatar: StaticImageData;
}
const homeTestimonials: LandingTestimonialsCardProps[] = [
  {
    fullname: 'Nguyễn Minh Tuấn',
    role: 'Social Media Influencer',
    avatar: images.avt5,
    content:
      'Mạng xã hội này giúp tôi kết nối với cộng đồng và chia sẻ nội dung sáng tạo mỗi ngày.',
  },
  {
    fullname: 'Trần Thị Lan',
    role: 'Marketing Specialist',
    avatar: images.avt6,
    content:
      'Tôi có thể xây dựng thương hiệu cá nhân và doanh nghiệp một cách dễ dàng nhờ nền tảng này.',
  },
  {
    fullname: 'Lê Văn Hoàng',
    role: 'Content Creator',
    avatar: images.avt7,
    content:
      'Khám phá các cộng đồng phù hợp với sở thích giúp tôi mở rộng mối quan hệ và tìm kiếm cơ hội hợp tác.',
  },
  {
    fullname: 'Phạm Thị Hương',
    role: 'Digital Marketer',
    avatar: images.avt8,
    content: 'Các công cụ trên nền tảng này giúp tôi quản lý chiến dịch quảng cáo hiệu quả hơn.',
  },
  {
    fullname: 'Ngô Văn Nam',
    role: 'YouTuber',
    avatar: images.avt9,
    content: 'Tôi dễ dàng chia sẻ video của mình và nhận phản hồi trực tiếp từ cộng đồng.',
  },
  {
    fullname: 'Trương Thị Mai',
    role: 'Community Manager',
    avatar: images.avt10,
    content:
      'Nền tảng giúp tôi quản lý nhóm và kết nối thành viên một cách thuận tiện và sinh động.',
  },
  {
    fullname: 'Đặng Quang Huy',
    role: 'Photographer',
    avatar: images.avt11,
    content: 'Chia sẻ hình ảnh và nhận được sự tương tác tích cực từ những người cùng đam mê.',
  },
  {
    fullname: 'Vũ Thị Nhung',
    role: 'Blogger',
    avatar: images.avt12,
    content: 'Tôi dễ dàng viết và đăng bài, xây dựng lượng độc giả trung thành trên mạng xã hội.',
  },
  {
    fullname: 'Phan Văn Duy',
    role: 'Entrepreneur',
    avatar: images.avt13,
    content:
      'Nền tảng này giúp tôi tiếp cận khách hàng tiềm năng và xây dựng thương hiệu doanh nghiệp.',
  },
  {
    fullname: 'Nguyễn Thị Thanh',
    role: 'Influencer',
    avatar: images.avt14,
    content: 'Tôi có thể kết nối với những người cùng sở thích và mở rộng tầm ảnh hưởng của mình.',
  },
];

const LandingTestimonialsCard = ({
  content,
  avatar,
  fullname,
  role,
}: LandingTestimonialsCardProps) => {
  return (
    <div className="linear-3 p-5 rounded-lg flex flex-col h-full min-h-[250px]">
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="size-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        <p className="italic mt-4 font-thin text-gray-400 mb-3">{`"${content}"`}</p>

        <div className="flex items-end gap-5">
          <Avatar className="size-10">
            <AvatarImage src={avatar.src} />
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

const LandingTestimonials = () => {
  const items = [...homeTestimonials, ...homeTestimonials];

  return (
    <div className="md:px-20 md:py-32 px-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <div className="bg-green-50 flex items-center gap-2 rounded-full px-3 py-2">
          <Heart className="text-green-400 size-4 fill-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-bold">Testimonials</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Loved by
          <GradientText className="ml-2" text="Millions" />
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          See what our community members have to say about their experience
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <div className="overflow-hidden w-full mask-linear-fade">
          <motion.div
            className="flex gap-4 w-max"
            animate={{
              x: '-50%',
            }}
            transition={{
              duration: 50,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {items.map((card, i) => (
              <div key={i} className="shrink-0 w-[300px]">
                <LandingTestimonialsCard {...card} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingTestimonials;
