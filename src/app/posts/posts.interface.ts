import { IPosts } from '@schemas'

export type OutputDetailPosts = IPosts

export interface InputUploadPosts {
  title: string
  content?: string
  image_url?: string
}
