'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { getValidImageSrc } from '@/lib/image-utils';
import images from '@/public/imgs';
import { useRef, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor, Uri } from 'monaco-editor';
import { APP_CONFIGS } from '@/configs';
import { Controller, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { IUserProfileDTO } from '@/types/profile';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { useProfileModalStore } from '../use-profile-modal';
import ChangeCover from '../modals/ChangeCover';
import { UpdateProfileFormValues } from './Introduce';
import { Input } from '@/components/ui/input';

interface IProfileContainerProps {
  form: UseFormReturn<UpdateProfileFormValues>;
  user: IUserProfileDTO | undefined;
}

const ProfileContainer = ({ form, user }: IProfileContainerProps) => {
  const { t } = useTranslation('profile');
  const language = 'javascript';
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { resolvedTheme } = useTheme();

  const editorOptions = {
    ...APP_CONFIGS.EDITOR_CONFIGS.options,
    semanticValidation: false,
    syntaxValidation: false,
    // Tắt tất cả diagnostics/error reporting
    'diagnostics.enabled': false,
  };

  const editorTheme = resolvedTheme === 'dark' ? 'dracula' : 'github-light';

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('dracula', APP_CONFIGS.EDITOR_CONFIGS.draculaTheme);
    monaco.editor.defineTheme('github-light', APP_CONFIGS.EDITOR_CONFIGS.lightTheme);

    // Disable diagnostics cho JavaScript language
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
  };

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    // Tắt Ctrl+Space (trigger suggest)
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {});

    const model = editorInstance.getModel();
    if (model) {
      // Xóa tất cả markers hiện có
      monaco.editor.setModelMarkers(model, 'owner', []);

      // Lắng nghe và xóa markers mới khi chúng được tạo
      const disposable = monaco.editor.onDidChangeMarkers((uris: readonly Uri[]) => {
        if (uris.includes(model.uri)) {
          monaco.editor.setModelMarkers(model, 'owner', []);
        }
      });

      // Cleanup khi editor bị dispose
      editorInstance.onDidDispose(() => {
        disposable.dispose();
      });
    }
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme(editorTheme);
    }
  }, [editorTheme]);

  // Cleanup markers khi component unmount
  useEffect(() => {
    return () => {
      if (editorRef.current && monacoRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          monacoRef.current.editor.setModelMarkers(model, 'owner', []);
        }
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">{t('profile_name')}</h3>
        </div>
        <Controller
          name="fullname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              name="fullname"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="w-full"
              errorText={fieldState.error?.message}
              id="fullname"
              validate
              required
              placeholder={t('profile_name_placeholder')}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">{t('avatar_image')}</h3>
          <Button
            onClick={() => useProfileModalStore.getState().openParentDialog()}
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            {t('edit')}
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
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
                priority
                alt="Avatar"
                className="object-cover rounded-full"
              />
            ) : null;
          })()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">{t('cover_image')}</h3>
          <Button
            onClick={() => useProfileModalStore.getState().openChangeCover()}
            variant="ghost"
            className="text-primary md:text-lg font-semibold hover:bg-primary/10"
          >
            {t('edit')}
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
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
                priority
                alt="Cover"
                className="object-cover h-[180px] w-full rounded-xl shadow-lg"
              />
            ) : null;
          })()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">{t('bio_editor')}</h3>
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
                options={editorOptions}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>
      <ChangeCover
        open={useProfileModalStore.getState().isChangeCoverOpen}
        setOpen={() => useProfileModalStore.getState().closeChangeCover()}
      />
    </div>
  );
};

export default ProfileContainer;
