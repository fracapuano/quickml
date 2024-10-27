"use client"

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FileDown } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Mock data for experiments
const experiments = [
  { id: "exp1", name: "Experiment 1 - Baseline Model" },
  { id: "exp2", name: "Experiment 2 - Improved CNN" },
  { id: "exp3", name: "Experiment 3 - Transfer Learning" },
]

// Mock data for the dashboard
const experimentData = {
  exp1: {
    modelPerformance: {
      accuracy: 95.5,
      precision: 94.2,
      recall: 96.8,
      f1Score: 95.5,
    },
    recentPredictions: [
      { id: 1, result: "Malignant", confidence: 98.2, date: "2023-06-01" },
      { id: 2, result: "Benign", confidence: 95.7, date: "2023-06-02" },
      { id: 3, result: "Malignant", confidence: 99.1, date: "2023-06-03" },
      { id: 4, result: "Benign", confidence: 97.3, date: "2023-06-04" },
    ],
    monthlyData: [
      { month: 'Jan', scans: 120, malignant: 35 },
      { month: 'Feb', scans: 150, malignant: 42 },
      { month: 'Mar', scans: 180, malignant: 55 },
      { month: 'Apr', scans: 200, malignant: 60 },
      { month: 'May', scans: 220, malignant: 65 },
      { month: 'Jun', scans: 250, malignant: 75 },
    ],
  },
  exp2: {
    modelPerformance: {
      accuracy: 97.2,
      precision: 96.8,
      recall: 97.5,
      f1Score: 97.1,
    },
    recentPredictions: [
      { id: 1, result: "Benign", confidence: 99.1, date: "2023-07-01" },
      { id: 2, result: "Malignant", confidence: 98.3, date: "2023-07-02" },
      { id: 3, result: "Benign", confidence: 97.8, date: "2023-07-03" },
      { id: 4, result: "Malignant", confidence: 99.5, date: "2023-07-04" },
    ],
    monthlyData: [
      { month: 'Jan', scans: 130, malignant: 38 },
      { month: 'Feb', scans: 160, malignant: 45 },
      { month: 'Mar', scans: 190, malignant: 58 },
      { month: 'Apr', scans: 210, malignant: 63 },
      { month: 'May', scans: 230, malignant: 68 },
      { month: 'Jun', scans: 260, malignant: 78 },
    ],
  },
  exp3: {
    modelPerformance: {
      accuracy: 98.1,
      precision: 97.9,
      recall: 98.3,
      f1Score: 98.1,
    },
    recentPredictions: [
      { id: 1, result: "Malignant", confidence: 99.7, date: "2023-08-01" },
      { id: 2, result: "Benign", confidence: 98.9, date: "2023-08-02" },
      { id: 3, result: "Malignant", confidence: 99.8, date: "2023-08-03" },
      { id: 4, result: "Benign", confidence: 99.2, date: "2023-08-04" },
    ],
    monthlyData: [
      { month: 'Jan', scans: 140, malignant: 40 },
      { month: 'Feb', scans: 170, malignant: 48 },
      { month: 'Mar', scans: 200, malignant: 60 },
      { month: 'Apr', scans: 220, malignant: 66 },
      { month: 'May', scans: 240, malignant: 72 },
      { month: 'Jun', scans: 270, malignant: 81 },
    ],
  },
}

// Mock function to generate PDF report
async function generatePDFReport(experimentId: string, data: any) {
  // In a real application, this would be an API call to your GPT-4 endpoint
  const response = await fetch('/api/generate-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ experimentId, data }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `experiment_${experimentId}_report.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [selectedExperiment, setSelectedExperiment] = useState("exp1")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const { toast } = useToast()
  const data = experimentData[selectedExperiment as keyof typeof experimentData]

  const handleExportReport = async () => {
    setIsGeneratingReport(true)
    try {
      await generatePDFReport(selectedExperiment, data)
      toast({
        title: "Report Generated",
        description: "Your PDF report has been successfully generated and downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold">Cancer Detection Dashboard</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex space-x-4">
              <Select onValueChange={setSelectedExperiment} defaultValue={selectedExperiment}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select experiment" />
                </SelectTrigger>
                <SelectContent>
                  {experiments.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport} disabled={isGeneratingReport}>
                {isGeneratingReport ? (
                  "Generating..."
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" /> Export Report
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.modelPerformance.accuracy}%</div>
                <Progress value={data.modelPerformance.accuracy} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.modelPerformance.precision}%</div>
                <Progress value={data.modelPerformance.precision} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recall</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.modelPerformance.recall}%</div>
                <Progress value={data.modelPerformance.recall} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.modelPerformance.f1Score}%</div>
                <Progress value={data.modelPerformance.f1Score} className="mt-2" />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Scans and Malignant Cases</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scans" fill="#8884d8" />
                    <Bar dataKey="malignant" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {data.recentPredictions.map((prediction: { id: Key | null | undefined; result: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; confidence: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; date: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }) => (
                    <div className="flex items-center" key={prediction.id}>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {prediction.result}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {prediction.confidence}%
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {prediction.date}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
