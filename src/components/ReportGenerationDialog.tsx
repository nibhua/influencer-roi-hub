import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileTextIcon, Loader2Icon, DownloadIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportGenerationDialogProps {
  campaignData: any[];
}

export const ReportGenerationDialog = ({ campaignData }: ReportGenerationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('performance');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const { toast } = useToast();

  const GEMINI_API_KEY = 'AIzaSyBQBABdgWaSX8qqjO9Tc0qcySppaePgu4s';

  const generateReport = async () => {
    if (!campaignData.length) {
      toast({ title: "Error", description: "No campaign data available to analyze" });
      return;
    }

    setIsGenerating(true);

    const reportPrompts = {
      performance: `Analyze this influencer campaign data and provide a comprehensive performance report. Include key metrics, top performers, ROI analysis, and actionable insights: ${JSON.stringify(campaignData)}`,
      insights: `Generate strategic insights from this influencer campaign data. Focus on trends, opportunities, and recommendations for optimization: ${JSON.stringify(campaignData)}`,
      roi: `Perform detailed ROI analysis on this influencer campaign data. Calculate return on investment, identify best performing segments, and provide financial recommendations: ${JSON.stringify(campaignData)}`,
      custom: customPrompt || 'Analyze this data and provide insights: ' + JSON.stringify(campaignData)
    };

    try {
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
                  text: reportPrompts[reportType as keyof typeof reportPrompts]
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const report = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated';
      
      setGeneratedReport(report);
      toast({ title: "Success", description: "Report generated successfully!" });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({ title: "Error", description: "Failed to generate report. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Success", description: "Report downloaded successfully!" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileTextIcon className="h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>AI-Powered Report Generation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance Analysis</SelectItem>
                  <SelectItem value="insights">Strategic Insights</SelectItem>
                  <SelectItem value="roi">ROI Analysis</SelectItem>
                  <SelectItem value="custom">Custom Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data Points</Label>
              <div className="text-sm text-muted-foreground mt-1">
                {campaignData.length} campaign records available
              </div>
            </div>
          </div>

          {reportType === 'custom' && (
            <div>
              <Label htmlFor="customPrompt">Custom Analysis Prompt</Label>
              <Textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe what specific analysis you want on the campaign data..."
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
            {generatedReport && (
              <Button onClick={downloadReport} variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>

          {generatedReport && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label>Generated Report</Label>
                  <div className="max-h-[300px] overflow-y-auto p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
                    {generatedReport}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};