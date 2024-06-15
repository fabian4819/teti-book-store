"use client"

import { NAV_INDEXES } from "@/config"
import { useEffect, useRef, useState } from "react"
import SellerNavItem from "./SellerNavItem"

const SellerNavItems = () => {

    // const navRef = useRef<HTMLDivElement | null>(null)
    return ( 
        <div className="flex gap-4 h-full">
            {NAV_INDEXES.map((nav, i) => {
                return <SellerNavItem nav={nav} key={nav.value}/>
            })}
        </div>
    )
}

export default SellerNavItems