# AGENTS - Development with Replit AI Agents

This document describes how to work effectively with Replit AI agents when developing and maintaining LootLedger.

## Overview

Replit agents are autonomous AI assistants that can help with:
- Code generation and implementation
- Bug fixing and debugging
- Refactoring and code improvements
- Documentation updates
- Feature implementation
- Testing and validation

## Autonomy Levels

### Fast Mode (Current)
- **Best for**: Straightforward tasks, quick fixes, feature additions
- **Speed**: Fastest turnaround, optimized for efficiency
- **Approach**: Agent works independently with minimal back-and-forth
- **Use when**: Task is well-defined, doesn't require complex analysis

### Standard Mode
- **Best for**: Medium complexity tasks, architecture decisions
- **Speed**: Balanced between speed and thoroughness
- **Approach**: Agent can ask clarifying questions if needed
- **Use when**: Task has some ambiguity but main direction is clear

### High Autonomy Mode
- **Best for**: Complex features, heavy debugging, architectural changes
- **Speed**: Slower but more thorough analysis
- **Approach**: Agent has full capability to explore, plan, and test
- **Use when**: Task is complex or requires comprehensive testing

## Working with Agents

### Task Definition

For best results, provide clear task descriptions:

```
✅ GOOD:
"Fix the item sorting in the inventory grid - items should sort by 
creation date with newest first"

❌ VAGUE:
"Fix the inventory"
```

### Batch Operations

Agents work fastest when you batch related requests:

```
✅ GOOD:
"Add giveaway toggle to the dashboard, then also add it to the inventory 
page. Update both components in one request."

❌ INEFFICIENT:
"Add giveaway toggle to dashboard"
[Wait for response]
"Now add it to inventory page"
```

### Code Guidelines for Agents

When asking agents to code, provide context:

1. **Reference existing patterns**
   - "Use the same pattern as EditItemDialog for the new component"
   - "Follow the styling in Dashboard.tsx for consistency"

2. **Specify requirements clearly**
   - Data types needed
   - API endpoints to use
   - UI/UX expectations
   - Performance requirements

3. **Testing expectations**
   - "Verify the form submits correctly"
   - "Test all CRUD operations before finishing"

## Common Tasks & Agent Approach

### Bug Fixes

**Best in**: Fast Mode for simple bugs, High Autonomy for complex bugs

```
Provide:
- What's broken (symptom)
- Where it's broken (file/component)
- Expected behavior
- Current behavior (if known)

Example:
"Items aren't saving in the inventory. When I add an item via the 
AddItemDialog, it shows briefly then disappears. Check the API 
response and storage layer."
```

### Feature Implementation

**Best in**: Fast Mode for straightforward features, Standard/High for complex

```
Provide:
- Feature description
- Where it should appear
- User interaction flow
- Any data/API requirements

Example:
"Add a 'duplicate item' button to inventory cards. When clicked, it 
should open a form with all fields pre-filled and allow the user to 
create a new item with the same data."
```

### Refactoring

**Best in**: Standard Mode (agent can ask clarifying questions)

```
Provide:
- What to refactor
- Why (performance, maintainability, etc)
- Any constraints

Example:
"Refactor the AddItemDialog and EditItemDialog to reduce code duplication.
They share similar form structure but have different titles and submission 
endpoints."
```

### Documentation

**Best in**: Fast Mode

```
Provide:
- What to document
- Format (README, inline comments, separate file)
- Audience (developers, users, etc)

Example:
"Update README with a quick start guide section. Include basic setup, 
running the dev server, and how to add your first item."
```

## Delegating to Subagents

Agents can use subagents to work on specific tasks while you continue working on other things.

### When to Use Subagents

✅ **Use when:**
- Task is self-contained and well-defined
- Task has clear success criteria
- Task can be completed independently
- You want parallel work
- Task involves multiple files/components

❌ **Avoid when:**
- Task is ambiguous or needs clarification
- Task depends on multiple previous tasks
- Task needs immediate feedback
- Task is trivial (< 5 minutes of work)

### How Subagents Work

