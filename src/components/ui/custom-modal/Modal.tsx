"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  preventClose?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
}

export function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  preventClose = false,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Mount the component on client-side only
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle Escape key press
  useEffect(() => {
    if (!open || !closeOnEsc || preventClose) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose, closeOnEsc, preventClose])

  // Handle outside click
  useEffect(() => {
    if (!open || !closeOnOutsideClick || preventClose) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [open, onClose, closeOnOutsideClick, preventClose])

  // Handle body scroll lock
  useEffect(() => {
    if (!open) return

    // Save original styles
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Lock scroll on body
    document.body.style.overflow = "hidden"

    return () => {
      // Restore original styles when modal closes
      document.body.style.overflow = originalStyle
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open) return

    const modalElement = modalRef.current
    if (!modalElement) return

    // Find all focusable elements
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element
    firstElement.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // If shift + tab and on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // If tab and on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
    return () => {
      document.removeEventListener("keydown", handleTabKey)
    }
  }, [open])

  if (!mounted) return null

  if (!open) return null

  // Use portal to render outside the component hierarchy
  return createPortal(
    <div
      className={cn("fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4", overlayClassName)}
      role="dialog"
      aria-modal="true"
      ref={overlayRef}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative animate-in fade-in-0 zoom-in-95 duration-200",
          className,
        )}
      >
        {!preventClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100"
            tabIndex={0}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}

export const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 pt-6 pb-2 flex flex-col space-y-1.5", className)} {...props} />
  ),
)
ModalHeader.displayName = "ModalHeader"

export const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
ModalTitle.displayName = "ModalTitle"

export const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />,
)
ModalDescription.displayName = "ModalDescription"

export const ModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-6 py-4", className)} {...props} />,
)
ModalContent.displayName = "ModalContent"

export const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 bg-slate-50 border-t",
        className,
      )}
      {...props}
    />
  ),
)
ModalFooter.displayName = "ModalFooter"
