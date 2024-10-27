from setuptools import setup, find_packages

setup(
    name="quickml",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "tqdm",
    ],
    entry_points={
        "console_scripts": [
            "quickml=backend.cli:main",
        ],
    },
)