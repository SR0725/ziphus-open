"use client";

import { FaDiscord } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import Link from "next/link";
import ZiphusIcon from "./ziphus-icon";

const LINKS = [
  {
    title: "Product",
    items: [
      {
        text: "Home",
        href: "/",
      },
      {
        text: "Start Use",
        href: "/spaces",
      },
      {
        text: "Pricing",
        href: "/pricing",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        text: "Privacy Policy",
        href: "/privacy",
      },
      {
        text: "Terms of Service",
        href: "/terms",
      },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        text: "Threads",
        href: "https://www.threads.net/@ray.realms",
      },
      {
        text: "Discord",
        href: "https://discord.gg/sDcyDYjr",
      },
      {
        text: "Email",
        href: "mailto:ray948787@gmail.com",
      },
      {
        text: "Contact Support",
        href: "https://discord.gg/sDcyDYjr",
      },
    ],
  },
];

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className=" bottom-0 w-full border-t pt-12 text-white">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div className="mb-6 flex h-8 items-center gap-4">
            <span className="size-8">
              <ZiphusIcon />
            </span>
            <Link href="/">
              <p className="trxt-lg hidden font-bold text-inherit text-white sm:block">
                Ziphus
              </p>
            </Link>
          </div>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <p className="mb-3 font-medium opacity-40">{title}</p>
                {items.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-gray-200"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="border-blue-gray-50 mt-12 flex w-full flex-col items-center justify-center border-t py-4 md:flex-row md:justify-between">
          <p className="mb-4 text-center font-normal text-gray-200 md:mb-0">
            &copy; {currentYear} <a href="https://ziphus.app/">Ziphus</a>. All
            Rights Reserved.
          </p>
          <div className="flex gap-4 text-gray-200 sm:justify-center">
            <Link
              href="https://discord.gg/sDcyDYjr"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaDiscord />
            </Link>
            <Link
              href="mailto:ray948787@gmail.com"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <IoMail />
              ray948787@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
