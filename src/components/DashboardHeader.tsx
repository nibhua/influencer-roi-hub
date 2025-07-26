import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, DownloadIcon, FilterIcon, TrendingUpIcon } from "lucide-react";

interface DashboardHeaderProps {
  onFilterChange?: (filters: any) => void;
  onExport?: () => void;
}

export const DashboardHeader = ({ onFilterChange, onExport }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUpIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Influencer ROI Hub
            </h1>
            <p className="text-muted-foreground">
              Track campaign performance and optimize influencer investments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-success/10 text-success">
            Live Data
          </Badge>
          <Badge variant="outline">
            Last updated: 2 min ago
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select defaultValue="30d">
          <SelectTrigger className="w-32">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="muscleblaze">MuscleBlaze</SelectItem>
            <SelectItem value="hkvitals">HKVitals</SelectItem>
            <SelectItem value="gritzo">Gritzo</SelectItem>
            <SelectItem value="healthkart">HealthKart</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onExport}
          className="gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};