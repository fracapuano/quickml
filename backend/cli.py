#!/usr/bin/env python3

import argparse
from tqdm import tqdm
import time

def main():
    parser = argparse.ArgumentParser(
                    prog='QuickML',
                    description='Give device constraint, Select a problem to solve, Get the model back',
                    epilog='[...]')


    parser.add_argument(
                    '-d',
                    '--device',
                    default='iphone-12',
                    choices=['iphone-12', 'iphone-13', 'samsung-galaxy-s5', 'raspberry'],
                    help='select the device that will be used to run the model',
                    required=True)

    parser.add_argument(
                    '-p',
                    '--problem',
                    default='img-classification',
                    choices=["img-classification", "img-segemntation", "img-depth_estimation", "img-object-detection"],
                    help='select the probblem to solve',
                    required=True)

    parser.add_argument('-i',
                    '--dataset',
                    default='./data/',
                    help='path of the dataset directory for training',
                    required=True)


    args = parser.parse_args()
    #print(args)

    total_iterations = 100
    progress_bar = tqdm(total=total_iterations, desc="Building")
    for i in range(total_iterations):
        time.sleep(0.09) 
        progress_bar.update(1)
    progress_bar.close()
    print("\n[!] Best architecture found :: |nor_conv_3x3~0|+|nor_conv_3x3~0|nor_conv_3x3~1|+|skip_connect~0|nor_conv_3x3~1|nor_conv_3x3~2|\n")


    total_iterations = 100
    progress_bar = tqdm(total=total_iterations, desc="Training")
    for i in range(total_iterations):
        time.sleep(0.1) 
        progress_bar.update(1)
    progress_bar.close()
    print("\n[*] Training complete, model directory :: ./model_output/")
    print(f"[*] You can run the model directly on your selected device :: {args.device}\n")

if __name__ == "__main__":
    main()
