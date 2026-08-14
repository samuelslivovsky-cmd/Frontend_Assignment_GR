import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // react-hook-form is not React Compiler compatible: the compiler memoizes `useForm()`'s
  // returned functions, which silently drops `setValue`/`reset` writes to uncontrolled inputs.
  reactCompiler: false,
}

export default nextConfig
