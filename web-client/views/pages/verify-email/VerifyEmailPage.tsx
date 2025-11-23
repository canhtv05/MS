'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Logo from '@/components/Logo';
import { API_ENDPOINTS } from '@/utils/endpoints';
import axios from 'axios';

type VerificationStatus = 'pending' | 'success' | 'error';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token không hợp lệ hoặc không tồn tại');
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.NOTIFICATION.VERIFY_EMAIL, {
          params: { token },
        });

        if (response.data?.data === true) {
          setStatus('success');
          setMessage('Email của bạn đã được xác thực thành công!');
        } else {
          setStatus('error');
          setMessage('Xác thực thất bại. Vui lòng thử lại.');
        }
      } catch (error: unknown) {
        setStatus('error');
        const errorMessage =
          (error as any)?.response?.data?.message ||
          'Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại sau.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token]);

  const handleGoToLogin = () => {
    router.push('/sign-in');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-effect rounded-2xl p-10 w-full max-w-md relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <Logo />
        </motion.div>

        {/* Status Icon */}
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-center text-foreground mb-3"
        >
          {status === 'pending' && 'Đang xác thực email...'}
          {status === 'success' && 'Xác thực thành công!'}
          {status === 'error' && 'Xác thực thất bại'}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-foreground/70 mb-8"
        >
          {status === 'pending' && 'Vui lòng đợi trong giây lát...'}
          {message}
        </motion.p>

        {/* Action buttons */}
        {status !== 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {status === 'success' && (
              <>
                <Button
                  onClick={handleGoHome}
                  className="w-full rounded-full bg-linear-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  Về trang chủ
                </Button>
                <Button
                  onClick={handleGoToLogin}
                  variant="accent"
                  className="w-full rounded-full border border-foreground/20"
                  size="lg"
                >
                  Đăng nhập ngay
                </Button>
              </>
            )}

            {status === 'error' && (
              <Button
                onClick={handleGoToLogin}
                className="w-full rounded-full bg-linear-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                size="lg"
              >
                Về trang đăng nhập
              </Button>
            )}
          </motion.div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-1000" />
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
