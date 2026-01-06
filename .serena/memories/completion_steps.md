When finishing a task:
- Run npm run lint if TS/TSX changes in frontend.
- Run npm run build if build validity matters.
- Manually verify UI via npm run dev/preview if UI or styles changed.
- For API changes, run npm run dev:api and hit /health or /agent.
- Note: No automated tests configured.