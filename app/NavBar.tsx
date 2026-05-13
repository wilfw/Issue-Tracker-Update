"use client";

import { Skeleton } from "@/app/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { Avatar, Box, Container, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '38px', height: '22px',
        borderRadius: '99px',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
        background: isDark ? 'rgba(108,99,255,0.2)' : '#e0e0e0',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {/* Sliding knob */}
      <span style={{
        position: 'absolute',
        top: '2px',
        left: isDark ? '18px' : '2px',
        width: '16px', height: '16px',
        borderRadius: '50%',
        background: isDark ? '#6c63ff' : '#ffffff',
        boxShadow: isDark ? '0 0 6px rgba(108,99,255,0.6)' : '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.25s ease, background 0.25s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '9px',
      }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

const NavBar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav style={{
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
      marginBottom: '0', padding: '0 20px',
    }}>
      <Container>
        <Flex justify="between" align="center" style={{ height: '60px' }}>
          <Flex align="center" gap="5">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '17px',
                boxShadow: '0 4px 12px rgba(108,99,255,0.4)',
              }}>
                <AiFillBug />
              </div>
              <span style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1.05rem',
                color: isDark ? '#f0f2f8' : '#0f0f14',
                letterSpacing: '-0.03em',
              }}>
                IssueTrack
              </span>
            </Link>
            <NavLinks />
          </Flex>
          <Flex align="center" gap="3">
            <ThemeToggle />
            <AuthStatus />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];
  return (
    <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
      {links.map((link) => {
        const active = link.href === currentPath;
        return (
          <li key={link.href}>
            <Link href={link.href} style={{
              padding: '6px 13px', borderRadius: '8px',
              fontWeight: 500, fontSize: '0.875rem',
              textDecoration: 'none', display: 'block',
              transition: 'all 0.15s',
              background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: active ? '#6c63ff' : (isDark ? '#8b93a7' : '#555e72'),
              border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
            }}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Link href="/api/auth/signin" className="new-issue-btn" style={{ boxShadow: 'none' }}>
        Sign in
      </Link>
    );
  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar
            src={session!.user!.image!}
            fallback={session!.user!.name?.[0] ?? '?'}
            size="2" radius="full"
            style={{ cursor: 'pointer', border: '2px solid rgba(108,99,255,0.4)' }}
            referrerPolicy="no-referrer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label><Text size="2">{session!.user!.email}</Text></DropdownMenu.Label>
          <DropdownMenu.Item><Link href="/api/auth/signout">Log out</Link></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

export default NavBar;
