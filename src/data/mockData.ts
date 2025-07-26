import { Influencer, Post, TrackingData, Payout } from '@/types';

export const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Fitness Guru Raj',
    category: 'fitness',
    gender: 'male',
    followerCount: 250000,
    platform: 'instagram',
    engagement_rate: 4.2
  },
  {
    id: '2',
    name: 'Wellness With Priya',
    category: 'wellness',
    gender: 'female',
    followerCount: 180000,
    platform: 'youtube',
    engagement_rate: 6.1
  },
  {
    id: '3',
    name: 'Nutrition Expert Arjun',
    category: 'nutrition',
    gender: 'male',
    followerCount: 120000,
    platform: 'instagram',
    engagement_rate: 5.8
  },
  {
    id: '4',
    name: 'Lifestyle Maya',
    category: 'lifestyle',
    gender: 'female',
    followerCount: 320000,
    platform: 'tiktok',
    engagement_rate: 7.2
  },
  {
    id: '5',
    name: 'Sports Champion Dev',
    category: 'sports',
    gender: 'male',
    followerCount: 95000,
    platform: 'youtube',
    engagement_rate: 4.9
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    influencer_id: '1',
    platform: 'instagram',
    date: '2024-01-15',
    url: 'https://instagram.com/p/example1',
    caption: 'Transform your workout with MuscleBlaze protein! 💪 #fitness #protein',
    reach: 45000,
    likes: 2800,
    comments: 156,
    shares: 89
  },
  {
    id: '2',
    influencer_id: '2',
    platform: 'youtube',
    date: '2024-01-18',
    url: 'https://youtube.com/watch?v=example2',
    caption: 'My morning routine with HKVitals supplements - complete review!',
    reach: 78000,
    likes: 3200,
    comments: 287,
    shares: 145
  },
  {
    id: '3',
    influencer_id: '3',
    platform: 'instagram',
    date: '2024-01-20',
    url: 'https://instagram.com/p/example3',
    caption: 'Why Gritzo is perfect for kids nutrition - pediatrician approved!',
    reach: 32000,
    likes: 1900,
    comments: 98,
    shares: 67
  }
];

export const mockTrackingData: TrackingData[] = [
  {
    id: '1',
    source: 'instagram',
    campaign: 'Winter Fitness 2024',
    influencer_id: '1',
    user_id: 'user_001',
    product: 'Whey Protein Gold',
    brand: 'MuscleBlaze',
    date: '2024-01-15',
    orders: 3,
    revenue: 4500
  },
  {
    id: '2',
    source: 'youtube',
    campaign: 'Wellness Journey',
    influencer_id: '2',
    user_id: 'user_002',
    product: 'Multivitamin Pro',
    brand: 'HKVitals',
    date: '2024-01-18',
    orders: 5,
    revenue: 2800
  },
  {
    id: '3',
    source: 'instagram',
    campaign: 'Kids Nutrition',
    influencer_id: '3',
    user_id: 'user_003',
    product: 'Kids Growth Formula',
    brand: 'Gritzo',
    date: '2024-01-20',
    orders: 2,
    revenue: 1800
  }
];

export const mockPayouts: Payout[] = [
  {
    id: '1',
    influencer_id: '1',
    basis: 'post',
    rate: 25000,
    orders: 12,
    total_payout: 25000,
    campaign: 'Winter Fitness 2024',
    date: '2024-01-31'
  },
  {
    id: '2',
    influencer_id: '2',
    basis: 'order',
    rate: 150,
    orders: 18,
    total_payout: 2700,
    campaign: 'Wellness Journey',
    date: '2024-01-31'
  },
  {
    id: '3',
    influencer_id: '3',
    basis: 'post',
    rate: 15000,
    orders: 8,
    total_payout: 15000,
    campaign: 'Kids Nutrition',
    date: '2024-01-31'
  }
];