1. **Main agent** (that you're talking to) breaks down task
2. **Subagent** receives clear task with specific requirements
3. **Subagent** works independently to completion
4. **Main agent** reviews results and reports back

### Subagent Task Format

```
Task: "Implement the Orders page with sales history"

Include:
- File paths to work with
- Data structures needed
- Expected behavior
- Success criteria (e.g., "all tests pass")
- Any integration points
```

## LootLedger-Specific Agent Guidelines

### Architecture & Patterns

When working with LootLedger agents, emphasize:

1. **Storage Layer Pattern**
   - Always use `IStorage` interface in `server/storage.ts`
   - Implement CRUD methods in `MemStorage` class
   - Never hardcode data in routes

2. **API Design**
   - RESTful endpoints in `server/routes.ts`
   - Validate requests with Zod schemas
   - Consistent error responses
   - Use `/api/` prefix for all API routes

3. **Frontend Patterns**
   - Use Wouter for routing
   - TanStack Query for data fetching
   - Shadcn/ui for components
   - Tailwind CSS for styling

4. **Type Safety**
   - Define schemas in `shared/schema.ts`
   - Generate types from schemas
   - Use TypeScript strict mode
   - No `any` types without justification

### Code Style

Reference for agents:

```typescript
// ✅ GOOD: Clear, typed, consistent
async function handleAddItem(data: InsertInventoryItem) {
  try {
    const response = await apiRequest("POST", "/api/inventory", data);
    if (!response.ok) {
      console.error("Failed to add item:", await response.json());
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// ❌ AVOID: Loose typing, inconsistent patterns
function addItem(data: any) {
  fetch("/api/inventory", { method: "POST", body: JSON.stringify(data) })
    .then(res => res.json())
    .then(data => location.reload());
}
```

### Testing Checklist

When asking agents to implement features, request:

- [ ] TypeScript compilation succeeds
- [ ] No console errors in browser
- [ ] API endpoints respond correctly
- [ ] Data persists during session (in-memory storage)
- [ ] UI renders without layout shifts
- [ ] All interactive elements work (buttons, forms, filters)
- [ ] Mobile responsive on smaller screens

## Communication Best Practices

### Be Specific

```
GOOD: "Add a 'Duplicate Item' button to each inventory card. When 
clicked, it should open the AddItemDialog with all fields pre-filled 
from the selected item."

VAGUE: "Add duplicate functionality"
```

### Include Context

```
GOOD: "The EditItemDialog uses refs to capture form data. Create a 
similar pattern for the new DiscountDialog component."

GENERIC: "Create a new dialog"
```

### Request Verification

```
GOOD: "Implement this feature and verify that (1) the form validates 
correctly, (2) the API call succeeds, (3) the inventory updates 
immediately."

OPEN-ENDED: "Implement this feature"
```

## Troubleshooting Agent Work

### If work seems incomplete:

1. **Check the task description** - Was it specific enough?
2. **Review success criteria** - Were they clear?
3. **Ask for clarification** - Request a summary of what was done
4. **Suggest refinement** - "Can you also add error handling?"

### If code doesn't match your style:

1. **Update style guide** - Add to development guidelines
2. **Reference existing code** - "Follow the pattern in Dashboard.tsx"
3. **Provide examples** - Show preferred patterns
4. **Request refactoring** - "Can you refactor this to match our patterns?"

### If agent missed requirements:

1. **List what's missing** - Be specific
2. **Explain why it matters** - Context helps
3. **Ask for follow-up** - "Can you also add..."
4. **Verify completion** - Test the feature yourself

## Performance Optimization

### Tips for Faster Agent Work:

1. **Batch related tasks**
   - Group file updates
   - Combine multiple components
   - Request parallel changes

2. **Minimize back-and-forth**
   - Provide all info upfront
   - Include edge cases
   - Specify error handling

3. **Give clear success criteria**
   - Agents test better with specific targets
   - Reduces back-and-forth
   - Enables autonomous completion

4. **Use existing patterns**
   - Reference similar code
   - Link to examples
   - Reduces decision-making time

## Example: Effective Task Handoff

### ❌ Poor Handoff:
```
"Add order management"
```

### ✅ Good Handoff:
```
"Add an Orders page at `/orders` showing sold items.

Requirements:
- Fetch sold items from /api/inventory filtered by status="sold"
- Display in a table with columns: Date Sold, Title, Buyer Name, 
  Sale Price, Status
- Add a filter sidebar (by date range, buyer, category)
- Include a 'Mark as Pending' button to revert sold items
- Use the same styling as Inventory page

Success criteria:
- Page loads without errors
- Data displays correctly
- Filters work and update table
- All buttons have proper click handlers
- Mobile responsive"
```

## When to Switch Autonomy Levels

### Stay in Fast Mode if:
- Task is straightforward and well-defined
- No complex debugging needed
- Feature is similar to existing code
- Minimal back-and-forth expected

### Switch to Standard Mode if:
- Task needs some clarification
- Multiple design decisions needed
- Task touches multiple systems
- Agent should verify architecture

### Switch to High Autonomy if:
- Task is complex or ambiguous
- Heavy debugging required
- Architectural changes needed
- Comprehensive testing required
- Task spans multiple systems

## Resources

- **Main guidelines**: `development_guidelines` in replit config
- **Project info**: `replit.md`
- **Tech docs**: README.md
- **Type definitions**: `shared/schema.ts`
- **API structure**: `server/routes.ts`
- **Storage interface**: `server/storage.ts`

## Summary

Working with agents effectively means:

1. ✅ **Be specific** - Clear task descriptions
2. ✅ **Provide context** - Reference existing code
3. ✅ **Set expectations** - Define success criteria
4. ✅ **Test thoroughly** - Verify work before accepting
5. ✅ **Communicate clearly** - Use examples and patterns
6. ✅ **Batch work** - Combine related tasks
7. ✅ **Learn and adapt** - Update guidelines based on what works

The more structured and specific your requests, the better and faster the agent work will be!
