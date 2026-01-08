---
name: lint-build-push
description: Runs lint and build, fixes all errors automatically, then pushes to GitHub. Use when the user wants to check code quality, prepare for deployment, or run the full CI pipeline locally.
allowed-tools: Bash(npm run lint:*), Bash(npm run build:*), Bash(git add:*), Bash(git push:*), Read, Edit, Grep, Glob, TodoWrite
---

# Lint, Build, and Push

This skill runs the complete quality check pipeline: linting, building, fixing errors, and pushing to GitHub.

## Instructions

Follow these steps in order:

### 1. Create a Todo List

Use TodoWrite to create todos for:
- Running lint
- Fixing lint errors (if any)
- Running build
- Fixing build errors (if any)
- Committing changes (if fixes were made)
- Pushing to GitHub

### 2. Run Lint

Execute `npm run lint` to check for linting errors.

**If lint passes**: Mark the lint todo as completed and proceed to build.

**If lint fails**:
- Mark "Running lint" as completed
- Mark "Fixing lint errors" as in_progress
- Analyze each error carefully
- For each error:
  - Read the file to understand the context
  - Fix the error using the Edit tool
  - Ensure the fix doesn't break existing functionality
- After fixing all errors, run `npm run lint` again to verify
- If new errors appear, repeat the process
- Mark "Fixing lint errors" as completed once lint passes

### 3. Run Build

Execute `npm run build` to check for build errors.

**If build passes**: Mark the build todo as completed and proceed to push.

**If build fails**:
- Mark "Running build" as completed
- Mark "Fixing build errors" as in_progress
- Analyze each error carefully (TypeScript errors, missing imports, etc.)
- For each error:
  - Read the relevant files to understand the context
  - Fix the error using the Edit tool
  - Ensure type safety and correctness
- After fixing all errors, run `npm run build` again to verify
- If new errors appear, repeat the process
- Mark "Fixing build errors" as completed once build passes

### 4. Commit Changes (if fixes were made)

If any files were modified during the error fixing process:
- Run `git status` to see all changes
- Run `git diff` to review the changes
- Add all relevant files using `git add`
- Create a commit with a descriptive message following this format:

```bash
git commit -m "$(cat <<'EOF'
Fix lint and build errors

- Fixed [description of lint errors]
- Fixed [description of build errors]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

- Mark "Committing changes" as completed

### 5. Push to GitHub

Execute `git push` to push all commits to the remote repository.

**If push succeeds**: Mark "Pushing to GitHub" as completed and inform the user of success.

**If push fails**:
- Check the error message
- If it's a "no upstream branch" error, use `git push -u origin <branch-name>`
- If there are upstream changes, inform the user they need to pull first
- Mark the push todo as completed once successful

### 6. Summary

Provide a clear summary to the user:
- How many lint errors were fixed
- How many build errors were fixed
- Confirmation that code was pushed to GitHub
- The current branch name

## Error Handling Best Practices

- **Read before editing**: Always read the file before making changes
- **Understand context**: Don't just fix syntax; understand what the code does
- **One error at a time**: Fix errors systematically, not all at once
- **Verify fixes**: After each fix, consider if it might introduce new errors
- **Type safety**: Ensure TypeScript types are correct, not just cast to `any`
- **Don't over-engineer**: Fix only what's broken; don't refactor unnecessarily

## Examples

**Example 1: User runs the skill**
```
User: /lint-build-push
Assistant: I'll run lint and build, fix any errors, then push to GitHub.
[Creates todos, runs lint, fixes errors, runs build, fixes errors, commits, pushes]
✓ Fixed 3 lint errors
✓ Fixed 2 build errors
✓ Pushed to GitHub (branch: main)
```

**Example 2: No errors found**
```
User: /lint-build-push
Assistant: I'll run lint and build, fix any errors, then push to GitHub.
[Creates todos, runs lint (passes), runs build (passes)]
✓ Lint passed with no errors
✓ Build completed successfully
✓ No changes to commit
✓ All commits already pushed to GitHub
```
