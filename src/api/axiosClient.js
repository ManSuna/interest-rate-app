Messaging Platform – IBM MQ


The application integrates with IBM MQ as the primary messaging middleware for Fedwire communication.



Key Design Characteristics
Persistent Messaging enabled to prevent message loss.

Transactional processing ensures exactly-once delivery semantics.

Message acknowledgment control via commit/rollback boundaries.

Dead Letter Queue (DLQ) configured for failed message handling.

Retry mechanisms implemented for transient failures.

Queue depth monitoring integrated with enterprise monitoring tools.



Security Controls
TLS-secured MQ channels.

Mutual certificate authentication.

Firewall-restricted port access.

MQ service accounts restricted by least privilege.



High Availability
MQ queue managers configured in high-availability mode.

Dual data center deployment (NC and PA).

Automatic failover between nodes.



No changes to enterprise MQ standards are introduced. The design aligns with existing Fedwire messaging architecture.

5.13 Application Services


The application services layer is implemented using Spring Boot and follows a layered architecture.



Core Service Components


1. Fedwire Processing Service
Consumes inbound MQ messages.

Validates message structure.

Applies business validation rules.

Encrypts sensitive data before persistence.

Publishes outbound responses to MQ.



2. Transaction Management Service
Manages transactional boundaries.

Ensures ACID compliance.

Handles rollback on processing failure.



3. Authentication & Authorization Service
Integrates with LDAP.

Maps users to roles.

Enforces RBAC controls.



4. Console API Layer
Exposes REST endpoints for:

Balance inquiry

Payment status lookup

Reconciliation

Access restricted to authenticated users.



Architecture Characteristics
Stateless service design.

Externalized configuration (DEV, QE, BT, PROD).

Connection pooling for database access.

Exception handling framework for standardized error responses.

Logging and trace correlation for transaction lifecycle tracking.



No cloud-native services are currently introduced; the application operates within enterprise-hosted Dell PowerFlex infrastructure.

5.14 Application Reports


The TCH Fedwire Interface Console provides reporting capabilities for authorized users.



Available Reports


1. Balance Inquiry Report
Displays account balances.

Supports date-range filtering.



2. Payment Report
Lists inbound and outbound transactions.

Includes transaction status and processing timestamps.

Exportable to CSV and PDF.



3. Reconciliation Report
Compares processed transactions against expected settlement totals.

Identifies discrepancies for operational review.



Report Generation Features
Role-based access control enforced.

Parameterized queries prevent injection risks.

Export formats:

CSV (Excel compatible)

PDF

Audit logging for report generation activity.



The detailed behavior of each report page is described in the Fedwire Interface UI Guide.
