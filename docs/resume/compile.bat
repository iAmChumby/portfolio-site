@echo off
cd /d "%~dp0"

echo Compiling LaTeX resume...

REM Compile with pdflatex (run twice for proper link resolution)
pdflatex -interaction=nonstopmode resume.tex
pdflatex -interaction=nonstopmode resume.tex

REM Copy the compiled PDF to the public directory
copy /Y resume.pdf ..\..\public\luke-edwards-resume.pdf

REM Clean up auxiliary files
del *.aux *.log *.out 2>nul

echo.
echo Resume compiled successfully!
echo Output: public\luke-edwards-resume.pdf
