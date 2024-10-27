"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for past models
const pastModels = [
  { id: 1, name: "Image Classifier v1", device: "iPhone 12", task: "Image Classification", status: "Completed", accuracy: "92%", createdAt: "2023-05-15" },
  { id: 2, name: "Object Detector v1", device: "iPhone 13", task: "Object Detection", status: "Training", accuracy: "N/A", createdAt: "2023-05-20" },
  { id: 3, name: "Segmentation Model v1", device: "iPhone 14", task: "Segmentation", status: "Failed", accuracy: "N/A", createdAt: "2023-05-22" },
  { id: 4, name: "Image Classifier v2", device: "iPhone 12", task: "Image Classification", status: "Completed", accuracy: "95%", createdAt: "2023-05-25" },
]

export default function PastModelsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Past Models</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.device}</TableCell>
                <TableCell>{model.task}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      model.status === "Completed" ? "default" :
                      model.status === "Training" ? "secondary" :
                      "destructive"
                    }
                  >
                    {model.status}
                  </Badge>
                </TableCell>
                <TableCell>{model.accuracy}</TableCell>
                <TableCell>{model.createdAt}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SidebarProvider>
  )
}
