export enum Viewport {
  '2XL' = 1536,
  XL = 1280,
  LG = 1024,
  MD = 768,
  SM = 640,
}

export enum Status {
  UPDATE_SUCCESS = 'status.updateSuccess',
  UPDATE_FAILED = 'status.updateFailed',
  ADD_SUCCESS = 'status.addSuccess',
  ADD_FAILED = 'status.addFailed',
  REMOVE_SUCCESS = 'status.removeSuccess',
  REMOVE_FAILED = 'status.removeFailed',
  ERROR = 'status.error',
  LOGOUT_FAILED = 'status.logoutFailed',
  LOGOUT_SUCCESS = 'status.logoutSuccess',
  REGISTER_SUCCESS = 'status.registerSuccess',
  ERROR_STATISTICS = 'status.errorStatistics',
  RESTORE_SUCCESS = 'status.restoreSuccess',
  RESTORE_FAILED = 'status.restoreFailed',
}
