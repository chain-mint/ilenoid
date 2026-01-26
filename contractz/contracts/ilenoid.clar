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

;; =============================================================
;;                      NGO MANAGEMENT
;; =============================================================

;; Register a new NGO as verified
;; Only callable by contract owner
;; @param ngo: The principal address of the NGO to register
;; @return: (ok true) on success
(define-public (register-ngo (ngo principal))
  (begin
    ;; Check: Caller is owner
    (asserts! (is-owner?) ERR_UNAUTHORIZED)
    ;; Check: Contract is not paused
    (asserts! (check-not-paused) ERR_CONTRACT_PAUSED)
    ;; Check: NGO is not already verified
    (asserts! (not (default-to false (map-get? verified-ngos ngo))) ERR_NGO_ALREADY_VERIFIED)
    ;; Set NGO as verified
    (map-set verified-ngos ngo true)
    (ok true)
  )
)

;; Revoke verification status of an NGO
;; Only callable by contract owner
;; @param ngo: The principal address of the NGO to revoke
;; @return: (ok true) on success
(define-public (revoke-ngo (ngo principal))
  (begin
    ;; Check: Caller is owner
    (asserts! (is-owner?) ERR_UNAUTHORIZED)
    ;; Check: NGO is currently verified
    (asserts! (default-to false (map-get? verified-ngos ngo)) ERR_NGO_NOT_VERIFIED)
    ;; Revoke NGO verification
    (map-set verified-ngos ngo false)
    (ok true)
  )
)

;; Check if an address is a verified NGO
;; Read-only function
;; @param ngo: The principal address to check
;; @return: true if verified, false otherwise
(define-read-only (is-verified-ngo (ngo principal))
  (default-to false (map-get? verified-ngos ngo))
)

;; =============================================================
;;                      PROJECT CREATION
;; =============================================================

;; Private helper to validate, sum, and create milestones
;; Returns (ok total-amount) if valid, (err code) if invalid
(define-private (process-milestones-inline
  (project-id uint)
  (descriptions (list 50 (string-utf8 500)))
  (amounts (list 50 uint))
  (index uint)
  (total uint)
)
  (if (>= index (len descriptions))
    (ok total)
    (let ((description (unwrap! (element-at descriptions index) ERR_INVALID_MILESTONE_ARRAYS))
          (amount (unwrap! (element-at amounts index) ERR_INVALID_MILESTONE_ARRAYS)))
      (if (is-eq amount u0)
        (err ERR_INVALID_MILESTONE_AMOUNT)
        (begin
          (map-set milestones 
            {project-id: project-id, milestone-id: index}
            {
              description: description,
              amount-requested: amount,
              approved: false,
              funds-released: false,
              vote-weight: u0
            }
          )
          (process-milestones-inline project-id descriptions amounts (+ index u1) (+ total amount))
        )
      )
    )
  )
)

;; Create a new project with milestones
;; Only callable by verified NGOs
;; @param donation-token: (optional principal) - none for STX, (some principal) for SIP-010 token
;; @param goal: The total fundraising goal for the project
;; @param descriptions: List of milestone descriptions
;; @param amounts: List of milestone funding amounts (must match descriptions length)
;; @return: (ok project-id) on success
(define-public (create-project
  (donation-token (optional principal))
  (goal uint)
  (descriptions (list 50 (string-utf8 500)))
  (amounts (list 50 uint))
)
  (begin
    ;; Check: Caller is verified NGO
    (asserts! (is-verified-ngo tx-sender) ERR_NOT_VERIFIED_NGO)
    ;; Check: Contract is not paused
    (asserts! (check-not-paused) ERR_CONTRACT_PAUSED)
    ;; Check: Goal > 0
    (asserts! (> goal u0) ERR_INVALID_GOAL)
    ;; Check: Descriptions and amounts have same length
    (asserts! (is-eq (len descriptions) (len amounts)) ERR_INVALID_MILESTONE_ARRAYS)
    ;; Check: At least one milestone
    (asserts! (> (len descriptions) u0) ERR_INVALID_MILESTONE_ARRAYS)
    ;; Calculate project ID first
    (let ((new-counter (+ (var-get project-counter) u1))
          (project-id new-counter))
      ;; Validate, sum, and create milestones
      (let ((total-amounts (try! (process-milestones-inline project-id descriptions amounts u0 u0))))
        ;; Check: Sum of amounts <= goal
        (asserts! (<= total-amounts goal) ERR_MILESTONE_SUM_EXCEEDS_GOAL)
        (begin
          ;; Update project counter
          (var-set project-counter new-counter)
          ;; Create and store project
          (map-set projects project-id {
            id: project-id,
            ngo: tx-sender,
            donation-token: donation-token,
            goal: goal,
            total-donated: u0,
            balance: u0,
            current-milestone: u0,
            is-active: true,
            is-completed: false
          })
          ;; Store milestone count
          (map-set project-milestone-count project-id (len descriptions))
          (ok project-id)
        )
      )
    )
  )
)

