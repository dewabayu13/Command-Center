# Repository Layer

This directory implements the **Repository Pattern** and **Factory Pattern** for the EasyDes Smart Village Command Center. This decouples the application's UI / business logic from the underlying data persistence mechanisms.

## Directory Structure

- `LocalStorageRepositories.ts`: Implements the data access contracts (`src/interfaces/repositories.ts`) using browser `localStorage` as primary storage, seeded with highly realistic default datasets if empty.
- `RepositoryFactory.ts`: Centralizes instance creation of repositories. Reads `APP_CONFIG.DB_TYPE` to decide whether to provide LocalStorage or Firebase-backed repositories.

## SOLID Principles Applied

1. **Single Responsibility (SRP)**: Data operations are fully isolated inside concrete Repository classes. Components and Context do not need to know where or how records are stored.
2. **Dependency Inversion (DIP)**: React components and contexts interact with abstract Repository interfaces (`ICitizenRepository`, etc.) rather than concrete implementations.
3. **Open/Closed (OCP)**: Adding a new database mechanism (e.g., Firebase Firestore, PostgreSQL via APIs) only requires writing a new class implementing the interfaces and adding it to `RepositoryFactory.ts` without modifying any page layouts.

## Swapping to Firebase (Phase 3 Prep)

To activate Firebase:
1. Change `DB_TYPE` inside `.env` or `appConfig.ts` to `'firebase'`.
2. Implement Firebase repositories under `src/repositories/FirebaseRepositories.ts` conforming to the interfaces.
3. Update `RepositoryFactory.ts` to instantiate them.
