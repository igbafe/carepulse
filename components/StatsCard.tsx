import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface StatCardProps {
  type: "appointments" | "cancelled" | "pending";
  count: number;
  label: string;
  icon: string;
}

const StatsCard = ({ count = 0, label, type, icon }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-cancelled": type === "cancelled",
        "bg-pending": type === "pending",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={label}
          width={24}
          height={24}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white ">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatsCard;
