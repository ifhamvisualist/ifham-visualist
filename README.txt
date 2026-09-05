IFHAM KHAN — THE VISUALIST — V14

FIX INCLUDED:
The 3D discipline environment is now matched to the visible discipline name, not the old internal folder ID. This prevents stale/localStorage IDs from causing (for example) LOGO DESIGN to show the FILMMAKING camera.

Examples:
- FILMMAKING → cinematic camera environment
- EDITING → editing timeline environment
- GRAPHIC DESIGN → graphic construction environment
- COLOR GRADING → color wheel / grading environment
- PHOTOGRAPHY → camera lens environment
- 3D ART → wireframe mesh environment
- LOGO DESIGN → identity grid / logo environment
- MOTION / VISUALS → motion trails environment

GitHub media folders are also resolved using the discipline kind, so media/photography, media/editing, media/color, etc. remain stable even if old local folder IDs were changed.

The site remains standalone: portfolio text/structure uses browser storage and GitHub Pages can serve published media from the repository.

PDF SUPPORT: GitHub media folders now automatically load PDF files. PDFs can be previewed inside the portfolio folder viewer and opened in a new tab. The local editor also accepts PDF uploads.


FINAL PDF SUPPORT: PDF files in media folders are embedded for in-page viewing. The portfolio does not add a download/open-PDF button. The browser's own PDF viewer controls may still provide downloading depending on the visitor's browser; this cannot be disabled reliably by a static website.


V16 PDF FIX
PDF files are discovered from /media/<discipline> and rendered using same-origin GitHub Pages URLs, avoiding raw.githubusercontent.com download/embed issues. index.html uses app.js?v=16 to bypass stale browser cache.
