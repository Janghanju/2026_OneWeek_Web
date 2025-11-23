'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
    children: ReactNode;
    index: number;
    className?: string;
}

export const MotionCard = ({ children, index, className = "" }: MotionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`h-full ${className}`}
        >
            {children}
        </motion.div>
    );
};
