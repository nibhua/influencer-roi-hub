import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrendingUpIcon, Loader2Icon, BarChart3Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceChart } from './PerformanceChart';

interface TrendAnalysisDialogProps {
  campaignData: any[];
}

export const TrendAnalysisDialog = ({ campaignData }: TrendAnalysisDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState('platform');
  const [trendData, setTrendData] = useState<any[]>([]);
  const [insights, setInsights] = useState('');
  const { toast } = useToast();

  const GEMINI_API_KEY = 'AIzaSyBQBABdgWaSX8qqjO9Tc0qcySppaePgu4s';

  const analyzeTrends = async () => {
    if (!campaignData.length) {
      toast({ title: "Error", description: "No campaign data available to analyze" });
      return;
    }

    setIsAnalyzing(true);

    // Process data based on analysis type
    let processedData: any[] = [];
    
    if (analysisType === 'platform') {
      const platformStats = campaignData.reduce((acc, item) => {
        const platform = item.platform || 'Unknown';
        if (!acc[platform]) {
          acc[platform] = { name: platform, revenue: 0, orders: 0, reach: 0, count: 0 };
        }
        acc[platform].revenue += item.revenue || 0;
        acc[platform].orders += item.orders || 0;
        acc[platform].reach += item.reach || 0;
        acc[platform].count += 1;
        return acc;
      }, {});
      
      processedData = Object.values(platformStats).map((platform: any) => ({
        name: platform.name,
        value: platform.revenue,
        revenue: platform.revenue,
        avgROI: platform.revenue > 0 ? ((platform.revenue - (platform.revenue * 0.2)) / (platform.revenue * 0.2)) * 100 : 0
      }));
    } else if (analysisType === 'temporal') {
      const monthlyStats = campaignData.reduce((acc, item) => {
        const month = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : 'Unknown';
        if (!acc[month]) {
          acc[month] = { name: month, revenue: 0, orders: 0 };
        }
        acc[month].revenue += item.revenue || 0;
        acc[month].orders += item.orders || 0;
        return acc;
      }, {});
      
      processedData = Object.values(monthlyStats).map((month: any) => ({
        name: month.name,
        value: month.revenue,
        orders: month.orders
      }));
    } else if (analysisType === 'influencer') {
      const influencerStats = campaignData.reduce((acc, item) => {
        const influencer = item.influencer_name || 'Unknown';
        if (!acc[influencer]) {
          acc[influencer] = { name: influencer, revenue: 0, orders: 0, campaigns: 0 };
        }
        acc[influencer].revenue += item.revenue || 0;
        acc[influencer].orders += item.orders || 0;
        acc[influencer].campaigns += 1;
        return acc;
      }, {});
      
      processedData = Object.values(influencerStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10)
        .map((influencer: any) => ({
          name: influencer.name.split(' ')[0],
          value: influencer.revenue,
          campaigns: influencer.campaigns
        }));
    }

    setTrendData(processedData);

    // Generate AI insights
    try {
      const prompt = `Analyze these ${analysisType} trends from influencer campaign data and provide actionable insights and recommendations. Data: ${JSON.stringify(processedData)}. Provide specific insights about patterns, opportunities, and optimization strategies.`;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiInsights = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights generated';
        setInsights(aiInsights);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Trend analysis completed. Check the chart for visual patterns and opportunities.');
    }

    setIsAnalyzing(false);
    toast({ title: "Success", description: "Trend analysis completed!" });
  };

  const getChartTitle = () => {
    switch (analysisType) {
      case 'platform': return 'Revenue by Platform';
      case 'temporal': return 'Revenue Over Time';
      case 'influencer': return 'Top Influencers by Revenue';
      default: return 'Trend Analysis';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TrendingUpIcon className="h-4 w-4" />
          Analyze Trends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>AI-Powered Trend Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="analysisType">Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform Performance</SelectItem>
                  <SelectItem value="temporal">Time-based Trends</SelectItem>
                  <SelectItem value="influencer">Influencer Rankings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={analyzeTrends} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3Icon className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {trendData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{getChartTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart
                    title=""
                    data={trendData}
                    type="bar"
                    dataKey="value"
                    color="hsl(195 85% 45%)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap">
                    {insights || 'Run analysis to generate insights...'}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};