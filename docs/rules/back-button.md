# Back Navigation Standard

To maintain brand consistency and a premium user experience, all back navigation in the Leli Rentals app must follow these rules:

1. **Use the BackButton Component**: Never use raw `Button` components with `lucide-react` arrows for back navigation. Always import and use the `BackButton` from `@/components/ui/back-button`.
2. **Iconography**: The `BackButton` component uses the custom `LeliBackIcon` which is unique to this application. Do not override this icon unless explicitly required for a very specific design exception.
3. **Behavior**: 
   - By default, `BackButton` uses `router.back()`.
   - If a specific destination is required, use the `href` prop: `<BackButton href="/dashboard" />`.
4. **Labeling**: Use the `label` prop for clarity, especially in complex headers. Default is "Back".

### Example
```tsx
import { BackButton } from "@/components/ui/back-button"

export function MyComponent() {
  return (
    <div>
      <BackButton label="Return to Listings" />
      {/* ... content ... */}
    </div>
  )
}
```
