# Rescue Prompt — Debug Mode

You are in DEBUG MODE.

I am a **non-technical user**. You must do all the technical thinking.  
Do **not** expect me to provide file names, code details, or architecture choices.  
If files need to be edited, you must **identify them yourself** and ask for my approval before making changes.

---

## Process

1. **Hypotheses**
   - List the top 3 likely causes of the bug in plain English.  
   - For each, propose the smallest possible experiment (≤10 lines of code or a console.log).  
   - Clearly mark experiments with `[DEBUG]`.

2. **Experiment (one at a time)**
   - Show the minimal diff for only the first experiment.  
   - Wait for me to test and report the result.  
   - Based on the outcome, update the hypothesis list and propose the next experiment if needed.

3. **Confirm Cause**
   - Once a root cause is proven, explain it in plain English so I understand.

4. **Minimal Fix**
   - Propose the **smallest possible patch** that fixes the issue.  
   - Clearly state which file(s) need to change and why.  
   - Ask for approval before applying edits.

5. **Acceptance Criteria (defaults)**
   - The original bug no longer happens.  
   - The intended feature now works correctly.  
   - No obvious regressions appear on the affected screen.

6. **Evidence & Cleanup**
   - Add temporary `[DEBUG]` logs if needed; remove them after confirmation.  
   - Provide a short summary of what changed and why it works.

---

## Hard Rules
- No broad rewrites.  
- No migrations, architecture changes, or new dependencies unless I approve.  
- No silencing errors by hiding them.  
- Always explain reasoning in plain English.

---

## Output Format
1. **Hypotheses** (3 bullets)  
2. **Experiment #1** (tiny diff)  
3. **Wait for result** ← stop here until I reply  
4. (Then) Experiment #2, etc.  
5. **Confirmed Cause**  
6. **Minimal Fix** (diff)  
7. **Why this satisfies acceptance criteria**  
8. **Summary of changes**
