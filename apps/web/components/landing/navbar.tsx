"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Solutions", href: "#solutions" },
        { name: "Pricing", href: "#pricing" },
        { name: "About", href: "#about" },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 transition-all duration-300",
                scrolled ? "pt-4" : "pt-6"
            )}
        >
            <div className={cn(
                "flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300 w-full max-w-5xl",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-white/10 shadow-lg"
                    : "bg-transparent border-transparent"
            )}>
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-sm font-bold text-white">A</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight hidden sm:block">Aksara</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-4 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/agency/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/agency/sign-up">
                            <Button size="sm" className="rounded-full px-5 bg-white text-black hover:bg-zinc-200">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-zinc-300">
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/95 backdrop-blur-xl border-white/10">
                            <div className="flex flex-col gap-8 mt-8">
                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Link href="/agency/sign-in">
                                        <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white/10 bg-transparent">Sign In</Button>
                                    </Link>
                                    <Link href="/agency/sign-up">
                                        <Button className="w-full rounded-full bg-white text-black hover:bg-zinc-200">Get Started</Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.nav>
    );
}
