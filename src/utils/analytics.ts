import { Influencer, Post, TrackingData, Payout, CampaignMetrics, InfluencerPerformance } from '@/types';

export const calculateCampaignMetrics = (
  trackingData: TrackingData[],
  payouts: Payout[]
): CampaignMetrics => {
  const totalRevenue = trackingData.reduce((sum, data) => sum + data.revenue, 0);
  const totalSpend = payouts.reduce((sum, payout) => sum + payout.total_payout, 0);
  const totalOrders = trackingData.reduce((sum, data) => sum + data.orders, 0);
  
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const incrementalRoas = roas * 0.85; // Assuming 85% incrementality
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  return {
    totalRevenue,
    totalSpend,
    roas,
    incrementalRoas,
    totalOrders,
    averageOrderValue,
    totalReach: 0, // Will be calculated separately with posts data
    totalEngagements: 0 // Will be calculated separately with posts data
  };
};

export const calculateInfluencerPerformance = (
  influencers: Influencer[],
  posts: Post[],
  trackingData: TrackingData[],
  payouts: Payout[]
): InfluencerPerformance[] => {
  return influencers.map(influencer => {
    const influencerPosts = posts.filter(post => post.influencer_id === influencer.id);
    const influencerTracking = trackingData.filter(data => data.influencer_id === influencer.id);
    const influencerPayouts = payouts.filter(payout => payout.influencer_id === influencer.id);

    const revenue = influencerTracking.reduce((sum, data) => sum + data.revenue, 0);
    const orders = influencerTracking.reduce((sum, data) => sum + data.orders, 0);
    const reach = influencerPosts.reduce((sum, post) => sum + post.reach, 0);
    const engagements = influencerPosts.reduce((sum, post) => sum + post.likes + post.comments + (post.shares || 0), 0);
    const payout = influencerPayouts.reduce((sum, p) => sum + p.total_payout, 0);
    
    const roi = payout > 0 ? ((revenue - payout) / payout) * 100 : 0;

    return {
      influencer,
      revenue,
      orders,
      reach,
      engagements,
      payout,
      roi,
      posts: influencerPosts.length
    };
  });
};

export const getTopPerformers = (
  performances: InfluencerPerformance[],
  metric: 'revenue' | 'roi' | 'reach' | 'orders' = 'revenue',
  limit: number = 5
): InfluencerPerformance[] => {
  return [...performances]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, limit);
};

export const getPoorPerformers = (
  performances: InfluencerPerformance[],
  limit: number = 5
): InfluencerPerformance[] => {
  return [...performances]
    .sort((a, b) => a.roi - b.roi)
    .slice(0, limit);
};

export const getBestPersonas = (performances: InfluencerPerformance[]) => {
  const categoryPerformance = performances.reduce((acc, perf) => {
    const category = perf.influencer.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        totalRevenue: 0,
        totalPayout: 0,
        totalReach: 0,
        count: 0
      };
    }
    
    acc[category].totalRevenue += perf.revenue;
    acc[category].totalPayout += perf.payout;
    acc[category].totalReach += perf.reach;
    acc[category].count += 1;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(categoryPerformance)
    .map((cat: any) => ({
      ...cat,
      avgRoi: cat.totalPayout > 0 ? ((cat.totalRevenue - cat.totalPayout) / cat.totalPayout) * 100 : 0,
      avgReach: cat.count > 0 ? cat.totalReach / cat.count : 0
    }))
    .sort((a, b) => b.avgRoi - a.avgRoi);
};