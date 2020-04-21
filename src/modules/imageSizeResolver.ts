import sizeOf from 'image-size'

export default function (path: string): { width: number; height: number } {
  return sizeOf(path)
}
