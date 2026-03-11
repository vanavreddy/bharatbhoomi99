# Bharat Bhoomi-99 — Backend Requirements & Design Document

> **Version:** 2.0
> **Date:** March 11, 2026
> **Project:** Bharat Bhoomi-99 — Real Estate Buy/Sell Platform
> **Owner:** Madhu Chandra (Family Realtor)
> **Existing Backend:** Azure-hosted .NET 6 API at `nammakutiraweb.azurewebsites.net`
> **Frontend:** Next.js 14 App Router + TypeScript
> **Database:** Azure SQL — `indnksqlsvr1dev.database.windows.net` / `KutiraDev`
> **ORM:** Entity Framework Core 7.0.2

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Separation Strategy](#2-architecture--separation-strategy)
3. [Database Design — `bharatbhoomi` Schema](#3-database-design--bharatbhoomi-schema)
4. [Cross-Reference to NammaKutira Tables](#4-cross-reference-to-nammakutira-tables)
5. [API Design Document](#5-api-design-document)
6. [EF Core ORM Configuration](#6-ef-core-orm-configuration)
7. [Migration Strategy](#7-migration-strategy)
8. [Validation Rules Reference](#8-validation-rules-reference)
9. [Implementation Guide](#9-implementation-guide)
10. [Appendix: Constants & Enums](#10-appendix-constants--enums)

---

## 1. Executive Summary

### 1.1 Project Overview

Bharat Bhoomi-99 (BB) is a property buy/sell platform focused on Bangalore real estate. It shares the same Azure-hosted .NET 6 backend and Azure SQL database (`KutiraDev`) as NammaKutira (NK), a rental property management platform.

### 1.2 Key Architecture Decision — Separate Schema

**BB tables live in their own `bharatbhoomi` SQL schema.** No existing NammaKutira tables are modified.

| Principle | Detail |
|-----------|--------|
| **No NK modifications** | Zero columns added/removed from NK tables (`Cust.Users`, `Prop.Information`, etc.) |
| **Own schema** | All BB tables are created under the `bharatbhoomi` SQL schema |
| **Soft references** | BB tables reference NK data via `UserId` / `PropertyId` columns — no foreign key constraints across schemas |
| **Shared backend** | Both BB and NK share the same .NET 6 `Program.cs`, DI container, and `NammaKutiraContext` |
| **Independent lifecycle** | BB tables can be migrated, seeded, and dropped without affecting NK |

### 1.3 Why Separate Schema?

1. **Isolation** — Easy to identify all BB tables at a glance (`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'bharatbhoomi'`)
2. **No risk to NK** — NK continues working exactly as before; no ALTER TABLE on production tables
3. **Clean ownership** — BB-specific data (property metadata, user roles, analytics) lives in BB tables
4. **Easy cleanup** — If BB is ever decommissioned, drop the entire schema

### 1.4 What the Frontend Needs

The following frontend features exist as UI but have **NO backend APIs**:

| # | Feature | Current State |
|---|---------|---------------|
| 1 | Favorites / Wishlist | Heart icon renders, click does nothing |
| 2 | Contact Enquiry Form | Form renders, submit does nothing |
| 3 | Contact Owner / Send Message | Buttons render, no onClick handlers |
| 4 | Property Approval Workflow | Properties go live immediately, no review |
| 5 | Builders Directory | Entirely localStorage-based |
| 6 | Analytics / Property Views | Tracked in localStorage only |
| 7 | Home Tour Scheduling | Endpoint exists in config, no API call |
| 8 | Admin Dashboard (real data) | All stats computed from localStorage |

### 1.5 Existing Integration Architecture

```
┌──────────┐     ┌──────────────────┐     ┌─────────────────────────────────────┐
│  Browser  │────▶│  Next.js Server  │────▶│  Azure .NET 6 API                   │
│  (Client) │     │  (API Routes)    │     │  nammakutiraweb.azurewebsites.net   │
│           │◀────│  /api/*          │◀────│                                     │
└──────────┘     └──────────────────┘     └─────────────────────────────────────┘
                                                        │
                                                ┌───────┴───────┐
                                                │   Azure SQL    │
                                                │   KutiraDev    │
                                                ├───────────────┤
                                                │ Cust.*  (NK)  │
                                                │ Prop.*  (NK)  │
                                                │ dbo.*   (NK)  │
                                                │ bharatbhoomi.*│ ← NEW
                                                └───────────────┘
```

---

## 2. Architecture & Separation Strategy

### 2.1 Schema Ownership Map

| SQL Schema | Owner | Purpose | Tables |
|------------|-------|---------|--------|
| `Cust` | NammaKutira | Customer/user data | Users, Membership, etc. |
| `Prop` | NammaKutira | Property data | Information, Address, Images, etc. |
| `RealEstate` | NammaKutira | Real estate metadata | Agency, AgencyEmployee |
| `Search` | NammaKutira | Search filters | Filters, FilterOptions |
| `dbo` | NammaKutira | System tables | OTPs, ApiDetails, Cities, States, etc. |
| **`bharatbhoomi`** | **Bharat Bhoomi** | **All BB-specific data** | **9 new tables (see Section 3)** |

### 2.2 Data Access Pattern

BB needs to READ data from NK tables but NEVER writes to them:

```
BB Service Layer
  │
  ├── READS from NK tables (via NammaKutiraContext)
  │     ├── Cust.Users        → Get user info (name, phone, email)
  │     ├── Prop.Information   → Get property details
  │     └── Prop.Address       → Get property address
  │
  └── READS/WRITES to BB tables (via NammaKutiraContext)
        ├── bharatbhoomi.PropertyMetadata  → BB-specific property fields
        ├── bharatbhoomi.UserProfiles      → BB-specific user fields
        ├── bharatbhoomi.Builders          → Builder directory
        ├── bharatbhoomi.Favorites         → User favorites
        ├── bharatbhoomi.Enquiries         → Property enquiries
        ├── bharatbhoomi.ContactEnquiries  → General contact form
        ├── bharatbhoomi.PropertyViews     → View analytics
        ├── bharatbhoomi.ContactViews      → Contact view tracking
        └── bharatbhoomi.HomeTourRequests  → Tour scheduling
```

### 2.3 How BB-Specific Data Works Without Modifying NK Tables

Instead of adding columns to `Cust.Users` or `Prop.Information`, BB uses **extension tables**:

| NK Table | BB Extension Table | Purpose |
|----------|-------------------|---------|
| `Cust.Users` | `bharatbhoomi.UserProfiles` | Stores `Role`, `AvatarUrl` for BB users |
| `Prop.Information` | `bharatbhoomi.PropertyMetadata` | Stores `Status`, `IsFeatured`, `ViewCount`, `IsDeleted`, `BuilderId`, approval data |

These are **1:1 relationships** — each BB extension row references exactly one NK row via `UserId` or `PropertyId`. The extension row is created lazily (on first BB interaction) or eagerly (at property listing time).

---

## 3. Database Design — `bharatbhoomi` Schema

### 3.1 Entity Relationship Diagram

```
NK Tables (READ-ONLY)                 BB Tables (bharatbhoomi schema)
═══════════════════                   ═══════════════════════════════

┌──────────────────┐                  ┌──────────────────────┐
│ Cust.Users       │◄─ ─ ─ ─ ─ ─ ─ ─▶│ UserProfiles         │
│ (NK, untouched)  │    UserId        │ UserId (PK)          │
│                  │                  │ Role                 │
│ UserId (PK)      │                  │ AvatarUrl            │
│ FirstName        │                  └──────────────────────┘
│ LastName         │                           │
│ UserPhone        │                           │ UserId
│ UserEmail        │                           ▼
│ ...              │                  ┌──────────────────────┐
└──────────────────┘                  │ Favorites            │
        │                             │ FavoriteId (PK)      │
        │ UserId                      │ UserId               │
        ▼                             │ PropertyId           │
┌──────────────────┐                  │ CreatedAt            │
│ Prop.Information │◄─ ─ ─ ─ ─ ─ ─ ─▶│ UNIQUE(UserId,PropId)│
│ (NK, untouched)  │    PropertyId    └──────────────────────┘
│                  │
│ PropertyID (PK)  │◄─ ─ ─ ─ ─ ─ ─ ─▶┌──────────────────────┐
│ PropertyName     │    PropertyId     │ PropertyMetadata     │
│ Type             │                   │ PropertyId (PK)      │
│ BedRooms         │                   │ Status               │
│ Rent (price)     │                   │ RejectionReason      │
│ OUserID          │                   │ ApprovedBy           │
│ ...              │                   │ ApprovedAt           │
└──────────────────┘                   │ IsFeatured           │
        │                              │ ViewCount            │
        │ PropertyId                   │ IsDeleted            │
        ▼                              │ BuilderId ──────────▶┌──────────────┐
┌──────────────────────┐               └──────────────────────┘│ Builders     │
│ Enquiries            │                                       │ BuilderId(PK)│
│ EnquiryId (PK)       │                                       │ Name         │
│ PropertyId           │               ┌──────────────────────┐│ Slug (UQ)    │
│ SenderUserId         │               │ PropertyViews        ││ Initials     │
│ OwnerUserId          │               │ ViewId (PK)          ││ Color        │
│ Message              │               │ PropertyId           ││ Description  │
│ Status               │               │ UserId (nullable)    ││ ProjectCount │
│ CreatedAt            │               │ SessionId            ││ Established  │
└──────────────────────┘               │ IpAddress            ││ HeadQuarters │
                                       │ ViewedAt             ││ IsActive     │
┌──────────────────────┐               └──────────────────────┘└──────────────┘
│ ContactEnquiries     │
│ ContactId (PK)       │               ┌──────────────────────┐
│ Name                 │               │ ContactViews         │
│ Email                │               │ ViewId (PK)          │
│ Phone                │               │ PropertyId           │
│ Subject              │               │ ViewerUserId         │
│ Message              │               │ OwnerUserId          │
│ Status               │               │ ViewedAt             │
│ CreatedAt            │               └──────────────────────┘
└──────────────────────┘
                                       ┌──────────────────────┐
                                       │ HomeTourRequests     │
                                       │ TourId (PK)          │
                                       │ PropertyId           │
                                       │ UserId               │
                                       │ PreferredDate        │
                                       │ PreferredTime        │
                                       │ Message              │
                                       │ Status               │
                                       │ CreatedAt            │
                                       └──────────────────────┘
```

### 3.2 Table Definitions

All tables below are in the `bharatbhoomi` SQL schema.

---

#### 3.2.1 `bharatbhoomi.UserProfiles` — BB-specific user extensions

**Purpose:** Stores role and avatar for BB users without modifying `Cust.Users`.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `UserId` | `BIGINT` | NO | — | **PK.** Matches `Cust.Users.UserId`. Not an identity column — set to the NK user's ID. |
| `Role` | `NVARCHAR(20)` | NO | `'user'` | `'user'`, `'owner'`, `'admin'` |
| `AvatarUrl` | `NVARCHAR(500)` | YES | `NULL` | Profile picture URL |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | When the profile was created |
| `UpdatedAt` | `DATETIME2` | YES | `NULL` | Last update timestamp |

```sql
CREATE TABLE bharatbhoomi.UserProfiles (
    UserId      BIGINT NOT NULL PRIMARY KEY,  -- matches Cust.Users.UserId
    Role        NVARCHAR(20) NOT NULL DEFAULT 'user',
    AvatarUrl   NVARCHAR(500) NULL,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt   DATETIME2 NULL,

    CONSTRAINT CK_UserProfiles_Role CHECK (Role IN ('user', 'owner', 'admin'))
);
```

**Link to NK:** `UserId` = `Cust.Users.UserId` (soft reference, no FK constraint).

---

#### 3.2.2 `bharatbhoomi.PropertyMetadata` — BB-specific property extensions

**Purpose:** Stores approval status, featured flag, view count, soft-delete flag, and builder association for properties without modifying `Prop.Information`.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `PropertyId` | `BIGINT` | NO | — | **PK.** Matches `Prop.Information.PropertyID`. |
| `Status` | `NVARCHAR(20)` | NO | `'pending'` | `'pending'`, `'approved'`, `'rejected'` |
| `RejectionReason` | `NVARCHAR(500)` | YES | `NULL` | Why admin rejected |
| `ApprovedBy` | `BIGINT` | YES | `NULL` | Admin user ID who approved |
| `ApprovedAt` | `DATETIME2` | YES | `NULL` | When approved |
| `IsFeatured` | `BIT` | NO | `0` | Featured listing flag |
| `ViewCount` | `BIGINT` | NO | `0` | Denormalized view counter |
| `IsDeleted` | `BIT` | NO | `0` | Soft delete flag |
| `BuilderId` | `NVARCHAR(450)` | YES | `NULL` | FK to `bharatbhoomi.Builders.BuilderId` |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | Row creation time |
| `UpdatedAt` | `DATETIME2` | YES | `NULL` | Last update time |

```sql
CREATE TABLE bharatbhoomi.PropertyMetadata (
    PropertyId      BIGINT NOT NULL PRIMARY KEY,  -- matches Prop.Information.PropertyID
    Status          NVARCHAR(20) NOT NULL DEFAULT 'pending',
    RejectionReason NVARCHAR(500) NULL,
    ApprovedBy      BIGINT NULL,
    ApprovedAt      DATETIME2 NULL,
    IsFeatured      BIT NOT NULL DEFAULT 0,
    ViewCount       BIGINT NOT NULL DEFAULT 0,
    IsDeleted       BIT NOT NULL DEFAULT 0,
    BuilderId       NVARCHAR(450) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2 NULL,

    CONSTRAINT FK_PropertyMetadata_Builder
        FOREIGN KEY (BuilderId) REFERENCES bharatbhoomi.Builders(BuilderId),
    CONSTRAINT CK_PropertyMetadata_Status
        CHECK (Status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IX_PropertyMetadata_Status ON bharatbhoomi.PropertyMetadata(Status);
CREATE INDEX IX_PropertyMetadata_BuilderId ON bharatbhoomi.PropertyMetadata(BuilderId);
```

**Link to NK:** `PropertyId` = `Prop.Information.PropertyID` (soft reference, no FK constraint).

**When is this row created?**
- Automatically when a property is listed through BB (the service creates the `PropertyMetadata` row with `Status = 'pending'`).
- For existing NK properties that appear in BB searches, a metadata row is created lazily with `Status = 'approved'` on first access.

---

#### 3.2.3 `bharatbhoomi.Builders` — Builder directory

**Purpose:** Server-side storage for builder profiles (replaces localStorage).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `BuilderId` | `NVARCHAR(450)` | NO | — | **PK.** Slug-based ID, e.g., `'prestige'` |
| `Name` | `NVARCHAR(200)` | NO | — | Display name |
| `Slug` | `NVARCHAR(200)` | NO | — | URL slug. **Unique.** |
| `Initials` | `NVARCHAR(10)` | NO | — | Short initials, e.g., `'PG'` |
| `Color` | `NVARCHAR(20)` | NO | — | Tailwind class, e.g., `'bg-blue-600'` |
| `Description` | `NVARCHAR(2000)` | YES | `NULL` | Full description |
| `ProjectCount` | `INT` | NO | `0` | Number of projects |
| `Established` | `NVARCHAR(50)` | YES | `NULL` | Year established |
| `HeadQuarters` | `NVARCHAR(200)` | YES | `NULL` | HQ city |
| `IsActive` | `BIT` | NO | `1` | Active/inactive toggle |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | Created timestamp |
| `UpdatedAt` | `DATETIME2` | YES | `NULL` | Last update |

```sql
CREATE TABLE bharatbhoomi.Builders (
    BuilderId       NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name            NVARCHAR(200) NOT NULL,
    Slug            NVARCHAR(200) NOT NULL,
    Initials        NVARCHAR(10) NOT NULL,
    Color           NVARCHAR(20) NOT NULL,
    Description     NVARCHAR(2000) NULL,
    ProjectCount    INT NOT NULL DEFAULT 0,
    Established     NVARCHAR(50) NULL,
    HeadQuarters    NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2 NULL,

    CONSTRAINT UQ_Builders_Slug UNIQUE (Slug)
);

CREATE INDEX IX_Builders_Slug ON bharatbhoomi.Builders(Slug);
CREATE INDEX IX_Builders_IsActive ON bharatbhoomi.Builders(IsActive);
```

---

#### 3.2.4 `bharatbhoomi.Favorites` — User property favorites

**Purpose:** Tracks which properties a user has favorited.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `FavoriteId` | `INT` | NO | Identity | **PK.** Auto-increment. |
| `UserId` | `BIGINT` | NO | — | References `Cust.Users.UserId` (soft) |
| `PropertyId` | `BIGINT` | NO | — | References `Prop.Information.PropertyID` (soft) |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | When favorited |

```sql
CREATE TABLE bharatbhoomi.Favorites (
    FavoriteId  INT IDENTITY(1,1) PRIMARY KEY,
    UserId      BIGINT NOT NULL,
    PropertyId  BIGINT NOT NULL,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT UQ_Favorites_UserProperty UNIQUE (UserId, PropertyId)
);

CREATE INDEX IX_Favorites_UserId ON bharatbhoomi.Favorites(UserId);
CREATE INDEX IX_Favorites_PropertyId ON bharatbhoomi.Favorites(PropertyId);
```

**Links to NK:** `UserId` → `Cust.Users.UserId`, `PropertyId` → `Prop.Information.PropertyID`.

---

#### 3.2.5 `bharatbhoomi.Enquiries` — Property-specific enquiries

**Purpose:** When a buyer sends a message to a property owner.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `EnquiryId` | `BIGINT` | NO | Identity | **PK.** Auto-increment. |
| `PropertyId` | `BIGINT` | NO | — | Which property |
| `SenderUserId` | `BIGINT` | NO | — | Who sent it |
| `OwnerUserId` | `BIGINT` | NO | — | Property owner (derived from `Prop.Information.OUserID`) |
| `Message` | `NVARCHAR(1000)` | NO | — | Enquiry text |
| `Status` | `NVARCHAR(20)` | NO | `'pending'` | `'pending'`, `'read'`, `'replied'` |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | Sent timestamp |
| `RespondedAt` | `DATETIME2` | YES | `NULL` | When owner responded |

```sql
CREATE TABLE bharatbhoomi.Enquiries (
    EnquiryId       BIGINT IDENTITY(1,1) PRIMARY KEY,
    PropertyId      BIGINT NOT NULL,
    SenderUserId    BIGINT NOT NULL,
    OwnerUserId     BIGINT NOT NULL,
    Message         NVARCHAR(1000) NOT NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'pending',
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RespondedAt     DATETIME2 NULL,

    CONSTRAINT CK_Enquiries_Status CHECK (Status IN ('pending', 'read', 'replied'))
);

CREATE INDEX IX_Enquiries_PropertyId ON bharatbhoomi.Enquiries(PropertyId);
CREATE INDEX IX_Enquiries_SenderUserId ON bharatbhoomi.Enquiries(SenderUserId);
CREATE INDEX IX_Enquiries_OwnerUserId ON bharatbhoomi.Enquiries(OwnerUserId);
```

**Links to NK:** `PropertyId` → `Prop.Information.PropertyID`, `SenderUserId` / `OwnerUserId` → `Cust.Users.UserId`.

---

#### 3.2.6 `bharatbhoomi.ContactEnquiries` — General contact form submissions

**Purpose:** Public contact form at `/contact` — does not require authentication.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `ContactId` | `BIGINT` | NO | Identity | **PK.** Auto-increment. |
| `Name` | `NVARCHAR(200)` | NO | — | Submitter name |
| `Email` | `NVARCHAR(200)` | NO | — | Submitter email |
| `Phone` | `NVARCHAR(20)` | YES | `NULL` | Optional phone |
| `Subject` | `NVARCHAR(200)` | NO | — | Subject line |
| `Message` | `NVARCHAR(2000)` | NO | — | Message body |
| `Status` | `NVARCHAR(20)` | NO | `'new'` | `'new'`, `'in-progress'`, `'resolved'` |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | Submitted timestamp |
| `RespondedAt` | `DATETIME2` | YES | `NULL` | When resolved |

```sql
CREATE TABLE bharatbhoomi.ContactEnquiries (
    ContactId   BIGINT IDENTITY(1,1) PRIMARY KEY,
    Name        NVARCHAR(200) NOT NULL,
    Email       NVARCHAR(200) NOT NULL,
    Phone       NVARCHAR(20) NULL,
    Subject     NVARCHAR(200) NOT NULL,
    Message     NVARCHAR(2000) NOT NULL,
    Status      NVARCHAR(20) NOT NULL DEFAULT 'new',
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RespondedAt DATETIME2 NULL,

    CONSTRAINT CK_ContactEnquiries_Status CHECK (Status IN ('new', 'in-progress', 'resolved'))
);

CREATE INDEX IX_ContactEnquiries_Status ON bharatbhoomi.ContactEnquiries(Status);
CREATE INDEX IX_ContactEnquiries_CreatedAt ON bharatbhoomi.ContactEnquiries(CreatedAt DESC);
```

**Links to NK:** None — this is a standalone contact form not tied to users.

---

#### 3.2.7 `bharatbhoomi.PropertyViews` — Property view analytics

**Purpose:** Tracks every property page view for analytics. Deduplicates within 30 minutes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `ViewId` | `BIGINT` | NO | Identity | **PK.** Auto-increment. |
| `PropertyId` | `BIGINT` | NO | — | Which property was viewed |
| `UserId` | `BIGINT` | YES | `NULL` | Authenticated viewer (null if anonymous) |
| `SessionId` | `NVARCHAR(200)` | YES | `NULL` | For anonymous dedup |
| `IpAddress` | `NVARCHAR(45)` | YES | `NULL` | Viewer IP |
| `ViewedAt` | `DATETIME2` | NO | `GETUTCDATE()` | View timestamp |

```sql
CREATE TABLE bharatbhoomi.PropertyViews (
    ViewId      BIGINT IDENTITY(1,1) PRIMARY KEY,
    PropertyId  BIGINT NOT NULL,
    UserId      BIGINT NULL,
    SessionId   NVARCHAR(200) NULL,
    IpAddress   NVARCHAR(45) NULL,
    ViewedAt    DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
);

CREATE INDEX IX_PropertyViews_PropertyId ON bharatbhoomi.PropertyViews(PropertyId);
CREATE INDEX IX_PropertyViews_PropertyId_ViewedAt ON bharatbhoomi.PropertyViews(PropertyId, ViewedAt);
```

**Links to NK:** `PropertyId` → `Prop.Information.PropertyID`, `UserId` → `Cust.Users.UserId`.

---

#### 3.2.8 `bharatbhoomi.ContactViews` — Contact info view tracking

**Purpose:** Tracks when a user clicks "Call Owner" to reveal contact info.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `ViewId` | `BIGINT` | NO | Identity | **PK.** Auto-increment. |
| `PropertyId` | `BIGINT` | NO | — | Which property |
| `ViewerUserId` | `BIGINT` | NO | — | Who viewed the contact |
| `OwnerUserId` | `BIGINT` | NO | — | Whose contact was viewed |
| `ViewedAt` | `DATETIME2` | NO | `GETUTCDATE()` | View timestamp |

```sql
CREATE TABLE bharatbhoomi.ContactViews (
    ViewId          BIGINT IDENTITY(1,1) PRIMARY KEY,
    PropertyId      BIGINT NOT NULL,
    ViewerUserId    BIGINT NOT NULL,
    OwnerUserId     BIGINT NOT NULL,
    ViewedAt        DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_ContactViews_PropertyId_ViewerUserId
    ON bharatbhoomi.ContactViews(PropertyId, ViewerUserId);
```

**Links to NK:** `PropertyId` → `Prop.Information.PropertyID`, `ViewerUserId` / `OwnerUserId` → `Cust.Users.UserId`.

---

#### 3.2.9 `bharatbhoomi.HomeTourRequests` — Home tour scheduling

**Purpose:** Users request in-person tours for properties.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `TourId` | `BIGINT` | NO | Identity | **PK.** Auto-increment. |
| `PropertyId` | `BIGINT` | NO | — | Which property |
| `UserId` | `BIGINT` | NO | — | Who requested |
| `PreferredDate` | `DATETIME2` | NO | — | Preferred tour date |
| `PreferredTime` | `NVARCHAR(20)` | YES | `NULL` | Preferred time slot |
| `Message` | `NVARCHAR(1000)` | YES | `NULL` | Additional message |
| `Status` | `NVARCHAR(20)` | NO | `'pending'` | `'pending'`, `'confirmed'`, `'cancelled'`, `'completed'` |
| `CreatedAt` | `DATETIME2` | NO | `GETUTCDATE()` | Request timestamp |

```sql
CREATE TABLE bharatbhoomi.HomeTourRequests (
    TourId          BIGINT IDENTITY(1,1) PRIMARY KEY,
    PropertyId      BIGINT NOT NULL,
    UserId          BIGINT NOT NULL,
    PreferredDate   DATETIME2 NOT NULL,
    PreferredTime   NVARCHAR(20) NULL,
    Message         NVARCHAR(1000) NULL,
    Status          NVARCHAR(20) NOT NULL DEFAULT 'pending',
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT CK_HomeTourRequests_Status
        CHECK (Status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

CREATE INDEX IX_HomeTourRequests_PropertyId ON bharatbhoomi.HomeTourRequests(PropertyId);
CREATE INDEX IX_HomeTourRequests_UserId ON bharatbhoomi.HomeTourRequests(UserId);
```

**Links to NK:** `PropertyId` → `Prop.Information.PropertyID`, `UserId` → `Cust.Users.UserId`.

---

### 3.3 Seed Data — Builders

```sql
INSERT INTO bharatbhoomi.Builders
    (BuilderId, Name, Slug, Initials, Color, Description, ProjectCount, Established, HeadQuarters, IsActive)
VALUES
    ('prestige', 'Prestige Group', 'prestige', 'PG', 'bg-blue-600',
     'Prestige Group is one of India''s leading real estate developers with projects across residential, commercial, retail, and hospitality sectors.',
     300, '1986', 'Bangalore', 1),
    ('brigade', 'Brigade Group', 'brigade', 'BG', 'bg-red-600',
     'Brigade Group is a leading Indian property developer known for quality construction and timely delivery.',
     250, '1986', 'Bangalore', 1),
    ('sobha', 'Sobha Limited', 'sobha', 'SL', 'bg-emerald-600',
     'Sobha Limited is a Bangalore-based real estate company known for premium quality construction.',
     150, '1995', 'Bangalore', 1),
    ('godrej', 'Godrej Properties', 'godrej', 'GP', 'bg-purple-600',
     'Godrej Properties is the real estate arm of the Godrej Group with innovative developments.',
     200, '1990', 'Mumbai', 1),
    ('birla', 'Birla Estates', 'birla', 'BE', 'bg-amber-600',
     'Birla Estates is the real estate arm of the Aditya Birla Group focusing on premium luxury developments.',
     50, '2016', 'Mumbai', 1),
    ('assetz', 'Assetz Property Group', 'assetz', 'AP', 'bg-teal-600',
     'Assetz Property Group is a Bangalore-based premium real estate developer focused on sustainable developments.',
     30, '2006', 'Bangalore', 1),
    ('salarpuria', 'Salarpuria Sattva', 'salarpuria', 'SS', 'bg-indigo-600',
     'Salarpuria Sattva Group is a leading real estate company with a diverse portfolio.',
     100, '1986', 'Bangalore', 1),
    ('puravankara', 'Puravankara', 'puravankara', 'PV', 'bg-rose-600',
     'Puravankara Limited is a leading real estate company delivering quality homes.',
     80, '1975', 'Bangalore', 1);
```

---

## 4. Cross-Reference to NammaKutira Tables

### 4.1 NK Tables That BB Reads From

| NK Table | NK Schema.Table | NK Primary Key | BB Columns That Reference It | How BB Uses It |
|----------|----------------|----------------|------------------------------|---------------|
| Users | `Cust.Users` | `UserId (BIGINT)` | `Favorites.UserId`, `Enquiries.SenderUserId`, `Enquiries.OwnerUserId`, `PropertyViews.UserId`, `ContactViews.ViewerUserId`, `ContactViews.OwnerUserId`, `HomeTourRequests.UserId`, `UserProfiles.UserId`, `PropertyMetadata.ApprovedBy` | Get user name, phone, email for display. Identify property owners. |
| Property Info | `Prop.Information` | `PropertyID (BIGINT)` | `Favorites.PropertyId`, `Enquiries.PropertyId`, `PropertyViews.PropertyId`, `ContactViews.PropertyId`, `HomeTourRequests.PropertyId`, `PropertyMetadata.PropertyId` | Get property name, type, price, images for display. Derive `OwnerUserId` from `OUserID` column. |
| Property Address | `Prop.Address` | `AddressID (INT)` | — (joined via `PropertyInformation.AddressID`) | Get property location (city, zone, zipCode) for favorites/enquiry displays. |
| Property Images | `Prop.PropertyImages` | Composite | — (joined via `PropertyID`) | Get image URLs for property cards. |

### 4.2 Why Soft References (No FK Constraints)?

1. **No ALTER TABLE on NK tables** — Adding a FK from `bharatbhoomi.Favorites.UserId` to `Cust.Users.UserId` would require `ALTER TABLE` on `Cust.Users` to add the constraint target. We avoid this.
2. **Orphan tolerance** — If an NK user or property is deleted, the BB reference just points to nothing. The service layer handles this gracefully (returns "User not found" or filters out deleted entries).
3. **Schema independence** — BB can be deployed to a fresh database or a different database without NK tables present (for testing/staging).

### 4.3 FK Constraints Within `bharatbhoomi` Schema

BB tables DO have FK constraints to **other BB tables**:

| FK Constraint | From | To |
|--------------|------|----|
| `FK_PropertyMetadata_Builder` | `PropertyMetadata.BuilderId` | `Builders.BuilderId` |

All other references to NK tables are **soft references** — enforced at the application/service layer, not at the database level.

---

## 5. API Design Document

### 5.1 API Conventions

| Convention | Value |
|------------|-------|
| Base URL | `https://nammakutiraweb.azurewebsites.net/api` |
| Content-Type | `application/json` (unless file upload) |
| Date Format | ISO 8601 (`2024-01-15T10:30:00Z`) |
| Response Wrapper | `{ model: <T>, isAuthorized: boolean, apiErrors: string[], mobileUser: MobileUser? }` |

### 5.2 Existing Endpoints (No Changes)

These 7 endpoints are live and integrated — **BB does NOT modify them**:

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | POST | `/api/user/sms/generateAndSendOTPJson` | Generate & send OTP |
| 2 | POST | `/api/user/sms/validateOTPJson` | Validate OTP |
| 3 | POST | `/api/user/validatemember` | Email/password login |
| 4 | POST | `/api/user/Create/` | Register new user |
| 5 | POST | `/api/property/propertyInformation/searchProperty` | Search properties |
| 6 | GET | (search endpoint) | Get single property |
| 7 | POST | `/api/property/addPropdetails` | Create property listing |

### 5.3 New BB Endpoints

#### Builders (Public)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/builder` | List all active builders |
| `GET` | `/api/builder/{slug}` | Get builder by slug with associated properties |

#### Favorites (Authenticated)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/favorites?userId={id}` | List user's favorited properties |
| `POST` | `/api/favorites` | Add property to favorites |
| `DELETE` | `/api/favorites?userId={userId}&propertyId={propertyId}` | Remove from favorites |

#### Enquiries (Authenticated)

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/enquiry` | Send enquiry to property owner |
| `GET` | `/api/enquiry/sent?userId={id}` | Get enquiries sent by user |
| `GET` | `/api/enquiry/received?userId={id}` | Get enquiries received by owner |

#### Contact (Public)

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/contact` | Submit general contact form |

#### Analytics (Mixed)

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/analytics/property-view` | Track property page view |
| `POST` | `/api/property/{id}/contact-view` | Track contact info view |
| `POST` | `/api/property/{id}/hometour` | Request home tour |

#### Admin (Admin only)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/admin/properties?status=all` | List properties by status |
| `PATCH` | `/api/admin/properties/{id}/approve` | Approve property |
| `PATCH` | `/api/admin/properties/{id}/reject` | Reject property |
| `GET` | `/api/admin/analytics/summary` | Get analytics summary |
| `GET` | `/api/admin/contact-enquiries` | List contact submissions |
| `PATCH` | `/api/admin/contact-enquiries/{id}/status` | Update contact status |
| `POST` | `/api/admin/builders` | Create builder |
| `PUT` | `/api/admin/builders/{id}` | Update builder |
| `DELETE` | `/api/admin/builders/{id}` | Soft-delete builder |

### 5.4 Response Format

All BB endpoints use the existing NK response wrapper:

```json
{
  "model": "<T — the actual data>",
  "isAuthorized": true,
  "apiErrors": [],
  "mobileUser": null
}
```

On error:
```json
{
  "model": null,
  "isAuthorized": false,
  "apiErrors": ["Error message here"],
  "mobileUser": null
}
```

---

## 6. EF Core ORM Configuration

### 6.1 ORM Details

| Setting | Value |
|---------|-------|
| ORM | Entity Framework Core |
| EF Core Version | 7.0.2 |
| Database Provider | `Microsoft.EntityFrameworkCore.SqlServer` 7.0.2 |
| Design Package | `Microsoft.EntityFrameworkCore.Design` 7.0.2 |
| Migration CLI | `dotnet-ef` 7.0.x (global tool) |
| Target Framework | .NET 6.0 |
| DbContext | `NammaKutiraContext` (shared — single context for both NK and BB entities) |

### 6.2 Entity Classes — Namespace & Location

All BB entity classes live in `nammaKutira.Web.Data.Entities` alongside NK entities.

| Entity Class | File Path | Table Mapping |
|-------------|-----------|---------------|
| `UserProfile` | `Data/Entities/UserProfile.cs` | `bharatbhoomi.UserProfiles` |
| `PropertyMetadata` | `Data/Entities/PropertyMetadata.cs` | `bharatbhoomi.PropertyMetadata` |
| `Builder` | `Data/Entities/Builder.cs` | `bharatbhoomi.Builders` |
| `Favorite` | `Data/Entities/Favorite.cs` | `bharatbhoomi.Favorites` |
| `Enquiry` | `Data/Entities/Enquiry.cs` | `bharatbhoomi.Enquiries` |
| `ContactEnquiry` | `Data/Entities/ContactEnquiry.cs` | `bharatbhoomi.ContactEnquiries` |
| `PropertyView` | `Data/Entities/PropertyView.cs` | `bharatbhoomi.PropertyViews` |
| `ContactView` | `Data/Entities/ContactView.cs` | `bharatbhoomi.ContactViews` |
| `HomeTourRequest` | `Data/Entities/HomeTourRequest.cs` | `bharatbhoomi.HomeTourRequests` |

### 6.3 Entity Mapping Pattern

Each BB entity uses `[Table]` with `Schema = "bharatbhoomi"`:

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace nammaKutira.Web.Data.Entities
{
    [Table("Builders", Schema = "bharatbhoomi")]
    public class Builder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(TypeName = "nvarchar(450)")]
        public string BuilderId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; }

        // ... etc
    }
}
```

### 6.4 DbContext Registration

BB entities are registered as `DbSet<>` properties in the shared `NammaKutiraContext`:

```csharp
// $$$ BB ENTITIES (bharatbhoomi schema) $$$
public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
public DbSet<PropertyMetadata> PropertyMetadata => Set<PropertyMetadata>();
public DbSet<Builder> Builders => Set<Builder>();
public DbSet<Favorite> Favorites => Set<Favorite>();
public DbSet<Enquiry> Enquiries => Set<Enquiry>();
public DbSet<ContactEnquiry> ContactEnquiries => Set<ContactEnquiry>();
public DbSet<PropertyView> PropertyViews => Set<PropertyView>();
public DbSet<ContactView> ContactViews => Set<ContactView>();
public DbSet<HomeTourRequest> HomeTourRequests => Set<HomeTourRequest>();
```

### 6.5 OnModelCreating Configuration

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // --- Existing NK configuration (untouched) ---
    modelBuilder.Entity<Agency>()
       .HasMany(a => a.Agents)
       .WithOne()
       .HasForeignKey(e => e.AgencyId)
       .OnDelete(DeleteBehavior.Cascade);

    // --- BB: Builder unique slug ---
    modelBuilder.Entity<Builder>()
        .HasIndex(b => b.Slug)
        .IsUnique();

    // --- BB: Favorite unique (UserId, PropertyId) ---
    modelBuilder.Entity<Favorite>()
        .HasIndex(f => new { f.UserId, f.PropertyId })
        .IsUnique();

    // --- BB: PropertyMetadata defaults ---
    modelBuilder.Entity<PropertyMetadata>(entity =>
    {
        entity.Property(p => p.Status).HasDefaultValue("pending");
        entity.Property(p => p.IsFeatured).HasDefaultValue(false);
        entity.Property(p => p.ViewCount).HasDefaultValue(0L);
        entity.Property(p => p.IsDeleted).HasDefaultValue(false);
    });

    // --- BB: UserProfile defaults ---
    modelBuilder.Entity<UserProfile>()
        .Property(u => u.Role)
        .HasDefaultValue("user");

    // --- BB: PropertyView indexes ---
    modelBuilder.Entity<PropertyView>(entity =>
    {
        entity.HasIndex(v => v.PropertyId);
        entity.HasIndex(v => new { v.PropertyId, v.ViewedAt });
    });

    // --- BB: Enquiry defaults + indexes ---
    modelBuilder.Entity<Enquiry>(entity =>
    {
        entity.Property(e => e.Status).HasDefaultValue("pending");
        entity.HasIndex(e => e.PropertyId);
        entity.HasIndex(e => e.SenderUserId);
        entity.HasIndex(e => e.OwnerUserId);
    });

    // --- BB: ContactEnquiry defaults ---
    modelBuilder.Entity<ContactEnquiry>()
        .Property(c => c.Status)
        .HasDefaultValue("new");

    // --- BB: ContactView index ---
    modelBuilder.Entity<ContactView>()
        .HasIndex(c => new { c.PropertyId, c.ViewerUserId });

    // --- BB: HomeTourRequest defaults + indexes ---
    modelBuilder.Entity<HomeTourRequest>(entity =>
    {
        entity.Property(h => h.Status).HasDefaultValue("pending");
        entity.HasIndex(h => h.PropertyId);
        entity.HasIndex(h => h.UserId);
    });

    base.OnModelCreating(modelBuilder);
}
```

### 6.6 Service Layer — DI Registration

```csharp
// BB Services (Program.cs)
builder.Services.AddScoped<BuilderService>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<EnquiryService>();
builder.Services.AddScoped<ContactService>();
builder.Services.AddScoped<AdminService>();

// BB Validators (Program.cs)
builder.Services.AddScoped<BuilderValidator>();
builder.Services.AddScoped<FavoriteValidator>();
builder.Services.AddScoped<EnquiryValidator>();
builder.Services.AddScoped<ContactFormValidator>();
```

### 6.7 How Services Read NK Data

BB services read NK tables through the **same `NammaKutiraContext`** — no separate context needed:

```csharp
// Example: FavoriteService enriches favorites with NK property data
var propertyIds = favorites.Select(f => f.PropertyId).Distinct().ToList();

var properties = _database.PropertyInformation  // NK table (READ-ONLY)
    .AsNoTracking()
    .Where(p => propertyIds.Contains(p.PropertyID))
    .ToDictionary(p => p.PropertyID, p => p.PropertyName);

var addresses = _database.PropertyAddress  // NK table (READ-ONLY)
    .AsNoTracking()
    .Where(a => propertyIds.Contains(a.PropertyId))
    .ToDictionary(a => a.PropertyId, a => a.City + ", " + a.Zone);
```

---

## 7. Migration Strategy

### 7.1 Overview

| Step | What | Command |
|------|------|---------|
| 1 | Install EF Core Design package | Add to `.csproj`, `dotnet restore` |
| 2 | Install `dotnet-ef` CLI | `dotnet tool install --global dotnet-ef --version 7.*` |
| 3 | Create baseline migration (empty) | `dotnet ef migrations add InitialBaseline` |
| 4 | Hollow out the baseline `Up()` / `Down()` | Manual edit — make methods empty |
| 5 | Apply baseline | `dotnet ef database update` |
| 6 | Create BB migration | `dotnet ef migrations add AddBharatBhoomiSchema` |
| 7 | Review generated migration | Ensure NO changes to NK tables |
| 8 | Add seed data to `Up()` | Insert 8 builder records |
| 9 | Apply BB migration | `dotnet ef database update` |

### 7.2 Step-by-Step Details

#### Step 1: Add EF Core Design Package

In `nammaKutira.Web.csproj`:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="7.0.2">
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    <PrivateAssets>all</PrivateAssets>
</PackageReference>
```

#### Step 2: Install dotnet-ef CLI

```bash
# dotnet@6 is keg-only on macOS — ensure it's in PATH
export PATH="/opt/homebrew/opt/dotnet@6/bin:$PATH"

dotnet tool install --global dotnet-ef --version 7.0.2
```

#### Step 3–4: Baseline Migration

The database was created manually (no `__EFMigrationsHistory` table). We create a "baseline" migration that records the current model state but executes nothing:

```bash
cd nammaKutira/nammaKutira.Web
dotnet ef migrations add InitialBaseline --output-dir Data/Migrations
```

Then edit the generated migration file — make `Up()` and `Down()` empty:

```csharp
public partial class InitialBaseline : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Intentionally empty — baseline snapshot of existing schema
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Intentionally empty
    }
}
```

#### Step 5: Apply Baseline

```bash
dotnet ef database update
```

This creates the `__EFMigrationsHistory` table and records the baseline.

#### Step 6: Create BB Migration

```bash
dotnet ef migrations add AddBharatBhoomiSchema --output-dir Data/Migrations
```

This generates a migration that:
- Creates `bharatbhoomi` schema
- Creates all 9 BB tables
- Creates indexes and constraints
- Does **NOT** touch any NK tables

#### Step 7: Review the Migration

**Critical checks:**
- No `AlterColumn` on any `Cust.*` or `Prop.*` tables
- No `AddColumn` on any NK tables
- All `CreateTable` calls specify `schema: "bharatbhoomi"`
- Schema creation: `migrationBuilder.EnsureSchema(name: "bharatbhoomi")`

#### Step 8: Add Builder Seed Data

Add to the `Up()` method of the generated migration:

```csharp
migrationBuilder.Sql(@"
    INSERT INTO bharatbhoomi.Builders (BuilderId, Name, Slug, Initials, Color, Description, ProjectCount, Established, HeadQuarters, IsActive, CreatedAt)
    VALUES
    ('prestige', 'Prestige Group', 'prestige', 'PG', 'bg-blue-600', 'Prestige Group is one of India''s leading real estate developers.', 300, '1986', 'Bangalore', 1, GETUTCDATE()),
    ('brigade', 'Brigade Group', 'brigade', 'BG', 'bg-red-600', 'Brigade Group is a leading Indian property developer.', 250, '1986', 'Bangalore', 1, GETUTCDATE()),
    ('sobha', 'Sobha Limited', 'sobha', 'SL', 'bg-emerald-600', 'Sobha Limited is known for premium quality construction.', 150, '1995', 'Bangalore', 1, GETUTCDATE()),
    ('godrej', 'Godrej Properties', 'godrej', 'GP', 'bg-purple-600', 'Godrej Properties delivers innovative developments.', 200, '1990', 'Mumbai', 1, GETUTCDATE()),
    ('birla', 'Birla Estates', 'birla', 'BE', 'bg-amber-600', 'Birla Estates focuses on premium luxury developments.', 50, '2016', 'Mumbai', 1, GETUTCDATE()),
    ('assetz', 'Assetz Property Group', 'assetz', 'AP', 'bg-teal-600', 'Assetz focuses on sustainable premium developments.', 30, '2006', 'Bangalore', 1, GETUTCDATE()),
    ('salarpuria', 'Salarpuria Sattva', 'salarpuria', 'SS', 'bg-indigo-600', 'Salarpuria Sattva has a diverse portfolio of projects.', 100, '1986', 'Bangalore', 1, GETUTCDATE()),
    ('puravankara', 'Puravankara', 'puravankara', 'PV', 'bg-rose-600', 'Puravankara delivers quality homes across India.', 80, '1975', 'Bangalore', 1, GETUTCDATE());
");
```

#### Step 9: Apply BB Migration

```bash
dotnet ef database update
```

### 7.3 Verification

After applying migrations:

```sql
-- Check migration history
SELECT * FROM __EFMigrationsHistory;
-- Should show 2 rows: InitialBaseline + AddBharatBhoomiSchema

-- Check BB tables exist
SELECT TABLE_SCHEMA, TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'bharatbhoomi'
ORDER BY TABLE_NAME;
-- Should show 9 tables

-- Check NK tables are untouched
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'Cust' AND TABLE_NAME = 'Users';
-- Should NOT contain 'Role' or 'AvatarUrl'

-- Check builder seed data
SELECT * FROM bharatbhoomi.Builders;
-- Should return 8 rows
```

### 7.4 Rollback Plan

If anything goes wrong:

```bash
# Revert to baseline (drops all BB tables)
dotnet ef database update InitialBaseline

# Or revert to before any migration
dotnet ef database update 0

# Remove migration files
dotnet ef migrations remove
```

---

## 8. Validation Rules Reference

### 8.1 Contact Form Fields

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Required. 2-100 chars |
| `email` | string | Required. Valid email format |
| `phone` | string | Optional. Indian mobile: `/^[6-9]\d{9}$/` |
| `subject` | string | Required. 5-100 chars |
| `message` | string | Required. 20-1000 chars |

### 8.2 Enquiry Fields

| Field | Type | Rules |
|-------|------|-------|
| `propertyId` | number | Required. Must exist in `Prop.Information` |
| `senderUserId` | number | Required. Must exist in `Cust.Users` |
| `message` | string | Required. 10-1000 chars |

### 8.3 Home Tour Fields

| Field | Type | Rules |
|-------|------|-------|
| `propertyId` | number | Required. Must exist in `Prop.Information` |
| `userId` | number | Required. Must exist in `Cust.Users` |
| `preferredDate` | date | Required. Must be future date |
| `preferredTime` | string | Optional. Format: "HH:MM" |
| `message` | string | Optional. Max 500 chars |

### 8.4 Builder Fields

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Required. 2-100 chars |
| `slug` | string | Required. Lowercase + hyphens: `/^[a-z0-9-]+$/` |
| `initials` | string | Required. 1-10 chars |
| `color` | string | Required. Tailwind color class |
| `description` | string | Optional. Max 2000 chars |
| `projectCount` | number | Required. >= 0 |
| `established` | string | Optional |
| `headquarters` | string | Optional. Max 200 chars |

### 8.5 Favorite Fields

| Field | Type | Rules |
|-------|------|-------|
| `userId` | number | Required. > 0 |
| `propertyId` | number | Required. > 0 |

---

## 9. Implementation Guide

### 9.1 Implementation Phases

#### Phase 1: Database & Foundation
1. Create entity classes (9 files)
2. Update `NammaKutiraContext` with DbSets + OnModelCreating
3. Create baseline migration (empty)
4. Create BB schema migration
5. Apply migrations to Azure SQL

#### Phase 2: Core Services & Controllers
1. Create BB services (5 services)
2. Create BB validators (4 validators)
3. Create BB models/DTOs (4 model files)
4. Create BB controllers (5 controllers)
5. Register in `Program.cs`

#### Phase 3: Integration & Testing
1. Test all endpoints via Postman
2. Verify NK endpoints still work
3. Wire up Next.js frontend

### 9.2 Files Changed Summary

| File | Action | Schema Impact |
|------|--------|---------------|
| `nammaKutira.Web.csproj` | Add EF Core Design package | None |
| `Data/Entities/UserProfile.cs` | **New** | `bharatbhoomi.UserProfiles` |
| `Data/Entities/PropertyMetadata.cs` | **New** | `bharatbhoomi.PropertyMetadata` |
| `Data/Entities/Builder.cs` | **New** (or update schema) | `bharatbhoomi.Builders` |
| `Data/Entities/Favorite.cs` | **New** (or update schema) | `bharatbhoomi.Favorites` |
| `Data/Entities/Enquiry.cs` | **New** (or update schema) | `bharatbhoomi.Enquiries` |
| `Data/Entities/ContactEnquiry.cs` | **New** (or update schema) | `bharatbhoomi.ContactEnquiries` |
| `Data/Entities/PropertyView.cs` | **New** (or update schema) | `bharatbhoomi.PropertyViews` |
| `Data/Entities/ContactView.cs` | **New** (or update schema) | `bharatbhoomi.ContactViews` |
| `Data/Entities/HomeTourRequest.cs` | **New** (or update schema) | `bharatbhoomi.HomeTourRequests` |
| `Data/NammaKutiraContext.cs` | Add 9 DbSets + OnModelCreating | None on NK |
| `Models/BB/*.cs` | DTOs for BB endpoints | None |
| `Validators/*.cs` | FluentValidation for BB | None |
| `Services/*Service.cs` | BB business logic | None |
| `Controllers/*Controller.cs` | BB API endpoints | None |
| `Program.cs` | DI registration, CORS | None |
| `Data/Migrations/*` | Auto-generated | Creates `bharatbhoomi` schema |

### 9.3 What Is NOT Changed

| File | Why |
|------|-----|
| `Data/Entities/User.cs` | NK entity — no `Role` or `AvatarUrl` columns added |
| `Data/Entities/PropertyInformation.cs` | NK entity — no `Status`, `IsFeatured`, etc. columns added |
| Any NK controller | NK logic remains untouched |
| Any NK service | NK services remain untouched |

---

## 10. Appendix: Constants & Enums

### 10.1 Property Types
```
apartment, house, villa, plot, commercial, pg
```

### 10.2 Property Statuses (BB)
```
pending, approved, rejected
```

### 10.3 Enquiry Statuses
```
pending, read, replied
```

### 10.4 Contact Enquiry Statuses
```
new, in-progress, resolved
```

### 10.5 Home Tour Statuses
```
pending, confirmed, cancelled, completed
```

### 10.6 User Roles (BB)
```
user, owner, admin
```

### 10.7 Builder Seed Data IDs
```
prestige, brigade, sobha, godrej, birla, assetz, salarpuria, puravankara
```

### 10.8 Owner Info (for Notifications)

| Field | Value |
|-------|-------|
| Owner Name | Madhu Chandra |
| Primary Phone | 9448514449 |
| Secondary Phone | 9900151820 |
| Address | No.99/1, Chandapura Dommasandra Road, Kommasandra, Bengaluru-562125 |
| Tagline | Family Realtor |
| Contact Email | contact@bharatbhoomi99.com |

---

## End of Document

> **Version 2.0 changes:** Complete architectural pivot — all BB tables now live under a dedicated `bharatbhoomi` SQL schema. No modifications to existing NammaKutira tables. Two new extension tables (`UserProfiles`, `PropertyMetadata`) replace the previously planned column additions to `Cust.Users` and `Prop.Information`.
>
> **Next Steps:**
> 1. Revert any NK entity modifications made in v1.0 approach
> 2. Create/update BB entity files with `Schema = "bharatbhoomi"`
> 3. Add `UserProfile` and `PropertyMetadata` entities
> 4. Generate and apply EF Core migrations
> 5. Update services to use extension tables instead of modified NK entities
