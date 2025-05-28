---
applyTo: "**"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# copilot-instructions.md

Guidelines for GitHub Copilot suggestions in this repository

## Overall Objective

Generate concise, **clean**, and **optimized** code that is ready for production with no superfluous artifacts.

---

### 1. Code Quality

- Produce idiomatic, maintainable solutions that favor clarity **and** efficiency.
- Eliminate dead code, redundant branches, and unnecessary temporary variables.
- Choose algorithms and data structures with correct asymptotic complexity for the problem at hand.
- Respect the existing project style guide (naming, spacing, lint rules, etc.).

### 2. Commenting

- Include **only** comments that:
  - Explain non-obvious intent, edge-case handling, or external constraints.
  - Reference authoritative sources (e.g., standards, RFCs) when needed.
- Do **not** generate boilerplate or restatement comments (e.g., parameter echoes, obvious getters/setters).

### 3. Formatting & Structure

- Follow the file’s prevailing formatting (indentation, line length, import order).
- Remove or consolidate duplicate code; extract shared logic into well-named helpers when it aids reuse.
- Keep import lists minimal—no unused or duplicate imports.

### 4. Dependencies

- Prefer standard-library solutions first.
- Introduce third-party libraries only when they add clear value and are lightweight, well-maintained, and license-compatible.

### 5. Testing Snippets

- When providing tests, include the smallest self-contained example that demonstrates correctness.
- Avoid full project scaffolding or excessive mocking frameworks.

### 6. Language/Framework Conventions

- Adhere to canonical patterns for the language or framework in use (e.g., React hooks rules, idiomatic Go error handling).
- Respect framework directory structures and naming conventions.

### 7. Performance Considerations

- Optimize only where profiling or evident bottlenecks justify it; avoid premature micro-optimizations.
- Favor algorithmic improvements over low-level tweaks when possible.

---

**Remember:** The goal is **elegant, efficient code with purposeful comments—nothing more, nothing less.**
