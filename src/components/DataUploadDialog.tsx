import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon, FileTextIcon } from 'lucide-react';

interface DataUploadDialogProps {
  onDataUpload: (data: any) => void;
}

export const DataUploadDialog = ({ onDataUpload }: DataUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'manual' | 'csv'>('manual');
  const [formData, setFormData] = useState({
    influencerName: '',
    platform: '',
    campaign: '',
    reach: '',
    revenue: '',
    orders: '',
    payout: ''
  });
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {} as any);
        }).filter(row => Object.values(row).some(val => val !== ''));
        
        onDataUpload(data);
        toast({ title: "Success", description: `Uploaded ${data.length} records from CSV` });
        setIsOpen(false);
      };
      reader.readAsText(file);
    } else {
      toast({ title: "Error", description: "Please upload a valid CSV file" });
    }
  };

  const handleManualSubmit = () => {
    if (!formData.influencerName || !formData.platform || !formData.campaign) {
      toast({ title: "Error", description: "Please fill in required fields" });
      return;
    }

    const data = [{
      influencer_name: formData.influencerName,
      platform: formData.platform,
      campaign: formData.campaign,
      reach: parseInt(formData.reach) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      orders: parseInt(formData.orders) || 0,
      payout: parseFloat(formData.payout) || 0,
      date: new Date().toISOString().split('T')[0]
    }];

    onDataUpload(data);
    toast({ title: "Success", description: "Campaign data added successfully" });
    setIsOpen(false);
    setFormData({
      influencerName: '',
      platform: '',
      campaign: '',
      reach: '',
      revenue: '',
      orders: '',
      payout: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UploadIcon className="h-4 w-4" />
          Upload Campaign Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Campaign Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={uploadType === 'manual' ? 'default' : 'outline'}
              onClick={() => setUploadType('manual')}
              className="flex-1"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
            <Button
              variant={uploadType === 'csv' ? 'default' : 'outline'}
              onClick={() => setUploadType('csv')}
              className="flex-1"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              CSV Upload
            </Button>
          </div>

          {uploadType === 'csv' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="csvFile">Upload CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                CSV should include columns: influencer_name, platform, campaign, reach, revenue, orders, payout
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="influencerName">Influencer Name *</Label>
                <Input
                  id="influencerName"
                  value={formData.influencerName}
                  onChange={(e) => setFormData({...formData, influencerName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="campaign">Campaign Name *</Label>
                <Input
                  id="campaign"
                  value={formData.campaign}
                  onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="reach">Reach</Label>
                <Input
                  id="reach"
                  type="number"
                  value={formData.reach}
                  onChange={(e) => setFormData({...formData, reach: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="revenue">Revenue (₹)</Label>
                <Input
                  id="revenue"
                  type="number"
                  step="0.01"
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="orders">Orders</Label>
                <Input
                  id="orders"
                  type="number"
                  value={formData.orders}
                  onChange={(e) => setFormData({...formData, orders: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="payout">Payout (₹)</Label>
                <Input
                  id="payout"
                  type="number"
                  step="0.01"
                  value={formData.payout}
                  onChange={(e) => setFormData({...formData, payout: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Button onClick={handleManualSubmit} className="w-full">
                  Add Campaign Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};