;; =============================================================
;;                      STX DONATIONS
;; =============================================================

;; Donate STX to a project
;; @param project-id: The ID of the project to donate to
;; @param amount: The amount of STX to donate (in microstacks)
;; @return: (ok amount) on success
;; @dev Only works for projects that accept STX donations (donation-token is none).
;;      Frontend must send STX with the transaction using post-conditions.
;;      Updates all donation accounting.
(define-public (donate (project-id uint) (amount uint))
  (let ((project (unwrap! (map-get? projects project-id) ERR_PROJECT_NOT_FOUND)))
    (begin
      ;; Check: Project exists (already checked via unwrap!)
      ;; Check: Project is active
      (asserts! (get is-active project) ERR_PROJECT_NOT_ACTIVE)
      ;; Check: Project is not completed
      (asserts! (not (get is-completed project)) ERR_PROJECT_COMPLETED)
      ;; Check: Amount > 0
      (asserts! (> amount u0) ERR_INVALID_DONATION_AMOUNT)
      ;; Check: Project accepts STX (donation-token is none)
      (asserts! (is-none (get donation-token project)) ERR_INVALID_DONATION_TOKEN)
      ;; Check: Contract is not paused
      (asserts! (check-not-paused) ERR_CONTRACT_PAUSED)
      ;; Transfer STX from tx-sender to contract
      (try! (stx-transfer? amount tx-sender current-contract))
      ;; Update donor contributions
      (let ((current-contribution (default-to u0 (map-get? donor-contributions {project-id: project-id, donor: tx-sender}))))
        (map-set donor-contributions {project-id: project-id, donor: tx-sender} (+ current-contribution amount))
      )
      ;; Update total project donations
      (let ((current-total (default-to u0 (map-get? total-project-donations project-id))))
        (map-set total-project-donations project-id (+ current-total amount))
      )
      ;; Update project's total-donated and balance
      (map-set projects project-id (merge project {
        total-donated: (+ (get total-donated project) amount),
        balance: (+ (get balance project) amount)
      }))
      (ok amount)
    )
  )
)

;; =============================================================
;;                  SIP-010 TOKEN DONATIONS
;; =============================================================

;; Donate SIP-010 fungible tokens to a project
;; @param project-id: The ID of the project to donate to
;; @param token-contract: The principal of the SIP-010 token contract
;; @param amount: The amount of tokens to donate
;; @return: (ok amount) on success
;; @dev Only works for projects that accept token donations (donation-token matches token-contract).
;;      Calls the SIP-010 transfer function via contract-call?.
;;      Updates all donation accounting.
(define-public (donate-token
  (project-id uint)
  (token-contract principal)
  (amount uint)
)
  (let ((project (unwrap! (map-get? projects project-id) ERR_PROJECT_NOT_FOUND)))
    (begin
      ;; Check: Project exists (already checked via unwrap!)
      ;; Check: Project is active
      (asserts! (get is-active project) ERR_PROJECT_NOT_ACTIVE)
      ;; Check: Project is not completed
      (asserts! (not (get is-completed project)) ERR_PROJECT_COMPLETED)
      ;; Check: Amount > 0
      (asserts! (> amount u0) ERR_INVALID_DONATION_AMOUNT)
      ;; Check: Project accepts tokens (donation-token is not none)
      (asserts! (is-some (get donation-token project)) ERR_INVALID_DONATION_TOKEN)
      ;; Check: Token contract matches project's donation-token
      (asserts! (is-eq token-contract (unwrap-panic (get donation-token project))) ERR_INVALID_DONATION_TOKEN)
      ;; Check: Contract is not paused
      (asserts! (check-not-paused) ERR_CONTRACT_PAUSED)
      ;; Call SIP-010 transfer function: transfer from tx-sender to contract
      ;; SIP-010 signature: (transfer (uint principal principal (optional (buff 34))) (response bool uint))
      (try! (contract-call? token-contract transfer amount tx-sender current-contract none))
      ;; Update donor contributions
      (let ((current-contribution (default-to u0 (map-get? donor-contributions {project-id: project-id, donor: tx-sender}))))
        (map-set donor-contributions {project-id: project-id, donor: tx-sender} (+ current-contribution amount))
      )
      ;; Update total project donations
      (let ((current-total (default-to u0 (map-get? total-project-donations project-id))))
        (map-set total-project-donations project-id (+ current-total amount))
      )
      ;; Update project's total-donated and balance
      (map-set projects project-id (merge project {
        total-donated: (+ (get total-donated project) amount),
        balance: (+ (get balance project) amount)
      }))
      (ok amount)
    )
  )
)
