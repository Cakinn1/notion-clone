"use client";

import Image from "next/image";

export default function DocumentsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image src="/empty.png" height={300} width={300} alt="Empty" className="dark:hidden" />
    </div>
  );
}
