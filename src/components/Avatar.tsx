"use-client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarProps {
  src?: string | null | undefined;
}
const Avatar: React.FC<AvatarProps> = ({ src }) => {
  const [avatar, setAvatar] = useState<string>();
  useEffect(() => {
    if (src === undefined) {
      setAvatar("/images/placeholder.jpeg");
    } else {
      setAvatar(`/avatarIcons/${src}.jpg`);
    }
  }, [src]);
  return (
    <Image
      className="rounded-full"
      height="30"
      width="30"
      alt="Avatar"
      //@ts-ignore
      src={avatar}
    />
  );
};

export default Avatar;
