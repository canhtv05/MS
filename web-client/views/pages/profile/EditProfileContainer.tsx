import { IProfilePageProps } from './ProfilePage';
import { Settings } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/customs/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useState, useRef } from 'react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Image from 'next/image';
import images from '@/public/imgs';
import { getValidImageSrc } from '@/lib/image-utils';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { APP_CONFIGS } from '@/configs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { AltArrowDown } from '@solar-icons/react-perf/Outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import { updateProfileSchema } from '@/validations/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/customs/input';
import { MapPointWave } from '@solar-icons/react-perf/Outline';
import {
  FaceBookTwoOneIcon,
  InstagramTwoOneIcon,
  TiktokIcon,
  XTwitterIcon,
} from '@/components/animate-ui/icons';

interface IEditProfileContainerProps {
  form: UseFormReturn<z.infer<typeof updateProfileSchema>>;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'javascript.js' },
  { value: 'python', label: 'main.py' },
  { value: 'go', label: 'main.go' },
  { value: 'c', label: 'main.c' },
  { value: 'java', label: 'main.java' },
  { value: 'sql', label: 'data.sql' },
];

const EditProfileContainer = ({ form }: IEditProfileContainerProps) => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { user } = useAuthStore();

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('dracula', APP_CONFIGS.EDITOR_CONFIGS.draculaTheme);
  };

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
  };

  return (
    <div className="space-y-5 pb-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold text-zinc-200">Ảnh đại diện</h3>
          <Button
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full py-4 rounded-xl">
          <Image
            width={150}
            height={150}
            src={getValidImageSrc(user?.profile?.avatarUrl, images.avt1.src)}
            alt="Avatar"
            className="object-cover rounded-full ring-4 ring-zinc-800 shadow-xl"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold text-zinc-200">Ảnh bìa</h3>
          <Button
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          <Image
            height={100}
            width={500}
            src={getValidImageSrc(user?.profile?.coverUrl, images.avt1.src)}
            alt="Cover"
            className="object-cover h-[180px] w-full rounded-xl shadow-lg border border-zinc-800"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Tiểu sử</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-[#282a36] rounded-md px-3 py-1.5 border border-[#6272a4] cursor-pointer transition-all outline-none group">
                <span className="text-[10px] font-bold text-[#6272a4]">Language:</span>
                <span className="text-xs text-[#ff79c6] font-mono">
                  {LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label}
                </span>
                <AltArrowDown className="size-3 text-[#6272a4]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="overflow-hidden border p-1 z-50 w-full bg-[#282a36] border-[#6272a4] text-[#f8f8f2]"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <div
                  key={lang.value}
                  className={cn(
                    'font-mono text-xs cursor-pointer flex items-center gap-3 px-3 py-2 rounded-sm',
                    'hover:bg-[#44475a] transition-colors duration-150',
                    'focus:outline-none focus:bg-[#44475a]',
                  )}
                  onClick={() => setLanguage(lang.value)}
                  role="menuitem"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setLanguage(lang.value);
                    }
                  }}
                >
                  <span
                    className={`relative inline-flex size-2 rounded-full ${language === lang.value ? 'bg-emerald-400 shadow-[0_0_8px_#50fa7b]' : 'bg-[#6272a4]/30'}`}
                  ></span>
                  <span className={language === lang.value ? 'text-emerald-400' : 'text-[#f8f8f2]'}>
                    {lang.label}
                  </span>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="rounded-lg overflow relative">
              <Editor
                {...field}
                height="30vh"
                language={language}
                defaultValue={''}
                theme="dracula"
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                options={APP_CONFIGS.EDITOR_CONFIGS.options}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold text-zinc-200">Giới thiệu</h3>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Input
                  {...field}
                  id="city"
                  label="Tỉnh/Thành phố"
                  placeholder="Tỉnh/Thành phố"
                  type="text"
                  inputSize="md"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  icon={<MapPointWave className="size-5 p-0.5 text-foreground/70" />}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Controller
            name="facebookUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Input
                  {...field}
                  id="facebookUrl"
                  label="Facebook URL"
                  placeholder="https://www.facebook.com/username"
                  type="text"
                  inputSize="md"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  icon={<FaceBookTwoOneIcon className="size-5 p-0.5 text-foreground/70" />}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Controller
            name="instagramUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Input
                  {...field}
                  id="instagramUrl"
                  label="Instagram URL"
                  placeholder="https://www.instagram.com/username"
                  type="text"
                  inputSize="md"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  icon={<InstagramTwoOneIcon className="size-5 p-0.5 text-foreground/70" />}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Controller
            name="tiktokUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Input
                  {...field}
                  id="tiktokUrl"
                  label="Tiktok URL"
                  placeholder="https://www.tiktok.com/username"
                  type="text"
                  inputSize="md"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  icon={<TiktokIcon className="size-5 p-0.5 text-foreground/70" />}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Controller
            name="xUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Input
                  {...field}
                  id="xUrl"
                  label="X URL"
                  placeholder="https://x.com/username"
                  type="text"
                  inputSize="md"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  icon={<XTwitterIcon className="size-5 p-0.5 text-foreground/70" />}
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const MeProfilePageHeroSectionButton = ({ t }: Pick<IProfilePageProps, 't'>) => {
  const { user } = useAuthStore();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: '',
      city: '',
      facebookUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
      xUrl: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: z.infer<typeof updateProfileSchema>) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button variant="default" className="gap-2">
          {t?.('edit_profile')}
        </Button>
        <IconButton variant="outline" className="cursor-pointer">
          <div className="flex items-center justify-center w-full h-full">
            <Settings />
          </div>
        </IconButton>
      </div>
      <Dialog
        open={false}
        onClose={() => {}}
        title={t?.('edit_profile') || 'Edit Profile'}
        id="edit-profile"
        size="lg"
        hasBorder
        form={form}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} id="update-profile-form">
          <EditProfileContainer form={form} />
        </form>
      </Dialog>
    </>
  );
};

export default MeProfilePageHeroSectionButton;
