'use client'

import { forwardRef } from 'react'
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import { classNames } from '@/lib/classNames'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = forwardRef(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={classNames('select__trigger', className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretSortIcon className="icon icon--sm select__caret" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

const SelectScrollUpButton = forwardRef(function SelectScrollUpButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={classNames('select__scroll', className)}
      {...props}
    >
      <ChevronUpIcon className="icon icon--sm" />
    </SelectPrimitive.ScrollUpButton>
  )
})

const SelectScrollDownButton = forwardRef(function SelectScrollDownButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={classNames('select__scroll', className)}
      {...props}
    >
      <ChevronDownIcon className="icon icon--sm" />
    </SelectPrimitive.ScrollDownButton>
  )
})

const SelectContent = forwardRef(function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={classNames('select__content', className)}
        position={position}
        sideOffset={4}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="select__viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})

const SelectLabel = forwardRef(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={classNames('select__label', className)}
      {...props}
    />
  )
})

const SelectItem = forwardRef(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={classNames('select__item', className)}
      {...props}
    >
      <span className="select__indicator">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="icon icon--sm" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})

const SelectSeparator = forwardRef(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={classNames('select__separator', className)}
      {...props}
    />
  )
})

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
