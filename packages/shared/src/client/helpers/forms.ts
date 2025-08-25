import 'client-only'
import { StringMap } from '@megacommerce/proto/shared/v1/types'

/** getFirstErroredStep gets the earliest step index that has errored-out fields,
 * or -1 if no matching fields have errors
 *
 * @param errors is the object that contains the errors
 *
 * @param fieldsMap is in the form of: step_index: [fields in this step]
 *
 * note: step_index must start at 0, and increase by one for each step
 */
export const getFirstErroredStep = (errors: StringMap, fieldsMap: { [idx: number]: string[] }): number => {
  // Build reverse map: field -> step index
  const reverse: Record<string, number> = {}
  for (const [idx, fields] of Object.entries(fieldsMap)) {
    for (const f of fields) reverse[f] = parseInt(idx)
  }

  let idx: number | null = null
  for (const field of Object.keys(errors.data)) {
    if (field in reverse) {
      idx = idx === null ? reverse[field] : Math.min(reverse[field], idx)
    }
  }

  return idx === null ? -1 : idx
}
