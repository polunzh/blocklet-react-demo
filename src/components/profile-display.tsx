/* eslint-disable react/no-unused-prop-types */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, Grid, Avatar, Typography, Button, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateProfile } from '@/libs/api';
import { Profile, ProfileSchemaType } from '@/libs/types';
import { profileSchema } from '@/libs/schema/profile-schema';
import { useProfile } from '@/hooks';

type Props = {
  profile: Profile;
  onEdit?: () => void;
  onCancel?: () => void;
  onSubmit?: (data: ProfileSchemaType) => void;
  isPending?: boolean;
};

// ProfileInfo component
function ProfileInfo({ profile }: Props) {
  const { t } = useTranslation('Profile');
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <Avatar src={profile.avatar} alt={profile.username} className="w-24 h-24 mx-auto" />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="h5" className="text-center sm:text-left">
          {profile.username}
        </Typography>
        <Typography variant="body1">
          {t('email')}: {profile.email}
        </Typography>
        <Typography variant="body1">
          {t('phone')}: {profile.phone}
        </Typography>
      </Grid>
    </Grid>
  );
}

// ProfileForm component
function ProfileForm({ control }: { control: any }) {
  const { t } = useTranslation('Profile');
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => <TextField {...field} label={t('avatarUrl')} fullWidth margin="normal" />}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('username')}
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
              label={t('email')}
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
          render={({ field }) => <TextField {...field} label={t('phone')} fullWidth margin="normal" />}
        />
      </Grid>
    </Grid>
  );
}

function ProfileDisplay({ profile, onEdit }: Props) {
  return (
    <>
      <ProfileInfo profile={profile} />
      <div className="mt-4 flex justify-end">
        <IconButton onClick={onEdit} color="primary">
          <EditIcon />
        </IconButton>
      </div>
    </>
  );
}

// ProfileEdit component
function ProfileEdit({ profile, onCancel, onSubmit, isPending }: Props) {
  const { t } = useTranslation('Profile');
  const { control, handleSubmit } = useForm<ProfileSchemaType>({
    defaultValues: profile,
    resolver: zodResolver(profileSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit!)}>
      <ProfileForm control={control} />
      <div className="mt-4 flex justify-end">
        <Button type="submit" variant="contained" color="primary" className="mr-2" disabled={isPending}>
          {isPending ? t('saving') : t('save')}
        </Button>
        <Button onClick={onCancel} variant="outlined">
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
// Main ProfileComponent
export default function ProfileComponent() {
  const { profile, isLoading, error, refreshProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setIsEditing(false);
      enqueueSnackbar('Profile updated', { variant: 'success' });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    },
  });

  const handleSubmit = (data: ProfileSchemaType) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data</div>;
  return (
    <Card className="mb-4">
      <CardContent>
        {isEditing ? (
          <ProfileEdit
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
          />
        ) : (
          <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)} />
        )}
      </CardContent>
    </Card>
  );
}
