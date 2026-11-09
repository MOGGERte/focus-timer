'use client'

import { forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { classNames } from '@/lib/classNames'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = forwardRef(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={classNames('dialog__overlay', className)}
      {...props}
    />
  )
})

const DialogContent = forwardRef(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={classNames('dialog__content', className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="dialog__close" aria-label="Close">
          <Cross2Icon className="icon icon--sm" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})

function DialogHeader({ className, ...props }) {
  return <div className={classNames('dialog__header', className)} {...props} />
}

function DialogFooter({ className, ...props }) {
  return <div className={classNames('dialog__footer', className)} {...props} />
}

const DialogTitle = forwardRef(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={classNames('dialog__title', className)}
      {...props}
    />
  )
})

const DialogDescription = forwardRef(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={classNames('dialog__description', className)}
      {...props}
    />
  )
})

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
