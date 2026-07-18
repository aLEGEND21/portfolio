import type { StaticImageData } from "next/image";

import alphanodeImage from "@/assets/projects/alphanode.webp";
import brainrotlangImage from "@/assets/projects/brainrotlang.webp";
import chatappImage from "@/assets/projects/chatapp.webp";
import cleetiverseImage from "@/assets/projects/cleetiverse.webp";
import disthreadImage from "@/assets/projects/disthread.webp";
import foodhubImage from "@/assets/projects/foodhub.webp";
import hirespaceImage from "@/assets/projects/hirespace.webp";
import profitgreenImage from "@/assets/projects/profitgreen.webp";
import publiusImage from "@/assets/projects/publius.webp";
import screenlinkImage from "@/assets/projects/screenlink.webp";
import sprinklImage from "@/assets/projects/sprinkl.webp";
import syntronImage from "@/assets/projects/syntron.webp";

export type Project = {
  id: string;
  name: string;
  description: string;
  image: StaticImageData;
  url: string;
  /** First tag should be one of the grid filter categories (WEB / AI / BOTS). */
  tags: string[];
  /** Demo clip for the grayscale→color hover mechanic; image is used as poster/fallback. */
  videoSrc?: string;
  featured?: {
    order: number;
    tier: "large" | "medium";
    /** Proof-point + proof-point + what-it-does. */
    oneLiner: string;
  };
};

export const projects: Project[] = [
  {
    id: "profitgreen",
    tags: ["AI", "FINTECH", "BOTS"],
    name: "ProfitGreen",
    description:
      "An investing app with over 7K users that provides real-time financial data for thousands of stocks and cryptos. Received an $8K acquisition offer within the first year.",
    image: profitgreenImage,
    url: "https://profitgreen.app",
    featured: {
      order: 1,
      tier: "large",
      oneLiner:
        "7K+ users. 1 acquisition offer. Financial data, powered by AI.",
    },
  },
  {
    id: "alphanode",
    tags: ["AI", "FINTECH", "WEB"],
    name: "AlphaNode",
    description:
      "A stateful multi-agent equity research engine that uses LangGraph to orchestrate a deterministic parallel architecture, generating institutional-grade financial reports in seconds.",
    image: alphanodeImage,
    url: "https://github.com/aLEGEND21/AlphaNode",
    videoSrc: "/videos/alphanode.mp4",
    featured: {
      order: 2,
      tier: "medium",
      oneLiner:
        "Institutional-grade equity research reports, generated in seconds.",
    },
  },
  {
    id: "syntron",
    tags: ["AI", "WEB"],
    name: "Syntron",
    description:
      "An agentic shopping search engine that turns natural-language queries into curated product results, powered by a LangGraph pipeline with real-time scraping.",
    image: syntronImage,
    url: "https://github.com/aLEGEND21/Syntron",
    videoSrc: "/videos/syntron.mp4",
    featured: {
      order: 3,
      tier: "medium",
      oneLiner:
        "Let your agent shop for you. Get curated results without lifting a finger.",
    },
  },
  {
    id: "sprinkl",
    tags: ["AI", "APP"],
    name: "Sprinkl",
    description:
      "Discover, search, and save recipes. Powered by AI-driven personalized recommendations (using scikit-learn and TF-IDF vectorization) and Google OAuth authentication.",
    image: sprinklImage,
    url: "https://github.com/aLEGEND21/Sprinkl",
    featured: {
      order: 4,
      tier: "medium",
      oneLiner:
        "Tinder for recipes. Swipe, save, and cook your way through 9K+ dishes.",
    },
  },
  {
    id: "screenlink",
    tags: ["WEB"],
    name: "ScreenLink",
    description:
      "A modern, zero-install screen sharing platform built with Next.js. Users can share their screens with peers instantly using just a link or code.",
    image: screenlinkImage,
    url: "https://github.com/aLEGEND21/screenlink",
  },
  {
    id: "disthread",
    tags: ["BOTS", "SOCIAL"],
    name: "Disthread",
    description:
      "A social media app with 600 users that integrates Threads into Discord, automatically streaming posts from users' favorite Threads accounts into their Discord servers. Hit 500 users in under 1 month.",
    image: disthreadImage,
    url: "https://disthread.arnavm.com",
  },
  {
    id: "brainrotlang",
    tags: ["WEB"],
    name: "Brainrot Lang",
    description:
      "An online editor for a custom programming language based on brainrot (internet slang). Compile and run code directly in the browser.",
    image: brainrotlangImage,
    url: "https://brainrot.arnavm.com",
  },
  {
    id: "publius",
    tags: ["WEB"],
    name: "Publius",
    description:
      "An open-source browser-based image rating app. It uses an Elo-rating system to properly rank large numbers of images based on user input, through 1v1 matchups.",
    image: publiusImage,
    url: "https://github.com/aLEGEND21/publius",
  },
  {
    id: "cleetiverse",
    tags: ["BOTS", "SOCIAL"],
    name: "Cleetiverse",
    description:
      "A commissioned project for a Discord bot that allows users to create, catch, breed, and battle custom creatures in a virtual world.",
    image: cleetiverseImage,
    url: "https://discord.com/oauth2/authorize?client_id=1038933964968173729&permissions=8&scope=applications.commands%20bot",
  },
  {
    id: "hirespace",
    tags: ["WEB", "SOCIAL"],
    name: "HireSpace",
    description:
      "A platform for high school students to easily find and apply to internships. Built for the Summer Research & Innovation Program at the North Carolina School of Science and Mathematics.",
    image: hirespaceImage,
    url: "https://hirespace.arnavm.com",
  },
  {
    id: "foodhub",
    tags: ["APP"],
    name: "FoodHub",
    description:
      "A modern food tracking application that helps you monitor your daily nutrition intake, track habits, and maintain a healthy lifestyle. Built with Next.js and MongoDB.",
    image: foodhubImage,
    url: "https://github.com/aLEGEND21/FoodHub",
  },
  {
    id: "chatapp",
    tags: ["WEB"],
    name: "Chat App",
    description:
      "A real-time chat application with infinite chat rooms allowing users to communicate with anyone, anywhere around the world.",
    image: chatappImage,
    url: "https://chat.arnavm.com",
  },
];

export const featuredProjects = projects
  .filter((p): p is Project & { featured: NonNullable<Project["featured"]> } =>
    Boolean(p.featured),
  )
  .sort((a, b) => a.featured.order - b.featured.order);
