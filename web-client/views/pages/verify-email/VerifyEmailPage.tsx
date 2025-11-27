'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import useVerifyEmail from './use-verify-email';
import { useTranslation } from 'react-i18next';

const VerifyEmailPage = () => {
  const { t } = useTranslation('notification');
  const { status, message, handleGoToLogin, handleGoHome } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-2xl p-10 w-full max-w-md relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="flex justify-center mb-6"
        >
          {status === 'pending' && (
            <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-500/30 rounded-full" />
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-linear-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50"
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-center text-foreground mb-3"
        >
          {status === 'pending' && t('verify.pending')}
          {status === 'success' && t('verify.success')}
          {status === 'error' && t('verify.error')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-foreground/70 mb-8"
        >
          {status === 'pending' && t('verify.pending')}
          {message}
        </motion.p>

        {status !== 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 flex items-center justify-between w-full"
          >
            {status === 'success' && (
              <div className="w-full flex justify-center items-center gap-3">
                <Button onClick={handleGoHome} size="lg">
                  {t('verify.go_to_home')}
                </Button>
                <Button onClick={handleGoToLogin} variant="accent" size="lg">
                  {t('verify.go_to_sign_in')}
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center w-full justify-center">
                <Button onClick={handleGoToLogin} size="lg">
                  {t('verify.go_to_sign_in')}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-1000" />
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
