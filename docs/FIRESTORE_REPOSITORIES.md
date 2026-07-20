# EasyDes Smart Village Command Center
## Phase 3C: Firestore Repositories Migration & Architecture Guide

This document outlines the production-ready architecture, features, and setup of the **Firestore Repository Implementation** for the **EasyDes Smart Village Command Center** (Desa Bongas Kulon, Majalengka, Jawa Barat).

---

## 1. Architectural Design Pattern

The repository layer follows the **Repository Pattern** and **Dependency Inversion Principle (DIP)**. The application's React UI, Context layers, and services consume abstract interfaces defined in `src/interfaces/repositories.ts` rather than concrete implementations. This enables swapping database modes at runtime without modifications to any UI page.

```
       +------------------+
       |   React UI Component /   |
       |      AppContext          |
       +--------+---------+
                | (Consumes abstract interface e.g. ICitizenRepository)
                v
       +------------------+
       | RepositoryFactory| <--- APP_CONFIG.DB_TYPE ('local' | 'firebase')
       +--------+---------+
                |
        +-------+-------+
        |               |
        v               v
+-------+-------+ +-----+---------+
| LocalStorage  | |   Firebase    |
| Repositories  | |  Repositories |
+---------------+ +---------------+
```

---

## 2. Implemented Entities & Collections

All 14 required entities are fully supported with specialized repository structures:

| Repository Name | Firestore Collection | Unique Key Field | Data Seeding Trigger |
| :--- | :--- | :--- | :--- |
| `FirebaseCitizenRepository` | `citizens` | `nik` | Preseeded from `mockCitizens` |
| `FirebaseEmployeeRepository` | `employees` | `uid` | Preseeded from `mockEmployees` |
| `FirebaseAttendanceRepository` | `attendance` | `attendanceId` | Preseeded from `mockAttendanceList` |
| `FirebaseLetterRepository` | `letters` | `letterId` | Preseeded from `mockLetters` |
| `FirebaseTaxpayerRepository` | `taxpayers` | `nop` | Preseeded from `mockTaxpayers` |
| `FirebaseVillageProjectRepository`| `projects` | `projectId` | Preseeded from `mockProjects` |
| `FirebaseComplaintRepository` | `complaints` | `complaintId` | Preseeded from `mockComplaints` |
| `FirebaseAssetRepository` | `assets` | `assetId` | Preseeded from `mockAssets` |
| `FirebaseNotificationRepository`| `notifications` | `id` | Preseeded from `mockNotifications` |
| `FirebaseVillageMetricRepository` | `finance`, `weather`| Single Document | Preseeded budget and weather objects |
| `FirebasePopulationRepository` | `population` | `id` | Standard collection |
| `FirebaseAgendaRepository` | `agenda` | `id` | Standard collection |
| `FirebaseCctvRepository` | `cctv` | `id` | Preseeded from `mockCctvList` |
| `FirebaseUserRepository` | `users` | `uid` | Standard auth profiles |

---

## 3. High-Resilience Features

The `BaseFirebaseRepository` generic parent class implements 8 core engineering features to provide a bulletproof client-side user experience:

### A. Real-Time Synchronization (`onSnapshot()`)
Uses standard Firestore snapshot streams to keep the local in-memory L1 cache in sync. Any updates in Firestore from other sessions are pushed instantly to the UI.

### B. Dual-Cache offline Persistence
1. **L2 Local Storage Cache:** Powered by Firestore's standard Web Offline Persistence (`persistentLocalCache` and `persistentMultipleTabManager` configured inside `getFirebaseFirestore()`). It caches queries locally inside IndexedDB.
2. **L1 Memory Cache:** Retains synchronized arrays in memory for instant, zero-latency rendering, bypassing the asynchronous nature of standard database queries.

### C. Optimistic UI Updates
When a mutate method (e.g., `create`, `update`, `delete`) is triggered:
1. The repository immediately updates its local L1 memory cache.
2. The UI is updated instantly with zero lag.
3. The write operation to Firestore is performed asynchronously in the background.
4. If the write fails (even after retries), the cache is rolled back to the original state and the error is logged safely.

### D. Automatic Retry Strategy
All critical writes (Set, Update, Delete, Batch write) are wrapped in `withRetry`:
* Standard configuration: **3 attempts** with **exponential backoff delay** (starting at 1000ms).
* Automatically recovers from transient internet drops and slow mobile network switches.

### E. Soft Deletes
The repository supports standard hard deletes (`delete(id)`) and soft deletes (`softDelete(id)`). When soft delete is triggered, the `isDeleted: true` property is added and the document is automatically filtered out from the default listing.

### F. Query Extensions (Search, Filtering, Sorting, Pagination)
Advanced database features are supported natively:
* **Search:** String query evaluation across customizable target fields.
* **Filtering:** Functional predicate evaluations (`filter(item => item.poorStatus === true)`).
* **Sorting:** Highly efficient comparative sorting algorithm.
* **Pagination:** Standard sliding windows (`paginate(page, limitVal)`).

### G. Transaction Support
Atomic updates can be executed via `runInTransaction(action, docId)` to ensure no two operators mutate the same document concurrently (e.g. digital letter signing, tax payments ledger).

### H. Batch Write Support
Enables executing multiple creates, updates, and deletes in a single, atomic network call via `executeBatchWrite(actions)`. Used extensively for initial data seeding.

---

## 4. Activation & Verification

To verify or activate the Firebase mode:
1. Open `.env` or check your environment variables list.
2. Set `VITE_DB_TYPE=firebase`.
3. Provide valid Firebase parameters:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```
4. Build the application:
   ```bash
   npm run build
   ```
   *Note: If the Firebase variables are omitted, blank, or `VITE_DB_TYPE=local` is active, the applet gracefully falls back to the fully offline browser LocalStorage mode.*
