import {
  Select,
  SelectArrow,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/animate-ui/components/radix/select';
import { PrivacyLevel } from '@/enums/common';
import { TFunction } from 'i18next';

interface IRenderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  labelKey: string;
  t: TFunction<'settings', undefined>;
  modal?: boolean;
}

const RenderSelect = ({ value, onValueChange, labelKey, t, modal }: IRenderSelectProps) => {
  const privacyLevels = [
    {
      value: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_PUBLIC}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_PRIVATE,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_PRIVATE}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_CUSTOM,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_CUSTOM}`),
    },
  ];

  return (
    <Select value={value} onValueChange={onValueChange} modal={modal}>
      <SelectTrigger className="w-full transition-global cursor-pointer border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
        <SelectValue placeholder={t('privacy.select_placeholder')} />
      </SelectTrigger>
      <SelectContent className="z-210!">
        <SelectArrow />
        <SelectGroup>
          <SelectLabel>{t(labelKey)}</SelectLabel>
          {privacyLevels.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RenderSelect;
