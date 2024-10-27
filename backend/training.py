import os
import matplotlib.pyplot as plt
import random
import numpy as np
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torch.nn as nn
from tqdm import tqdm


def train(model_path, train_loader, test_loader):
    model = torch.load(model_path)
    model.classifier = nn.Linear(in_features=40, out_features=2, bias=True)
    
    EPOCH = 15
    optimizer = optim.Adam(model.parameters(), lr=1e-5)
    criterion = nn.CrossEntropyLoss()#nn.BCELoss()
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, 
            mode='min', 
            factor=0.1, 
            patience=2, 
            verbose=True
    )

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)

    for epoch in range(EPOCH):
        running_loss = 0.0
        for i, data in tqdm(enumerate(train_loader)):
            inputs, targets = data 
            inputs = inputs.to(device)
            targets = targets.type(torch.LongTensor).to(device)

            # zero the parameter gradients
            optimizer.zero_grad()

            # forward + backward + optimize
            outputs = model(inputs)[1]
            
            loss = criterion(outputs, targets)

            loss.backward()
            optimizer.step()
            
            # print statistics
            running_loss += loss.item()
            if i % 50 == 49:    # print every 49 mini-batches
                print(f'[{epoch + 1}, {i + 1:5d}] loss: {running_loss / 50:.3f}')
                running_loss = 0.0
        
        model.eval()
        test_loss = 0
        test_correct = 0
        test_total = 0
        
        with torch.no_grad():
            for i, data in enumerate(test_loader, 0):
                inputs, targets = data
                inputs = inputs.to(device)
                targets = targets.type(torch.LongTensor).to(device)
                
                outputs = model(inputs)[1]
                loss = criterion(outputs, targets)
                    
                predicted = F.softmax(outputs).argmax(dim=-1)
                test_total += targets.size(0)
                test_correct += (predicted == targets).sum().item()
                    
                test_loss += loss.item()
            
        avg_test_loss = test_loss / len(test_loader)
        test_accuracy = 100. * test_correct / test_total
        print(f"Test Accuracy: {test_accuracy}")
            
        # Update learning rate
        scheduler.step(avg_test_loss)
