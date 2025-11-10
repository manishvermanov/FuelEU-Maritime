# Reflection — FuelEU Maritime Compliance Project
*What I learned using AI agents*

Working with a coordinated suite of AI agents (Cursor for repo-scale generation and refactors, and ChatGPT for prompt refinement, deep reasoning and documentation) changed how I design, verify, and ship software. I learned to treat agents as specialised collaborators rather than black-box code factories: Cursor excels at multi-file scaffolds and wiring, ChatGPT accelerates iterative ideation and helps articulate and verify domain rules (banking/pooling constraints) in human-readable form. This division of labor made it natural to preserve the project’s single source of truth and to use agents only to implement adapters and tests.

*Efficiency gains versus manual coding*

Agents multiplied throughput but did not replace domain thinking. Overall, I experienced roughly a 60–70% reduction in development time compared to an all-manual approach. More granularly: scaffolding and multi-file wiring were ≈8–10× faster, API controllers and tests were ≈3–4× faster, and iterative UI component wiring was ≈2–3× faster. These gains freed time for design, validation, and UX work—tasks that demanded human judgment rather than mechanical typing.

A quick example: I used ChatGPT to formalize the FuelEU pooling constraints from the official methodology and then asked Cursor to implement createPool() and generate exhaustive unit tests. What would have taken ~4 hours (reading the spec, designing edge cases, coding, and testing) was completed in about 40–60 minutes: ChatGPT produced a deterministic rule-set and test cases; Cursor generated the implementation and wiring; I reviewed and hardened a small number of edge cases. The result was a tested, auditable implementation that matched the regulatory rules.

*Improvements I’d make next time*

- Versioned tasks.md and prompt templates. Make multi-file generations repeatable and reviewable across iterations.

- CI gates for agent outputs. Run domain-unit tests automatically on agent-generated commits and block merges that change golden outputs.

- Prompt-testing harness. Feed edge inputs to both agent outputs and a reference implementation; highlight mismatches for human review.

- Human-in-the-loop gates for sensitive logic. Require a short checklist review before accepting changes that affect banking/pooling.

- Provenance metadata. Add lightweight metadata (agent name + prompt hash) to commits so decisions are traceable.

*What surprised me*

I was surprised by two things: first, how reliably agents could create consistent, cross-file changes (refactors that touch 20+ files), speeding architecture-level work; second, how often they hallucinated small but consequential details (field names, schema shapes). The former felt like a multiplier; the latter reinforced the necessity of tight tests and human review. I also underestimated how much skill it takes to prompt effectively— learning which agents excel at which tasks was in of itself a mini-project.

*Closing thoughts*

AI agents make complex projects achievable faster, but their real power is unlocking more and better human attention for domain correctness, design, and verification. With disciplined boundaries and verification, the FuelEU project became not just quicker to build, but safer and more maintainable than either naive agent-driven development or purely manual coding.
