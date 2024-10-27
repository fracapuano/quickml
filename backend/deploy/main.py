from pydantic import BaseModel
import coremltools as ct
import torch
import torch.nn as nn

class SingleOutputWrapper(nn.Module):
    def __init__(self, original_model):
        super().__init__()
        self.model = original_model
    
    def forward(self, x):
        _, logits = self.model(x)
        # Return only the first output
        return nn.functional.softmax(logits)

class MLPackageExporter(BaseModel):
    model_path: str
    input_shape: tuple
    class_labels: list
    model_name: str

    def torch_to_coreml(self):
        torch_model = torch.load(
            self.model_path, 
            map_location=torch.device('cpu')
            )
        
        # wrapping the model to one output layer only
        torch_model = SingleOutputWrapper(
            torch_model
        )

        example_input = torch.rand(*self.input_shape)
        traced_model = torch.jit.trace(torch_model, example_input)

        image_input = ct.ImageType(name="image", shape=self.input_shape)
        classifier_config = ct.ClassifierConfig(self.class_labels)
        
        model_from_trace = ct.convert(
            traced_model,
            inputs=[image_input],
            classifier_config = classifier_config
        )

        model_from_trace.save(self.model_name)
        return True

# Usage
if __name__ == "__main__":
    # exporter for this use case, this could become an endpoint
    exporter = MLPackageExporter(
        model_path="deploy/assets/cancer_detection.pth",
        input_shape=(1, 3, 224, 224),
        class_labels=["Healthy tissue", "Unhealthy tissue"],
        model_name="quickml-tissue-cancer.mlpackage"
    )
    success = exporter.torch_to_coreml()
