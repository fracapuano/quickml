"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useState } from 'react'
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
import {
  SidebarProvider,
} from "@/components/ui/sidebar"

const formSchema = z.object({
  device: z.string(),
  task: z.string(),
  data: z.string(),
})

export default function NewModelPage() {
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device: '',
      task: '',
      data: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your backend
  }

  const mockFileUpload = (file: File) => {
    setIsUploading(true)
    // Simulate file upload delay
    setTimeout(() => {
      setIsUploading(false)
      form.setValue('data', 'https://occhidelcuorelabs.com/model-dataset-2481/uploaded-file')
    }, 2000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-y-auto flex justify-center">
        <div className="max-w-2xl w-full pt-12">
          <h1 className="text-2xl font-bold mb-6">Create New Model</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        <SelectItem value="microscope">Microscope</SelectItem>
                        <SelectItem value="fmri">fMRI Scanner</SelectItem>
                        <SelectItem value="eeg">EEG Device</SelectItem>
                        <SelectItem value="mass-spec">Mass Spectrometer</SelectItem>
                        <SelectItem value="sequencer">DNA Sequencer</SelectItem>
                        <SelectItem value="iphone-12">iPhone 12</SelectItem>
                        <SelectItem value="iphone-13">iPhone 13</SelectItem>
                        <SelectItem value="iphone-14">iPhone 14</SelectItem>
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
              <Button type="submit" className="w-full">Create Model</Button>
            </form>
          </Form>
        </div>
      </div>
    </SidebarProvider>
  )
}
