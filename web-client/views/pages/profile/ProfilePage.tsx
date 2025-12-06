'use client';

import { use } from 'react';

interface IParams {
  username: string;
}

const ProfilePage = ({ params }: { params: Promise<IParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);

  if (!decodedUsername.startsWith('@')) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 font-bold">Profile Not Found</h1>
        <p>You tried to access: {decodedUsername}</p>
        <p>We expected a username starting with @</p>
        <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
          DEBUG INFO: params.username: {username}
          decoded: {decodedUsername}
        </pre>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 h-full mb-8 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex lg:w-full bg-white p-4 rounded-lg">
      ok
    </div>
  );
};

export default ProfilePage;
