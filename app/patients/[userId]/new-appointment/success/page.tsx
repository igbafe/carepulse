import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sucess = () => {
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-10 h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center justify-center gap-4">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment</span> has been
            successfully booked!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p>Request appointment details:</p>
          <div className="flex items-center gap-3">
          

          </div>
        </section>
      </div>
    </div>
  );
};

export default Sucess;
