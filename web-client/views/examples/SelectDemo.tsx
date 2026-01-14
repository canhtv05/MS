import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectArrow,
} from '@/components/animate-ui/components/radix/select';

export default function SelectDemo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-8 dark:bg-gray-950/50">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Premium Select</h1>
        <p className="mt-2 text-muted-foreground">
          Beautifully animated select components powered by Framer Motion.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Select */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <label className="mb-3 block text-sm font-semibold text-foreground/80">Framework</label>
          <Select>
            <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectArrow />
              <SelectGroup>
                <SelectLabel>Frameworks</SelectLabel>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Select with Groups */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <label className="mb-3 block text-sm font-semibold text-foreground/80">Email</label>
          <Select>
            <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select an email" />
            </SelectTrigger>
            <SelectContent>
              <SelectArrow />
              <SelectGroup>
                <SelectLabel>Personal</SelectLabel>
                <SelectItem value="personal1">john@example.com</SelectItem>
                <SelectItem value="personal2">jane@example.com</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Work</SelectLabel>
                <SelectItem value="work1">john@company.com</SelectItem>
                <SelectItem value="work2">jane@company.com</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Select with Default Value */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <label className="mb-3 block text-sm font-semibold text-foreground/80">Language</label>
          <Select defaultValue="en">
            <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectArrow />
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Select with Many Items (Scrollable) */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <label className="mb-3 block text-sm font-semibold text-foreground/80">Country</label>
          <Select>
            <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectArrow />
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                <SelectItem value="vn">Vietnam</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="kr">South Korea</SelectItem>
                <SelectItem value="th">Thailand</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Disabled Select */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <label className="mb-3 block text-sm font-semibold text-foreground/80">
            Disabled State
          </label>
          <Select disabled>
            <SelectTrigger className="w-full border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
