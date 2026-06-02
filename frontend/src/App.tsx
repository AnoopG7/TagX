import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import ShowcasePage from '@/pages/ShowcasePage'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          {name}
        </h1>
        <p className="text-muted-foreground">Coming in Phase 4</p>
        <div className="mt-6 w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary radar-ping" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <>
      <Routes>
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/products" element={<Placeholder name="Products" />} />
        <Route path="/products/:slug" element={<Placeholder name="Product Detail" />} />
        <Route path="/cart" element={<Placeholder name="Cart" />} />
        <Route path="/checkout" element={<Placeholder name="Checkout" />} />
        <Route path="/login" element={<Placeholder name="Login" />} />
        <Route path="/signup" element={<Placeholder name="Sign Up" />} />
        <Route path="/forgot-password" element={<Placeholder name="Forgot Password" />} />
        <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/contact" element={<Placeholder name="Contact" />} />
        <Route path="*" element={<Placeholder name="404 — Lost Signal" />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            fontFamily: 'General Sans, sans-serif',
          },
        }}
      />
    </>
  )
}
