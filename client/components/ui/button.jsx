'use client'

import { forwardRef } from 'react'
import { classNames } from '@/lib/classNames'

const Button = forwardRef(function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={classNames('btn', `btn--${variant}`, `btn--${size}`, className)}
      {...props}
    />
  )
})

export { Button }
