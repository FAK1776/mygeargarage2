# File Structure

## Overview
This document outlines the organization of the My Gear Garage codebase.

## Core Directories

### `/src`
Main source code directory containing all application code.

#### `/components`
Reusable React components organized by feature:

- `/layout`
  - `PageLayout.tsx` - Standard page layout component
  - `Navbar.tsx` - Navigation bar
  - `Footer.tsx` - Footer component

- `/gear`
  - `/details`
    - `/specs`
      - `GuitarSpecsForm.tsx` - Form for guitar specifications
  - `GearSpecParser.tsx` - Parser for manufacturer specifications
  - `GearCard.tsx` - Card component for displaying gear
  - `GearDetailsOverlay.tsx` - Overlay for detailed gear view

- `/ui`
  - Common UI components (buttons, inputs, etc.)

#### `/pages`
Page components:
- `AddGear.tsx` - Add new gear page
- `MyGear.tsx` - Main gear collection view
- `Timeline.tsx` - Timeline view
- `Profile.tsx` - User profile page
- `Login.tsx` - Authentication page

#### `/types`
TypeScript type definitions:
- `gear.ts` - Gear-related types and interfaces
- `user.ts` - User-related types

#### `/utils`
Utility functions and helpers:
- `gearUtils.ts` - Gear-related utilities
- `dateUtils.ts` - Date formatting utilities

#### `/styles`
Global styles and theme definitions:
- `typography.css` - Typography styles
- `index.css` - Global styles

## Documentation
- `/Documentation`
  - `/technical` - Technical documentation
  - `/user` - User guides
  - `progress.md` - Session progress tracking 