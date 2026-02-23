# Specification

## Summary
**Goal:** Add wake-up accountability feature where users set a target wake-up time and must upload a photo of themselves dressed if they wake up late.

**Planned changes:**
- Add wake-up time setting interface with hour and minute selection
- Implement timer tracking current time against target wake-up time
- Calculate and display minutes late when user oversleeps
- Add photo capture/upload functionality for accountability
- Enforce mandatory photo upload when user wakes up late
- Store wake-up settings and photo submission records in backend
- Display history log showing past wake-up records with on-time/late status
- Integrate Internet Identity authentication for multi-user support

**User-visible outcome:** Users can set their target wake-up time, and if they wake up late, they must take or upload a photo of themselves dressed before proceeding. Each user has their own isolated wake-up history showing their accountability record over time.
