import { Trans } from '@megacommerce/shared/server'
import PaymentsWrapper from '@/components/payments/payments-wrapper'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getTranslations(lang: string) {
  const tr = Trans.tr
  return {
    title: tr(lang, 'payments.title'),
    subtitle: tr(lang, 'payments.subtitle'),
    savedPaymentMethods: tr(lang, 'payments.saved_payment_methods'),
    securePayment: tr(lang, 'payments.secure_payment'),
    addNewPaymentMethod: tr(lang, 'payments.add_new_payment_method'),
    creditDebitCard: tr(lang, 'payments.credit_debit_card'),
    paypal: tr(lang, 'payments.paypal'),
    applePay: tr(lang, 'payments.apple_pay'),
    googlePay: tr(lang, 'payments.google_pay'),
    paymentSecurity: tr(lang, 'payments.payment_security'),
    sslEncryption: tr(lang, 'payments.ssl_encryption'),
    sslEncryptionDesc: tr(lang, 'payments.ssl_encryption_desc'),
    pciCompliant: tr(lang, 'payments.pci_compliant'),
    pciCompliantDesc: tr(lang, 'payments.pci_compliant_desc'),
    default: tr(lang, 'payments.default'),
    expires: tr(lang, 'payments.expires'),
    remove: tr(lang, 'payments.remove'),
    addNewCard: tr(lang, 'payments.add_new_card'),
    cardNumber: tr(lang, 'payments.card_number'),
    cardholderName: tr(lang, 'payments.cardholder_name'),
    expiryDate: tr(lang, 'payments.expiry_date'),
    cvc: tr(lang, 'payments.cvc'),
    cardDetailsEncrypted: tr(lang, 'payments.card_details_encrypted'),
    cancel: tr(lang, 'payments.cancel'),
    addCard: tr(lang, 'payments.add_card'),
  }
}

async function PaymentsPage({ searchParams }: Props) {
  const lang = await Trans.getUserLang()
  const tr = await getTranslations(lang)

  return <PaymentsWrapper tr={tr} />
}

export default PaymentsPage
