
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
    className,
    containerClassName,
    animate = true,
}: {
    className?: string;
    containerClassName?: string;
    animate?: boolean;
}) => {
    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden", containerClassName)}>
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl",
                    className
                )}
            />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>
    );
};
