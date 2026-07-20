# Domain-Driven Type System

This directory holds the TypeScript type declarations and enums representing the core domain models of the EasyDes Smart Village Command Center.

## Files & Domains

- `user.ts`: Enumerates system User Roles (`UserRole`) like `Head of Village`, `Secretary`, `Admin`, `Operator`, `Head of Hamlet`, `Tax Collector`, etc.
- `citizen.ts`: Defines citizen biodata, Dusun (Hamlet) residency, and government assistance aid recipient categories.
- `attendance.ts`: Prescribes the biometric and GPS-validated clock-in model for village government employees.
- `letter.ts`: Standardizes digital letter service workflows, tracking verification status and QR-verifiable digital signatures.
- `tax.ts`: Manages taxpayer status, PBB target values, and collector tracking datasets.
- `project.ts`: Standardizes the village physical infrastructure development model.
- `complaint.ts`: Represents public citizen feedback, GPS location attachments, and emergency panic alerts.
- `asset.ts`: Models village inventory, land, buildings, vehicles, and QR-asset-tracking identifiers.
- `notification.ts`: Houses smart push notifications, alerts, and system telemetry markers.
- `budget.ts`: Models APBDes village revenues, expenditures, and absorption statistics.
- `weather.ts`: Standardizes real-time climate monitoring indicators and disaster status warnings.
- `index.ts`: The unified entry-point re-exporting all types.
