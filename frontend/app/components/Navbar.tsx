"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm sm:text-base">BC</span>
            </div>
            <span className="hidden sm:block text-base font-medium text-white">
              BeyondChats
            </span>
          </Link>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {session ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    size="sm"
                    name={session.user?.name || "User"}
                    className="cursor-pointer ring-1 ring-white/30 hover:ring-white/60 transition-all"
                    src={session.user?.image || undefined}
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="User menu"
                  className="bg-black/95 backdrop-blur-xl border border-white/10"
                >
                  <DropdownItem 
                    key="profile" 
                    className="h-14 gap-2"
                    textValue="Profile"
                  >
                    <p className="font-medium text-white">{session.user?.name}</p>
                    <p className="text-xs text-gray-400">{session.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="role"
                    startContent={<User className="w-4 h-4" />}
                    className="text-gray-300"
                    textValue="Role"
                  >
                    Role: {(session.user as any)?.role || "user"}
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<LogOut className="w-4 h-4" />}
                    onClick={() => signOut()}
                    className="text-red-400"
                    textValue="Sign Out"
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link href="/auth/signin">
                <Button 
                  className="btn bg-white text-black font-medium hover:bg-gray-200 text-sm"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
