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
const fieldsMap1 = { 0: ['first_name', 'some_filed'], 1: ['email'], 2: ['other_field'] }
const errors1: StringMap = { data: { email: 'email error' } }
console.log(getFirstErroredStep(errors1, fieldsMap1)) // must return 1

const fieldsMap2 = { 0: ['email', 'some_filed'], 1: ['note'], 2: ['other_field'] }
const errors2: StringMap = { data: { email: 'email error', note: 'note error' } }
console.log(getFirstErroredStep(errors2, fieldsMap2)) // must return 0

const fieldsMap3 = { 0: ['email', 'some_filed'], 1: ['note'], 2: ['other_field'] }
const errors3: StringMap = { data: { other_field: 'other_field error' } }
console.log(getFirstErroredStep(errors3, fieldsMap3)) // must return 2

const fieldsMap4 = { 0: ['email'], 1: ['note'] }
const errors4: StringMap = { data: { not_mapped: 'irrelevant error' } }
console.log(getFirstErroredStep(errors4, fieldsMap4)) // -1

const fieldsMap5 = { 0: ['email'], 1: ['note'] }
const errors5: StringMap = { data: {} }
console.log(getFirstErroredStep(errors5, fieldsMap5)) // -1
