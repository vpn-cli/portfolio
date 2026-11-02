# Rules for this project

## Before every task
- Commit a checkpoint: git add -A && git commit -m "checkpoint: before <task>"

## While editing
- For visual and design decisions, design-taste-frontend leads. Use antislop and hallmark to audit the result, not to pick the direction.
- Make all file edits for the task first, then check the page once at the end. Don't check after every single file.
- Never start a second dev server; reuse the running one.
- Stop the dev server before installing or removing packages, then restart once.
- Don't edit app/layout.tsx stylesheet imports, globals.css base layers, postcss.config, the Tailwind config, or next.config unless the task requires it. If it does, say so first.

## After every task
- Run `npm run build`; it must pass with no CSS errors.
- Stop the dev server, run `npm run dev:clean`, open the page in the browser, and confirm styles load (the CSS request returns 200, and the page is visibly styled).
- If anything that worked before is now broken, revert to the checkpoint with git instead of patching on top.
- Never ask me to restart the dev server; do it yourself.

## Git Workflow: Frequent Small Commits
- Commit frequently and make small, focused commits on a regular basis as work progresses.
- Never let large batches of unrelated changes accumulate uncommitted in the working tree.
- Commit immediately after completing and verifying each discrete step (e.g. configuration updates, tokens/styling, component additions, bug fixes, refactors, tests, docs).
- Use clear, descriptive Conventional Commit messages (e.g. `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`, `test:`).
- Always verify the build passes cleanly and changes are verified before committing.

## Honesty in project content
- Every metric, feature, number and claim about my projects must come from the project's repo, its README, my real screenshots or recordings, or something I told you. If you can't find a source, write TODO and list it in your report. Never invent one.
- Never build fake or "faux" UI to represent my projects. Use real screenshots and recordings. If a project has no UI (StreamMart), use a real terminal capture or a diagram, labeled as a diagram.
- If you don't know what a project's UI shows, open the live site or read the repo before designing anything for it.

