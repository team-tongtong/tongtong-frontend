import type { ComponentPropsWithoutRef } from 'react'

type PrimaryButtonProps = Pick<
  ComponentPropsWithoutRef<'button'>,
  'disabled' | 'onClick' | 'type'
> & {
  children: string
}

export function PrimaryButton({
  children,
  type = 'button',
  ...props
}: PrimaryButtonProps) {
  return (
    <button type={type} className="tt-button-primary" {...props}>
      {children}
    </button>
  )
}
