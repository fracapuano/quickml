import CoreImage
import CoreML
import SwiftUI
import os
import Vision

@MainActor
final class DataModel: ObservableObject {
    let camera = Camera()
    let context = CIContext()

    /// The image classification model.
    private var resnetModel: Resnet50FP16?

    @Published var classificationLabel: String = ""

    private var visionModel: VNCoreMLModel?

    init() {
        Task {
            try? await loadModel()
            await handleCameraFeed()
        }
    }
    
    private func handleCameraFeed() async {
        let imageStream = camera.previewStream
        for await image in imageStream {
            await classifyImage(image)
        }
    }

    private func loadModel() async throws {
        print("Loading model...")

        let clock = ContinuousClock()
        let start = clock.now

        resnetModel = try Resnet50FP16()
        print("ResNet50 input description: \(resnetModel!.model.description)")
        visionModel = try VNCoreMLModel(for: resnetModel!.model)

        let duration = clock.now - start
        print("Model loaded (took \(duration.formatted(.units(allowed: [.seconds, .milliseconds]))))")
    }

    private func classifyImage(_ image: CIImage) async {
        guard let visionModel else { return }

        do {
            let request = VNCoreMLRequest(model: visionModel)
            request.imageCropAndScaleOption = .centerCrop
            
            let handler = VNImageRequestHandler(ciImage: image, orientation: .up)
            try handler.perform([request])
            
            if let results = request.results as? [VNClassificationObservation],
               let topResult = results.first {
                await updateClassificationLabel(topResult.identifier)
            }
        } catch {
            print("Classification error: \(error)")
        }
    }
    
    private func updateClassificationLabel(_ label: String) {
        classificationLabel = label
    }
}
