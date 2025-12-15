'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button, Select, Textarea, NumberInput } from '@mantine/core'
import { useForm, UseFormReturnType } from '@mantine/form'
import { object, string, number } from 'yup'

import { ObjString, ValueLabel } from '@megacommerce/shared'
import { handleGrpcWebErr } from '@megacommerce/shared/client'
import { InventoryListItem } from '@megacommerce/proto/web/inventory/v1/inventory_list'
import { InventoryUpdateOperation as InventoryUpdateOperationEnum } from '@megacommerce/proto/web/inventory/v1/inventory_update'
import { inventoryClient } from '@/helpers/client'
import { useAppStore } from '@/store'
import { PagesPaths } from '@/helpers/client'

type Props = {
  tr: ObjString
  item: InventoryListItem
}

interface UpdateFormValues {
  operation: string
  quantity: number | string
  reason: string
}

function InventoryUpdateOperation({ tr, item }: Props) {
  const router = useRouter()
  const clientInfo = useAppStore((state) => state.clientInfo)
  const [submitting, setSubmitting] = useState(false)

  const operationOptions: ValueLabel[] = [
    { value: 'set', label: tr.operationSet },
    { value: 'add', label: tr.operationAdd },
    { value: 'subtract', label: tr.operationSubtract },
  ]

  const validationSchema = object().shape({
    operation: string().required(tr.required),
    quantity: number().typeError(tr.invNum).positive(tr.bgrThan0).required(tr.required),
    reason: string().required(tr.required),
  })

  const form = useForm<UpdateFormValues>({
    initialValues: { operation: 'set', quantity: '', reason: '' },
    validate: (values) => {
      const errors: Record<string, string> = {}
      try {
        validationSchema.validateSync(values, { abortEarly: false })
      } catch (err: any) {
        err.inner.forEach((error: any) => {
          if (error.path) errors[error.path] = error.message
        })
      }
      return errors
    },
  })

  const handleSubmit = async (values: UpdateFormValues) => {
    if (submitting) return

    try {
      setSubmitting(true)
      const operationMap: Record<string, InventoryUpdateOperationEnum> = {
        set: InventoryUpdateOperationEnum.INVENTORY_UPDATE_OPERATION_SET,
        add: InventoryUpdateOperationEnum.INVENTORY_UPDATE_OPERATION_ADD,
        subtract: InventoryUpdateOperationEnum.INVENTORY_UPDATE_OPERATION_SUBTRACT,
      }

      const res = await (
        await inventoryClient()
      ).InventoryUpdate({
        reason: values.reason,
        items: [
          {
            productId: item.productId,
            variantId: item.variantId,
            sku: item.sku,
            operation: operationMap[values.operation],
            quantity: Number(values.quantity),
          },
        ],
      })

      if (res.error) {
        toast.error(res.error.message || tr.errorLoading)
        if (res.error.errors?.values) {
          const errors = res.error.errors.values as Record<string, string>
          Object.entries(errors).forEach(([key, value]) => {
            form.setFieldError(key, value)
          })
        }
        return
      }

      toast.success(res.data?.message || tr.updateSuccess)
      router.push(PagesPaths.inventory)
    } catch (error) {
      toast.error(handleGrpcWebErr(error, clientInfo.language))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
      <form onSubmit={form.onSubmit(handleSubmit)} className='space-y-6'>
        <Select
          label={tr.operation}
          placeholder={tr.operation}
          data={operationOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
          withAsterisk
          size='sm'
          {...form.getInputProps('operation')}
        />
        <NumberInput
          label={tr.quantity}
          placeholder={tr.quantity}
          withAsterisk
          min={0}
          size='sm'
          {...form.getInputProps('quantity')}
        />
        <Textarea
          label={tr.reason}
          placeholder={tr.reason}
          withAsterisk
          minRows={4}
          size='sm'
          {...form.getInputProps('reason')}
        />
        <div className='flex gap-3 pt-4'>
          <Button fullWidth variant='outline' onClick={() => router.back()}>
            {tr.cancel}
          </Button>
          <Button fullWidth color='blue' type='submit' loading={submitting}>
            {tr.update}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InventoryUpdateOperation
