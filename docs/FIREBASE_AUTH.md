# EasyDes Smart Village Command Center
## Phase 3B: Firebase Authentication & Security Architecture Guide

This document outlines the production-ready architecture, setup, installation, and deployment procedures for the **EasyDes Smart Village Command Center** authentication system, specifically tailored for **Desa Bongas Kulon, Kecamatan Sumberjaya, Kabupaten Majalengka, Jawa Barat**.

---

## 1. System Roles Matrix (RBAC)

The system enforces fine-grained Role-Based Access Control (RBAC) across 11 distinct administrative and public roles.

| Role Key | Human Readable Label | System Access Description | Enforced Protected Pages / Moduls |
| :--- | :--- | :--- | :--- |
| `Super Admin` | System Administrator | Full root control over users, logs, and database structures. | All modules, System Configuration, Logs. |
| `Kepala Desa` | Village Head | Executive view, digital signatures, letter approvals. | Overview, Population, Attendance, Letters, Tax, Finance, Projects, CCTV, Assets, Complaints. |
| `Sekretaris Desa` | Secretary | Back-office supervisor, administrative approvals, letter dispatch. | Overview, Population, Attendance, Letters, Tax, Finance, Projects, CCTV, Assets, Complaints. |
| `Kaur Keuangan` | Treasurer | Financial record keeper, APBDes ledger entries, asset valuations. | Overview, Finance, Assets. |
| `Kasi Pemerintahan` | Government Section Chief | Local statistics, civic registries, and citizen updates. | Overview, Population. |
| `Kasi Pelayanan` | Services Section Chief | Digital services front-desk, citizen letters dispatch. | Overview, Letters, Complaints. |
| `Kasi Kesejahteraan` | Welfare Section Chief | Project monitoring, social aids allocations, development plans. | Overview, Projects, Finance (view-only). |
| `Kadus` | Hamlet Head (Kepala Dusun) | Local hamlet management, neighborhood aduan verification. | Overview, CCTV (local), complaints, local RT/RW profiles. |
| `Operator` | Command Center Operator | Real-time monitoring, live stream management, routine log updates. | Overview, Population, Attendance, Letters, Tax, Projects, CCTV, Complaints. |
| `Kolektor PBB` | Tax Collector | Taxpayer home monitoring, on-site route mapping. | Overview, Tax Monitor, Taxpayer Map, Routes. |
| `Public` | Public / Citizens | Self-service letter requests, incident reporting, transparent budgets. | Overview, Letters (Public request), Complaints (File reports), APBDes (read-only). |

---

## 2. Firestore Database Schemas

The following documents are automatically managed inside the `users` Firestore Collection when any registration or login occurs.

### Collection: `users`
* **Path:** `/users/{uid}`
* **Document Structure:**
```json
{
  "uid": "String (Firebase Auth UID)",
  "email": "String (Unique email)",
  "fullName": "String (User's real name)",
  "role": "String (One of the 11 Roles)",
  "phoneNumber": "String (Optional phone number)",
  "dusunId": "String (Optional residence hamlet ID: dusun_01 to dusun_04)",
  "createdAt": "Timestamp (Server timestamp)",
  "updatedAt": "Timestamp (Server timestamp, optional)"
}
```

---

## 3. Firebase Console Configuration Guide

To transition from Local Development (Offline Mock mode) to Production Firebase Cloud services, complete the following setup:

### Step 3.1: Initialize Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `easydes-bongas-kulon`.
3. Enable or disable Google Analytics depending on compliance requirements, and click **Create Project**.

### Step 3.2: Enable Authentication Providers
1. Go to **Build** > **Authentication** > **Get Started**.
2. Under the **Sign-in method** tab, enable:
   * **Email/Password** (Enable both Email/Password and Passwordless Sign-In fallback).
   * **Google** (Configure the project support email and save client keys).

### Step 3.3: Provision Cloud Firestore Database
1. Go to **Build** > **Firestore Database** > **Create Database**.
2. Set the Location (Choose nearest server, e.g., `asia-southeast2` for Jakarta/Indonesia for ultra-low latency).
3. Start in **Production Mode** to prevent unauthorized client access.

---

## 4. Production Security Rules (`firestore.rules`)

Deploy the following secure rules to your Firebase console under **Firestore Database** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Core helper function to check if a user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to get user profile record from /users collection
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    // Helper function to check if active user matches a specific role list
    function hasAnyRole(roles) {
      return isAuthenticated() && (getUserData().role in roles || getUserData().role == 'Admin');
    }

    // --- Users Collection Rules ---
    match /users/{userId} {
      // Users can read their own profile, Admins/Kades/Sekdes can view all profiles
      allow read: if isAuthenticated() && (request.auth.uid == userId || hasAnyRole(['Admin', 'Village Head', 'Secretary', 'Operator']));
      
      // Users can register their own profile initially
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Only the user themselves or System Admins can modify profile details
      allow update: if isAuthenticated() && (request.auth.uid == userId || hasAnyRole(['Admin']));
      
      // Only root administrators can delete user accounts
      allow delete: if isAuthenticated() && hasAnyRole(['Admin']);
    }

    // --- Other Collections Rules ---
    // Enforce proper administrative controls based on the system architecture audit
    match /{document=**} {
      allow read, write: if isAuthenticated() && hasAnyRole(['Admin']);
    }
  }
}
```

---

## 5. Environment Installation & Variables Setup

Update your root `.env` (or setup via your cloud provider dashboard) with the following parameters:

```env
# Toggle DB_TYPE to active Firebase ('firebase' or 'local')
VITE_DB_TYPE=firebase

# Firebase Client API Configurations
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=easydes-bongas-kulon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=easydes-bongas-kulon
VITE_FIREBASE_STORAGE_BUCKET=easydes-bongas-kulon.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

*Note: If `VITE_DB_TYPE` is omitted or set to `local`, or if the variables are blank, the application automatically runs in **Offline Mock mode** where you can login instantly with 1-click preset accounts without any network overhead.*

---

## 6. How to Deploy

To compile the application bundle and publish, use the following commands:

```bash
# 1. Install all required dependencies
npm install

# 2. Run local development linter checks
npm run lint

# 3. Build optimized static production distribution assets
npm run build
```

This will output clean optimized client assets into the `dist/` directory, ready to be served from Firebase Hosting, Cloud Run, or any corporate static web server.
