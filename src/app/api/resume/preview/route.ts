import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Disable worker for server-side rendering in Node.js
// We'll use the synchronous API instead
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

export async function GET(request: NextRequest) {
  try {
    // Read PDF file from public directory
    const pdfPath = join(process.cwd(), 'public', 'luke-edwards-resume.pdf');
    const pdfBuffer = await readFile(pdfPath);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;

    // Get first page
    const page = await pdf.getPage(1);

    // Set scale for high-quality rendering (2x for retina displays)
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    // Create canvas with Node.js canvas library
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context as any,
      viewport: viewport,
      canvas: canvas as any,
    };

    await page.render(renderContext).promise;

    // Convert canvas to PNG buffer
    const imageBuffer = canvas.toBuffer('image/png');

    // Return image with appropriate headers
    return new NextResponse(imageBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating resume preview:', error);

    // Return 500 error with user-friendly message
    return NextResponse.json(
      {
        error: 'Failed to generate resume preview',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
