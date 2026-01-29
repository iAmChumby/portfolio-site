# Resume Compilation Guide

This directory contains the LaTeX source files for Luke Edwards' resume.

## Prerequisites

You need a LaTeX distribution installed on your system:

- **Windows:** [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/)
- **macOS:** [MacTeX](https://www.tug.org/mactex/) (TeX Live for Mac)
- **Linux:** Install TeX Live via your package manager
  ```bash
  # Ubuntu/Debian
  sudo apt-get install texlive-latex-base texlive-latex-extra

  # Fedora
  sudo dnf install texlive-scheme-basic
  ```

## Compilation

### Option 1: Using npm script (Recommended)

From the project root directory:

```bash
npm run resume:compile
```

### Option 2: Using compilation scripts directly

**Unix/Mac/Linux:**
```bash
cd docs/resume
chmod +x compile.sh  # Make executable (first time only)
./compile.sh
```

**Windows:**
```batch
cd docs\resume
compile.bat
```

### Option 3: Manual compilation

```bash
cd docs/resume
pdflatex resume.tex
pdflatex resume.tex  # Run twice for proper hyperlink resolution
cp resume.pdf ../../public/luke-edwards-resume.pdf
```

## Output

The compiled PDF will be placed in:
- `docs/resume/resume.pdf` (working copy)
- `public/luke-edwards-resume.pdf` (served on the website)

## Updating the Resume

1. Edit `resume.tex` with your changes
2. Run the compilation script
3. Verify the PDF looks correct
4. Test on the website at `/resume` route
5. Commit both the `.tex` file and the compiled PDF

## File Structure

```
docs/resume/
├── resume.tex        # LaTeX source file
├── compile.sh        # Unix/Mac compilation script
├── compile.bat       # Windows compilation script
├── README.md         # This file
└── old-resume.pdf    # Previous resume (backup)
```

## Troubleshooting

### LaTeX not found
- Make sure you have a LaTeX distribution installed
- Add the LaTeX bin directory to your PATH environment variable

### Compilation errors
- Check the `.log` file for detailed error messages
- Ensure all required packages are installed (geometry, enumitem, hyperref, xcolor, titlesec)
- MiKTeX will auto-install missing packages when configured

### PDF not updating on website
- Make sure the compilation script completed successfully
- Verify the file exists at `public/luke-edwards-resume.pdf`
- Clear your browser cache
- Restart the development server (`npm run dev`)

## LaTeX Packages Used

- **geometry** - Page margins and layout
- **enumitem** - Custom list formatting
- **hyperref** - Clickable links (email, LinkedIn, website)
- **xcolor** - Color support for links
- **titlesec** - Section heading formatting

All packages are standard and included in most LaTeX distributions.
