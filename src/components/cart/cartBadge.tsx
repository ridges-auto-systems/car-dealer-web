// components/cart/cartBadge.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../lib/contexts/cartContext";

interface CartBadgeProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

const CartBadge: React.FC<CartBadgeProps> = ({
  className = "",
  showText = true,
  onClick,
}) => {
  const { cartCount } = useCart();

  if (cartCount === 0) {
    return null;
  }

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Link
      href="/cart/checkout"
      onClick={handleClick}
      className={`relative flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {showText && <span className="hidden sm:inline">Cart</span>}
      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {cartCount}
      </span>
    </Link>
  );
};

export default CartBadge;
