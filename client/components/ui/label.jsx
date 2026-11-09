'use client'

import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { classNames } from '@/lib/classNames'

const Label = forwardRef(function Label({ className, ...props }, ref) {
  return <LabelPrimitive.Root ref={ref} className={classNames('label', className)} {...props} />
})

export { Label }
