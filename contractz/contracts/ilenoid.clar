;; Ilenoid - Transparent Charity Tracker on Stacks
;; A milestone-based charity donation escrow with weighted donor voting
;; Built with Clarity 4, epoch "latest"

;; =============================================================
;;                      ERROR CONSTANTS
;; =============================================================

;; ETH/STX Handling
(define-constant ERR_DIRECT_STX_SEND_REJECTED (err u1))

;; NGO Management
(define-constant ERR_INVALID_NGO (err u10))
(define-constant ERR_NGO_ALREADY_VERIFIED (err u11))
(define-constant ERR_NGO_NOT_VERIFIED (err u12))
(define-constant ERR_NOT_VERIFIED_NGO (err u13))

;; Project Creation
(define-constant ERR_INVALID_GOAL (err u20))
(define-constant ERR_INVALID_MILESTONE_ARRAYS (err u21))
(define-constant ERR_INVALID_MILESTONE_AMOUNT (err u22))
(define-constant ERR_MILESTONE_SUM_EXCEEDS_GOAL (err u23))

;; Donations
(define-constant ERR_PROJECT_NOT_FOUND (err u30))
(define-constant ERR_PROJECT_NOT_ACTIVE (err u31))
(define-constant ERR_PROJECT_COMPLETED (err u32))
(define-constant ERR_INVALID_DONATION_AMOUNT (err u33))
(define-constant ERR_INVALID_DONATION_TOKEN (err u34))
(define-constant ERR_INSUFFICIENT_ALLOWANCE (err u35))
(define-constant ERR_INSUFFICIENT_BALANCE (err u36))

;; Voting
(define-constant ERR_NO_CONTRIBUTION (err u40))
(define-constant ERR_ALREADY_VOTED (err u41))
(define-constant ERR_MILESTONE_ALREADY_APPROVED (err u42))
(define-constant ERR_NO_CURRENT_MILESTONE (err u43))

;; Fund Release
(define-constant ERR_NOT_PROJECT_NGO (err u50))
(define-constant ERR_MILESTONE_NOT_APPROVED (err u51))
(define-constant ERR_MILESTONE_ALREADY_RELEASED (err u52))
(define-constant ERR_INSUFFICIENT_PROJECT_BALANCE (err u53))
(define-constant ERR_QUORUM_NOT_MET (err u54))

;; Pause Control
(define-constant ERR_CONTRACT_PAUSED (err u60))
(define-constant ERR_UNAUTHORIZED (err u61))

;; =============================================================
;;                      OWNER CONSTANT
;; =============================================================

;; Contract owner (set at deployment time via tx-sender)
(define-constant CONTRACT_OWNER tx-sender)

;; =============================================================
;;                      DATA VARIABLES
;; =============================================================

;; Project counter (starts at 0, first project will be 1)
(define-data-var project-counter uint u0)

;; Contract pause state
(define-data-var contract-paused bool false)

;; =============================================================
;;                      DATA MAPS
;; =============================================================

;; Verified NGOs: principal -> bool
;; Maps NGO addresses to their verification status
(define-map verified-ngos principal bool)

;; Projects: project-id (uint) -> Project struct
;; Stores all project information
(define-map projects
  uint
  {
    id: uint,
    ngo: principal,
    donation-token: (optional principal), ;; none = STX, (some principal) = SIP-010 token
    goal: uint,
    total-donated: uint,
    balance: uint,
    current-milestone: uint, ;; Current milestone index (starts at 0)
    is-active: bool,
    is-completed: bool
  }
)

;; Milestones: {project-id: uint, milestone-id: uint} -> Milestone struct
;; Stores milestone information for each project
(define-map milestones
  {project-id: uint, milestone-id: uint}
  {
    description: (string-utf8 500),
    amount-requested: uint,
    approved: bool,
    funds-released: bool,
    vote-weight: uint ;; Total vote weight for this milestone
  }
)

;; Project Milestone Count: project-id (uint) -> milestone-count (uint)
;; Stores the total number of milestones for each project
(define-map project-milestone-count uint uint)

;; Donor Contributions: {project-id: uint, donor: principal} -> amount (uint)
;; Tracks how much each donor has contributed to each project
(define-map donor-contributions
  {project-id: uint, donor: principal}
  uint
)

;; Total Project Donations: project-id (uint) -> total-donations (uint)
;; Tracks the total donations received for each project
(define-map total-project-donations uint uint)

;; Has Voted: {project-id: uint, milestone-id: uint, donor: principal} -> has-voted (bool)
;; Tracks whether a donor has voted on a specific milestone
(define-map has-voted
  {project-id: uint, milestone-id: uint, donor: principal}
  bool
)

;; Milestone Snapshot Donations: {project-id: uint, milestone-id: uint} -> snapshot (uint)
;; Stores the total donations at the time the first vote was cast for a milestone
;; This prevents manipulation by allowing donations after voting starts
(define-map milestone-snapshot-donations
  {project-id: uint, milestone-id: uint}
  uint
)

;; =============================================================
;;                  ACCESS CONTROL & PAUSE
;; =============================================================

;; Private function to check if caller is the contract owner
(define-private (is-owner?)
  (is-eq tx-sender CONTRACT_OWNER)
)

;; Private helper to check if contract is not paused
;; Returns true if not paused, false if paused
(define-private (check-not-paused)
  (not (var-get contract-paused))
)

;; Pause the contract (blocks donations and fund releases)
;; Only callable by contract owner
(define-public (pause)
  (begin
    (asserts! (is-owner?) ERR_UNAUTHORIZED)
    (ok (var-set contract-paused true))
  )
)

;; Unpause the contract
;; Only callable by contract owner
(define-public (unpause)
  (begin
    (asserts! (is-owner?) ERR_UNAUTHORIZED)
    (ok (var-set contract-paused false))
  )
)
