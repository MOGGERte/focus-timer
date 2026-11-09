'use client'

import { forwardRef } from 'react'
import { classNames } from '@/lib/classNames'

const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={classNames('input', className)}
      {...props}
    />
  )
})

export { Input }
