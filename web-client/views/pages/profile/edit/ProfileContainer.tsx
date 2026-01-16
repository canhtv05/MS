'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { getValidImageSrc } from '@/lib/image-utils';
import images from '@/public/imgs';
import { useRef, useState, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { APP_CONFIGS } from '@/configs';
import { cn } from '@/lib/utils';
import { Controller, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { AltArrowDown } from '@solar-icons/react-perf/Outline';
import { UpdateProfileFormValues } from './Introduce';
import { IUserProfileDTO } from '@/types/profile';
import { useTheme } from 'next-themes';

interface IProfileContainerProps {
  form: UseFormReturn<UpdateProfileFormValues>;
  user: IUserProfileDTO | undefined;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'javascript.js' },
  { value: 'python', label: 'main.py' },
  { value: 'go', label: 'main.go' },
  { value: 'c', label: 'main.c' },
  { value: 'java', label: 'main.java' },
  { value: 'sql', label: 'data.sql' },
];

const ProfileContainer = ({ form, user }: IProfileContainerProps) => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === 'dark' ? 'dracula' : 'github-light';

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('dracula', APP_CONFIGS.EDITOR_CONFIGS.draculaTheme);
    monaco.editor.defineTheme('github-light', APP_CONFIGS.EDITOR_CONFIGS.lightTheme);
  };

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    // Tắt Ctrl+Space (trigger suggest)
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {});
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme(editorTheme);
    }
  }, [editorTheme]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Ảnh đại diện</h3>
          <Button
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full py-4 rounded-xl">
          {(() => {
            const src = getValidImageSrc(user?.avatarUrl, images.avt1.src);
            return src ? (
              <Image
                loading="eager"
                width={150}
                height={150}
                src={src}
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
                unoptimized
                alt="Avatar"
                className="object-cover rounded-full ring-4 ring-purple-300 shadow-xl"
              />
            ) : null;
          })()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Ảnh bìa</h3>
          <Button
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          {(() => {
            const src = getValidImageSrc(user?.coverUrl, images.avt1.src);
            return src ? (
              <Image
                height={100}
                width={500}
                loading="eager"
                src={src}
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
                unoptimized
                alt="Cover"
                className="object-cover h-[180px] w-full rounded-xl shadow-lg"
              />
            ) : null;
          })()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Tiểu sử</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 cursor-pointer transition-all outline-none group',
                  resolvedTheme === 'dark' ? 'bg-[#282a36]' : 'bg-gray-100 border border-gray-200',
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-bold leading-none',
                    resolvedTheme === 'dark' ? 'text-[#6272a4]' : 'text-gray-500',
                  )}
                >
                  Language:
                </span>
                <span
                  className={cn(
                    'text-xs font-mono',
                    resolvedTheme === 'dark' ? 'text-[#ff79c6]' : 'text-blue-600',
                  )}
                >
                  {LANGUAGE_OPTIONS.find(opt => opt.value === language)?.label}
                </span>
                <AltArrowDown
                  className={cn(
                    'size-3',
                    resolvedTheme === 'dark' ? 'text-[#6272a4]' : 'text-gray-500',
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className={cn(
                'overflow-hidden border-none p-1 z-50 w-full',
                resolvedTheme === 'dark'
                  ? 'bg-[#282a36] text-[#f8f8f2]'
                  : 'bg-white text-gray-900 border border-gray-200',
              )}
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <div
                  key={lang.value}
                  className={cn(
                    'font-mono text-xs cursor-pointer flex items-center gap-3 px-3 py-2 rounded-sm',
                    'transition-colors duration-150 focus:outline-none',
                    resolvedTheme === 'dark'
                      ? 'hover:bg-[#44475a] focus:bg-[#44475a]'
                      : 'hover:bg-gray-100 focus:bg-gray-100',
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
                    className={cn(
                      'relative inline-flex size-2 rounded-full',
                      language === lang.value
                        ? resolvedTheme === 'dark'
                          ? 'bg-emerald-400 shadow-[0_0_8px_#50fa7b]'
                          : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                        : resolvedTheme === 'dark'
                          ? 'bg-[#6272a4]/30'
                          : 'bg-gray-300',
                    )}
                  ></span>
                  <span
                    className={cn(
                      language === lang.value
                        ? resolvedTheme === 'dark'
                          ? 'text-emerald-400'
                          : 'text-blue-600 font-semibold'
                        : resolvedTheme === 'dark'
                          ? 'text-[#f8f8f2]'
                          : 'text-gray-700',
                    )}
                  >
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
                defaultValue={user?.bio}
                value={field.value}
                theme={editorTheme}
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
    </>
  );
};

export default ProfileContainer;
