import { Translations } from '.'

export const TranslationsEN: Translations = {
  'error.internal': 'Sorry, Unexpected internal server error. Our team has been notified. Please try again',
  'error.canceled': 'The request was canceled',
  'error.unknown': 'An unexpected error occurred. Please contact support if this persists.',
  'error.invalid_argument': 'Invalid request data. Please verify your input and try again.',
  'error.deadline_exceeded': 'The operation timed out',
  'error.not_found': 'The requested resource was not found.',
  'error.already_exists': 'This resource already exists.',
  'error.permission_denied': "You don't have permission to execute this operation",
  'error.resource_exhausted': 'Rate limit exceeded. Please try again later.',
  'error.failed_precondition': 'Precondition check failed. Please ensure all requirements are met.',
  'error.aborted': 'The operation was aborted. Please try again.',
  'error.out_of_range': 'The operation was attempted past the valid range.',
  'error.unimplemented': 'The operation is not implemented or is not supported/enabled in this service.',
  'error.unavailable': 'Service is temporarily unavailable. Please try again in a few moments.',
  'error.data_loss': 'Unrecoverable data loss or corruption.',
  'error.unauthenticated': 'Authentication required. Please log in and try again.',
  'error.network_unavailable': 'Network connection unavailable. Please check your internet connection.',
  'form.fields.length_between': 'This field must be between {{Min}} and {{Max}} characters',
  'form.fields.min_length': 'Field must be at least {{Min}} characters',
  'form.fields.max_length': 'Field must be at most {{Max}} characters',
  'form.fields.min': 'Field must not be less than {{Min}}',
  'form.fields.max': 'Field must not be greater than {{Max}}',
  'form.fields.greater_than': 'Field must be greater than {{Max}}',
  'form.fields.less_than': 'Field must be less than {{Min}}',
  'products.media.variant_images.exceeded_for_variant':
    "The Product's Variant that is titled with: {{Title}} has exceeded the max: {{Max}} of allowed images, Please remove some of them",
  'products.media.variant_images.missing_for_variant':
    "The Product's Variant that is titled with: {{Title}} has no assigned images, Please provide at leaset {{Min}}, and at most {{Max}} images",
  'products.images.length.error':
    'You must provid: at least {{Min}} images, and at most {{Max}} images for your product',
  'products.offer.variant_pricing': "Sitting the pricing options of: {{Title}}, Products's Variant",
}
