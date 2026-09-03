export type Page =
  | 'landing'
  | 'login'
  | 'kyc'
  | 'rider-dashboard'
  | 'workscore'
  | 'ev-financing'
  | 'financing-application'
  | 'repayments'
  | 'ownership'
  | 'lender-login'
  | 'lender-dashboard'
  | 'rider-profile'
  | 'application-details'

export type NavigateFn = (page: Page) => void
