import { IProfilePageProps } from './ProfilePage';
import { Earth, Settings } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/customs/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useState, useRef } from 'react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Image from 'next/image';
import images from '@/public/imgs';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { APP_CONFIGS } from '@/configs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { AltArrowDown } from '@solar-icons/react-perf/Outline';
import { cn } from '@/lib/utils';
import useAuthLayout from '@/views/layouts/auth/use-auth-layout';
import { itemClassName } from '@/views/layouts/auth/AuthLayout';
import { useTranslation } from 'react-i18next';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'javascript.js' },
  { value: 'java', label: 'main.java' },
  { value: 'sql', label: 'data.sql' },
];

const EditProfileContainer = () => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('dracula', APP_CONFIGS.EDITOR_CONFIGS.draculaTheme);
  };

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
  };

  const { handleChangeLang, currentLang } = useAuthLayout();
  const { t } = useTranslation();

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
        <div className="flex items-center justify-center w-full bg-zinc-900/50 py-4 rounded-xl border border-dashed border-zinc-700">
          <Image
            width={150}
            height={150}
            src={images.avt1.src}
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
            src={images.avt1.src}
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
                <span className="text-[10px] font-bold text-[#6272a4]">LANG:</span>
                <span className="text-xs text-[#ff79c6] font-mono">
                  {LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label}
                </span>
                <AltArrowDown className="size-3 text-[#6272a4]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="overflow-hidden border p-1 z-50 w-full bg-[#282a36] border-[#6272a4] text-[#f8f8f2]">
              {LANGUAGE_OPTIONS.map(lang => (
                <DropdownMenuItem
                  key={lang.value}
                  className={cn(
                    'font-mono text-xs cursor-pointer flex items-center gap-3 px-3 py-2',
                    'hover:bg-[#44475a]/80 transition-colors duration-200 ease-in-out',
                  )}
                  onClick={() => setLanguage(lang.value)}
                >
                  <span
                    className={`relative inline-flex size-2 rounded-full ${language === lang.value ? 'bg-emerald-400 shadow-[0_0_8px_#50fa7b]' : 'bg-[#6272a4]/30'}`}
                  ></span>
                  <span className={language === lang.value ? 'text-emerald-400' : 'text-[#f8f8f2]'}>
                    {lang.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-[#282a36] rounded-md px-3 py-1.5 border border-[#6272a4] cursor-pointer transition-all outline-none group">
                <span className="text-[10px] font-bold text-[#6272a4]">LANG:</span>
                <span className="text-xs text-[#ff79c6] font-mono">
                  {LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label}
                </span>
                <AltArrowDown className="size-3 text-[#6272a4]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-full bg-[#282a36] border-[#6272a4] text-[#f8f8f2]"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <DropdownMenuHighlightItem key={lang.value}>
                  <DropdownMenuItem
                    className={cn(
                      'font-mono text-xs cursor-pointer flex items-center gap-3 px-3 py-2',
                    )}
                    onClick={() => setLanguage(lang.value)}
                  >
                    <span
                      className={`relative inline-flex size-2 rounded-full ${language === lang.value ? 'bg-emerald-400 shadow-[0_0_8px_#50fa7b]' : 'bg-[#6272a4]/30'}`}
                    ></span>
                    <span
                      className={language === lang.value ? 'text-emerald-400' : 'text-[#f8f8f2]'}
                    >
                      {lang.label}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuHighlightItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <div className="rounded-lg overflow-hidden relative">
          <Editor
            height="30vh"
            language={language}
            defaultValue={`// Viết tiểu sử kiểu Dev tại đây...\nconst me = {\n  name: "Canh",\n  role: "Fullstack Developer"\n};`}
            theme="dracula"
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={APP_CONFIGS.EDITOR_CONFIGS.options}
          />
        </div>
      </div>
    </div>
  );
};

const MeProfilePageHeroSectionButton = ({ t }: Pick<IProfilePageProps, 't'>) => {
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
        open={true}
        onClose={() => {}}
        title={t?.('edit_profile') || 'Edit Profile'}
        id="edit-profile"
        size="lg"
        hasBorder
      >
        <EditProfileContainer />
      </Dialog>
    </>
  );
};

export default MeProfilePageHeroSectionButton;
