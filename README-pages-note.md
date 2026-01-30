After merging this branch:

- The Actions workflow will run on pushes to main and produce a production build (dist/).
- The workflow publishes dist/ to the gh-pages branch.
- Configure GitHub Pages (Settings → Pages) to use the gh-pages branch (root) as the source, if it is not automatically selected.
- The site will be available at: https://avilshadow.github.io/multi-timer-0-page/