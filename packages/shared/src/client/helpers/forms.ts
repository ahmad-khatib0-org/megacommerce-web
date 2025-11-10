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
  for (const field of Object.keys(errors.values)) {
    if (field in reverse) {
      idx = idx === null ? reverse[field] : Math.min(reverse[field], idx)
    }
  }

  return idx === null ? -1 : idx
}

/**
 * Finds the first (lowest step number) errored step based on form errors and field mappings
 *
 * @param errors - StringMap protobuf object containing error mappings in values field
 *
 * @param fieldsMap - Map that associates step names with their step number
 *
 * @returns The step number of the first errored step, or -1 if no errors are found
 */
export const getFirstErroredStepV2 = (
  errors: StringMap,
  fieldsMap: Map<string, { stepNumber: number }>
): number => {
  let firstErroredStep: number | null = null

  for (const fieldName of Object.keys(errors.values)) {
    for (const [stepName, stepData] of fieldsMap.entries()) {
      if (fieldName.startsWith(stepName)) {
        const stepNumber = stepData.stepNumber
        firstErroredStep = firstErroredStep === null ? stepNumber : Math.min(stepNumber, firstErroredStep)
        // Break inner loop since we found the step for this field
        break
      }
    }
  }

  return firstErroredStep === null ? -1 : firstErroredStep
}

/**
 * Deeply merges two objects, recursively combining nested objects while preserving
 * all properties that aren't explicitly overridden.
 *
 * @param target - The base object to merge into
 * @param source - The source object containing updates. Properties from this object
 *                 will override target properties at all nesting levels.
 * @returns A new object with deeply merged properties
 *
 * @example
 * // Basic usage - updates nested objects without losing other properties
 * const current = {
 *   media: {
 *     missing_form_id: 'old',
 *     variants: { var1: { count: 'error' } }
 *   },
 *   description: { bullet_points_count: '5' }
 * };
 *
 * const updates = {
 *   media: {
 *     missing_form_id: 'new' // Only update this field
 *   }
 * };
 *
 * const result = deepMerge(current, updates);
 * // Result:
 * // {
 * //   media: {
 * //     missing_form_id: 'new',        // Updated
 * //     variants: { var1: { count: 'error' } }  // Preserved
 * //   },
 * //   description: { bullet_points_count: '5' }  // Preserved
 * // }
 *
 * @example
 * // Handles null, undefined, and falsy values correctly
 * const result = deepMerge(current, {
 *   media: null,                    // Sets media to null
 *   missing_form_id: undefined,     // Sets to undefined
 *   count: 0,                       // Sets to 0
 *   active: false,                  // Sets to false
 *   name: "",                       // Sets to empty string
 * });
 *
 * @example
 * // Arrays are replaced (not merged)
 * const withArray = { items: [1, 2, 3] };
 * const arrayUpdate = { items: [4, 5] };
 * const result = deepMerge(withArray, arrayUpdate);
 * // Result: { items: [4, 5] } - original array replaced
 */
export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const result = { ...target } as any

  for (const key in source) {
    const sourceValue = source[key]

    // Only check if it exists in source (not if it's truthy)
    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = deepMerge(result[key] || {}, sourceValue)
    } else {
      result[key] = sourceValue // This allows null, 0, false, "" etc.
    }
  }
  return result
}
