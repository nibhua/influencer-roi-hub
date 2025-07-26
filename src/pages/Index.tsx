import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MetricCard } from '@/components/MetricCard';
import { InfluencerTable } from '@/components/InfluencerTable';
import { PerformanceChart } from '@/components/PerformanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUpIcon, 
  DollarSignIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  EyeIcon,
  HeartIcon,
  UploadIcon,
  FileTextIcon
} from 'lucide-react';

import { mockInfluencers, mockPosts, mockTrackingData, mockPayouts } from '@/data/mockData';
import { 
  calculateCampaignMetrics, 
  calculateInfluencerPerformance, 
  getTopPerformers,
  getPoorPerformers,
  getBestPersonas
} from '@/utils/analytics';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate metrics
  const campaignMetrics = useMemo(() => 
    calculateCampaignMetrics(mockTrackingData, mockPayouts), 
    []
  );

  const influencerPerformances = useMemo(() => 
    calculateInfluencerPerformance(mockInfluencers, mockPosts, mockTrackingData, mockPayouts),
    []
  );

  const topPerformers = useMemo(() => 
    getTopPerformers(influencerPerformances, 'revenue'), 
    [influencerPerformances]
  );

  const poorPerformers = useMemo(() => 
    getPoorPerformers(influencerPerformances), 
    [influencerPerformances]
  );

  const bestPersonas = useMemo(() => 
    getBestPersonas(influencerPerformances), 
    [influencerPerformances]
  );

  // Chart data
  const revenueChartData = topPerformers.map(perf => ({
    name: perf.influencer.name.split(' ')[0],
    value: perf.revenue,
    revenue: perf.revenue,
    roi: perf.roi
  }));

  const platformChartData = mockInfluencers.reduce((acc, influencer) => {
    const perf = influencerPerformances.find(p => p.influencer.id === influencer.id);
    const existing = acc.find(item => item.name === influencer.platform);
    
    if (existing) {
      existing.value += perf?.revenue || 0;
    } else {
      acc.push({
        name: influencer.platform,
        value: perf?.revenue || 0
      });
    }
    return acc;
  }, [] as any[]);

  const categoryChartData = bestPersonas.map(persona => ({
    name: persona.category,
    value: persona.avgRoi,
    revenue: persona.totalRevenue
  }));

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader onExport={handleExport} />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Revenue"
                value={campaignMetrics.totalRevenue}
                format="currency"
                change={12.5}
                icon={<DollarSignIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="ROAS"
                value={campaignMetrics.roas}
                format="number"
                change={8.2}
                icon={<TrendingUpIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="Total Orders"
                value={campaignMetrics.totalOrders}
                format="number"
                change={-2.1}
                icon={<ShoppingCartIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="Active Influencers"
                value={mockInfluencers.length}
                format="number"
                change={5.3}
                icon={<UsersIcon className="h-4 w-4" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart
                title="Top Performers by Revenue"
                data={revenueChartData}
                type="bar"
                dataKey="value"
                color="hsl(195 85% 45%)"
              />
              <PerformanceChart
                title="Revenue by Platform"
                data={platformChartData}
                type="pie"
                dataKey="value"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Upload Campaign Data
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <TrendingUpIcon className="h-4 w-4" />
                    Analyze Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Influencer Performance</h2>
              <Badge variant="secondary">
                {influencerPerformances.length} influencers
              </Badge>
            </div>
            <InfluencerTable data={influencerPerformances} />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <h2 className="text-2xl font-bold">Campaign Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart
                title="Category Performance (ROI %)"
                data={categoryChartData}
                type="bar"
                dataKey="value"
                color="hsl(142 85% 45%)"
              />
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Campaigns</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Campaigns</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Campaign ROAS</span>
                    <span className="font-bold">{campaignMetrics.roas.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Spend</span>
                    <span className="font-bold">
                      {new Intl.NumberFormat('en-IN', { 
                        style: 'currency', 
                        currency: 'INR',
                        notation: 'compact'
                      }).format(campaignMetrics.totalSpend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topPerformers.slice(0, 3).map((perf, index) => (
                    <div key={perf.influencer.id} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{perf.influencer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('en-IN', { 
                              style: 'currency', 
                              currency: 'INR',
                              notation: 'compact'
                            }).format(perf.revenue)} revenue
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        {perf.roi.toFixed(1)}% ROI
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Needs Attention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {poorPerformers.slice(0, 3).map((perf, index) => (
                    <div key={perf.influencer.id} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{perf.influencer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat('en-IN', { 
                              style: 'currency', 
                              currency: 'INR',
                              notation: 'compact'
                            }).format(perf.revenue)} revenue
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-warning border-warning">
                        {perf.roi.toFixed(1)}% ROI
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
