import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setProfile, setError } from "@/store/profile-slice";
import { getProfile } from "@/libs/api";

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { AppDispatch, RootState } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

export const useProfile = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const profileState = useSelector((state: RootState) => state.profile);

  const { isLoading, error, data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !profileState.data,
  });
  useEffect(() => {
    if (error) {
      dispatch(setError(error?.message));
      return;
    }
    if (data) {
      dispatch(setProfile(data));
    }
  }, [data, dispatch, error]);

  // 提供一个方法来手动刷新数据
  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };
  return {
    profile: profileState.data,
    isLoading,
    error: profileState.error,
    refreshProfile,
  };
};
