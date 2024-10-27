import SwiftUI

struct CameraView: View {
    @StateObject private var model = DataModel()

    var body: some View {
        NavigationStack {
            GeometryReader { geometry in
                VStack {
                    ViewfinderView(session: model.camera.captureSession)
                        .frame(width: geometry.size.width, height: geometry.size.height * 0.9)
                    Text("Classification: \(model.classificationLabel)")
                        .padding()
                        .frame(width: geometry.size.width, height: geometry.size.height * 0.1)
                        .background(Color.black.opacity(0.7))
                        .foregroundColor(.white)
                }
            }
            .task {
                await model.camera.start()
            }
            .navigationTitle("Camera")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarHidden(true)
            .statusBar(hidden: true)
            .ignoresSafeArea()
        }
    }
}
