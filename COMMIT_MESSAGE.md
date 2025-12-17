# Git Commit Message

```
feat: Implement comprehensive Hotel CRUD with multi-step wizard and bilingual support

- Add extended hotel schema with facilities, policies, availability status, and media gallery
- Create hotel-form-wizard component with 6-step Booking.com-style flow
- Implement full CRUD API endpoints for hotel management
- Add bilingual (Arabic/English) content support with auto-translation
- Create hotel types and type definitions for type safety
- Add hotel-list-client component with publish/unpublish and feature toggle
- Update dashboard-hotels component with stats and modern UI
- Create new/edit hotel pages with wizard interface
- Add database migration for extended hotel fields
- Implement comprehensive i18n translations for hotel management
- Enhance UI/UX with modern gradients, shadows, and animations
- Add context-aware form validation and step-by-step progress
- Fix translation validation to work per-step instead of requiring all fields
- Add auto-translation button to Property Details step

Breaking Changes:
- Hotel schema extended with new fields (migration required)
- Old tabbed hotel form replaced with wizard interface

Migration Required:
- Run `pnpm db:push` or `pnpm db:migrate` to apply schema changes
```

