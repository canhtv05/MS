import { IDetailUserProfileDTO } from '@/types/profile';
import {
  Calendar,
  User,
  Heart,
  Home,
  City,
  Book,
  Case,
  Buildings,
  Star,
  Phone,
  Link as LinkIcon,
} from '@solar-icons/react-perf/Outline';
import {
  GithubIcon,
  FaceBookBoldDuotoneIcon,
  LinkedinBoldDuotoneIcon,
  InstagramTwoOneIcon,
  TiktokIcon,
  XTwitterIcon,
} from '@/components/animate-ui/icons';

export type TIntroduceField =
  | 'dob'
  | 'gender'
  | 'relationship_status'
  | 'hometown'
  | 'city'
  | 'school'
  | 'job_title'
  | 'company'
  | 'interests'
  | 'phone_number'
  | 'website_url'
  | 'facebook_url'
  | 'github_url'
  | 'linkedin_url'
  | 'instagram_url'
  | 'tiktok_url'
  | 'x_url';

export const getFieldValue = (
  field: TIntroduceField,
  introduce?: IDetailUserProfileDTO['introduce'],
): string => {
  if (!introduce) return '';

  switch (field) {
    case 'dob':
      return introduce.dob || '';
    case 'gender':
      return introduce.gender || '';
    case 'relationship_status':
      return introduce.relationshipStatus || '';
    case 'hometown':
      return introduce.hometown || '';
    case 'city':
      return introduce.city || '';
    case 'school':
      return introduce.school || '';
    case 'job_title':
      return introduce.jobTitle || '';
    case 'company':
      return introduce.company || '';
    case 'interests':
      return introduce.interests?.map(i => i.title).join(', ') || '';
    case 'phone_number':
      return introduce.phoneNumber || '';
    case 'website_url':
      return introduce.websiteUrl || '';
    case 'facebook_url':
      return introduce.facebookUrl || '';
    case 'github_url':
      return introduce.githubUrl || '';
    case 'linkedin_url':
      return introduce.linkedinUrl || '';
    case 'instagram_url':
      return introduce.instagramUrl || '';
    case 'tiktok_url':
      return introduce.tiktokUrl || '';
    case 'x_url':
      return introduce.xUrl || '';
    default:
      return '';
  }
};

export const formatFieldValue = (
  field: TIntroduceField,
  value: string,
  t: (key: string) => string,
): string => {
  if (!value) return '';

  switch (field) {
    case 'gender':
      return t(`common:gender.${value}`) || value;
    case 'relationship_status':
      return t(`common:relationship_status.${value}`) || value;
    default:
      return value;
  }
};

export const getLabelKey = (field: TIntroduceField): string => {
  const labelMap: Record<TIntroduceField, string> = {
    dob: 'dob',
    gender: 'gender',
    relationship_status: 'relationshipStatus',
    hometown: 'hometown',
    city: 'city',
    school: 'school',
    job_title: 'jobTitle',
    company: 'company',
    interests: 'interests',
    phone_number: 'phoneNumber',
    website_url: 'websiteUrl',
    facebook_url: 'facebookUrl',
    github_url: 'githubUrl',
    linkedin_url: 'linkedinUrl',
    instagram_url: 'instagramUrl',
    tiktok_url: 'tiktokUrl',
    x_url: 'xUrl',
  };
  return labelMap[field] || field;
};

export const getFieldIcon = (
  field: TIntroduceField,
): React.ComponentType<{ className?: string }> | null => {
  const iconMap: Record<TIntroduceField, React.ComponentType<{ className?: string }>> = {
    dob: Calendar,
    gender: User,
    relationship_status: Heart,
    hometown: Home,
    city: City,
    school: Book,
    job_title: Case,
    company: Buildings,
    interests: Star,
    phone_number: Phone,
    website_url: LinkIcon,
    facebook_url: FaceBookBoldDuotoneIcon,
    github_url: GithubIcon,
    linkedin_url: LinkedinBoldDuotoneIcon,
    instagram_url: InstagramTwoOneIcon,
    tiktok_url: TiktokIcon,
    x_url: XTwitterIcon,
  };
  return iconMap[field] || null;
};

export const isEnumField = (field: TIntroduceField): boolean => {
  return field === 'gender' || field === 'relationship_status';
};
