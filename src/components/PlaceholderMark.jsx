// Simple geometric mark shown when the business has no uploaded logo.
export default function PlaceholderMark({ color, size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="0" y="0" width="48" height="48" rx="6" fill={color} />
      <rect x="14" y="14" width="20" height="20" rx="2" fill="white" fillOpacity="0.85" />
    </svg>
  )
}
