import { useState } from "react"
import { useForm } from "@mantine/form"
import { yupResolver } from "mantine-form-yup-resolver"
import { toast } from "react-toastify"
import { ObjString } from "@megacommerce/shared"

import { Products } from "@/helpers/client"

type Props = {
  tr: ObjString
}

function ProductCreateHooks({ tr }: Props) {
  const [active, setActive] = useState(0);

  const identityForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.identityFormValues(),
    validate: yupResolver(Products.identityForm(tr))
  })

  const descForm = useForm({
    validateInputOnBlur: true,
    initialValues: Products.descriptionFormValues(),
    validate: yupResolver(Products.descriptionForm(tr))
  })

  const nextStep = () => {
    let valid = false
    if (active === 0) valid = !identityForm.validate().hasErrors
    if (!valid) {
      toast.error(tr.correct)
      return
    }
    setActive((current) => (current < 6 ? current + 1 : current))
  }

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return {
    active,
    setActive,
    identityForm,
    descForm,
    nextStep,
    prevStep,
  }
}

export default ProductCreateHooks
