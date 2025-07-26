import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  roi?: number;
  reach?: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  title: string;
  dataKey: string;
  color?: string;
}

const COLORS = ['hsl(195 85% 45%)', 'hsl(142 85% 45%)', 'hsl(38 85% 55%)', 'hsl(0 75% 55%)', 'hsl(195 20% 95%)'];

export const PerformanceChart = ({ 
  data, 
  type, 
  title, 
  dataKey, 
  color = 'hsl(195 85% 45%)' 
}: PerformanceChartProps) => {
  const formatTooltipValue = (value: number, name: string) => {
    if (name.includes('Revenue') || name.includes('Payout')) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact'
      }).format(value);
    }
    if (name.includes('ROI') || name.includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    return new Intl.NumberFormat('en-IN', {
      notation: 'compact'
    }).format(value);
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => formatTooltipValue(value, dataKey)}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value, name),
                  name
                ]}
              />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => formatTooltipValue(value, dataKey)}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value, name),
                  name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value, name),
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="outline" className="text-xs">
          {data.length} items
        </Badge>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};