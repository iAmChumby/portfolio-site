#!/bin/bash

# Navigate to the resume directory
cd "$(dirname "$0")"

echo "Compiling LaTeX resume..."

# Compile with pdflatex (run twice for proper link resolution)
pdflatex -interaction=nonstopmode resume.tex
pdflatex -interaction=nonstopmode resume.tex

# Copy the compiled PDF to the public directory
cp resume.pdf ../../public/luke-edwards-resume.pdf

# Clean up auxiliary files
rm -f *.aux *.log *.out

echo "✓ Resume compiled successfully!"
echo "✓ Output: public/luke-edwards-resume.pdf"
