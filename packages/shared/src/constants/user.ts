export const UserNameRegex = new RegExp('^[a-zA-Z0-9.\\-_]+$')

// User validation constants
export const UserEmailMaxLength = 256
export const UserFirstNameMaxLength = 64
export const UserFirstNameMinLength = 2
export const UserLastNameMaxLength = 64
export const UserLastNameMinLength = 2
export const UserAuthDataMaxLength = 128
export const UserNameMaxLength = 64
export const UserNameMinLength = 2
export const UserPasswordMaxLength = 72
export const UserPasswordMinLength = 8
export const UserLocaleMaxLength = 5
export const UserTimezoneMaxLength = 256
export const UserRolesMaxLength = 256
export const UserImageMaxSizeKB = 1024 * 1024 * 2
export const UserImageAcceptedTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg']
