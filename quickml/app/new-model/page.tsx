"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import ReactConfetti from 'react-confetti'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  device: z.string(),
  task: z.string(),
  data: z.string(),
})

export default function Page() {
  const [isBuilding, setIsBuilding] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [experimentId, setExperimentId] = useState<number | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [modelArchitecture, setModelArchitecture] = useState("")
  const [showExperimentDescription, setShowExperimentDescription] = useState(false)
  const [experimentDescription, setExperimentDescription] = useState("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device: "",
      task: "",
      data: "",
    },
  })

  useEffect(() => {
    if (trainingProgress === 100) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000) // Stop confetti after 5 seconds
    }
  }, [trainingProgress])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsBuilding(true)
    setBuildProgress(0)
    setTrainingProgress(0)
    setSelectedDevice(values.device)

    // Simulate building architecture
    for (let i = 0; i <= 100; i += 20) {
      setBuildProgress(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsBuilding(false)
    setIsTraining(true)
    setModelArchitecture("|nor_conv_3x3~0|+|nor_conv_3x3~0|nor_conv_3x3~1|+|skip_connect~0|nor_conv_3x3~1|nor_conv_3x3~2|")

    try {
      const response = await fetch('http://localhost:8000/request_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setExperimentId(data.experiment_id)

      // Start training progress after building is complete
      for (let i = 0; i <= 100; i += 10) {
        setTrainingProgress(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

    } catch (error) {
      console.error('Error:', error)
      setIsBuilding(false)
      setIsTraining(false)
      setTrainingProgress(0)
    }
  }

  const mockFileUpload = (file: File) => {
    setIsUploading(true)
    // Simulate file upload delay
    setTimeout(() => {
      setIsUploading(false)
      form.setValue('data', 'https://occhidelcuorelabs.com/model-dataset-2481/uploaded-file')
    }, 2000)
  }

  async function handleExperimentDescription() {
    if (!experimentDescription) {
      toast({
        title: "Error",
        description: "Please provide an experiment description.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/suggest-parameters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: experimentDescription }),
      })

      if (!response.ok) {
        throw new Error('Failed to get parameter suggestions')
      }

      const data = await response.json()
      form.setValue('device', data.device)
      form.setValue('task', data.task)

      toast({
        title: "Parameters Suggested",
        description: "The form has been updated with suggested parameters.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to get parameter suggestions. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {showConfetti && (
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        <div className="flex justify-center items-start min-h-screen pt-24 px-4">
          <div className="w-full max-w-2xl space-y-6">
            {!isBuilding && !isTraining ? (
              <>
                <h2 className="text-3xl font-bold tracking-tight text-center">Create New Model 🧪</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {!showExperimentDescription ? (
                      <>
                        <FormField
                          control={form.control}
                          name="device"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Device</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a device" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="iphone-12">iPhone 12</SelectItem>
                                  <SelectItem value="iphone-13">iPhone 13</SelectItem>
                                  <SelectItem value="iphone-14">iPhone 14</SelectItem>
                                  <SelectItem value="microscope">Microscope</SelectItem>
                                  <SelectItem value="fmri">fMRI Scanner</SelectItem>
                                  <SelectItem value="eeg">EEG Device</SelectItem>
                                  <SelectItem value="mass-spec">Mass Spectrometer</SelectItem>
                                  <SelectItem value="sequencer">DNA Sequencer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select the target device or instrument for your model.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="task"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Task</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a task" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="img-classification">Image Classification</SelectItem>
                                  <SelectItem value="object-detection">Object Detection</SelectItem>
                                  <SelectItem value="segmentation">Segmentation</SelectItem>
                                  <SelectItem value="cell-counting">Cell Counting</SelectItem>
                                  <SelectItem value="brain-tumor-detection">Brain Tumor Detection</SelectItem>
                                  <SelectItem value="eeg-analysis">EEG Signal Analysis</SelectItem>
                                  <SelectItem value="protein-structure">Protein Structure Prediction</SelectItem>
                                  <SelectItem value="gene-expression">Gene Expression Analysis</SelectItem>
                                  <SelectItem value="drug-discovery">Drug Discovery</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the machine learning task for your model.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="data"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Training Data</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      mockFileUpload(e.target.files[0])
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Upload your training data file.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {isUploading && <p>Uploading...</p>}
                        {form.watch('data') && !isUploading && (
                          <p>File uploaded successfully: {form.watch('data')}</p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Describe your experiment..."
                          value={experimentDescription}
                          onChange={(e) => setExperimentDescription(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-between items-centier gap-2">
                      <Button type="submit" className="w-full">Start Building and Training</Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => setShowExperimentDescription(!showExperimentDescription)}>
                        Not sure?
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            ) : isBuilding ? (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Building Model Architecture</CardTitle>
                  <CardDescription>Please wait while we design the optimal architecture for your model</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={buildProgress} className="w-full h-4 mb-4" />
                  <p className="text-center font-semibold">{buildProgress}% Complete</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="w-full mb-6">
                  <CardHeader>
                    <CardTitle>Model Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                      {modelArchitecture}
                    </pre>
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Training in Progress</CardTitle>
                    <CardDescription>Please wait while your model is being trained</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={trainingProgress} className="w-full h-4 mb-4" />
                    <p className="text-center font-semibold">{trainingProgress}% Complete</p>
                  </CardContent>
                </Card>
              </>
            )}
            {trainingProgress === 100 && (
              <Card className="w-full mt-6 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Training Complete! 🎉</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Congratulations! Your model (Experiment ID: {experimentId}) has been successfully trained.
                  </p>
                  <p className="text-green-700 mb-4">
                    You can now use this model on your {selectedDevice} for {form.getValues().task} tasks.
                  </p>
                  <Button onClick={() => {
                    setIsBuilding(false)
                    setIsTraining(false)
                    setTrainingProgress(0)
                    setBuildProgress(0)
                    setModelArchitecture("")
                  }} className="w-full">
                    Create Another Model
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
