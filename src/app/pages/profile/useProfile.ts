import useUser from 'src/app/hooks/useUser';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import IUser, { IUserResponse } from 'src/app/interfaces/IUser';

const useProfile = () => {
  const [profileInfo, setProfileInfo] = useState<IUser | undefined>(undefined);
  const [status, setStatus] = useState<
    'loading' | 'success' | 'notFound' | 'error'
  >('loading');
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useUser();

  const getProfile = useCallback(
    async (id: string) => {
      try {
        setStatus('loading');
        const response = await axios.get<IUserResponse>(`/user/${id}`);
        setProfileInfo({
          ...response.data,
          date_created: new Date(response.data.date_created),
        });
        setStatus('success');
      } catch (error: any) {
        setStatus(error?.response?.status === 404 ? 'notFound' : 'error');
      }
    },
    [profileInfo, status]
  );

  useEffect(() => {
    if (!profileId) {
      if (authUser) navigate(`/profile/${authUser!.id}`, { replace: true });
    }
  }, [profileId, authUser]);

  useEffect(() => {
    if (profileId !== undefined) getProfile(profileId);
  }, [profileId]);

  const canModify = useMemo(
    () => !!authUser && !!profileInfo && authUser.id === profileInfo.id,
    [authUser, profileInfo]
  );

  return { profileInfo, canModify, status };
};

export default useProfile;
