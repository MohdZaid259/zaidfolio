import { motion, type MotionProps } from 'framer-motion'

type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>
type MotionPProps = MotionProps & React.HTMLAttributes<HTMLParagraphElement>
type MotionAProps = MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
type MotionSpanProps = MotionProps & React.HTMLAttributes<HTMLSpanElement>

export const MotionDiv = motion.div as React.FC<MotionDivProps>
export const MotionP = motion.p as React.FC<MotionPProps>
export const MotionA = motion.a as React.FC<MotionAProps>
export const MotionSpan = motion.span as React.FC<MotionSpanProps>
