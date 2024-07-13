import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '@/libs/api';
import { setProfile, setError } from '@/store/profileSlice';
import { Profile } from '../types';
import { useEffect } from 'react';

