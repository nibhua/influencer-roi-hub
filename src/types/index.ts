export interface Influencer {
  id: string;
  name: string;
  category: 'fitness' | 'lifestyle' | 'nutrition' | 'wellness' | 'sports';
  gender: 'male' | 'female' | 'other';
  followerCount: number;
  platform: 'instagram' | 'youtube' | 'twitter' | 'tiktok';
  avatar?: string;
  engagement_rate?: number;
}

export interface Post {
  id: string;
  influencer_id: string;
  platform: 'instagram' | 'youtube' | 'twitter' | 'tiktok';
  date: string;
  url: string;
  caption: string;
  reach: number;
  likes: number;
  comments: number;
  shares?: number;
}

export interface TrackingData {
  id: string;
  source: string;
  campaign: string;
  influencer_id: string;
  user_id: string;
  product: string;
  brand: 'MuscleBlaze' | 'HKVitals' | 'Gritzo' | 'HealthKart';
  date: string;
  orders: number;
  revenue: number;
}

export interface Payout {
  id: string;
  influencer_id: string;
  basis: 'post' | 'order';
  rate: number;
  orders: number;
  total_payout: number;
  campaign: string;
  date: string;
}

export interface CampaignMetrics {
  totalRevenue: number;
  totalSpend: number;
  roas: number;
  incrementalRoas: number;
  totalOrders: number;
  averageOrderValue: number;
  totalReach: number;
  totalEngagements: number;
}

export interface InfluencerPerformance {
  influencer: Influencer;
  revenue: number;
  orders: number;
  reach: number;
  engagements: number;
  payout: number;
  roi: number;
  posts: number;
}