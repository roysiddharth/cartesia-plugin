---
name: debug
description: "Use this skill when diagnosing a failing Cartesia test or debugging voice agent issues. Shows the 5-step debugging protocol and matches symptoms to the 5 common archetypes: latency spike (buffering), intermittent failure (shared state), truncated output (off-by-one), tensor shape error (transpose), staging-passes-production-fails (network/resource limits)."
---

# Cartesia Debug Reference

## 5-Step Protocol

1. **Run Cold** — `pytest -v`, read full traceback, identify the exact failing assertion
2. **Write 3 Hypotheses** — ranked by likelihood, before touching code
3. **Eliminate Cheapest** — one `print()`, `type()`, or single-line test
4. **Narrate Root Cause** — one sentence before writing the fix
5. **Verify & Regress** — rerun tests, confirm fix, check nothing else broke

Target: 12–15 min per problem. Verbalize at 10 min if stuck.

---

## The 5 Archetypes

### 1. Latency Spike
**Symptom:** TTS latency jumps (e.g., 10ms → 129ms)
**Hypothesis:** `yield` moved outside the generation loop — buffering all chunks before returning first
**Cheapest check:** Find the generator; confirm `yield chunk` is inside vs. outside the loop
**Fix:** Move `yield chunk` inside the `for` loop
**Red flag:** Any comment like "buffer for smoother playback" in streaming code

### 2. Intermittent Failure (test suite only)
**Symptom:** Tests fail non-deterministically; one customer's data leaks into another's session
**Hypothesis:** Module-level shared state (`_client_state`) leaking between test runs
**Cheapest check:** Search for module-level mutable variables in the file under test
**Fix:** Remove the shared dict; raise `KeyError` immediately if key is missing — no fallback loop
**Red flag:** `_client_state = {}` at module level used as a fallback

### 3. Truncated Output
**Symptom:** Last word or frame consistently missing from STT transcript or audio
**Hypothesis:** Off-by-one — `range(len(frames) - 1)` skips the final element
**Cheapest check:** `print(len(frames))` vs. the loop range upper bound
**Fix:** Use `range(len(frames))` — `range` is already exclusive of the upper bound
**Red flag:** Any `len(x) - 1` as a loop boundary

### 4. Tensor Shape Error
**Symptom:** Shape mismatch crash (e.g., `(B, D, T)` vs `(B, T, D)`)
**Hypothesis:** Missing or extra `.T` / `.permute()` in data loader or model layer
**Cheapest check:** `print(tensor.shape)` before and after the suspected transform
**Fix:** Add or remove the transpose to match expected `(B, T, D)` convention
**Red flag:** Any recent change to the data loader or model input pipeline

### 5. Staging-Passes, Production-Fails
**Symptom:** Works in Docker/local, fails in customer K8s with `ConnectionRefusedError` ~30% of the time
**Hypothesis:** Network/resource policy issue — not a code bug
**Cheapest check:** Check K8s memory limits, egress policy, DNS resolution from inside the pod
**Fix:** Increase memory limit, fix egress policy, or reduce connection pool size
**Red flag:** Intermittent network error that only appears under real load or in production
