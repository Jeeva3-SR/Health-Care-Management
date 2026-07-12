package com.java.health.entity;

public enum AccountStatus {
    /**
     * Account is active and fully authorized to log into the platform.
     * Assigned to patients immediately, and to doctors once approved by an Admin.
     */
    ACTIVE,

    /**
     * Account is locked out of the system pending credential validation by a Government Officer.
     * Assigned automatically when a doctor self-registers publicly.
     */
    PENDING_VERIFICATION,

    /**
     * Account was audited and rejected by an Admin due to invalid or expired documentation.
     */
    REJECTED
}