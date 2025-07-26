import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon, 
  format = 'number',
  className 
}: MetricCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          notation: val > 100000 ? 'compact' : 'standard'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-IN', {
          notation: val > 100000 ? 'compact' : 'standard'
        }).format(val);
    }
  };

  const getChangeColor = () => {
    if (change === undefined) return '';
    return change >= 0 ? 'text-metric-positive' : 'text-metric-negative';
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;
    return change >= 0 ? (
      <ArrowUpIcon className="h-3 w-3" />
    ) : (
      <ArrowDownIcon className="h-3 w-3" />
    );
  };

  return (
    <Card className={cn("hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center text-xs mt-1", getChangeColor())}>
            {getChangeIcon()}
            <span className="ml-1">
              {Math.abs(change).toFixed(1)}% {changeLabel || 'from last month'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};