import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '@/libs/api';
import { Profile, ProfileSchemaType } from '@/libs/types';
import AvatarUpload from './avatar-upload';
import { profileSchema } from '@/libs/schema/profile-schema';

interface Props {
  profile: Profile;
}

export default function ProfileEdit({ profile = {} }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation('Profile');

  const { control, handleSubmit, reset } = useForm<ProfileSchemaType>({
    defaultValues: profile,
    resolver: zodResolver(profileSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setIsEditing(false);
      reset(data);
      enqueueSnackbar('Profile updated', { variant: 'success' });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    },
  });

  const onSubmit = (data: ProfileSchemaType) => {
    mutation.mutate(data);
  };

  if (!isEditing) {
    return <Button onClick={() => setIsEditing(true)}>{t('editProfile')}</Button>;
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Username"
                error={!!error}
                helperText={error?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email"
                error={!!error}
                helperText={error?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Phone"
                error={!!error}
                helperText={error?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <AvatarUpload />
          <div className="mt-4">
            <Button type="submit" variant="contained" color="primary" className="mr-2" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                reset(profile);
              }}
              variant="outlined">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
