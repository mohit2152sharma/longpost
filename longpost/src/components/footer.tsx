"use client";
import React from "react";
import { GithubIcon } from "lucide-react";
import BskyLogo from "./bsky-logo";

const Footer = () => {
  return (
    <div className="flex justify-center items-centertext-black mb-2 mt-2">
      <div className="flex items-center px-4 py-0">
        <a
          href="https://bsky.app/profile/montepy.in"
          target="_blank"
          rel="noopener noreferrer"
        >
        <BskyLogo width={30} height={30} />
        </a>
      </div>
      <div className="flex items-center px-4 py-0">
        <a
          href="https://github.com/mohit2152sharma/bsky-projects"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon width={30} height={30} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
