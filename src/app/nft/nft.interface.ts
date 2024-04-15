import { INft } from '@schemas'

export type OutputDetailNFT = INft

/**
 * Interface for the output of a function that returns an array of INft objects and a total count.
 * @interface OutputOwn
 * @property {INft[]} data - The array of INft objects returned by the function.
 * @property {number} total - The total count of INft objects returned by the function.
 */
export interface OutputOwn {
  data: INft[]
  total: number
}

/**
 * A type that represents the possible fields that can be used to sort mangrove data.
 * Fields include:
 * - title
 * - create_at
 * - token_id
 * - class
 * - level
 * - move_speed
 * - attack_points
 * - health_points
 * - defender_points
 * - win_count
 */
export type SortField =
  | 'title'
  | 'create_at'
  | 'token_id'
  | 'class'
  | 'level'
  | 'move_speed'
  | 'attack_points'
  | 'health_points'
  | 'defender_points'
  | 'win_count'

/**
 * A type alias for the sort order of a list.
 * @typedef {'ASC' | 'DESC'} SortType
 */
export type SortType = 'ASC' | 'DESC'

/**
 * A type that represents the possible fields for a range in the mangrove planting app.
 * The fields include:
 * - level
 * - move_speed
 * - attack_points
 * - health_points
 * - defender_points
 * - win_count
 */
export type RangeField =
  | 'level'
  | 'move_speed'
  | 'attack_points'
  | 'health_points'
  | 'defender_points'
  | 'win_count'

/**
 * A type alias for an array of SortField objects.
 * @typedef {SortField[]} SortFields
 */
export type SortFields = SortField[]

/**
 * An array of SortType values that can be used to sort an array of objects.
 */
export type SortTypes = SortType[]

/**
 * An array of RangeField objects that define a range of values.
 * @typedef {RangeField[]} RangeFields
 */
export type RangeFields = RangeField[]
