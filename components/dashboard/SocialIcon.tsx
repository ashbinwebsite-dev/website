import { Camera, ThumbsUp, Music2, PlayCircle, MessageSquare } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: Camera, color: "#E4405F" },
  { value: "facebook", label: "Facebook", icon: ThumbsUp, color: "#1877F2" },
  { value: "tiktok", label: "TikTok", icon: Music2, color: "#000000" },
  { value: "youtube", label: "YouTube", icon: PlayCircle, color: "#FF0000" },
  { value: "twitter", label: "Twitter / X", icon: MessageSquare, color: "#000000" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

export function getPlatformInfo(platform: string) {
  return SOCIAL_PLATFORMS.find(
    (p) => p.value === platform.toLowerCase().trim(),
  );
}

export default function SocialIcon({
  platform,
  size = 16,
  colored = true,
}: {
  platform: string;
  size?: number;
  colored?: boolean;
}) {
  const info = getPlatformInfo(platform);
  if (!info) return null;
  const Icon = info.icon;
  return (
    <Icon
      size={size}
      style={colored ? { color: info.color } : undefined}
      className="shrink-0"
    />
  );
}
