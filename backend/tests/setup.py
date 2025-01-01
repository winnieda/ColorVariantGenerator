from setuptools import setup, find_packages

setup(
    name="backend",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "SQLAlchemy>=1.4",
        "pytest>=8.0",
        "PyMySQL",
    ],
    extras_require={
        "dev": ["pytest", "pytest-cov"],
    },
)
