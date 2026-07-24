import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import {
  Accordion as AccordionPrimitive,
  AccordionItem as AccordionItemPrimitive,
  AccordionHeader as AccordionHeaderPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
  AccordionContent as AccordionContentPrimitive,
  type AccordionProps as AccordionPrimitiveProps,
  type AccordionItemProps as AccordionItemPrimitiveProps,
  type AccordionTriggerProps as AccordionTriggerPrimitiveProps,
  type AccordionContentProps as AccordionContentPrimitiveProps,
} from '../components/animate-ui/primitives/radix/accordion';
import { cn } from '../lib/utils';

type AccordionProps = AccordionPrimitiveProps;

function Accordion(props: AccordionProps) {
  return <AccordionPrimitive {...props} />;
}

type AccordionItemProps = AccordionItemPrimitiveProps;

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionItemPrimitive
      className={cn('border-b border-[#e6def7] bg-transparent last:border-b-0', className)}
      {...props}
    />
  );
}

type AccordionTriggerProps = AccordionTriggerPrimitiveProps & {
  showArrow?: boolean;
};

function AccordionTrigger({
  className,
  children,
  showArrow = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionHeaderPrimitive className="flex">
      <AccordionTriggerPrimitive
        className={cn(
          'group flex w-full flex-1 items-start justify-between gap-4 border-none bg-transparent p-0 py-5 text-left text-base font-semibold text-[#1c1230] transition-colors outline-none hover:text-[#4925B0] focus-visible:ring-2 focus-visible:ring-[#4925B0]/40 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:underline',
          className,
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <ChevronDown
            className="pointer-events-none size-5 shrink-0 translate-y-0.5 text-[#4925B0] transition-transform duration-300 group-data-[state=open]:rotate-180"
            strokeWidth={2.5}
          />
        )}
      </AccordionTriggerPrimitive>
    </AccordionHeaderPrimitive>
  );
}

type AccordionContentProps = AccordionContentPrimitiveProps;

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionContentPrimitive {...props}>
      <div className={cn('pt-0 pb-5 text-sm leading-relaxed text-[#5b5468]', className)}>
        {children}
      </div>
    </AccordionContentPrimitive>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
};