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
