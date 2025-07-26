import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { InfluencerPerformance } from "@/types";
import { cn } from "@/lib/utils";

interface InfluencerTableProps {
  data: InfluencerPerformance[];
}

export const InfluencerTable = ({ data }: InfluencerTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: amount > 100000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      notation: num > 100000 ? 'compact' : 'standard'
    }).format(num);
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'bg-pink-100 text-pink-800',
      youtube: 'bg-red-100 text-red-800',
      twitter: 'bg-blue-100 text-blue-800',
      tiktok: 'bg-purple-100 text-purple-800'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: 'bg-green-100 text-green-800',
      wellness: 'bg-blue-100 text-blue-800',
      nutrition: 'bg-orange-100 text-orange-800',
      lifestyle: 'bg-purple-100 text-purple-800',
      sports: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Influencer</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Reach</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead className="text-right">Payout</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((influencer) => (
            <TableRow key={influencer.influencer.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {influencer.influencer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{influencer.influencer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(influencer.influencer.followerCount)} followers
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={cn("capitalize", getPlatformColor(influencer.influencer.platform))}
                >
                  {influencer.influencer.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn("capitalize", getCategoryColor(influencer.influencer.category))}
                >
                  {influencer.influencer.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(influencer.revenue)}
              </TableCell>
              <TableCell className="text-right">
                {influencer.orders}
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(influencer.reach)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {influencer.roi > 0 ? (
                    <TrendingUpIcon className="h-3 w-3 text-metric-positive" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3 text-metric-negative" />
                  )}
                  <span className={cn(
                    "font-medium",
                    influencer.roi > 0 ? "text-metric-positive" : "text-metric-negative"
                  )}>
                    {influencer.roi.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(influencer.payout)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};