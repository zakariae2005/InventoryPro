// components/ui/use-toast.ts
import { useState, useCallback } from 'react'

type ToastProps = {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback((props: ToastProps) => {
    // Simple console log implementation
    // You can replace this with a proper toast library like react-hot-toast or sonner
    console.log('Toast:', props)
    
    // For now, just show an alert for destructive toasts
    if (props.variant === 'destructive') {
      alert(`Error: ${props.description || props.title}`)
    } else {
      // You could show a success message here
      console.log(`Success: ${props.description || props.title}`)
    }
  }, [])

  return { toast, toasts }
}