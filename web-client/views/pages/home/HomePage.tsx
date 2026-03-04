'use client';

import { Button } from '@/components/ui/button';
import { useProfileMutation } from '@/services/mutations/profile';
import { useWebSocketContext } from '@/contexts/WebSocketProvider';
import { logger } from '@/lib/logger';

const HomePage = () => {
  const { sendFriendRequestMutation, deleteFriendRequestMutation } = useProfileMutation();
  const ws = useWebSocketContext();
  const isWsOpen = ws?.readyStateLabel === 'OPEN';

  const onSendFriendRequest = () => {
    if (!isWsOpen) {
      logger.warn('[HomePage] WS not OPEN, skip sendFriendRequest');
      return;
    }
    logger.info('[HomePage] Sending friend request', ws);
    sendFriendRequestMutation.mutateAsync({
      receiverName: 'user',
    });
  };

  const onDeleteFriendRequest = () => {
    if (!isWsOpen) {
      logger.warn('[HomePage] WS not OPEN, skip deleteFriendRequest');
      return;
    }
    deleteFriendRequestMutation.mutateAsync('user');
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button onClick={onSendFriendRequest} disabled={!isWsOpen}>
        Send Friend Request
      </Button>
      <Button onClick={onDeleteFriendRequest} disabled={!isWsOpen}>
        Delete Friend Request
      </Button>
    </div>
  );
};

export default HomePage;
