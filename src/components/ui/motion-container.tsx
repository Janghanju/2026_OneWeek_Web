'use client';
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionContainerProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
}

export const MotionContainer = ({ children, className = "", delay = 0, ...props }: MotionContainerProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: 0.1
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};
