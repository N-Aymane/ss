// Simple toast notification system for admin panel

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

class ToastManager {
  private toasts: Toast[] = []
  private listeners: ((toasts: Toast[]) => void)[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  show(type: Toast['type'], message: string, duration = 5000) {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, type, message, duration }
    
    this.toasts.push(toast)
    this.notify()

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  success(message: string, duration?: number) {
    return this.show('success', message, duration)
  }

  error(message: string, duration?: number) {
    return this.show('error', message, duration)
  }

  info(message: string, duration?: number) {
    return this.show('info', message, duration)
  }
}

export const toast = new ToastManager()
