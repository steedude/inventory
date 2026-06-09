export function useAuthLang() {
  const { t } = useI18n()

  const loginSuccess = () => t('auth.loginSuccess')
  const logoutSuccess = () => t('auth.logoutSuccess')
  const signupSignedIn = () => t('auth.signupSignedIn')
  const signupSuccess = () => t('auth.signupSuccess')

  return {
    loginSuccess,
    logoutSuccess,
    signupSignedIn,
    signupSuccess,
  }
}
