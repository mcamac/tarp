# TARP: Tiny asset rebuilder + packager
## Overview
### Compilation Strategy
Only supports relative JS modules for now (no `node_modules`).

+ For each target, find dependency graph.
+ Rebuild if any dependencies have changed.
+ Stores cache files for each build target with dependency graph and file metadata.
