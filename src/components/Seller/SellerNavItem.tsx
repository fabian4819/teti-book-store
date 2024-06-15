"use client"

import { NAV_INDEXES } from "@/config"
import { buttonVariants } from "../ui/button"
import Link from "next/link"

type NavIndex = typeof NAV_INDEXES[number]

const SellerNavItem = ({nav} : {nav: NavIndex}) => {
    return (
        <div className="flex">
            <div className="relative flex items-center">
                <Link 
                    href={nav.href} 
                    className={buttonVariants({
                        variant:'ghost'
                    })}>
                    {nav.label}
                </Link>
            </div> 
        </div>
    )
}

export default SellerNavItem