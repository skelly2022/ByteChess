"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div className="relative flex h-20 flex-col items-center pb-2">
      {/* <Image
        onClick={() => router.push("/")}
        alt="Logo"
        className="cursor-pointer md:block"
        height={80}
        width={80}
        src="/images/bytechess3.png"
      /> */}
      {/* <h1 className="pt-2 font-mono text-white">CHESSDAO</h1> */}

      <svg
        width="80"
        onClick={() => router.push("/")}
        className="cursor-pointer"
        height="80"
        viewBox="0 0 493 317"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M431.08 230.95L247.491 300.398L238.991 277.928L267.039 248.054L381.782 204.649L422.58 208.48L431.08 230.95Z"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M228.789 146.939L343.533 103.534"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M307.618 117.12L376.045 206.819L272.776 245.884L264.704 133.353"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M254.286 40.9734C228.938 50.5623 216 78.4558 225.389 103.275C231.789 120.195 246.914 131.319 263.924 133.648L308.398 116.824C319.608 103.82 323.584 85.4714 317.183 68.5515C307.795 43.7318 279.635 31.3846 254.286 40.9734Z"
          stroke="black"
          stroke-width="27.8175"
        />
        <path
          d="M478.746 224.702L263.747 294.149L255.247 271.679L283.295 241.805L398.039 198.4L438.837 202.231L478.746 224.702Z"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M245.046 140.689L359.789 97.2844"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M323.874 110.87L392.302 200.57L289.033 239.634L280.96 127.104"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M270.543 34.7242C245.194 44.313 232.256 72.2065 241.645 97.0262C248.046 113.946 263.17 125.07 280.18 127.399L324.655 110.575C335.865 97.5711 339.84 79.2221 333.44 62.3022C324.051 37.4825 295.891 25.1353 270.543 34.7242Z"
          stroke="#FFDC26"
          stroke-width="27.8175"
        />
        <path
          d="M236.54 302.985H14V275.167L55.7263 254.304H194.814L236.54 275.167V302.985Z"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M55.7263 129.125H194.814"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M151.279 129.125L187.859 254.304H62.6806L99.2607 129.125"
          stroke="black"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M125.27 24.8098C94.5435 24.8098 69.635 49.7185 69.635 80.4448C69.635 101.391 81.2113 119.635 98.3149 129.126H152.225C169.329 119.635 180.905 101.391 180.905 80.4448C180.905 49.7185 155.997 24.8098 125.27 24.8098Z"
          stroke="black"
          stroke-width="27.8175"
        />
        <path
          d="M256.286 302.877H33.7455V275.059L75.4718 254.196H214.559L256.286 275.059V302.877Z"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M75.4718 129.017H214.559"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M171.025 129.017L207.605 254.196H82.4261L119.006 129.017"
          stroke="#FFDC26"
          stroke-width="27.8175"
          stroke-miterlimit="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M145.016 24.7017C114.289 24.7017 89.3805 49.6103 89.3805 80.3367C89.3805 101.283 100.957 119.527 118.06 129.017H171.971C189.074 119.527 200.651 101.283 200.651 80.3367C200.651 49.6103 175.742 24.7017 145.016 24.7017Z"
          stroke="#FFDC26"
          stroke-width="27.8175"
        />
      </svg>
    </div>
  );
};

export default Logo;
